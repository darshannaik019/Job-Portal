import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';

import connectDB from './config/db.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import logger from './utils/logger.js';

import { Server } from 'socket.io';
import Message from './models/Message.js';

// Route imports
import userRoutes from './routes/userRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());
app.use(cookieParser());

// Set security headers
app.use(helmet());

// Enable CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 10 minutes',
  },
});
app.use('/api/', limiter);

// Mount routers
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/messages', messageRoutes);

// Root route
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running healthy' });
});

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Socket.io Server Setup
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  }
});

const onlineUsers = new Map();

io.on('connection', (socket) => {
  logger.info(`Socket connected: ${socket.id}`);

  socket.on('setup', (userId) => {
    socket.join(userId);
    onlineUsers.set(userId, socket.id);
    socket.emit('connected');
    logger.info(`User ${userId} registered socket`);
  });

  socket.on('join_chat', (room) => {
    socket.join(room);
    logger.info(`User joined room: ${room}`);
  });

  socket.on('new_message', async (messageData) => {
    const { sender, recipient, content } = messageData;
    if (!sender || !recipient || !content) return;

    try {
      const message = await Message.create({
        sender,
        recipient,
        content
      });

      const populatedMessage = await Message.findById(message._id)
        .populate('sender', 'name email profilePhoto')
        .populate('recipient', 'name email profilePhoto');

      socket.in(recipient).emit('message_received', populatedMessage);
      socket.emit('message_sent', populatedMessage);
      logger.info(`Message relayed from ${sender} to ${recipient}`);
    } catch (err) {
      logger.error(`Socket message error: ${err.message}`);
    }
  });

  socket.on('disconnect', () => {
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        logger.info(`User ${userId} disconnected socket`);
        break;
      }
    }
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  logger.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

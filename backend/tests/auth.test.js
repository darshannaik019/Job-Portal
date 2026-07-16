import request from 'supertest';
import mongoose from 'mongoose';
import express from 'express';
import cookieParser from 'cookie-parser';
import userRoutes from '../routes/userRoutes.js';
import User from '../models/User.js';
import { errorHandler } from '../middleware/errorMiddleware.js';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/users', userRoutes);
app.use(errorHandler);

beforeAll(async () => {
  // Set test environment secret key
  process.env.JWT_SECRET = 'test_secret_key_12345';
  process.env.JWT_EXPIRE = '1d';
  
  const url = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/job-portal-test';
  await mongoose.connect(url);
});

afterAll(async () => {
  try {
    await User.deleteMany({});
    await mongoose.connection.close();
  } catch (err) {
    console.error('Teardown error:', err);
  }
});

describe('Auth API Unit Tests', () => {
  const testUser = {
    name: 'Unit Test User',
    email: 'unit-test@example.com',
    password: 'password123',
    role: 'user',
    phone: '1234567890'
  };

  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send(testUser);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('email', testUser.email);
  });

  it('should not register an existing user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send(testUser);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('success', false);
  });

  it('should login a registered user', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('token');
  });

  it('should reject login with wrong password', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: testUser.email,
        password: 'wrong_password_here'
      });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('success', false);
  });

  it('should clear cookies on logout', async () => {
    const res = await request(app)
      .post('/api/users/logout');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success', true);
  });
});

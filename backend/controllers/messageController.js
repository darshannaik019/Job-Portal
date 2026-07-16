import Message from '../models/Message.js';
import User from '../models/User.js';

/**
 * Get all conversations for the logged in user
 */
export const getConversations = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Find all messages involving the current user
    const messages = await Message.find({
      $or: [{ sender: userId }, { recipient: userId }]
    })
    .sort({ createdAt: -1 })
    .populate('sender', 'name email profilePhoto role')
    .populate('recipient', 'name email profilePhoto role');

    // Aggregate to find unique other users and their last message
    const conversationsMap = new Map();
    
    messages.forEach(msg => {
      const otherUser = msg.sender._id.toString() === userId.toString() ? msg.recipient : msg.sender;
      const otherUserId = otherUser._id.toString();
      
      if (!conversationsMap.has(otherUserId)) {
        conversationsMap.set(otherUserId, {
          user: otherUser,
          lastMessage: msg.content,
          lastMessageTime: msg.createdAt,
          unread: !msg.read && msg.recipient._id.toString() === userId.toString()
        });
      }
    });

    const conversations = Array.from(conversationsMap.values());
    res.status(200).json({ success: true, conversations });
  } catch (error) {
    next(error);
  }
};

/**
 * Get chat message history between current user and target user
 */
export const getMessageHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { otherUserId } = req.params;

    // Mark messages from other user to current user as read
    await Message.updateMany(
      { sender: otherUserId, recipient: userId, read: false },
      { $set: { read: true } }
    );

    const messages = await Message.find({
      $or: [
        { sender: userId, recipient: otherUserId },
        { sender: otherUserId, recipient: userId }
      ]
    })
    .sort({ createdAt: 1 })
    .populate('sender', 'name email profilePhoto')
    .populate('recipient', 'name email profilePhoto');

    res.status(200).json({ success: true, messages });
  } catch (error) {
    next(error);
  }
};

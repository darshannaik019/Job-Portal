import User from '../models/User.js';
import { verifyAccessToken } from '../utils/token.js';
import logger from '../utils/logger.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = verifyAccessToken(token);

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
      }
      next();
    } catch (error) {
      logger.error(`Token authentication error: ${error.message}`);
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: 'Access token expired', code: 'TOKEN_EXPIRED' });
      }
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

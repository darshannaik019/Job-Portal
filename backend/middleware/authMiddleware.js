import User from '../models/User.js';
import { clerkClient } from '@clerk/express';
import logger from '../utils/logger.js';

export const protect = async (req, res, next) => {
  try {
    const { userId } = req.auth || {};

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token or invalid session' });
    }

    let user = await User.findOne({ clerkId: userId }).select('-password');

    if (!user) {
      // Sync on demand
      try {
        const clerkUser = await clerkClient.users.getUser(userId);
        const email = clerkUser.emailAddresses[0]?.emailAddress;
        const name = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Clerk User';
        const phone = clerkUser.phoneNumbers[0]?.phoneNumber || '';
        
        // Check X-Pending-Role header
        const pendingRole = req.headers['x-pending-role'] || req.query.role;
        const assignedRole = (pendingRole === 'admin' || pendingRole === 'user') ? pendingRole : 'user';

        // Check if there is an existing user with the same email
        user = await User.findOne({ email }).select('-password');
        if (user) {
          user.clerkId = userId;
          if (!user.name) user.name = name;
          if (!user.phone) user.phone = phone;
          if (pendingRole) user.role = assignedRole;
          await user.save();
          logger.info(`Synced existing user ${email} with Clerk ID ${userId}`);
        } else {
          // Create new user in our DB
          user = await User.create({
            clerkId: userId,
            name,
            email,
            role: assignedRole,
            phone,
          });
          logger.info(`Created new user in MongoDB: ${email} with role ${assignedRole}`);
        }
      } catch (clerkError) {
        logger.error(`Clerk user synchronization failed: ${clerkError.message}`);
        return res.status(401).json({ success: false, message: 'Authorization sync failed' });
      }
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error(`Authentication middleware error: ${error.message}`);
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};

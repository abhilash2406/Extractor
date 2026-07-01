import { UserType } from '../common/enum/usertype-enum.js';

/**
 * Middleware to authorize admin access.
 * Must be used after the auth middleware.
 */
export default (req, res, next) => {
  if (req.user && req.user.role === UserType.ADMIN) {
    return next();
  }
  
  return res.status(403).json({
    success: false,
    message: 'Forbidden: Admin access required',
  });
};

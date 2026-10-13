import jwt from 'jsonwebtoken';
import users from '../models/user.js';
import { getAudience, cookieNamesFor } from '../utils/cookies.js';

/**
 * Optional authentication middleware.
 * If a valid JWT token is present (via cookies or Authorization header),
 * attaches `req.user` with role and user info.
 * If no token or invalid, simply proceeds without failing.
 */
export default async (req, res, next) => {
  try {
    const audience = getAudience(req);
    const names = cookieNamesFor(audience);

    let cookieToken = req.cookies?.[names.access];
    if (!cookieToken) {
      if (audience === 'admin') {
        cookieToken = req.cookies?.admin_access_token;
      } else {
        cookieToken = req.cookies?.user_access_token || req.cookies?.access_token;
      }
    }

    const authHeader = req.header('Authorization');
    const headerToken = authHeader ? authHeader.replace('Bearer ', '') : null;
    const token = cookieToken || headerToken;

    if (!token || token === 'undefined' || token === 'null') {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || decoded.exp < Date.now() / 1000) {
      return next();
    }

    const user = await users.findOne({ where: { id: decoded.id } });
    if (!user) {
      return next();
    }

    req.user = decoded;
    req.user.role = user.role;
    req.user.status = user.status;
    return next();
  } catch (err) {
    // If token verification fails, continue as unauthenticated guest
    return next();
  }
};

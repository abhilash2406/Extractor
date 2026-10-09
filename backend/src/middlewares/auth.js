import { logger } from '../config/winston-config.js';
import jwt from 'jsonwebtoken';
import users from '../models/user.js';
import { EntityType } from '../common/enum/activity-enum.js';
import { getAudience, cookieNamesFor, clearAuthCookies } from '../utils/cookies.js';

/**
 * Global authentication middleware.
 * Verifies JWT tokens present in HTTP-only cookies or 'Authorization' header.
 * Automatically selects audience-specific cookies (user vs admin) to prevent localhost session collisions.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
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
      return res.status(401).send({
        success: false,
        message: 'Unauthorized Access',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).send({
        success: false,
        message: 'Invalid token',
      });
    }
    if (decoded.exp < Date.now() / 1000) {
      return res.status(401).send({
        success: false,
        message: 'Token expired',
      });
    }
    const user = await users.findOne({ where: { id: decoded.id } });
    if (!user) {
      return res.status(401).send({
        success: false,
        message: 'Access Denied',
      });
    }
    let matchValidity = user.password
      .concat(user.id)
      .concat(user.email);
    if (matchValidity != decoded.validity) {
      return res.status(401).send({
        success: false,
        message: 'Access Denied',
      });
    }

    // Check user account status
    if (user.status === EntityType.BLOCKED) {
      clearAuthCookies(res, audience);
      return res.status(403).send({
        success: false,
        isBlocked: true,
        message: 'Your account has been blocked. Please contact support.',
      });
    }

    if (user.status !== EntityType.ACTIVE) {
      clearAuthCookies(res, audience);
      return res.status(403).send({
        success: false,
        message: 'Your account is not active. Please contact support.',
      });
    }

    // If accessing admin portal audience, enforce admin role
    if (audience === 'admin' && user.role !== 'ADMIN') {
      return res.status(403).send({
        success: false,
        message: 'Forbidden: Admin access required',
      });
    }

    req.user = decoded;
    req.user.role = user.role;
    req.user.status = user.status;
    return next();
  } catch (ex) {
    console.error('TOKEN VERIFICATION ERROR:', ex);
    logger.info('error', ex);
    res.status(401).send({
      success: false,
      message: 'Invalid Token',
    });
  }
};


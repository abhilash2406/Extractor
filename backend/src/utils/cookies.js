/**
 * Determines client audience ('admin' or 'user') from request headers, body, or origin.
 * @param {import('express').Request} req - The Express request object.
 * @returns {'admin' | 'user'}
 */
export const getAudience = (req) => {
  if (!req) return 'user';
  const portalHeader = (
    req.headers?.['x-portal'] ||
    req.headers?.['x-app-portal'] ||
    req.headers?.['x-portal-type'] ||
    ''
  )
    .toString()
    .trim()
    .toLowerCase();

  if (portalHeader === 'admin') return 'admin';
  if (portalHeader === 'user') return 'user';

  if (req.body?.portal === 'admin' || req.query?.portal === 'admin') return 'admin';
  if (req.body?.portal === 'user' || req.query?.portal === 'user') return 'user';

  const origin = (req.headers?.origin || req.headers?.referer || '').toString().toLowerCase();
  if (origin.includes(':5174') || origin.includes('/admin') || origin.includes('admin.')) {
    return 'admin';
  }

  return 'user';
};

export const cookieNamesFor = (audience) => {
  const isAdmin = audience === 'admin';
  return {
    access: isAdmin ? 'admin_access_token' : 'user_access_token',
    refresh: isAdmin ? 'admin_refresh_token' : 'user_refresh_token',
  };
};

const baseCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.COOKIE_SAME_SITE || 'lax',
  domain: process.env.COOKIE_DOMAIN || undefined,
  path: '/',
});

/**
 * Sets HTTP-only authentication cookies on the response.
 * @param {import('express').Response} res - The Express response object.
 * @param {string} audience - The target audience (e.g., 'user', 'admin').
 * @param {Object} payload - The token payload.
 * @param {string} payload.accessToken - The generated access token.
 * @param {string} payload.refreshToken - The generated refresh token.
 * @param {number} payload.accessTtlMs - Max age for access token in milliseconds.
 * @param {number} payload.refreshTtlMs - Max age for refresh token in milliseconds.
 */
export const setAuthCookies = (res, audience, payload) => {
  const names = cookieNamesFor(audience);
  const base = baseCookieOptions();

  res.cookie(names.access, payload.accessToken, { ...base, maxAge: payload.accessTtlMs });
  res.cookie(names.refresh, payload.refreshToken, { ...base, maxAge: payload.refreshTtlMs });
};

/**
 * Clears the authentication cookies.
 * @param {import('express').Response} res - The Express response object.
 * @param {string} audience - The target audience mapping to the cookies.
 */
export const clearAuthCookies = (res, audience) => {
  const names = cookieNamesFor(audience);
  const base = baseCookieOptions();
  res.clearCookie(names.access, base);
  res.clearCookie(names.refresh, base);

  // Clear legacy cookie names if applicable
  if (audience === 'user') {
    res.clearCookie('access_token', base);
    res.clearCookie('refresh_token', base);
  }
};


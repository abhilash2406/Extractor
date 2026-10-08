import crypto from 'crypto';

/**
 * Generates a cryptographically secure numeric OTP of the specified length.
 * @param {number} [length=6] - The length of the OTP (default: 6).
 * @returns {string} The generated numeric OTP code as a string.
 */
export const generateOtp = (length = 6) => {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return crypto.randomInt(min, max + 1).toString();
};

export default generateOtp;

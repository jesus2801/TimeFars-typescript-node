import rateLimit from 'express-rate-limit';
import Errors from '../assets/errors';

export const LoginSignupRateLimiter = rateLimit({
  windowMs: 1000 * 60 * 5,
  max: 10,
  message: Errors.manyConnections,
  headers: true,
  statusCode: 429,
});

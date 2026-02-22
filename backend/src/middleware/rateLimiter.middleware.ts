import rateLimit from "express-rate-limit";

/**
 * Rate limiter for authentication endpoints (login, register)
 * Prevents brute force attacks and account enumeration
 * 5 attempts per 15 minutes per IP
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per windowMs
  message: "Too many authentication attempts, please try again later",
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  skip: () => false,
});

/**
 * Rate limiter for general API endpoints
 * 100 requests per 15 minutes per IP
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per windowMs
  message: "Too many requests, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Strict rate limiter for sensitive operations (password reset, etc.)
 * 3 attempts per 1 hour per IP
 */
export const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 requests per windowMs
  message: "Too many attempts for this operation, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});
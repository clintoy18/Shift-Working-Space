import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { getRedisClient } from "../config/redis";

/**
 * Create a rate limiter with Redis store if available, otherwise use memory store
 */
const createLimiter = (options: {
  windowMs: number;
  max: number;
  message: string;
  keyPrefix: string;
}) => {
  const redisClient = getRedisClient();
  const baseConfig = {
    windowMs: options.windowMs,
    max: options.max,
    message: options.message,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: any, res: any) => {
      res.status(429).json({
        message: options.message,
      });
    },
  };

  // If Redis is available, use Redis store
  if (redisClient && redisClient.isOpen) {
    return rateLimit({
      ...baseConfig,
      store: new RedisStore({
        sendCommand: async (...args: any[]) => {
          return await (redisClient as any).sendCommand(args);
        },
        prefix: options.keyPrefix,
      }),
    });
  }

  // Fallback to memory store
  return rateLimit(baseConfig);
};

/**
 * Rate limiter for authentication endpoints (login, register)
 * Prevents brute force attacks and account enumeration
 * 5 attempts per 15 minutes per IP
 */
export const authLimiter = createLimiter({
  windowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS || "900000"),
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX || "5"),
  message: "Too many authentication attempts, please try again later",
  keyPrefix: "rl:auth:",
});

/**
 * Rate limiter for general API endpoints
 * 100 requests per 15 minutes per IP
 */
export const apiLimiter = createLimiter({
  windowMs: parseInt(process.env.API_RATE_LIMIT_WINDOW_MS || "900000"),
  max: parseInt(process.env.API_RATE_LIMIT_MAX || "100"),
  message: "Too many requests, please try again later",
  keyPrefix: "rl:api:",
});

/**
 * STRICT rate limiter for public seat endpoints
 * Prevents scraping of seat data
 * 5 requests per 15 minutes per IP
 */
export const seatLimiter = createLimiter({
  windowMs: parseInt(process.env.SEAT_RATE_LIMIT_WINDOW_MS || "900000"),
  max: parseInt(process.env.SEAT_RATE_LIMIT_MAX || "5"),
  message: "Too many seat requests, please try again later",
  keyPrefix: "rl:seat:",
});

/**
 * Strict rate limiter for sensitive operations (password reset, etc.)
 * 3 attempts per 1 hour per IP
 */
export const strictLimiter = createLimiter({
  windowMs: parseInt(process.env.STRICT_RATE_LIMIT_WINDOW_MS || "3600000"),
  max: parseInt(process.env.STRICT_RATE_LIMIT_MAX || "3"),
  message: "Too many attempts for this operation, please try again later",
  keyPrefix: "rl:strict:",
});

import { createClient, RedisClientType } from "redis";

let redisClient: RedisClientType | null = null;

/**
 * Initialize and return Redis client
 * Supports both local development and production Redis instances
 * Falls back gracefully if Redis is unavailable
 */
export const initializeRedis = async (): Promise<RedisClientType | null> => {
  // Check if Redis is enabled via environment variable
  const redisEnabled = process.env.REDIS_ENABLED !== "false";

  if (!redisEnabled) {
    return null;
  }

  try {
    const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

    redisClient = createClient({
      url: redisUrl,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            return new Error("Redis max retries exceeded");
          }
          return retries * 100;
        },
      },
    });

    // Handle connection events
    redisClient.on("error", (err) => {
      // Silent error handling
    });

    redisClient.on("connect", () => {
      // Connection established
    });

    redisClient.on("ready", () => {
      // Client ready
    });

    redisClient.on("reconnecting", () => {
      // Reconnecting
    });

    // Connect to Redis
    await redisClient.connect();

    return redisClient;
  } catch (error) {
    return null;
  }
};

/**
 * Get the Redis client instance
 * Returns null if Redis is disabled or connection failed
 */
export const getRedisClient = (): RedisClientType | null => {
  return redisClient;
};

/**
 * Close Redis connection gracefully
 */
export const closeRedis = async (): Promise<void> => {
  if (redisClient) {
    try {
      await redisClient.quit();
      redisClient = null;
    } catch (error) {
      // Silent error handling
    }
  }
};

/**
 * Check if Redis is connected
 */
export const isRedisConnected = (): boolean => {
  return redisClient !== null && redisClient.isOpen;
};

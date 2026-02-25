import { Request, Response, NextFunction } from "express";

/**
 * Bot Detection Middleware
 * Detects and blocks obvious bots while allowing legitimate users
 */

const BOT_PATTERNS = [
  'curl',
  'wget',
  'python',
  'scrapy',
  'selenium',
  'puppeteer',
  'headless',
  'phantom',
  'mechanize',
  'requests',
  'httpx',
  'aiohttp',
];

const ALLOWED_BROWSERS = [
  'mozilla',
  'chrome',
  'safari',
  'firefox',
  'edge',
  'opera',
  'brave',
];

/**
 * Check if user agent looks like a bot
 * Only blocks OBVIOUS bots (curl, wget, python, etc.)
 * Does NOT block legitimate tools like Postman, Insomnia, etc.
 */
const isObviousBot = (userAgent: string): boolean => {
  const ua = userAgent.toLowerCase();

  // Check for obvious bot patterns
  const hasBot = BOT_PATTERNS.some(pattern => ua.includes(pattern));

  // Check if it's a known browser
  const isBrowser = ALLOWED_BROWSERS.some(browser => ua.includes(browser));

  // Only block if it has bot pattern AND is NOT a browser
  // This allows Postman, Insomnia, and other legitimate tools
  return hasBot && !isBrowser;
};

/**
 * Middleware to detect and block obvious bots
 * Allows legitimate users and tools
 */
export const detectBot = (req: Request, res: Response, next: NextFunction) => {
  const userAgent = req.get('user-agent') || '';

  if (isObviousBot(userAgent)) {
    console.warn(`🚫 Bot detected: ${req.ip} - ${userAgent}`);
    return res.status(403).json({
      message: "Access denied",
      code: "BOT_DETECTED"
    });
  }

  next();
};

/**
 * Track request patterns to detect AGGRESSIVE scraping behavior
 * Only blocks extremely suspicious patterns, not normal user behavior
 */
const requestPatterns = new Map<string, { timestamps: number[]; endpoints: string[] }>();

export const detectScrapingPattern = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || 'unknown';
  const endpoint = req.path;
  const now = Date.now();

  if (!requestPatterns.has(ip)) {
    requestPatterns.set(ip, { timestamps: [], endpoints: [] });
  }

  const pattern = requestPatterns.get(ip)!;

  // Keep only requests from last 60 seconds
  pattern.timestamps = pattern.timestamps.filter(t => now - t < 60000);
  pattern.endpoints = pattern.endpoints.filter((_, i) => now - pattern.timestamps[i] < 60000);

  pattern.timestamps.push(now);
  pattern.endpoints.push(endpoint);

  // Scraping detection heuristics - ONLY block EXTREME cases
  const requestsPerSecond = pattern.timestamps.length;
  const uniqueEndpoints = new Set(pattern.endpoints).size;

  // Only block if making 50+ requests per second (extremely aggressive)
  // Normal users: 1-5 requests per minute
  // Legitimate tools: 10-20 requests per minute
  // Aggressive scrapers: 100+ requests per minute
  if (requestsPerSecond > 50) {
    console.warn(`🚨 EXTREME request rate from ${ip}: ${requestsPerSecond} req/sec`);
    return res.status(429).json({
      message: "Too many requests, please slow down",
      code: "RATE_LIMIT_EXCEEDED"
    });
  }

  // Only block if accessing 20+ different endpoints in 5 seconds
  // Normal user: 1-2 endpoints per session
  // Aggressive scraper: 50+ endpoints in seconds
  if (uniqueEndpoints >= 20 && pattern.timestamps.length >= 20) {
    const timeSpan = pattern.timestamps[pattern.timestamps.length - 1] - pattern.timestamps[0];
    if (timeSpan < 5000) {
      console.warn(`🚨 EXTREME scraping pattern from ${ip}: ${uniqueEndpoints} endpoints in ${timeSpan}ms`);
      return res.status(429).json({
        message: "Suspicious activity detected",
        code: "SCRAPING_DETECTED"
      });
    }
  }

  next();
};

/**
 * Honeypot endpoint - fake admin endpoint to catch aggressive scrapers
 */
export const honeypot = (req: Request, res: Response) => {
  const ip = req.ip || 'unknown';
  console.error(`🚨 HONEYPOT TRIGGERED: Scraper accessed fake endpoint from ${ip}`);

  res.status(403).json({
    message: "Access denied",
    code: "HONEYPOT_TRIGGERED"
  });
};

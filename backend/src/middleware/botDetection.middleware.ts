import { Request, Response, NextFunction } from "express";

/**
 * Bot Detection Middleware
 * Blocks obvious bots and scrapers from accessing public endpoints
 */

const BOT_PATTERNS = [
  'bot',
  'crawler',
  'scraper',
  'spider',
  'curl',
  'wget',
  'python',
  'java',
  'perl',
  'ruby',
  'php',
  'node',
  'axios',
  'requests',
  'scrapy',
  'selenium',
  'puppeteer',
  'headless',
  'phantom',
  'watir',
  'mechanize',
];

const ALLOWED_BROWSERS = [
  'mozilla',
  'chrome',
  'safari',
  'firefox',
  'edge',
  'opera',
];

/**
 * Check if user agent looks like a bot
 */
const isBot = (userAgent: string): boolean => {
  const ua = userAgent.toLowerCase();

  // Check for bot patterns
  const hasBot = BOT_PATTERNS.some(pattern => ua.includes(pattern));

  // Check if it's a known browser
  const isBrowser = ALLOWED_BROWSERS.some(browser => ua.includes(browser));

  // If it has bot pattern and is NOT a browser, it's likely a bot
  return hasBot && !isBrowser;
};

/**
 * Middleware to detect and block bots
 */
export const detectBot = (req: Request, res: Response, next: NextFunction) => {
  const userAgent = req.get('user-agent') || '';

  if (isBot(userAgent)) {
    console.warn(`🚫 Bot detected: ${req.ip} - ${userAgent}`);
    return res.status(403).json({
      message: "Access denied",
      code: "BOT_DETECTED"
    });
  }

  next();
};

/**
 * Track request patterns to detect scraping behavior
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

  // Scraping detection heuristics
  const requestsPerSecond = pattern.timestamps.length;
  const uniqueEndpoints = new Set(pattern.endpoints).size;

  // If making 10+ requests per second = likely bot
  if (requestsPerSecond > 10) {
    console.warn(`⚠️ High request rate from ${ip}: ${requestsPerSecond} req/sec`);
    return res.status(429).json({
      message: "Too many requests, please slow down",
      code: "RATE_LIMIT_EXCEEDED"
    });
  }

  // If accessing 5+ different endpoints in 10 seconds = likely scraper
  if (uniqueEndpoints >= 5 && pattern.timestamps.length >= 5) {
    const timeSpan = pattern.timestamps[pattern.timestamps.length - 1] - pattern.timestamps[0];
    if (timeSpan < 10000) {
      console.warn(`⚠️ Scraping pattern detected from ${ip}: ${uniqueEndpoints} endpoints in ${timeSpan}ms`);
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

  // Block this IP for 24 hours
  // In production, store in Redis

  res.status(403).json({
    message: "Access denied",
    code: "HONEYPOT_TRIGGERED"
  });
};

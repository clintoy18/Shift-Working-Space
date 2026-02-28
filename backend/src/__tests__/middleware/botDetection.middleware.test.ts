import { Request, Response, NextFunction } from 'express';
import { detectBot, detectScrapingPattern, honeypot } from '../../middleware/botDetection.middleware';

describe('Bot Detection Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      get: jest.fn(),
      ip: '127.0.0.1',
      path: '/api/test',
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('detectBot middleware', () => {
    it('should allow requests from browsers', () => {
      (req.get as jest.Mock).mockReturnValue('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

      detectBot(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should block curl requests', () => {
      (req.get as jest.Mock).mockReturnValue('curl/7.64.1');

      detectBot(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Access denied',
        code: 'BOT_DETECTED',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should block wget requests', () => {
      (req.get as jest.Mock).mockReturnValue('Wget/1.20.3');

      detectBot(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });

    it('should block python requests', () => {
      (req.get as jest.Mock).mockReturnValue('python-requests/2.28.0');

      detectBot(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });

    it('should block scrapy requests', () => {
      (req.get as jest.Mock).mockReturnValue('Scrapy/2.5.0');

      detectBot(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });

    it('should block selenium requests', () => {
      (req.get as jest.Mock).mockReturnValue('Selenium/4.0');

      detectBot(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });

    it('should block puppeteer requests', () => {
      (req.get as jest.Mock).mockReturnValue('puppeteer');

      detectBot(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });

    it('should allow Chrome browser', () => {
      (req.get as jest.Mock).mockReturnValue('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/91.0');

      detectBot(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should allow Firefox browser', () => {
      (req.get as jest.Mock).mockReturnValue('Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0');

      detectBot(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
    });

    it('should allow Safari browser', () => {
      (req.get as jest.Mock).mockReturnValue('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15');

      detectBot(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
    });

    it('should allow Postman', () => {
      (req.get as jest.Mock).mockReturnValue('PostmanRuntime/7.28.0');

      detectBot(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
    });

    it('should allow Insomnia', () => {
      (req.get as jest.Mock).mockReturnValue('Insomnia/2021.7.2');

      detectBot(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
    });

    it('should handle missing user-agent header', () => {
      (req.get as jest.Mock).mockReturnValue(undefined);

      detectBot(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
    });

    it('should be case-insensitive', () => {
      (req.get as jest.Mock).mockReturnValue('CURL/7.64.1');

      detectBot(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(403);
    });
  });

  describe('detectScrapingPattern middleware', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should allow normal request rate', () => {
      Object.defineProperty(req, 'ip', { value: '192.168.1.1', writable: true });
      Object.defineProperty(req, 'path', { value: '/api/users', writable: true });

      detectScrapingPattern(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should block extremely high request rate (50+ per second)', () => {
      Object.defineProperty(req, 'ip', { value: '192.168.1.2', writable: true });

      // Simulate 51 requests in quick succession
      for (let i = 0; i < 51; i++) {
        detectScrapingPattern(req as Request, res as Response, next);
      }

      expect(res.status).toHaveBeenCalledWith(429);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Too many requests, please slow down',
        code: 'RATE_LIMIT_EXCEEDED',
      });
    });

    it('should allow moderate request rate', () => {
      Object.defineProperty(req, 'ip', { value: '192.168.1.3', writable: true });

      // Simulate 20 requests (normal usage)
      for (let i = 0; i < 20; i++) {
        detectScrapingPattern(req as Request, res as Response, next);
      }

      expect(next).toHaveBeenCalled();
    });

    it('should block many endpoints accessed rapidly', () => {
      Object.defineProperty(req, 'ip', { value: '192.168.1.4', writable: true });

      // Simulate accessing 20 different endpoints in 5 seconds
      for (let i = 0; i < 20; i++) {
        Object.defineProperty(req, 'path', { value: `/api/endpoint${i}`, writable: true });
        detectScrapingPattern(req as Request, res as Response, next);
      }

      expect(res.status).toHaveBeenCalledWith(429);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Suspicious activity detected',
        code: 'SCRAPING_DETECTED',
      });
    });

    it('should track requests per IP separately', () => {
      // IP 1 makes requests
      Object.defineProperty(req, 'ip', { value: '192.168.1.5', writable: true });
      for (let i = 0; i < 10; i++) {
        detectScrapingPattern(req as Request, res as Response, next);
      }

      // IP 2 makes requests (should not be blocked)
      Object.defineProperty(req, 'ip', { value: '192.168.1.6', writable: true });
      detectScrapingPattern(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
    });

    it('should clear old requests after 60 seconds', () => {
      Object.defineProperty(req, 'ip', { value: '192.168.1.7', writable: true });

      // Make a request
      detectScrapingPattern(req as Request, res as Response, next);

      // Advance time by 61 seconds
      jest.advanceTimersByTime(61000);

      // Make another request - should not be blocked
      detectScrapingPattern(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
    });

    it('should handle requests with no IP', () => {
      Object.defineProperty(req, 'ip', { value: undefined, writable: true });

      detectScrapingPattern(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe('honeypot endpoint', () => {
    it('should return 403 Forbidden', () => {
      honeypot(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('should return honeypot triggered message', () => {
      honeypot(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith({
        message: 'Access denied',
        code: 'HONEYPOT_TRIGGERED',
      });
    });

    it('should log the honeypot trigger', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      honeypot(req as Request, res as Response);

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});

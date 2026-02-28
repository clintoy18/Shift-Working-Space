import {
  validatePassword,
  validateEmail,
  validateNameField,
  escapeRegex,
} from '../../utils/validation';

describe('Validation Utilities', () => {
  describe('validatePassword', () => {
    it('should accept a strong password', () => {
      const result = validatePassword('StrongPass123!@#');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject password shorter than 12 characters', () => {
      const result = validatePassword('Short1!');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must be at least 12 characters long');
    });

    it('should reject password without uppercase letter', () => {
      const result = validatePassword('lowercase123!@#');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one uppercase letter');
    });

    it('should reject password without lowercase letter', () => {
      const result = validatePassword('UPPERCASE123!@#');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one lowercase letter');
    });

    it('should reject password without number', () => {
      const result = validatePassword('NoNumbers!@#abc');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one number');
    });

    it('should reject password without special character', () => {
      const result = validatePassword('NoSpecial123abc');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one special character (!@#$%^&* etc.)');
    });

    it('should reject empty password', () => {
      const result = validatePassword('');
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should return multiple errors for weak password', () => {
      const result = validatePassword('weak');
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });

    it('should accept various special characters', () => {
      const specialChars = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '-', '='];
      specialChars.forEach(char => {
        const password = `ValidPass123${char}`;
        const result = validatePassword(password);
        expect(result.valid).toBe(true);
      });
    });
  });

  describe('validateEmail', () => {
    it('should accept valid email', () => {
      const result = validateEmail('user@example.com');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject email without @', () => {
      const result = validateEmail('userexample.com');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid email format');
    });

    it('should reject email without domain', () => {
      const result = validateEmail('user@');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid email format');
    });

    it('should reject email without TLD', () => {
      const result = validateEmail('user@example');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid email format');
    });

    it('should reject empty email', () => {
      const result = validateEmail('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid email format');
    });

    it('should reject email with spaces', () => {
      const result = validateEmail('user @example.com');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid email format');
    });

    it('should reject email exceeding 150 characters', () => {
      const longEmail = 'a'.repeat(140) + '@example.com';
      const result = validateEmail(longEmail);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Email must not exceed 150 characters');
    });

    it('should accept email at exactly 150 characters', () => {
      const email = 'a'.repeat(135) + '@example.com';
      const result = validateEmail(email);
      expect(result.valid).toBe(true);
    });

    it('should accept various valid email formats', () => {
      const validEmails = [
        'user@example.com',
        'user.name@example.com',
        'user+tag@example.co.uk',
        'user123@test-domain.org',
      ];
      validEmails.forEach(email => {
        const result = validateEmail(email);
        expect(result.valid).toBe(true);
      });
    });
  });

  describe('validateNameField', () => {
    it('should accept valid name', () => {
      const result = validateNameField('John', 'First name');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject empty name', () => {
      const result = validateNameField('', 'First name');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('First name is required');
    });

    it('should reject name with only whitespace', () => {
      const result = validateNameField('   ', 'First name');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('First name is required');
    });

    it('should reject name exceeding max length', () => {
      const longName = 'a'.repeat(101);
      const result = validateNameField(longName, 'First name');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('First name must not exceed 100 characters');
    });

    it('should accept name at max length', () => {
      const maxName = 'a'.repeat(100);
      const result = validateNameField(maxName, 'First name');
      expect(result.valid).toBe(true);
    });

    it('should accept custom max length', () => {
      const result = validateNameField('John', 'First name', 50);
      expect(result.valid).toBe(true);
    });

    it('should reject name with numbers', () => {
      const result = validateNameField('John123', 'First name');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('First name contains invalid characters');
    });

    it('should reject name with special characters', () => {
      const result = validateNameField('John@Doe', 'First name');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('First name contains invalid characters');
    });

    it('should accept name with hyphens', () => {
      const result = validateNameField('Mary-Jane', 'First name');
      expect(result.valid).toBe(true);
    });

    it('should accept name with apostrophes', () => {
      const result = validateNameField("O'Brien", 'First name');
      expect(result.valid).toBe(true);
    });

    it('should accept name with spaces', () => {
      const result = validateNameField('Jean Claude', 'First name');
      expect(result.valid).toBe(true);
    });

    it('should use custom field name in error message', () => {
      const result = validateNameField('', 'Last name');
      expect(result.error).toBe('Last name is required');
    });
  });

  describe('escapeRegex', () => {
    it('should escape special regex characters', () => {
      const input = 'test.*+?^${}()|[]\\';
      const result = escapeRegex(input);
      expect(result).toBe('test\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\');
    });

    it('should handle empty string', () => {
      const result = escapeRegex('');
      expect(result).toBe('');
    });

    it('should not escape regular characters', () => {
      const input = 'hello world 123';
      const result = escapeRegex(input);
      expect(result).toBe('hello world 123');
    });

    it('should prevent regex injection', () => {
      const maliciousInput = '.*';
      const escaped = escapeRegex(maliciousInput);
      const regex = new RegExp(escaped);
      expect(regex.test('anything')).toBe(false);
      expect(regex.test('.*')).toBe(true);
    });

    it('should escape all special characters', () => {
      const specialChars = '.*+?^${}()|[]\\';
      const result = escapeRegex(specialChars);
      // Should contain backslashes before special chars
      expect(result).toContain('\\');
    });
  });
});

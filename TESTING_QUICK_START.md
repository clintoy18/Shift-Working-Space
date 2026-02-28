# Testing Quick Start Guide

## Installation

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

## Running Tests

### Backend - All Tests
```bash
cd backend
npm test
```

### Backend - Watch Mode (Auto-rerun on changes)
```bash
cd backend
npm run test:watch
```

### Backend - Coverage Report
```bash
cd backend
npm run test:coverage
```

### Backend - Debug Mode
```bash
cd backend
npm run test:debug
```

### Frontend - All Tests
```bash
cd frontend
npm test
```

### Frontend - Watch Mode
```bash
cd frontend
npm run test:watch
```

### Frontend - Coverage Report
```bash
cd frontend
npm run test:coverage
```

### Frontend - Debug Mode
```bash
cd frontend
npm run test:debug
```

## Test File Locations

### Backend Tests
```
backend/src/__tests__/
├── utils/
│   ├── jwt.test.ts
│   └── validation.test.ts
├── middleware/
│   ├── auth.middleware.test.ts
│   └── botDetection.middleware.test.ts
├── controllers/
│   ├── auth.controller.test.ts
│   └── seat.controller.test.ts
└── integration/
    ├── auth.integration.test.ts
    └── seat.integration.test.ts
```

### Frontend Tests
```
frontend/src/__tests__/
├── services/
│   ├── AuthService.test.ts
│   └── SeatService.test.ts
├── context/
│   ├── AuthContext.test.tsx
│   └── ToastContext.test.tsx
├── components/
│   ├── auth/
│   │   └── LoginForm.test.tsx
│   └── common/
│       └── Button.test.tsx
└── integration/
    ├── auth.integration.test.tsx
    └── seat.integration.test.tsx
```

## Running Specific Tests

### Backend - Run Single Test File
```bash
cd backend
npm test -- jwt.test.ts
```

### Backend - Run Tests Matching Pattern
```bash
cd backend
npm test -- --testNamePattern="should generate token"
```

### Frontend - Run Single Test File
```bash
cd frontend
npm test -- AuthService.test.ts
```

### Frontend - Run Tests Matching Pattern
```bash
cd frontend
npm test -- --testNamePattern="should login user"
```

## Test Structure

### Unit Tests
- Test individual functions/components in isolation
- Mock external dependencies
- Fast execution
- Located in `__tests__` directories

### Integration Tests
- Test complete workflows
- Use real database (backend) or mocked APIs (frontend)
- Slower execution
- Located in `__tests__/integration` directories

## Key Test Files

### Backend

**JWT Tests** (`backend/src/__tests__/utils/jwt.test.ts`)
- Token generation
- Token verification
- Expiration handling

**Validation Tests** (`backend/src/__tests__/utils/validation.test.ts`)
- Password strength validation
- Email format validation
- Name field validation
- Regex escaping

**Auth Middleware Tests** (`backend/src/__tests__/middleware/auth.middleware.test.ts`)
- Token authentication
- Role-based access control
- User verification

**Auth Controller Tests** (`backend/src/__tests__/controllers/auth.controller.test.ts`)
- User registration
- User login
- Profile updates

**Seat Controller Tests** (`backend/src/__tests__/controllers/seat.controller.test.ts`)
- Get all seats
- Filter by zone
- Update seat status
- Get availability

### Frontend

**AuthService Tests** (`frontend/src/__tests__/services/AuthService.test.ts`)
- Login/logout
- Registration
- Token management
- User fetching

**SeatService Tests** (`frontend/src/__tests__/services/SeatService.test.ts`)
- Get seats
- Filter seats
- Update seat status
- Get availability

**AuthContext Tests** (`frontend/src/__tests__/context/AuthContext.test.tsx`)
- Login flow
- Registration flow
- Logout flow
- Session persistence

**LoginForm Tests** (`frontend/src/__tests__/components/auth/LoginForm.test.tsx`)
- Form rendering
- Form submission
- Validation
- Error handling

## Common Test Commands

### Run all tests with coverage
```bash
# Backend
cd backend && npm run test:coverage

# Frontend
cd frontend && npm run test:coverage
```

### Run tests in CI/CD mode (no watch)
```bash
# Backend
cd backend && npm test -- --ci

# Frontend
cd frontend && npm test -- --ci
```

### Update snapshots (if using snapshot testing)
```bash
npm test -- -u
```

### Run tests with verbose output
```bash
npm test -- --verbose
```

## Debugging Tests

### Using Node Inspector
```bash
# Backend
cd backend && npm run test:debug

# Frontend
cd frontend && npm run test:debug
```

Then open `chrome://inspect` in Chrome to debug.

### Adding Debug Statements
```typescript
// In test file
console.log('Debug info:', variable);
```

### Using Jest Debug
```typescript
// In test file
debugger; // Execution will pause here when running with --inspect-brk
```

## Coverage Reports

### View Coverage Report
```bash
# Backend
cd backend && npm run test:coverage
# Open coverage/lcov-report/index.html

# Frontend
cd frontend && npm run test:coverage
# Open coverage/lcov-report/index.html
```

### Coverage Thresholds
- **Statements**: 70%+
- **Branches**: 70%+
- **Functions**: 70%+
- **Lines**: 70%+

## Writing New Tests

### Backend Test Template
```typescript
import { functionToTest } from '../../path/to/function';

describe('Function Name', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should do something', () => {
    const result = functionToTest(input);
    expect(result).toBe(expected);
  });

  it('should handle error', () => {
    expect(() => functionToTest(badInput)).toThrow();
  });
});
```

### Frontend Test Template
```typescript
import { render, screen } from '@testing-library/react';
import { ComponentToTest } from '../../path/to/component';

describe('ComponentToTest', () => {
  it('should render', () => {
    render(<ComponentToTest />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('should handle click', async () => {
    const user = userEvent.setup();
    render(<ComponentToTest />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(screen.getByText('After Click')).toBeInTheDocument();
  });
});
```

## Troubleshooting

### Tests Won't Run
1. Check Node.js version (v14+)
2. Run `npm install` to ensure dependencies
3. Check for syntax errors in test files

### Tests Timeout
1. Increase timeout: `jest.setTimeout(10000)`
2. Check for unresolved promises
3. Ensure mocks are properly configured

### Module Not Found
1. Check path aliases in jest.config.js
2. Verify file paths are correct
3. Check tsconfig.json paths

### Mock Not Working
1. Ensure mock is defined before import
2. Check mock path matches actual path
3. Use `jest.clearAllMocks()` in beforeEach

## Best Practices

✅ **Do**
- Write tests for new features
- Test both success and error cases
- Use descriptive test names
- Keep tests focused and isolated
- Mock external dependencies
- Use beforeEach for setup
- Test user interactions, not implementation

❌ **Don't**
- Test implementation details
- Create dependencies between tests
- Use real APIs in unit tests
- Write overly complex tests
- Skip error case testing
- Ignore test warnings

## Resources

- [Jest Docs](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Getting Help

1. Check test output for error messages
2. Review similar test files for patterns
3. Check Jest documentation
4. Use `--verbose` flag for detailed output
5. Run with `--debug` for interactive debugging

---

**Happy Testing! 🧪**

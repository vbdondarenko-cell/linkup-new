# LinkUp V6 Testing Guide

## Overview

This document describes the testing strategy and procedures for LinkUp V6.

## Testing Pyramid

```
                    ┌─────────────────┐
                    │   E2E Tests     │  ← Few, Critical Paths
                    ├─────────────────┤
                    │  Integration    │  ← API, DB, Realtime
                    ├─────────────────┤
                    │  Component      │  ← UI Components
                    ├─────────────────┤
                    │   Unit Tests    │  ← Many, Fast
                    └─────────────────┘
```

## Test Types

### Unit Tests (95% Coverage Target)
- Domain entities
- Value objects
- Validators
- Services
- Utilities
- AI Services

### Component Tests
- Reusable UI components
- Button states
- Form inputs
- Cards
- Bottom sheets
- Navigation

### Integration Tests
- Authentication flow
- Database operations
- API endpoints
- Realtime subscriptions

### E2E Tests
- Critical user journeys
- Smoke tests
- Regression tests

## Running Tests

### All Tests
```bash
npm run test:all
```

### Unit Tests
```bash
npm run test:unit
npm run test:unit -- --watch  # Watch mode
```

### Integration Tests
```bash
npm run test:integration
```

### E2E Tests
```bash
npm run test:e2e           # Run all
npm run test:e2e --ui      # Interactive UI
npm run test:smoke          # Smoke tests only
npm run test:regression     # Regression tests only
```

### Accessibility Tests
```bash
npm run test:accessibility
```

### Performance Tests
```bash
k6 run tests/performance/load-test.js
```

### Security Tests
```bash
npm run test:security
```

## Test Coverage

### Coverage Report
```bash
npm run test:coverage
```

### Thresholds
| Metric | Target |
|--------|--------|
| Statements | 70% |
| Branches | 70% |
| Functions | 70% |
| Lines | 70% |

## CI/CD Integration

All tests run automatically on:
- Push to `main`, `develop`
- Pull requests

### Required Checks
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Security tests pass
- [ ] Accessibility tests pass

## Test Data

### Mock Data
Use utilities from `src/__tests__/setup.ts`:
```typescript
import { createMockUser, createMockEvent } from '@/__tests__/setup';

// Create test data
const user = createMockUser();
const event = createMockEvent({ capacity: 100 });
```

### Fixtures
Place test fixtures in `tests/fixtures/`.

## Best Practices

1. **Isolation**: Each test should be independent
2. **Fast**: Unit tests should run in <1s
3. **Deterministic**: No flaky tests
4. **Readable**: Clear test names and assertions
5. **Maintainable**: Avoid test-specific code in production

## Writing Tests

### Test Structure
```typescript
describe('FeatureName', () => {
  describe('subFeature', () => {
    it('should do something specific', () => {
      // Arrange
      const input = createMockUser();
      
      // Act
      const result = performAction(input);
      
      // Assert
      expect(result).toBe(expectedValue);
    });
  });
});
```

### Naming Conventions
- Use descriptive names: `shouldDisplayErrorWhenInvalidEmail`
- Group related tests in `describe` blocks
- Use `beforeEach` for common setup

## Debugging

### Unit Tests
```bash
npm run test:unit -- --verbose --watch
```

### E2E Tests
```bash
npm run test:e2e:debug  # Debug mode
```

### View Playwright Traces
```bash
# Open trace viewer
npx playwright show-trace trace.zip
```

## Continuous Improvement

- Review test coverage weekly
- Identify and fix flaky tests
- Add tests for bug fixes
- Refactor outdated tests

---

*Last Updated: V6.0*
*Owner: QA Team*

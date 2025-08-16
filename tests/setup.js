// Jest setup file for global test configuration

// Increase timeout for tests that involve package manager operations
jest.setTimeout(30000);

// Mock console methods to avoid cluttering test output
const originalConsole = { ...console };

beforeEach(() => {
  // Mock console methods but allow them to be overridden in individual tests
  console.log = jest.fn();
  console.warn = jest.fn();
  console.error = jest.fn();
});

afterEach(() => {
  // Restore console methods after each test
  console.log = originalConsole.log;
  console.warn = originalConsole.warn;
  console.error = originalConsole.error;
});

// Helper function to restore console for specific tests
global.restoreConsole = () => {
  console.log = originalConsole.log;
  console.warn = originalConsole.warn;
  console.error = originalConsole.error;
};
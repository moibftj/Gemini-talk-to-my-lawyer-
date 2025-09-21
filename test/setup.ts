import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock environment variables for tests
process.env.GEMINI_API_KEY = 'test-api-key';

// Mock global objects that might be needed in tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
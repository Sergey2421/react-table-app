import '@testing-library/jest-dom/vitest';
import { vi, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

global.fetch = vi.fn();

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
}); 
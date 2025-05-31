import { vi } from 'vitest';

declare global {
  var fetch: typeof fetch & ReturnType<typeof vi.fn>;
}

export {}; 
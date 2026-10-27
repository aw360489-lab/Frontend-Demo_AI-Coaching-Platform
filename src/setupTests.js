import '@testing-library/jest-dom/vitest';

import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Clean up the rendered React components after each test to prevent test interference.
afterEach(() => {
    cleanup();
});

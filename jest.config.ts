import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({ dir: './' });

const config: Config = {
  // Pure logic under test (lib/scoring, lib/fdi) needs no DOM.
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/lib/**/*.ts',
    // Tests and test-only helpers are not production surface.
    '!src/lib/**/*.test.ts',
    '!src/lib/fdi/test-support.ts',
  ],
  coverageThreshold: {
    global: {},
    // The FDI scoring engine and its band logic are pure and fully reachable, so
    // they are held at 100%. A gap here means a §12 reject path or a §9/§10
    // boundary is unexercised — exactly the code that must never regress.
    'src/lib/fdi/score.ts': { statements: 100, branches: 100, functions: 100, lines: 100 },
    'src/lib/fdi/bands.ts': { statements: 100, branches: 100, functions: 100, lines: 100 },
    'src/lib/fdi/rounding.ts': { statements: 100, branches: 100, functions: 100, lines: 100 },
  },
};

export default createJestConfig(config);

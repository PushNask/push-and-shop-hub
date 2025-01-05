import '@testing-library/jest-dom';
import { expect, afterEach, vi, describe, it, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

// Extend the global type with Vitest's test runners
declare global {
  var describe: typeof import('vitest')['describe'];
  var it: typeof import('vitest')['it'];
  var expect: typeof import('vitest')['expect'];
  var beforeEach: typeof import('vitest')['beforeEach'];
  var vi: typeof import('vitest')['vi'];
}

// Assign test runners to global scope
globalThis.describe = describe;
globalThis.it = it;
globalThis.expect = expect;
globalThis.beforeEach = beforeEach;
globalThis.vi = vi;

// Cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});
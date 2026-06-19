import {
  defineConfig,
  globalIgnores,
} from 'eslint/config';

import nextVitals from 'eslint-config-next/core-web-vitals';

// ESLint configuration for Next.js project
export default defineConfig([
  // Next.js Core Web Vitals ESLint rules
  ...nextVitals,

  // Ignore generated Next.js build files
  globalIgnores([
    '.next/**',
  ]),
]);
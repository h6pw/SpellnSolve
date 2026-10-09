import js from '@eslint/js';
export default [
  { ignores: ['node_modules/**', 'dist/**', 'reports/**', 'artifacts/**', 'tmp/**', 'submissao/**', '.publish/**', '.observe/**', 'status/**', 'playwright-report/**', 'test-results/**', 'src/counter.js'] },
  js.configs.recommended,
  { languageOptions: { ecmaVersion: 'latest', sourceType: 'module', globals:
    Object.fromEntries(['document', 'window', 'requestAnimationFrame', 'fetch', 'console', 'process', 'URL', 'setTimeout', 'Buffer', 'AbortSignal', 'performance'].map(key => [key, 'readonly'])) } }
];

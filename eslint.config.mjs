import configNymph from 'eslint-config-nymph';
import pluginJsdoc from 'eslint-plugin-jsdoc';

import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt([
  configNymph,
  pluginJsdoc.configs['flat/recommended'],
  // Disable jsdoc param types (use TypeScript types)
  // and forbid JSDoc type annotations
  {
    rules: {
      'jsdoc/require-param-type': 'off',
      'jsdoc/require-returns-type': 'off',
      'jsdoc/no-types': 'error',
    },
  },
  // Disable max-len and allow v-html for Vue SFCs
  // v-html is used only for highlight.js output (pre-sanitized, not user HTML)
  {
    files: ['**/*.vue'],
    rules: {
      'max-len': 'off',
      'vue/no-v-html': 'off',
    },
  },
]);

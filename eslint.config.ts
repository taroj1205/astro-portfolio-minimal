import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { includeIgnoreFile } from '@eslint/compat'
import prettierConfig from 'eslint-config-prettier'
import astro from 'eslint-plugin-astro'
import tseslint, { configs } from 'typescript-eslint'

// Import modular configurations
import { astroConfig } from './.eslint/astro'
import { baseConfig } from './.eslint/base'
import { configFilesConfig } from './.eslint/config-files'
import { cspellConfig } from './.eslint/cspell'
import { importConfigArray } from './.eslint/import'
import { javascriptConfig } from './.eslint/javascript'
import { jsxA11yConfig } from './.eslint/jsx-a11y'
import { createTypescriptConfig } from './.eslint/typescript'

import type { TSESLint } from '@typescript-eslint/utils'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const tsConfigPath = resolve(__dirname, './tsconfig.json')

const ignoresConfig = {
  name: 'eslint/ignores',
  ignores: [
    // Build outputs
    '**/dist/**',
    '**/build/**',
    '**/.astro/**',
    '**/node_modules/**',

    // Test outputs
    '**/coverage/**',
    '**/playwright-report/**',
    '**/test-results/**',

    // Config files are handled by configFilesConfig

    // Other common ignores
    '**/.next/**',
    '**/.output/**',
    '**/.vercel/**',
    '**/.netlify/**',
    '**/public/**',
    '**/*.min.js',
    '**/*.d.ts',
    '**/CHANGELOG.md',
    '**/README.md',
  ],
} satisfies TSESLint.FlatConfig.Config

const config: TSESLint.FlatConfig.ConfigArray = tseslint.config(
  // Include .gitignore patterns
  includeIgnoreFile(resolve(__dirname, '.gitignore')),

  // Core configurations
  ignoresConfig,
  baseConfig,

  // TypeScript ecosystem
  ...configs.strict,
  ...configs.stylistic,
  createTypescriptConfig(tsConfigPath),

  // Import management
  ...importConfigArray,

  // Accessibility
  jsxA11yConfig,

  // Astro specific
  ...astro.configs.recommended,
  astroConfig,

  // Language specific
  javascriptConfig,

  // Special cases
  configFilesConfig,

  // Spell checking
  cspellConfig,

  // Prettier integration (must be last)
  prettierConfig
)

export default config

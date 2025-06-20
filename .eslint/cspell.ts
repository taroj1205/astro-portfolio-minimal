import cspellPlugin from '@cspell/eslint-plugin'

import cspellJson from '../cspell.json'
import { sharedFiles } from './shared'

import type { Linter } from 'eslint'

export const cspellConfig: Linter.Config = {
  name: 'eslint/cspell',
  files: sharedFiles,
  ignores: cspellJson.ignorePaths,
  plugins: { '@cspell': cspellPlugin },
  rules: {
    '@cspell/spellchecker': [
      'warn',
      {
        configFile: new URL('../cspell.json', import.meta.url).toString(),
        cspell: {
          language: 'en,es',
        },
      },
    ],
  },
}

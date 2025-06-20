/**
 * @type {import('@commitlint/types').UserConfig}
 */
export default {
  extends: ['@commitlint/config-conventional'],
  plugins: [
    {
      rules: {
        'scope-no-spaces': parsed => {
          const { scope } = parsed
          if (!scope) return [true]

          // Check if scope contains comma with space
          if (scope.includes(', ')) {
            return [
              false,
              'Multiple scopes should be separated by comma without space (e.g., "header,footer")',
            ]
          }

          return [true]
        },
      },
    },
  ],
  rules: {
    // Customize rules as needed
    'type-enum': [
      2,
      'always',
      [
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test',
      ],
    ],
    'scope-empty': [2, 'never'],
    'scope-case': [2, 'always', 'lower-case'],
    'scope-max-length': [2, 'always', 50],
    'scope-no-spaces': [2, 'always'],
    'subject-case': [2, 'never', ['pascal-case', 'upper-case']],
    'subject-max-length': [2, 'always', 100],
    'body-max-line-length': [2, 'always', 100],
    'footer-max-line-length': [2, 'always', 100],
  },
}

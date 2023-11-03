module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  settings: {
    'react': {
      version: 'detect',
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: true,
      node: true,
    },
  },
  plugins: ['prettier', 'sort-imports-es6-autofix', 'vitest', 'import', 'consistent-default-export-name', 'react'],
  rules: {
    'react/prop-types': 0,
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'import/no-named-as-default-member': 0,
    'import/order': 0,
    'import/exports-last': 2,
    'import/first': 2,
    'import/prefer-default-export': [2, { target: 'any' }],
    'import/no-unused-modules': [1, { unusedExports: true }],
    'no-empty': [2, { allowEmptyCatch: true }],
    'sort-imports-es6-autofix/sort-imports-es6': [
      2,
      {
        ignoreCase: false,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'single', 'all', 'multiple'],
      },
    ],
    'consistent-default-export-name/default-export-match-filename': [2, [null, 'camel']],
    'consistent-default-export-name/default-import-match-filename': [1, { ignorePaths: ['**/*.module.css'] }],
  },
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:vitest/recommended',
    'plugin:import/recommended',
    '@betterplace/eslint-config-base',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
  ],
  overrides: [
    {
      files: ['**/*.{ts,tsx}'],
      plugins: ['@typescript-eslint'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:import/typescript',
      ],
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': 0,
        '@typescript-eslint/ban-types': [
          2,
          {
            extendDefaults: true,
            types: {
              '{}': false,
            },
          },
        ],
        '@typescript-eslint/no-unused-vars': [
          2,
          {
            vars: 'all',
            args: 'all',
            ignoreRestSiblings: true,
            varsIgnorePattern: '^[_A-Z]',
            argsIgnorePattern: '^_',
            caughtErrors: 'none',
          },
        ],
      },
    },
    {
      files: ['index.ts', 'server.ts'],
      rules: {
        'import/prefer-default-export': 0,
      },
    },
    {
      files: ['*.config.*'],
      rules: {
        'import/no-unused-modules': 0,
        'consistent-default-export-name/default-import-match-filename': 0,
      },
    },
  ],
}

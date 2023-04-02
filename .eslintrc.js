module.exports = {
  root: true,
  extends: [
    'standard-with-typescript',
    'plugin:sonarjs/recommended',
    'plugin:unicorn/recommended',
    'plugin:prettier/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json'
  },
  plugins: ['@typescript-eslint', 'sonarjs', 'simple-import-sort'],
  rules: {
    '@typescript-eslint/ban-types': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    'consistent-return': 'error',
    'no-empty-function': 'off',
    '@typescript-eslint/no-empty-function': 'error',
    'no-func-assign': 'error',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',
    'no-unused-labels': 'error',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'unicorn/filename-case': [
      'error',
      {
        case: 'kebabCase',
        ignore: [/\$[A-Za-z]+\.tsx/]
      }
    ],
    'unicorn/no-array-callback-reference': 'off',
    'unicorn/no-array-for-each': 'off',
    'unicorn/no-array-reduce': 'off',
    'unicorn/prefer-node-protocol': 'off',
    'unicorn/no-null': 'off',
    semi: 'off',
    '@typescript-eslint/semi': ['error']
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'prettier/prettier': [
          'error',
          {
            semi: false
          }
        ]
      }
    }
  ]
}

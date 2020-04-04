module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'prettier',
    'jest'
  ],
  env: {
    "jest/globals": true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  rules: {
    'prettier/prettier': 'error',
    "jest/no-disabled-tests": "warn",
    "jest/no-focused-tests": "error",
    "jest/no-identical-title": "error",
    "jest/prefer-to-have-length": "warn",
    "jest/valid-expect": "error"
  }
};

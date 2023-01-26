/** @type {import('@types/eslint').Linter.Config} */
module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    '@shoppingzh',
    'prettier',
  ],
  rules: {
    semi: [2, 'never'],
    'id-blacklist': [0],
    'no-param-reassign': [0],
  },
}

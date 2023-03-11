module.exports = {
  '*.{js,ts}': [
    'eslint --fix',
    'jest --passWithNoTests'
  ],
}

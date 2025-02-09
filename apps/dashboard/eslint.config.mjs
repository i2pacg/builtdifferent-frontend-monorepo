import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: false,
  vue: true,
  typescript: true,
  ignores: [
    'node_modules',
    'dist',
    '.vite',
    '.temp',
  ],
  rules: {
    'no-console': 'warn',
    'unused-imports/no-unused-imports': 'warn',
    'vue/component-name-in-template-casing': ['error', 'kebab-case'],
  },
})

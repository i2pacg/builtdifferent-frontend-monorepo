import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: false,
  vue: true,
  typescript: true,
  ignorePatterns: ['node_modules'],
  rules: {
    'antfu/top-level-function': 'off',
    'no-console': 'warn',
    'unused-imports/no-unused-imports': 'error',
    'vue/component-name-in-template-casing': ['error', 'kebab-case'],
    'vue/block-order': ['error', {
      order: [['template', 'script'], 'style'],
    }],
    'vue/max-attributes-per-line': ['error', {
      singleline: {
        max: 3,
      },
      multiline: {
        max: 1,
      },
    }],
  },
})

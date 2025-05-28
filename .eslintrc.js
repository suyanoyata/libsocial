module.exports = {
  extends: [
    "@feature-sliced",
    "@feature-sliced/eslint-config/rules/import-order",
    "@feature-sliced/eslint-config/rules/layers-slices"
  ],
  plugins: ["unused-imports"],
  parser: "@typescript-eslint/parser",
  settings: {
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true
      }
    }
  },
  rules: {
    "import/no-internal-modules": "off",
    "unused-imports/no-unused-imports": "warn",
    "no-unused-vars": "error"
  }
}

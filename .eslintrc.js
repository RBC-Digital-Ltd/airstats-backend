module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "jest", "jest-extended", "import"],
  extends: [
    "airbnb-base",
    "plugin:@typescript-eslint/recommended",
    "plugin:jest/recommended",
    "plugin:jest/style",
    "plugin:jest-extended/all",
    "prettier",
  ],
  env: {
    jest: true,
    node: true,
  },
  rules: {
    "import/prefer-default-export": "off",
    "import/no-extraneous-dependencies": [
      "error",
      { devDependencies: ["**/*.spec.ts"] },
    ],
    "import/extensions": [
      "error",
      "always",
      {
        pattern: {
          ts: "never",
        },
      },
    ],
  },
  settings: {
    "import/resolver": {
      typescript: {
        project: "./tsconfig.json",
      },
    },
  },
};

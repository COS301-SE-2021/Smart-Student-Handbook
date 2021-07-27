module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.dev.json"],
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'airbnb-typescript/base',
    //'airbnb-base',
  ],

  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ["/lib/**/*",'.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'linebreak-style': ['error', 'windows'],  // changes the file to CRLF
    "prettier/prettier": [
      "error",
      {
        "endOfLine": "crlf",
      }
    ]
  },
};

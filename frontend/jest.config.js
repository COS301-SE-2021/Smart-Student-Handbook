module.exports = {
  moduleNameMapper: {
    '@core/(.*)': '<rootDir>/src/app/core/$1',
    "@app/services": "<rootDir>/src/app/services",
    "@app/components": "<rootDir>/src/app/components",
    "@app/features": "<rootDir>/src/app/features",
    "@app/features/public": "<rootDir>/src/app/features/public",
    "@app/core": "<rootDir>/src/app/core",
    "@app/mobile": "<rootDir>/src/app/mobile",
    "@app/styling": "<rootDir>/src/app/styling",
    "@environments": "<rootDir>/src/environments",
  },
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testMatch: ["<rootDir>/src/**/*.spec.ts"],
};

// const { pathsToModuleNameMapper } = require('ts-jest/utils');
// const { compilerOptions } = require('./tsconfig');
//
// module.exports = {
//   preset: 'jest-preset-angular',
//   roots: ['<rootDir>/src/'],
//   testMatch: ['**/+(*.)+(spec).+(ts)'],
//   setupFilesAfterEnv: ['<rootDir>/src/test.ts'],
//   collectCoverage: true,
//   coverageReporters: ['html'],
//   coverageDirectory: 'coverage/my-app',
//   moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, {
//     prefix: '<rootDir>/'
//   })
// };

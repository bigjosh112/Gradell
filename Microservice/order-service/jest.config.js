module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src', '<rootDir>/tests'],
    testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    testTimeout: 50000,
    transform: {
        '^.+\\.ts$': ['ts-jest', {
        
        }]
      },
      maxWorkers: 2,
  };
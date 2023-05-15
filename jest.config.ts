export default {
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/app/$1',
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/mockdatatest.ts'],
  collectCoverageFrom: ['src/**/*.ts'],
  coverageDirectory: 'coverage',
  testTimeout: 30000,
  setupFiles: ['dotenv/config'],  
}

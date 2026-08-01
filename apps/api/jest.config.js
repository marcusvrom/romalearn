/** Testes unitários e de integração leve (sem banco). */
module.exports = {
  rootDir: '.',
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '.*\\.spec\\.ts$',
  transform: { '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.spec.json' }] },
  moduleNameMapper: {
    '^@romalearn/contracts$': '<rootDir>/../../packages/contracts/src/index.ts',
  },
  collectCoverageFrom: ['src/**/*.(t|j)s', '!src/**/*.module.ts', '!src/database/migrations/**'],
  coverageDirectory: './coverage',
};

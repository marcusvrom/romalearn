/**
 * Testes de integração e end-to-end — exigem um PostgreSQL acessível.
 * Consulte docs/testing.md para preparar o banco de testes.
 */
module.exports = {
  rootDir: '.',
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '.*\\.e2e-spec\\.ts$',
  transform: { '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.spec.json' }] },
  moduleNameMapper: {
    '^@romalearn/contracts$': '<rootDir>/../../packages/contracts/src/index.ts',
  },
  setupFiles: ['<rootDir>/test/setup-env.ts'],
  testTimeout: 60000,
  maxWorkers: 1,
};

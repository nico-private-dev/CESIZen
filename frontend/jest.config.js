module.exports = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    // Gérer les imports de fichiers statiques
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/src/tests/__mocks__/fileMock.js',
    '\\.(css|less|scss|sass)$': '<rootDir>/src/tests/__mocks__/styleMock.js'
  },
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.js'],
  testPathIgnorePatterns: ['/node_modules/', '/cypress/'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
    '^.+\\.(ts|tsx)$': 'babel-jest'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!react-router|react-router-dom)/'
  ]
};

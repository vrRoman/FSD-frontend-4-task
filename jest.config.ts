export default {
  clearMocks: true,
  coverageDirectory: 'coverage',
  roots: ['src'],
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '^Model$': '<rootDir>/src/modules/Model',
    '^View$': '<rootDir>/src/modules/View',
    '^Presenter$': '<rootDir>/src/modules/Presenter',
  },
};

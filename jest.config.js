module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  rootDir: 'src',
  setupFilesAfterEnv: ["./test-setup.ts"],
};

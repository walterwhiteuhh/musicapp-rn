module.exports = {
  extends: ['expo'],
  ignorePatterns: ['node_modules/', '.expo/', 'dist/', 'coverage/'],
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
};

const withSass = require('@zeit/next-sass');
const withTM = require('next-plugin-transpile-modules');

module.exports = withTM(withSass({
  transpileModules: ['react-bulma-components'],
  sassLoaderOptions: {
    includePaths: ['node_modules', 'src'],
  },
}));

module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: false
  },
  devServer: {
    https: true,
    port: 6464
  },
  webpack: {
    rules: {
      'sass-css': {
        modules: true,
        localIdentName: '[name]__[local]__[hash:base64:5]'
      }
    }
  }
}

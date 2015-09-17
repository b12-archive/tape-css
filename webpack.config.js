module.exports = {
  entry: './test/runner.js',

  output: {
    path: __dirname + '/.webpack',
    filename: 'runner.js',
  },

  module: {loaders: [{
    loader: 'babel-loader?optional[]=es7.functionBind',
    test: /\.js$/,
    exclude: /\/node_modules\//,
  }]},

  resolve: {alias: {
    'jsdom': 'blank-module',
    'xmldom': 'blank-module',
  }},

  node: {
    fs: 'empty',
  },

  devtool: 'source-map',
};

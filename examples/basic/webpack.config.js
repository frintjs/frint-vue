module.exports = {
  entry: './src/index.js',
  output: {
    path: __dirname + '/build/js',
    filename: 'bundle.js',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/,
      },
    ]
  },
  externals: {},
}

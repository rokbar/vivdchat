module.exports = {
  entry: [
    './src/app/index.js'
  ],
  devtool: 'inline-source-maps',
  output: {
    path: __dirname + '/public/assets',
    publicPath: '/assets',
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['react', 'es2015', 'stage-1']
      }
    }]
  },
  resolve: {
    extensions: ['.', '.js', '.jsx']
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './'
  }
};
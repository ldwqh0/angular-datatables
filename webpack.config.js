var path = require('path')
let ExtractTextPlugin = require('extract-text-webpack-plugin')
module.exports = {
  entry: {
    "angular-ui-datatables": path.resolve(__dirname, './src/ng-table')
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
    libraryTarget: 'umd'
  },
  externals: {
    angular: "angular"
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    }, {
      test: /\.html$/,
      loader: 'html-loader'
    }, {
      test: /\.less$/,
      loader: ExtractTextPlugin.extract(['css-loader', 'less-loader'])
    }]
  },
  plugins: [new ExtractTextPlugin({filename: 'style.css'})]
}

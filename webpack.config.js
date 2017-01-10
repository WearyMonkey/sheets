const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractCSS = new ExtractTextPlugin('[name].css');

module.exports = {
  resolve: {
    root: path.join(__dirname, 'app')
  },
  entry: ['index'],
  module: {
    loaders: [
      {
        test: /\.(css|scss)$/,
        loader: extractCSS.extract(['css?modules', 'sass'])
      },
      {
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: /node_modules/
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: "/",
    filename: "bundle.js"
  },
  plugins: [
    extractCSS,
    new HtmlWebpackPlugin({
      title: 'Sheets',
      template: 'app/index.ejs'
    })
  ],
  devServer: {
    port: 9999
  },
  devtool: 'eval'
};
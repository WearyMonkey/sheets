const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const FlowWebpackPlugin = require('./flow-webpack-plugin');

const flowWebpackPlugin = new FlowWebpackPlugin({
  srcPath: __dirname,
  cachePath: path.join(__dirname, '.flowcache')
});
const extractCSS = new ExtractTextPlugin('[name].css', { allChunks: true });

module.exports = {
  resolve: {
    root: path.join(__dirname, 'app'),
    extensions: ['.scss', '.jsx', '.js', '']
  },
  entry: ['index'],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel', flowWebpackPlugin.loader()],
        exclude: /node_modules/
      },
      {
        test: /\.(css|scss)$/,
        loaders: [
          flowWebpackPlugin.loader(),
          ...extractCSS.extract(['css?modules', 'sass']).split('!')
        ]
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
    flowWebpackPlugin
  ],
  devServer: {
    port: 9999
  },
  devtool: 'eval'
};

console.log(module.exports.module.loaders[1].loaders);
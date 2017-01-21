const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const FlowWebpackPlugin = require('./flow-webpack-plugin');

const flowWebpackPlugin = new FlowWebpackPlugin({
  srcPath: __dirname,
  cachePath: path.join(__dirname, '.flowcache')
});
const extractCSS = new ExtractTextPlugin('[name].css');

module.exports = {
  resolve: {
    modules: [path.join(__dirname, 'app'), 'node_modules'],
    extensions: ['.jsx', '.js']
  },
  entry: ['index.js'],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
          flowWebpackPlugin.loader()
        ],
      },
      {
        test: /\.(css|scss)$/,
        use: [
          flowWebpackPlugin.loader(),
          ...extractCSS.extract(['css-loader?modules', 'sass-loader']).split('!')
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
    new HtmlWebpackPlugin({
      template: 'app/index.ejs'
    }),
    extractCSS,
    flowWebpackPlugin
  ],
  devServer: {
    port: 9999,
    inline: false
  },
  devtool: 'eval'
};
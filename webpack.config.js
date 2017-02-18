const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');

const extractCSS = new ExtractTextPlugin('[name].css');

module.exports = {
  resolve: {
    modules: [path.join(__dirname, 'app'), 'node_modules'],
    extensions: ['.tsx', '.ts', '.js', '.jsx']
  },
  entry: ['index.tsx'],
  module: {
    rules: [
      {
        test: [/\.tsx?$/],
        exclude: /node_modules/,
        use: [{
          loader: 'ts-loader'
        }],
      },
      {
        test: /\.(css|scss)$/,
        exclude: /node_modules/,
        use: extractCSS.extract(['css-loader?modules'])
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
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': '"production"'
      }
    }),
  ],
  devServer: {
    port: 9999,
    inline: false
  },
  devtool: 'inline-source-map'
};
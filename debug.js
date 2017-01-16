var webpack = require('webpack');
var config = require('./webpack.config.js');
var compiler = new webpack(config);

compiler.run(function(error, stats) {
  console.log(error);
});

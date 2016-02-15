var path = require('path');

var srcpath = path.resolve(__dirname,'./src');

module.exports = {
  entry: {
    bundle: ['./src/main.js']
  },
  output: {
    path: path.resolve(__dirname,'./build'),
    filename: '[name].js'
  },
  module: {
    loaders:[
      { test: /\.js[x]?$/, exclude: /node_modules/, loader: 'babel-loader?presets[]=es2015&presets[]=react' },
      { test: /\.css$/, loader: 'style-loader!css-loader?modules' }
    ]
  }
};

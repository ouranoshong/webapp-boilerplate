var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var srcpath = path.resolve(__dirname, './src');

module.exports = {
    entry: {
        bundle: ['./src/main.js']
    },
    output: {
        path: path.resolve(__dirname, './build'),
        filename: '[name].js'
    },
    module: {
        loaders: [{
            test: /\.js[x]?$/,
            exclude: /node_modules/,
            loader: 'react-hot-loader!babel-loader?presets[]=es2015&presets[]=react',
	    include: scrpath
        }, {
            test: /\.css$/,
            loader: 'style-loader!css-loader?modules'
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(srcpath, 'index.html')
        })
    ]
};

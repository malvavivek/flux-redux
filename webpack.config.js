var webpack = require('webpack');
module.exports = {
    entry: './src/control-panel.js',
    output: {
       
        filename: 'main.js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
        }]
    }
};
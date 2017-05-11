'use strict';

const pkg = require('./package.json');
const data = require('./data');

const webpack = require('webpack');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const htmlIndex = new HtmlWebpackPlugin({
    template: path.resolve(__dirname, './index.html'),
});
const extractCss = new ExtractTextPlugin('bundle.css');

module.exports = {

    entry: path.resolve(__dirname, './src/index.js'),

    output: {
        path: path.resolve(__dirname, './build'),
        filename: 'bundle.js'
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'es3ify-loader!babel-loader!eslint-loader'
            },
            {
                test: /\.styl$/,
                exclude: /node_modules/,
                loader: extractCss.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'autoprefixer-loader?browsers=last 2 version', 'stylus-loader']
                })
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                exclude: /node_modules/,
                loader: 'url-loader?limit=1024&name=[name].[ext]',
            },
            {
                test: /\.html$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'html-loader'
                    },
                    {
                        loader: 'ejs-html-loader',
                        options: data
                    }
                ]
            }
        ]
    },

    plugins: [
        extractCss,
        htmlIndex,
        new webpack.DefinePlugin({
            VERSION: JSON.stringify(pkg.version)
        })
    ]
};

'use strict';

const webpack = require('webpack');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const utils = require('../../utils');

const htmlIndex = new HtmlWebpackPlugin({
    template: utils.destinationPath('./index.html')
});
const extractCss = new ExtractTextPlugin('bundle.css');

module.exports = {

    entry: utils.destinationPath('./src/index.js'),

    output: {
        path: utils.destinationPath('./build'),
        filename: 'bundle.js'
    },

    resolve: {
        modules: [utils.currentPath('node_modules'), 'node_modules']
    },

    resolveLoader: {
        modules: [utils.currentPath('node_modules'), 'node_modules']
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: [/node_modules/, /lib/],
                use: [
                    {
                        loader: 'es3ify-loader'
                    },
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                [
                                    require.resolve('babel-preset-es2015'),
                                    {
                                        'loose': true
                                    }
                                ]
                            ],
                            plugins: [
                                require.resolve('babel-plugin-add-module-exports')
                            ]
                        }
                    },
                    {
                        loader: 'eslint-loader'
                    }
                ]
            },
            {
                test: /\.less$/,
                exclude: /node_modules/,
                loader: extractCss.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'autoprefixer-loader?browsers=last 2 version', 'less-loader']
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
                        options: require(utils.destinationPath('./data'))
                    }
                ]
            }
        ]
    },

    plugins: [
        extractCss,
        htmlIndex
    ]
};

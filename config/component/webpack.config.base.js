'use strict';

const webpack = require('webpack');
const path = require('path');

const utils = require('../../utils');

module.exports = {

    entry: utils.destinationPath('./src/index.js'),

    output: {
        path: utils.destinationPath('./build'),
        filename: 'bundle.js',
        library: 'TEMP',
        libraryTarget: 'umd'
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
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'es3ify-loader'
                    },
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['es2015'].map((item) => {
                                return require.resolve('babel-preset-' + item);
                            }),
                            plugins: ['add-module-exports'].map((item) => {
                                return require.resolve('babel-plugin-' + item);
                            })
                        }
                    },
                    {
                        loader: 'eslint-loader'
                    }
                ]
            },
            {
                test: /\.styl$/,
                exclude: /node_modules/,
                loader: 'style-loader!css-loader!autoprefixer-loader?browsers=last 2 version!stylus-loader'
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                exclude: /node_modules/,
                loader: 'url-loader?limit=1024&name=[name].[ext]',
            }
        ]
    },

    plugins: []
};

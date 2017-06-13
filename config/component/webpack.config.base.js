'use strict';

const webpack = require('webpack');
const path = require('path');

const utils = require('../../utils');

module.exports = {

    entry: utils.destinationPath('./src/index.js'),

    output: {
        path: utils.destinationPath('./build'),
        filename: 'bundle.js',
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
                    }
                    // {
                    //     loader: 'eslint-loader'
                    // }
                ]
            },
            {
                test: /\.less$/,
                exclude: /node_modules/,
                loader: 'style-loader!css-loader!postcss-loader?browsers=last 2 version!less-loader'
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

'use strict';

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const baseConfig = require('./webpack.config.base.js');
const utils = require('../../utils');

baseConfig.devtool = 'cheap-source-map';

baseConfig.entry = utils.destinationPath('./development/index.js');

(baseConfig.plugins || (baseConfig.plugins = [])).push(
    new webpack.DefinePlugin({
        DEVELOPMENT: true
    }),
    new HtmlWebpackPlugin({
        template: utils.destinationPath('./development/index.html')
    })
);

module.exports = baseConfig;

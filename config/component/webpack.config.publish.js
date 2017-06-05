'use strict';

const webpack = require('webpack');
const baseConfig = require('./webpack.config.base.js');

(baseConfig.plugins || (baseConfig.plugins = [])).push(
    new webpack.DefinePlugin({
        DEVELOPMENT: false
    }),
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false,
            properties: false
        },
        output: {
            keep_quoted_props: true
        },
        mangle: {
            screw_ie8: false,
            except: ['e']
        }
    })
)

module.exports = baseConfig;
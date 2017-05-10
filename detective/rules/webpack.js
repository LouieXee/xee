'use strict';

const moduleDetect = require('../detective.js');

module.exports = moduleDetect({
    module: 'webpack',
    tips: 'Webpack should be installed globally',
    version: '2.x'
});

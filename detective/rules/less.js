'use strict';

const moduleDetect = require('../detective.js');

module.exports = moduleDetect({
    module: 'less',
    tips: 'Less should be installed globally'
});

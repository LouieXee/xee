'use strict';

const moduleDetect = require('../detective.js');

module.exports = moduleDetect({
    module: 'eslint',
    tips: 'Eslint should be installed globally'
});

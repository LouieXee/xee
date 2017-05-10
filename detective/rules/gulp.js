'use strict';

const moduleDetect = require('../detective.js');

module.exports = moduleDetect({
    module: 'gulp',
    tips: 'Gulp should be installed globally'
});

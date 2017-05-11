#!/usr/bin/nev node

'use strict';

require('../gulpfile');

const commander = require('commander');
const gulp = require('gulp');

commander.parse(process.argv);

let task = commander.args[0];

task && gulp.start(task);

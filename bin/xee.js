#!/usr/bin/env node

'use strict';

const pkg = require('../package.json');
const generate = require ('../template');

const spawn = require('child_process').spawn;

const commander = require('commander');

commander.version(pkg.version);

commander.usage('[commands] [options]');

commander
    .command('init')
    .option('-c, --component', 'initialize component development environment')
    .option('-p, --project', 'initialize project development environment')
    .description('initialize your development environment')
    .action(function (option) {
        if (option.project) {
            generate('project');
        } else if (option.component) {
            generate('component');
        }
    });

commander
    .command('detective')
    .description('detect the dependencies on your system')
    .action(function () {

    });

commander
    .command('serve')
    .description('development your code')
    .action(function () {
        _exec('npm', ['run', 'serve']);
    });

commander
    .command('build')
    .description('build your code')
    .action(function () {
        _exec('npm', ['run', 'build'])
    });

commander.parse(process.argv);

function _exec (cmd, args) {
    return spawn(process.platform == 'win32' ? cmd + '.cmd' : cmd, args || [], {
        stdio: 'inherit'
    })
}

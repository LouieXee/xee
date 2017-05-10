#!/usr/bin/env node

'use strict';

const pkg = require('../package.json');
const generate = require ('../template');
const detect = require('../detective');
const utils = require('../utils');

const commander = require('commander');
const chalk = require('chalk');
const semver = require('semver');
const latestVersion = require('latest-version');

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
        } else {
            generate('component');
        }
    });

commander
    .command('detect')
    .description('detect the dependencies on your system')
    .action(function () {
        detectLatestVersion()
        detect();
    });

commander
    .command('serve')
    .description('development your code')
    .action(function () {
        utils.exec('npm', ['run', 'serve']);
    });

commander
    .command('build')
    .option('-n, --node', 'build your code into node modules')
    .option('-f, --file', 'build your code into a single file')
    .description('build your code')
    .action(function (option) {
        if (option.file) {
            utils.exec('npm', ['run', 'pack'])
        } else {
            utils.exec('npm', ['run', 'build'])
        }
    });

commander
    .command('test')
    .description('test your code')
    .action(function () {
        utils.exec('npm', ['run', 'test'])
    });

commander.parse(process.argv);

function detectLatestVersion () {
    latestVersion('xee').then(latest => {
        if (semver.lt(pkg.version, latest)) {
            console.log('Xee has a new version, please update xee.')
            console.log('You can try ' + chalk.yellow.bold('npm update xee -g'));
        }
    })
}

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
        .then(() => {
            detect();
        })
    });

commander
    .command('run [name]', 'run specified task');


commander.parse(process.argv);

function detectLatestVersion () {
    
    console.log('');
    console.log(chalk.blue.bold('Detecting if xee has a new version'));
    console.log('');

    return latestVersion('xee').then(latest => {
        if (semver.lt(pkg.version, latest)) {
            console.log('Xee has a new version, please update xee.')
            console.log('You can try ' + chalk.yellow.bold('npm update xee -g'));
        } else {
            console.log(chalk.green.bold('Your xee is the latest version!'))
        }
    }, () => {
        conosle.log(chalk.red.bold('Fail to check the latest version of xee'))
    })
}

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
        detectLatestVersion()
        .then(() => {
            if (option.project) {
                generate('project');
            } else if (option.component) {
                generate('component');
            }
        })
    });

commander
    .command('detect')
    .description('detect the dependencies on your system')
    .action(function () {
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
    .description('build your code')
    .action(function () {
        utils.exec('npm', ['run', 'build'])
    });

commander.parse(process.argv);

function detectLatestVersion () {
    return new Promise((resolve, reject) => {
        // latestVersion('xee').then(latest => {
        //     if (!semver.eq(pkg.version, latest)) {
        //         console.log('Xee has a new version, please update xee.')
        //         console.log('You can try ' + chalk.yellow.bold('npm update xee -g'));
        //     }

            resolve();
        // })
    });
}

'use strict';

const fs = require('fs');
const path = require('path');
const semver = require('semver');
const chalk = require('chalk');
const symbols = require('log-symbols');

const NODE_MODULES_PATH = path.resolve(process.execPath, '../node_modules');

module.exports = function (opt) {
    return {
        module: opt.module,
        verify () {
            return new Promise((resolve, reject) => {
                if (fs.existsSync(path.resolve(NODE_MODULES_PATH, opt.module))) {
                    let version = require(path.resolve(NODE_MODULES_PATH, opt.module, 'package.json')).version;
                    let target = semver.validRange(opt.version);

                    if (!opt.version || semver.satisfies(version, target)) {
                        resolve(symbols.success + ' ' + opt.tips);
                    } else {
                        resolve(symbols.error + ' ' + opt.module + ' require version ' + chalk.yellow.bold(target));
                    }
                } else {
                    reject(symbols.error + ' ' + opt.tips);
                }
            })
        }
    };
};

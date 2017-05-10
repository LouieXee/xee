'use strict';

const chalk = require('chalk');

const rules = require('./rules');

module.exports = function () {
    let needInstallArr = [];

    console.log('');
    console.log(chalk.underline.blue('Detecting dependencies on your system'));
    console.log('');

    Promise.all(rules.map(rule => {
        return rule.verify()
            .then(msg => {
                console.log(msg);
            }, err => {
                console.log(err);
                needInstallArr.push(rule.module);
            })
    })).then(() => {
        if (needInstallArr.length > 0) {
            console.log('');
            console.log(chalk.yellow.bold('You need to install dependencies first!'));
            console.log('You can try ' + chalk.yellow.bold('npm install -g ' + needInstallArr.join(' ')));
            console.log('');
        } else {
            console.log('');
            console.log(chalk.green.bold('Everything looks all right!'));
            console.log('');
        }
    })

};

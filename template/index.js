'use strict';

const path = require('path');

const chalk = require('chalk');
const inquirer = require('inquirer');
const memFs = require('mem-fs');
const editor = require('mem-fs-editor');

const utils = require('../utils');

const fs = editor.create(memFs.create());

const name = {
    component: 'Component',
    project: 'Project'
};

module.exports = function generate (type) {
    inquirer.prompt([
        {
            type: 'input',
            message: `${name[type]} name`,
            name: 'name',
            validate: function (input) {
                if (/^\w[\w\-]*\w$/.test(input)) {
                    return true;
                }

                return 'Name is not valid!';
            }
        },
        {
            type: 'input',
            message: 'Description',
            name: 'desc'
        },
        {
            type: 'input',
            message: 'Author',
            name: 'author',
            default: process.env['USER'] || process.env['USERNAME'] || ''
        },
        {
            type: 'input',
            message: 'Version',
            default: '1.0.0',
            name: 'version',
            validate: function (input) {
                if (/^\d+\.\d+\.\d+([\.\-\w])*$/.test(input)) {
                    return true;
                }

                return 'Version is not valid!';
            }
        }
    ]).then(answer => {
        return inquirer.prompt({
            type: 'confirm',
            message: '\n'  + JSON.stringify(answer, null, '\t') + '\nIs this ok?',
            name: 'result'
        }).then(isOk => {
            if (isOk.result) {
                return answer;
            } else {
                process.exit();
            }
        })

    }).then(answer => {
        if (type == 'component') {

            fs.copy(utils.currentPath('./template/component/src'), utils.destinationPath('src'));
            fs.copy(utils.currentPath('./template/component/res'), utils.destinationPath('res'));
            fs.copy(utils.currentPath('./template/component/test'), utils.destinationPath('test'));
            fs.copy(utils.currentPath('./template/component/.eslintrc'), utils.destinationPath('.eslintrc'));
            fs.copyTpl(utils.currentPath('./template/component/package.json'), utils.destinationPath('package.json'), answer)
            fs.copyTpl(utils.currentPath('./template/component/index.html'), utils.destinationPath('index.html'), answer)
            fs.write(utils.destinationPath('.gitignore'), `
                node_modules
                npm-debug.log
            `);

        } else if (type == 'project') {

            fs.copy(utils.currentPath('./template/project/src'), utils.destinationPath('src'));
            fs.copy(utils.currentPath('./template/project/res'), utils.destinationPath('res'));
            fs.copy(utils.currentPath('./template/project/data'), utils.destinationPath('data'));
            fs.copy(utils.currentPath('./template/project/.eslintrc'), utils.destinationPath('.eslintrc'));
            fs.copyTpl(utils.currentPath('./template/project/package.json'), utils.destinationPath('package.json'), answer)
            fs.copyTpl(utils.currentPath('./template/project/index.html'), utils.destinationPath('index.html'), answer)
            fs.write(utils.destinationPath('.gitignore'), `
                node_modules
                npm-debug.log
            `);

        }

        fs.commit(function () {
            // console.log('');
            // console.log(chalk.blue.bold('Start installing node modules!'));
            // console.log('');
            
            // utils.exec('npm', ['install']);
        });
    })

}

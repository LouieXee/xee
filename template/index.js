'use strict';

const path = require('path');

const inquirer = require('inquirer');
const memFs = require('mem-fs');
const editor = require('mem-fs-editor');

const fs = editor.create(memFs.create());

module.exports = function generate (type) {
    inquirer.prompt([
        {
            type: 'input',
            message: 'Component / Project name',
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

            fs.copy(templatePath('component/src'), destinationPath('src'));
            // fs.copy(templatePath('component/res'), destinationPath('res'));
            fs.copy(templatePath('component/.babelrc'), destinationPath('.babelrc'));
            fs.copy(templatePath('component/.gitignore'), destinationPath('.gitignore'));
            fs.copy(templatePath('component/gulpfile.js'), destinationPath('gulpfile.js'));
            fs.copy(templatePath('component/webpack.config.base.js'), destinationPath('webpack.config.base.js'));
            fs.copy(templatePath('component/webpack.config.development.js'), destinationPath('webpack.config.development.js'));
            fs.copy(templatePath('component/webpack.config.publish.js'), destinationPath('webpack.config.publish.js'));
            fs.copyTpl(templatePath('component/package.json'), destinationPath('package.json'), answer)
            fs.copyTpl(templatePath('component/index.html'), destinationPath('index.html'), answer)
            fs.commit(function () {
                
            });

        } else if (type == 'project') {
            
        }
    })

}

function templatePath (target) {
    return path.resolve(__dirname, target);
}

function destinationPath (target) {
    return path.resolve(process.cwd(), target);
}

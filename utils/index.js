'use strict';

const path = require('path');
const spawn = require('child_process').spawn;

const DESTINATION_PATH = process.cwd();

module.exports = {

    currentPath (target) {
        return path.resolve(__dirname, '../', target);
    },

    destinationPath (target) {
        return path.resolve(DESTINATION_PATH, target);
    },

    exec (cmd, args) {
        spawn(process.platform == 'win32' ? cmd + '.cmd' : cmd, args || [], {
            stdio: 'inherit',
            stderr: 'inherit'
        })
    }

};

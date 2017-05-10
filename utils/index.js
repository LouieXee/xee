'use strict';

const spawn = require('child_process').spawn;

module.exports = {

    exec (cmd, args) {
        spawn(process.platform == 'win32' ? cmd + '.cmd' : cmd, args || [], {
            stdio: 'inherit',
            stderr: 'inherit'
        })
    }

};

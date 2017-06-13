'use strict';

const path = require('path');
const spawn = require('child_process').spawn;

const DESTINATION_PATH = process.cwd();

module.exports = {

    isFunction (target) {
        return _getType(target) == '[object Function]';
    },

    isObject (target) {
        return _getType(target) == '[object Object]';
    },

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
    },

    camelCase (str) {
        return str.replace(/-([a-z])/g, function () {
            return RegExp.$1.toUpperCase();
        })
    }

};

function _getType (target) {
    return Object.prototype.toString.call(target);
}

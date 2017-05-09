'use strict';

const exec = require('child_process').exec;
const path = require('path');

const gulp = require('gulp');
const del = require('del');
const browserSync = require('browser-sync');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const ansiHtml = require('ansi-html');

gulp.task('clean', done => {
    return del(['./build/**/*']);
});

gulp.task('serve', () => {
    const bs = browserSync.create();
    const compiler = webpack(require('./webpack.config.development.js'));

    bs.init({
        server: true,
        files: ['./*.html'],
        middleware: [
            webpackDevMiddleware(compiler, {
                noInfo: false,
                stats: {
                    colors: true,
                    timings: true,
                    chunks: false
                }
            })
        ],
        plugins: [require('bs-fullscreen-message')]
    }, () => {
        compiler.plugin('done', stats => {
            if (stats.hasErrors() || stats.hasWarnings()) {
                return bs.sockets.emit('fullscreen:message', {
                    title: 'Webpack Error:',
                    body: ansiHtml(stats.toString()),
                    timeout: 100000
                });
            }
            bs.reload();
        })
    })

});

gulp.task('build', ['clean'], () => {
    return new Promise((resolve, reject) => {
        exec('webpack --config ./webpack.config.publish.js', () => {
            resolve();
        })
    })
})

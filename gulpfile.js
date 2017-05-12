'use strict';

const exec = require('child_process').exec;
const path = require('path');

const chalk = require('chalk');
const gulp = require('gulp');
const mocha = require('gulp-mocha');
const babel = require('gulp-babel');
const es3ify = require('gulp-es3ify');
const del = require('del');
const browserSync = require('browser-sync');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const ansiHtml = require('ansi-html');

const utils = require('./utils');

const MOCHA_TIMEOUT = 5000;

gulp.task('clean', () => {
    return del([utils.destinationPath('./build/**/*')]);
});

gulp.task('serve', () => {
    const bs = browserSync.create();
    const compiler = webpack(require(utils.destinationPath('./webpack.config.development.js')));

    bs.init({
        server: true,
        files: [utils.destinationPath('./*.html')],
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
    console.log(chalk.green.bold('start webpack-ing your files...'));

    let compiler = webpack(require(utils.destinationPath('./webpack.config.publish.js')));
    compiler.run(() => {
        console.log(chalk.green.bold('webpack your files successfully!'));
    })
})

gulp.task('es3', ['clean'], () => {
    console.log(chalk.green.bold('start es3ify-ing your files...'));
    return gulp.src(utils.destinationPath('./src/**/*.js'))
        .pipe(babel({
            presets: ['es2015'],
            plugins: [
                'babel-plugin-add-module-exports'
            ]
        }))
        .pipe(es3ify())
        .pipe(gulp.dest('build'))
        .on('end', function () {
            console.log(chalk.green.bold('es3ify your files successfully!'));
        });
})

gulp.task('test', done => {
    gulp.src(utils.destinationPath('test/**/*.js'))
    .pipe(mocha({
        timeout: MOCHA_TIMEOUT
    }))
    .once('error', () => {
        process.exit();
    })
    .once('end', () => {
        process.exit();
    })
})

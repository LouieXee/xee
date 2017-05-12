'use strict';

const exec = require('child_process').exec;
const path = require('path');
const fs = require('fs');

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
const assgin = require('object-assign');

const utils = require('./utils');
const destinationPkg = require(utils.destinationPath('./package.json'));
const destinationType = destinationPkg.xeeType;

const MOCHA_TIMEOUT = 5000;
const TYPE_PATH_CONFIG = {
    component: './config/component/',
    project: './config/project/'
};

gulp.task('clean', () => {
    return del([utils.destinationPath('./build/**/*')]);
});

gulp.task('serve', () => {
    let bs = browserSync.create();
    let customWebpackConfig = {};
    let customWebpackConfigPath = utils.destinationPath('./webpack.config.development.js');

    if (fs.existsSync(customWebpackConfigPath)) {
        customWebpackConfig = require(customWebpackConfigPath);
    }

    let compiler = webpack(assgin(
        require(utils.currentPath( TYPE_PATH_CONFIG[destinationType] + 'webpack.config.development.js')), 
        customWebpackConfig
    ));

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

    let customWebpackConfig = {};
    let customWebpackConfigPath = utils.destinationPath('./webpack.config.publish.js');

    if (fs.existsSync(customWebpackConfigPath)) {
        customWebpackConfig = require(customWebpackConfigPath);
    }

    destinationType == 'component' && (customWebpackConfig.output.library = destinationPkg.name);

    let compiler = webpack(assgin(
        require(utils.currentPath( TYPE_PATH_CONFIG[destinationType] + 'webpack.config.publish.js')), 
        customWebpackConfig
    ));

    compiler.run(() => {
        console.log(chalk.green.bold('webpack your files successfully!'));
    })
})

gulp.task('es3', ['clean'], () => {
    console.log(chalk.green.bold('start es3ify-ing your files...'));
    return gulp.src(utils.destinationPath('./src/**/*.js'))
        .pipe(babel({
            presets: ['es2015'].map((item) => {
                return require.resolve('babel-preset-' + item);
            }),
            plugins: ['add-module-exports'].map((item) => {
                return require.resolve('babel-plugin-' + item);
            })
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

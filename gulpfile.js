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

const utils = require('./utils');
const destinationPkg = require(utils.destinationPath('./package.json'));
const destinationType = destinationPkg.xeeConfig.type;

const MOCHA_TIMEOUT = 5000;
const TYPE_PATH_CONFIG = {
    component: './config/component/',
    project: './config/project/'
};
const NAMESPACE_REX_EXP = /^@(\w+)\/(\w+)$/;

gulp.task('clean', () => {
    return del([utils.destinationPath('./build/**/*')]);
});

gulp.task('serve', () => {
    let bs = browserSync.create();
    let compiler = _getCompiler('webpack.config.development.js');
    
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

    _getCompiler('webpack.config.publish.js').run(() => {
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

function _getCompiler (configPath) {
    let originWebpackConfig = require(utils.currentPath( TYPE_PATH_CONFIG[destinationType] + configPath));
    let customWebpackConfigPath = utils.destinationPath(configPath);

    if (destinationType == 'component') {
        let name = utils.camelCase(destinationPkg.name);
        
        if (NAMESPACE_REX_EXP.text(name)) {
            originWebpackConfig.library = [RegExp.$1, RegExp.$2];
        } else {
            originWebpackConfig.library = name;
        }

    }

    if (fs.existsSync(customWebpackConfigPath)) {
        let customWebpackConfig = require(customWebpackConfigPath);

        if (utils.isFunction(customWebpackConfig)) {
            return webpack(customWebpackConfig(originWebpackConfig));
        } else {
            return webpack(customWebpackConfig);
        }
    } else {
        return webpack(originWebpackConfig);
    }
}

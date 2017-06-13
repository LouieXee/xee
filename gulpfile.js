'use strict';

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
    let compiler = webpack(_getWebpackConfig('webpack.config.development.js'));
    
    bs.init({
        server: true,
        notify: false,
        online: false,
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
    })

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
});

gulp.task('build', ['clean'], () => {
    webpack(_getWebpackConfig('webpack.config.publish.js')).run((err, stats) => {
        console.log(stats.toString({
            colors: true
        }))
    })
})

gulp.task('es3', ['clean'], () => {
    console.log('');
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
        .on('data', function (chunk) {
            console.log(chalk.green.bold(chunk.history[0]))
        })
        .on('end', function () {
            console.log('')
            console.log('es3ify your files successfully!');
        })
        .on('error', e => {
            console.error(e);
        });
})

gulp.task('test', done => {
    gulp.src(utils.destinationPath('test/**/*.spec.js'))
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

function _getWebpackConfig (configPath) {
    let originBaseWebpackConfig = require(utils.currentPath(TYPE_PATH_CONFIG[destinationType] + 'webpack.config.base.js'));
    let customBaseWebpackConfigPath = utils.destinationPath('webpack.config.base.js');

    // 如果有base config文件则覆盖原来的base config文件
    if (fs.existsSync(customBaseWebpackConfigPath)) {
        handleConfig(require(customBaseWebpackConfigPath), originBaseWebpackConfig);
    }
    
    let originWebpackConfig = require(utils.currentPath(TYPE_PATH_CONFIG[destinationType] + configPath));
    let customWebpackConfigPath = utils.destinationPath(configPath);

    // 满足一定命名格式则声明组件命名空间
    if (destinationType == 'component') {
        let name = utils.camelCase(destinationPkg.name);
        
        if (NAMESPACE_REX_EXP.test(name)) {
            originWebpackConfig.output.library = [RegExp.$1, RegExp.$2];
        } else {
            originWebpackConfig.output.library = name;
        }
    }

    // 如果有目标config文件则覆盖原来的目标config文件
    if (fs.existsSync(customWebpackConfigPath)) {
        return handleConfig(require(customWebpackConfigPath), originWebpackConfig);
    }

    return originWebpackConfig;

    function handleConfig (customConfig, originConfig) {
        if (utils.isFunction(customConfig)) {
            return customConfig(originConfig);
        } else if (utils.isObject(customConfig)) {
            return customConfig;
        }
    }
}

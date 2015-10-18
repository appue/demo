var fs = require('fs'),
    argv = require('yargs').argv,
    os = require('os'),
    inject = require('gulp-inject');

var runType = argv.run || '', // dev、build
    packageType = argv.g || 'app';

module.exports = function (gulp, $) {

    gulp.task('tmpl', ['minjs'], function() {
        // gulp.start('connect');
    });
    
    gulp.task('dev', ['sass', 'connect', 'watch']);

    
    gulp.task('build', ['replacehtml', 'templates', 'movecss', 'moveimages', 'movefonts'], function() {
        gulp.start('tmpl');
    });

    gulp.task('run', ['clean'], function () {

        switch (runType) {
            case 'build':
                gulp.start('build'); //--打包测试
            break;

            default:
                gulp.start('dev'); //----开发调试任务启动
        }

    });

};
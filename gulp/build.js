var fs   = require('fs'),
    argv = require('yargs').argv,
    os   = require('os');

var getProject = require('./tools/folder.js'),
    buildFolder = require('./tools/build.folder.js')() || './build/';


var runType     = argv.run || '', // dev、build
    packageType = argv.g || 'app', // 默认打APP的包，如果要打H5的包就 --g web
    cssPath     = './source/themes',
    netPath     = '',
    d           = new Date(),
    version     = d.getTime(),
    veros       = os.platform();

switch (runType) {
    case 'build':
        netPort = argv.port || 8888;
        netPath = buildFolder;
    break;

    default: //--dev
        netPort = argv.port || 9999;
        netPath = './source/';
}

module.exports = function (gulp, $) {

    //拉取依赖框架
    gulp.task('bower', function() {
        return bower()
            .pipe(gulp.dest('lib/'))
    });

    gulp.task('sass', function() {

        return gulp.src('./source/themes/*.scss')
            .pipe($.plumber())
            .pipe($.sass())
            .pipe($.autoprefixer('last 3 version'))
            .pipe($.size({
                title: 'css--------------------------------'
            }))
            .pipe(gulp.dest(cssPath));
    });


    gulp.task('clean', function() {
        
        if (runType !== 'build') {
            return;
        }

        return gulp.src([
                buildFolder,
                './.tmp'
            ], {read: false})
            // .pipe($.clean());
            .pipe($.rimraf({ force: true })); 
    });


    gulp.task('connect', function() {

        var url = '';

        $.connect.server({
            root: netPath,
            port: netPort,
            livereload: true
        });

        switch (veros) {
            case 'win32':
                url = 'start http://localhost:' + netPort;
            break;

            case 'darwin':
                url = 'open http://localhost:' + netPort;
            break;
        }

        gulp.src('')
            .pipe($.shell(url));
    });
    

    gulp.task('watch', function() {

        $.livereload.listen();

        gulp.src('./source/themes/**/*.scss')
            .pipe($.plumber())
            .pipe($.watch('./source/themes/**/*.scss', function() {
                gulp.src('./source/themes/*.scss')
                    .pipe($.plumber())
                    .pipe($.sass())
                    .pipe($.autoprefixer('last 3 version'))
                    .pipe($.size({
                        title: 'css--------------------------------'
                    }))
                    .pipe(gulp.dest(cssPath))
                    .pipe($.livereload());
            }));


        gulp.src([
                './source/**/*.html',
                './source/**/*.js',
                '!./bower_components/**/*'
            ])
            .pipe($.watch([
                './source/**/*.html',
                './source/**/*.js',
                '!./source/bower_components/**/*'
            ]))
            .pipe($.livereload());

    });
    
    //--JS 注入到页面中
    gulp.task('inject', function() {
        return gulp.src('./source/index.html')
            .pipe(
                $.inject(
                    gulp.src('./source/common/**/*.js', {read: false}), { 
                        relative: true, 
                        name: 'injectcommon' 
                    }
                )
            )
            .pipe(
                $.inject(
                    gulp.src([
                            './source/**/*.js',
                            '!./**/app.js',
                            '!./source/common/**/*.js',
                            '!./source/lib/*',
                            '!./source/api/*',
                            '!./source/data/*',
                            '!./source/themes/*',
                            '!./source/bower_components/**/*'
                        ], 
                        {read: false}), {relative: true}
                )
            )
            .pipe(gulp.dest('./source/'));
    });

    
    //--html js 替换
    gulp.task('replacehtml', function() {
        var jsFiles = [
            'frame.js?v='+ version,
            'common.js?v='+ version,
            'index.js?v='+ version
        ];

        return gulp.src('./source/index.html')
            .pipe($.htmlReplace({
                'css': 'themes/all.css?v='+ version,
                'js': jsFiles
            }))
            .pipe(gulp.dest(buildFolder));
    });


    //--生成JS模板数据
    gulp.task('templates', function() {
        return gulp.src([
                './source/**/*.html',
                '!./source/index.html',
                '!./source/bower_components/**/*'
            ])
            .pipe($.ngHtml2js({
                moduleName: "Tjoys",
                prefix: ""
            }))
            .pipe(gulp.dest("./.tmp/"));
    });

    //--css 迁移
    gulp.task('movecss', function() {
        return gulp.src([
                './source/**/*.css',
                '!./source/bower_components/**/*'
            ])
            // .pipe($.minifyCss())
            .pipe(gulp.dest(buildFolder));
    });

    //字体文件
    gulp.task('movefonts', function() {
        return gulp.src([
                './source/themes/fonts/*'
            ])
            .pipe(gulp.dest(buildFolder+ '/themes/fonts'));
    });

    //--image 迁移
    gulp.task('moveimages', function() {
        return gulp.src([
                './source/**/*.jpg',
                './source/**/*.png',
                // '!./source/themes/temp/**/*',
                '!./source/themes/logo/**/*',
                '!./source/bower_components/**/*'
            ])
            .pipe(gulp.dest(buildFolder));
    });
    
    //--js 合并压缩
    gulp.task('minjs', function() {
        //--框架JS压缩合并
        var framejs = [
                './source/lib/md5.js',
                './source/lib/exif.js',
                './source/lib/megapix-image.js',

                './source/lib/angular.js',
                './source/lib/angular-touch.js',
                './source/lib/angular-route.js',
                './source/lib/angular-ui-router.js'
            ];

        gulp.src(framejs)
            .pipe($.concat('frame.js'))
            .pipe($.uglify())
            .pipe(gulp.dest(buildFolder));


        //--项目公共JS压缩、合并（包括公共模板数据）
        gulp.src([
                './source/app.js',
                
                './.tmp/common/**/*.js',
                './source/common/**/*.js'
            ])
            .pipe($.concat('common.js'))
            .pipe($.ngAnnotate())
            .pipe($.uglify())
            .pipe(gulp.dest(buildFolder));

        //--项目中的JS压缩、合并（包括项目模板数据）
        gulp.src([
                './.tmp/**/*.js',
                './source/**/*.js',

                '!./.tmp/common/**/*.js',

                '!./source/app.js',
                '!./source/lib/**/*.js',
                '!./source/common/**/*.js',
                '!./source/bower_components/**/*'
            ])
            .pipe($.concat('index.js'))
            .pipe($.ngAnnotate())
            .pipe($.uglify())
            .pipe(gulp.dest(buildFolder));
    });
};
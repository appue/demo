var gulp       = require('gulp'),
    watch      = require('gulp-watch'),
    connect    = require('gulp-connect'),
    plumber    = require('gulp-plumber'),
    inject     = require('gulp-inject'),
    livereload = require('gulp-livereload'),
    sass       = require('gulp-sass'),
    uglify     = require('gulp-uglify'),
    ngAnnotate = require('gulp-ng-annotate'),
    htmlReplace = require('gulp-html-replace'),
    concat     = require('gulp-concat');

gulp.task('inject', function () {
    return gulp.src('./source/index.html')
        .pipe(inject(gulp.src('./source/js/**/*.js', {read: false}), {relative: true}))
        .pipe(gulp.dest('./source/'));
});

gulp.task('sass', function() {
    return gulp.src('./source/themes/*.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(gulp.dest('./source/themes/'))
        .pipe(livereload());
});


gulp.task('connect', function () {
    connect.server({
        root: './source/',
        port: 9999,
        livereload: true
    });
});

gulp.task('watch', function () {
    watch('./source/themes/sass/*.scss', function() {
        return gulp.src('./source/themes/*.scss')
            .pipe(plumber())
            .pipe(sass())
            .pipe(gulp.dest('./source/themes/'))
            .pipe(livereload());
    });
});


gulp.task('minjs', function() {
    gulp.src([
            './source/lib/fastclick.js',
            './source/lib/angular.js',
            './source/lib/angular-touch.js',
            './source/lib/angular-ui-router.js'
        ])
        .pipe(concat('frame.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./build/'));

    gulp.src([
            './source/**/*.html',
            './source/**/*.png',
            './source/**/*.jpg',
            './source/**/*.css',
            '!./source/index.html'
        ])
        .pipe(gulp.dest('./build/'));

    gulp.src([
            './source/app.js',
            './source/js/**/*.js',
        ])
        .pipe(concat('index.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest('./build/'));

    gulp.src('./source/index.html')
        .pipe(htmlReplace({
            'js': [
                'frame.js',
                'index.js'
            ]
        }))
        .pipe(gulp.dest('./build/'));
});


gulp.task('run', ['sass', 'connect', 'watch']);


gulp.task('default', function (){
    return gulp.start('run');
});
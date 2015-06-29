var gulp = require('gulp'),
    watch = require('gulp-watch'),
    connect = require('gulp-connect'),
    plumber = require('gulp-plumber'),
    livereload = require('gulp-livereload'),
    sass = require('gulp-sass');


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

gulp.task('run', ['sass', 'connect', 'watch']);


gulp.task('default', function (){
    return gulp.start('run');
});
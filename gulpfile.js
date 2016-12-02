/**
 * Created by 15050971 on 2016/3/25.
 */

var gulp            = require('gulp');
var sass            = require('gulp-sass');
// var cssnano         = require('gulp-cssnano');
var autoprefixer      = require('gulp-autoprefixer');

var v = parseInt((new Date()).valueOf()*0.001);

gulp.task('sass', function () {
    return gulp.src('src/css/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            // browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./src/css'));
});

gulp.task('watch',function(){
    gulp.watch('src/style.scss',['sass']);
})



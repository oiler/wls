const gulp = require('gulp');
const babel = require('gulp-babel');
gulp.task('default', function() { 
    // source to dist
    gulp.src("src/*.js")
        .pipe(babel())
        .pipe(gulp.dest("dist"));
});
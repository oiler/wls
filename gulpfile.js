const gulp = require('gulp');
const babel = require('gulp-babel');
gulp.task('default', function() { 
    // source to dist
    gulp.src('src/*.js')
        .pipe(babel())
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
  //livereload.listen();
  gulp.watch('src/*.js', ['default']);
});


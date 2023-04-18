const gulp = require('gulp');
const ejs = require('gulp-ejs');
const rename = require('gulp-rename');

gulp.task('build', () => {
  return gulp.src('views/*.ejs')
    .pipe(ejs())
    .pipe(rename({ extname: '.html' }))
    .pipe(gulp.dest('public'));
});

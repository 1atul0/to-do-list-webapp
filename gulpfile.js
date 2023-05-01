const gulp = require('gulp');
const ejs = require('gulp-ejs');
const rename = require('gulp-rename');
const data={listTitle:'Today',newListItems:[]}

gulp.task('build', () => {
  return gulp.src('views/*.ejs')
    .pipe(ejs(data))
    .pipe(rename({ extname: '.html' }))
    .pipe(gulp.dest('public'));
});

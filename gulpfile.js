var gulp = require('gulp');
var customizeBootstrap = require('gulp-customize-bootstrap');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var jsmin = require('gulp-jsmin');
var rename = require('gulp-rename');
var uglifycss = require('gulp-uglifycss'); 
var imagemin = require('gulp-imagemin');
var jpegtran = require('imagemin-jpegtran');
var optipng = require('imagemin-optipng');
var svgo = require('imagemin-svgo');
var browserSync = require('browser-sync');
var watch = require('gulp-watch');

//Bootstrap
gulp.task('compileBootstrap', function() {
  return gulp.src('./node_modules/bootstrap/scss/bootstrap.scss')
    .pipe(customizeBootstrap('./dev/styles/scss/*.scss'))
    .pipe(sass())
    .pipe(uglifycss())
    .pipe(gulp.dest('./dist/css/'));
});


//SCSS
gulp.task('sass', function () {
  return gulp.src([
  	'./dev/styles/scss/**/*.scss',  	
    './node_modules/@fortawesome/fontawesome-free/scss/fontawesome.scss',  	    
    './node_modules/bootstrap-select/sass/bootstrap-select.scss',      	    
  	])
    .pipe(sass().on('error', sass.logError))
    .pipe(uglifycss())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./dist/css/'))
    .pipe(browserSync.stream());
});

gulp.task('imagemin', function() {
    return gulp.src('./dev/images/*')
        .pipe(imagemin([
          imagemin.jpegtran({progressive: true}),
          imagemin.optipng({optimizationLevel: 5}),
          imagemin.svgo({
              plugins: [
                  {removeViewBox: true},
                  {cleanupIDs: false}
              ]
          })
        ]))
        .pipe(gulp.dest('./dist/images'))
});

//Fonts
gulp.task('fonts', function() {
  return gulp.src('./node_modules/@fortawesome/fontawesome-free/webfonts/**/*')
  .pipe(gulp.dest('./dist/fonts'))
});

//Libs
gulp.task('lib', function(){
  return gulp.src([        
    './node_modules/jquery/dist/jquery.min.js',    
    './node_modules/bootstrap/dist/js/bootstrap.bundle.js',    
    './node_modules/bootstrap-select/dist/js/bootstrap-select.min.js',
    './node_modules/@fortawesome/fontawesome-free/js/all.min.js',
    './node_modules/@fortawesome/fontawesome-free/js/fontawesome.min.js',            
    './node_modules/ekko-lightbox/dist/ekko-lightbox.min.js',        
    ])
  .pipe(concat('lib.js'))
  .pipe(gulp.dest('./dist/js/'));
});

//JS
gulp.task('js', function(){
	return gulp.src(['./dev/js/functions_client.js'])
	.pipe(concat('app.js'))
	.pipe(jsmin())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('./dist/js/'));
});

//HTML
gulp.task('html', function() {
  return gulp.src([
    './dev/*.html',
    './dev/*.php',
    ])
  .pipe(gulp.dest('./dist/'));
});

gulp.task('default',['compileBootstrap', 'imagemin', 'sass', 'lib', 'js']);

// Watch
gulp.task('watch', function() {
  gulp.watch('./dev/images/**/*', ['imagemin']);
  gulp.watch('./dev/js/**/*.js', ['lib', 'js']);
  gulp.watch('./dev/styles/scss/*.scss', ['sass']);
  gulp.watch('./dev/*.html', ['html']);

  browserSync.init('dist/**/*', {
    server: { baseDir: 'dist' }
  });
});
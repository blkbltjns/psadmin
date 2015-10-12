'use strict';

var gulp = require('gulp');
var connect = require('gulp-connect'); // For live-reload
var open = require('gulp-open'); // For opening the webpage for live-reload
var browserify = require('browserify'); // lets you use require(..) in application for bundling
var reactify = require('reactify'); // transform for jsx used by browserify
var source = require('vinyl-source-stream'); // transforms browserify output into gulp-pipeable format
var concat = require('gulp-concat'); // combine js files
var lint = require('gulp-eslint'); // linter for js
var watch = require('gulp-watch');


var config = {
	port: 9005,
	devBaseUrl: 'http://localhost',
	paths: {
		html: './src/*.html',
		js: './src/**/*.js',
		images: './src/images/*',
		css: [
			'node_modules/bootstrap/dist/css/bootstrap.min.css',
			'node_modules/bootstrap/dist/css/bootstrap-theme.min.css',
			'node_modules/toastr/package/toastr.css'
		],
		dist: './dist',
		mainJs: './src/main.js'
	}
};

//Start a local development server
gulp.task('connect', function() {
	connect.server({
		root: ['dist'],
		port: config.port,
		base: config.devBaseUrl,
		livereload: true
	});
});

//Open the application in a browser
gulp.task('open', ['connect'], function() {
	gulp.src('dist/index.html')
		.pipe(open({ uri: config.devBaseUrl + ':' + config.port + '/' }));
});

//Copy html to dist
gulp.task('html' , function() {
	gulp.src(config.paths.html)
		.pipe(gulp.dest(config.paths.dist))
		.pipe(connect.reload());
});

//Copy js files to dist
gulp.task('js', function() {
	browserify(config.paths.mainJs)
		.transform(reactify)
		.bundle()
		.on('error', console.error.bind(console))
		.pipe(source('bundle.js'))
		.pipe(gulp.dest(config.paths.dist + '/scripts'))
		.pipe(connect.reload());
});

//Copy images to dist
gulp.task('images', function() {
	gulp.src(config.paths.images)
		.pipe(gulp.dest(config.paths.dist + '/images'))
		.pipe(connect.reload());
});

//Copy css to dist
gulp.task('css', function() {
	gulp.src(config.paths.css)
		.pipe(concat('bundle.css'))
		.pipe(gulp.dest(config.paths.dist + '/css'))
});

//Lint all javascript in source folders
gulp.task('lint', function() {
	return gulp.src(config.paths.js)
		.pipe(lint({config: 'eslint.config.json'}))
		.pipe(lint.format());
});

//Watch for changes to source files and run applicable gulp tasks when they change
gulp.task('watch', function() {
	//watch(config.paths.html, ['html']);
	//watch(config.paths.images, ['images']);
	watch(config.paths.js, function() {
		gulp.start('js');
		gulp.start('lint');
	});

	//watch(config.paths.css, ['css'])
});

//Default task. Builds to dist, starts a server, and opens a browser isntance
gulp.task('default', ['html', 'js', 'images', 'css', 'lint', 'open', 'watch']);
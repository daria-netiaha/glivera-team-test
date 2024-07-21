const
	gulp = require('gulp'),

	htmlclean = require('gulp-htmlclean'),
	htmlreplace = require('gulp-html-replace'),

	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	csscomb = require('gulp-csscomb'),
	cssmin = require('gulp-cssmin'),

	babel = require('gulp-babel'),
	uglify = require('gulp-uglify'),

	imagemin = require('gulp-imagemin'),

	clean = require('gulp-clean'),
	rename = require('gulp-rename'),
	newer = require('gulp-newer'),
	runSequence = require('run-sequence'),
	browserSync = require('browser-sync')

config = {
	src: {
		html: 'src',
		css: 'src/css',
		js: 'src/js',
		img: 'src/images',
		fonts: 'src/fonts',
	},
	dev: {
		html: 'dev',
		css: 'dev/css',
		js: 'dev/js',
		img: 'dev/images',
		fonts: 'dev/fonts',
	},
	build: {
		html: 'build',
		css: 'build/css',
		js: 'build/js',
		img: 'build/images',
		fonts: 'build/fonts',
	}
}

// DEV
gulp.task('dev-html', () =>
	gulp.src(config.src.html + '/*.html')
		.pipe(newer(config.dev.html))
		.pipe(gulp.dest(config.dev.html))
		.pipe(browserSync.reload({ stream: true }))
);
gulp.task('dev-css', () =>
	gulp.src(config.src.css + '/**/*.{scss,css}')
		.pipe(newer(config.dev.css))
		.pipe(sass()).on("error", error => console.log(error))
		.pipe(cssmin())
		.pipe(gulp.dest(config.dev.css))
		.pipe(browserSync.reload({ stream: true }))
);
gulp.task('dev-js', () =>
	gulp.src(config.src.js + '/**')
		.pipe(newer(config.dev.js))
		.pipe(gulp.dest(config.dev.js))
		.pipe(browserSync.reload({ stream: true }))
);
gulp.task('dev-img', () =>
	gulp.src(config.src.img + '/**')
		.pipe(newer(config.dev.img))
		.pipe(gulp.dest(config.dev.img))
		.pipe(browserSync.reload({ stream: true }))
);
gulp.task('dev-fonts', () =>
	gulp.src(config.src.fonts + '/**')
		.pipe(gulp.dest(config.dev.fonts))
);


// BUILD TASK
gulp.task('build-clean', () =>
	gulp.src(config.build.html + '/**', { read: false })
		.pipe(clean())
);
gulp.task('build-html', () =>
	gulp.src(config.src.html + '/*.html')
		.pipe(htmlreplace({
			css: 'css/main.min.css',
			css: [
				'css/basic.min.css',
				'css/main.min.css'
			],
			js: [
				'js/calculator-js.js',
				'js/forms.js',
				'js/main.js',
			],
			js: 'js/main.min.js'
		}))
		.pipe(htmlclean())
		.pipe(gulp.dest(config.build.html))
);
gulp.task('build-css', () =>
	gulp.src(config.src.css + '/**/*.{scss,css}')
		.pipe(sass())
		.pipe(autoprefixer({ browsers: ['last 4 versions'] }))
		.pipe(cssmin())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(config.build.css))
);
gulp.task('build-js', () =>
	gulp.src([config.src.js + '/**/*.js', '!' + config.src.js + '/main.js'])
		.pipe(gulp.dest(config.build.js))
);
gulp.task('build-main-js', () =>
	gulp.src(config.src.js + '/main.js')
		.pipe(babel({ presets: ['es2015'] }))
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(config.build.js))
);
gulp.task('build-img', () =>
	gulp.src(config.src.img + '/**/*.{png,jpg,gif,svg,ico}')
		.pipe(imagemin())
		.pipe(gulp.dest(config.build.img))
);
gulp.task('build-fonts', () =>
	gulp.src(config.src.fonts + '/**')
		.pipe(gulp.dest(config.build.fonts))
);

gulp.task('browser-sync', () =>
	browserSync.init({
		server: {
			baseDir: "./dev",
			directory: true
		},
		port: 8081,
	})
);

gulp.task('default', ['dev-html', 'dev-css', 'dev-js', 'dev-img', 'dev-fonts', 'browser-sync'], () => {
	gulp.watch(config.src.html + '/*.html', ['dev-html']);
	gulp.watch(config.src.css + '/**', ['dev-css']);
	gulp.watch(config.src.js + '/**', ['dev-js']);
	gulp.watch(config.src.img + '/**', ['dev-img']);
});

gulp.task('build', () =>
	runSequence(
		'build-clean',
		['build-html', 'build-css', 'build-main-js', 'build-js', 'build-fonts'],
		'build-img',
		() => console.log('BUILD FINISHED!')
	)
);

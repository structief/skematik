var gulp = require('gulp'),
    minifyCss = require('gulp-minify-css'),
    uglify = require('gulp-uglifyjs'),
    uglifycss = require('gulp-uglifycss'),
    concat = require('gulp-concat'),
    version = require('gulp-version-number'),
    inject = require('gulp-inject'),
    sass = require('gulp-sass'),
    bump = require('gulp-bump'),
    header = require('gulp-header'),
    pkg = require('./package.json'),
    mainBowerFiles = require('main-bower-files'),
    stripDebug = require('gulp-strip-debug'),
    gulpFilter = require('gulp-filter'),
    onError = function onError(err) {
        console.log(err);
    };
var config = {
    development: {
        root: '.',
        application: 'application',
        assets: 'assets'
    },
    prod: {
        root: '/',
        application: 'application',
        assets: 'assets'
    }, 
    env: "dev"
};
var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.v.app %>',
  ' * @compile-time: ' + new Date().toString(),
  ' */',
  ''].join('\n');

var scriptsFilter = gulpFilter(["**/*.js"]);

gulp.task("sass-compile", function(){
    gulp.src([
        config.development.assets + '/scss/stylesheet.scss',
        config.development.application + '/**/scss/*.scss'
    ])
    .pipe(sass().on('error', sass.logError))
    .pipe(concat({ path: 'skematik_stylesheets.css'}))
    .pipe(minifyCss({
        compatibility: 'ie8',
        keepSpecialComments: 0
    }))
    .pipe(uglifycss({
        "max-line-len": 80
    }))
    .pipe(header(banner, {pkg: pkg}))
    .pipe(gulp.dest(config.development.assets + '/css/minified'));

    //Update build-nr
    gulp.src(config.development.root + '/package.json')
    .pipe(bump({key: 'v.build', type: 'prerelease', preid: 'compile'}))
    .pipe(gulp.dest(config.development.root)); 
});

gulp.task('minify-css', ['sass-compile'], function(){
    var patterns = [
        config.development.assets + '/**/*.min.css',
        '!' + config.development.assets + '/css/*.css',
    ];
    //CSS - minify vendor css
    var stream = gulp.src(patterns)
    .pipe(minifyCss({
        compatibility: 'ie8',
        keepSpecialComments: 0
    }))    
    .pipe(header(banner, {pkg: pkg}))
    .pipe(concat({ path: 'skematik_vendor_stylesheets.css'}))
    .pipe(gulp.dest(config.development.assets + '/css/minified'));

    //Callback
    return stream;
});

gulp.task('minify-own-js', function(){
    // Globbing patterns
    var patterns = [
        "!" + config.development.application + '/**/*.template.js',
        config.development.application + '/app.module.js',
        config.development.application + '/app.settings.js', 
        config.development.application + '/**/*.js'
    ];

    //JS - minify own js
    return gulp.src(patterns)
        .pipe(uglify())
        .pipe(concat({ path: 'skematik_scripts.js'}))
        .pipe(header(banner, {pkg: pkg}))
        .pipe(gulp.dest(config.development.assets + '/js/minified'));
});

gulp.task('minify-vendor-js', function(){
    // Globbing patterns
    var patterns = [
        "!" + config.development.application + '/**/*.template.js',
        config.development.application + '/app.module.js',
        config.development.application + '/app.settings.js', 
        config.development.application + '/**/*.js'
    ];

    //JS - minify vendor js
    return gulp.src(mainBowerFiles())
        .pipe(scriptsFilter)
        .pipe(concat({ path: 'skematik_vendor_scripts.js'}))
        .pipe(uglify())
        .pipe(stripDebug())
        .pipe(header(banner, {pkg: pkg}))
        .pipe(gulp.dest(config.development.assets + '/js/minified'));
});

gulp.task('uglify', ['minify-css', 'minify-own-js', 'minify-vendor-js'], function(){
    //Uglify css
    gulp.src(config.development.assets + '/css/minified/*.css')
    .pipe(uglifycss({
        "max-line-len": 80
    }))
    .pipe(header(banner, {pkg: pkg}))
    .pipe(gulp.dest(config.development.assets + '/css/minified'));

    //Uglify js
    var stream = gulp.src(config.development.assets + '/js/minified/skematik_scripts.js')
    .pipe(uglify())
    .pipe(stripDebug())
    .pipe(gulp.dest(config.development.assets + '/js/minified'));

    //Callback
    return stream;
});

gulp.task("inject", function(){
    switch(config.env){
        case "prod":
        case "test":
            gulp.start("inject-minified");
            gulp.start("version");
            break;
        case "dev":
            gulp.start("inject-raw");
            break;
    }
});

gulp.task('inject-minified', ['minify-css', 'minify-own-js', 'minify-vendor-js', 'uglify'], function(){
    //Inject in header and footer
    var stream = gulp.src(config.development.root + '/*.html')
    .pipe(
        inject(
            gulp.src([
                config.development.assets + '/css/minified/*.*', 
                config.development.assets + '/js/minified/skematik_vendor_scripts.js',
                config.development.assets + '/js/minified/skematik_scripts.js',
            ], {read: false}
            )
        )
    )
    .pipe(gulp.dest(config.development.root + '/'));

    //Callback
    return stream;
});

gulp.task('inject-raw', function(){
    //Inject in header and footer
    var stream = gulp.src(config.development.root + '/*.html')
    .pipe(
        inject(
            gulp.src([
                config.development.root + '/bower_components/jquery/dist/jquery.min.js',
                config.development.root + '/bower_components/bootstrap/dist/js/bootstrap.min.js',
                config.development.root + '/bower_components/angular/angular.min.js',
                config.development.root + '/bower_components/angular-ui-router/release/angular-ui-router.min.js',
                config.development.root + '/bower_components/angular-resource/angular-resource.min.js',
                config.development.root + '/bower_components/angular-sanitize/angular-sanitize.min.js',
                config.development.root + '/bower_components/angular-jwt/dist/angular-jwt.min.js',
                config.development.root + '/bower_components/angular-hotkeys/build/hotkeys.min.js',
                ], {read: false}
            ), 
            {name: 'head'}
        )
    )
    .pipe(
        inject(
            gulp.src(
                [
                    config.development.assets + '/css/minified/skematik_vendor_stylesheets.css',
                    config.development.assets + '/css/minified/skematik_stylesheets.css',
                    config.development.assets + '/css/*.*', 
                    //config.development.assets + '/js/minified/skematik_vendor_scripts.js',
                    config.development.application + '/*.*',
                    "!" + config.development.application + '/**/*.template.js',
                    config.development.application + '/**/*.js',
                ],
                {read: false}
            )
        )
    )
    .pipe(gulp.dest(config.development.root + '/'));

    //Callback
    return stream;
});

gulp.task('version', ['inject-minified'], function () {
    gulp.src(config.development.root + '/*.html')
    .pipe(
        version({
            'value' : '%MDS%',
            'append': {
                'key': 'v',
                'cover': 1,
                'to': [
                    'js',
                    'css',
                ],
            },
        })
    )
    .pipe(gulp.dest(config.development.root + '/'));
});

gulp.task('bump-version', function(){
    switch(config.env){
        case "prod":
            var bump_type = "minor";
            break;
        case "test":
            var bump_type = "patch";
            break;
        case "dev":
            var bump_type = "patch";
            break;
    }
    gulp.src(config.development.root + '/package.json')
    .pipe(bump({key: 'v.app', type: bump_type}))
    .pipe(bump({key: 'v.build', type: bump_type}))
    .pipe(gulp.dest(config.development.root)); 
});

/* CHAIN TASKS */
gulp.task('prod', ['version-prod', 'minify-css', 'minify-own-js', 'minify-vendor-js', 'uglify', 'inject-minified']);
gulp.task('test', ['version-test', 'minify-css', 'minify-own-js', 'minify-vendor-js', 'inject']);
gulp.task('dev', ['version-dev', 'inject']);

/* WATCH .SCSS FILES FOR CHANGES */
gulp.task('watch', function(){
    config.env = "dev";
    gulp.watch([
        config.development.assets + '/scss/**/*.scss',
        config.development.application + '/**/scss/*.scss',
        ], ['sass-compile', 'inject']);
});

/* SET ENVIRONMENT AT START OF TASKS */
gulp.task('version-prod', function(){
    config.env = "prod"; 
    gulp.start("bump-version");   
});

gulp.task('version-test', function(){
    config.env = "test";    
    gulp.start("bump-version");
});

gulp.task('version-dev', function(){
    config.env = "dev";   
    gulp.start("bump-version"); 
});

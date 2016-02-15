var gulp = require("gulp");
var webpack = require("webpack-stream");
var browserSync = require('browser-sync').create();
var webpackConfig = require("./webpack.config.js");

gulp.task('serve', ["webpack:build-dev"], function() {
    browserSync.init({
        server: "./dist"
    });

    gulp.watch(["src/**/*"], ["webpack:build-dev"]).on('change', browserSync.reload);
});

gulp.task("default", ['serve']);

gulp.task("build-dev", ["webpack:build-dev"], function() {
    gulp.watch(["src/**/*"], ["webpack:build-dev"]);
});

gulp.task("build", ["webpack:build"]);

gulp.task("webpack:build", function(callback) {
    // modify some webpack config options
    var myConfig = Object.create(webpackConfig);
    myConfig.plugins = myConfig.plugins.concat(
        new webpack.DefinePlugin({
            "process.env": {
                // This has effect on the react lib size
                "NODE_ENV": JSON.stringify("production")
            }
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin()
    );

    return gulp.src('src/main.js')
        .pipe(webpack(myConfig))
        .pipe(gulp.dest('dist/'));
});

gulp.task("webpack:build-dev", function(callback) {
    // modify some webpack config options
    var myDevConfig = Object.create(webpackConfig);
    myDevConfig.devtool = "sourcemap";
    myDevConfig.debug = true;

    // create a single instance of the compiler to allow caching
    var devCompiler = webpack(myDevConfig);

    return gulp.src('src/main.js')
        .pipe(webpack(myDevConfig))
        .pipe(gulp.dest('dist/'));
});

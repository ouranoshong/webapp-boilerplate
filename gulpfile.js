var gulp = require("gulp");
var gutil = require("gulp-util");
var webpack = require("webpack");
var gulpPlugins = require("gulp-load-plugins")();
var browserSync = require('browser-sync').create();
var WebpackDevServer = require("webpack-dev-server");
var webpackConfig = require("./webpack.config.js");
var path = require('path');

var buildPath = path.resolve(__dirname, './build');
var sourcePath = path.resolve(__dirname, './src');

gulp.task('serve', ["webpack:build-dev"], function() {

    browserSync.init({
        host: "0.0.0.0",
        server: buildPath,
        open: false
    });

    gulp.watch(["src/**/*"], ["webpack:build-dev"]).on('change', browserSync.reload);
});

gulp.task("default", ["serve"]);

gulp.task("build-dev", ["webpack:build-dev"], function() {
    gulp.watch(["src/**/*"], ["webpack:build-dev"]);
});

// Production build
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

    // run webpack
    webpack(myConfig, function(err, stats) {
        if (err) throw new gutil.PluginError("webpack:build", err);
        gutil.log("[webpack:build]", stats.toString({
            colors: true
        }));
        callback();
    });
});

gulp.task("webpack:build-dev", function(callback) {
    var myDevConfig = Object.create(webpackConfig);
    myDevConfig.devtool = "sourcemap";
    myDevConfig.debug = true;

    // create a single instance of the compiler to allow caching
    var devCompiler = webpack(myDevConfig);
    // run webpack
    devCompiler.run(function(err, stats) {
        if (err) throw new gutil.PluginError("webpack:build-dev", err);
        gutil.log("[webpack:build-dev]", stats.toString({
            colors: true
        }));
        callback();
    });
});

gulp.task("webpack-dev-server", function(callback) {
    // modify some webpack config options
    var myConfig = Object.create(webpackConfig);
    myConfig.devtool = "eval";
    myConfig.debug = true;

    // Start a webpack-dev-server
    new WebpackDevServer(webpack(myConfig), {
        publicPath: "/" + myConfig.output.publicPath,
        stats: {
            colors: true
        }
    }).listen(8080, "localhost", function(err) {
        if (err) throw new gutil.PluginError("webpack-dev-server", err);
        gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
    });
});

gulp.task('clean', function() {
    return gulp.src("src/**/*", {
            read: false
        })
        .pipe(gulpPlugins.destClean(buildPath));
});

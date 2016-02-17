var gulp = require("gulp");
var gutil = require("gulp-util");
var webpack = require("webpack");
var gulpPlugins = require("gulp-load-plugins")();
var WebpackDevServer = require("webpack-dev-server");
var BrowserSyncPlugin = require("browser-sync-webpack-plugin");
var webpackConfig = require("./webpack.config.js");
var path = require('path');

var buildPath = path.resolve(__dirname, './build');
var sourcePath = path.resolve(__dirname, './src');

var browsersyncConfigs = {
    host: 'localhost',
    port: 3000,
    server: {
        baseDir: [buildPath]
    },
    open: false
};

gulp.task("default", ["webpack:build-dev"]);

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

    myDevConfig.plugins = myDevConfig.plugins.concat(
        new BrowserSyncPlugin(browsersyncConfigs)
    );

    // create a single instance of the compiler to allow caching
    var devCompiler = webpack(myDevConfig);
    // run webpack
    devCompiler.watch({ // watch options:
        aggregateTimeout: 300, // wait so long for more changes
        poll: true // use polling instead of native watchers
            // pass a number to set the polling interval
    }, function(err, stats) {
        if (err) throw new gutil.PluginError("webpack:build-dev", err);
        gutil.log("[webpack:build-dev]", stats.toString({
            colors: true
        }));
    });
});

gulp.task("webpack-dev-server", function(callback) {
    // modify some webpack config options
    var myConfig = Object.create(webpackConfig);
    var myBrowserSyncConfigs = Object.create(browsersyncConfigs);
    var serverConfigs = {
        host: 'localhost',
        port: 8000
    };
    myConfig.devtool = "eval";
    myConfig.debug = true;
    myConfig.entry.bundle.unshift(
        "webpack-dev-server/client?http://localhost:8000",
        "webpack/hot/dev-server"
    );
    
    myBrowserSyncConfigs.proxy = 'http://localhost:8000';

    myConfig.plugins = myConfig.plugins.concat(
        new BrowserSyncPlugin(myBrowserSyncConfigs, {
            reload: false,
            open: false
        }),
        new webpack.HotModuleReplacementPlugin()
    );

    // Start a webpack-dev-server
    new WebpackDevServer(webpack(myConfig), {
        publicPath: myConfig.output.publicPath,
        contentBase: myConfig.output.path,
        hot: true,
        inline: true,
        stats: {
            colors: true
        }
    }).listen(8000, "localhost", function(err) {
        if (err) throw new gutil.PluginError("webpack-dev-server", err);
        gutil.log("[webpack-dev-server]", "http://localhost:8000/index.html");
    });
});

gulp.task('clean', function() {
    return gulp.src("src/**/*", {
            read: false
        })
        .pipe(gulpPlugins.destClean(buildPath));
});

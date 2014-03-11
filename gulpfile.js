var gulp = require('gulp');

var EXPRESS_PORT = 9000;
var EXPRESS_ROOT = __dirname;
var LIVERELOAD_PORT = 35729;


function startExpress() {
    var express = require('express');
    var app = express();
    app.use(require('connect-livereload')());
    app.use(express.static(EXPRESS_ROOT));
    app.listen(EXPRESS_PORT);
}


var lr;
function startLivereload() {
    lr = require('tiny-lr')();
    lr.listen(LIVERELOAD_PORT);
}

// Notifies livereload of changes detected
// by `gulp.watch()`
function notifyLivereload(event) {
    // `gulp.watch()` events provide an absolute path
    // so we need to make it relative to the server root
    var fileName = require('path').relative(EXPRESS_ROOT, event.path);

    lr.changed({
        body: {
            files: [fileName]
        }
    });
}

// Default task that will be run
// when no parameter is provided
// to gulp
gulp.task('default', function () {
    startExpress();
    startLivereload();
    gulp.watch('viz/**/*.html', notifyLivereload);
    gulp.watch('viz/**/*.js', notifyLivereload);
    gulp.watch('viz/**/*.css', notifyLivereload);
});

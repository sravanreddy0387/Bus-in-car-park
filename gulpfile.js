var gulp = require("gulp");
var notify = require("gulp-notify");
var mocha = require("gulp-mocha");
var source = require("vinyl-source-stream");
var browserify = require("browserify");
var babelify = require("babelify");
var ngAnnotate = require("browserify-ngannotate");
var browserSync = require("browser-sync").create();
var rename = require("gulp-rename");
var templateCache = require("gulp-angular-templatecache");
var uglify = require("gulp-uglify");
var merge = require("merge-stream");
var util = require("gulp-util");
var autoprefixer = require("gulp-autoprefixer");
var minifycss = require("gulp-minify-css");
var plugins = require("gulp-load-plugins")();
// Where our files are located
var jsFiles = "src/js/**/*.js";
var viewFiles = "src/js/**/*.html";
var interceptErrors = function(error) {
  var args = Array.prototype.slice.call(arguments);
  // Send error to notification center with gulp-notify
  notify
    .onError({
      title: "Compile Error",
      message: "<%= error.message %>"
    })
    .apply(this, args);

  // Keep gulp from hanging on this task
  this.emit("end");
};

gulp.task("jshint", function() {
  return; /*gulp.src(jsFiles)
      .pipe(plugins.jshint({
        esnext: true // Enable ES6 support
      }))*/
  gulp
    .src(jsFiles)
    .pipe(
      jslint({
        /* this object represents the JSLint directives being passed down */
      })
    )
    .pipe(jslint.reporter("my-reporter"));
  //.pipe(jslint.reporter('jshint-stylish'));
});

gulp.task("browserify", ["views"], function() {
  return (
    browserify("./src/js/app.js")
      .transform(babelify, { presets: ["es2015"] })
      .transform(ngAnnotate)
      .bundle()
      .on("error", interceptErrors)
      //Pass desired output filename to vinyl-source-stream
      .pipe(source("main.js"))
      // Start piping stream to tasks!
      .pipe(gulp.dest("./build/js"))
  );
});

gulp.task("html", function() {
  return gulp
    .src("src/index.html")
    .on("error", interceptErrors)
    .pipe(gulp.dest("./build/"));
});

gulp.task("views", function() {
  return gulp
    .src(viewFiles)
    .pipe(
      templateCache({
        standalone: true
      })
    )
    .on("error", interceptErrors)
    .pipe(rename("app.templates.js"))
    .pipe(gulp.dest("./src/js/config/"));
});

// This task is used for building production ready
// minified JS/CSS files into the dist/ folder
gulp.task("build", ["html", "browserify", "jshint"], function() {
  var html = gulp.src("build/index.html").pipe(gulp.dest("./dist/"));

  var js = gulp
    .src("build/home.js")
    .pipe(uglify())
    .pipe(gulp.dest("./dist/"));

  return merge(html, js);
});

gulp.task("test", () =>
  gulp
    .src("spec/**.js", { read: false })
    .pipe(mocha({ reporter: "nyan", bail: true }))
);

gulp.task("default", ["html", "browserify", "jshint"], function() {
  gulp.watch("src/index.html", ["html"]);
  gulp.watch(viewFiles, ["views"]);
  gulp.watch(jsFiles, ["browserify"]);
});

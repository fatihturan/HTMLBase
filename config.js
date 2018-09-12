module.exports = {
  browserSync : {
    server: {
      baseDir: 'dist'
    },
    open: false,
    browser: "Google Chrome",
    notify: true,
    notify: {
        styles: {
            top: 'auto',
            bottom: '0',
            borderRadius: '4px 0 0 0',
            opacity: .9
        }
    },
    snippetOptions: {
      rule: {
        match: /<\/body>/i,
        fn: function (snippet, match) {
          return snippet + match;
        }
      }
    }
  },

  gulpLoadConfig : {
    rename: {
      'gulp-clean-css'    : 'clean',
      'gulp-file-include' : 'include'
    }
  },

  css : {
    src: "src/sass/*.scss",
    dist: "dist/css/"
  },

  js : {
    src: "src/js/*.js",
    dist: "dist/js/"
  },

  html : {
    src: "src/*.html",
    dist: "dist"
  },

  images : {
    src: "src/img/**/*",
    dist: "dist/img"
  },

  include: "src/includes/**/*.html",

  plugins : [
    "node_modules/jquery/dist/jquery.min.js",
    "node_modules/testingen/test.js"
  ]
}

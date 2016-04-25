/* jshint node:true */
'use strict';
// generated on 2015-02-18 using generator-gulp-webapp 0.2.0
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

function getUrltoFile (urlSource, fileName) {
  var http = require('http');
  var url = require('url');
  var options = {
      host: url.parse(urlSource).hostname,
      path: url.parse(urlSource).pathname + unescape(url.parse(urlSource).search || '')
  }
  console.log (options.path);
  var request = http.request(options, function (res) {
      var data = '';
      res.on('data', function (chunk) {
          data += chunk;
      });
      //console.log (data);
      res.on('end', function () {
        var fs = require('fs');
        fs.writeFile(fileName, data, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log(urlSource);
            console.log('writen to');
            console.log(fileName);
        });
      });
  });
  request.on('error', function (e) {
      console.log(e.message);
  });
  request.end();
}


function postDatatoFile (urlSource, postData, fileName) {
  var url = require('url');
  var querystring = require('querystring');
  var post_data = JSON.stringify(postData);
  var http = require('http');
  var options = {
      host: url.parse(urlSource).hostname,
      path: url.parse(urlSource).pathname + unescape(url.parse(urlSource).search),
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': post_data.length
      }
  }
  var request = http.request(options, function (res) {
      var data = '';
      res.on('data', function (chunk) {
          data += chunk;
      });
      res.on('end', function () {
        var fs = require('fs');
        fs.writeFile(fileName, data, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log(urlSource);
            console.log('post data writen to');
            console.log('fileName');
        }); 
      });
  });
  request.on('error', function (e) {
      console.log(e.message);
  });
  request.write(post_data);
  request.end();
}

gulp.task('styles', function () {
  return gulp.src('app/styles/main.scss')
    .pipe($.plumber())
    .pipe($.rubySass({
      style: 'expanded',
      precision: 10
    }))
    .pipe($.autoprefixer({browsers: ['last 1 version']}))
    .pipe(gulp.dest('.tmp/styles'));
});


gulp.task('origami', function () {
  getUrltoFile('http://build.origami.ft.com/bundles/js?modules=o-ft-header@^2.5.15,o-table@^1.6.0', './bower_components/origami/build.js');
  getUrltoFile ('http://build.origami.ft.com/bundles/css?modules=o-ft-header@^2.5.15,o-ft-footer@^2.0.4,o-table@^1.6.0', './bower_components/origami/build.scss');
});


gulp.task('ea', function () {
  var message = {};
  message.head = {};
  message.head.transactiontype = '10001';
  message.head.source = 'web';
  message.body = {};
  message.body.ielement = {};
  message.body.ielement.num = 25;
  //http://app003.ftmailbox.com/index.php/jsapi/get_last_publish_story?day=2015-6-17&

  //postDatatoFile('http://m.ftchinese.com/eaclient/apijson.php', message, './app/api/ea001.json');
  //postDatatoFile('http://m.ftchinese.com/index.php/jsapi/get_last_publish_story?day=2016-1-8&', message, './app/api/ea001.json');
  postDatatoFile('http://app003.ftmailbox.com/index.php/jsapi/get_new_story?rows=25&', message, './app/api/ea001.json');
  message.head.transactiontype = '10003';
  postDatatoFile('http://m.ftchinese.com/eaclient/apijson.php', message, './app/api/ea003.json');
  message.head.transactiontype = '10007';
  postDatatoFile('http://m.ftchinese.com/eaclient/apijson.php', message, './app/api/ea007.json');
  getUrltoFile ('http://m.ftchinese.com/index.php/ft/channel/phonetemplate.html?channel=homecontentsource', './app/api/homecontent.html');
  //getUrltoFile ('http://m.ftchinese.com/index.php/ft/channel/phonetemplate.html?channel=homecontentsource&date=20160108', './app/api/homecontent.html');
  getUrltoFile ('http://m.ftchinese.com/index.php/ft/channel/phonetemplate.html?channel=homecontentsource&screentype=wide', './app/api/homecontentwide.html');
  getUrltoFile ('http://m.ftchinese.com/index.php/ft/channel/phonetemplate.html?', './app/api/home.tpl');
  getUrltoFile ('http://m.ftchinese.com/index.php/ft/channel/phonetemplate.html?channel=homepagevideo&', './app/api/homepagevideo.tpl');
  getUrltoFile ('http://m.ftchinese.com/index.php/ft/channel/phonetemplate.html?channel=skyZ&', './app/api/skyZ.tpl');
  getUrltoFile ('http://m.ftchinese.com/index.php/ft/channel/ipadvideo.html?', './app/api/ipadvideo.tpl');
  getUrltoFile ('http://m.ftchinese.com/index.php/jsapi/get_last_updatetime?', './app/api/get_last_updatetime.json');
  getUrltoFile ('http://m.ftchinese.com/index.php/jsapi/hotstory/1days?', './app/api/hotstory.json');
});


gulp.task('test', function () {
  var message = {};
  message.head = {};
  message.head.transactiontype = '10001';
  message.head.source = 'web';
  message.body = {};
  message.body.ielement = {};
  message.body.ielement.num = 25;
  //http://app003.ftmailbox.com/index.php/jsapi/get_last_publish_story?day=2015-6-17&

  //postDatatoFile('http://m.ftchinese.com/eaclient/apijson.php', message, './app/api/ea001.json');
  //postDatatoFile('http://m.ftchinese.com/index.php/jsapi/get_last_publish_story?day=2015-10-13&', message, './app/api/ea001.json');
  getUrltoFile ('http://m.ftchinese.com/index.php/ft/channel/phonetemplate.html?channel=homecontentsource&screentype=wide', './app/api/homecontentwide.html');
  
});


gulp.task('hp', function () {
  gulp.src('app/api/homecontent.html')
    .pipe(gulp.dest('../dev_www/frontend/tpl/phone'));
  gulp.src('app/api/homecontentwide.html')
    .pipe(gulp.dest('../dev_www/frontend/tpl/phone'));
});


gulp.task('phone', function () {
  return gulp.src('app/phone/**/*')
    .pipe(gulp.dest('dist/phone'));
});

gulp.task('jshint', function () {
  return gulp.src('app/scripts/**/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.jshint.reporter('fail'));
});

gulp.task('html', ['styles'], function () {
  var assets = $.useref.assets({searchPath: '{.tmp,app}'});

  return gulp.src('app/*.html')
    .pipe(assets)
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.csso()))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', function () {
  return gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('api', function () {
  return gulp.src('app/api/**/*')
    .pipe(gulp.dest('dist/api'));
});



gulp.task('log', function () {
  return gulp.src('app/log/**/*')
    .pipe(gulp.dest('dist/log'));
});

gulp.task('fonts', function () {
  return gulp.src(require('main-bower-files')().concat('app/fonts/**/*'))
    .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
    .pipe($.flatten())
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('extras', function () {
  return gulp.src([
    'app/*.*',
    '!app/*.html',
    'node_modules/apache-server-configs/dist/.htaccess'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('clean', require('del').bind(null, ['.tmp', 'dist']));

gulp.task('connect', ['styles'], function () {
  var serveStatic = require('serve-static');
  var serveIndex = require('serve-index');
  var app = require('connect')()
    .use(require('connect-livereload')({port: 35729}))
    .use(serveStatic('.tmp'))
    .use(serveStatic('app'))
    // paths to bower_components should be relative to the current file
    // e.g. in app/index.html you should use ../bower_components
    .use('/bower_components', serveStatic('bower_components'))
    .use(serveIndex('app'));

  require('http').createServer(app)
    //.listen(9000)
    .listen(9000, '0.0.0.0')
    .on('listening', function () {
      console.log('Started connect web server on http://localhost:9000');
    });
});

gulp.task('serve', ['connect', 'watch'], function () {
  require('opn')('http://localhost:9000');
});

// inject bower components
gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;

  gulp.src('app/styles/*.scss')
    .pipe(wiredep())
    .pipe(gulp.dest('app/styles'));

  gulp.src('app/*.html')
    .pipe(wiredep())
    .pipe(gulp.dest('app'));
});

gulp.task('watch', ['connect'], function () {
  $.livereload.listen();

  // watch for changes
  gulp.watch([
    'app/*.html',
    '.tmp/styles/**/*.css',
    'app/scripts/**/*.js',
    'app/images/**/*',
    'app/api/**/*',
    'app/phone/**/*'
  ]).on('change', $.livereload.changed);

  gulp.watch('app/styles/**/*.scss', ['styles']);
  gulp.watch('bower.json', ['wiredep']);
});

gulp.task('copy', ['build'], function () {
  var replace = require('gulp-replace');
  var rename = require("gulp-rename");
  var thedatestamp = new Date().getTime();
  gulp.src('dist/**/*')
    .pipe(gulp.dest('../testing/dev_www/mobile_webroot/'));
  gulp.src(['dist/index.html'])
    .pipe(replace(/\<html\>/g, '<html manifest="iphone-2014.manifest">'))
    .pipe(replace(/=phone\//g, '=iphone-2014/'))
    .pipe(rename('iphone-2014.html'))
    .pipe(gulp.dest('../testing/dev_www/mobile_webroot/'));
  gulp.src(['dist/index.html'])
    .pipe(replace(/\<html\>/g, '<html manifest="ipad-2014.manifest">'))
    .pipe(replace(/=phone\//g, '=ipad-2014/'))
    .pipe(rename("ipad-2014.html"))
    .pipe(gulp.dest('../testing/dev_www/mobile_webroot/'));
  gulp.src(['dist/index.html'])
    .pipe(replace(/\<html\>/g, '<html manifest="bb-2014.manifest">'))
    .pipe(replace(/=phone\//g, '=bb-2014/'))
    .pipe(rename("bb-2014.html"))
    .pipe(gulp.dest('../testing/dev_www/mobile_webroot/'));
  gulp.src(['dist/index.html'])
    .pipe(replace(/\<html\>/g, '<html manifest="phone-2014.manifest">'))
    .pipe(rename("phone.html"))
    .pipe(gulp.dest('../testing/dev_www/mobile_webroot/'));
  gulp.src(['dist/index.html'])
    .pipe(replace(/\<html\>/g, '<html manifest="phone-2014.manifest">'))
    .pipe(rename("phoneapp.html"))
    .pipe(gulp.dest('../testing/dev_www/mobile_webroot/'));
  gulp.src(['dist/mba.html'])
    .pipe(replace(/\<html\>/g, '<html manifest="mba-2014.manifest">'))
    .pipe(replace(/=phone\//g, '=mba-2014/'))
    .pipe(rename("mba-2014.html"))
    .pipe(gulp.dest('../testing/dev_www/mobile_webroot/'));
  gulp.src(['dist/phone/**/*'])
    .pipe(gulp.dest('../testing/dev_www/mobile_webroot/iphone-2014'));
  gulp.src(['dist/phone/**/*'])
    .pipe(gulp.dest('../testing/dev_www/mobile_webroot/ipad-2014'));
  gulp.src(['dist/phone/**/*'])
    .pipe(gulp.dest('../testing/dev_www/mobile_webroot/bb-2014'));
    gulp.src(['dist/phone/**/*'])
    .pipe(gulp.dest('../testing/dev_www/mobile_webroot/mba-2014'));
  gulp.src(['app/cache/phone.manifest'])
    .pipe(replace(/#changelogdatestamp/g, '#datestamp' + thedatestamp))
    .pipe(rename('phone-2014.manifest'))
    .pipe(gulp.dest('../testing/dev_www/mobile_webroot/'));
  gulp.src(['app/cache/phone.manifest'])
    .pipe(replace(/#changelogdatestamp/g, '#datestamp' + thedatestamp))
    .pipe(replace(/phone\//g, 'iphone-2014/'))
    .pipe(rename('iphone-2014.manifest'))
    .pipe(gulp.dest('../testing/dev_www/mobile_webroot/'));
  gulp.src(['app/cache/phone.manifest'])
    .pipe(replace(/#changelogdatestamp/g, '#datestamp' + thedatestamp))
    .pipe(replace(/phone\//g, 'ipad-2014/'))
    .pipe(rename('ipad-2014.manifest'))
    .pipe(gulp.dest('../testing/dev_www/mobile_webroot/'));
  gulp.src(['app/cache/phone.manifest'])
    .pipe(replace(/#changelogdatestamp/g, '#datestamp' + thedatestamp))
    .pipe(replace(/phone\//g, 'bb-2014/'))
    .pipe(rename('bb-2014.manifest'))
    .pipe(gulp.dest('../testing/dev_www/mobile_webroot/'));
  gulp.src(['app/cache/android.manifest'])
    .pipe(replace(/#changelogdatestamp/g, '#datestamp' + thedatestamp))
    .pipe(rename('android-2014.manifest'))
    .pipe(gulp.dest('../testing/dev_www/mobile_webroot/'));
  gulp.src(['app/cache/mba.manifest'])
    .pipe(replace(/#changelogdatestamp/g, '#datestamp' + thedatestamp))
    .pipe(replace(/phone\//g, 'mba-2014/'))
    .pipe(rename('mba-2014.manifest'))
    .pipe(gulp.dest('../testing/dev_www/mobile_webroot/'));
  gulp.src(['dist/images/**/*'])
    .pipe(gulp.dest('../testing/dev_www/mobile_webroot/images'));

  
  // android file;
  var fs = require('fs');
  var cssbundle = fs.readFileSync('dist/phone/s.css', 'utf8');
  var googleanalytics = fs.readFileSync('dist/log/ga.js', 'utf8');
  var fa = fs.readFileSync('dist/log/analytics.js', 'utf8');
  // use jquery.min.js directly
  // to avoid gulp compiling bug
  var jqueryM = fs.readFileSync('bower_components/jquery/dist/jquery.min.js', 'utf8');
  var html5storageM = fs.readFileSync('dist/phone/html5storage-m.js', 'utf8');
  var trackingM = fs.readFileSync('dist/phone/tracking-m.js', 'utf8');
  var fastclickM = fs.readFileSync('dist/phone/fastclick-m.js', 'utf8');
  var ftscrollerM = fs.readFileSync('dist/phone/ftscroller-m.js', 'utf8');
  var mainM = fs.readFileSync('dist/phone/main-m.js', 'utf8');

  gulp.src(['app/android.html'])
    .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: false})))
    .pipe(replace(/\{\{cssbundle\}\}/g, cssbundle))
    .pipe(replace(/\{\{googleanalytics\}\}/g, googleanalytics))
    .pipe(replace(/\{\{fa\}\}/g, fa))
    .pipe(replace(/\{\{jquery-m\}\}/g, jqueryM))
    .pipe(replace(/\{\{html5storage-m\}\}/g, html5storageM))
    .pipe(replace(/\{\{tracking-m\}\}/g, trackingM))
    .pipe(replace(/\{\{fastclick-m\}\}/g, fastclickM))
    .pipe(replace(/\{\{ftscroller-m\}\}/g, ftscrollerM))
    .pipe(replace(/\{\{main-m\}\}/g, mainM))
    .pipe(replace(/\<html\>/g, '<html manifest="android-2014.manifest">'))
    .pipe(rename('androidapp.html'))
    .pipe(gulp.dest('../testing/dev_www/mobile_webroot/'));

  console.log ('files copied');
});


gulp.task('ga', function () {
    getUrltoFile('http://m.ftchinese.com/index.php/jsapi/analytics', './app/log/ga.js');
    getUrltoFile('http://m.ftchinese.com/index.php/jsapi/analytics', './dist/log/ga.js');
});


gulp.task('publish', function () {
  gulp.src('../testing/dev_www/mobile_webroot/phone/**/*')
    .pipe(gulp.dest('../dev_www/mobile_webroot/phone'));
  gulp.src('../testing/dev_www/mobile_webroot/ipad-2014/**/*')
    .pipe(gulp.dest('../dev_www/mobile_webroot/ipad-2014'));
  gulp.src('../testing/dev_www/mobile_webroot/iphone-2014/**/*')
    .pipe(gulp.dest('../dev_www/mobile_webroot/iphone-2014'));
  gulp.src('../testing/dev_www/mobile_webroot/bb-2014/**/*')
    .pipe(gulp.dest('../dev_www/mobile_webroot/bb-2014'));
  gulp.src('../testing/dev_www/mobile_webroot/mba-2014/**/*')
    .pipe(gulp.dest('../dev_www/mobile_webroot/mba-2014'));
  gulp.src('../testing/dev_www/mobile_webroot/log/**/*')
    .pipe(gulp.dest('../dev_www/mobile_webroot/log'));
  gulp.src('../testing/dev_www/mobile_webroot/assets/svg/**/*')
    .pipe(gulp.dest('../dev_www/mobile_webroot/assets/svg'));
  gulp.src('../testing/dev_www/mobile_webroot/*.manifest')
    .pipe(gulp.dest('../dev_www/mobile_webroot/'));
  gulp.src('../testing/dev_www/mobile_webroot/phone.html')
    .pipe(gulp.dest('../dev_www/mobile_webroot/'));
  gulp.src('../testing/dev_www/mobile_webroot/phoneapp.html')
    .pipe(gulp.dest('../dev_www/mobile_webroot/'));
  gulp.src('../testing/dev_www/mobile_webroot/iphone-2014.html')
    .pipe(gulp.dest('../dev_www/mobile_webroot/'));
  gulp.src('../testing/dev_www/mobile_webroot/bb-2014.html')
    .pipe(gulp.dest('../dev_www/mobile_webroot/'));
  gulp.src('../testing/dev_www/mobile_webroot/ipad-2014.html')
    .pipe(gulp.dest('../dev_www/mobile_webroot/'));
  gulp.src('../testing/dev_www/mobile_webroot/androidapp.html')
    .pipe(gulp.dest('../dev_www/mobile_webroot/'));
  gulp.src('../testing/dev_www/mobile_webroot/mba-2014.html')
    .pipe(gulp.dest('../dev_www/mobile_webroot/'));
  gulp.src('../testing/dev_www/mobile_webroot/images/**/*')
    .pipe(gulp.dest('../dev_www/mobile_webroot/images'));
});

gulp.task('build', ['jshint', 'html', 'images', 'fonts', 'extras', 'api', 'phone', 'log', 'ga'], function () {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], function () {
  gulp.start('build').start('copy');
});

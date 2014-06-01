/**
 * Module dependencies.
 */

var express = require('express')
 // , expressValidator = require('express-validator')
  , mongoStore = require('connect-mongo')(express)
  , flash = require('connect-flash')
  , path = require('path')
 // , helpers = require('view-helpers')
  , swig = require('swig');

module.exports = function (app, config, passport) {

  app.set('showStackError', true);
  // should be placed before express.static
  app.use(express.compress({
    filter: function (req, res) {
      return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
    },
    level: 9
  }));

  app.use(express.favicon());
  /*
   Express has a middleware called static, using which we can mark a directory in the
   filesystem for serving static files for the app. Any file kept in these directories can be
   directly accessed via the browser.
  */
  app.use(express.static(config.root + '/public'));

  // don't use logger for test env
  if (process.env.NODE_ENV !== 'test') {
    app.use(express.logger('dev'));
  }

  // development only
  if ('development' == app.get('env')) {
    app.use(express.errorHandler());
  }

  // set views path, template engine and default layout
  app.engine('html', swig.renderFile);
  app.set('view engine', 'html');

  app.set('views', path.join(config.root, './server/views'));
  app.set('view cache', process.env.NODE_ENV !== 'development');

  app.configure(function () {
    // dynamic helpers
    // app.use(function(req,res,next){
    //     req.locals.session = "eeeeeeee";
    //     next();
    // });

    // cookieParser should be above session
    app.use(express.cookieParser());

    // Following two instructions are used to replace the deprecated express.bodyParse().
    app.use(express.json());
    app.use(express.urlencoded());
  
    // below is for express-validator
    //app.use(expressValidator()); 

    app.use(express.methodOverride());

    // express/mongo session storage
    app.use(express.session({
      secret: 'bussiness users',
      store: new mongoStore({
        url: config.db,
        collection : 'sessions'
      })
    }));

    // connect flash for flash messages
    app.use(flash());

    app.use(function (req, res, next) {
        res.locals.session = req.session;
        next();
    });

    //app.use(helpers('app name'));
    //
    // use passport session
    app.use(passport.initialize());
    app.use(passport.session());

    // routes should be at the last
    app.use(app.router);

    // assume "not found" in the error msgs
    // is a 404. this is somewhat silly, but
    // valid, you can do whatever you like, set
    // properties, use instanceof etc.
    app.use(function(err, req, res, next){
      // treat as 404
      if (~err.message.indexOf('not found')) return next()

      // log it
      console.error(err.stack)

      // error page
      res.status(500).render('500', { error: err.stack })
    });

    // assume 404 since no middleware responded
    app.use(function(req, res, next){
      res.status(404).render('404', { url: req.originalUrl, error: 'Not found' })
    });

  })
}

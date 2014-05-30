
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');

var fs = require('fs');
var passport = require('passport');


// Load configurations
// if test env, load example file
var env = process.env.NODE_ENV || 'development'
  , config = require('./server/config/config')[env]
  , auth = require('./server/config/middlewares/authorization')
  , mongoose = require('mongoose');

// Bootstrap db connection
mongoose.connect(config.db);

// Bootstrap models
var models_path = __dirname + '/server/models'
fs.readdirSync(models_path).forEach(function (file) {
  require(models_path+'/'+file);
});

// bootstrap passport config
require('./server/config/passport')(passport, config);

var app = express();
// express settings
require('./server/config/express')(app, config, passport);

// Bootstrap routes
require('./server/routes/route')(app, passport, auth);

app.set('port', process.env.PORT || 4000);
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// expose app
//exports = module.exports = app;
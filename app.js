
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/users');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
global._ = require('lodash');
//var bodyParser = require('body-parser');
var oauthserver = require('oauth2-server');
var cors = require('cors');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(cors());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
//  app.use(bodyParser()); // REQUIRED

    app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.oauth = oauthserver({
    model: {}, // See below for specification
    grants: ['password'],
    debug: true
});


// connect to Mongo when the app initializes
mongoose.connect('mongodb://badgerDBUser:9-Honeybadgerdata@ds061158.mongolab.com:61158/realty');

//var MongoClient = require('mongodb').MongoClient;
//// Connect to the db
//MongoClient.connect('mongodb://badgerDBUser:9-Honeybadgerdata@ds061158.mongolab.com:61158/realty', function(err, db) {
//    if(err) {
//        console.log('Failed to connect to db: ' + err);
//    }
//    else {
//        console.log('Connected to badger DB');
//        app.db = db;
//    }
//});


app.get('/', routes.index);

require('./routes/listings')(app);
require('./routes/users')(app);

//app.all('/oauth/token', app.oauth.grant());
//
//app.get('/', app.oauth.authorise(), function (req, res) {
//    res.send('Secret area');
//});
//
//app.use(app.oauth.errorHandler());

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


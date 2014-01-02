/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var ga = require('./routes/ga');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', routes.index);
app.get('/ga/accounts', ga.accounts);
app.get('/ga/list', ga.list);
app.get('/ga/get', ga.get);

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
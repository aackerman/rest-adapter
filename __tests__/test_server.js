var express = require('express');
var app = express();

app.use('*', function(req, res, next) {
  console.log('%s %s %s', req.method, req.url, req.path);
  next();
});

app.get('/200', function(req, res) {
  res.end('{}');
});

app.get('/400', function(req, res) {
  res.status(400).end();
});

app.get('/500', function(req, res) {
  res.status(500).end();
});

app.listen(9999, function(err){
  console.log('listening on 9999');
});

var express = require('express');
var app = express();

app.use('*', function(req, res, next) {
  console.log('%s %s %s', req.method, req.url, req.path);
  next();
});

app.get('/200', function(req, res) {
  res.send({ ham: true });
});

app.get('/301', function(req, res) {
  res.redirect(301, '/redirect');
});

app.get('/redirect', function(req, res) {
  res.send({ redirect: true });
});

app.get('/400', function(req, res) {
  res.status(400).send({ error: 400 });
});

app.get('/500', function(req, res) {
  res.status(500).send({ error: 500 });
});

app.listen(9999, function(err){
  console.log('listening on 9999');
});

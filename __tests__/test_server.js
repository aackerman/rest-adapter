var express = require('express');
var app = express();

app.get('/200', function(req, res) {
  res.send('');
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

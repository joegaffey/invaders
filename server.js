var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var games = [];

app.use(bodyParser.json()); 
app.use(express.static('public'));

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/public/index.html');
});

app.get('/games', function(req, res) {
  res.send(games);
});

app.post('/games', function(req, res) {
  var game = req.body
  game.id = games.length;
  game.invaders = [];
  game.newInvaders = [];
  games.push(game);
  res.send(game);
});

app.delete('/games', function(req, res) {
  games = [];
  res.send('OK');
});

app.delete('/games/:id', function(req, res) {
  games[req.params.id].splice(req.params.iid - 1, 1);
  res.send('OK');
});

app.get('/games/:id/invaders', function(req, res) {
  res.send(games[req.params.id].invaders);
});

app.get('/games/:id/new-invaders', function(req, res) {
  res.send(games[req.params.id].newInvaders);
  games[req.params.id].newInvaders = [];
});

app.get('/games/:id/invaders/count', function(req, res) {
  res.send('{ "count":' + games[req.params.id].invaders.length + ' }');
});

app.get('/games/:id/new-invaders/count', function(req, res) {
  res.send('{ "count":' + games[req.params.id].newInvaders.length + ' }');
  games[req.params.id].newInvaders = [];
});

app.put('/games/:id/invaders/count', function(req, res) {
  games[req.params.id].invaders = [];
  games[req.params.id].newInvaders = [];  
  var count = req.body.count;
  for(var i = 0; i < count; i++) {
    var invader = {};
    invader.id = i;
    games[req.params.id].invaders.push(invader);
    games[req.params.id].newInvaders.push(invader);
  }
  res.send('{ "count":' + games[req.params.id].invaders.length + ' }');
});

app.post('/games/:id/invaders', function(req, res) {
  var invader = req.body;
  invader.id = games[req.params.id].invaders.length;
  games[req.params.id].invaders.push(req.body);
  games[req.params.id].newInvaders.push(req.body);
  res.send(invader);
});

app.delete('/games/:gid/invaders/:iid', function(req, res) {
  games[req.params.gid].invaders.splice(req.params.iid - 1, 1);
  res.send('OK');
});

app.delete('/games/:id/invaders', function(req, res) {
  games[req.params.id].invaders = [];
  games[req.params.id].newInvaders = [];
  res.send('OK');
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

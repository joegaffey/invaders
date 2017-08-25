var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');

var PORT = 8585;
var EVENTS_URL = 'http://invaders-from-space.glitch.me/remote-events/';
var CHECK_THRESHOLD = true;
var EVENTS_THRESHOLD = 100;

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
  var gameId = req.params.id;
  if(gameId === 'latest')
    gameId = games.length -1;
  invader.id = games[gameId].invaders.length;
  games[gameId].invaders.push(req.body);
  games[gameId].newInvaders.push(req.body);
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

// Proxy and threshold check for test purposes
var eventCount = 0;
app.get('/events/:count', function(req, res) {
  var newEventCount = parseInt(req.params.count);
  eventCount += newEventCount;
  if(CHECK_THRESHOLD && eventCount >= EVENTS_THRESHOLD) {  
    var invaders = Math.round(eventCount / EVENTS_THRESHOLD);
    eventCount = eventCount % EVENTS_THRESHOLD;
    if(games.length > 0) {
      for(var i = 0; i < invaders; i++) {
        games[games.length - 1].invaders.push({});
        games[games.length - 1].newInvaders.push({});
      }
    };  
  }
  var data = {};
  data.events = req.params.count;
  data = request(EVENTS_URL + newEventCount, function (error, response, body) {
    res.send(body);    
  });  
});

// Test purposes
app.get('/remote-events/:count', function(req, res) {
  res.send('{ "count":' + req.params.count + ' }');
});

var listener = app.listen(process.env.PORT || PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

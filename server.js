var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var props = require('./public/props.js');

var PORT = process.argv[2];
if(!PORT)
  PORT = 8585;

var EVENTS_URL = process.argv[3];
if(!EVENTS_URL) 
  EVENTS_URL = "/remote-events/";

var EVENTS_THRESHOLD = parseInt(process.argv[4]);
var CHECK_THRESHOLD = false;
if(EVENTS_THRESHOLD && EVENTS_THRESHOLD > 0)
  CHECK_THRESHOLD = true;

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
  game.newPills = [];
  game.pills = [];
  game.destroyedInvaders = [];
  games.push(game);
  res.send(game);
});

app.delete('/games', function(req, res) {
  games = [];
  res.send('OK');
});

app.get('/games/:id', function(req, res) {
  var gameId = req.params.id;
  if(gameId === 'latest')
    gameId = games.length - 1;
  res.send(games[gameId]);
  games[gameId].newInvaders = [];
  games[gameId].destroyedInvaders = [];
  games[gameId].newPills = [];
});

app.delete('/games/:id', function(req, res) {
  var gameId = req.params.id;
  if(gameId === 'latest')
    gameId = games.length - 1;
  games.splice(gameId - 1, 1);
  res.send('OK');
});

app.get('/games/:id/invaders', function(req, res) {
  var gameId = req.params.id;
  if(gameId === 'latest')
    gameId = games.length - 1;
  res.send(games[gameId].invaders);
});

app.get('/games/:id/new-invaders', function(req, res) {
  var gameId = req.params.id;
  if(gameId === 'latest')
    gameId = games.length - 1;
  res.send(games[gameId].newInvaders);
  games[gameId].newInvaders = [];
});

app.get('/games/:id/invaders/count', function(req, res) {
  var gameId = req.params.id;
  if(gameId === 'latest')
    gameId = games.length - 1;
  res.send('{ "count":' + games[gameId].invaders.length + ' }');
});

app.get('/games/:id/new-invaders/count', function(req, res) {
  var gameId = req.params.id;
  if(gameId === 'latest')
    gameId = games.length - 1;
  res.send('{ "count":' + games[gameId].newInvaders.length + ' }');
  games[gameId].newInvaders = [];
});

app.put('/games/:id/invaders/count', function(req, res) {
  var gameId = req.params.id;
  if(gameId === 'latest')
    gameId = games.length - 1;
  games[gameId].invaders = [];
  games[gameId].newInvaders = [];  
  var count = req.body.count;
  for(var i = 0; i < count; i++) {
    var invader = {};
    invader.id = i;
    games[gameId].invaders.push(invader);
  }
  res.send('{ "count":' + games[gameId].invaders.length + ' }');
});

app.put('/games/:id/new-invaders/count', function(req, res) {
  var gameId = req.params.id;
  if(gameId === 'latest')
    gameId = games.length - 1;
  var count = req.body.count;
  for(var i = 0; i < count; i++) {
    var invader = {};
    invader.id = i;
    games[gameId].invaders.push(invader);
    games[gameId].newInvaders.push(invader);
  }
  res.send('{ "count":' + games[gameId].newInvaders.length + ' }');
});

app.put('/games/:id/destroyed-invaders/count', function(req, res) {
  var gameId = req.params.id;
  if(gameId === 'latest')
    gameId = games.length - 1;
  var count = req.body.count;
  games[gameId].invaders.splice(0, count);
  for(var i = 0; i < count; i++) {
    games[gameId].destroyedInvaders.push({});
  }
  res.send('{ "count":' + games[gameId].destroyedInvaders.length + ' }');
});

app.post('/games/:id/invaders', function(req, res) {
  var gameId = req.params.id;
  if(gameId === 'latest')
    gameId = games.length - 1;
  var invader = req.body;
  invader.id = games[gameId].invaders.length;
  games[gameId].invaders.push(req.body);
  games[gameId].newInvaders.push(req.body);
  res.send(invader);
});

app.post('/games/:id/pills', function(req, res) {
  var gameId = req.params.id;
  if(gameId === 'latest')
    gameId = games.length - 1;
  var pill = req.body;
  pill.id = games[gameId].pills.length;
  games[gameId].pills.push(req.body);
  games[gameId].newPills.push(req.body);
  res.send(pill);
});

app.delete('/games/:gid/invaders/:iid', function(req, res) {
  var gameId = req.params.gid;
  if(gameId === 'latest')
    gameId = games.length - 1;
  var invaderId = req.params.iid;
  var invader = games[gameId].invaders[invaderId];
  games[gameId].destroyedInvaders.push(invader);
  games[gameId].invaders.splice(invaderId - 1, 1);
  res.send('OK');
});

app.delete('/games/:id/invaders', function(req, res) {
  var gameId = req.params.id;
  if(gameId === 'latest')
    gameId = games.length -1;
  games[gameId].invaders = [];
  games[gameId].newInvaders = [];
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

app.get('/properties', function(req, res) {
  res.send(props);
});

app.put('/properties', function(req, res) {
  props = req.body;
  res.send(props);
});

// Test purposes
app.get('/remote-events/:count', function(req, res) {
  res.send('{ "count":' + req.params.count + ' }');
});

var listener = app.listen(process.env.PORT || PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

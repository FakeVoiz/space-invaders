'use strict'
const express = require(`express`);
const app = express();
const fs = require('fs');
const parser = require('body-parser');

var bestTime = Number.MAX_VALUE;
var lastTime;

app.set('view engine', 'ejs');
app.use(parser.json());
app.get('/game', (req, res) => 
{
    res.sendFile('./game/game.html', { root: __dirname });
});

app.get('/win', (req, res) => 
{
    fs.readFile('./game/winScreen.html', 'utf8' , (err, data) => 
    {
        if (err)
        {
          console.error(err);
          return;
        }

        res.send(data.replace('%bestTime%', `${bestTime}`).replace('%yourTime%', `${lastTime}`));
    });      
});

app.get('/loose', (req, res) => 
{
    res.sendFile('./game/looseScreen.html', { root: __dirname });
});

app.get('/', (req, res) => 
{
    res.sendFile('./game/menu.html', { root: __dirname });
});

app.post('/data', (req, res) =>
{
    var timeTakenToClearLevel = req.body.value;
    lastTime = timeTakenToClearLevel;
    bestTime = Math.min(bestTime, lastTime);
});

app.listen(3000);
'use strict'
const express = require(`express`);
const app = express();


app.set('view engine', 'ejs');
app.get('/game', (req, res) => 
{
    res.sendFile('./game/index.html', { root: __dirname });
});

app.get('/win', (req, res) => 
{
    res.sendFile('./game/winScreen.html', { root: __dirname });
});

app.get('/loose', (req, res) => 
{
    res.sendFile('./game/looseScreen.html', { root: __dirname });
});

app.get('/', (req, res) => 
{
    res.sendFile('./game/menu.html', { root: __dirname });
});

app.listen(3000);
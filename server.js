'use strict'
const express = require(`express`);
const app = express();


app.set('view engine', 'ejs');
app.get('/', (req, res) => 
{
    res.sendFile('./game/index.html', { root: __dirname });
});

app.listen(3000);


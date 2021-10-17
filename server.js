const path = require('path');
const express = require('express');

const port = 80;
const app = express();

app.use(express.static('dist'));

// app.get('/card-game', (req, res) => res.sendFile(path.join(__dirname + '/dist/index.html')));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

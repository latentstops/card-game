const path = require('path');
const express = require('express');

const port = 5000;
const app = express();

app.use(express.static('dist'));

app.get('/black-jack', (req, res) => res.sendFile(path.join(__dirname + '/black-jack.html')));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

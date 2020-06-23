
var path = require('path');
var express = require('express');
var app = express();
app.use(express.static('dist'));
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist/index.html'));
});

app.listen(80, function () {
  console.log('Example app listening on port 3000!');
});



var express = require('express');
var app = express();
//var PORT = 3000;
//Para usar heroku:
var PORT = process.env.PORT || 3000;

app.get('/', function (req, res) {
    res.send('TODO API root');
});

app.listen(PORT, function() {
    console.log('Express escutando na porta ' + PORT + '!');
})
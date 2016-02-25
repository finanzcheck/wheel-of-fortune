var express = require('express'),
    browserify = require('browserify-middleware'),
    less = require('less-middleware'),
    slashes = require('connect-slashes'),
    app = express();


app.use(slashes(false));

app.all('/:var(wheel|participants|winners)?', function (req, res) {
    res.sendFile(__dirname + '/lib/index.html');
});
app.use('/', express['static'](__dirname + '/dist'));

app.listen('3010', function () {
    console.log('Listening on http://0.0.0.0:3001');
});

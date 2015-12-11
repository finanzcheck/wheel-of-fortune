var express = require('express'),
    browserify = require('browserify-middleware'),
    less = require('less-middleware'),
    app = express();

app.use('/app.js', browserify(__dirname + '/lib/app.js'));
app.use('/hammer.js', express['static'](__dirname + '/node_modules/hammerjs/hammer.js'));
app.use('/angular.hammer.js', express['static'](__dirname + '/node_modules/angular-hammer/angular.hammer.js'));
app.use(less(__dirname + '/lib'));
app.use('/', express['static'](__dirname + '/lib'));
app.all('/*', function(req, res) {
    res.sendFile(__dirname + '/lib/index.html');
});

app.listen('3001', function () {
    console.log('Listening on http://0.0.0.0:3001');
});

// copy html and add index
var fs = require('fs');
var git = require('git-rev');
git.tag(function (str) {
    var content = fs.readFileSync(__dirname + '/../lib/index.html').toString();
    fs.writeFileSync(__dirname + '/../dist/index.html', content.replace(/%VERSION%/g, str), 'utf8');
    console.log('copied index.html');
});

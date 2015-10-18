var fs = require('fs');

module.exports = function() {
    var file = './.folder',
        dir = './build/',
        exists = fs.existsSync(file);

    if (exists) {
        dir = fs.readFileSync(file).toString('utf8');
    }

    return dir;
};
/*
* 获取项目目录名称
* 排除 bower_components、themes、common 目录
*/
var fs = require('fs');

var exclude = ['bower_components', 'lib', 'themes', 'common'];

/*
* @params:
*     callback: function(){}
*/
module.exports = function(params) {
    var arr = [];

    fs.readdir(process.cwd() +'/source', function (err, files) {

        if (err) {
            console.log(err);
            return;
        }

        files.forEach(function (filename) {
            var stats = fs.lstatSync('source/'+ filename);

            if (stats.isDirectory() && !/\./.test(filename)) {
                
                if (exclude.length > 0) {

                    var buff = false;

                    exclude.forEach(function (prj) {
                        if (prj == filename) {
                            buff = true;
                        }
                    });

                    if (!buff) {
                        arr.push(filename);
                    }

                } else {

                    arr.push(filename);

                }
            }
        });

        params.callback(arr);
    });
            
};
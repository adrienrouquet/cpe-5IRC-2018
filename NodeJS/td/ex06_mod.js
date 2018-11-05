
const fs = require("fs");
const path = require("path");

module.exports = function (dirPath, extname, cb) {
    const listFile = [];

    fs.readdir(dirPath, function(err, data) {
        if (err) {
            return cb(err);
        }

        data.forEach(fileName => {
            if (!extname || path.extname(fileName) === extname) {
                listFile.push(fileName);
            }
        });
        return cb(null, listFile);
    });
};

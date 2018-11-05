
const ex06Mod = require("./ex06_mod.js");

const dirPath = process.argv[2];
const extFile = process.argv[3];

ex06Mod(dirPath, extFile, function(err, data) {
    if (err) {
        console.error(err.message);
        return;
    }

    data.forEach(function(fileName) {
        console.log(fileName);
    });
});

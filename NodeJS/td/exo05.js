const fs = require('fs');
const path = require('path');

const dirPath = process.argv[2];
const extFile = process.argv[3];

fs.readdir(dirPath, (err, data) => {

    data.forEach(fileName => {

        if (!extFile || path.extname(fileName) === extFile) {
            console.log(fileName);
        }
    });
});

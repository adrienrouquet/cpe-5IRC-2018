const fs = require('fs');

fs.readFile(process.argv[2], (err, content) => {
    console.log(content.toString().split(/\r?\n/).length);
});




var http = require("https");

var addr = process.argv[2];

http.get(addr, function(res) {

    res.pipe(new MyStream(function(data) {
        console.log(data.length);
        console.log(data);
    }));
});

function MyStream(callback) {
    var data = "";
    var stream = new require("stream").Writable();

    stream._write = function(chunk, encoding, cb) {
        data += chunk.toString();
        if (cb) {
            cb();
        }
    };

    stream.on("finish", function() {
        if (callback) {
            callback(data);
        }
    });

    return stream;
}
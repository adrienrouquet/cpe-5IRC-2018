
const net = require('net');

net.createServer(function(socket) {
    socket.end(new Date() + "\n");
}).listen(process.argv[2]);

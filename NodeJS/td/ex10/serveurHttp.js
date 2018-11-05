'use strict';

const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");
const CONFIG = require("./config.json");

const server = http.createServer(function(request, response) {
	let filePath = url.parse(request.url).pathname;
	if (filePath === "/") {
		filePath = "/index.html";
	}

	filePath = path.join(CONFIG.publicDir, filePath);
		fs.readFile(filePath, function(err, data) {

            if (err) {
                console.dir(err);
                console.error(filePath + " - ERROR 500");
                response.writeHead(500);
                response.end(filePath + " - ERROR 500");
                return;
            }

			console.log(filePath + " - OK");
            response.end(data);
		});
});

server.listen(CONFIG.port, function(err) {
	if (err) {
		console.error("ERROR ON STARTUP...");
	} else {
		console.log("Server listening on port " + CONFIG.port);
	}
});

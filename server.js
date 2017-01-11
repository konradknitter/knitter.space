const config = require('config');
const http = require('http');
const fs = require('fs-promise');
const mime = require('mime-types');
const HTTP_SUCCESS_OK = 200;
const HTTP_CLIENT_NOT_FOUND = 404;

async function handleRequest(request, response) {
    console.log(request.method + ": " + request.url);

    if (request.method === "GET") {
        response.statusCode = HTTP_SUCCESS_OK;
        if (request.url === "/") {
            response.setHeader("Content-Type", mime.lookup("html"));
            response.write(await fs.readFile(config.outputPath + "/index.html", "utf8"));
        } else {
            try {
                response.setHeader("Content-Type", mime.lookup(config.outputPath + request.url));
                response.write(await fs.readFile(config.outputPath + request.url, "utf8"));
            } catch (err) {
                console.log("File do not exists. Error 404");
                response.writeHead(HTTP_CLIENT_NOT_FOUND);
            }
        }
    } else {
        console.log("Method is not GET");
        response.writeHead(HTTP_CLIENT_NOT_FOUND);
    }

    response.end();
}

http.createServer(handleRequest)
    .listen(config.serverPort, function() {
        console.log("HTTP Server on port " + config.serverPort + " started!");
    });

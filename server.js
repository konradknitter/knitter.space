const fs = require('fs-promise');
const http = require('http');

const PORT = 3000;

const HTTP_SUCCESS_OK = 200;
const HTTP_CLIENT_NOT_FOUND = 404;

const RESOURCES = {
    "/": "www/aboutme.html",
    "/markdown.css": "www/markdown.css"
};

async function handleRequest(request, response) {
    console.log(request.method + ": " + request.url);

    if (request.method === "GET" && RESOURCES.hasOwnProperty(request.url)) {
        response.statusCode = HTTP_SUCCESS_OK;
        response.setHeader("Content-Type", "text/html");
        response.write(await fs.readFile(RESOURCES[request.url], "utf8"));
    } else {
        response.writeHead(HTTP_CLIENT_NOT_FOUND);
    }

    response.end();
}

http.createServer(handleRequest)
    .listen(PORT, function() {
        console.log("HTTP Server on port " + PORT + " started!");
    });

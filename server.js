let fs = require('fs-promise');
let http = require('http');

const PORT = 3000;

async function handleRequest(request, response) {
    console.log(request.url);
    response.writeHead(200, {"Content-Type": "text/html"});
    if (request.url === "/markdown.css") {
        response.write(await fs.readFile("www/markdown.css", "utf8"));	
    }
    response.write(await fs.readFile("www/aboutme.html", "utf8"));
    response.end();
}

var server = http.createServer(handleRequest);

server.listen(PORT, function() {
    console.log("Something happens 2!");
});

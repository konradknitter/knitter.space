let fs = require('fs-promise');
let http = require('http');

const PORT = 3000;

async function handleRequest(request, response) {
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(await fs.readFile("www/aboutme.html", "utf8"));
    response.end();
}

var server = http.createServer(handleRequest);

server.listen(PORT, function() {
    console.log("Something happens 2!");
});

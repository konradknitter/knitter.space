let fs = require('fs-promise');
let http = require('http');

const PORT = 3000;

async function handleRequest(request, response){
     response.end(await fs.readFile("www/aboutme.html", "utf8"));
}

var server = http.createServer(handleRequest);

server.listen(PORT, function() {
    console.log("Something happens 2!");
});

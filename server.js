var http = require('http');

const PORT = 8080;

function handleRequest(request, response){
     response.end("Something happens!" + request.url);
}

var server = http.createServer(handleRequest);

server.listen(PORT, function() {
    console.log("Something happens 2!");
});

"use strict"

var marked = require("marked");
var fs = require("fs-promise");
var path = require("path");

let WWW_PATH = path.dirname(process.argv[1]) + "/www/";
let ABOUTME_MD = path.dirname(process.argv[1]) + "/src/" + "aboutme.md";

async function main() {
    try {
        let fileStat = await fs.stat(WWW_PATH);
        if (fileStat && !fileStat.isDirectory()) {
            console.log(WWW_PATH + "path exists and it is not directory.");
        }
    } catch (err) {
        if (err.code == "ENOENT") {
            fs.mkdir(WWW_PATH);
        } else {
            throw err;
        }
    }

    let htmlOutput = marked(await fs.readFile(ABOUTME_MD, "utf8"));
    await fs.writeFile(WWW_PATH + "aboutme.html", htmlOutput, "utf8");
    console.log("project generated");
}

main();

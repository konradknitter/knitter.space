"use strict"

const config   = require("config");
const fs       = require("fs-promise");
const marked   = require("marked");

async function createDirectory(directoryName) {
    try {
        let fileStat = await fs.stat(directoryName);
        if (fileStat && !fileStat.isDirectory()) {
            console.log(directoryName + "path exists and it is not directory.");
        }
    } catch (err) {
        if (err.code == "ENOENT") {
            fs.mkdir(directoryName);
        } else {
            throw err;
        }
l    }
}

async function copyStaticFiles() {
    var STATIC_FILES = [ "app.js", "index.html", "jquery.min.js", "bootstrap.min.css" ];

    STATIC_FILES.forEach(async function(fileName) {
        await fs.writeFile(config.outputPath + fileName,
            await fs.readFile(config.sourcePath + fileName),
            "utf8");
    });
}

async function renderPage(fileName) {
    var htmlOutput = marked(await fs.readFile(fileName, "utf8"));
    return htmlOutput;
}

async function generateMarkdownFiles() {
    var STATIC_FILES = [ 'about', 'projects', 'posts' ];
    STATIC_FILES.forEach(async function(fileName) {
        await fs.writeFile(config.outputPath + fileName + ".html", await renderPage(config.sourcePath + fileName + ".md"), "utf8");
    });
}

async function main() {
    console.log("knitter.space project started");
    
    await createDirectory(config.outputPath);
    await copyStaticFiles();
    await generateMarkdownFiles();

    console.log("knitter.space project generated");
}

main();

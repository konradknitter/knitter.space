"use strict"

const config   = require("config");
const fs       = require("fs-extra-promise");
const marked   = require("marked");

async function renderPage(fileName) {
    var htmlOutput = marked(await fs.readFileAsync(fileName, "utf8"));
    return htmlOutput;
}

async function generateMarkdownFiles() {
    var STATIC_FILES = [ 'about', 'projects', 'posts' ];
    STATIC_FILES.forEach(async function(fileName) {
        await fs.writeFileAsync(config.outputPath + fileName + ".html", await renderPage(config.sourcePath + fileName + ".md"), "utf8");
    });
}

async function main() {
    console.log("knitter.space project started");
    
    await fs.ensureDirAsync(config.outputPath);
    await Promise.all(config.staticFiles.map(function(fileName){
        console.log(config.outputPath + fileName);
        return fs.copyAsync(config.sourcePath + fileName, config.outputPath + fileName);
    }));
    await generateMarkdownFiles();

    console.log("knitter.space project generated");
}

main();

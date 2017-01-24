"use strict"

const config = require("config");
const fs     = require("fs-extra-promise");
const marked = require("marked");
const path   = require("path");

async function renderPage(fileName) {
    var htmlOutput = marked(await fs.readFileAsync(fileName, "utf8"));
    return htmlOutput;
}
async function generateMarkdownPage(fileName) { 
    await fs.writeFileAsync(config.outputPath + fileName + ".html", await renderPage(config.sourcePath + fileName + ".md"), "utf8");
}

function isNotStaticFile(fileName) {
    return config.staticFiles.findIndex(function(name) {
        return (name === fileName);
    }) === -1;
}

async function generateIndexFile() {
    let allSourceFiles = await fs.readdirAsync(config.sourcePath);
    let sourceFiles = allSourceFiles.filter(isNotStaticFile);
    
    sourceFiles.forEach(async function(fileName) {
        if (await fs.isDirectoryAsync(config.sourcePath + fileName)) {
            throw new Error("Not supported!!!");
        } else if (path.extname(fileName) === ".md") {
            console.log(fileName);
            await generateMarkdownPage(path.basename(fileName, ".md"));
        }
    });
}

async function main() {
    console.log("knitter.space project started");
    
    await fs.ensureDirAsync(config.outputPath);
    await Promise.all(config.staticFiles.map(function(fileName) {
        return fs.copyAsync(config.sourcePath + fileName, config.outputPath + fileName);
    }));

    generateIndexFile();

    console.log("knitter.space project generated");
}

main();

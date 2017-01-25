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
    await fs.writeFileAsync(config.outputPath + path.relative(config.sourcePath, path.dirname(fileName)) + "/" + path.basename(fileName, ".md") + ".html", await renderPage(fileName), "utf8");
}

function isNotStaticFile(fileName) {
    return config.staticFiles.findIndex(function(name) {
        return (name === fileName);
    }) === -1;
}

async function generatePageFromDirectory(sourcePath) {
    let allSourceFiles = await fs.readdirAsync(sourcePath);
    let sourceFiles = allSourceFiles.filter(isNotStaticFile);
 
    return Promise.all(sourceFiles.map(async function(fileName) {
        if (await fs.isDirectoryAsync(sourcePath + "/" + fileName)) {
            await fs.ensureDirAsync(config.outputPath + path.relative(config.sourcePath, sourcePath) + fileName);
            generatePageFromDirectory(sourcePath + fileName + "/");
        } else if (path.extname(fileName) === ".md") {
            return generateMarkdownPage(sourcePath + fileName);
        } else if (path.extname(fileName) === ".html") {
            console.log(fileName);
            await fs.copyAsync(sourcePath + "/" + fileName, config.outputPath + path.relative(config.sourcePath, sourcePath) + "/" + fileName); 
        }
    }));
}

async function generateIndexFile() {
    return generatePageFromDirectory(config.sourcePath);
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

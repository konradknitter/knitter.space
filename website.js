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

function getSourcePath(sourcePath, fileName) {
    return sourcePath + "/" + fileName;
}

function getNormalizedOutputPath(sourcePath, fileName) {
    return path.normalize(path.relative(config.sourcePath, getSourcePath(sourcePath, fileName)));
}

function getOutputPath(sourcePath, fileName) {
    return config.outputPath + getNormalizedOutputPath(sourcePath, fileName);
}

async function generatePageFromDirectory(sourcePath, database) {
    let allSourceFiles = await fs.readdirAsync(sourcePath);
    let sourceFiles = allSourceFiles.filter(isNotStaticFile);

    return Promise.all(sourceFiles.map(async function(fileName) {
        if (await fs.isDirectoryAsync(getSourcePath(sourcePath, fileName))) {
            let file = path.basename(getNormalizedOutputPath(sourcePath, fileName));
            database[file] = { type: "directory", subpages: {} };
            await fs.ensureDirAsync(getOutputPath(sourcePath, fileName));
            return generatePageFromDirectory(getSourcePath(sourcePath, fileName), database[file].subpages);
        } else if (path.extname(fileName) === ".md") {
            let file = getNormalizedOutputPath(sourcePath, fileName);
            database[path.basename(file, ".md")] = { type: "page", location: getNormalizedOutputPath(sourcePath, path.basename(fileName, ".md") + ".html") };
            return generateMarkdownPage(getSourcePath(sourcePath, fileName));
        } else if (path.extname(fileName) === ".html") {
            let file = getNormalizedOutputPath(sourcePath, fileName);
            database[path.basename(file, ".html")] = { type: "page", location: getNormalizedOutputPath(sourcePath, fileName) };
            return fs.copyAsync(getSourcePath(sourcePath, fileName), getOutputPath(sourcePath, fileName));
        }
    }));
}

async function generateIndexFile() {
    var database = {};
    await generatePageFromDirectory(config.sourcePath, database);
    await fs.writeFileAsync(config.outputPath + "database.json", JSON.stringify(database, null, 4), "utf8");
}

async function main() {
    console.log("knitter.space project started");
    
    await fs.ensureDirAsync(config.outputPath);
    await Promise.all(config.staticFiles.map(function(fileName) {
        return fs.copyAsync(config.sourcePath + fileName, config.outputPath + fileName);
    }));

    await generateIndexFile();

    console.log("knitter.space project generated");
}

main();

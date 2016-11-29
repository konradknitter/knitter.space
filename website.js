"use strict"

let config   = require("config");
let fs       = require("fs-promise");
let marked   = require("marked");
let path     = require("path");

let LOCAL_PATH = path.dirname(process.argv[1]);
let OUTPUT_PATH = LOCAL_PATH + "/" + config.outputPath;
let SOURCE_PATH = LOCAL_PATH + "/" + config.sourcePath;
let ABOUTME_MD = SOURCE_PATH + "aboutme.md";

let MARKDOWN_STYLE_LINK = "<link href=\"markdown.css\" rel=\"stylesheet\"></link>";

async function createOutputDirectory() {
    try {
        let fileStat = await fs.stat(OUTPUT_PATH);
        if (fileStat && !fileStat.isDirectory()) {
            console.log(OUTPUT_PATH + "path exists and it is not directory.");
        }
    } catch (err) {
        if (err.code == "ENOENT") {
            fs.mkdir(OUTPUT_PATH);
        } else {
            throw err;
        }
    }
}

async function main() {
    await createOutputDirectory();
    await fs.writeFile(OUTPUT_PATH + "markdown.css",
                    await fs.readFile(SOURCE_PATH + "markdown.css"),
                    "utf8");
    let htmlOutput = MARKDOWN_STYLE_LINK + marked(await fs.readFile(ABOUTME_MD, "utf8"));
    await fs.writeFile(OUTPUT_PATH + "aboutme.html", htmlOutput, "utf8");
    console.log("project generated");
}

main();

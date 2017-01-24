# knitter.space

This is my personal site, generated from [Markdown](http://daringfireball.net/projects/markdown/) documents.

## What it does?

Purpose of this application is to generate personal website on from [HTML](https://www.w3.org/html/) and [Markdown](http://daringfireball.net/projects/markdown/) with subpages based on directory structure.

This project also contains very simple http server to host output directory.

Application will generate simple framwork application index.html and app.js files based of content of source application.

Every not static file with extensions *.html*, *.md* and directories will create new main subpage.

Files from sources subdirectory will not be linked by index.html, instead directory pages will act as a hub for subdirectory content

                                ,----------.                                         
                                |index.html|                                         
                                `----------'                                         
                                      |                                              
                                      |                                              
    ,----------------------.  ,-------------.   ,--------------.                     
    |markdowngenerated.html|  |htmlfile.html|   |directory.html|                     
    `----------------------'  `-------------'   `--------------'                     
                                                                                     
                       ,--------------------------------.   ,-----------------------.
                       |directory/markdowngenerated.html|   |directory/htmlfile.html|
                       `--------------------------------'   `-----------------------'

## Setup

*Prerequiries*: [node.js](https://nodejs.org/) v7.1+

1. Install project dependencies: `npm install`
2. Compile project: `npm run compile` or `npm start`
3. Start HTTP server: `npm run startserver` 
4. Open browser [http://localhost:3000/](http://localhost:3000/) (default port is 3000, it can be configured in config/default.json file)

## Configuration:

Application uses [config](https://www.npmjs.com/package/config) node.js module

* **serverPort**: Port used for hosting output directory (default port: 3000)
* **sourcePath**: Directory of source files.
* **staticFiles**: Files that will be copied from source to output directory without reference or markdown generation. Useful for additional http pages.
* **outpoutPath**: Directory used for output generation, also directory hosted by simple http server

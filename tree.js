const fs = require('fs');

function printFilename(filename, isDirectory, indent) {
    console.log(indent + (isDirectory ? '+ ' : '  ') + filename);
}

function printDirFiles(dirname, indent) {
    fs.readdirSync(dirname, { withFileTypes: true }).forEach(element => {
        printFilename(element.name, element.isDirectory(), indent);
        if (element.isDirectory()) {
            printDirFiles(dirname + element.name + "/", indent + "  ")
        }
    });
}

function start(startFilename) {
    var statSync = fs.lstatSync(startFilename).isDirectory();
    printFilename(startFilename, statSync, "");
    if (statSync) {
        printDirFiles(startFilename, "  ");
    }
}

start(process.argv[2]);
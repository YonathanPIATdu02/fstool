
function printFilename( filename, isDirectory, indent){
    console.log(indent + (isDirectory ? '+ ' : '  ') + filename);
}

function printDirFiles(dirname, indent) {
    readdirSync(dirname)
}


printFilename('bonjour', false, '    ');
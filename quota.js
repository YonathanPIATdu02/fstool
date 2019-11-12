const fs = require('fs').promises;

async function computeSize(dirname, dirent) {
    if (!dirent.isDirectory()) {
        return fs.lstat(dirname + "/" + dirent)
            .then((err, stats) => {
                if (err) {
                    console.log(err);
                } else {
                    quota += stats.size;
                }
            });
    } else {
        return computeDirectorySize(dirname + "/" + dirent);
    }
}

async function computeDirectorySize(dirname) {
    return fs.readdir(dirname, { withFileTypes: true })
        .then(dirents => {
            return Promise.all(dirents.map(dirent => computeSize(dirname, dirent)));
        })
}

async function start(startDirname) {
    let quota = 0;
    computeDirectorySize(startDirname);
    return quota;
}

start(process.argv[2] || './');
const fs = require('fs').promises;
const startUsage = process.cpuUsage()
var quota;

async function computeSize(dirname, dirent) {
    if (!dirent.isDirectory()) {
        return fs.lstat(dirname + "/" + dirent.name)
            .then((stats) => {
                quota += stats.size;
            });
    } else {
        return computeDirectorySize(dirname + "/" + dirent.name);
    }
}

async function computeDirectorySize(dirname) {
    return fs.readdir(dirname, { withFileTypes: true })
        .then(dirents => {
            return Promise.all(dirents.map(dirent => computeSize(dirname, dirent)));
        })
}

async function start(startDirname) {
    quota = 0;
    computeDirectorySize(startDirname)
        .then(() => console.log("Size : " + quota + " Bytes"))
        .then(() => console.log("Unit Size : " + humanFileSize(quota) + " Bytes"))
        .then(() => console.log(process.cpuUsage(startUsage).system))
        .catch(err => console.log(err));
}

function humanFileSize(size) {
    if (size === 0) return '0 Bytes';
    const byteSizes = ['Bytes', 'Ki', 'Mi', 'Gi', 'Ti', 'Pi', 'Ei', 'Zi', 'Yi'];
    const i = Math.floor(Math.log(size) / Math.log(1024));
    return parseFloat((size / Math.pow(1024, i)).toFixed(2)) + byteSizes[i];
}

start(process.argv[2] || './');


#!/usr/bin/env node

const fs = require('fs').promises;
const startUsage = process.cpuUsage()
const _cliProgress = require('cli-progress');
const bar = new _cliProgress.SingleBar({}, _cliProgress.Presets.shades_classic);
var quota;

async function computeSize(dirname, dirent) {
    if (!dirent.isDirectory()) {
        return fs.lstat(dirname + "/" + dirent.name)
            .then((stats) => {
                quota += stats.size;
                bar.increment(stats.size / 1048576);
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
    bar.start(5000,0);
    computeDirectorySize(startDirname)
        .then(() => {
        bar.stop();
        console.log("Size : " + quota + " Bytes");
        console.log("Unit Size : " + humanFileSize(quota) + " Bytes");
        console.log("CPU Usage : " + humanTimeSize(process.cpuUsage(startUsage).user / 1000));
        });}

function humanFileSize(size) {
    if (size === 0) return '0 Bytes';
    const byteSizes = ['', 'Ki', 'Mi', 'Gi'];
    const i = Math.floor(Math.log(size) / Math.log(1024));
    return parseFloat((size / Math.pow(1024, i)).toFixed(2)) + byteSizes[i];
}

function humanTimeSize(time){
    if (time > 1000)
    {
        var humanTimeSize = time + " secondes";
    }
    else
    {
        var humanTimeSize = time + " millisecondes";
    }
    return humanTimeSize
}

start(process.argv[2] || process.env.HOME);

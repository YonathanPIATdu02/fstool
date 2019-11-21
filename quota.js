#!/usr/bin/env node

const yarg = require('yargs') // eslint-disable-line

    .usage(
        "$0 [option]", "Calcul le quota utilisé par le compte de l'utilisateur courant ou du répertoire précisé par l'option -d. Une barre de progression s'affichera par défaut."
    )
    .help()
    .option(
        'size', {
        alias: 's',
        type: 'number',
        default: 5000,
        description: 'Quota maximum en Mo'
    }
    )
    .option('quiet', {
        alias: 'q',
        type: 'boolean',
        default: false,
        description: 'Supprime la barre de progession'
    })
    .option('dir', {
        alias: 'd',
        type: 'string',
        default: process.env.HOME,
        description: 'Répertoire de départ du quota'
    })
    .argv


const fs = require('fs').promises;
const startUsage = process.cpuUsage()
const _cliProgress = require('cli-progress');
const bar = new _cliProgress.SingleBar({}, _cliProgress.Presets.shades_classic);


async function computeSize(dirname, dirent) {
    if (!dirent.isDirectory()) {
        return fs.lstat(dirname + "/" + dirent.name)
            .then((stats) => {
                quota += stats.size;
                if (!yarg['quiet']) {
                    bar.increment(stats.size / 1048576);
                }
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
    if (!yarg['quiet']) {
        bar.start(yarg['size'], 0);
    }
    computeDirectorySize(startDirname)
        .then(() => {
            bar.stop();
            console.log("Size : " + quota + " Bytes");
            console.log("Unit Size : " + humanFileSize(quota) + " Bytes");
            console.log("CPU Usage : " + humanTimeSize(process.cpuUsage(startUsage).user / 1000));
        });
}

function humanFileSize(size) {
    if (size === 0) return '0 Bytes';
    const byteSizes = ['', 'Ki', 'Mi', 'Gi'];
    const i = Math.floor(Math.log(size) / Math.log(1024));
    return parseFloat((size / Math.pow(1024, i)).toFixed(2)) + byteSizes[i];
}

function humanTimeSize(time) {
    if (time > 1000) {
        var humanTimeSize = time + " secondes";
    }
    else {
        var humanTimeSize = time + " millisecondes";
    }
    return humanTimeSize
}

start(yarg["dir"]);

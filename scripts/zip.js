/**
 * Zip Generation Script for @adminuiux/masonry
 */

'use strict';

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const currentDir = path.resolve(__dirname, '..');
const zipPath = path.resolve(currentDir, 'masonry.zip');

function createZip() {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(zipPath)) {
            try {
                fs.unlinkSync(zipPath);
            } catch (e) { }
        }

        const output = fs.createWriteStream(zipPath);
        const archive = archiver('zip', {
            zlib: { level: 9 }
        });

        output.on('close', function () {
            const sizeKB = (archive.pointer() / 1024).toFixed(1);
            console.log(`\x1b[32m✔ Successfully created masonry.zip (${sizeKB} KB)\x1b[0m at:`);
            console.log(`  ${zipPath}`);
            resolve(zipPath);
        });

        archive.on('warning', function (err) {
            if (err.code === 'ENOENT') {
                console.warn(err);
            } else {
                reject(err);
            }
        });

        archive.on('error', function (err) {
            reject(err);
        });

        archive.pipe(output);

        const pkgRaw = fs.readFileSync(path.resolve(currentDir, 'package.json'), 'utf8');
        const pkg = JSON.parse(pkgRaw);
        if (pkg.scripts) {
            delete pkg.scripts.zip;
        }
        archive.append(JSON.stringify(pkg, null, 2) + '\n', { name: 'package.json' });

        archive.glob('**/*', {
            cwd: currentDir,
            ignore: [
                '**/node_modules/**',
                'node_modules/**',
                '**/.git/**',
                '**/.DS_Store',
                'scripts/zip.js',
                'package.json',
                'masonry.zip',
                '*.zip',
                '**/*.zip'
            ],
            dot: true
        });

        archive.finalize();
    });
}

if (require.main === module) {
    createZip().catch((err) => {
        console.error('Error creating masonry.zip:', err);
        process.exit(1);
    });
}

module.exports = createZip;


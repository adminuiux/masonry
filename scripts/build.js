/**
 * Build Script for @adminuiux/masonry
 * Source of truth: src/masonry.js
 * Generates:
 *   - dist/masonry.js (Universal UMD bundle)
 *   - dist/masonry.esm.js (ES Module bundle)
 *   - dist/masonry.min.js (Minified production bundle)
 *   - dist/masonry.min.js.map (Source map)
 */

'use strict';

const fs = require('fs');
const path = require('path');
const terser = require('terser');

const rootDir = path.resolve(__dirname, '..');
const srcFile = path.join(rootDir, 'src', 'masonry.js');
const distDir = path.join(rootDir, 'dist');

if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// 1. Read main source file
const srcCode = fs.readFileSync(srcFile, 'utf8');

// 2. Generate dist/masonry.js (Universal UMD)
fs.writeFileSync(path.join(distDir, 'masonry.js'), srcCode, 'utf8');
console.log('✔ Built dist/masonry.js (' + srcCode.length + ' bytes)');

// 3. Generate dist/masonry.esm.js (ES Module)
function convertUmdToEsm(code) {
    const bannerMatch = code.match(/^(\/\*\*[\s\S]*?\*\/\s*)/);
    const banner = bannerMatch ? bannerMatch[1].trim() + '\n\n' : '';

    const strictIndex = code.indexOf("'use strict';");
    const bodyStart = strictIndex !== -1 ? strictIndex + "'use strict';".length : 0;
    const returnIndex = code.lastIndexOf('return {');

    let innerBody = (returnIndex !== -1 ? code.slice(bodyStart, returnIndex) : code.slice(bodyStart)).trim();

    const esmExports = `

export {
    AdminUIUXMasonry,
    initMasonry
};

export default AdminUIUXMasonry;
`;

    return banner + innerBody + esmExports;
}

const esmCode = convertUmdToEsm(srcCode);
fs.writeFileSync(path.join(distDir, 'masonry.esm.js'), esmCode, 'utf8');
console.log('✔ Built dist/masonry.esm.js (' + esmCode.length + ' bytes)');

// 4. Generate dist/masonry.min.js and source map
terser.minify(srcCode, {
    compress: { drop_console: false },
    mangle: true,
    output: { comments: /^!|@license|@adminuiux/ },
    sourceMap: {
        filename: 'masonry.min.js',
        url: 'masonry.min.js.map'
    }
}).then(minified => {
    fs.writeFileSync(path.join(distDir, 'masonry.min.js'), minified.code);
    if (minified.map) {
        fs.writeFileSync(path.join(distDir, 'masonry.min.js.map'), minified.map);
        console.log('✔ Built dist/masonry.min.js.map (' + minified.map.length + ' bytes)');
    }
    console.log('✔ Built dist/masonry.min.js (' + minified.code.length + ' bytes)');
    console.log('✔ All builds generated successfully in dist/');
}).catch(err => {
    console.error('Build error:', err);
    process.exit(1);
});


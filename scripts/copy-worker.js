const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();
const openNextDir = path.join(projectRoot, '.open-next');
const assetsDir = path.join(openNextDir, 'assets');
const dest = path.join(assetsDir, '_worker.js');

// Function to copy file with logging
// Function to copy directory recursively
function copyDir(src, dest) {
    if (fs.existsSync(src)) {
        console.log(`[DEBUG] Copying dir ${src} to ${dest}`);
        fs.cpSync(src, dest, { recursive: true });
    }
}

// Function to copy file
function copyFile(src, dest) {
    if (fs.existsSync(src)) {
        console.log(`[DEBUG] Copying file ${src} to ${dest}`);
        fs.copyFileSync(src, dest);
        return true;
    }
    return false;
}

// Ensure assets directory exists
if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
}

// Copy dependencies required by _worker.js
const dirsToCopy = ['cloudflare', 'server-functions', 'middleware', '.build'];
dirsToCopy.forEach(dirName => {
    copyDir(path.join(openNextDir, dirName), path.join(assetsDir, dirName));
});

// Check and copy worker file
const workerJs = path.join(openNextDir, 'worker.js');
const underscoreWorkerJs = path.join(openNextDir, '_worker.js');

if (!copyFile(workerJs, dest)) {
    if (!copyFile(underscoreWorkerJs, dest)) {
        console.log('[DEBUG] No worker file found in .open-next root.');
    } else {
        console.log('[DEBUG] Copied _worker.js to assets/_worker.js');
    }
} else {
    console.log('[DEBUG] Copied worker.js to assets/_worker.js');
}

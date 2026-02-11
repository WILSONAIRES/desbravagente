const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();
const openNextDir = path.join(projectRoot, '.open-next');
const assetsDir = path.join(openNextDir, 'assets');
const dest = path.join(assetsDir, '_worker.js');

// Function to copy file with logging
function copyWorker(sourceVal, sourceName) {
    if (fs.existsSync(sourceVal)) {
        console.log(`[DEBUG] Found ${sourceName} at ${sourceVal}`);
        if (!fs.existsSync(assetsDir)) {
            fs.mkdirSync(assetsDir, { recursive: true });
        }
        fs.copyFileSync(sourceVal, dest);
        console.log(`[DEBUG] Copied to ${dest}`);
        return true;
    }
    return false;
}

// Check for worker.js or _worker.js in .open-next root
const workerJs = path.join(openNextDir, 'worker.js');
const underscoreWorkerJs = path.join(openNextDir, '_worker.js');

if (!copyWorker(workerJs, 'worker.js')) {
    if (!copyWorker(underscoreWorkerJs, '_worker.js')) {
        console.log('[DEBUG] No worker file found in .open-next root.');
        if (fs.existsSync(dest)) {
            console.log('[DEBUG] _worker.js already exists in assets.');
        } else {
            console.log('[WARN] _worker.js NOT found in assets! Deployment might fail to serve dynamic content.');
        }
    }
}

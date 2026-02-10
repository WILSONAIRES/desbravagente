const fs = require('fs');
const readline = require('readline');

async function findLine() {
    const fileStream = fs.createReadStream('./data/specialties.ts');
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let lineNumber = 0;
    for await (const line of rl) {
        lineNumber++;
        if (line.includes('export const specialties')) {
            console.log(`Found at line: ${lineNumber}`);
            console.log(`Content: ${line}`);
            break;
        }
    }
}

findLine();

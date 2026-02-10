const fs = require('fs');
const content = fs.readFileSync('./data/specialties.ts', 'utf8');

// Simple regex to find ids in the JSON-like structure
const idMatch = content.match(/"id":\s*"([^"]+)"/g);
const ids = idMatch ? idMatch.map(m => m.match(/"id":\s*"([^"]+)"/)[1]) : [];

const counts = {};
const duplicates = [];

ids.forEach(id => {
    counts[id] = (counts[id] || 0) + 1;
    if (counts[id] === 2) {
        duplicates.push(id);
    }
});

console.log('Total IDs found:', ids.length);
console.log('Duplicate IDs found:', duplicates.length);
if (duplicates.length > 0) {
    console.log('Duplicates:', duplicates);
}

// Also check for name duplicates
const nameMatch = content.match(/"name":\s*"([^"]+)"/g);
const names = nameMatch ? nameMatch.map(m => m.match(/"name":\s*"([^"]+)"/)[1]) : [];
const nameCounts = {};
const nameDuplicates = [];
names.forEach(name => {
    nameCounts[name] = (nameCounts[name] || 0) + 1;
    if (nameCounts[name] === 2) {
        nameDuplicates.push(name);
    }
});
console.log('Total Names found:', names.length);
console.log('Duplicate Names found:', nameDuplicates.length);
if (nameDuplicates.length > 0) {
    console.log('Duplicate names:', nameDuplicates);
}

// Find where these duplicates come from (categories)
duplicates.forEach(id => {
    const regex = new RegExp(`"id":\\s*"${id}"[\\s\\S]*?"category":\\s*"([^"]+)"`, 'g');
    let match;
    console.log(`\nOrigin of duplicate ID: ${id}`);
    while ((match = regex.exec(content)) !== null) {
        console.log(`- Category: ${match[1]}`);
    }
});

const fs = require('fs');
const path = require('path');

const classesPath = path.join(__dirname, '../data/classes.ts');
const classesRealPath = path.join(__dirname, '../data/classes-real.ts');

const classesContent = fs.readFileSync(classesPath, 'utf8');
const realContent = fs.readFileSync(classesRealPath, 'utf8');

// Extract interfaces from classes.ts (up to "export const classes")
const interfaces = classesContent.split('export const classes')[0];

// Extract data from classes-real.ts (remove imports)
const data = realContent.replace(/import .*?;\n/, '');

const newContent = interfaces + data;

fs.writeFileSync(classesPath, newContent);
console.log('Merged data into classes.ts');

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/specialties.ts');
const content = fs.readFileSync(filePath, 'utf8');

// Extract the specialties array from the TS file
const specialtiesMatch = content.match(/export const specialties: Specialty\[] = (\[[\s\S]*\])\s*$/);
if (!specialtiesMatch) {
    console.error('Could not find specialties array in file');
    process.exit(1);
}

let specialties = JSON.parse(specialtiesMatch[1]);

console.log(`Processing ${specialties.length} specialties...`);

specialties = specialties.map(specialty => {
    const rawReqs = specialty.requirements;

    // 1. First pass: Handle the duplication bug (1..N, 1..N)
    // If half of the requirements are identical to the first half, truncate.
    if (rawReqs.length > 0 && rawReqs.length % 2 === 0) {
        const half = rawReqs.length / 2;
        const firstHalf = rawReqs.slice(0, half).map(r => r.description).join('|||');
        const secondHalf = rawReqs.slice(half).map(r => r.description).join('|||');
        if (firstHalf === secondHalf) {
            rawReqs.splice(half);
        }
    }

    // 2. Second pass: Merge sub-items
    const mergedReqs = [];
    for (let i = 0; i < rawReqs.length; i++) {
        let current = { ...rawReqs[i] };

        // If it ends with a colon, it might have subitems
        if (current.description.trim().endsWith(':')) {
            let j = i + 1;
            let subitems = [];
            while (j < rawReqs.length) {
                const next = rawReqs[j];
                const desc = next.description.trim();

                // STOP if the next item is also a parent
                if (desc.endsWith(':')) break;

                // Heuristic for subitem: 
                // - Short (relative to main requirements)
                // - OR doesn't end with a period
                const isShort = desc.length < 120;
                const endsWithPeriod = /[\.!?]$/.test(desc);

                if (isShort || !endsWithPeriod) {
                    subitems.push(desc);
                    j++;
                } else {
                    break;
                }
            }

            if (subitems.length > 0) {
                const prefix = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't'];
                const formattedSubitems = subitems.map((item, index) => {
                    const char = prefix[index] || '-';
                    return `   ${char}) ${item}`;
                }).join('\n');

                current.description = `${current.description}\n${formattedSubitems}`;
                i = j - 1;
            }
        }
        mergedReqs.push(current);
    }

    // 3. Re-index IDs to be sequential
    specialty.requirements = mergedReqs.map((req, index) => ({
        id: `${specialty.id}-${index + 1}`,
        description: req.description
    }));

    return specialty;
});

// Reconstruct the file
const header = content.substring(0, specialtiesMatch.index);
const footer = ""; // Assuming it's at the end
const finalOutput = `${header}export const specialties: Specialty[] = ${JSON.stringify(specialties, null, 4)}\n`;

fs.writeFileSync(filePath, finalOutput);
console.log('Successfully fixed specialties data!');

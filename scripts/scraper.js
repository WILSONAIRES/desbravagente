const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const CLASSES_URLS = [
    { id: 'amigo', name: 'Amigo', url: 'https://mda.wiki.br/Cart%C3%A3o_de_Amigo/', minAge: 10, color: 'blue' },
    { id: 'companheiro', name: 'Companheiro', url: 'https://mda.wiki.br/Cart%C3%A3o_de_Companheiro/', minAge: 11, color: 'red' },
    { id: 'pesquisador', name: 'Pesquisador', url: 'https://mda.wiki.br/Cart%C3%A3o_de_Pesquisador/', minAge: 12, color: 'green' },
    { id: 'pioneiro', name: 'Pioneiro', url: 'https://mda.wiki.br/Cart%C3%A3o_de_Pioneiro/', minAge: 13, color: 'gray' },
    { id: 'excursionista', name: 'Excursionista', url: 'https://mda.wiki.br/Cart%C3%A3o_de_Excursionista/', minAge: 14, color: 'purple' },
    { id: 'guia', name: 'Guia', url: 'https://mda.wiki.br/Cart%C3%A3o_de_Guia/', minAge: 15, color: 'yellow' },
];

async function scrapeClass(cls) {
    console.log(`Scraping ${cls.name}...`);
    try {
        const { data } = await axios.get(cls.url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
        });
        const $ = cheerio.load(data);

        const sections = [];
        let currentSection = null;

        // MDA Wiki Custom Skin Structure
        // Content is in #page-content .text-justify
        const contentDiv = $('#page-content .text-justify');

        contentDiv.children().each((i, el) => {
            const tagName = $(el).prop('tagName').toLowerCase();

            if (tagName === 'h2') {
                const title = $(el).text().trim().replace(/\[.*?\]/g, '');
                if (title) {
                    currentSection = { title, requirements: [] };
                    sections.push(currentSection);
                }
            } else if ((tagName === 'ul' || tagName === 'ol') && currentSection) {
                $(el).find('li').each((j, li) => {
                    // Start of requirement text logic
                    // Often inside span.texto, but sometimes direct text
                    let text = $(li).find('.texto').text().trim();
                    if (!text) text = $(li).text().trim();

                    // Clean up text (remove newlines, extra spaces)
                    text = text.replace(/\s+/g, ' ');

                    // Skip empty or 'See also' type links if necessary
                    if (text) {
                        currentSection.requirements.push({
                            id: `${cls.id}-${sections.length}-${currentSection.requirements.length + 1}`,
                            description: text
                        });
                    }
                });
            }
        });

        // Filter empty sections
        return {
            ...cls,
            type: 'regular',
            sections: sections.filter(s => s.requirements.length > 0)
        };

    } catch (error) {
        console.error(`Error scraping ${cls.name}:`, error.message);
        return null;
    }
}

async function main() {
    const results = [];
    for (const cls of CLASSES_URLS) {
        const result = await scrapeClass(cls);
        if (result) results.push(result);
        await new Promise(r => setTimeout(r, 1000)); // Respectful delay
    }

    const outputContent = `
import { PathfinderClass } from "./classes";

export const classes: PathfinderClass[] = ${JSON.stringify(results, null, 2)};
    `;

    fs.writeFileSync(path.join(__dirname, '../data/classes-real.ts'), outputContent.trim());
    console.log('Done! Saved to data/classes-real.ts');
}

main();

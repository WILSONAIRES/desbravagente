const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const OUTPUT_FILE = path.join(__dirname, '../data/specialties.ts');

const categoryPages = [
    { url: 'https://mda.wiki.br/ADRA/', categoryId: 'adra' },
    { url: 'https://mda.wiki.br/Artes_e_Habilidades_Manuais/', categoryId: 'artes-habilidades' },
    { url: 'https://mda.wiki.br/Atividades_Agrícolas/', categoryId: 'atividades-agricolas' },
    { url: 'https://mda.wiki.br/Atividades_Missionárias_e_Comunitárias/', categoryId: 'atividades-missionarias' },
    { url: 'https://mda.wiki.br/Atividades_Profissionais/', categoryId: 'atividades-profissionais' },
    { url: 'https://mda.wiki.br/Atividades_Recreativas/', categoryId: 'atividades-recreativas' },
    { url: 'https://mda.wiki.br/Ciência_e_Saúde/', categoryId: 'ciencia-saude' },
    { url: 'https://mda.wiki.br/Estudos_da_Natureza/', categoryId: 'estudo-natureza' },
    { url: 'https://mda.wiki.br/Habilidades_Domésticas/', categoryId: 'habilidades-domesticas' }
];

const categoryColors = {
    'adra': 'bg-blue-600',
    'artes-habilidades': 'bg-red-600',
    'atividades-agricolas': 'bg-green-700',
    'atividades-missionarias': 'bg-blue-800',
    'atividades-profissionais': 'bg-gray-600',
    'atividades-recreativas': 'bg-green-600',
    'ciencia-saude': 'bg-red-700',
    'estudo-natureza': 'bg-white text-black border',
    'habilidades-domesticas': 'bg-yellow-600'
};

async function getSpecialtyLinks(url, categoryId) {
    console.log(`Fetching category: ${url}`);
    try {
        const response = await axios.get(url, { timeout: 15000 });
        const $ = cheerio.load(response.data);
        const links = [];

        // Updated selector to target actual links within the category content reliably
        $('#page-content a, .text-justify a, .panel-body a').each((i, el) => {
            const href = $(el).attr('href');
            let name = $(el).text().trim();

            // Skip empty names or navigation links
            if (!name || name.length < 3) return;

            // Clean name from leftover codes if any
            name = name.replace(/^[A-Z]+-[0-9]+\s*-\s*/, '');

            if (href && (href.includes('Especialidade_de_') || href.includes('Mestrado_de_'))) {
                const id = href.split('/').filter(Boolean).pop().toLowerCase()
                    .replace(/especialidade_de_/g, '')
                    .replace(/mestrado_de_/g, '')
                    .replace(/_/g, '-');

                // Extract code if present (e.g., "AA-001 - Avicultura")
                const originalText = $(el).text().trim();
                const codeMatch = originalText.match(/([A-Z]+-[0-9]+)/);
                const code = codeMatch ? codeMatch[1] : null;

                links.push({
                    id,
                    name,
                    code,
                    url: href.startsWith('http') ? href : `https://mda.wiki.br${href}`,
                    categoryId
                });
            }
        });

        // Filter and Deduplicate links
        const uniqueLinks = [];
        const seenUrls = new Set();
        for (const link of links) {
            if (!seenUrls.has(link.url)) {
                seenUrls.add(link.url);
                uniqueLinks.push(link);
            }
        }
        return uniqueLinks;
    } catch (error) {
        console.error(`Error fetching category ${url}:`, error.message);
        return [];
    }
}

async function getSpecialtyRequirements(specialty) {
    console.log(`  Scraping: ${specialty.name} [${specialty.categoryId}]`);
    try {
        const response = await axios.get(specialty.url, {
            timeout: 15000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        const $ = cheerio.load(response.data);

        const requirements = [];
        let reqCount = 0;

        // The requirement lists are usually <ol> elements within #page-content
        // We find the first list and iterate over ALL its direct children (li, ol, ul)
        const mainList = $('#page-content ol, #page-content ul').first();

        if (mainList.length) {
            mainList.children().each((j, el) => {
                const node = $(el);

                if (node.is('li')) {
                    // This is a main requirement
                    let text = node.clone().children('ol, ul').remove().end().text().trim();

                    // Also check for TRULY nested lists inside this LI
                    const nested = node.children('ol, ul');
                    if (nested.length > 0) {
                        const subItems = [];
                        nested.find('li').each((k, sEl) => {
                            const sText = $(sEl).text().trim();
                            if (sText) subItems.push(sText);
                        });
                        if (subItems.length > 0) {
                            const prefix = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't'];
                            const formatted = subItems.map((s, idx) => `   ${prefix[idx] || '-'}) ${s}`).join('\n');
                            text = `${text}\n${formatted}`;
                        }
                    }

                    if (text && text.length > 2) {
                        reqCount++;
                        requirements.push({
                            id: `${specialty.id}-${reqCount}`,
                            description: text.substring(0, 3000).replace(/\s+/g, ' ')
                        });
                    }
                } else if ((node.is('ol') || node.is('ul')) && requirements.length > 0) {
                    // This is a sibling list that acts as sub-items for the last requirement
                    const subItems = [];
                    node.find('li').each((k, sEl) => {
                        const sText = $(sEl).text().trim();
                        if (sText) subItems.push(sText);
                    });

                    if (subItems.length > 0) {
                        const lastReq = requirements[requirements.length - 1];
                        const prefix = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't'];
                        const formatted = subItems.map((s, idx) => `\n   ${prefix[idx] || '-'}) ${s}`).join('');
                        lastReq.description += formatted;
                    }
                }
            });
        }

        // If not found in the first <ol>, try a more generic approach (flat list of LI)
        if (requirements.length === 0) {
            $('#page-content li').each((j, liEl) => {
                const text = $(liEl).text().trim();
                if (text && text.length > 10 && !text.includes('Wiki')) {
                    reqCount++;
                    requirements.push({
                        id: `${specialty.id}-${reqCount}`,
                        description: text.substring(0, 3000).replace(/\s+/g, ' ')
                    });
                }
            });
        }

        return requirements;
    } catch (error) {
        console.error(`  Error scraping ${specialty.name}:`, error.message);
        return [];
    }
}

async function main() {
    const specialtiesMap = new Map();

    for (const category of categoryPages) {
        console.log(`\n=== Processing ${category.categoryId} ===`);
        const links = await getSpecialtyLinks(category.url, category.categoryId);
        console.log(`Found ${links.length} specialty links for this category`);

        for (const specialty of links) {
            // Global check: if we already have this specialty ID, skip it
            if (specialtiesMap.has(specialty.id)) {
                continue;
            }

            const requirements = await getSpecialtyRequirements(specialty);

            if (requirements.length > 0) {
                specialtiesMap.set(specialty.id, {
                    id: specialty.id,
                    name: specialty.name,
                    code: specialty.code,
                    category: specialty.categoryId,
                    level: 1, // Default level
                    color: categoryColors[specialty.categoryId] || 'bg-blue-600',
                    requirements
                });
            }
        }
    }

    // Convert to array and sort for consistency
    const allSpecialties = Array.from(specialtiesMap.values()).sort((a, b) => a.id.localeCompare(b.id));

    const fileContent = `export interface SpecialtyRequirement {
    id: string
    description: string
}

export interface Specialty {
    id: string
    name: string
    code?: string | null
    category: string
    level: 1 | 2 | 3
    color: string
    requirements: SpecialtyRequirement[]
    image?: string
}

export const specialtyCategories = [
    { id: "adra", name: "ADRA", color: "bg-blue-600" },
    { id: "artes-habilidades", name: "Artes e Habilidades Manuais", color: "bg-red-600" },
    { id: "atividades-agricolas", name: "Atividades Agrícolas", color: "bg-green-700" },
    { id: "atividades-missionarias", name: "Atividades Missionárias", color: "bg-blue-800" },
    { id: "atividades-profissionais", name: "Atividades Profissionais", color: "bg-gray-600" },
    { id: "atividades-recreativas", name: "Atividades Recreativas", color: "bg-green-600" },
    { id: "ciencia-saude", name: "Ciência e Saúde", color: "bg-red-700" },
    { id: "estudo-natureza", name: "Estudos da Natureza", color: "bg-white text-black border" },
    { id: "habilidades-domesticas", name: "Habilidades Domésticas", color: "bg-yellow-600" },
];

export function getSpecialtyImage(code?: string | null): string {
    if (!code) return "/placeholder-specialty.png"
    // Code can be AM-EB-001 or AA-001. Pattern is always letters then numbers.
    // MDA Wiki use lowercase code without dashes: aa001, ameb001
    const cleanCode = code.toLowerCase().replace(/-/g, "")
    return \`https://mda.wiki.br/site/@imgs_wiki_cp/imagem@\${cleanCode}.png\`
}

export const specialties: Specialty[] = ${JSON.stringify(allSpecialties, null, 4)};
`;

    fs.writeFileSync(OUTPUT_FILE, fileContent);
    console.log(`\n=== Done! Successfully generated and sorted \${allSpecialties.length} unique specialties ===`);
}

main();

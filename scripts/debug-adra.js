const axios = require('axios');
const fs = require('fs');

async function main() {
    try {
        const response = await axios.get('https://mda.wiki.br/ADRA/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        fs.writeFileSync('./debug-adra.html', response.data);
        console.log('Saved debug-adra.html');
        console.log('Content length:', response.data.length);
        console.log('First 2000 chars:', response.data.substring(0, 2000));
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();

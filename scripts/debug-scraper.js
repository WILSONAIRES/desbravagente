const axios = require('axios');
const fs = require('fs');

async function debug() {
    try {
        const { data } = await axios.get('https://mda.wiki.br/Cart%C3%A3o_de_Amigo/', {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
        });
        fs.writeFileSync('debug.html', data);
        console.log('Saved debug.html');
    } catch (e) {
        console.error(e);
    }
}

debug();

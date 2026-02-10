// Script temporário para adicionar Suspense em todas as páginas view
// Este arquivo pode ser deletado após o uso

const fs = require('fs');
const path = require('path');

const viewPages = [
    'app/dashboard/specialties/view/page.tsx',
    'app/dashboard/contents/view/page.tsx',
    'app/dashboard/club/members/view/page.tsx',
    'app/dashboard/club/units/view/page.tsx'
];

viewPages.forEach(filePath => {
    const fullPath = path.join(process.cwd(), filePath);
    let content = fs.readFileSync(fullPath, 'utf8');

    // Se já tem Suspense, pula
    if (content.includes('export default function') && content.includes('Suspense')) {
        console.log(`✓ ${filePath} já tem Suspense`);
        return;
    }

    // Adiciona Suspense ao import do React
    if (!content.includes(', Suspense')) {
        content = content.replace(
            /from "react"/,
            ', Suspense } from "react"'
        ).replace(
            /import React, \{/,
            'import React, { Suspense,'
        );
    }

    // Encontra o nome da função export default
    const match = content.match(/export default function (\w+)/);
    if (!match) {
        console.log(`✗ ${filePath} - não encontrou export default function`);
        return;
    }

    const functionName = match[1];
    const contentFunctionName = functionName.replace('Page', 'Content');

    // Renomeia a função principal
    content = content.replace(
        `export default function ${functionName}`,
        `function ${contentFunctionName}`
    );

    // Adiciona o wrapper no final
    content += `\n\nexport default function ${functionName}() {
    return (
        <Suspense fallback={<div className="p-8 text-center">Carregando...</div>}>
            <${contentFunctionName} />
        </Suspense>
    );
}\n`;

    fs.writeFileSync(fullPath, content);
    console.log(`✓ ${filePath} atualizado`);
});

console.log('\n✅ Todas as páginas view foram atualizadas!');

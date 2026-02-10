import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Página Não Encontrada</h2>
            <p className="text-muted-foreground mb-8">Desculpe, não conseguimos encontrar a página que você está procurando.</p>
            <Link href="/">
                <Button>Voltar para o Início</Button>
            </Link>
        </div>
    )
}

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-background">
      <main className="flex flex-col gap-8 items-center max-w-2xl">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-primary">
          Desbravagente
        </h1>
        <p className="text-xl text-muted-foreground">
          Seu assistente inteligente sempre Alerta para servir.
        </p>

        <div className="flex flex-wrap gap-4 justify-center mt-8">
          <Link href="/login">
            <Button size="lg" className="w-full sm:w-auto">
              Entrar
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Criar Conta
            </Button>
          </Link>
        </div>
      </main>

      <footer className="mt-16 text-sm text-muted-foreground">
        © {new Date().getFullYear()} Desbravagente.
      </footer>
    </div>
  );
}

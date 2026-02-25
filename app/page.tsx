"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Shield, Compass, ChevronRight } from "lucide-react";
import { useEffect } from "react";

const HomeBackground = ({ imagePath }: { imagePath: string }) => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${imagePath})` }}
      />
      {/* Artistic Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-200 via-transparent to-transparent opacity-80" />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
    </div>
  )
}

export default function Home() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden">
      <HomeBackground imagePath="/bg-home.png" />

      <main className="relative z-10 w-full max-w-4xl">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium shadow-2xl"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Gestão Eficiente e com Propósito</span>
          </motion.div>

          {/* Logo/Title Section */}
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-6xl md:text-8xl font-black tracking-tighter text-white"
            >
              <span className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                Desbrava
              </span>
              <span className="text-primary italic">gente</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto font-medium leading-relaxed"
            >
              O assistente inteligente <span className="text-white font-bold underline decoration-primary decoration-4 underline-offset-4">sempre Avante</span> para servir Diretores e Instrutores de Desbravadores.
            </motion.p>
          </div>

          {/* Features Grid Simulation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-8"
          >
            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 flex flex-col items-center gap-3 transition-all hover:bg-white/10 hover:border-white/20">
              <Shield className="w-8 h-8 text-primary" />
              <h3 className="text-white font-bold">Gestão Segura</h3>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 flex flex-col items-center gap-3 transition-all hover:bg-white/10 hover:border-white/20">
              <Sparkles className="w-8 h-8 text-primary" />
              <h3 className="text-white font-bold">IA Especialista</h3>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 flex flex-col items-center gap-3 transition-all hover:bg-white/10 hover:border-white/20">
              <Compass className="w-8 h-8 text-primary" />
              <h3 className="text-white font-bold">Trilha Única</h3>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-8"
          >
            <Link href="/login" className="contents">
              <Button size="lg" className="h-14 px-10 text-lg font-bold shadow-[0_0_30px_rgba(var(--primary),0.3)] transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
                Começar Agora
                <ChevronRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/register" className="contents">
              <Button variant="outline" size="lg" className="h-14 px-10 text-lg font-bold border-white/20 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 transition-all hover:scale-105 active:scale-95">
                Criar Conta Grátis
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>

      <footer className="relative z-10 mt-20 text-white/40 text-sm font-medium tracking-widest flex flex-col items-center gap-4">
        <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <p>© {new Date().getFullYear()} DESBRAVAGENTE. CAMPORI TECNOLÓGICO.</p>
      </footer>
    </div>
  );
}

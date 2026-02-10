import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true
  },
  // O Cloudflare Pages (next-on-pages) gerencia o runtime
  // Não precisamos forçar configurações experimentais aqui
};

export default nextConfig;

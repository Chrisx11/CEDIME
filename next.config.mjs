/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false, // Mudado para false para detectar erros em produção
  },
  images: {
    unoptimized: false, // Vercel otimiza imagens automaticamente
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  // Otimizações para produção
  compress: true,
  poweredByHeader: false,
}

export default nextConfig

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
// }

// module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    esmExternals: 'loose',
  }
  ,
  images: {
    domains: [
      'ujswkxqlkeyegananzqn.supabase.co', // Votre domaine Supabase
      'lh3.googleusercontent.com' // Exemple d'autre domaine que vous pourriez utiliser
    ],
  },
  // Vos autres configurations...
}

module.exports = nextConfig
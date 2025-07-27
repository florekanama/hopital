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
  images: {
    domains: [
      'jvfgrhhasvbauoxaazex.supabase.co', // Votre domaine Supabase
      'lh3.googleusercontent.com' // Exemple d'autre domaine que vous pourriez utiliser
    ],
  },
  // Vos autres configurations...
}

module.exports = nextConfig
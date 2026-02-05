/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '2.gravatar.com',
        port: '',
        pathname: '/avatar/**',
      },
    ],
  },
}

module.exports = nextConfig
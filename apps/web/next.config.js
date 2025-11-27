/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Убрали env.CUSTOM_KEY так как он не используется
}

module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbo: false,
  experimental: {
    optimizeCss: false, // Try disabling CSS optimization
  },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbo: false,
  experimental: {
    optimizeCss: false, // Try disabling CSS optimization
  },

  images:{
    remotePatterns:[
      {
        "hostname":"ik.imagekit.io"
      }
    ]
  }
};

module.exports = nextConfig;

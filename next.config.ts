
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb', // or larger, like '100mb'
    }
  }
};

module.exports = nextConfig;

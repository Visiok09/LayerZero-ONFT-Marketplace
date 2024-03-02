const nextConfig = {
  reactStrictMode: true,
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false };

    return config;
  },
  images: {
    domains: ['yoursubdomain.infura-ipfs.io'],
    formats: ['image/webp'],
  },
};

module.exports = nextConfig;

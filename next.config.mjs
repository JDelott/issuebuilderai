/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Disable React Strict Mode temporarily to test if it's affecting HMR
  // reactStrictMode: false,

  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: /node_modules/,
      };
    }
    return config;
  },
};

export default nextConfig;

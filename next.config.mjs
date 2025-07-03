// next.config.mjs
const nextConfig = {
  allowedDevOrigins: ["*"],
  images: {
    domains: ["firebasestorage.googleapis.com"],
  },
};

export default nextConfig;

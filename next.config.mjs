// next.config.mjs
const nextConfig = {
  allowedDevOrigins: ["*"],
  images: {
    domains: ["firebasestorage.googleapis.com"],
  },
  // 캐시 설정
  experimental: {
    // 동적 렌더링 강제
    forceDynamic: true,
  },
  // 헤더 설정으로 캐시 비활성화
  async headers() {
    return [
      {
        source: '/products/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
      {
        source: '/custom-made-gallery',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

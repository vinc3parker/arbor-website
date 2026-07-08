import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Aegle was renamed to Aevo — preserve old links and any indexed URLs.
      {
        source: "/aegle",
        destination: "/aevo",
        permanent: true,
      },
      {
        source: "/blog/aegle-beta-launch",
        destination: "/blog/aevo-beta-launch",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/products/tumeric-powder",
        destination: "/products/turmeric-powder",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

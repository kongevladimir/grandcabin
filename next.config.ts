import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/concepts/retreat/:path*",
        destination: "/:path*",
        permanent: true,
      },
      {
        source: "/concepts/:path*",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

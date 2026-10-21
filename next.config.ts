import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/login",
        destination: "/admin",
        permanent: true,
      },
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

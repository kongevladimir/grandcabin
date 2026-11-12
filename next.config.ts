import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Local preview bookings and test artefacts must never be copied into a
  // production server trace. Git ignores do not affect Next.js file tracing.
  outputFileTracingExcludes: {
    "/*": ["./.booking-data/**/*", "./.booking-owner-access.txt"],
  },
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

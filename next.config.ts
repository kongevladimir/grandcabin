import type { NextConfig } from "next";

const retiredConcepts = [
  "/concepts/destination",
  "/concepts/editorial",
  "/concepts/groups",
  "/concepts/panorama",
  "/concepts/panorama-2",
  "/concepts/panorama-3",
  "/concepts/panorama-4",
  "/concepts/chalet",
];

const nextConfig: NextConfig = {
  async redirects() {
    return retiredConcepts.map((source) => ({
      source,
      destination: "/concepts/retreat",
      permanent: true,
    }));
  },
};

export default nextConfig;

import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  // Only canonical public pages; never include account or guest-specific URLs.
  const paths = [
    "/", "/cabin", "/bedrooms", "/materials", "/gallery", "/location",
    "/3d-tour", "/meetings", "/turufjell", "/turufjell/activities",
    "/booking", "/booking/privacy",
  ];
  return paths.map(path => ({ url: new URL(path, "https://turucrown.no").href }));
}

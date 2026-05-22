import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow the dev server to be reached from these origins on the LAN so
  // testing on a phone / tablet over Wi-Fi works without warnings.
  allowedDevOrigins: [
    "192.168.100.124",
    "http://192.168.100.124:3000",
  ],
  images: {
    // Phase 4 mock placeholders render as SVG from /api/placeholder/...
    // Same-origin and trusted, so allow SVG through next/image. The
    // photography pass will replace these with raster CDN URLs.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Laravel-hosted assets (banner uploads, product photos). Localhost
    // in dev, the Hostinger api subdomain in prod.
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "8000", pathname: "/storage/**" },
      { protocol: "http", hostname: "127.0.0.1", port: "8000", pathname: "/storage/**" },
      // Add the prod API origin once we deploy:
      // { protocol: "https", hostname: "api.bingo.dz", pathname: "/storage/**" },
    ],
    localPatterns: [
      {
        pathname: "/api/placeholder/**",
        search: "",
      },
      {
        pathname: "/hero/**",
        search: "",
      },
      {
        pathname: "/dividers/**",
        search: "",
      },
      {
        pathname: "/editorial/**",
        search: "",
      },
      {
        pathname: "/products/**",
        search: "",
      },
      {
        pathname: "/spotlight/**",
        search: "",
      },

    ],

  },
};

export default nextConfig;

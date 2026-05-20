import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Phase 4 mock placeholders render as SVG from /api/placeholder/...
    // Same-origin and trusted, so allow SVG through next/image. The
    // photography pass will replace these with raster CDN URLs.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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

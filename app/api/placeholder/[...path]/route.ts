import { type NextRequest } from "next/server";

/**
 * Placeholder image generator.
 *
 * Routes like `/api/placeholder/800/600?text=Tente` return an SVG with the
 * requested dimensions on a brand-coloured background. Used everywhere
 * mock products list a /api/placeholder URL in their images array. Will be
 * removed once the photography pass replaces them with real CDN URLs.
 */

const PALETTES: Array<{ bg: string; fg: string; accent: string }> = [
  { bg: "#f1ead9", fg: "#562c10", accent: "#803e15" }, // parchment / wood
  { bg: "#e3ebe4", fg: "#142e19", accent: "#345b3f" }, // forest pale
  { bg: "#f4e8db", fg: "#48260f", accent: "#6a3411" }, // wood pale
  { bg: "#1a3f20", fg: "#faf6ef", accent: "#c88a58" }, // forest dark
  { bg: "#562c10", fg: "#faf6ef", accent: "#d9af86" }, // wood dark
];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function pickPalette(seed: string) {
  return PALETTES[hash(seed) % PALETTES.length]!;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function escapeXml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const w = clamp(parseInt(path[0] ?? "600", 10) || 600, 32, 2000);
  const h = clamp(parseInt(path[1] ?? path[0] ?? "600", 10) || 600, 32, 2000);
  const rawText = request.nextUrl.searchParams.get("text") ?? "";
  const text = rawText.replace(/\+/g, " ").trim().slice(0, 64) || "BINGO";
  const palette = pickPalette(text + w + h);

  const titleLines = text.split(/\s+/);
  const fontSize = Math.max(24, Math.min(w, h) / 12);

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${palette.bg}"/>
      <stop offset="100%" stop-color="${palette.accent}" stop-opacity="0.25"/>
    </linearGradient>
    <pattern id="dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.2" fill="${palette.accent}" fill-opacity="0.18"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <rect width="100%" height="100%" fill="url(#dots)"/>

  <!-- Decorative concentric ridge -->
  <g fill="none" stroke="${palette.accent}" stroke-opacity="0.25" stroke-width="2">
    <path d="M ${w * 0.1} ${h * 0.78} Q ${w * 0.5} ${h * 0.55} ${w * 0.9} ${h * 0.82}"/>
    <path d="M ${w * 0.05} ${h * 0.86} Q ${w * 0.5} ${h * 0.62} ${w * 0.95} ${h * 0.9}"/>
    <path d="M 0 ${h * 0.94} Q ${w * 0.5} ${h * 0.7} ${w} ${h * 0.98}"/>
  </g>

  <g font-family="Georgia, 'Times New Roman', serif" font-weight="600" fill="${palette.fg}" text-anchor="middle">
    ${titleLines
      .map(
        (line, i) =>
          `<text x="${w / 2}" y="${
            h / 2 - ((titleLines.length - 1) * fontSize) / 2 + i * fontSize * 1.1
          }" font-size="${fontSize}">${escapeXml(line)}</text>`
      )
      .join("")}
  </g>

  <text x="${w / 2}" y="${
    h - Math.max(16, h / 24)
  }" font-family="ui-monospace, monospace" font-size="${Math.max(
    10,
    fontSize / 3
  )}" fill="${palette.fg}" fill-opacity="0.6" text-anchor="middle">BINGO · ${w}×${h}</text>
</svg>`;

  return new Response(svg, {
    headers: {
      "content-type": "image/svg+xml",
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}

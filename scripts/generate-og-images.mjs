// Generates branded 1200x630 Open Graph share images for every page.
// Run from repo root:  node scripts/generate-og-images.mjs
// Requires: sharp (already a transitive dep). Outputs to /public.

import sharp from "sharp";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, "..", "public");

const FONT = "Liberation Sans"; // clean grotesque, always present on Linux build

// Per-page content + a subtle accent glow colour so each card is distinct.
const cards = [
  {
    file: "og-image.png",
    kicker: "AN ECOSYSTEM OF APPS",
    name: "Arbor",
    tagline: ["Technology for people", "who want more from life."],
    accent: "#4ade80",
  },
  {
    file: "og-aevo.png",
    kicker: "PERFORMANCE",
    name: "Aevo",
    tagline: ["Training that", "understands you."],
    accent: "#f97316",
  },
  {
    file: "og-salus.png",
    kicker: "MENTAL WELLBEING",
    name: "Salus",
    tagline: ["Reflection and growth", "for everyday life."],
    accent: "#38bdf8",
  },
  {
    file: "og-thrive.png",
    kicker: "ORGANISATION",
    name: "Thrive",
    tagline: ["Build routines and", "stay ahead of life."],
    accent: "#a78bfa",
  },
  {
    file: "og-nura.png",
    kicker: "FINANCE",
    name: "Nura",
    tagline: ["Money built around", "real life."],
    accent: "#34d399",
  },
  {
    file: "og-wend.png",
    kicker: "EXPLORE",
    name: "Wend",
    tagline: ["Discover places", "and experiences."],
    accent: "#fbbf24",
  },
  {
    file: "og-kith.png",
    kicker: "CONNECTION",
    name: "Kith",
    tagline: ["Intentional social", "connection."],
    accent: "#fb7185",
  },
  {
    file: "og-telos.png",
    kicker: "PURPOSE",
    name: "Telos",
    tagline: ["Find work that fits", "who you are."],
    accent: "#818cf8",
  },
  {
    file: "og-sage.png",
    kicker: "LEARNING",
    name: "Sage",
    tagline: ["Build knowledge", "intentionally."],
    accent: "#22d3ee",
  },
];

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function svg({ kicker, name, tagline, accent }) {
  const taglineLines = tagline
    .map(
      (line, i) =>
        `<text x="90" y="${478 + i * 56}" font-family="${FONT}" font-size="38" fill="#a3a3a3">${esc(
          line
        )}</text>`
    )
    .join("");

  return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="glow" cx="78%" cy="22%" r="60%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.22"/>
      <stop offset="55%" stop-color="${accent}" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="1200" height="630" fill="#000000"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect x="24" y="24" width="1152" height="582" rx="28" fill="none" stroke="#262626" stroke-width="2"/>

  <!-- Brand wordmark -->
  <circle cx="98" cy="92" r="7" fill="${accent}"/>
  <text x="118" y="99" font-family="${FONT}" font-size="26" font-weight="bold" letter-spacing="6" fill="#ededed">ARBOR</text>

  <!-- Kicker -->
  <text x="90" y="288" font-family="${FONT}" font-size="24" font-weight="bold" letter-spacing="8" fill="${accent}">${esc(
    kicker
  )}</text>

  <!-- App name -->
  <text x="86" y="392" font-family="${FONT}" font-size="112" font-weight="bold" fill="#ffffff">${esc(
    name
  )}</text>

  <!-- Tagline -->
  ${taglineLines}

  <!-- Footer URL -->
  <text x="90" y="576" font-family="${FONT}" font-size="22" letter-spacing="2" fill="#525252">arborapps.co</text>
</svg>`;
}

fs.mkdirSync(PUBLIC, { recursive: true });

for (const card of cards) {
  const out = path.join(PUBLIC, card.file);
  await sharp(Buffer.from(svg(card)))
    .png()
    .toFile(out);
  console.log("wrote", card.file);
}

console.log("Done — " + cards.length + " OG images generated.");

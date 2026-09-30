// Generates branded 1200x630 Open Graph share images for every page.
// Run from repo root:  node scripts/generate-og-images.mjs
// Requires: sharp (already a transitive dep) and Poppins installed as a system
// font (the brand typeface). Outputs to /public.
//
// Layout follows the brand guide: the Arbor card sits on Warm Paper with the
// full-colour logo; app cards sit on Ink with the app's colour as a halo
// (6.1) and the Reverse wordmark bottom-left (6.10). Names, lines and colours
// mirror src/lib/brand.ts — keep them in step.

import sharp from "sharp";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, "..", "public");
const BRAND = path.join(PUBLIC, "brand");

const FONT = "Poppins";
const INK = "#0A0A0A";
const PAPER = "#F6F5F2";
const MOSS = "#8A8F7A";

const apps = [
  ["aevo", "Aevo", "Health", "coach", "#D4FF00", "Your coach for training, recovery and a body ready for anything."],
  ["salus", "Salus", "Mind", "companion", "#6FD6C9", "Understand your thoughts and handle the life you are living."],
  ["thrive", "Thrive", "Organisation", "assistant", "#DC143C", "Your time, habits and routines, shaped around who you want to be."],
  ["nura", "Nura", "Money", "money manager", "#FF6B5B", "See how your money is doing and make it work for the life you want."],
  ["wend", "Wend", "Experiences", "explorer", "#F4E7D0", "Make the most of your free time, from holidays to nights in."],
  ["kith", "Kith", "Relationships", "connector", "#EB729A", "Stay close to your people and meet new ones you will click with."],
  ["telos", "Telos", "Purpose", "mentor", "#F9F6EC", "Find purpose in your work and build a career that feels like yours."],
  ["sage", "Sage", "Growth", "tutor", "#DCE8DB", "Learn what you need to grow, from courses to new curiosities."],
];

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const dataUri = (file) =>
  `data:image/png;base64,${fs.readFileSync(path.join(BRAND, file)).toString("base64")}`;

/** Greedy word wrap by character count — good enough for short lines. */
function wrap(text, max) {
  const lines = [];
  let line = "";
  for (const word of text.split(" ")) {
    if ((line + " " + word).trim().length > max && line) {
      lines.push(line);
      line = word;
    } else {
      line = (line + " " + word).trim();
    }
  }
  if (line) lines.push(line);
  return lines;
}

function halo(cx, cy, r, colour) {
  return `
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="${colour}" fill-opacity="0.07" stroke="${colour}" stroke-opacity="0.28" stroke-width="2"/>
  <circle cx="${cx}" cy="${cy}" r="${r * 0.66}" fill="${colour}" fill-opacity="0.10" stroke="${colour}" stroke-opacity="0.45" stroke-width="2"/>`;
}

function arborCard() {
  return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="${PAPER}"/>
  ${halo(980, 315, 250, MOSS)}
  <image href="${dataUri("arbor_mark_full.png")}" x="900" y="256" width="160" height="118"/>
  <image href="${dataUri("arbor_logo_full.png")}" x="80" y="80" width="240" height="58"/>
  <text x="78" y="330" font-family="${FONT}" font-weight="600" font-size="64" letter-spacing="-0.64" fill="${INK}">Live more of the</text>
  <text x="78" y="404" font-family="${FONT}" font-weight="600" font-size="64" letter-spacing="-0.64" fill="${INK}">life you choose.</text>
  <text x="80" y="468" font-family="${FONT}" font-size="30" fill="#4D4D47">A guide for your whole life.</text>
  <text x="80" y="560" font-family="${FONT}" font-size="22" fill="#4D4D47">arborapps.co</text>
</svg>`;
}

function appCard([id, name, domain, title, colour, line]) {
  const lines = wrap(line, 38)
    .map(
      (l, i) =>
        `<text x="80" y="${400 + i * 46}" font-family="${FONT}" font-size="32" fill="#A1A1AA">${esc(l)}</text>`
    )
    .join("");

  return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="icon"><rect x="900" y="235" width="160" height="160" rx="36"/></clipPath>
  </defs>
  <rect width="1200" height="630" fill="${INK}"/>
  ${halo(980, 315, 250, colour)}
  <image href="${dataUri(`arbor_${id}_icon_full_512.png`)}" x="900" y="235" width="160" height="160" clip-path="url(#icon)"/>

  <text x="80" y="170" font-family="${FONT}" font-weight="500" font-size="26" fill="#A1A1AA">${esc(domain)} · Your ${esc(title)}</text>
  <text x="74" y="310" font-family="${FONT}" font-weight="600" font-size="120" letter-spacing="-1.2" fill="${PAPER}">${esc(name)}</text>
  ${lines}

  <image href="${dataUri("arbor_wordmark_reverse.png")}" x="80" y="536" width="120" height="29"/>
  <text x="1120" y="560" text-anchor="end" font-family="${FONT}" font-size="22" fill="#A1A1AA">arborapps.co/${id}</text>
</svg>`;
}

const cards = [
  { file: "og-image.png", svg: arborCard() },
  ...apps.map((a) => ({ file: `og-${a[0]}.png`, svg: appCard(a) })),
];

fs.mkdirSync(PUBLIC, { recursive: true });

for (const card of cards) {
  await sharp(Buffer.from(card.svg)).png().toFile(path.join(PUBLIC, card.file));
  console.log("wrote", card.file);
}

console.log("Done — " + cards.length + " OG images generated.");

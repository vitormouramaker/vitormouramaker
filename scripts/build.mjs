// Gera os SVGs do perfil (assets/) e o README.md. Sem dependências:
//   node scripts/build.mjs
// Cada imagem sai em duas versões (clara e escura) e o README escolhe pelo
// tema do GitHub com <picture>.
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PROFILE, PROJECTS } from "./data.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "assets");
rmSync(OUT, { recursive: true, force: true });
mkdirSync(join(OUT, "projects"), { recursive: true });

const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif";

// Paleta neutra, alinhada às cores do próprio GitHub.
const THEMES = {
  light: { bg: "#ffffff", border: "#d1d9e0", text: "#1f2328", muted: "#59636e", subtle: "#f6f8fa", accent: "#1f2328" },
  dark: { bg: "#0d1117", border: "#3d444d", text: "#f0f6fc", muted: "#9198a1", subtle: "#151b23", accent: "#f0f6fc" },
};

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function writeThemed(name, render) {
  for (const [theme, c] of Object.entries(THEMES)) {
    const file = `${name}-${theme}.svg`;
    writeFileSync(join(OUT, file), render(c));
  }
  console.log(`assets/${name}-{light,dark}.svg`);
}

/** Quebra o texto em linhas de até `max` caracteres. */
function wrap(text, max) {
  const lines = [];
  let line = "";
  for (const word of text.split(" ")) {
    if ((line + " " + word).trim().length > max) {
      lines.push(line.trim());
      line = word;
    } else line += " " + word;
  }
  if (line.trim()) lines.push(line.trim());
  return lines;
}

// Única animação: entrada suave, uma vez, e nada para quem pede menos movimento.
const FADE = `
    .in { opacity: 0; animation: in 0.7s ease-out forwards; }
    @keyframes in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
    .rule { stroke-dasharray: 1200; stroke-dashoffset: 1200; animation: draw 1.2s ease-out 0.2s forwards; }
    @keyframes draw { to { stroke-dashoffset: 0; } }
    @media (prefers-reduced-motion: reduce) { .in, .rule { animation: none; opacity: 1; stroke-dashoffset: 0; } }`;

// ---------------------------------------------------------------------------
// Cabeçalho: nome, cargo, proposta de valor e três números.
// ---------------------------------------------------------------------------

function header(c) {
  const W = 1200;
  const H = 300;
  const colW = (W - 112) / PROFILE.highlights.length;
  const highlights = PROFILE.highlights
    .map((h, i) => {
      const x = 56 + i * colW;
      return `<g class="in" style="animation-delay:${0.35 + i * 0.1}s">
      ${i > 0 ? `<line x1="${x - 24}" y1="214" x2="${x - 24}" y2="262" stroke="${c.border}"/>` : ""}
      <text x="${x}" y="236" class="hv">${esc(h.value)}</text>
      <text x="${x}" y="260" class="hl">${esc(h.label)}</text>
    </g>`;
    })
    .join("\n    ");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(PROFILE.name)}, ${esc(PROFILE.role)}">
  <title>${esc(PROFILE.name)}, ${esc(PROFILE.role)}</title>
  <style>${FADE}
    .name { font: 700 50px ${SANS}; fill: ${c.text}; letter-spacing: -1px; }
    .role { font: 500 22px ${SANS}; fill: ${c.text}; }
    .pitch { font: 400 18px ${SANS}; fill: ${c.muted}; }
    .hv { font: 700 24px ${SANS}; fill: ${c.text}; }
    .hl { font: 400 15px ${SANS}; fill: ${c.muted}; }
    .mono { font: 600 30px ${SANS}; fill: ${c.text}; letter-spacing: 1px; }
  </style>
  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="12" fill="${c.bg}" stroke="${c.border}"/>
  <g class="in"><text x="56" y="92" class="name">${esc(PROFILE.name)}</text></g>
  <g class="in" style="animation-delay:0.1s"><text x="56" y="128" class="role">${esc(PROFILE.role)}</text></g>
  <g class="in" style="animation-delay:0.2s"><text x="56" y="160" class="pitch">${esc(PROFILE.pitch)}</text></g>
  <line x1="56" y1="188" x2="${W - 56}" y2="188" stroke="${c.border}" class="rule"/>
  <g class="in">
    <rect x="${W - 136}" y="48" width="80" height="80" rx="10" fill="${c.subtle}" stroke="${c.border}"/>
    <text x="${W - 96}" y="99" class="mono" text-anchor="middle">${esc(PROFILE.initials)}</text>
  </g>
  ${highlights}
</svg>
`;
}

// ---------------------------------------------------------------------------
// Card de projeto
// ---------------------------------------------------------------------------

function projectCard(p) {
  return (c) => {
    const W = 600;
    const H = 230;
    const lines = wrap(p.description, 66).slice(0, 3);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(p.title)}: ${esc(p.description)}">
  <title>${esc(p.title)}: ${esc(p.description)}</title>
  <style>${FADE}
    .cat { font: 600 13px ${SANS}; fill: ${c.muted}; letter-spacing: 1.2px; }
    .title { font: 700 26px ${SANS}; fill: ${c.text}; }
    .desc { font: 400 16px ${SANS}; fill: ${c.text}; }
    .stack { font: 400 14px ${SANS}; fill: ${c.muted}; }
    .repo { font: 400 13px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; fill: ${c.muted}; }
  </style>
  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="12" fill="${c.bg}" stroke="${c.border}"/>
  <g class="in">
    <text x="28" y="42" class="cat">${esc(p.category.toUpperCase())}</text>
    <text x="28" y="80" class="title">${esc(p.title)}</text>
    ${lines.map((l, k) => `<text x="28" y="${114 + k * 23}" class="desc">${esc(l)}</text>`).join("\n    ")}
  </g>
  <line x1="28" y1="182" x2="${W - 28}" y2="182" stroke="${c.border}"/>
  <g class="in" style="animation-delay:0.15s">
    <text x="28" y="208" class="stack">${esc(p.stack.join("  ·  "))}</text>
    <text x="${W - 28}" y="42" class="repo" text-anchor="end">${esc(p.slug)}</text>
  </g>
</svg>
`;
  };
}

// ---------------------------------------------------------------------------

writeThemed("header", header);
PROJECTS.forEach((p) => writeThemed(`projects/${p.slug}`, projectCard(p)));

// ---------------------------------------------------------------------------
// README
// ---------------------------------------------------------------------------

const GH = `https://github.com/${PROFILE.github}`;
const picture = (name, alt, width) =>
  `<picture><source media="(prefers-color-scheme: dark)" srcset="assets/${name}-dark.svg"><img src="assets/${name}-light.svg" width="${width}" alt="${esc(alt)}"></picture>`;
const card = (p) => `<a href="${GH}/${p.slug}">${picture(`projects/${p.slug}`, `${p.title}: ${p.description}`, "49%")}</a>`;

const rows = [];
for (let i = 0; i < PROJECTS.length; i += 2) rows.push(PROJECTS.slice(i, i + 2).map(card).join("\n  "));

const readme = `<!-- Gerado por scripts/build.mjs a partir de scripts/data.mjs. -->
<p align="center">
  ${picture("header", `${PROFILE.name}, ${PROFILE.role}`, "100%")}
</p>

## Resumo

${PROFILE.summary.join("\n\n")}

## O que eu entrego

${PROFILE.delivers.map((d) => `- ${d}`).join("\n")}

## Competências

| Área | Tecnologias |
|---|---|
${PROFILE.skills.map(([area, list]) => `| **${area}** | ${list} |`).join("\n")}

## Projetos selecionados

${PROFILE.projectsNote}

<p align="center">
  ${rows.join("\n</p>\n<p align=\"center\">\n  ")}
</p>

## Contato

${PROFILE.contacts.map((c) => `[${c.label}](${c.href})`).join(" &nbsp;·&nbsp; ")}
`;
writeFileSync(join(ROOT, "README.md"), readme);
console.log("README.md");

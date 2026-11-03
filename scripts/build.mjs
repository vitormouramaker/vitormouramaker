// Gera os SVGs animados do perfil (assets/). Sem dependências: node scripts/build.mjs
// Tudo é SVG puro com CSS/SMIL: o GitHub exibe as imagens sem JavaScript.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PROFILE, PROJECTS, STACK } from "./data.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "assets");
mkdirSync(join(OUT, "projects"), { recursive: true });

const SANS = "'Segoe UI', 'Inter', 'Helvetica Neue', Ubuntu, Arial, sans-serif";
const MONO = "'JetBrains Mono', 'Fira Code', Consolas, 'Courier New', monospace";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const write = (name, svg) => {
  writeFileSync(join(OUT, name), svg.replace(/\n\s*\n/g, "\n"));
  console.log("assets/" + name);
};

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

// ---------------------------------------------------------------------------
// Banner
// ---------------------------------------------------------------------------

function typingLines(phrases, { x, y, size, cycle }) {
  const charW = size * 0.61;
  const slot = cycle / phrases.length;
  return phrases
    .map((phrase, i) => {
      const start = i * slot;
      const typeEnd = start + slot * 0.45;
      const holdEnd = start + slot * 0.85;
      const end = start + slot;
      const n = phrase.length;
      // Larguras e tempos de cada tecla (digitar), pausa, apagar.
      const times = [0];
      const widths = [0];
      const push = (t, w) => {
        times.push(t / cycle);
        widths.push(w);
      };
      push(start, 0);
      for (let k = 1; k <= n; k++) push(start + ((typeEnd - start) * k) / n, k * charW + 2);
      push(holdEnd, n * charW + 2);
      const erase = Math.max(4, Math.ceil(n / 3));
      for (let k = erase - 1; k >= 0; k--) push(holdEnd + ((end - 0.05 - holdEnd) * (erase - k)) / erase, (n * charW * k) / erase);
      push(cycle, 0);
      const keyTimes = times.map((t) => Math.min(1, t).toFixed(4)).join(";");
      const widthValues = widths.map((w) => w.toFixed(1)).join(";");
      const caretValues = widths.map((w) => (x + w + 2).toFixed(1)).join(";");
      const opacity = times.map((t) => (t * cycle >= start && t * cycle < end ? 1 : 0)).join(";");
      return `
    <clipPath id="type${i}"><rect x="${x}" y="${y - size}" height="${size * 1.4}" width="0">
      <animate attributeName="width" dur="${cycle}s" repeatCount="indefinite" calcMode="discrete" keyTimes="${keyTimes}" values="${widthValues}"/>
    </rect></clipPath>
    <g opacity="0">
      <animate attributeName="opacity" dur="${cycle}s" repeatCount="indefinite" calcMode="discrete" keyTimes="${keyTimes}" values="${opacity}"/>
      <text x="${x}" y="${y}" class="typing" clip-path="url(#type${i})">${esc(phrase)}</text>
      <rect y="${y - size * 0.85}" width="3" height="${size * 1.05}" rx="1.5" class="caret">
        <animate attributeName="x" dur="${cycle}s" repeatCount="indefinite" calcMode="discrete" keyTimes="${keyTimes}" values="${caretValues}"/>
      </rect>
    </g>`;
    })
    .join("");
}

function codeWindow({ x, y, w }) {
  // Cada linha: lista de [classe, texto]. Recuo em espaços.
  const lines = [
    [["k", "export function "], ["f", "Portfolio"], ["p", "() {"]],
    [["p", "  "], ["k", "const "], ["v", "skills"], ["p", " = "], ["f", "useFrontEnd"], ["p", "();"]],
    [["p", "  "], ["k", "return "], ["p", "("]],
    [["p", "    <"], ["t", "Experience"]],
    [["p", "      "], ["a", "stack"], ["p", "={"], ["s", "\"React · TS · Next\""], ["p", "}"]],
    [["p", "      "], ["a", "design"], ["p", "={"], ["s", "\"pixel-perfect\""], ["p", "}"]],
    [["p", "      "], ["a", "animate"]],
    [["p", "    />"]],
    [["p", "  );"]],
    [["p", "}"]],
  ];
  const lineH = 25;
  const h = 70 + lines.length * lineH;
  const cycle = 14;
  const keyframes = lines
    .map((_, i) => {
      const a = (5 + i * 5).toFixed(1);
      const b = (8 + i * 5).toFixed(1);
      return `@keyframes l${i} { 0%, ${a}% { opacity: 0; transform: translateX(-10px); } ${b}%, 88% { opacity: 1; transform: translateX(0); } 96%, 100% { opacity: 0; transform: translateX(0); } }
      .l${i} { animation: l${i} ${cycle}s ease-out infinite; }`;
    })
    .join("\n      ");
  const body = lines
    .map((tokens, i) => {
      const spans = tokens.map(([cls, text]) => `<tspan class="${cls}">${esc(text).replace(/ /g, "&#160;")}</tspan>`).join("");
      return `<text x="${x + 44}" y="${y + 62 + i * lineH}" class="code l${i}"><tspan class="ln">${String(i + 1).padStart(2, " ")}</tspan>${"&#160;".repeat(2)}${spans}</text>`;
    })
    .join("\n    ");
  return {
    css: keyframes,
    svg: `
  <g class="window">
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="#0b1224" fill-opacity="0.82" stroke="url(#border)" stroke-width="1.5"/>
    <rect x="${x}" y="${y}" width="${w}" height="38" rx="16" fill="#111a33"/>
    <rect x="${x}" y="${y + 22}" width="${w}" height="16" fill="#111a33"/>
    <circle cx="${x + 22}" cy="${y + 19}" r="6" fill="#ff5f57"/>
    <circle cx="${x + 42}" cy="${y + 19}" r="6" fill="#febc2e"/>
    <circle cx="${x + 62}" cy="${y + 19}" r="6" fill="#28c840"/>
    <text x="${x + w / 2}" y="${y + 24}" class="tab" text-anchor="middle">Portfolio.tsx</text>
    ${body}
  </g>`,
  };
}

function hero() {
  const W = 1200;
  const H = 420;
  const code = codeWindow({ x: 700, y: 62, w: 440 });
  const typing = typingLines(PROFILE.roles, { x: 72, y: 268, size: 24, cycle: 16 });
  const dots = Array.from({ length: 26 }, (_, i) => {
    const cx = (i * 97) % W;
    const cy = 30 + ((i * 53) % (H - 60));
    const r = 1 + (i % 3) * 0.6;
    const dur = 4 + (i % 5);
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#c7d2fe"><animate attributeName="opacity" values="0.1;0.8;0.1" dur="${dur}s" begin="${(i % 7) * 0.6}s" repeatCount="indefinite"/></circle>`;
  }).join("\n    ");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(PROFILE.name)}: ${esc(PROFILE.headline)}">
  <title>${esc(PROFILE.name)}: ${esc(PROFILE.headline)}</title>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#070b1a"/><stop offset="0.55" stop-color="#0d1330"/><stop offset="1" stop-color="#150b2e"/>
    </linearGradient>
    <linearGradient id="name" gradientUnits="userSpaceOnUse" x1="72" y1="0" x2="640" y2="0">
      <stop offset="0" stop-color="#60a5fa"><animate attributeName="stop-color" values="#60a5fa;#a78bfa;#f472b6;#60a5fa" dur="8s" repeatCount="indefinite"/></stop>
      <stop offset="0.5" stop-color="#a78bfa"><animate attributeName="stop-color" values="#a78bfa;#f472b6;#22d3ee;#a78bfa" dur="8s" repeatCount="indefinite"/></stop>
      <stop offset="1" stop-color="#22d3ee"><animate attributeName="stop-color" values="#22d3ee;#60a5fa;#a78bfa;#22d3ee" dur="8s" repeatCount="indefinite"/></stop>
    </linearGradient>
    <linearGradient id="border" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#60a5fa" stop-opacity="0.8"/><stop offset="0.5" stop-color="#a78bfa" stop-opacity="0.15"/><stop offset="1" stop-color="#22d3ee" stop-opacity="0.8"/>
      <animateTransform attributeName="gradientTransform" type="rotate" values="0 .5 .5;360 .5 .5" dur="10s" repeatCount="indefinite"/>
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M40 0H0V40" fill="none" stroke="#ffffff" stroke-opacity="0.035"/>
    </pattern>
    <filter id="blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="60"/></filter>
    <clipPath id="frame"><rect width="${W}" height="${H}" rx="24"/></clipPath>
  </defs>
  <style>
    .blob { animation: drift 18s ease-in-out infinite alternate; transform-box: fill-box; transform-origin: center; }
    .b2 { animation-duration: 22s; animation-delay: -6s; }
    .b3 { animation-duration: 26s; animation-delay: -12s; }
    @keyframes drift { 0% { transform: translate(0, 0) scale(1); } 50% { transform: translate(60px, -30px) scale(1.15); } 100% { transform: translate(-40px, 40px) scale(0.95); } }
    .hello { font: 600 20px ${SANS}; fill: #93c5fd; letter-spacing: 1px; animation: rise 1s ease-out both; }
    .name { font: 800 68px ${SANS}; fill: url(#name); letter-spacing: -1.5px; animation: rise 1s ease-out 0.15s both; }
    .headline { font: 500 21px ${SANS}; fill: #cbd5e1; animation: rise 1s ease-out 0.3s both; }
    .typing { font: 600 24px ${MONO}; fill: #e2e8f0; }
    .caret { fill: #22d3ee; animation: blink 1s steps(1) infinite; }
    .prompt { font: 600 24px ${MONO}; fill: #a78bfa; }
    .meta { font: 500 16px ${SANS}; fill: #94a3b8; animation: rise 1s ease-out 0.45s both; }
    .wave { animation: wave 2.4s ease-in-out infinite; transform-box: fill-box; transform-origin: 70% 80%; }
    @keyframes wave { 0%, 60%, 100% { transform: rotate(0); } 10%, 30% { transform: rotate(14deg); } 20%, 40% { transform: rotate(-8deg); } }
    @keyframes blink { 50% { opacity: 0; } }
    @keyframes rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
    .window { animation: float 6s ease-in-out infinite; }
    @keyframes float { 50% { transform: translateY(-8px); } }
    .code { font: 500 15px ${MONO}; fill: #cbd5e1; }
    .tab { font: 500 13px ${MONO}; fill: #94a3b8; }
    .ln { fill: #475569; } .k { fill: #c084fc; } .f { fill: #60a5fa; } .v { fill: #f9a8d4; }
    .p { fill: #cbd5e1; } .t { fill: #34d399; } .a { fill: #fbbf24; } .s { fill: #a5f3fc; }
    ${code.css}
    @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
  </style>
  <g clip-path="url(#frame)">
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <g filter="url(#blur)" opacity="0.55">
      <circle class="blob" cx="220" cy="120" r="150" fill="#3b82f6"/>
      <circle class="blob b2" cx="900" cy="330" r="170" fill="#8b5cf6"/>
      <circle class="blob b3" cx="560" cy="60" r="120" fill="#06b6d4"/>
    </g>
    <rect width="${W}" height="${H}" fill="url(#grid)"/>
    ${dots}
  </g>
  <text x="72" y="118" class="hello">OLÁ, EU SOU</text>
  <text x="226" y="120" class="wave" font-size="24">👋</text>
  <text x="68" y="190" class="name">${esc(PROFILE.name)}</text>
  <text x="72" y="226" class="headline">${esc(PROFILE.headline)}</text>
  ${typing}
  <text x="72" y="340" class="meta">${esc(PROFILE.meta)}</text>
  ${code.svg}
  <rect x="0.75" y="0.75" width="${W - 1.5}" height="${H - 1.5}" rx="24" fill="none" stroke="url(#border)" stroke-width="1.5"/>
</svg>
`;
}

// ---------------------------------------------------------------------------
// Títulos de seção
// ---------------------------------------------------------------------------

function sectionTitle(label, file) {
  const W = 1200;
  const H = 64;
  write(
    file,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(label)}">
  <title>${esc(label)}</title>
  <defs>
    <linearGradient id="g" x1="0" x2="1">
      <stop offset="0" stop-color="#60a5fa"/><stop offset="0.5" stop-color="#a78bfa"/><stop offset="1" stop-color="#22d3ee"/>
    </linearGradient>
    <linearGradient id="fade" x1="0" x2="1"><stop offset="0" stop-color="#a78bfa" stop-opacity="0.9"/><stop offset="1" stop-color="#a78bfa" stop-opacity="0"/></linearGradient>
  </defs>
  <style>
    .t { font: 800 30px ${SANS}; fill: url(#g); letter-spacing: -0.5px; animation: in 0.9s ease-out both; }
    .line { stroke-dasharray: 900; stroke-dashoffset: 900; animation: draw 1.6s ease-out 0.3s forwards; }
    .spark { animation: run 4s linear infinite; }
    @keyframes in { from { opacity: 0; transform: translateX(-12px); } to { opacity: 1; transform: none; } }
    @keyframes draw { to { stroke-dashoffset: 0; } }
    @keyframes run { from { transform: translateX(0); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } to { transform: translateX(860px); opacity: 0; } }
    @media (prefers-reduced-motion: reduce) { * { animation: none !important; stroke-dashoffset: 0 !important; } }
  </style>
  <text x="4" y="36" class="t">${esc(label)}</text>
  <path d="M4 54H900" stroke="url(#fade)" stroke-width="2" class="line"/>
  <circle cx="4" cy="54" r="3.5" fill="#22d3ee" class="spark"/>
</svg>
`,
  );
}

// ---------------------------------------------------------------------------
// Stack
// ---------------------------------------------------------------------------

function stack() {
  const W = 1200;
  const padX = 40;
  const pillH = 40;
  const gap = 12;
  let y = 40;
  let delay = 0;
  const groups = [];
  for (const group of STACK) {
    let x = padX + 200;
    const rows = [];
    let row = [];
    for (const item of group.items) {
      const w = 46 + item.name.length * 9.2;
      if (x + w > W - padX) {
        rows.push(row);
        row = [];
        x = padX + 200;
      }
      row.push({ ...item, x, w });
      x += w + gap;
    }
    rows.push(row);
    const pills = rows
      .map((r, ri) =>
        r
          .map((p) => {
            delay += 0.06;
            const py = y + ri * (pillH + gap);
            return `<g class="pill" style="animation-delay:${delay.toFixed(2)}s">
      <rect x="${p.x}" y="${py}" width="${p.w}" height="${pillH}" rx="20" fill="${p.color}" fill-opacity="0.12" stroke="${p.color}" stroke-opacity="0.55"/>
      <circle cx="${p.x + 20}" cy="${py + pillH / 2}" r="5" fill="${p.color}"><animate attributeName="r" values="4;6;4" dur="${2.4 + (delay % 1.5)}s" repeatCount="indefinite"/></circle>
      <text x="${p.x + 34}" y="${py + 26}" class="pt">${esc(p.name)}</text>
    </g>`;
          })
          .join("\n    "),
      )
      .join("\n    ");
    groups.push(`<g class="grp" style="animation-delay:${(delay - group.items.length * 0.06).toFixed(2)}s">
      <text x="${padX}" y="${y + 18}" class="gt">${esc(group.title)}</text>
      <text x="${padX}" y="${y + 38}" class="gs">${esc(group.subtitle)}</text>
    </g>
    ${pills}`);
    y += rows.length * (pillH + gap) + 26;
  }
  const H = y + 14;
  write(
    "stack.svg",
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Tecnologias: ${esc(STACK.flatMap((g) => g.items.map((i) => i.name)).join(", "))}">
  <title>Tecnologias</title>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0a0f1f"/><stop offset="1" stop-color="#11122b"/></linearGradient>
    <linearGradient id="edge" x1="0" x2="1"><stop offset="0" stop-color="#60a5fa" stop-opacity="0.6"/><stop offset="1" stop-color="#a78bfa" stop-opacity="0.2"/></linearGradient>
  </defs>
  <style>
    .pill, .grp { opacity: 0; animation: pop 0.6s cubic-bezier(.2,.8,.2,1.2) forwards; transform-box: fill-box; transform-origin: center; }
    @keyframes pop { from { opacity: 0; transform: translateY(12px) scale(0.92); } to { opacity: 1; transform: none; } }
    .pt { font: 600 15px ${SANS}; fill: #e2e8f0; }
    .gt { font: 800 17px ${SANS}; fill: #f8fafc; }
    .gs { font: 500 13px ${SANS}; fill: #94a3b8; }
    @media (prefers-reduced-motion: reduce) { .pill, .grp { animation: none; opacity: 1; } }
  </style>
  <rect x="0.75" y="0.75" width="${W - 1.5}" height="${H - 1.5}" rx="22" fill="url(#bg)" stroke="url(#edge)" stroke-width="1.5"/>
  ${groups.join("\n  ")}
</svg>
`,
  );
}

// ---------------------------------------------------------------------------
// Cards de projeto
// ---------------------------------------------------------------------------

function projectCard(p, i) {
  const W = 600;
  const H = 300;
  const lines = wrap(p.description, 62).slice(0, 3);
  let x = 32;
  let rowY = 226;
  const chips = [];
  for (const tag of p.tags) {
    const w = 22 + tag.length * 7.6;
    if (x + w > W - 32) break;
    chips.push(`<g><rect x="${x}" y="${rowY}" width="${w}" height="28" rx="14" fill="${p.accent}" fill-opacity="0.14" stroke="${p.accent}" stroke-opacity="0.5"/><text x="${x + w / 2}" y="${rowY + 19}" class="chip" text-anchor="middle">${esc(tag)}</text></g>`);
    x += w + 8;
  }
  const id = `c${i}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(p.title)}: ${esc(p.description)}">
  <title>${esc(p.title)}: ${esc(p.description)}</title>
  <defs>
    <linearGradient id="${id}bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b1022"/><stop offset="1" stop-color="#121633"/></linearGradient>
    <linearGradient id="${id}b" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${p.accent}"/><stop offset="0.45" stop-color="${p.accent}" stop-opacity="0.05"/><stop offset="0.55" stop-color="#a78bfa" stop-opacity="0.05"/><stop offset="1" stop-color="#a78bfa"/>
      <animateTransform attributeName="gradientTransform" type="rotate" values="0 .5 .5;360 .5 .5" dur="${7 + (i % 4)}s" repeatCount="indefinite"/>
    </linearGradient>
    <radialGradient id="${id}glow" cx="0.85" cy="0.1" r="0.6"><stop offset="0" stop-color="${p.accent}" stop-opacity="0.35"/><stop offset="1" stop-color="${p.accent}" stop-opacity="0"/></radialGradient>
    <clipPath id="${id}clip"><rect width="${W}" height="${H}" rx="20"/></clipPath>
  </defs>
  <style>
    .in { opacity: 0; animation: in 0.8s ease-out forwards; }
    .d1 { animation-delay: 0.1s; } .d2 { animation-delay: 0.25s; } .d3 { animation-delay: 0.4s; }
    @keyframes in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
    .glow { animation: breathe 5s ease-in-out infinite; }
    @keyframes breathe { 50% { opacity: 0.45; } }
    .kicker { font: 700 12px ${SANS}; fill: ${p.accent}; letter-spacing: 2px; }
    .title { font: 800 30px ${SANS}; fill: #f8fafc; letter-spacing: -0.5px; }
    .desc { font: 400 16px ${SANS}; fill: #cbd5e1; }
    .chip { font: 600 12.5px ${SANS}; fill: #e2e8f0; }
    .repo { font: 500 13px ${MONO}; fill: #94a3b8; }
    .arrow { animation: nudge 1.8s ease-in-out infinite; }
    @keyframes nudge { 50% { transform: translateX(5px); } }
    @media (prefers-reduced-motion: reduce) { * { animation: none !important; opacity: 1 !important; } }
  </style>
  <g clip-path="url(#${id}clip)">
    <rect width="${W}" height="${H}" fill="url(#${id}bg)"/>
    <rect width="${W}" height="${H}" fill="url(#${id}glow)" class="glow"/>
  </g>
  <rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="19" fill="none" stroke="url(#${id}b)" stroke-width="2"/>
  <g class="in"><text x="32" y="46" class="kicker">${esc(p.kicker.toUpperCase())}</text></g>
  <g class="in d1"><text x="32" y="86" class="title">${esc(p.title)}</text></g>
  <g class="in d2">${lines.map((l, k) => `<text x="32" y="${124 + k * 24}" class="desc">${esc(l)}</text>`).join("")}</g>
  <g class="in d3">${chips.join("")}</g>
  <text x="${W - 32}" y="46" class="repo" text-anchor="end">${esc(p.slug)} <tspan class="arrow">→</tspan></text>
</svg>
`;
}

// ---------------------------------------------------------------------------
// Rodapé
// ---------------------------------------------------------------------------

function footer() {
  const W = 1200;
  const H = 150;
  const wave = (amp, off) => {
    let d = `M0 ${70 + off}`;
    for (let x = 0; x <= W * 2; x += 150) d += ` Q${x + 75} ${70 + off - amp} ${x + 150} ${70 + off} T${x + 300} ${70 + off}`;
    return d + ` V${H} H0 Z`;
  };
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(PROFILE.footer)}">
  <title>${esc(PROFILE.footer)}</title>
  <defs>
    <linearGradient id="w1" x1="0" x2="1"><stop offset="0" stop-color="#3b82f6"/><stop offset="1" stop-color="#8b5cf6"/></linearGradient>
    <linearGradient id="w2" x1="0" x2="1"><stop offset="0" stop-color="#06b6d4"/><stop offset="1" stop-color="#6366f1"/></linearGradient>
    <clipPath id="clip"><rect width="${W}" height="${H}" rx="24"/></clipPath>
  </defs>
  <style>
    .a { animation: slide 9s linear infinite; } .b { animation: slide 13s linear infinite reverse; }
    @keyframes slide { to { transform: translateX(-300px); } }
    .msg { font: 700 22px ${SANS}; fill: #ffffff; }
    @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
  </style>
  <g clip-path="url(#clip)">
    <path d="${wave(26, 10)}" fill="url(#w2)" opacity="0.55" class="b"/>
    <path d="${wave(20, 22)}" fill="url(#w1)" opacity="0.9" class="a"/>
  </g>
  <text x="${W / 2}" y="128" class="msg" text-anchor="middle">${esc(PROFILE.footer)}</text>
</svg>
`;
}

// ---------------------------------------------------------------------------

write("hero.svg", hero());
sectionTitle("Sobre mim", "title-about.svg");
sectionTitle("Tecnologias", "title-stack.svg");
sectionTitle("Projetos em destaque", "title-projects.svg");
sectionTitle("Como eu trabalho no front-end", "title-frontend.svg");
stack();
PROJECTS.forEach((p, i) => write(`projects/${p.slug}.svg`, projectCard(p, i)));
write("footer.svg", footer());
sectionTitle("Vamos conversar", "title-contact.svg");
PROFILE.contacts.forEach((c, i) => write(`contact-${c.id}.svg`, contactButton(c, i)));

/** Botão de contato: ícone pulsando, brilho percorrendo a borda. */
function contactButton(c, i) {
  const W = 440;
  const H = 96;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(c.label)}: ${esc(c.value)}">
  <title>${esc(c.label)}: ${esc(c.value)}</title>
  <defs>
    <linearGradient id="bg${i}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b1022"/><stop offset="1" stop-color="#141a3a"/></linearGradient>
    <linearGradient id="edge${i}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c.color}"/><stop offset="0.5" stop-color="${c.color}" stop-opacity="0.05"/><stop offset="1" stop-color="#a78bfa"/>
      <animateTransform attributeName="gradientTransform" type="rotate" values="0 .5 .5;360 .5 .5" dur="${6 + i * 2}s" repeatCount="indefinite"/>
    </linearGradient>
    <linearGradient id="shine${i}" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.5" stop-color="#fff" stop-opacity="0.12"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <clipPath id="clip${i}"><rect width="${W}" height="${H}" rx="20"/></clipPath>
  </defs>
  <style>
    .ring { animation: ring 2.4s ease-out infinite; transform-box: fill-box; transform-origin: center; }
    @keyframes ring { from { transform: scale(1); opacity: 0.7; } to { transform: scale(1.7); opacity: 0; } }
    .shine { animation: shine 4.5s ease-in-out ${i * 1.2}s infinite; }
    @keyframes shine { 0% { transform: translateX(-200px); } 60%, 100% { transform: translateX(${W + 100}px); } }
    .ico { font: 800 22px ${SANS}; fill: #fff; }
    .lbl { font: 700 13px ${SANS}; fill: ${c.color === "#0a66c2" ? "#60a5fa" : "#f87171"}; letter-spacing: 2px; }
    .val { font: 600 18px ${SANS}; fill: #f1f5f9; }
    .go { font: 700 20px ${SANS}; fill: #94a3b8; animation: nudge 1.8s ease-in-out infinite; }
    @keyframes nudge { 50% { transform: translateX(5px); } }
    @media (prefers-reduced-motion: reduce) { * { animation: none !important; } .shine { display: none; } }
  </style>
  <g clip-path="url(#clip${i})">
    <rect width="${W}" height="${H}" fill="url(#bg${i})"/>
    <rect width="140" height="${H}" fill="url(#shine${i})" class="shine"/>
  </g>
  <rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="19" fill="none" stroke="url(#edge${i})" stroke-width="2"/>
  <circle cx="54" cy="${H / 2}" r="24" fill="none" stroke="${c.color}" stroke-width="2" class="ring"/>
  <circle cx="54" cy="${H / 2}" r="24" fill="${c.color}"/>
  <text x="54" y="${H / 2 + 8}" class="ico" text-anchor="middle">${esc(c.icon)}</text>
  <text x="96" y="40" class="lbl">${esc(c.label.toUpperCase())}</text>
  <text x="96" y="66" class="val">${esc(c.value)}</text>
  <text x="${W - 30}" y="${H / 2 + 7}" class="go" text-anchor="end">→</text>
</svg>
`;
}

// ---------------------------------------------------------------------------
// README do perfil
// ---------------------------------------------------------------------------

const GH = `https://github.com/${PROFILE.github}`;
const card = (p) =>
  `<a href="${GH}/${p.slug}"><img src="assets/projects/${p.slug}.svg" width="49%" alt="${esc(p.title)}: ${esc(p.description)}"/></a>`;
const pairs = [];
for (let i = 0; i < PROJECTS.length; i += 2) pairs.push(PROJECTS.slice(i, i + 2).map(card).join("\n  "));

const readme = `<!-- Gerado por scripts/build.mjs: edite scripts/data.mjs e rode o script. -->
<p align="center">
  <img src="assets/hero.svg" width="100%" alt="${esc(PROFILE.name)}: ${esc(PROFILE.headline)}"/>
</p>

<img src="assets/title-about.svg" width="100%" alt="Sobre mim"/>

${PROFILE.about.map((l) => l).join("\n\n")}

<img src="assets/title-frontend.svg" width="100%" alt="Como eu trabalho no front-end"/>

${PROFILE.frontend.map((l) => `- ${l}`).join("\n")}

<img src="assets/title-stack.svg" width="100%" alt="Tecnologias"/>

<p align="center">
  <img src="assets/stack.svg" width="100%" alt="${esc(STACK.flatMap((g) => g.items.map((i) => i.name)).join(", "))}"/>
</p>

<img src="assets/title-projects.svg" width="100%" alt="Projetos em destaque"/>

${PROFILE.projectsNote}

<p align="center">
  ${pairs.join("\n</p>\n<p align=\"center\">\n  ")}
</p>

${PROFILE.extras.join("\n\n")}

<img src="assets/title-contact.svg" width="100%" alt="Vamos conversar"/>

<p align="center">
  ${PROFILE.contacts.map((c) => `<a href="${c.href}"><img src="assets/contact-${c.id}.svg" width="49%" alt="${esc(c.label)}: ${esc(c.value)}"/></a>`).join("\n  ")}
</p>

<p align="center">
  <img src="assets/footer.svg" width="100%" alt="${esc(PROFILE.footer)}"/>
</p>

<p align="center"><sub>Banner, cards e animações em SVG puro, gerados por <a href="scripts/build.mjs">um script próprio</a>, sem serviços externos. Respeitam <code>prefers-reduced-motion</code>.</sub></p>
`;
writeFileSync(join(ROOT, "README.md"), readme);
console.log("README.md");

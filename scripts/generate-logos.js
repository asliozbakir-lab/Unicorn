import fs from "fs";
import path from "path";

const citiesDir = path.resolve("public/logos/cities");
const unionsDir = path.resolve("public/logos/unions");

const cityLogos = {
  "susa": `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <defs>
    <linearGradient id="susa-bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0092bc"/>
      <stop offset="50%" stop-color="#e4002b"/>
      <stop offset="100%" stop-color="#009a44"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.3"/>
    </filter>
  </defs>
  <circle cx="60" cy="60" r="54" fill="#ffffff" stroke="#0092bc" stroke-width="3"/>
  <circle cx="60" cy="60" r="48" fill="url(#susa-bg)" opacity="0.12"/>
  <!-- Castle Fortress -->
  <path d="M35 75 L35 55 L42 55 L42 60 L48 60 L48 55 L55 55 L55 60 L65 60 L65 55 L72 55 L72 60 L78 60 L78 55 L85 55 L85 75 Z" fill="#176C55" filter="url(#shadow)"/>
  <!-- Arch Gate -->
  <path d="M52 75 A8 8 0 0 1 68 75 Z" fill="#ffffff"/>
  <!-- Kharibulbul Flower -->
  <path d="M60 30 C55 38 45 42 52 50 C58 45 62 45 68 50 C75 42 65 38 60 30 Z" fill="#e4002b"/>
  <!-- Text -->
  <text x="60" y="92" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="800" font-size="11" fill="#176C55" letter-spacing="1">ŞUŞA</text>
  <text x="60" y="103" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="600" font-size="7" fill="#64748b">AZƏRBAYCAN</text>
</svg>`,

  "doboj": `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="60" cy="60" r="54" fill="#ffffff" stroke="#1e3a8a" stroke-width="3"/>
  <!-- Shield shape -->
  <path d="M38 35 L82 35 C82 65 60 85 60 85 C60 85 38 65 38 35 Z" fill="#1e3a8a"/>
  <!-- Stripes -->
  <path d="M44 38 L54 38 C54 62 60 76 60 76 C60 76 46 60 44 38 Z" fill="#ffffff"/>
  <path d="M66 38 L76 38 C74 60 60 76 60 76 C60 76 66 62 66 38 Z" fill="#ffffff"/>
  <!-- Tower -->
  <rect x="54" y="44" width="12" height="18" fill="#fbbf24"/>
  <polygon points="50,44 70,44 60,35" fill="#fbbf24"/>
  <text x="60" y="100" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="800" font-size="10" fill="#1e3a8a" letter-spacing="1">DOBOJ</text>
  <text x="60" y="110" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="600" font-size="7" fill="#64748b">BOSNA I HERCEGOVINA</text>
</svg>`,

  "stari-grad": `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="60" cy="60" r="54" fill="#ffffff" stroke="#15803d" stroke-width="3"/>
  <circle cx="60" cy="60" r="48" fill="#15803d" opacity="0.1"/>
  <!-- Sebilj silhouette -->
  <path d="M60 28 L66 38 L63 38 L65 52 L68 55 L68 76 L52 76 L52 55 L55 52 L57 38 L54 38 Z" fill="#15803d"/>
  <rect x="56" y="58" width="8" height="10" fill="#ffffff"/>
  <!-- Crescent -->
  <path d="M60 22 A4 4 0 1 0 64 26 A3 3 0 1 1 60 22 Z" fill="#15803d"/>
  <text x="60" y="93" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="800" font-size="9" fill="#15803d" letter-spacing="0.5">STARI GRAD</text>
  <text x="60" y="104" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="600" font-size="7" fill="#64748b">SARAJEVO</text>
</svg>`,

  "kircaali": `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="60" cy="60" r="54" fill="#ffffff" stroke="#0284c7" stroke-width="3"/>
  <circle cx="60" cy="60" r="48" fill="#f0f9ff"/>
  <!-- Bridge & Arda River Waves -->
  <path d="M35 68 Q48 56 60 56 Q72 56 85 68" fill="none" stroke="#0369a1" stroke-width="6"/>
  <path d="M32 74 Q60 62 88 74" fill="none" stroke="#38bdf8" stroke-width="4"/>
  <circle cx="60" cy="42" r="10" fill="#f59e0b"/>
  <!-- Sun rays -->
  <path d="M60 28 L60 32 M46 36 L49 39 M74 36 L71 39" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round"/>
  <text x="60" y="94" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="800" font-size="10" fill="#0369a1" letter-spacing="1">KIRCAALİ</text>
  <text x="60" y="105" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="600" font-size="7" fill="#64748b">KARDZHALI • BG</text>
</svg>`,

  "omurtag": `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="60" cy="60" r="54" fill="#ffffff" stroke="#b91c1c" stroke-width="3"/>
  <!-- Lion & Crown -->
  <path d="M40 38 L80 38 C80 68 60 84 60 84 C60 84 40 68 40 38 Z" fill="#b91c1c"/>
  <circle cx="60" cy="52" r="12" fill="#fbbf24"/>
  <path d="M52 50 L60 42 L68 50 L65 62 L55 62 Z" fill="#ffffff"/>
  <text x="60" y="98" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="800" font-size="10" fill="#b91c1c" letter-spacing="1">OMURTAG</text>
  <text x="60" y="108" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="600" font-size="7" fill="#64748b">BULGARİSTAN</text>
</svg>`,

  "kozlukebir": `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="60" cy="60" r="54" fill="#ffffff" stroke="#0d9488" stroke-width="3"/>
  <circle cx="60" cy="60" r="48" fill="#f0fdfa"/>
  <!-- Historic Aqueduct & Olive Wreath -->
  <path d="M35 70 L35 52 Q45 42 55 52 L55 70 M55 52 Q65 42 75 52 L75 70 M75 52 Q85 42 85 70" fill="none" stroke="#0d9488" stroke-width="4"/>
  <path d="M38 42 C45 34 75 34 82 42" fill="none" stroke="#84cc16" stroke-width="3"/>
  <text x="60" y="92" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="800" font-size="9" fill="#0f766e">KOZLUKEBİR</text>
  <text x="60" y="103" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="600" font-size="7" fill="#64748b">ARRIANA • YUNANİSTAN</text>
</svg>`,

  "konayev": `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="60" cy="60" r="54" fill="#ffffff" stroke="#0284c7" stroke-width="3"/>
  <circle cx="60" cy="60" r="48" fill="#0284c7"/>
  <!-- Sun & Eagle Steppe Motif -->
  <circle cx="60" cy="46" r="14" fill="#fbbf24"/>
  <path d="M42 66 Q60 52 78 66 Q60 60 42 66 Z" fill="#fbbf24"/>
  <path d="M36 74 Q60 64 84 74" stroke="#ffffff" stroke-width="3" fill="none"/>
  <text x="60" y="95" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="800" font-size="10" fill="#ffffff" letter-spacing="1">KONAYEV</text>
  <text x="60" y="105" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="600" font-size="7" fill="#e0f2fe">KAZAKİSTAN</text>
</svg>`,

  "arhangay": `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="60" cy="60" r="54" fill="#ffffff" stroke="#0369a1" stroke-width="3"/>
  <circle cx="60" cy="60" r="48" fill="#0284c7" opacity="0.15"/>
  <!-- Soyombo Symbol & Steppe Horse -->
  <circle cx="60" cy="36" r="6" fill="#dc2626"/>
  <path d="M50 48 L70 48 L60 42 Z" fill="#dc2626"/>
  <path d="M48 54 Q60 46 72 54 L72 68 Q60 74 48 68 Z" fill="#0369a1"/>
  <text x="60" y="93" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="800" font-size="10" fill="#0369a1">ARHANGAY</text>
  <text x="60" y="104" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="600" font-size="7" fill="#64748b">ARKHANGAI • MOĞOLİSTAN</text>
</svg>`,

  "mamusa": `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="60" cy="60" r="54" fill="#ffffff" stroke="#15803d" stroke-width="3"/>
  <circle cx="60" cy="60" r="48" fill="#f0fdf4"/>
  <!-- Clock Tower & Wheat -->
  <rect x="54" y="34" width="12" height="38" fill="#15803d"/>
  <polygon points="50,34 70,34 60,25" fill="#ca8a04"/>
  <circle cx="60" cy="42" r="3" fill="#ffffff"/>
  <!-- Agriculture branches -->
  <path d="M40 70 Q50 60 52 50" stroke="#ca8a04" stroke-width="3" fill="none"/>
  <path d="M80 70 Q70 60 68 50" stroke="#ca8a04" stroke-width="3" fill="none"/>
  <text x="60" y="92" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="800" font-size="10" fill="#15803d">MAMUŞA</text>
  <text x="60" y="103" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="600" font-size="7" fill="#64748b">KOSOVA</text>
</svg>`,

  "gazimagusa": `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="60" cy="60" r="54" fill="#ffffff" stroke="#0284c7" stroke-width="3"/>
  <circle cx="60" cy="60" r="48" fill="#f0f9ff"/>
  <!-- Castle bastion & Sea waves -->
  <path d="M38 68 L38 48 L46 48 L46 54 L54 54 L54 48 L66 48 L66 54 L74 54 L74 48 L82 48 L82 68 Z" fill="#0369a1"/>
  <path d="M32 74 Q60 68 88 74" stroke="#0284c7" stroke-width="4" fill="none"/>
  <text x="60" y="93" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="800" font-size="9" fill="#0369a1">GAZİMAĞUSA</text>
  <text x="60" y="104" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="600" font-size="7" fill="#64748b">K.K.T.C.</text>
</svg>`,

  "keles": `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="60" cy="60" r="54" fill="#ffffff" stroke="#166534" stroke-width="3"/>
  <circle cx="60" cy="60" r="48" fill="#f0fdf4"/>
  <!-- Kocayayla Yurt Tent & Pine -->
  <path d="M38 68 L60 42 L82 68 Z" fill="#ca8a04"/>
  <path d="M54 68 L60 56 L66 68 Z" fill="#ffffff"/>
  <polygon points="60,32 54,44 66,44" fill="#166534"/>
  <text x="60" y="92" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="800" font-size="11" fill="#166534" letter-spacing="1">KELES</text>
  <text x="60" y="103" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="600" font-size="7" fill="#64748b">BURSA • TÜRKİYE</text>
</svg>`,
};

const unionLogos = {
  "eurocities": `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="60" cy="60" r="54" fill="#1e3a8a"/>
  <!-- Stars ring -->
  <g fill="#fbbf24">
    <circle cx="60" cy="24" r="3"/>
    <circle cx="78" cy="29" r="3"/>
    <circle cx="91" cy="42" r="3"/>
    <circle cx="96" cy="60" r="3"/>
    <circle cx="91" cy="78" r="3"/>
    <circle cx="78" cy="91" r="3"/>
    <circle cx="60" cy="96" r="3"/>
    <circle cx="42" cy="91" r="3"/>
    <circle cx="29" cy="78" r="3"/>
    <circle cx="24" cy="60" r="3"/>
    <circle cx="29" cy="42" r="3"/>
    <circle cx="42" cy="29" r="3"/>
  </g>
  <text x="60" y="64" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="11" fill="#ffffff" letter-spacing="0.5">EUROCITIES</text>
</svg>`,

  "uclg-mewa": `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="60" cy="60" r="54" fill="#ffffff" stroke="#ea580c" stroke-width="3"/>
  <circle cx="60" cy="60" r="48" fill="#fff7ed"/>
  <!-- Globe & human arcs -->
  <circle cx="60" cy="50" r="18" fill="none" stroke="#0284c7" stroke-width="3"/>
  <ellipse cx="60" cy="50" rx="9" ry="18" fill="none" stroke="#0284c7" stroke-width="2"/>
  <path d="M40 78 Q60 64 80 78" stroke="#ea580c" stroke-width="4" fill="none"/>
  <text x="60" y="96" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="10" fill="#ea580c">UCLG-MEWA</text>
  <text x="60" y="106" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="700" font-size="6" fill="#64748b">CITIES & GOVERNMENTS</text>
</svg>`,

  "tbb": `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="60" cy="60" r="54" fill="#ffffff" stroke="#dc2626" stroke-width="3"/>
  <circle cx="60" cy="60" r="48" fill="#fef2f2"/>
  <!-- Seljuk Star -->
  <polygon points="60,30 68,44 82,42 76,56 86,66 72,70 68,84 60,74 52,84 48,70 34,66 44,56 38,42 52,44" fill="#dc2626"/>
  <circle cx="60" cy="58" r="8" fill="#ffffff"/>
  <text x="60" y="97" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="12" fill="#dc2626">TBB</text>
  <text x="60" y="107" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="600" font-size="6" fill="#64748b">TÜRKİYE BELEDİYELER BİRLİĞİ</text>
</svg>`,

  "mbb": `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="60" cy="60" r="54" fill="#ffffff" stroke="#0284c7" stroke-width="3"/>
  <circle cx="60" cy="60" r="48" fill="#f0f9ff"/>
  <!-- Marmara waves -->
  <path d="M36 48 Q60 38 84 48" stroke="#0284c7" stroke-width="5" fill="none"/>
  <path d="M32 58 Q60 48 88 58" stroke="#0369a1" stroke-width="5" fill="none"/>
  <path d="M38 68 Q60 58 82 68" stroke="#0ea5e9" stroke-width="5" fill="none"/>
  <text x="60" y="96" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="12" fill="#0369a1">MBB</text>
  <text x="60" y="106" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="600" font-size="6" fill="#64748b">MARMARA BELEDİYELER BİRLİĞİ</text>
</svg>`,
};

for (const [key, svg] of Object.entries(cityLogos)) {
  fs.writeFileSync(path.join(citiesDir, `${key}.svg`), svg.trim());
}

for (const [key, svg] of Object.entries(unionLogos)) {
  fs.writeFileSync(path.join(unionsDir, `${key}.svg`), svg.trim());
}

console.log("Generated SVGs successfully!");

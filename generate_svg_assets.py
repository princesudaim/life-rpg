import os
import base64

SVGS = {
    "chest": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <radialGradient id="cglow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#38bdf8" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="cwood" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#6c4424"/>
      <stop offset="50%" stop-color="#4a2e16"/>
      <stop offset="100%" stop-color="#2d190b"/>
    </linearGradient>
    <linearGradient id="cgold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="40%" stop-color="#eab308"/>
      <stop offset="80%" stop-color="#a16207"/>
      <stop offset="100%" stop-color="#713f12"/>
    </linearGradient>
    <filter id="csh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>
  <circle cx="64" cy="68" r="48" fill="url(#cglow)"/>
  <g filter="url(#csh)">
    <!-- Chest Base -->
    <rect x="22" y="56" width="84" height="48" rx="8" fill="url(#cwood)" stroke="#1a0f07" stroke-width="2.5"/>
    <!-- Lid -->
    <path d="M18 54 C18 36, 110 36, 110 54 L110 58 L18 58 Z" fill="url(#cwood)" stroke="#1a0f07" stroke-width="2.5"/>
    <path d="M22 52 C26 40, 102 40, 106 52" stroke="#85512b" stroke-width="2" fill="none"/>
    <!-- Gold Trim Base -->
    <rect x="20" y="54" width="88" height="6" fill="url(#cgold)"/>
    <!-- Gold Straps -->
    <rect x="36" y="42" width="10" height="62" rx="2" fill="url(#cgold)" stroke="#58340c" stroke-width="1"/>
    <rect x="82" y="42" width="10" height="62" rx="2" fill="url(#cgold)" stroke="#58340c" stroke-width="1"/>
    <!-- Corner Brackets -->
    <path d="M22 84 L22 102 L40 102" stroke="url(#cgold)" stroke-width="5" fill="none" stroke-linejoin="round"/>
    <path d="M106 84 L106 102 L88 102" stroke="url(#cgold)" stroke-width="5" fill="none" stroke-linejoin="round"/>
    <circle cx="28" cy="98" r="2" fill="#451a03"/>
    <circle cx="100" cy="98" r="2" fill="#451a03"/>
    <!-- Glowing Seam -->
    <line x1="24" y1="56" x2="104" y2="56" stroke="#38bdf8" stroke-width="3" filter="drop-shadow(0 0 4px #0284c7)"/>
    <!-- Center Lock Clasp -->
    <rect x="55" y="48" width="18" height="24" rx="4" fill="url(#cgold)" stroke="#713f12" stroke-width="1.5"/>
    <circle cx="64" cy="58" r="4" fill="#0284c7"/>
    <path d="M64 58 L64 66" stroke="#0284c7" stroke-width="2" stroke-linecap="round"/>
    <circle cx="64" cy="58" r="2" fill="#bae6fd"/>
    <!-- Rivets on Straps -->
    <circle cx="41" cy="48" r="1.5" fill="#fef08a"/>
    <circle cx="41" cy="74" r="1.5" fill="#fef08a"/>
    <circle cx="41" cy="94" r="1.5" fill="#fef08a"/>
    <circle cx="87" cy="48" r="1.5" fill="#fef08a"/>
    <circle cx="87" cy="74" r="1.5" fill="#fef08a"/>
    <circle cx="87" cy="94" r="1.5" fill="#fef08a"/>
  </g>
  <!-- Sparkles -->
  <polygon points="64,18 66,24 72,26 66,28 64,34 62,28 56,26 62,24" fill="#38bdf8"/>
  <polygon points="104,32 105,36 109,37 105,38 104,42 103,38 99,37 103,36" fill="#fde047"/>
  <polygon points="24,36 25,39 28,40 25,41 24,44 23,41 20,40 23,39" fill="#fde047"/>
</svg>''',

    "flask": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <radialGradient id="rfluid" cx="45%" cy="65%" r="55%">
      <stop offset="0%" stop-color="#fb7185"/>
      <stop offset="40%" stop-color="#e11d48"/>
      <stop offset="85%" stop-color="#9f1239"/>
      <stop offset="100%" stop-color="#4c0519"/>
    </radialGradient>
    <radialGradient id="hpglow" cx="50%" cy="65%" r="55%">
      <stop offset="0%" stop-color="#f43f5e" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#e11d48" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="cork" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#a16207"/>
      <stop offset="50%" stop-color="#d97706"/>
      <stop offset="100%" stop-color="#78350f"/>
    </linearGradient>
    <filter id="fsh">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.55"/>
    </filter>
  </defs>
  <circle cx="64" cy="74" r="48" fill="url(#hpglow)"/>
  <g filter="url(#fsh)">
    <!-- Cork -->
    <polygon points="54,20 74,20 71,32 57,32" fill="url(#cork)" stroke="#451a03" stroke-width="1.5"/>
    <ellipse cx="64" cy="20" rx="10" ry="2.5" fill="#fde68a"/>
    <!-- Glass Lip -->
    <rect x="51" y="30" width="26" height="7" rx="3.5" fill="#93c5fd" fill-opacity="0.5" stroke="#bae6fd" stroke-width="1.5"/>
    <!-- Neck -->
    <rect x="56" y="35" width="16" height="18" fill="#60a5fa" fill-opacity="0.2" stroke="#93c5fd" stroke-width="1.5"/>
    <!-- Bottle Body (Potion Flask) -->
    <path d="M56 48 C42 56, 26 72, 26 90 C26 108, 43 118, 64 118 C85 118, 102 108, 102 90 C102 72, 86 56, 72 48 Z" 
          fill="#1e293b" fill-opacity="0.3" stroke="#bae6fd" stroke-width="2.5"/>
    <!-- Fluid Contents -->
    <path d="M31 88 C31 74, 45 62, 57 56 C57 56, 71 56, 71 56 C83 62, 97 74, 97 88 C97 104, 82 114, 64 114 C46 114, 31 104, 31 88 Z" 
          fill="url(#rfluid)"/>
    <!-- Liquid Surface Wave -->
    <path d="M36 78 Q50 72 64 78 T92 78" stroke="#fecdd3" stroke-width="2" fill="none" opacity="0.8"/>
    <!-- Bubbles -->
    <circle cx="52" cy="88" r="4" fill="#fda4af" opacity="0.8"/>
    <circle cx="74" cy="82" r="3" fill="#fecdd3" opacity="0.9"/>
    <circle cx="62" cy="98" r="5" fill="#f43f5e" opacity="0.9"/>
    <circle cx="60" cy="96" r="1.5" fill="#ffffff" opacity="0.9"/>
    <!-- Cross Symbol on Bottle -->
    <rect x="60" y="80" width="8" height="22" rx="2" fill="#ffffff" opacity="0.9"/>
    <rect x="53" y="87" width="22" height="8" rx="2" fill="#ffffff" opacity="0.9"/>
    <!-- Glass Highlights / Specular Glare -->
    <path d="M36 84 C34 94, 38 106, 48 112" stroke="#ffffff" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.6"/>
    <path d="M68 40 L70 48" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.7"/>
    <ellipse cx="46" cy="68" rx="6" ry="12" transform="rotate(-30 46 68)" fill="#ffffff" opacity="0.3"/>
  </g>
</svg>''',

    "xp": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <radialGradient id="xpglow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fde047" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#ca8a04" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="xpfluid" cx="45%" cy="65%" r="55%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="35%" stop-color="#eab308"/>
      <stop offset="75%" stop-color="#ca8a04"/>
      <stop offset="100%" stop-color="#854d0e"/>
    </radialGradient>
    <linearGradient id="brass" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="50%" stop-color="#b45309"/>
      <stop offset="100%" stop-color="#78350f"/>
    </linearGradient>
    <filter id="xpsh">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.55"/>
    </filter>
  </defs>
  <circle cx="64" cy="68" r="50" fill="url(#xpglow)"/>
  <g filter="url(#xpsh)">
    <!-- Golden Stopper -->
    <ellipse cx="64" cy="18" rx="12" ry="4" fill="url(#brass)"/>
    <polygon points="54,20 74,20 70,30 58,30" fill="url(#brass)"/>
    <!-- Ornate Neck Band -->
    <rect x="52" y="30" width="24" height="6" rx="2" fill="url(#brass)"/>
    <!-- Glass Neck -->
    <rect x="56" y="36" width="16" height="14" fill="#fef9c3" fill-opacity="0.2" stroke="#fde047" stroke-width="1.5"/>
    <!-- Spherical Flask Body -->
    <circle cx="64" cy="80" r="36" fill="#1e293b" fill-opacity="0.3" stroke="#fef08a" stroke-width="2.5"/>
    <!-- Fluid -->
    <circle cx="64" cy="82" r="32" fill="url(#xpfluid)"/>
    <!-- Fluid Surface -->
    <ellipse cx="64" cy="62" rx="24" ry="6" fill="#fef9c3" opacity="0.6"/>
    <!-- Star / XP Icon -->
    <polygon points="64,68 67,76 75,77 69,82 71,90 64,85 57,90 59,82 53,77 61,76" fill="#ffffff" filter="drop-shadow(0 0 3px #fef08a)"/>
    <!-- Specular Arc -->
    <path d="M40 70 A30 30 0 0 1 54 54" stroke="#ffffff" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.8"/>
    <circle cx="38" cy="84" r="2.5" fill="#ffffff" opacity="0.6"/>
    <!-- Orbiting Orbs -->
    <circle cx="28" cy="60" r="3" fill="#fef08a" filter="drop-shadow(0 0 2px #eab308)"/>
    <circle cx="100" cy="72" r="3.5" fill="#fef08a" filter="drop-shadow(0 0 2px #eab308)"/>
  </g>
</svg>''',

    "ice": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <radialGradient id="iceglow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.7"/>
      <stop offset="100%" stop-color="#0284c7" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="icetop" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f0f9ff"/>
      <stop offset="100%" stop-color="#7dd3fc"/>
    </linearGradient>
    <linearGradient id="icemid" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>
    <linearGradient id="icedark" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="100%" stop-color="#0c4a6e"/>
    </linearGradient>
    <filter id="icesh">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.5"/>
    </filter>
  </defs>
  <circle cx="64" cy="64" r="50" fill="url(#iceglow)"/>
  <g filter="url(#icesh)">
    <!-- Crystal Facets -->
    <polygon points="64,16 96,44 64,68 32,44" fill="url(#icetop)" stroke="#e0f2fe" stroke-width="1.5"/>
    <polygon points="32,44 64,68 64,112 18,72" fill="url(#icemid)" stroke="#bae6fd" stroke-width="1.5"/>
    <polygon points="64,68 96,44 110,72 64,112" fill="url(#icedark)" stroke="#38bdf8" stroke-width="1.5"/>
    <polygon points="64,68 64,112 78,82" fill="#0369a1" opacity="0.6"/>
    <!-- Top Highlight -->
    <polygon points="64,22 84,44 64,60 44,44" fill="#ffffff" opacity="0.5"/>
    <line x1="64" y1="16" x2="64" y2="112" stroke="#ffffff" stroke-width="2" opacity="0.7"/>
    <line x1="32" y1="44" x2="96" y2="44" stroke="#ffffff" stroke-width="1.5" opacity="0.7"/>
    <!-- Frost Sparkles -->
    <polygon points="64,28 66,34 72,36 66,38 64,44 62,38 56,36 62,34" fill="#ffffff"/>
    <circle cx="24" cy="38" r="2" fill="#e0f2fe"/>
    <circle cx="104" cy="54" r="2.5" fill="#e0f2fe"/>
    <circle cx="88" cy="96" r="2" fill="#e0f2fe"/>
  </g>
</svg>''',

    "armor": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <radialGradient id="armorglow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#0284c7" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="steel" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#64748b"/>
      <stop offset="50%" stop-color="#334155"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="steellight" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#94a3b8"/>
      <stop offset="100%" stop-color="#475569"/>
    </linearGradient>
    <linearGradient id="goldtrim" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="50%" stop-color="#eab308"/>
      <stop offset="100%" stop-color="#a16207"/>
    </linearGradient>
    <filter id="ash">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.55"/>
    </filter>
  </defs>
  <circle cx="64" cy="64" r="50" fill="url(#armorglow)"/>
  <g filter="url(#ash)">
    <!-- Neck Guard -->
    <path d="M48 24 C54 28, 74 28, 80 24 L86 34 C76 40, 52 40, 42 34 Z" fill="url(#steellight)" stroke="#1e293b" stroke-width="1.5"/>
    <!-- Pauldrons (Shoulders) -->
    <path d="M44 32 L18 42 L24 64 L46 48 Z" fill="url(#steel)" stroke="#0f172a" stroke-width="1.5"/>
    <path d="M84 32 L110 42 L104 64 L82 48 Z" fill="url(#steel)" stroke="#0f172a" stroke-width="1.5"/>
    <path d="M18 42 L24 64" stroke="url(#goldtrim)" stroke-width="3"/>
    <path d="M110 42 L104 64" stroke="url(#goldtrim)" stroke-width="3"/>
    <!-- Chestplate Main -->
    <path d="M42 34 L86 34 L96 66 L64 116 L32 66 Z" fill="url(#steel)" stroke="#0f172a" stroke-width="2"/>
    <!-- Pectoral Flanges -->
    <polygon points="64,40 84,48 88,68 64,74" fill="url(#steellight)" stroke="#334155" stroke-width="1"/>
    <polygon points="64,40 44,48 40,68 64,74" fill="#1e293b" stroke="#334155" stroke-width="1"/>
    <!-- Abdominal Plates -->
    <polygon points="46,74 64,78 82,74 76,92 64,96 52,92" fill="url(#steel)" stroke="#0f172a" stroke-width="1"/>
    <!-- Glowing Arcane Core -->
    <polygon points="64,52 72,64 64,72 56,64" fill="#38bdf8" filter="drop-shadow(0 0 6px #06b6d4)"/>
    <polygon points="64,56 68,64 64,68 60,64" fill="#ffffff"/>
    <!-- Edge Highlights -->
    <path d="M34 66 L64 114 L94 66" stroke="url(#goldtrim)" stroke-width="2" fill="none"/>
  </g>
</svg>''',

    "salmon": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <radialGradient id="sglow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fb923c" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#ea580c" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="fishmeat" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fbcfe8"/>
      <stop offset="25%" stop-color="#fb7185"/>
      <stop offset="60%" stop-color="#f97316"/>
      <stop offset="100%" stop-color="#ea580c"/>
    </linearGradient>
    <linearGradient id="crust" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#7c2d12"/>
      <stop offset="50%" stop-color="#c2410c"/>
      <stop offset="100%" stop-color="#ea580c"/>
    </linearGradient>
    <filter id="ssh">
      <feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#000" flood-opacity="0.5"/>
    </filter>
  </defs>
  <ellipse cx="64" cy="68" rx="54" ry="40" fill="url(#sglow)"/>
  <g filter="url(#ssh)">
    <!-- Platter / Slate -->
    <ellipse cx="64" cy="74" rx="52" ry="26" fill="#1e293b" stroke="#334155" stroke-width="2"/>
    <ellipse cx="64" cy="72" rx="46" ry="21" fill="#0f172a"/>
    <!-- Salmon Steak Body -->
    <path d="M30 68 C34 50, 94 50, 98 68 C100 80, 88 88, 64 88 C40 88, 28 80, 30 68 Z" fill="url(#fishmeat)" stroke="#9a3412" stroke-width="2"/>
    <!-- Crispy Skin Layer -->
    <path d="M29 68 C33 54, 95 54, 99 68 L98 72 C94 58, 34 58, 30 72 Z" fill="url(#crust)"/>
    <!-- Salmon Flake Segments (White Striations) -->
    <path d="M44 60 Q52 70 48 80" stroke="#fef2f2" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.8"/>
    <path d="M56 58 Q64 68 60 82" stroke="#fef2f2" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.8"/>
    <path d="M68 58 Q76 68 72 82" stroke="#fef2f2" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.8"/>
    <path d="M80 60 Q88 70 84 80" stroke="#fef2f2" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.8"/>
    <!-- Grill Marks -->
    <line x1="42" y1="62" x2="52" y2="76" stroke="#431407" stroke-width="2.5" stroke-linecap="round" opacity="0.85"/>
    <line x1="56" y1="62" x2="66" y2="76" stroke="#431407" stroke-width="2.5" stroke-linecap="round" opacity="0.85"/>
    <line x1="70" y1="62" x2="80" y2="76" stroke="#431407" stroke-width="2.5" stroke-linecap="round" opacity="0.85"/>
    <!-- Lemon Wedge -->
    <path d="M82 72 A12 12 0 0 1 98 84 Z" fill="#facc15" stroke="#ca8a04" stroke-width="1.5"/>
    <circle cx="88" cy="78" r="2" fill="#fef08a"/>
    <!-- Herb Garnish (Parsley / Rosemary) -->
    <path d="M48 64 Q54 60 58 64 Q62 60 66 64" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    <circle cx="58" cy="62" r="1.5" fill="#4ade80"/>
    <!-- Steam Wisps -->
    <path d="M50 48 Q46 40 50 34" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.5"/>
    <path d="M64 44 Q60 36 64 28" stroke="#ffffff" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.6"/>
    <path d="M78 48 Q74 40 78 34" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.5"/>
  </g>
</svg>''',

    "seer": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <radialGradient id="seerglow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#c084fc" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="#9333ea" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#581c87" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="orbglobe" cx="40%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#f3e8ff"/>
      <stop offset="25%" stop-color="#d8b4fe"/>
      <stop offset="60%" stop-color="#9333ea"/>
      <stop offset="90%" stop-color="#581c87"/>
      <stop offset="100%" stop-color="#2e1065"/>
    </radialGradient>
    <filter id="seersh">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.6"/>
    </filter>
  </defs>
  <circle cx="64" cy="64" r="54" fill="url(#seerglow)"/>
  <g filter="url(#seersh)">
    <!-- Orbiting Arcane Ring -->
    <ellipse cx="64" cy="64" rx="48" ry="16" transform="rotate(-25 64 64)" stroke="#e9d5ff" stroke-width="1.5" stroke-dasharray="6 4" fill="none" opacity="0.75"/>
    <!-- Crystal Orb -->
    <circle cx="64" cy="64" r="38" fill="url(#orbglobe)" stroke="#e9d5ff" stroke-width="2"/>
    <!-- Inner Mystical Swirl -->
    <path d="M46 68 C52 52, 76 52, 82 68 C76 80, 52 80, 46 68 Z" fill="#c084fc" opacity="0.4" filter="blur(2px)"/>
    <!-- All-Seeing Iris Core -->
    <ellipse cx="64" cy="64" rx="14" ry="18" fill="#581c87"/>
    <circle cx="64" cy="64" r="9" fill="#3b0764"/>
    <circle cx="64" cy="64" r="5" fill="#f5d0fe" filter="drop-shadow(0 0 4px #d8b4fe)"/>
    <circle cx="64" cy="64" r="2" fill="#ffffff"/>
    <!-- Specular Highlight Glare -->
    <ellipse cx="50" cy="48" rx="8" ry="4" transform="rotate(-40 50 48)" fill="#ffffff" opacity="0.75"/>
    <circle cx="42" cy="56" r="2" fill="#ffffff" opacity="0.8"/>
    <!-- Magic Runes / Star Specks -->
    <polygon points="64,18 66,22 70,24 66,26 64,30 62,26 58,24 62,22" fill="#f5d0fe"/>
    <polygon points="106,78 107,81 110,82 107,83 106,86 105,83 102,82 105,81" fill="#f5d0fe"/>
    <circle cx="22" cy="74" r="2" fill="#d8b4fe"/>
    <circle cx="98" cy="40" r="2.5" fill="#d8b4fe"/>
  </g>
</svg>''',

    "frozen-flame": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <radialGradient id="ffglow" cx="50%" cy="60%" r="50%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="#6366f1" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#0284c7" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="fflame" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%" stop-color="#1e1b4b"/>
      <stop offset="30%" stop-color="#4338ca"/>
      <stop offset="65%" stop-color="#06b6d4"/>
      <stop offset="90%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#e0f2fe"/>
    </linearGradient>
    <filter id="ffsh">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.5"/>
    </filter>
  </defs>
  <circle cx="64" cy="68" r="50" fill="url(#ffglow)"/>
  <g filter="url(#ffsh)">
    <!-- Outer Cold Flame -->
    <path d="M64 16 C76 34, 104 60, 104 86 C104 106, 86 118, 64 118 C42 118, 24 106, 24 86 C24 62, 46 44, 52 26 C58 38, 62 44, 64 16 Z" 
          fill="url(#fflame)" stroke="#bae6fd" stroke-width="1.5"/>
    <!-- Frost Crystal Shards inside Flame -->
    <polygon points="64,48 76,70 64,96 52,70" fill="#e0f2fe" opacity="0.85"/>
    <polygon points="64,48 76,70 64,96" fill="#7dd3fc" opacity="0.6"/>
    <!-- Inner Core White Flame -->
    <path d="M64 56 C70 68, 82 80, 82 92 C82 102, 74 110, 64 110 C54 110, 46 102, 46 92 C46 78, 58 72, 64 56 Z" 
          fill="#ffffff" opacity="0.9" filter="drop-shadow(0 0 6px #67e8f9)"/>
    <!-- Crystal Ice Sparkles -->
    <polygon points="64,30 65,34 69,35 65,36 64,40 63,36 59,35 63,34" fill="#ffffff"/>
    <circle cx="34" cy="62" r="2" fill="#bae6fd"/>
    <circle cx="94" cy="62" r="2.5" fill="#bae6fd"/>
    <circle cx="78" cy="38" r="1.5" fill="#bae6fd"/>
  </g>
</svg>''',

    "flame": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <radialGradient id="fglow" cx="50%" cy="65%" r="50%">
      <stop offset="0%" stop-color="#f97316" stop-opacity="0.85"/>
      <stop offset="60%" stop-color="#ef4444" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#b91c1c" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="fgrad" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%" stop-color="#991b1b"/>
      <stop offset="25%" stop-color="#dc2626"/>
      <stop offset="60%" stop-color="#f97316"/>
      <stop offset="85%" stop-color="#facc15"/>
      <stop offset="100%" stop-color="#fef08a"/>
    </linearGradient>
    <filter id="flsh">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.5"/>
    </filter>
  </defs>
  <circle cx="64" cy="70" r="50" fill="url(#fglow)"/>
  <g filter="url(#flsh)">
    <!-- Main Fire Silhouette -->
    <path d="M64 12 C74 32, 102 54, 102 84 C102 106, 85 118, 64 118 C43 118, 26 106, 26 84 C26 58, 48 40, 54 22 C60 36, 62 40, 64 12 Z" 
          fill="url(#fgrad)"/>
    <!-- Middle Tongue of Fire -->
    <path d="M64 42 C72 58, 88 74, 88 92 C88 106, 77 114, 64 114 C51 114, 40 106, 40 92 C40 74, 54 62, 60 50 C63 60, 65 62, 64 42 Z" 
          fill="#facc15"/>
    <!-- Intense Inner White Core -->
    <path d="M64 68 C70 78, 76 86, 76 96 C76 106, 70 110, 64 110 C58 110, 52 106, 52 96 C52 86, 58 78, 64 68 Z" 
          fill="#ffffff" opacity="0.95" filter="drop-shadow(0 0 4px #fef08a)"/>
    <!-- Floating Sparks -->
    <circle cx="34" cy="46" r="2.5" fill="#fef08a" opacity="0.8"/>
    <circle cx="88" cy="38" r="2" fill="#fef08a" opacity="0.8"/>
    <circle cx="68" cy="18" r="1.5" fill="#ffffff" opacity="0.9"/>
  </g>
</svg>''',

    "bag": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <radialGradient id="bglow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fde047" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#ca8a04" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="pouch" cx="40%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="35%" stop-color="#eab308"/>
      <stop offset="75%" stop-color="#a16207"/>
      <stop offset="100%" stop-color="#713f12"/>
    </radialGradient>
    <linearGradient id="goldcoin" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fef9c3"/>
      <stop offset="50%" stop-color="#eab308"/>
      <stop offset="100%" stop-color="#854d0e"/>
    </linearGradient>
    <filter id="bsh">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.55"/>
    </filter>
  </defs>
  <circle cx="64" cy="68" r="50" fill="url(#bglow)"/>
  <g filter="url(#bsh)">
    <!-- Pouch Frill Top -->
    <path d="M46 36 C42 22, 54 20, 64 24 C74 20, 86 22, 82 36 Z" fill="url(#pouch)" stroke="#58340c" stroke-width="1.5"/>
    <!-- Tied String / Rope -->
    <rect x="42" y="36" width="44" height="6" rx="3" fill="#fef08a" stroke="#854d0e" stroke-width="1.5"/>
    <circle cx="50" cy="44" r="3" fill="#fde047" stroke="#713f12" stroke-width="1"/>
    <circle cx="55" cy="46" r="3" fill="#fde047" stroke="#713f12" stroke-width="1"/>
    <!-- Main Plump Bag Body -->
    <path d="M42 40 C22 46, 18 80, 24 98 C30 114, 50 118, 64 118 C78 118, 98 114, 104 98 C110 80, 106 46, 86 40 Z" 
          fill="url(#pouch)" stroke="#58340c" stroke-width="2"/>
    <!-- Folds / Creases on Sack -->
    <path d="M38 52 C44 72, 42 90, 48 106" stroke="#713f12" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.6"/>
    <path d="M90 52 C84 72, 86 90, 80 106" stroke="#713f12" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.6"/>
    <!-- Embossed Gold Emblem (Diamond ◈) -->
    <polygon points="64,62 78,76 64,90 50,76" fill="url(#goldcoin)" stroke="#713f12" stroke-width="1.5"/>
    <polygon points="64,68 72,76 64,84 56,76" fill="#fef08a"/>
    <!-- Gold Coins spilling at rim -->
    <circle cx="82" cy="34" r="7" fill="url(#goldcoin)" stroke="#713f12" stroke-width="1"/>
    <ellipse cx="82" cy="34" rx="4" ry="4" fill="#fef08a"/>
  </g>
  <!-- Sparkles -->
  <polygon points="98,28 100,32 104,33 100,34 98,38 96,34 92,33 96,32" fill="#fef08a"/>
  <polygon points="28,48 29,51 32,52 29,53 28,56 27,53 24,52 27,51" fill="#fef08a"/>
</svg>''',

    "crate_wood": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <linearGradient id="wplank" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#b45309"/>
      <stop offset="50%" stop-color="#92400e"/>
      <stop offset="100%" stop-color="#713f12"/>
    </linearGradient>
    <linearGradient id="wiron" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#94a3b8"/>
      <stop offset="50%" stop-color="#475569"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
    <filter id="crsh">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.55"/>
    </filter>
  </defs>
  <g filter="url(#crsh)">
    <!-- Wooden Box Outer -->
    <rect x="22" y="24" width="84" height="84" rx="6" fill="url(#wplank)" stroke="#381a06" stroke-width="3"/>
    <!-- Planks Grooves -->
    <line x1="22" y1="52" x2="106" y2="52" stroke="#451a03" stroke-width="2.5"/>
    <line x1="22" y1="80" x2="106" y2="80" stroke="#451a03" stroke-width="2.5"/>
    <!-- Cross Braces -->
    <line x1="26" y1="28" x2="102" y2="104" stroke="#78350f" stroke-width="12" stroke-linecap="round"/>
    <line x1="102" y1="28" x2="26" y2="104" stroke="#78350f" stroke-width="12" stroke-linecap="round"/>
    <line x1="26" y1="28" x2="102" y2="104" stroke="#b45309" stroke-width="8" stroke-linecap="round"/>
    <line x1="102" y1="28" x2="26" y2="104" stroke="#b45309" stroke-width="8" stroke-linecap="round"/>
    <!-- Steel Corner Straps -->
    <rect x="20" y="22" width="16" height="16" fill="url(#wiron)" stroke="#0f172a" stroke-width="1.5"/>
    <rect x="92" y="22" width="16" height="16" fill="url(#wiron)" stroke="#0f172a" stroke-width="1.5"/>
    <rect x="20" y="90" width="16" height="16" fill="url(#wiron)" stroke="#0f172a" stroke-width="1.5"/>
    <rect x="92" y="90" width="16" height="16" fill="url(#wiron)" stroke="#0f172a" stroke-width="1.5"/>
    <!-- Iron Rivets -->
    <circle cx="28" cy="30" r="2.5" fill="#cbd5e1" stroke="#0f172a" stroke-width="1"/>
    <circle cx="100" cy="30" r="2.5" fill="#cbd5e1" stroke="#0f172a" stroke-width="1"/>
    <circle cx="28" cy="98" r="2.5" fill="#cbd5e1" stroke="#0f172a" stroke-width="1"/>
    <circle cx="100" cy="98" r="2.5" fill="#cbd5e1" stroke="#0f172a" stroke-width="1"/>
    <!-- Center Steel Lock Plate -->
    <rect x="52" y="52" width="24" height="24" rx="4" fill="url(#wiron)" stroke="#0f172a" stroke-width="2"/>
    <circle cx="64" cy="62" r="3.5" fill="#0f172a"/>
    <line x1="64" y1="62" x2="64" y2="70" stroke="#0f172a" stroke-width="2" stroke-linecap="round"/>
    <circle cx="64" cy="62" r="1.5" fill="#94a3b8"/>
  </g>
</svg>''',

    "crate_gold": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <radialGradient id="gcglow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fef08a" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#ca8a04" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="goldplate" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fef9c3"/>
      <stop offset="35%" stop-color="#facc15"/>
      <stop offset="70%" stop-color="#ca8a04"/>
      <stop offset="100%" stop-color="#854d0e"/>
    </linearGradient>
    <linearGradient id="goldtrim2" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="40%" stop-color="#fde047"/>
      <stop offset="100%" stop-color="#a16207"/>
    </linearGradient>
    <filter id="gcsh">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.55"/>
    </filter>
  </defs>
  <circle cx="64" cy="66" r="50" fill="url(#gcglow)"/>
  <g filter="url(#gcsh)">
    <!-- Golden Crate Body -->
    <rect x="22" y="24" width="84" height="84" rx="8" fill="url(#goldplate)" stroke="#713f12" stroke-width="3"/>
    <!-- Sunburst / Diamond Emboss -->
    <polygon points="64,32 98,66 64,100 30,66" fill="url(#goldtrim2)" opacity="0.6"/>
    <!-- Outer Heavy Gold Rim -->
    <rect x="20" y="22" width="88" height="88" rx="8" fill="none" stroke="url(#goldtrim2)" stroke-width="5"/>
    <!-- Corner Gem Bezels -->
    <circle cx="28" cy="30" r="5" fill="#ef4444" stroke="#713f12" stroke-width="1.5"/>
    <circle cx="100" cy="30" r="5" fill="#ef4444" stroke="#713f12" stroke-width="1.5"/>
    <circle cx="28" cy="98" r="5" fill="#ef4444" stroke="#713f12" stroke-width="1.5"/>
    <circle cx="100" cy="98" r="5" fill="#ef4444" stroke="#713f12" stroke-width="1.5"/>
    <!-- Central Royal Lock Jewel -->
    <polygon points="64,48 78,66 64,84 50,66" fill="#dc2626" stroke="#fef08a" stroke-width="2.5" filter="drop-shadow(0 0 4px #ef4444)"/>
    <polygon points="64,54 72,66 64,78 56,66" fill="#f87171"/>
    <circle cx="64" cy="66" r="3" fill="#ffffff"/>
  </g>
  <!-- Sparkles -->
  <polygon points="64,14 66,20 72,22 66,24 64,30 62,24 56,22 62,20" fill="#fef08a"/>
  <polygon points="106,44 107,47 110,48 107,49 106,52 105,49 102,48 105,47" fill="#ffffff"/>
</svg>''',

    "crate_diamond": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <radialGradient id="dcglow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.8"/>
      <stop offset="60%" stop-color="#0284c7" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#082f49" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="obsidian" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
    <linearGradient id="cyanbeam" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#e0f2fe"/>
      <stop offset="50%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>
    <filter id="dcsh">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.6"/>
    </filter>
  </defs>
  <circle cx="64" cy="66" r="54" fill="url(#dcglow)"/>
  <g filter="url(#dcsh)">
    <!-- High-tech Arcane Obsidian Vault -->
    <rect x="22" y="24" width="84" height="84" rx="10" fill="url(#obsidian)" stroke="#0284c7" stroke-width="2.5"/>
    <!-- Glowing Cyan Energy Channels -->
    <path d="M22 66 L106 66" stroke="#38bdf8" stroke-width="3" filter="drop-shadow(0 0 4px #0ea5e9)"/>
    <path d="M64 24 L64 108" stroke="#38bdf8" stroke-width="3" filter="drop-shadow(0 0 4px #0ea5e9)"/>
    <!-- Cyber Geometric Frame -->
    <rect x="32" y="34" width="64" height="64" rx="4" fill="none" stroke="#0ea5e9" stroke-width="1.5" stroke-dasharray="10 4"/>
    <!-- Outer Cyan Corner Brackets -->
    <path d="M22 42 L22 24 L40 24" stroke="url(#cyanbeam)" stroke-width="5" fill="none"/>
    <path d="M106 42 L106 24 L88 24" stroke="url(#cyanbeam)" stroke-width="5" fill="none"/>
    <path d="M22 86 L22 108 L40 108" stroke="url(#cyanbeam)" stroke-width="5" fill="none"/>
    <path d="M106 86 L106 108 L88 108" stroke="url(#cyanbeam)" stroke-width="5" fill="none"/>
    <!-- Central Prismatic Diamond -->
    <polygon points="64,44 86,66 64,88 42,66" fill="url(#cyanbeam)" stroke="#bae6fd" stroke-width="2.5" filter="drop-shadow(0 0 8px #38bdf8)"/>
    <polygon points="64,52 78,66 64,80 50,66" fill="#f0f9ff"/>
    <polygon points="64,56 72,66 64,76 56,66" fill="#38bdf8"/>
    <circle cx="64" cy="66" r="3" fill="#ffffff"/>
  </g>
  <!-- Diamond Sparkles -->
  <polygon points="64,12 66,18 72,20 66,22 64,28 62,22 56,20 62,18" fill="#e0f2fe"/>
  <polygon points="108,34 109,37 112,38 109,39 108,42 107,39 104,38 107,37" fill="#38bdf8"/>
  <polygon points="20,94 21,97 24,98 21,99 20,102 19,99 16,98 19,97" fill="#38bdf8"/>
</svg>'''
}

# 1. Save all SVGs to assets/
os.makedirs("/home/user/life-rpg/assets", exist_ok=True)
b64_map = {}
for k, svg_content in SVGS.items():
    svg_clean = svg_content.strip()
    svg_path = f"/home/user/life-rpg/assets/{k}.svg"
    with open(svg_path, "w", encoding="utf-8") as f:
        f.write(svg_clean)
    b64 = "data:image/svg+xml;base64," + base64.b64encode(svg_clean.encode('utf-8')).decode('ascii')
    b64_map[k] = b64

print(f"Successfully generated {len(SVGS)} SVGs in assets/")

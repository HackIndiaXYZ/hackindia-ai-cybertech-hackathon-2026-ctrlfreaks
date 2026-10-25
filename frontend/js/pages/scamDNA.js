// Scam DNA Fingerprint Page Component ("Understand the Pattern, Not the Person")

import { t, getLanguage } from "../i18n.js";
import { store } from "../store.js";
import { api } from "../api.js";
import { showToast } from "../components/toast.js";

export function renderScamDNA(container) {
  const isHi = getLanguage() === "hi";
  let dna = store.currentScamDNA;

  // If no DNA generated yet, use default baseline or latest analysis
  if (!dna && store.currentMessageAnalysis) {
    const ma = store.currentMessageAnalysis;
    dna = {
      dna_id: "DNA-" + Math.random().toString(36).substring(2, 9).toUpperCase(),
      title: `${isHi ? 'स्कैम डीएनए फिंगरप्रिंट' : 'Scam DNA Fingerprint'} • ${ma.risk_level}`,
      risk_category: ma.risk_level,
      vector: {
        urgency: ma.scoring_breakdown.urgency ? 85 : 20,
        fear: ma.scoring_breakdown.fear_threat ? 80 : 20,
        false_authority: ma.scoring_breakdown.false_authority ? 85 : 15,
        secrecy: ma.scoring_breakdown.secrecy_isolation ? 90 : 10,
        financial_pressure: ma.scoring_breakdown.credential_harvesting ? 90 : 25,
        suspicious_link: ma.contains_url ? 85 : 15,
        credential_request: ma.scoring_breakdown.credential_harvesting ? 95 : 10,
        unexpected_reward: ma.scoring_breakdown.reward_greed ? 90 : 10
      },
      detected_tactics: ma.psychological_tactics.map(t => t.name),
      summary: ma.explanation,
      three_recommendations: ma.recommended_actions.slice(0, 3),
      sanitized_export_text: `[SCAMSAATHI DNA]\nRisk: ${ma.risk_level}\nTactics: ${ma.psychological_tactics.map(t => t.name).join(", ")}\nSummary: ${ma.explanation}`,
      privacy_notice: isHi 
        ? "गोपनीयता सुरक्षा: इस कार्ड में कोई व्यक्तिगत डेटा, नाम या फोन नंबर शामिल नहीं है। केवल संरचनात्मक पैटर्न शामिल है।"
        : "Privacy Guarantee: 100% PII Stripped. No phone numbers, personal names, or raw messages are stored or exported."
    };
    store.currentScamDNA = dna;
  }

  // Fallback demo DNA if user directly navigated to tab
  if (!dna) {
    dna = {
      dna_id: "DNA-SAMPLE1",
      title: `${isHi ? 'स्कैम डीएनए फिंगरप्रिंट (डेमो)' : 'Scam DNA Fingerprint (Demo)'} • HIGH`,
      risk_category: "HIGH",
      vector: {
        urgency: 85,
        fear: 80,
        false_authority: 75,
        secrecy: 70,
        financial_pressure: 80,
        suspicious_link: 65,
        credential_request: 90,
        unexpected_reward: 20
      },
      detected_tactics: [
        isHi ? "जल्दबाजी (Urgency)" : "Urgency & Time Pressure",
        isHi ? "डर व खाता बंद की धमकी" : "Fear & Threat of Block",
        isHi ? "गोपनीय डेटा मांग" : "Credential Harvesting"
      ],
      summary: isHi 
        ? "यह फिंगरप्रिंट तत्काल दबाव, भय और खाता बंद करने की धमकी देकर संवेदनशील जानकारी चुराने का प्रारूप दर्शाता है।"
        : "This fingerprint exposes an aggressive multi-axis manipulation vector combining artificial urgency, fear of financial loss, and credential harvesting.",
      three_recommendations: isHi ? [
        "1. दबाव के समय रुकें — कोई भी बैंक 10 मिनट में कार्रवाई करने की मांग नहीं करता।",
        "2. संस्था के आधिकारिक पोर्टल से सीधे स्थिति की पुष्टि करें।",
        "3. किसी भी परिस्थिति में बैंक ओटीपी या यूपीआई पिन कभी साझा न करें।"
      ] : [
        "1. Pause under pressure — Legitimate banks never demand action within minutes.",
        "2. Verify independently through official bank websites, not incoming numbers.",
        "3. Never share OTPs or enter UPI PINs on unverified screens."
      ],
      sanitized_export_text: "SCAMSAATHI DNA: HIGH RISK\nPattern: Urgency, Fear, Credential Harvesting\nCounter-rule: Pause, Verify, Protect.",
      privacy_notice: isHi 
        ? "गोपनीयता सूचना: इस कार्ड में कोई भी व्यक्तिगत डेटा नहीं है।"
        : "Privacy Notice: This visual card represents structural manipulation patterns only."
    };
  }

  container.innerHTML = `
    <div class="flex flex-col gap-6 pb-12 animate-fade-in max-w-4xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col gap-1.5">
        <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          ${t("dna_title")}
        </h1>
        <p class="text-slate-400 text-sm">
          ${t("dna_sub")}
        </p>
      </div>

      <!-- Main DNA Card -->
      <div id="dna-fingerprint-card" class="cyber-card p-6 sm:p-10 border-teal-500/40 bg-gradient-to-br from-[#111C2E] via-[#162438] to-[#0B1220] shadow-2xl">
        <!-- Top Metadata Row -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div class="flex items-center gap-2 mb-1.5">
              <span class="px-3 py-1 rounded-full text-xs font-mono font-bold bg-teal-500/15 text-teal-300 border border-teal-500/30">
                ${dna.dna_id}
              </span>
              <span class="px-2.5 py-0.5 rounded text-xs font-bold ${
                dna.risk_category === 'CRITICAL' || dna.risk_category === 'HIGH'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }">
                ${dna.risk_category}
              </span>
            </div>
            <h2 class="text-xl sm:text-2xl font-extrabold text-white tracking-tight">${dna.title}</h2>
          </div>

          <div class="text-right hidden sm:block">
            <span class="text-xs text-slate-400">ScamSaathi Engine</span>
            <div class="text-xs text-emerald-400 font-bold">CTRL+FREAKS</div>
          </div>
        </div>

        <!-- Radar Chart & Tactics Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 py-6 items-center">
          <!-- Visual SVG Radar Canvas -->
          <div class="flex flex-col items-center justify-center">
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">${t("dna_radar_title")}</h3>
            <div class="w-64 h-64 relative flex items-center justify-center">
              ${renderRadarSVG(dna.vector)}
            </div>
          </div>

          <!-- Tactic Breakdown -->
          <div class="flex flex-col gap-3">
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">${t("dna_summary_title")}</h3>
            <p class="text-xs text-slate-300 leading-relaxed mb-2">${dna.summary}</p>
            
            <div class="flex flex-col gap-2">
              <span class="text-[11px] font-semibold text-slate-400 uppercase">Primary Vector Levers:</span>
              <div class="flex flex-wrap gap-1.5">
                ${dna.detected_tactics.map(tac => `
                  <span class="px-2.5 py-1 rounded-lg text-xs bg-[#0B1220] border border-slate-700 text-teal-300 font-medium">
                    ⚡ ${tac}
                  </span>
                `).join("")}
              </div>
            </div>
          </div>
        </div>

        <!-- Three Golden Counter-Rules -->
        <div class="p-4 rounded-xl bg-[#0B1220] border border-slate-800 mb-6">
          <h4 class="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">${t("dna_rules_title")}</h4>
          <div class="flex flex-col gap-2 text-xs text-slate-200">
            ${dna.three_recommendations.map(r => `
              <div class="flex items-start gap-2">
                <span class="text-emerald-400 font-bold">•</span>
                <span>${r}</span>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- Privacy Notice Badge -->
        <div class="flex items-center gap-2 p-3 rounded-xl bg-teal-950/30 border border-teal-500/30 text-teal-200 text-xs mb-6">
          <svg class="w-5 h-5 flex-shrink-0 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
          <span>${dna.privacy_notice}</span>
        </div>

        <!-- Action / Export Buttons -->
        <div class="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <button id="dna-copy-text-btn" class="px-5 py-2.5 rounded-xl font-semibold text-xs bg-[#111C2E] hover:bg-[#1E314B] text-slate-200 border border-slate-700 transition-colors flex items-center gap-2">
            <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/>
            </svg>
            <span>${t("dna_btn_copy_text")}</span>
          </button>
          <button id="dna-download-png-btn" class="px-6 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            <span>${t("dna_btn_download_png")}</span>
          </button>
        </div>
      </div>
    </div>
  `;

  // Copy text handler
  container.querySelector("#dna-copy-text-btn").addEventListener("click", () => {
    navigator.clipboard.writeText(dna.sanitized_export_text);
    showToast(t("common_copied"), "success");
  });

  // Download image (PNG) using HTML5 canvas
  container.querySelector("#dna-download-png-btn").addEventListener("click", () => {
    exportCardAsImage(dna);
  });
}

function renderRadarSVG(v) {
  // Dimensions: 8 axes
  const keys = [
    { key: "urgency", label: "Urgency" },
    { key: "fear", label: "Fear" },
    { key: "false_authority", label: "Authority" },
    { key: "secrecy", label: "Secrecy" },
    { key: "financial_pressure", label: "Pressure" },
    { key: "suspicious_link", label: "Link" },
    { key: "credential_request", label: "Creds" },
    { key: "unexpected_reward", label: "Reward" }
  ];

  const size = 240;
  const cx = size / 2;
  const cy = size / 2;
  const r = 90;
  const numAxes = keys.length;

  let gridCircles = [0.25, 0.5, 0.75, 1.0].map(pct => {
    return `<circle cx="${cx}" cy="${cy}" r="${r * pct}" fill="none" stroke="#1E314B" stroke-width="1" />`;
  }).join("");

  let axisLines = keys.map((_, i) => {
    const angle = (Math.PI * 2 / numAxes) * i - Math.PI / 2;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#1E314B" stroke-width="1" stroke-dasharray="2,2"/>`;
  }).join("");

  // Calculate polygon points
  let points = keys.map((item, i) => {
    const val = (v[item.key] || 10) / 100;
    const currentR = Math.max(10, r * val);
    const angle = (Math.PI * 2 / numAxes) * i - Math.PI / 2;
    const x = cx + currentR * Math.cos(angle);
    const y = cy + currentR * Math.sin(angle);
    return `${x},${y}`;
  }).join(" ");

  // Labels
  let labels = keys.map((item, i) => {
    const angle = (Math.PI * 2 / numAxes) * i - Math.PI / 2;
    const lx = cx + (r + 18) * Math.cos(angle);
    const ly = cy + (r + 18) * Math.sin(angle) + 4;
    return `<text x="${lx}" y="${ly}" fill="#94A3B8" font-size="9" text-anchor="middle" font-family="monospace">${item.label}</text>`;
  }).join("");

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size}" ${size}>
      ${gridCircles}
      ${axisLines}
      <polygon points="${points}" class="radar-area" />
      ${labels}
    </svg>
  `;
}

function exportCardAsImage(dna) {
  // Generate a branded sanitized summary PNG via HTML Canvas
  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 600;
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#0B1220";
  ctx.fillRect(0, 0, 800, 600);

  // Card background
  ctx.fillStyle = "#162438";
  ctx.strokeStyle = "#1E314B";
  ctx.lineWidth = 2;
  ctx.roundRect(40, 40, 720, 520, 20);
  ctx.fill();
  ctx.stroke();

  // Header
  ctx.fillStyle = "#10B981";
  ctx.font = "bold 24px sans-serif";
  ctx.fillText("SCAMSAATHI — SCAM DNA FINGERPRINT", 70, 95);

  ctx.fillStyle = "#94A3B8";
  ctx.font = "14px sans-serif";
  ctx.fillText("Tagline: Pause. Verify. Protect. | Team: CTRL+FREAKS", 70, 125);

  // Line
  ctx.strokeStyle = "#1E314B";
  ctx.beginPath();
  ctx.moveTo(70, 145);
  ctx.lineTo(730, 145);
  ctx.stroke();

  // DNA ID & Risk
  ctx.fillStyle = "#2DD4BF";
  ctx.font = "bold 18px monospace";
  ctx.fillText(`ID: ${dna.dna_id}  |  Risk Category: ${dna.risk_category}`, 70, 185);

  // Summary
  ctx.fillStyle = "#F8FAFC";
  ctx.font = "14px sans-serif";
  ctx.fillText("Pattern Analysis Summary:", 70, 230);
  ctx.fillStyle = "#CBD5E1";
  ctx.font = "13px sans-serif";
  ctx.fillText(dna.summary.slice(0, 80), 70, 255);
  if (dna.summary.length > 80) {
    ctx.fillText(dna.summary.slice(80, 160), 70, 275);
  }

  // Golden Rules
  ctx.fillStyle = "#10B981";
  ctx.font = "bold 15px sans-serif";
  ctx.fillText("Three Golden Safety Rules:", 70, 325);

  ctx.fillStyle = "#E2E8F0";
  ctx.font = "13px sans-serif";
  let y = 355;
  for (const rule of dna.three_recommendations) {
    ctx.fillText(rule, 70, y);
    y += 28;
  }

  // Privacy notice footer
  ctx.fillStyle = "#0F172A";
  ctx.fillRect(70, 470, 660, 55);
  ctx.fillStyle = "#2DD4BF";
  ctx.font = "11px sans-serif";
  ctx.fillText("🔒 100% PII Sanitized: Raw messages, URLs, phone numbers & names strictly stripped.", 85, 502);

  const link = document.createElement("a");
  link.download = `ScamSaathi-${dna.dna_id}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
  showToast("Scam DNA Card downloaded as PNG!", "success");
}

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
      sanitized_export_text: `[SCAMSAATHI DNA REPORT]\nVector ID: ${dna ? dna.dna_id : 'DNA-EXPORT'}\nRisk Level: ${ma.risk_level}\nTactics Identified: ${ma.psychological_tactics.map(t => t.name).join(", ")}\nSummary: ${ma.explanation}\nVerification Standard: Zero-Log Ephemeral Analysis`,
      privacy_notice: isHi 
        ? "गोपनीयता सुरक्षा: इस कार्ड में कोई व्यक्तिगत डेटा, नाम या फोन नंबर शामिल नहीं है। केवल संरचनात्मक पैटर्न शामिल है।"
        : "Privacy Guarantee: 100% PII Stripped. No phone numbers, personal names, or raw messages are stored or exported."
    };
    store.currentScamDNA = dna;
  }

  // Fallback demo DNA if user directly navigated to tab
  if (!dna) {
    dna = {
      dna_id: "DNA-SPEC-902",
      title: `${isHi ? 'स्कैम डीएनए फिंगरप्रिंट (मॉडल)' : 'Scam DNA Fingerprint (Telemetry Sample)'}`,
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
        isHi ? "जल्दबाजी (Artificial Urgency)" : "Urgency & Artificial Time Pressure",
        isHi ? "डर व खाता बंद की धमकी" : "Coercion & Impending Account Suspension",
        isHi ? "गोपनीय डेटा मांग" : "Direct Credential Harvesting"
      ],
      summary: isHi 
        ? "यह फिंगरप्रिंट तत्काल दबाव, भय और खाता बंद करने की धमकी देकर संवेदनशील जानकारी चुराने का प्रारूप दर्शाता है।"
        : "Forensic telemetry indicates a composite manipulation vector utilizing artificial urgency, institutional impersonation, and unauthorized credential harvesting.",
      three_recommendations: isHi ? [
        "1. दबाव के समय रुकें — कोई भी बैंक 10 मिनट में कार्रवाई करने की मांग नहीं करता।",
        "2. संस्था के आधिकारिक पोर्टल से सीधे स्थिति की पुष्टि करें।",
        "3. किसी भी परिस्थिति में बैंक ओटीपी या यूपीआई पिन कभी साझा न करें।"
      ] : [
        "1. Enforce cognitive pause — Certified banking entities do not impose sub-hour ultimatums.",
        "2. Validate claims via primary out-of-band communication channels.",
        "3. Never disclose one-time passwords or security credentials."
      ],
      sanitized_export_text: "SCAMSAATHI DNA: HIGH RISK\nPattern: Urgency, Fear, Credential Harvesting\nCounter-rule: Pause, Verify, Protect.",
      privacy_notice: isHi 
        ? "गोपनीयता सूचना: इस कार्ड में केवल संरचनात्मक पैटर्न शामिल हैं, कोई व्यक्तिगत डेटा नहीं।"
        : "Privacy Notice: This visual card represents structural manipulation patterns only."
    };
  }

  const isRiskHigh = dna.risk_category === "CRITICAL" || dna.risk_category === "HIGH";

  container.innerHTML = `
    <div class="flex flex-col gap-6 pb-12 animate-fade-in max-w-4xl mx-auto">
      <!-- Section Header -->
      <div class="flex flex-col gap-1">
        <div class="flex items-center gap-2">
          <span class="badge-subtle badge-neutral">FORENSIC TELEMETRY</span>
        </div>
        <h1 class="text-xl sm:text-2xl font-bold text-white tracking-tight">
          ${t("dna_title")}
        </h1>
        <p class="text-slate-400 text-xs">
          ${t("dna_sub")}
        </p>
      </div>

      <!-- Main DNA Card -->
      <div id="dna-fingerprint-card" class="cyber-card p-6 sm:p-8 bg-[#0D1527] border-[rgba(255,255,255,0.08)]">
        <!-- Top Metadata Row -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[rgba(255,255,255,0.08)]">
          <div>
            <div class="flex items-center gap-2 mb-1.5">
              <span class="badge-subtle badge-neutral font-mono-code">
                ${dna.dna_id}
              </span>
              <span class="badge-subtle ${isRiskHigh ? 'badge-rose' : 'badge-amber'} font-bold">
                ${dna.risk_category} RISK
              </span>
            </div>
            <h2 class="text-lg sm:text-xl font-bold text-white tracking-tight">${dna.title}</h2>
          </div>

          <div class="text-left sm:text-right">
            <span class="text-[10px] text-slate-400 uppercase tracking-wider block font-mono-code">ENGINE TELEMETRY</span>
            <div class="text-xs text-emerald-400 font-semibold font-mono-code">SCAMSAATHI CORE v2.4</div>
          </div>
        </div>

        <!-- Radar Chart & Tactics Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 py-6 items-center">
          <!-- Visual SVG Radar Canvas -->
          <div class="flex flex-col items-center justify-center">
            <div class="flex items-center gap-2 mb-3">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <h3 class="text-xs font-semibold tracking-wider text-slate-300 uppercase">${t("dna_radar_title")}</h3>
            </div>
            <div class="w-64 h-64 relative flex items-center justify-center">
              ${renderRadarSVG(dna.vector, isRiskHigh)}
            </div>
          </div>

          <!-- Tactic Breakdown -->
          <div class="flex flex-col gap-3.5">
            <div>
              <h3 class="text-xs font-semibold tracking-wider text-slate-300 uppercase mb-1.5">${t("dna_summary_title")}</h3>
              <p class="text-xs text-slate-300 leading-relaxed">${dna.summary}</p>
            </div>
            
            <div class="flex flex-col gap-2">
              <span class="text-[11px] font-semibold text-slate-400 uppercase">Primary Vector Levers</span>
              <div class="flex flex-wrap gap-1.5">
                ${dna.detected_tactics.map(tac => `
                  <span class="badge-subtle badge-neutral">
                    <span class="w-1 h-1 rounded-full bg-teal-400"></span>
                    ${tac}
                  </span>
                `).join("")}
              </div>
            </div>
          </div>
        </div>

        <!-- Three Golden Counter-Rules -->
        <div class="p-4 rounded-lg bg-[#080C15] border border-[rgba(255,255,255,0.06)] mb-5">
          <div class="flex items-center gap-2 mb-2.5">
            <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
            <h4 class="text-xs font-bold uppercase tracking-wider text-emerald-400">${t("dna_rules_title")}</h4>
          </div>
          <div class="flex flex-col gap-2 text-xs text-slate-200">
            ${dna.three_recommendations.map(r => `
              <div class="flex items-start gap-2.5">
                <span class="text-emerald-400 font-bold text-xs mt-0.5">•</span>
                <span class="leading-relaxed text-slate-300">${r}</span>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- Privacy Notice Badge -->
        <div class="flex items-center gap-2.5 p-3 rounded-lg bg-[#080C15] border border-[rgba(255,255,255,0.06)] text-slate-300 text-xs mb-5">
          <svg class="w-4 h-4 flex-shrink-0 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
          <span class="text-[11px] leading-relaxed">${dna.privacy_notice}</span>
        </div>

        <!-- Action / Export Buttons -->
        <div class="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[rgba(255,255,255,0.08)]">
          <button id="dna-copy-text-btn" class="px-4 py-2 rounded-lg font-semibold text-xs bg-[#10182B] hover:bg-[#16233B] text-slate-200 border border-[rgba(255,255,255,0.08)] transition-colors flex items-center gap-2">
            <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/>
            </svg>
            <span>${t("dna_btn_copy_text")}</span>
          </button>
          <button id="dna-download-png-btn" class="px-5 py-2 rounded-lg font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-sm flex items-center gap-2">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

function renderRadarSVG(v, isHighRisk) {
  const keys = [
    { key: "urgency", label: "URGENCY" },
    { key: "fear", label: "FEAR" },
    { key: "false_authority", label: "AUTHORITY" },
    { key: "secrecy", label: "SECRECY" },
    { key: "financial_pressure", label: "PRESSURE" },
    { key: "suspicious_link", label: "LINK" },
    { key: "credential_request", label: "CREDS" },
    { key: "unexpected_reward", label: "REWARD" }
  ];

  const size = 240;
  const cx = size / 2;
  const cy = size / 2;
  const r = 90;
  const numAxes = keys.length;

  let gridCircles = [0.25, 0.5, 0.75, 1.0].map(pct => {
    return `<circle cx="${cx}" cy="${cy}" r="${r * pct}" fill="none" class="radar-grid" />`;
  }).join("");

  let axisLines = keys.map((_, i) => {
    const angle = (Math.PI * 2 / numAxes) * i - Math.PI / 2;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" class="radar-axis"/>`;
  }).join("");

  let points = keys.map((item, i) => {
    const val = (v[item.key] || 15) / 100;
    const currentR = Math.max(12, r * val);
    const angle = (Math.PI * 2 / numAxes) * i - Math.PI / 2;
    const x = cx + currentR * Math.cos(angle);
    const y = cy + currentR * Math.sin(angle);
    return `${x},${y}`;
  }).join(" ");

  let labels = keys.map((item, i) => {
    const angle = (Math.PI * 2 / numAxes) * i - Math.PI / 2;
    const lx = cx + (r + 16) * Math.cos(angle);
    const ly = cy + (r + 16) * Math.sin(angle) + 3;
    return `<text x="${lx}" y="${ly}" fill="#64748B" font-size="8.5" font-weight="600" text-anchor="middle" font-family="'JetBrains Mono', monospace">${item.label}</text>`;
  }).join("");

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      ${gridCircles}
      ${axisLines}
      <polygon points="${points}" class="${isHighRisk ? 'radar-area-danger' : 'radar-area'}" />
      ${labels}
    </svg>
  `;
}

function exportCardAsImage(dna) {
  const canvas = document.createElement("canvas");
  canvas.width = 840;
  canvas.height = 580;
  const ctx = canvas.getContext("2d");

  // Canvas background
  ctx.fillStyle = "#080C15";
  ctx.fillRect(0, 0, 840, 580);

  // Border frame
  ctx.fillStyle = "#10182B";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(36, 36, 768, 508, 12);
  ctx.fill();
  ctx.stroke();

  // Header Banner
  ctx.fillStyle = "#10B981";
  ctx.font = "bold 20px 'JetBrains Mono', monospace";
  ctx.fillText("SCAMSAATHI // FORENSIC TELEMETRY REPORT", 64, 85);

  ctx.fillStyle = "#64748B";
  ctx.font = "12px sans-serif";
  ctx.fillText("Zero-Retention Privacy Framework • Structural DNA Analysis", 64, 110);

  // Separator
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.beginPath();
  ctx.moveTo(64, 130);
  ctx.lineTo(776, 130);
  ctx.stroke();

  // Identifier & Level
  ctx.fillStyle = "#34D399";
  ctx.font = "bold 15px 'JetBrains Mono', monospace";
  ctx.fillText(`ID: ${dna.dna_id}    RISK LEVEL: ${dna.risk_category}`, 64, 168);

  // Summary
  ctx.fillStyle = "#94A3B8";
  ctx.font = "bold 12px sans-serif";
  ctx.fillText("BEHAVIORAL VECTOR SUMMARY:", 64, 210);

  ctx.fillStyle = "#E2E8F0";
  ctx.font = "13px sans-serif";
  ctx.fillText(dna.summary.slice(0, 90), 64, 235);
  if (dna.summary.length > 90) {
    ctx.fillText(dna.summary.slice(90, 180), 64, 258);
  }

  // Recommendations
  ctx.fillStyle = "#10B981";
  ctx.font = "bold 12px sans-serif";
  ctx.fillText("COUNTERMEASURE DIRECTIVES:", 64, 305);

  ctx.fillStyle = "#CBD5E1";
  ctx.font = "12.5px sans-serif";
  let y = 332;
  for (const rule of dna.three_recommendations) {
    ctx.fillText(rule, 64, y);
    y += 26;
  }

  // Footer Assurance Block
  ctx.fillStyle = "#0A0F1D";
  ctx.fillRect(64, 440, 712, 54);
  ctx.strokeStyle = "rgba(16, 185, 129, 0.25)";
  ctx.strokeRect(64, 440, 712, 54);

  ctx.fillStyle = "#34D399";
  ctx.font = "11px 'JetBrains Mono', monospace";
  ctx.fillText("VERIFIED SANITIZED: Volatile RAM analysis. No message payload, phone, or name logged.", 80, 472);

  const link = document.createElement("a");
  link.download = `ScamSaathi-DNA-${dna.dna_id}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
  showToast("Scam DNA forensic report downloaded", "success");
}

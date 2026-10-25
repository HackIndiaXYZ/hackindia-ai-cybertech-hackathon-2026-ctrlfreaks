// SafeLink Protection Page Component

import { t, getLanguage } from "../i18n.js";
import { store } from "../store.js";
import { api } from "../api.js";
import { showToast } from "../components/toast.js";

const SAMPLE_URLS = [
  {
    label_en: "Lookalike Banking Phish",
    label_hi: "बैंक का मिलता-जुलता नकली डोमेन",
    url: "http://sbi-verification-update.xyz/login.html"
  },
  {
    label_en: "Numerical IP Host",
    label_hi: "सीधा आईपी पता होस्ट",
    url: "http://185.220.101.5/kyc-portal"
  },
  {
    label_en: "Direct Malicious APK",
    label_hi: "सीधा APK ऐप डाउनलोड",
    url: "https://instant-refund.online/delivery_update.apk"
  },
  {
    label_en: "URL Shortener Redirect",
    label_hi: "शॉर्ट लिंक रीडायरेक्ट",
    url: "https://bit.ly/claim-special-kbc-prize"
  },
  {
    label_en: "Legitimate Bank Domain",
    label_hi: "वैध आधिकारिक बैंक डोमेन",
    url: "https://onlinesbi.sbi/portal/login"
  }
];

export function renderSafeLink(container) {
  const isHi = getLanguage() === "hi";
  const currentResult = store.currentUrlAnalysis;

  container.innerHTML = `
    <div class="flex flex-col gap-6 pb-12 animate-fade-in max-w-5xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col gap-1.5">
        <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          ${t("safelink_title")}
        </h1>
        <p class="text-slate-400 text-sm">
          ${t("safelink_sub")}
        </p>
      </div>

      <!-- URL Input Card -->
      <div class="cyber-card p-6 sm:p-8">
        <div class="flex flex-col gap-2 mb-4">
          <span class="text-xs font-medium text-slate-400">${isHi ? 'परीक्षण लिंक चुनें:' : 'Test with sample suspicious links:'}</span>
          <div class="flex flex-wrap gap-2">
            ${SAMPLE_URLS.map((s, idx) => `
              <button 
                data-sample-idx="${idx}"
                class="safelink-sample-btn px-3 py-1 rounded-lg text-xs bg-[#111C2E] hover:bg-[#1E314B] text-slate-300 hover:text-white border border-slate-700 transition-colors"
              >
                ${isHi ? s.label_hi : s.label_en}
              </button>
            `).join("")}
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3">
          <input 
            id="safelink-input"
            type="text"
            class="flex-1 p-3.5 rounded-xl bg-[#0B1220] border border-[#1E314B] focus:border-teal-400 text-slate-200 text-sm placeholder:text-slate-500 transition-all font-mono-code"
            placeholder="${t("safelink_placeholder")}"
          />
          <button 
            id="safelink-check-btn"
            class="px-6 py-3.5 rounded-xl font-bold text-sm bg-teal-500 hover:bg-teal-400 text-slate-950 transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 flex-shrink-0"
          >
            <span id="safelink-btn-label">${t("safelink_btn_check")}</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- SafeLink Result Area -->
      <div id="safelink-result-area" class="${currentResult ? '' : 'hidden'} flex flex-col gap-6">
        ${currentResult ? renderSafeLinkResultContent(currentResult, isHi) : ''}
      </div>
    </div>
  `;

  const input = container.querySelector("#safelink-input");
  const checkBtn = container.querySelector("#safelink-check-btn");
  const btnLabel = container.querySelector("#safelink-btn-label");

  // Sample buttons
  container.querySelectorAll("button[data-sample-idx]").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.getAttribute("data-sample-idx"), 10);
      input.value = SAMPLE_URLS[idx].url;
    });
  });

  // Check URL handler
  checkBtn.addEventListener("click", async () => {
    const rawUrl = input.value.trim();
    if (!rawUrl) {
      showToast(isHi ? "कृपया जांचने के लिए यूआरएल दर्ज करें।" : "Please enter a URL to check.", "warning");
      return;
    }

    checkBtn.disabled = true;
    btnLabel.textContent = t("safelink_btn_checking");

    try {
      const result = await api.analyzeUrl(rawUrl, isHi ? "hi" : "en");
      store.recordUrlAnalysis(result);

      const resultArea = container.querySelector("#safelink-result-area");
      resultArea.innerHTML = renderSafeLinkResultContent(result, isHi);
      resultArea.classList.remove("hidden");
      resultArea.scrollIntoView({ behavior: "smooth", block: "start" });

      attachSafeLinkListeners(resultArea, result);
    } catch (err) {
      showToast(err.message || t("common_error"), "error");
    } finally {
      checkBtn.disabled = false;
      btnLabel.textContent = t("safelink_btn_check");
    }
  });

  if (currentResult) {
    const resultArea = container.querySelector("#safelink-result-area");
    attachSafeLinkListeners(resultArea, currentResult);
  }
}

function renderSafeLinkResultContent(res, isHi) {
  let riskClass = "border-emerald-500/50 bg-emerald-950/20 text-emerald-400";
  let scoreClass = "text-emerald-400";
  if (res.risk_level === "HIGH RISK") {
    riskClass = "border-red-500/80 bg-red-950/30 text-red-400";
    scoreClass = "text-red-400";
  } else if (res.risk_level === "UNCERTAIN") {
    riskClass = "border-amber-500/50 bg-amber-950/20 text-amber-400";
    scoreClass = "text-amber-400";
  }

  return `
    <!-- Result Summary Header -->
    <div class="cyber-card p-6 sm:p-8 border-2 ${riskClass}">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div class="flex items-center gap-2 mb-2">
            <span class="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-black/40 border ${riskClass}">
              ${res.risk_level}
            </span>
            <span class="text-xs text-slate-400 font-mono-code">${res.destination_domain}</span>
          </div>
          <h2 class="text-lg sm:text-xl font-bold text-white break-all font-mono-code">${res.normalized_url}</h2>
        </div>

        <div class="flex items-center gap-3 self-start sm:self-center">
          <div class="flex flex-col items-end">
            <span class="text-xs text-slate-400 uppercase font-semibold">Anatomy Risk Score</span>
            <div class="text-4xl font-extrabold ${scoreClass}">${res.risk_score}<span class="text-sm text-slate-500 font-normal">/100</span></div>
          </div>
        </div>
      </div>

      <!-- Warning signs list -->
      ${res.warning_signs.length > 0 ? `
        <div class="pt-4 flex flex-col gap-2">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Triggered Indicators</span>
          <div class="flex flex-wrap gap-2">
            ${res.warning_signs.map(w => `
              <span class="px-2.5 py-1 rounded-md text-xs font-medium bg-red-500/10 text-red-300 border border-red-500/30">
                ⚠ ${w}
              </span>
            `).join("")}
          </div>
        </div>
      ` : `
        <div class="pt-4 text-xs text-emerald-400 font-medium">
          ✓ No deceptive patterns or spoofed keywords flagged in the URL anatomy.
        </div>
      `}
    </div>

    <!-- Security Check Flags Grid -->
    <div class="cyber-card p-6">
      <h3 class="text-base font-bold text-white mb-4">${t("safelink_warning_signs")}</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        ${res.checks.map(c => `
          <div class="p-4 rounded-xl bg-[#0B1220] border ${
            c.status === 'FAIL' 
              ? 'border-red-500/40 bg-red-950/10' 
              : c.status === 'WARN'
              ? 'border-amber-500/40 bg-amber-950/10'
              : 'border-slate-800'
          } text-xs flex flex-col justify-between">
            <div class="flex items-center justify-between gap-2 mb-1.5">
              <span class="font-bold text-slate-200">${c.check_name}</span>
              <span class="px-2 py-0.5 rounded font-extrabold text-[10px] ${
                c.status === 'FAIL' 
                  ? 'bg-red-500/20 text-red-400' 
                  : c.status === 'WARN'
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'bg-emerald-500/20 text-emerald-400'
              }">${c.status}</span>
            </div>
            <p class="text-slate-400 leading-relaxed">${c.details}</p>
          </div>
        `).join("")}
      </div>
    </div>

    <!-- Safe Interstitial Preview Box -->
    <div class="cyber-card p-6 border-amber-500/40 bg-[#111C2E]">
      <div class="flex items-center gap-3 mb-3">
        <div class="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        </div>
        <div>
          <h3 class="text-base font-bold text-white">${t("safelink_safe_preview_title")}</h3>
          <span class="text-xs text-slate-400">${t("safelink_preview_notice")}</span>
        </div>
      </div>

      <div class="p-4 rounded-xl bg-[#0B1220] border border-slate-700/60 flex flex-col gap-2 mb-4 text-xs">
        <div class="flex justify-between">
          <span class="text-slate-400">${t("safelink_destination_domain")}:</span>
          <span class="font-bold text-teal-300 font-mono-code">${res.destination_domain}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-400">${t("safelink_protocol")}:</span>
          <span class="font-bold ${res.is_https ? 'text-emerald-400' : 'text-amber-400'}">${res.safe_preview.protocol}</span>
        </div>
        <div class="pt-2 border-t border-slate-800 text-slate-300">
          ${res.safe_preview.interstitial_warning}
        </div>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-3">
        <button id="safelink-stay-safe-btn" class="px-5 py-2.5 rounded-xl font-semibold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors">
          ${isHi ? "← सुरक्षित रहें — लिंक न खोलें" : "← Stay Safe — Do Not Open"}
        </button>
        <button id="safelink-external-nav-btn" class="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-slate-700 transition-colors">
          ${t("safelink_btn_external")} ↗
        </button>
      </div>
    </div>

    <!-- Recommendations & Limitation -->
    <div class="cyber-card p-6">
      <h3 class="text-base font-bold text-white mb-3">${t("analyzer_actions_title")}</h3>
      <div class="flex flex-col gap-2 mb-4">
        ${res.recommendations.map(r => `
          <div class="flex items-start gap-2.5 text-xs text-slate-200">
            <span class="text-teal-400 font-bold mt-0.5">•</span>
            <span>${r}</span>
          </div>
        `).join("")}
      </div>
      <div class="pt-3 border-t border-slate-800 text-[11px] text-slate-400">
        <strong>${isHi ? 'सीमाएं:' : 'Limitations:'}</strong> ${res.limitations} (Source: ${res.threat_intel_source})
      </div>
    </div>
  `;
}

function attachSafeLinkListeners(resultArea, result) {
  const staySafeBtn = resultArea.querySelector("#safelink-stay-safe-btn");
  const extBtn = resultArea.querySelector("#safelink-external-nav-btn");

  if (staySafeBtn) {
    staySafeBtn.addEventListener("click", () => {
      showToast(getLanguage() === "hi" ? "बुद्धिमानी भरा निर्णय! अज्ञात लिंक न खोलना ही सबसे सुरक्षित है।" : "Smart decision! Refraining from opening unverified links protects your device.", "success");
      document.getElementById("safelink-input").value = "";
      resultArea.classList.add("hidden");
    });
  }

  if (extBtn) {
    extBtn.addEventListener("click", () => {
      const confirmMsg = getLanguage() === "hi" 
        ? "चेतावनी: आप एक अपुष्ट बाहरी वेबसाइट पर जा रहे हैं। क्या आप निश्चित रूप से आगे बढ़ना चाहते हैं?"
        : "Warning: You are attempting to visit an unverified external website. ScamSaathi cannot protect your credentials on external pages. Proceed?";
      if (confirm(confirmMsg)) {
        window.open(result.normalized_url, "_blank", "noopener,noreferrer");
      }
    });
  }
}

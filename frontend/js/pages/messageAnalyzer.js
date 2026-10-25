// Message Analyzer Workspace Component

import { t, getLanguage } from "../i18n.js";
import { store } from "../store.js";
import { api } from "../api.js";
import { showToast } from "../components/toast.js";
import { showPauseModal } from "../components/pauseModal.js";

const PRELOADED_SAMPLES = [
  {
    label_en: "Fake KYC Suspension",
    label_hi: "फर्जी बैंक KYC सस्पेंशन",
    text_en: "URGENT: Your SBI account will be permanently suspended within 2 hours due to pending KYC update. Click http://sbi-kyc-verify-portal.xyz/login immediately to update PAN and Aadhaar.",
    text_hi: "प्रिय ग्राहक, आपका एसबीआई खाता 2 घंटे में स्थायी रूप से बंद कर दिया जाएगा क्योंकि आपकी केवाईसी अधूरी है। तुरंत http://sbi-kyc-verify-portal.xyz/login पर क्लिक करके पैन और आधार अपडेट करें।"
  },
  {
    label_en: "Electricity Cut Threat",
    label_hi: "बिजली कनेक्शन काटने की धमकी",
    text_en: "Dear Consumer, your electricity power will be disconnected tonight at 9:30 PM from the power office because your previous month bill was not updated. Please contact our Electricity Officer immediately at 98765-XXXXX.",
    text_hi: "प्रिय उपभोक्ता, आपकी बिजली आज रात 9:30 बजे काट दी जाएगी क्योंकि आपका पिछले महीने का बिल अपडेट नहीं हुआ है। तुरंत हमारे बिजली अधिकारी से 98765-XXXXX पर संपर्क करें।"
  },
  {
    label_en: "Police Digital Arrest",
    label_hi: "डिजिटल अरेस्ट व फर्जी पुलिस कॉल",
    text_en: "Officer Sharma, Delhi Police Cyber Branch. A seized package in your name contains narcotics. An arrest warrant is active. Stay on this video call, do not inform family, and transfer Rs 50,000 to the verification escrow account immediately.",
    text_hi: "दिल्ली पुलिस साइबर क्राइम ब्रांच से अधिकारी शर्मा। आपके नाम से पकड़े गए पार्सल में अवैध मादक पदार्थ मिले हैं। गिरफ्तारी वारंट जारी है। वीडियो कॉल न काटें, परिवार को न बताएं और सत्यापन हेतु तुरंत ₹50,000 सरकारी एस्क्रो खाते में भेजें।"
  },
  {
    label_en: "Suspicious APK Refund",
    label_hi: "फर्जी APK ऐप व रिफंड झांसा",
    text_en: "Your transaction of Rs 1,499 failed. To receive an immediate instant refund, download and install our app: http://instant-refund.online/support.apk. Allow all permissions to complete refund.",
    text_hi: "आपका ₹1,499 का लेनदेन विफल हो गया। तत्काल रिफंड प्राप्त करने के लिए ऐप http://instant-refund.online/support.apk डाउनलोड और इंस्टॉल करें और सभी परमिशन स्वीकार करें।"
  },
  {
    label_en: "Benign Appointment",
    label_hi: "वैध डॉक्टर अपॉइंटमेंट (सुरक्षित)",
    text_en: "Hello, this is a reminder for your dental check-up scheduled tomorrow at 11:00 AM at City Dental Clinic. Call our front desk at 011-23456789 if you need to reschedule. Thank you.",
    text_hi: "नमस्ते, यह सिटी डेंटल क्लिनिक में कल सुबह 11:00 बजे आपके दंत परीक्षण के लिए एक अनुस्मारक है। यदि समय बदलना हो तो हमारे फ्रंट डेस्क पर संपर्क करें।"
  }
];

export function renderMessageAnalyzer(container) {
  const isHi = getLanguage() === "hi";
  const currentResult = store.currentMessageAnalysis;

  container.innerHTML = `
    <div class="flex flex-col gap-6 pb-12 animate-fade-in max-w-5xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col gap-1.5">
        <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          ${t("analyzer_title")}
        </h1>
        <p class="text-slate-400 text-sm">
          ${t("analyzer_sub")}
        </p>
      </div>

      <!-- Main Input Workspace -->
      <div class="cyber-card p-6 sm:p-8">
        <!-- Message Type Tabs -->
        <div class="flex items-center gap-2 border-b border-slate-800 pb-4 mb-4 overflow-x-auto">
          <button class="msg-type-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            ${t("analyzer_tab_sms")}
          </button>
          <button class="msg-type-btn px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-[#0B1220] transition-colors">
            ${t("analyzer_tab_whatsapp")}
          </button>
          <button class="msg-type-btn px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-[#0B1220] transition-colors">
            ${t("analyzer_tab_email")}
          </button>
          <button class="msg-type-btn px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-[#0B1220] transition-colors">
            ${t("analyzer_tab_transcript")}
          </button>
        </div>

        <!-- Sample messages chips -->
        <div class="flex flex-col gap-2 mb-4">
          <span class="text-xs font-medium text-slate-400">${t("analyzer_sample_label")}</span>
          <div class="flex flex-wrap gap-2">
            ${PRELOADED_SAMPLES.map((s, idx) => `
              <button 
                data-sample-idx="${idx}"
                class="sample-pill-btn px-3 py-1 rounded-lg text-xs bg-[#111C2E] hover:bg-[#1E314B] text-slate-300 hover:text-white border border-slate-700 transition-colors"
              >
                ${isHi ? s.label_hi : s.label_en}
              </button>
            `).join("")}
          </div>
        </div>

        <!-- Textarea input -->
        <div class="relative mb-4">
          <textarea 
            id="analyzer-textarea"
            rows="5"
            class="w-full p-4 rounded-xl bg-[#0B1220] border border-[#1E314B] focus:border-emerald-400 text-slate-200 text-sm placeholder:text-slate-500 resize-y transition-all leading-relaxed"
            placeholder="${t("analyzer_input_placeholder")}"
          ></textarea>
        </div>

        <!-- Controls -->
        <div class="flex flex-wrap items-center justify-between gap-3">
          <button 
            id="analyzer-clear-btn"
            class="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-[#111C2E] border border-transparent hover:border-slate-700 transition-all"
          >
            ${t("analyzer_btn_clear")}
          </button>
          <button 
            id="analyzer-submit-btn"
            class="px-6 py-2.5 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
          >
            <span id="analyzer-btn-label">${t("analyzer_btn_analyze")}</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Analysis Results View -->
      <div id="analyzer-results-area" class="${currentResult ? '' : 'hidden'} flex flex-col gap-6">
        ${currentResult ? renderAnalysisResultContent(currentResult, isHi) : ''}
      </div>
    </div>
  `;

  // Preloaded sample selection
  const textarea = container.querySelector("#analyzer-textarea");
  container.querySelectorAll("button[data-sample-idx]").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.getAttribute("data-sample-idx"), 10);
      const sample = PRELOADED_SAMPLES[idx];
      textarea.value = isHi ? sample.text_hi : sample.text_en;
    });
  });

  // Clear button
  container.querySelector("#analyzer-clear-btn").addEventListener("click", () => {
    textarea.value = "";
    const resultsArea = container.querySelector("#analyzer-results-area");
    if (resultsArea) resultsArea.classList.add("hidden");
  });

  // Submit button
  const submitBtn = container.querySelector("#analyzer-submit-btn");
  const btnLabel = container.querySelector("#analyzer-btn-label");

  submitBtn.addEventListener("click", async () => {
    const text = textarea.value.trim();
    if (!text) {
      showToast(isHi ? "कृपया विश्लेषण के लिए कोई संदेश दर्ज करें।" : "Please enter message text to analyze.", "warning");
      return;
    }

    submitBtn.disabled = true;
    btnLabel.textContent = t("analyzer_btn_analyzing");

    try {
      const result = await api.analyzeMessage(text, isHi ? "hi" : "en");
      store.recordMessageAnalysis(result, text);

      // Check if pause intervention needed
      if (result.pause_intervention) {
        showPauseModal(result.pause_message);
      }

      const resultsArea = container.querySelector("#analyzer-results-area");
      resultsArea.innerHTML = renderAnalysisResultContent(result, isHi);
      resultsArea.classList.remove("hidden");
      resultsArea.scrollIntoView({ behavior: "smooth", block: "start" });

      attachResultAreaListeners(resultsArea, result);
    } catch (err) {
      showToast(err.message || t("common_error"), "error");
    } finally {
      submitBtn.disabled = false;
      btnLabel.textContent = t("analyzer_btn_analyze");
    }
  });

  if (currentResult) {
    const resultsArea = container.querySelector("#analyzer-results-area");
    attachResultAreaListeners(resultsArea, currentResult);
  }
}

function renderAnalysisResultContent(res, isHi) {
  let riskColorClass = "border-emerald-500/50 bg-emerald-950/20 text-emerald-400";
  let scoreColorClass = "text-emerald-400";
  if (res.risk_level === "CRITICAL") {
    riskColorClass = "border-red-500/80 bg-red-950/30 text-red-400";
    scoreColorClass = "text-red-400";
  } else if (res.risk_level === "HIGH") {
    riskColorClass = "border-red-500/50 bg-red-950/20 text-red-400";
    scoreColorClass = "text-red-400";
  } else if (res.risk_level === "MEDIUM") {
    riskColorClass = "border-amber-500/50 bg-amber-950/20 text-amber-400";
    scoreColorClass = "text-amber-400";
  }

  return `
    <!-- Top Result Banner -->
    <div class="cyber-card p-6 sm:p-8 border-2 ${riskColorClass}">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div class="flex items-center gap-2 mb-1.5">
            <span class="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-black/40 border ${riskColorClass}">
              ${res.risk_level} RISK
            </span>
            <span class="text-xs text-slate-400">Confidence: ${res.confidence}</span>
          </div>
          <h2 class="text-xl sm:text-2xl font-bold text-white tracking-tight">${res.explanation}</h2>
        </div>

        <div class="flex items-center gap-3 self-start sm:self-center">
          <div class="flex flex-col items-end">
            <span class="text-xs text-slate-400 uppercase font-semibold">Heuristic Score</span>
            <div class="text-4xl font-extrabold ${scoreColorClass}">${res.risk_score}<span class="text-sm text-slate-500 font-normal">/100</span></div>
          </div>
        </div>
      </div>

      <!-- Action Buttons Row -->
      <div class="flex flex-wrap items-center justify-between gap-3 pt-4">
        <button id="res-btn-another" class="px-4 py-2 rounded-xl text-xs font-semibold bg-[#111C2E] hover:bg-[#1E314B] text-slate-300 border border-slate-700 transition-colors">
          ← ${t("analyzer_btn_another")}
        </button>
        <button id="res-btn-scamdna" class="px-5 py-2.5 rounded-xl font-bold text-xs bg-teal-500 hover:bg-teal-400 text-slate-950 transition-all shadow-md shadow-teal-500/20 flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/>
          </svg>
          <span>${t("analyzer_btn_scamdna")}</span>
        </button>
      </div>
    </div>

    <!-- Psychological Scam Decoder Cards -->
    <div class="flex flex-col gap-3">
      <div class="flex flex-col gap-1">
        <h3 class="text-lg font-bold text-white">${t("analyzer_tactics_title")}</h3>
        <p class="text-xs text-slate-400">${t("analyzer_tactics_sub")}</p>
      </div>

      ${res.psychological_tactics.length === 0 ? `
        <div class="cyber-card p-6 text-center text-slate-400 text-xs">
          ${isHi ? "इस संदेश में कोई विशिष्ट मनोवैज्ञानिक हेरफेर तकनीक नहीं पाई गई।" : "No explicit psychological pressure or manipulation tactics were flagged in this message."}
        </div>
      ` : `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${res.psychological_tactics.map(tactic => `
            <div class="cyber-card p-5 border-l-4 border-l-amber-500 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between gap-2 mb-2">
                  <h4 class="text-sm font-bold text-white">${tactic.name}</h4>
                  <span class="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 uppercase font-semibold">Tactic</span>
                </div>
                <div class="p-2.5 rounded-lg bg-[#0B1220] border border-slate-800 text-xs text-amber-200/90 font-mono-code mb-3">
                  ${tactic.detected_phrase}
                </div>
                <p class="text-xs text-slate-300 leading-relaxed mb-3">${tactic.explanation}</p>
                <div class="text-[11px] text-slate-400 bg-[#111C2E] p-2.5 rounded-lg border border-slate-800/80 mb-3">
                  <strong class="text-slate-300">${isHi ? 'यह क्यों असर करता है:' : 'Why it works:'}</strong> ${tactic.why_effective}
                </div>
              </div>
              <div class="pt-3 border-t border-slate-800 text-xs text-emerald-300 flex items-start gap-1.5">
                <span class="font-bold text-emerald-400">🛡️</span>
                <span>${tactic.counter_action}</span>
              </div>
            </div>
          `).join("")}
        </div>
      `}
    </div>

    <!-- Recommended Immediate Actions Checklist -->
    <div class="cyber-card p-6">
      <h3 class="text-base font-bold text-white mb-3">${t("analyzer_actions_title")}</h3>
      <div class="flex flex-col gap-2.5">
        ${res.recommended_actions.map(action => `
          <div class="flex items-start gap-3 p-3 rounded-xl bg-[#0B1220] border border-slate-800 text-xs text-slate-200">
            <span class="text-emerald-400 font-bold text-sm mt-0.5">✓</span>
            <span class="leading-relaxed">${action}</span>
          </div>
        `).join("")}
      </div>
    </div>

    <!-- Transparency & Limitations Notice -->
    <div class="p-4 rounded-xl bg-[#111C2E] border border-slate-800 text-xs text-slate-400 leading-relaxed">
      <strong class="text-slate-300">${t("analyzer_limitations_title")}:</strong> ${res.limitations}
      <div class="mt-1 text-[11px] text-slate-500">Method: ${res.analysis_method}</div>
    </div>
  `;
}

function attachResultAreaListeners(resultsArea, result) {
  const anotherBtn = resultsArea.querySelector("#res-btn-another");
  const dnaBtn = resultsArea.querySelector("#res-btn-scamdna");

  if (anotherBtn) {
    anotherBtn.addEventListener("click", () => {
      const textarea = document.getElementById("analyzer-textarea");
      if (textarea) textarea.value = "";
      resultsArea.classList.add("hidden");
      textarea.focus();
    });
  }

  if (dnaBtn) {
    dnaBtn.addEventListener("click", async () => {
      // Trigger Scam DNA generation
      store.setActiveTab("dna");
      try {
        const dnaData = await api.generateDNA({
          risk_score: result.risk_score,
          risk_level: result.risk_level,
          tactics: result.psychological_tactics.map(t => t.name),
          indicators: result.detected_indicators.map(i => i.category),
          text_preview: result.detected_phrases.join(", "),
          language: getLanguage()
        });
        store.currentScamDNA = dnaData;
        store.notify();
      } catch (e) {
        console.error("DNA Gen error:", e);
      }
    });
  }
}

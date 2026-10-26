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
      <!-- Section Header -->
      <div class="flex flex-col gap-1">
        <div class="flex items-center gap-2">
          <span class="badge-subtle badge-neutral">FORENSIC ENGINE</span>
        </div>
        <h1 class="text-xl sm:text-2xl font-bold text-white tracking-tight">
          ${t("analyzer_title")}
        </h1>
        <p class="text-slate-400 text-xs">
          ${t("analyzer_sub")}
        </p>
      </div>

      <!-- Main Input Workspace -->
      <div class="cyber-card p-5 sm:p-6">
        <!-- Message Type Tabs -->
        <div class="flex items-center gap-1.5 border-b border-[rgba(255,255,255,0.06)] pb-3 mb-3.5 overflow-x-auto">
          <button class="msg-type-btn px-3 py-1 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">
            ${t("analyzer_tab_sms")}
          </button>
          <button class="msg-type-btn px-3 py-1 rounded-md text-xs font-medium text-slate-400 hover:text-white hover:bg-white/[0.03] transition-colors">
            ${t("analyzer_tab_whatsapp")}
          </button>
          <button class="msg-type-btn px-3 py-1 rounded-md text-xs font-medium text-slate-400 hover:text-white hover:bg-white/[0.03] transition-colors">
            ${t("analyzer_tab_email")}
          </button>
          <button class="msg-type-btn px-3 py-1 rounded-md text-xs font-medium text-slate-400 hover:text-white hover:bg-white/[0.03] transition-colors">
            ${t("analyzer_tab_transcript")}
          </button>
        </div>

        <!-- Sample presets -->
        <div class="flex flex-col gap-1.5 mb-3.5">
          <span class="text-[11px] font-medium text-slate-400">${t("analyzer_sample_label")}</span>
          <div class="flex flex-wrap gap-1.5">
            ${PRELOADED_SAMPLES.map((s, idx) => `
              <button 
                data-sample-idx="${idx}"
                class="sample-pill-btn px-2.5 py-1 rounded-md text-[11px] bg-[#0A101C] hover:bg-[#131E35] text-slate-300 hover:text-white border border-[rgba(255,255,255,0.08)] hover:border-slate-600 transition-colors"
              >
                ${isHi ? s.label_hi : s.label_en}
              </button>
            `).join("")}
          </div>
        </div>

        <!-- Textarea input -->
        <div class="relative mb-3.5">
          <textarea 
            id="analyzer-textarea"
            rows="5"
            class="w-full p-3.5 rounded-lg bg-[#080C15] border border-[rgba(255,255,255,0.08)] focus:border-emerald-500/50 text-slate-200 text-xs placeholder:text-slate-500 resize-y transition-all leading-relaxed font-mono-code"
            placeholder="${t("analyzer_input_placeholder")}"
          ></textarea>
        </div>

        <!-- Action Bar -->
        <div class="flex flex-wrap items-center justify-between gap-3">
          <button 
            id="analyzer-clear-btn"
            class="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all"
          >
            ${t("analyzer_btn_clear")}
          </button>
          <button 
            id="analyzer-submit-btn"
            class="px-5 py-2 rounded-lg font-semibold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors shadow-sm flex items-center gap-2"
          >
            <span id="analyzer-btn-label">${t("analyzer_btn_analyze")}</span>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Analysis Results View -->
      <div id="analyzer-results-area" class="${currentResult ? '' : 'hidden'} flex flex-col gap-5">
        ${currentResult ? renderAnalysisResultContent(currentResult, isHi) : ''}
      </div>
    </div>
  `;

  const textarea = container.querySelector("#analyzer-textarea");
  container.querySelectorAll("button[data-sample-idx]").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.getAttribute("data-sample-idx"), 10);
      const sample = PRELOADED_SAMPLES[idx];
      textarea.value = isHi ? sample.text_hi : sample.text_en;
    });
  });

  container.querySelector("#analyzer-clear-btn").addEventListener("click", () => {
    textarea.value = "";
    const resultsArea = container.querySelector("#analyzer-results-area");
    if (resultsArea) resultsArea.classList.add("hidden");
  });

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
  let badgeClass = "badge-emerald";
  let scoreColor = "text-emerald-400";
  if (res.risk_level === "CRITICAL" || res.risk_level === "HIGH") {
    badgeClass = "badge-rose";
    scoreColor = "text-rose-400";
  } else if (res.risk_level === "MEDIUM") {
    badgeClass = "badge-amber";
    scoreColor = "text-amber-400";
  }

  return `
    <!-- Top Result Banner -->
    <div class="cyber-card p-5 sm:p-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <div class="flex items-center gap-2 mb-1.5">
            <span class="badge-subtle ${badgeClass}">
              ${res.risk_level} RISK
            </span>
            <span class="text-[11px] text-slate-400 font-mono-code">CONFIDENCE: ${res.confidence}</span>
          </div>
          <h2 class="text-base sm:text-lg font-bold text-white tracking-tight">${res.explanation}</h2>
        </div>

        <div class="flex items-center gap-3 self-start sm:self-center flex-shrink-0">
          <div class="flex flex-col items-end">
            <span class="text-[10px] text-slate-500 uppercase font-mono-code">Heuristic Index</span>
            <div class="text-3xl font-extrabold ${scoreColor}">${res.risk_score}<span class="text-xs text-slate-500 font-normal">/100</span></div>
          </div>
        </div>
      </div>

      <!-- Action Buttons Row -->
      <div class="flex flex-wrap items-center justify-between gap-3 pt-3.5">
        <button id="res-btn-another" class="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-[#0A101C] border border-[rgba(255,255,255,0.08)] hover:border-slate-600 transition-colors">
          ${t("analyzer_btn_another")}
        </button>
        <button id="res-btn-scamdna" class="px-4 py-2 rounded-lg font-semibold text-xs bg-teal-500 hover:bg-teal-400 text-slate-950 transition-colors shadow-sm flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/>
          </svg>
          <span>${t("analyzer_btn_scamdna")}</span>
        </button>
      </div>
    </div>

    <!-- Psychological Tactics Breakdown -->
    <div class="flex flex-col gap-2.5">
      <div class="flex flex-col">
        <h3 class="text-sm font-bold text-white uppercase tracking-wider">${t("analyzer_tactics_title")}</h3>
        <p class="text-xs text-slate-400">${t("analyzer_tactics_sub")}</p>
      </div>

      ${res.psychological_tactics.length === 0 ? `
        <div class="cyber-card p-4 text-center text-slate-400 text-xs">
          ${isHi ? "इस संदेश में कोई विशिष्ट मनोवैज्ञानिक दबाव तकनीक नहीं पाई गई।" : "No explicit psychological pressure or manipulation vectors were flagged in this message."}
        </div>
      ` : `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          ${res.psychological_tactics.map(tactic => `
            <div class="cyber-card p-4 flex flex-col justify-between border-l-2 border-l-amber-500/80">
              <div>
                <div class="flex items-center justify-between gap-2 mb-1.5">
                  <h4 class="text-xs font-bold text-white">${tactic.name}</h4>
                  <span class="badge-subtle badge-amber">FLAGGED</span>
                </div>
                <div class="p-2 rounded bg-[#080C15] border border-[rgba(255,255,255,0.06)] text-xs text-amber-200/90 font-mono-code mb-2.5">
                  ${tactic.detected_phrase}
                </div>
                <p class="text-xs text-slate-300 leading-relaxed mb-2">${tactic.explanation}</p>
                <div class="text-[11px] text-slate-400 bg-[#0A101C] p-2 rounded border border-[rgba(255,255,255,0.04)] mb-2.5">
                  <strong class="text-slate-300 font-mono-code">${isHi ? 'प्रभाव:' : 'Mechanism:'}</strong> ${tactic.why_effective}
                </div>
              </div>
              <div class="pt-2 border-t border-[rgba(255,255,255,0.06)] text-xs text-emerald-400 flex items-start gap-1.5">
                <span class="font-bold">→</span>
                <span>${tactic.counter_action}</span>
              </div>
            </div>
          `).join("")}
        </div>
      `}
    </div>

    <!-- Recommended Protective Actions -->
    <div class="cyber-card p-5">
      <h3 class="text-xs font-bold uppercase tracking-wider text-white mb-2.5">${t("analyzer_actions_title")}</h3>
      <div class="flex flex-col gap-2">
        ${res.recommended_actions.map(action => `
          <div class="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#080C15] border border-[rgba(255,255,255,0.06)] text-xs text-slate-200">
            <span class="text-emerald-400 font-bold mt-0.5">•</span>
            <span class="leading-relaxed">${action}</span>
          </div>
        `).join("")}
      </div>
    </div>

    <!-- Technical Transparency Note -->
    <div class="p-3.5 rounded-lg bg-[#0A101C] border border-[rgba(255,255,255,0.06)] text-[11px] text-slate-400 leading-relaxed">
      <strong class="text-slate-300 font-mono-code">${t("analyzer_limitations_title")}:</strong> ${res.limitations}
      <div class="mt-0.5 text-[10px] text-slate-500 font-mono-code">Engine: ${res.analysis_method}</div>
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

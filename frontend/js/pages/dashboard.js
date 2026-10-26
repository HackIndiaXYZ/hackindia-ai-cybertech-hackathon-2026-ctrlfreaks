// Dashboard Page Component

import { t, getLanguage } from "../i18n.js";
import { store } from "../store.js";
import { showToast } from "../components/toast.js";

export function renderDashboard(container) {
  const isHi = getLanguage() === "hi";
  const stats = store.sessionStats;
  const recent = store.recentActivity;

  container.innerHTML = `
    <div class="flex flex-col gap-6 pb-12 animate-fade-in max-w-6xl mx-auto">
      <!-- Clean Security Console Banner -->
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0C1424] via-[#101B30] to-[#0A0F1C] border border-[rgba(255,255,255,0.08)] p-6 sm:p-8 shadow-xl">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="max-w-2xl">
            <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-[11px] font-mono-code font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>${isHi ? "सक्रिय सुरक्षा कंसोल" : "ACTIVE DEFENSE CONSOLE"}</span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
              ${t("dash_welcome_title")}
            </h1>
            <p class="text-slate-300 text-xs sm:text-sm leading-relaxed">
              ${t("dash_welcome_sub")}
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2.5 flex-shrink-0">
            <button id="hero-analyze-msg-btn" class="px-4 py-2 rounded-lg font-semibold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors shadow-sm flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
              </svg>
              <span>${t("dash_quick_analyze_btn")}</span>
            </button>
            <button id="hero-check-url-btn" class="px-4 py-2 rounded-lg font-semibold text-xs bg-[#131E35] hover:bg-[#1A2845] text-slate-200 border border-[rgba(255,255,255,0.1)] transition-colors flex items-center gap-2">
              <svg class="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"/>
              </svg>
              <span>${t("dash_quick_safelink_btn")}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Telemetry Overview (3 Cards) -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="cyber-card p-4">
          <div class="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>${t("dash_stat_analyses")}</span>
            <span class="text-[10px] font-mono-code text-slate-500">SESSION</span>
          </div>
          <div class="text-2xl font-bold text-white mb-0.5">${stats.analysesCount}</div>
          <span class="text-[11px] text-slate-400">${isHi ? "रैम में निष्पादित (Zero Storage)" : "Transient memory execution"}</span>
        </div>

        <div class="cyber-card p-4">
          <div class="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>${t("dash_stat_threats")}</span>
            <span class="text-[10px] font-mono-code text-amber-400">FLAGGED</span>
          </div>
          <div class="text-2xl font-bold text-white mb-0.5">${stats.tacticsFlaggedCount}</div>
          <span class="text-[11px] text-slate-400">${isHi ? "मनोवैज्ञानिक दबाव के संकेत" : "Coercion & urgency patterns"}</span>
        </div>

        <div class="cyber-card p-4">
          <div class="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>${t("dash_stat_honeyshield")}</span>
            <span class="text-[10px] font-mono-code text-emerald-400">SCORE</span>
          </div>
          <div class="text-2xl font-bold text-white mb-0.5">${stats.scenariosCompleted} <span class="text-xs text-slate-500 font-normal">/ 6 Completed</span></div>
          <span class="text-[11px] text-slate-400">${isHi ? "सुरक्षा रेटिंग: " : "Defense index: "}${stats.safetyScore}/100</span>
        </div>
      </div>

      <!-- Quick Analysis Console -->
      <div class="cyber-card p-5 sm:p-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h2 class="text-sm font-bold text-white">${t("dash_quick_check_title")}</h2>
            <p class="text-xs text-slate-400">${t("dash_quick_check_sub")}</p>
          </div>
          <span class="badge-subtle badge-neutral self-start sm:self-auto">
            Zero Message Retention
          </span>
        </div>

        <div class="flex flex-col gap-3">
          <textarea 
            id="dash-quick-input"
            rows="3" 
            class="w-full p-3.5 rounded-lg bg-[#080C15] border border-[rgba(255,255,255,0.08)] focus:border-emerald-500/50 text-slate-200 text-xs placeholder:text-slate-500 resize-none transition-all leading-relaxed"
            placeholder="${isHi ? 'संदेश या यूआरएल यहाँ पेस्ट करें...' : 'Paste incoming SMS, WhatsApp message, email, or URL to inspect...'}"
          ></textarea>
          
          <div class="flex flex-wrap items-center justify-between gap-2.5">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="text-[11px] text-slate-400">${isHi ? 'नमूना:' : 'Presets:'}</span>
              <button id="dash-sample-kyc-btn" class="text-[11px] px-2.5 py-1 rounded bg-[#0A101C] text-slate-300 hover:text-white border border-[rgba(255,255,255,0.08)] hover:border-slate-600 transition-colors">
                ${isHi ? 'फर्जी KYC' : 'Fake KYC Alert'}
              </button>
              <button id="dash-sample-elec-btn" class="text-[11px] px-2.5 py-1 rounded bg-[#0A101C] text-slate-300 hover:text-white border border-[rgba(255,255,255,0.08)] hover:border-slate-600 transition-colors">
                ${isHi ? 'बिजली बिल धमकी' : 'Power Cut Threat'}
              </button>
            </div>
            <button 
              id="dash-quick-submit-btn" 
              class="px-5 py-2 rounded-lg font-semibold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors shadow-sm flex items-center gap-2"
            >
              <span>${t("analyzer_btn_analyze")}</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Core Security Modules (4 Grid) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <button id="card-act-analyzer" class="cyber-card cyber-card-interactive p-4 text-left group">
          <div class="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-2.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <h3 class="text-xs font-bold text-white mb-1">${t("nav_analyzer")}</h3>
          <p class="text-[11px] text-slate-400 leading-relaxed">${isHi ? 'मनोवैज्ञानिक दबाव और संदिग्ध शब्दों का सटीक विश्लेषण।' : 'Analyze urgency, fear vectors, and credential extraction.'}</p>
        </button>

        <button id="card-act-safelink" class="cyber-card cyber-card-interactive p-4 text-left group">
          <div class="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center mb-2.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"/>
            </svg>
          </div>
          <h3 class="text-xs font-bold text-white mb-1">${t("nav_safelink")}</h3>
          <p class="text-[11px] text-slate-400 leading-relaxed">${isHi ? 'ब्राउज़र में खोलने से पहले संदिग्ध लिंक और डोमेन की जांच।' : 'Inspect lookalikes, IP hosts, and disguised short links.'}</p>
        </button>

        <button id="card-act-honeyshield" class="cyber-card cyber-card-interactive p-4 text-left group">
          <div class="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-2.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
            </svg>
          </div>
          <h3 class="text-xs font-bold text-white mb-1">${t("nav_honeyshield")}</h3>
          <p class="text-[11px] text-slate-400 leading-relaxed">${isHi ? 'काल्पनिक घोटालों के विरुद्ध इंटरएक्टिव अभ्यास।' : 'Interactive awareness training across 6 threat scenarios.'}</p>
        </button>

        <button id="card-act-safety" class="cyber-card cyber-card-interactive p-4 text-left group">
          <div class="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center mb-2.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
          </div>
          <h3 class="text-xs font-bold text-white mb-1">${t("nav_safetycenter")}</h3>
          <p class="text-[11px] text-slate-400 leading-relaxed">${isHi ? 'हेल्पलाइन 1930 और साक्ष्य सुरक्षा के आधिकारिक नियम।' : 'Containment playbook & National Cybercrime Helpline 1930.'}</p>
        </button>
      </div>

      <!-- Intel & Audit Feed -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <!-- Safety Tip of the Day -->
        <div class="cyber-card p-4 lg:col-span-1 flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-2 text-teal-400 text-[10px] font-bold uppercase tracking-wider mb-2 font-mono-code">
              <span class="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
              <span>${t("dash_tip_title")}</span>
            </div>
            <p class="text-slate-300 text-xs leading-relaxed">
              ${t("dash_tip_body")}
            </p>
          </div>
          <div class="pt-3 mt-3 border-t border-[rgba(255,255,255,0.06)] text-[10px] text-slate-500 font-mono-code">
            RULE: Never share OTPs or authorize remote phone access.
          </div>
        </div>

        <!-- Session Audit Log -->
        <div class="cyber-card p-4 lg:col-span-2">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-xs font-bold text-white uppercase tracking-wider">${t("dash_recent_activity")}</h3>
            <span class="text-[10px] font-mono-code text-slate-500">VOLATILE RAM</span>
          </div>

          ${recent.length === 0 ? `
            <div class="flex flex-col items-center justify-center py-6 text-center text-slate-500 text-xs">
              <span>${t("dash_no_activity")}</span>
            </div>
          ` : `
            <div class="flex flex-col gap-2">
              ${recent.map(item => `
                <div class="flex items-center justify-between p-2.5 rounded-lg bg-[#080C15] border border-[rgba(255,255,255,0.06)] text-xs">
                  <div class="flex items-center gap-2.5">
                    <span class="badge-subtle ${
                      item.risk_level === 'CRITICAL' || item.risk_level === 'HIGH' || item.risk_level === 'HIGH RISK'
                        ? 'badge-rose'
                        : item.risk_level === 'MEDIUM' || item.risk_level === 'UNCERTAIN'
                        ? 'badge-amber'
                        : 'badge-emerald'
                    }">
                      ${item.risk_level} (${item.score}/100)
                    </span>
                    <span class="text-slate-300 font-mono-code text-[11px]">${item.preview}</span>
                  </div>
                  <span class="text-slate-500 font-mono-code text-[10px]">${item.timestamp}</span>
                </div>
              `).join("")}
            </div>
          `}
        </div>
      </div>
    </div>
  `;

  // Attach navigation listeners
  container.querySelector("#hero-analyze-msg-btn").addEventListener("click", () => store.setActiveTab("analyzer"));
  container.querySelector("#hero-check-url-btn").addEventListener("click", () => store.setActiveTab("safelink"));
  container.querySelector("#card-act-analyzer").addEventListener("click", () => store.setActiveTab("analyzer"));
  container.querySelector("#card-act-safelink").addEventListener("click", () => store.setActiveTab("safelink"));
  container.querySelector("#card-act-honeyshield").addEventListener("click", () => store.setActiveTab("honeyshield"));
  container.querySelector("#card-act-safety").addEventListener("click", () => store.setActiveTab("safetycenter"));

  // Quick preset sample handlers
  const quickInput = container.querySelector("#dash-quick-input");
  container.querySelector("#dash-sample-kyc-btn").addEventListener("click", () => {
    quickInput.value = isHi 
      ? "प्रिय ग्राहक, आपका बैंक खाता 10 मिनट में ब्लॉक कर दिया जाएगा। खाता चालू रखने के लिए तुरंत अपना यूपीआई पिन दर्ज करें या प्राप्त हुआ ओटीपी साझा करें।"
      : "URGENT: Your SBI account will be permanently suspended within 2 hours due to pending KYC update. Click http://sbi-kyc-verify-portal.xyz/login immediately.";
  });

  container.querySelector("#dash-sample-elec-btn").addEventListener("click", () => {
    quickInput.value = isHi
      ? "प्रिय उपभोक्ता, आज रात 9:30 बजे आपकी बिजली काट दी जाएगी क्योंकि आपका पिछले महीने का बिल अपडेट नहीं हुआ है। तुरंत हमारे बिजली अधिकारी से संपर्क करें।"
      : "Dear Consumer, your electricity power connection will be disconnected tonight at 9:30 PM because your previous month bill was not updated. Call Officer immediately.";
  });

  container.querySelector("#dash-quick-submit-btn").addEventListener("click", async () => {
    const val = quickInput.value.trim();
    if (!val) {
      showToast(isHi ? "कृपया जांचने के लिए कोई संदेश या लिंक दर्ज करें।" : "Please enter text or a URL to inspect.", "warning");
      return;
    }

    if (val.startsWith("http://") || val.startsWith("https://") || (val.includes(".") && !val.includes(" ") && val.length < 255)) {
      store.setActiveTab("safelink");
      setTimeout(() => {
        const urlInput = document.getElementById("safelink-input");
        if (urlInput) {
          urlInput.value = val;
          document.getElementById("safelink-check-btn")?.click();
        }
      }, 50);
    } else {
      store.setActiveTab("analyzer");
      setTimeout(() => {
        const msgInput = document.getElementById("analyzer-textarea");
        if (msgInput) {
          msgInput.value = val;
          document.getElementById("analyzer-submit-btn")?.click();
        }
      }, 50);
    }
  });
}

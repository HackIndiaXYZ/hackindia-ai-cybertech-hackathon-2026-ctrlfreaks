// Dashboard Page Component

import { t, getLanguage } from "../i18n.js";
import { store } from "../store.js";
import { api } from "../api.js";
import { showToast } from "../components/toast.js";

export function renderDashboard(container) {
  const isHi = getLanguage() === "hi";
  const stats = store.sessionStats;
  const recent = store.recentActivity;

  container.innerHTML = `
    <div class="flex flex-col gap-8 pb-12 animate-fade-in">
      <!-- Welcome Hero Banner -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#111C2E] via-[#162438] to-[#0B1220] border border-[#1E314B] p-6 sm:p-10 shadow-2xl">
        <div class="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
        <div class="relative z-10 max-w-3xl">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 mb-4">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>${isHi ? "एआई-सहायक साइबर सुरक्षा कवच" : "AI-Assisted Cyber-Safety Companion"}</span>
          </div>
          <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            ${t("dash_welcome_title")}
          </h1>
          <p class="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            ${t("dash_welcome_sub")}
          </p>
          <div class="flex flex-wrap items-center gap-3">
            <button id="hero-analyze-msg-btn" class="px-5 py-2.5 rounded-xl font-semibold text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
              </svg>
              <span>${t("dash_quick_analyze_btn")}</span>
            </button>
            <button id="hero-check-url-btn" class="px-5 py-2.5 rounded-xl font-semibold text-sm bg-[#162438] hover:bg-[#1E314B] text-slate-200 border border-slate-700 transition-all flex items-center gap-2">
              <svg class="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"/>
              </svg>
              <span>${t("dash_quick_safelink_btn")}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Session Statistics -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="cyber-card p-5">
          <div class="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>${t("dash_stat_analyses")}</span>
            <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
          <div class="text-3xl font-extrabold text-white">${stats.analysesCount}</div>
          <span class="text-[11px] text-slate-400">${isHi ? "गोपनीय (रैम में)" : "Ephemeral session RAM"}</span>
        </div>

        <div class="cyber-card p-5">
          <div class="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>${t("dash_stat_threats")}</span>
            <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          <div class="text-3xl font-extrabold text-white">${stats.tacticsFlaggedCount}</div>
          <span class="text-[11px] text-slate-400">${isHi ? "दबाव व भय के संकेत" : "Urgency & fear levers detected"}</span>
        </div>

        <div class="cyber-card p-5">
          <div class="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>${t("dash_stat_honeyshield")}</span>
            <svg class="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="text-3xl font-extrabold text-white">${stats.scenariosCompleted} <span class="text-sm text-slate-400 font-normal">/ 6</span></div>
          <span class="text-[11px] text-slate-400">${isHi ? "सुरक्षा स्कोर: " : "Defense Score: "}${stats.safetyScore}/100</span>
        </div>
      </div>

      <!-- Quick Check Panel (Main Feature Card) -->
      <div class="cyber-card p-6 sm:p-8">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 class="text-lg font-bold text-white">${t("dash_quick_check_title")}</h2>
            <p class="text-xs text-slate-400">${t("dash_quick_check_sub")}</p>
          </div>
          <span class="text-[11px] px-2.5 py-1 rounded bg-[#111C2E] border border-slate-700 text-teal-400 font-mono-code self-start sm:self-auto">
            Zero Data Retention
          </span>
        </div>

        <div class="flex flex-col gap-3">
          <textarea 
            id="dash-quick-input"
            rows="3" 
            class="w-full p-4 rounded-xl bg-[#0B1220] border border-[#1E314B] focus:border-teal-400 text-slate-200 text-sm placeholder:text-slate-500 resize-none transition-all"
            placeholder="${isHi ? 'संदेश या यूआरएल यहाँ पेस्ट करें...' : 'Paste message text, email content, or link here...'}"
          ></textarea>
          
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <span class="text-xs text-slate-400">${isHi ? 'त्वरित नमूना:' : 'Quick sample:'}</span>
              <button id="dash-sample-kyc-btn" class="text-xs px-2.5 py-1 rounded-lg bg-[#111C2E] text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 transition-colors">
                ${isHi ? 'फर्जी बैंक KYC' : 'Fake Bank KYC'}
              </button>
              <button id="dash-sample-elec-btn" class="text-xs px-2.5 py-1 rounded-lg bg-[#111C2E] text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 transition-colors">
                ${isHi ? 'बिजली बिल धमकी' : 'Electricity Threat'}
              </button>
            </div>
            <button 
              id="dash-quick-submit-btn" 
              class="px-6 py-2.5 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2"
            >
              <span>${t("analyzer_btn_analyze")}</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Action Cards (4 Grid) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button id="card-act-analyzer" class="cyber-card p-5 text-left group">
          <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
            </svg>
          </div>
          <h3 class="text-base font-bold text-white mb-1">${t("nav_analyzer")}</h3>
          <p class="text-xs text-slate-400 leading-relaxed">${isHi ? 'मनोवैज्ञानिक दबाव और संदिग्ध शब्दों का सटीक विश्लेषण।' : 'Detect manipulation, urgency, and credential theft attempts.'}</p>
        </button>

        <button id="card-act-safelink" class="cyber-card p-5 text-left group">
          <div class="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"/>
            </svg>
          </div>
          <h3 class="text-base font-bold text-white mb-1">${t("nav_safelink")}</h3>
          <p class="text-xs text-slate-400 leading-relaxed">${isHi ? 'ब्राउज़र में खोलने से पहले संदिग्ध लिंक और डोमेन की जांच।' : 'Inspect URLs, punycode, and lookalike domains before clicking.'}</p>
        </button>

        <button id="card-act-honeyshield" class="cyber-card p-5 text-left group">
          <div class="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
            </svg>
          </div>
          <h3 class="text-base font-bold text-white mb-1">${t("nav_honeyshield")}</h3>
          <p class="text-xs text-slate-400 leading-relaxed">${isHi ? 'काल्पनिक घोटालों के विरुद्ध इंटरएक्टिव अभ्यास करें।' : 'Interactive awareness training with 6 realistic branching scenarios.'}</p>
        </button>

        <button id="card-act-safety" class="cyber-card p-5 text-left group">
          <div class="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
          </div>
          <h3 class="text-base font-bold text-white mb-1">${t("nav_safetycenter")}</h3>
          <p class="text-xs text-slate-400 leading-relaxed">${isHi ? 'हेल्पलाइन 1930 और साक्ष्य सुरक्षा के आधिकारिक नियम।' : 'Immediate checklist, evidence preservation, and 1930 helpline.'}</p>
        </button>
      </div>

      <!-- Cyber Safety Tip of the Day & Session Activity Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Safety Tip -->
        <div class="cyber-card p-6 lg:col-span-1 border-teal-500/30 flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-3">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
              <span>${t("dash_tip_title")}</span>
            </div>
            <p class="text-slate-300 text-sm leading-relaxed mb-4">
              ${t("dash_tip_body")}
            </p>
          </div>
          <div class="pt-4 border-t border-slate-800 text-[11px] text-slate-400">
            ${isHi ? "मंत्र: रुकें। जांचें। सुरक्षित रहें।" : "Mantra: Pause before acting under pressure."}
          </div>
        </div>

        <!-- Recent Activity in Session -->
        <div class="cyber-card p-6 lg:col-span-2">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-bold text-white">${t("dash_recent_activity")}</h3>
            <span class="text-xs text-slate-400">${isHi ? 'सत्र समाप्त होने पर स्वतः साफ' : 'Session-only, not saved to disk'}</span>
          </div>

          ${recent.length === 0 ? `
            <div class="flex flex-col items-center justify-center py-8 text-center text-slate-400 text-xs">
              <svg class="w-8 h-8 mb-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
              <span>${t("dash_no_activity")}</span>
            </div>
          ` : `
            <div class="flex flex-col gap-2.5">
              ${recent.map(item => `
                <div class="flex items-center justify-between p-3 rounded-xl bg-[#0B1220] border border-slate-800 text-xs">
                  <div class="flex items-center gap-3">
                    <span class="px-2 py-0.5 rounded font-bold ${
                      item.risk_level === 'CRITICAL' || item.risk_level === 'HIGH' || item.risk_level === 'HIGH RISK'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : item.risk_level === 'MEDIUM' || item.risk_level === 'UNCERTAIN'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }">
                      ${item.risk_level} (${item.score}/100)
                    </span>
                    <span class="text-slate-300 font-mono-code">${item.preview}</span>
                  </div>
                  <span class="text-slate-400">${item.timestamp}</span>
                </div>
              `).join("")}
            </div>
          `}
        </div>
      </div>
    </div>
  `;

  // Attach action listeners
  container.querySelector("#hero-analyze-msg-btn").addEventListener("click", () => store.setActiveTab("analyzer"));
  container.querySelector("#hero-check-url-btn").addEventListener("click", () => store.setActiveTab("safelink"));
  container.querySelector("#card-act-analyzer").addEventListener("click", () => store.setActiveTab("analyzer"));
  container.querySelector("#card-act-safelink").addEventListener("click", () => store.setActiveTab("safelink"));
  container.querySelector("#card-act-honeyshield").addEventListener("click", () => store.setActiveTab("honeyshield"));
  container.querySelector("#card-act-safety").addEventListener("click", () => store.setActiveTab("safetycenter"));

  // Quick samples in dashboard
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
      showToast(isHi ? "कृपया जांचने के लिए कोई संदेश या लिंक दर्ज करें।" : "Please enter text or a URL to check.", "warning");
      return;
    }

    // If starts with http or domain format, route to safelink, otherwise message analyzer
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

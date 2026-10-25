// Settings & Diagnostics Page Component

import { t, getLanguage, setLanguage } from "../i18n.js";
import { api } from "../api.js";
import { showToast } from "../components/toast.js";

export async function renderSettings(container) {
  const isHi = getLanguage() === "hi";

  container.innerHTML = `
    <div class="flex flex-col gap-6 pb-12 animate-fade-in max-w-4xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col gap-1.5">
        <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          ${t("settings_title")}
        </h1>
        <p class="text-slate-400 text-sm">
          ${t("settings_sub")}
        </p>
      </div>

      <!-- Language & UI Settings -->
      <div class="cyber-card p-6 sm:p-8">
        <h2 class="text-base font-bold text-white mb-4">${isHi ? 'भाषा व प्राथमिक प्राथमिकताएं' : 'Language & Display Preferences'}</h2>
        
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#0B1220] border border-slate-800 mb-4">
          <div>
            <span class="text-xs font-bold text-slate-200 block mb-0.5">${t("settings_lang_label")}</span>
            <span class="text-[11px] text-slate-400">Choose between English and Hindi for full UI and analysis translations.</span>
          </div>

          <div class="flex items-center gap-2">
            <button id="opt-lang-en" class="px-3.5 py-1.5 rounded-lg text-xs font-semibold ${getLanguage() === 'en' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-[#162438] text-slate-300 hover:text-white border border-slate-700'}">
              English
            </button>
            <button id="opt-lang-hi" class="px-3.5 py-1.5 rounded-lg text-xs font-semibold ${getLanguage() === 'hi' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-[#162438] text-slate-300 hover:text-white border border-slate-700'}">
              हिन्दी (Hindi)
            </button>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#0B1220] border border-slate-800">
          <div>
            <span class="text-xs font-bold text-slate-200 block mb-0.5">${t("settings_demo_mode")}</span>
            <span class="text-[11px] text-slate-400">${t("settings_demo_desc")}</span>
          </div>
          <span class="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            ACTIVE (FREE MODE)
          </span>
        </div>
      </div>

      <!-- Backend Diagnostic Checklist -->
      <div class="cyber-card p-6 sm:p-8">
        <div class="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <h3 class="text-base font-bold text-white">${t("settings_system_status")}</h3>
          <button id="refresh-diagnostics-btn" class="text-xs px-2.5 py-1 rounded bg-[#111C2E] hover:bg-[#1E314B] text-slate-300 border border-slate-700 transition-colors">
            Refresh
          </button>
        </div>

        <div id="diagnostics-items-container" class="flex flex-col gap-3 text-xs">
          <div class="text-slate-400 py-3 text-center">Checking security services...</div>
        </div>
      </div>

      <!-- About ScamSaathi -->
      <div class="cyber-card p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-slate-800">
        <div>
          <span class="text-sm font-extrabold text-white block">ScamSaathi • v1.0.0</span>
          <span class="text-xs text-slate-400">Developed by <strong class="text-teal-300">Team CTRL+FREAKS</strong> for Accessible Cyber-Safety</span>
        </div>
        <div class="text-xs text-slate-500 font-mono-code">
          Python 3.13 + FastAPI + Tailwind
        </div>
      </div>
    </div>
  `;

  // Attach language handlers
  container.querySelector("#opt-lang-en").addEventListener("click", () => {
    if (getLanguage() !== "en") {
      setLanguage("en");
      window.location.reload();
    }
  });

  container.querySelector("#opt-lang-hi").addEventListener("click", () => {
    if (getLanguage() !== "hi") {
      setLanguage("hi");
      window.location.reload();
    }
  });

  // Fetch Health & Diagnostic Info
  async function loadDiagnostics() {
    const diagContainer = container.querySelector("#diagnostics-items-container");
    if (!diagContainer) return;

    try {
      const health = await api.getHealth();
      const ig = health.integrations;

      diagContainer.innerHTML = `
        <div class="flex items-center justify-between p-3.5 rounded-xl bg-[#0B1220] border border-slate-800">
          <div class="flex items-center gap-2.5">
            <span class="w-2.5 h-2.5 rounded-full ${ig.ai_provider.configured ? 'bg-emerald-400' : 'bg-teal-400'}"></span>
            <div>
              <strong class="text-slate-200 block">${t("settings_ai_status")}</strong>
              <span class="text-[11px] text-slate-400">${ig.ai_provider.name}</span>
            </div>
          </div>
          <span class="px-2.5 py-0.5 rounded text-[10px] font-bold ${ig.ai_provider.configured ? 'bg-emerald-500/20 text-emerald-300' : 'bg-teal-500/20 text-teal-300'}">
            ${ig.ai_provider.configured ? 'LIVE API' : 'LOCAL FALLBACK'}
          </span>
        </div>

        <div class="flex items-center justify-between p-3.5 rounded-xl bg-[#0B1220] border border-slate-800">
          <div class="flex items-center gap-2.5">
            <span class="w-2.5 h-2.5 rounded-full ${ig.safe_browsing.configured ? 'bg-emerald-400' : 'bg-teal-400'}"></span>
            <div>
              <strong class="text-slate-200 block">${t("settings_url_intel_status")}</strong>
              <span class="text-[11px] text-slate-400">${ig.safe_browsing.name}</span>
            </div>
          </div>
          <span class="px-2.5 py-0.5 rounded text-[10px] font-bold ${ig.safe_browsing.configured ? 'bg-emerald-500/20 text-emerald-300' : 'bg-teal-500/20 text-teal-300'}">
            ${ig.safe_browsing.configured ? 'LIVE API' : 'LOCAL HEURISTICS'}
          </span>
        </div>

        <div class="flex items-center justify-between p-3.5 rounded-xl bg-[#0B1220] border border-slate-800">
          <div class="flex items-center gap-2.5">
            <span class="w-2.5 h-2.5 rounded-full ${ig.sms_provider.configured ? 'bg-emerald-400' : 'bg-amber-400'}"></span>
            <div>
              <strong class="text-slate-200 block">${t("settings_sms_status")}</strong>
              <span class="text-[11px] text-slate-400">${ig.sms_provider.name}</span>
            </div>
          </div>
          <span class="px-2.5 py-0.5 rounded text-[10px] font-bold ${ig.sms_provider.configured ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}">
            ${ig.sms_provider.configured ? 'LIVE TWILIO' : 'SAFE DEMO MODE'}
          </span>
        </div>
      `;
    } catch (err) {
      diagContainer.innerHTML = `
        <div class="p-3 bg-red-950/20 border border-red-500/30 rounded-xl text-red-300 text-xs">
          Could not connect to backend API: ${err.message}. Local frontend fallback remains active.
        </div>
      `;
    }
  }

  loadDiagnostics();
  container.querySelector("#refresh-diagnostics-btn").addEventListener("click", () => {
    loadDiagnostics();
    showToast("Diagnostics refreshed", "info");
  });
}

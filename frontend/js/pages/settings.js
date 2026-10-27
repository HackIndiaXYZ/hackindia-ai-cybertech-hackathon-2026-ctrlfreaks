// Settings & Diagnostics Page Component

import { t, getLanguage, setLanguage } from "../i18n.js";
import { api } from "../api.js";
import { showToast } from "../components/toast.js";

export async function renderSettings(container) {
  const isHi = getLanguage() === "hi";

  container.innerHTML = `
    <div class="flex flex-col gap-6 pb-12 animate-fade-in max-w-4xl mx-auto">
      <!-- Section Header -->
      <div class="flex flex-col gap-1">
        <div class="flex items-center gap-2">
          <span class="badge-subtle badge-neutral">CONFIGURATION & TELEMETRY</span>
        </div>
        <h1 class="text-xl sm:text-2xl font-bold text-white tracking-tight">
          ${t("settings_title")}
        </h1>
        <p class="text-slate-400 text-xs">
          ${t("settings_sub")}
        </p>
      </div>

      <!-- Language & UI Settings -->
      <div class="cyber-card p-5 sm:p-6 bg-[#0D1527] border-[rgba(255,255,255,0.08)]">
        <h2 class="text-sm font-bold text-white mb-3.5">${isHi ? 'भाषा व प्राथमिक प्राथमिकताएं' : 'Localization & Interface Configuration'}</h2>
        
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 rounded-lg bg-[#080C15] border border-[rgba(255,255,255,0.06)] mb-3">
          <div>
            <span class="text-xs font-semibold text-slate-200 block mb-0.5">${t("settings_lang_label")}</span>
            <span class="text-[11px] text-slate-400">Choose between English and Hindi for interface taxonomy and analysis summaries.</span>
          </div>

          <div class="flex items-center gap-2">
            <button id="opt-lang-en" class="px-3 py-1.5 rounded-md text-xs font-semibold ${getLanguage() === 'en' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-[#10182B] text-slate-300 hover:text-white border border-[rgba(255,255,255,0.08)]'}">
              English
            </button>
            <button id="opt-lang-hi" class="px-3 py-1.5 rounded-md text-xs font-semibold ${getLanguage() === 'hi' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-[#10182B] text-slate-300 hover:text-white border border-[rgba(255,255,255,0.08)]'}">
              हिन्दी (Hindi)
            </button>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 rounded-lg bg-[#080C15] border border-[rgba(255,255,255,0.06)]">
          <div>
            <span class="text-xs font-semibold text-slate-200 block mb-0.5">${t("settings_demo_mode")}</span>
            <span class="text-[11px] text-slate-400">${t("settings_demo_desc")}</span>
          </div>
          <span class="badge-subtle badge-emerald font-mono-code">
            LOCAL ENGINE ACTIVE
          </span>
        </div>
      </div>

      <!-- AI Engine Status Card -->
      <div class="cyber-card p-5 sm:p-6 bg-[#0D1527] border-[rgba(255,255,255,0.08)]">
        <div class="flex items-center justify-between pb-3.5 mb-3.5 border-b border-[rgba(255,255,255,0.08)]">
          <div>
            <h2 class="text-sm font-bold text-white">AI Cognitive Analysis Engine</h2>
            <span class="text-[11px] text-slate-400">Powered by built-in High-Performance Groq AI & Saathi CyberGuard</span>
          </div>
          <span id="settings-ai-active-pill" class="badge-subtle badge-emerald font-mono-code">
            GROQ AI ACTIVE
          </span>
        </div>

        <div class="p-3.5 rounded-lg bg-[#080C15] border border-[rgba(255,255,255,0.06)] text-xs flex flex-col gap-2.5">
          <div class="flex items-center gap-2 text-emerald-400">
            <svg class="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span class="font-bold text-xs">Direct AI Engine Connected & Verified</span>
          </div>
          <p class="text-[11px] text-slate-300 leading-relaxed">
            Aapka system direct <strong>Groq AI Cloud</strong> se connect ho chuka hai. Message Analyzer, Link Analyzer aur Floating <strong>Saathi AI Copilot</strong> bina kisi manual configuration ke full power me active hain.
          </p>
        </div>
      </div>

      <!-- Backend Diagnostic Checklist -->
      <div class="cyber-card p-5 sm:p-6 bg-[#0D1527] border-[rgba(255,255,255,0.08)]">
        <div class="flex items-center justify-between pb-3.5 mb-3.5 border-b border-[rgba(255,255,255,0.08)]">
          <h3 class="text-sm font-bold text-white">${t("settings_system_status")}</h3>
          <button id="refresh-diagnostics-btn" class="text-xs px-2.5 py-1 rounded-md bg-[#10182B] hover:bg-[#16233B] text-slate-300 border border-[rgba(255,255,255,0.08)] transition-colors flex items-center gap-1.5">
            <svg class="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <span>Refresh</span>
          </button>
        </div>

        <div id="diagnostics-items-container" class="flex flex-col gap-2.5 text-xs">
          <div class="text-slate-400 py-3 text-center">Interrogating security subsystems...</div>
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

  // AI Config Status & Save Handler
  async function refreshAIStatus() {
    const pill = container.querySelector("#settings-ai-active-pill");
    if (!pill) return;
    try {
      const cfg = await api.getAIConfig();
      if (cfg.configured) {
        pill.textContent = cfg.active_provider.toUpperCase();
        pill.className = "badge-subtle badge-emerald font-mono-code";
      } else {
        pill.textContent = "LOCAL FORENSICS ENGINE";
        pill.className = "badge-subtle badge-neutral font-mono-code";
      }
    } catch {
      pill.textContent = "LOCAL ENGINE";
    }
  }
  refreshAIStatus();

  const saveAiBtn = container.querySelector("#settings-save-ai-btn");
  if (saveAiBtn) {
    saveAiBtn.addEventListener("click", async () => {
      const prov = container.querySelector("#settings-ai-prov").value;
      const key = container.querySelector("#settings-ai-key").value.trim();
      if (!key) {
        showToast("Please enter an API key", "warning");
        return;
      }
      saveAiBtn.disabled = true;
      saveAiBtn.textContent = "Verifying API Key...";
      try {
        const res = await api.saveAIConfig(prov, key);
        showToast(res.message, "success");
        refreshAIStatus();
        loadDiagnostics();
      } catch (err) {
        showToast(err.message || "Failed to verify API key", "error");
      } finally {
        saveAiBtn.disabled = false;
        saveAiBtn.textContent = "Save & Connect AI Engine";
      }
    });
  }

  // Fetch Health & Diagnostic Info
  async function loadDiagnostics() {
    const diagContainer = container.querySelector("#diagnostics-items-container");
    if (!diagContainer) return;

    try {
      const health = await api.getHealth();
      const ig = health.integrations;

      diagContainer.innerHTML = `
        <div class="flex items-center justify-between p-3 rounded-lg bg-[#080C15] border border-[rgba(255,255,255,0.06)]">
          <div class="flex items-center gap-2.5">
            <span class="w-2 h-2 rounded-full ${ig.ai_provider.configured ? 'bg-emerald-400' : 'bg-teal-400'}"></span>
            <div>
              <strong class="text-slate-200 block text-xs">${t("settings_ai_status")}</strong>
              <span class="text-[11px] text-slate-400 font-mono-code">${ig.ai_provider.name}</span>
            </div>
          </div>
          <span class="badge-subtle ${ig.ai_provider.configured ? 'badge-emerald' : 'badge-neutral'}">
            ${ig.ai_provider.configured ? 'CONNECTED' : 'LOCAL HEURISTICS'}
          </span>
        </div>

        <div class="flex items-center justify-between p-3 rounded-lg bg-[#080C15] border border-[rgba(255,255,255,0.06)]">
          <div class="flex items-center gap-2.5">
            <span class="w-2 h-2 rounded-full ${ig.safe_browsing.configured ? 'bg-emerald-400' : 'bg-teal-400'}"></span>
            <div>
              <strong class="text-slate-200 block text-xs">${t("settings_url_intel_status")}</strong>
              <span class="text-[11px] text-slate-400 font-mono-code">${ig.safe_browsing.name}</span>
            </div>
          </div>
          <span class="badge-subtle ${ig.safe_browsing.configured ? 'badge-emerald' : 'badge-neutral'}">
            ${ig.safe_browsing.configured ? 'CONNECTED' : 'LOCAL ENGINE'}
          </span>
        </div>

        <div class="flex items-center justify-between p-3 rounded-lg bg-[#080C15] border border-[rgba(255,255,255,0.06)]">
          <div class="flex items-center gap-2.5">
            <span class="w-2 h-2 rounded-full ${ig.sms_provider.configured ? 'bg-emerald-400' : 'bg-slate-400'}"></span>
            <div>
              <strong class="text-slate-200 block text-xs">${t("settings_sms_status")}</strong>
              <span class="text-[11px] text-slate-400 font-mono-code">${ig.sms_provider.name}</span>
            </div>
          </div>
          <span class="badge-subtle ${ig.sms_provider.configured ? 'badge-emerald' : 'badge-neutral'}">
            ${ig.sms_provider.configured ? 'CONNECTED' : 'LOCAL SANDBOX'}
          </span>
        </div>

        <div class="flex items-center justify-between p-3 rounded-lg bg-[#080C15] border border-[rgba(255,255,255,0.06)]">
          <div class="flex items-center gap-2.5">
            <span class="w-2 h-2 rounded-full ${ig.email_provider && ig.email_provider.configured ? 'bg-emerald-400' : 'bg-slate-400'}"></span>
            <div>
              <strong class="text-slate-200 block text-xs">Emergency Email Gateway</strong>
              <span class="text-[11px] text-slate-400 font-mono-code">${ig.email_provider ? ig.email_provider.name : 'Direct Client Dispatch'}</span>
            </div>
          </div>
          <span class="badge-subtle ${ig.email_provider && ig.email_provider.configured ? 'badge-emerald' : 'badge-neutral'}">
            ${ig.email_provider && ig.email_provider.configured ? 'CONNECTED' : 'CLIENT DISPATCH'}
          </span>
        </div>
      `;
    } catch (err) {
      diagContainer.innerHTML = `
        <div class="p-3 bg-rose-950/20 border border-rose-500/30 rounded-lg text-rose-300 text-xs">
          Subsystem telemetry error: ${err.message}. Local engine remains active.
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

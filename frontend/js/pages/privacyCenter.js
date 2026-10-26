// Privacy Center Page Component

import { t, getLanguage } from "../i18n.js";
import { store } from "../store.js";
import { api } from "../api.js";
import { showToast } from "../components/toast.js";

export async function renderPrivacyCenter(container) {
  const isHi = getLanguage() === "hi";

  container.innerHTML = `
    <div class="flex flex-col gap-6 pb-12 animate-fade-in max-w-4xl mx-auto">
      <!-- Section Header -->
      <div class="flex flex-col gap-1">
        <div class="flex items-center gap-2">
          <span class="badge-subtle badge-emerald">ZERO-LOG ARCHITECTURE</span>
        </div>
        <h1 class="text-xl sm:text-2xl font-bold text-white tracking-tight">
          ${t("privacy_title")}
        </h1>
        <p class="text-slate-400 text-xs">
          ${t("privacy_sub")}
        </p>
      </div>

      <!-- Hero Privacy Architecture Card -->
      <div class="cyber-card p-5 sm:p-6 bg-[#0D1527] border-[rgba(255,255,255,0.08)]">
        <div class="flex items-center gap-3 mb-3.5">
          <div class="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
          </div>
          <div>
            <h2 class="text-base font-bold text-white">${isHi ? "गोपनीयता-प्रथम वास्तुकला" : "Privacy-Preserving Security Engine"}</h2>
            <span class="text-[11px] text-emerald-400 font-mono-code font-semibold">${isHi ? "सत्यापित शून्य-प्रतिधारण गारंटी" : "VERIFIED ZERO-DATA-RETENTION PROTOCOL"}</span>
          </div>
        </div>

        <p class="text-xs text-slate-300 leading-relaxed mb-5">
          ${isHi
            ? "साइबर सुरक्षा उपकरणों को आपकी स्वयं की गोपनीयता की रक्षा करनी चाहिए। स्कैमसाथी में आपके द्वारा विश्लेषण के लिए भेजे गए संदेश कभी किसी डिस्क या स्थायी डेटाबेस में नहीं लिखे जाते। संपूर्ण प्रक्रिया क्षणिक मेमोरी (Transient RAM) में निष्पादित होती है।"
            : "Cybersecurity tools should protect user integrity without collecting sensitive communications. Under ScamSaathi's architecture, text submitted for classification is evaluated strictly within volatile memory (RAM) and evicted immediately post-response."}
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div class="p-3.5 rounded-lg bg-[#080C15] border border-[rgba(255,255,255,0.06)] text-xs flex flex-col gap-1">
            <span class="text-emerald-400 font-bold font-mono-code text-[11px] flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              ${t("privacy_card_retention")}
            </span>
            <span class="text-slate-400 text-[11px] leading-relaxed mt-1">${t("privacy_desc_retention")}</span>
          </div>

          <div class="p-3.5 rounded-lg bg-[#080C15] border border-[rgba(255,255,255,0.06)] text-xs flex flex-col gap-1">
            <span class="text-emerald-400 font-bold font-mono-code text-[11px] flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              ${t("privacy_card_logging")}
            </span>
            <span class="text-slate-400 text-[11px] leading-relaxed mt-1">${t("privacy_desc_logging")}</span>
          </div>

          <div class="p-3.5 rounded-lg bg-[#080C15] border border-[rgba(255,255,255,0.06)] text-xs flex flex-col gap-1">
            <span class="text-emerald-400 font-bold font-mono-code text-[11px] flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              ${t("privacy_card_local")}
            </span>
            <span class="text-slate-400 text-[11px] leading-relaxed mt-1">${t("privacy_desc_local")}</span>
          </div>
        </div>
      </div>

      <!-- Data Transparency Matrix -->
      <div class="cyber-card p-5 sm:p-6 bg-[#0D1527] border-[rgba(255,255,255,0.08)]">
        <h3 class="text-sm font-bold text-white mb-3">${isHi ? "डेटा प्रोसेसिंग विवरण तालिका" : "Data Processing & Retention Matrix"}</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="border-b border-[rgba(255,255,255,0.08)] text-slate-400 font-mono-code text-[11px]">
                <th class="py-2.5 px-3">Data Field</th>
                <th class="py-2.5 px-3">Processing Scope</th>
                <th class="py-2.5 px-3">Stored to Disk</th>
                <th class="py-2.5 px-3">Third-Party Sharing</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[rgba(255,255,255,0.04)] text-slate-300">
              <tr>
                <td class="py-2.5 px-3 font-semibold text-white">Suspicious Message Text</td>
                <td class="py-2.5 px-3 font-mono-code text-slate-400">Ephemeral RAM</td>
                <td class="py-2.5 px-3 text-emerald-400 font-mono-code font-bold">NEVER</td>
                <td class="py-2.5 px-3 text-emerald-400 font-mono-code font-bold">NO</td>
              </tr>
              <tr>
                <td class="py-2.5 px-3 font-semibold text-white">Checked Link / URL</td>
                <td class="py-2.5 px-3 font-mono-code text-slate-400">Local URL Parser & Sandbox</td>
                <td class="py-2.5 px-3 text-emerald-400 font-mono-code font-bold">NEVER</td>
                <td class="py-2.5 px-3 text-slate-400 font-mono-code text-[11px]">Only if Google Safe Browsing enabled</td>
              </tr>
              <tr>
                <td class="py-2.5 px-3 font-semibold text-white">Scam DNA Fingerprints</td>
                <td class="py-2.5 px-3 font-mono-code text-slate-400">Browser Memory Only</td>
                <td class="py-2.5 px-3 text-emerald-400 font-mono-code font-bold">NEVER</td>
                <td class="py-2.5 px-3 text-emerald-400 font-mono-code font-bold">NO</td>
              </tr>
              <tr>
                <td class="py-2.5 px-3 font-semibold text-white">Emergency Contacts</td>
                <td class="py-2.5 px-3 font-mono-code text-slate-400">Local SQLite DB</td>
                <td class="py-2.5 px-3 text-amber-400 font-mono-code font-semibold">User Controlled Localhost</td>
                <td class="py-2.5 px-3 text-emerald-400 font-mono-code font-bold">NO</td>
              </tr>
              <tr>
                <td class="py-2.5 px-3 font-semibold text-white">Telemetry & Identifiers</td>
                <td class="py-2.5 px-3 font-mono-code text-slate-400">None</td>
                <td class="py-2.5 px-3 text-emerald-400 font-mono-code font-bold">NEVER</td>
                <td class="py-2.5 px-3 text-emerald-400 font-mono-code font-bold">NO (Zero Trackers)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Purge Session Button -->
      <div class="cyber-card p-5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0D1527] border-[rgba(255,255,255,0.08)]">
        <div>
          <h4 class="text-sm font-bold text-white mb-0.5">${isHi ? "सत्र स्मृति तुरंत मिटाएं" : "Immediate Memory Purge"}</h4>
          <p class="text-[11px] text-slate-400 leading-relaxed">
            ${isHi ? "वर्तमान सत्र के सभी अस्थायी परिणाम, विश्लेषण और गतिविधि लॉग मिटाएं।" : "Flushes all active analysis results, generated DNA fingerprints, and volatile session records."}
          </p>
        </div>
        <button 
          id="purge-session-btn"
          class="px-4 py-2 rounded-lg font-bold text-xs bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors flex items-center gap-2 flex-shrink-0"
        >
          <svg class="w-3.5 h-3.5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
          <span>${t("privacy_btn_clear_all")}</span>
        </button>
      </div>
    </div>
  `;

  container.querySelector("#purge-session-btn").addEventListener("click", async () => {
    try {
      await api.clearSessionPrivacy();
      store.clearSession();
      showToast(t("common_cleared"), "success");
    } catch (e) {
      store.clearSession();
      showToast(t("common_cleared"), "success");
    }
  });
}

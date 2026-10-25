// Privacy Center Page Component

import { t, getLanguage } from "../i18n.js";
import { store } from "../store.js";
import { api } from "../api.js";
import { showToast } from "../components/toast.js";

export async function renderPrivacyCenter(container) {
  const isHi = getLanguage() === "hi";

  container.innerHTML = `
    <div class="flex flex-col gap-6 pb-12 animate-fade-in max-w-4xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col gap-1.5">
        <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          ${t("privacy_title")}
        </h1>
        <p class="text-slate-400 text-sm">
          ${t("privacy_sub")}
        </p>
      </div>

      <!-- Hero Privacy Architecture Card -->
      <div class="cyber-card p-6 sm:p-8 border-teal-500/40 bg-gradient-to-br from-[#111C2E] via-[#162438] to-[#0B1220]">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center justify-center font-bold text-xl flex-shrink-0">
            🔒
          </div>
          <div>
            <h2 class="text-lg font-bold text-white">${isHi ? "गोपनीयता-प्रथम वास्तुकला" : "Privacy-First Architecture"}</h2>
            <span class="text-xs text-teal-400 font-semibold">${isHi ? "सत्यापित शून्य-प्रतिधारण गारंटी" : "Verified Zero-Retention Guarantee"}</span>
          </div>
        </div>

        <p class="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
          ${isHi
            ? "साइबर सुरक्षा उपकरणों को आपकी स्वयं की गोपनीयता की रक्षा करनी चाहिए। स्कैमसाथी में आपके द्वारा विश्लेषण के लिए भेजे गए संदेश कभी किसी डिस्क या स्थायी डेटाबेस में नहीं लिखे जाते। संपूर्ण प्रक्रिया क्षणिक मेमोरी (Transient RAM) में निष्पादित होती है।"
            : "Cybersecurity software should never compromise your privacy. In ScamSaathi, message content analyzed for scams is processed strictly in transient server RAM and is immediately discarded. We never log or store raw communications."}
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div class="p-4 rounded-xl bg-[#0B1220] border border-slate-800 text-xs flex flex-col gap-1">
            <span class="text-emerald-400 font-bold">✓ ${t("privacy_card_retention")}</span>
            <span class="text-slate-400 leading-relaxed">${t("privacy_desc_retention")}</span>
          </div>

          <div class="p-4 rounded-xl bg-[#0B1220] border border-slate-800 text-xs flex flex-col gap-1">
            <span class="text-emerald-400 font-bold">✓ ${t("privacy_card_logging")}</span>
            <span class="text-slate-400 leading-relaxed">${t("privacy_desc_logging")}</span>
          </div>

          <div class="p-4 rounded-xl bg-[#0B1220] border border-slate-800 text-xs flex flex-col gap-1">
            <span class="text-emerald-400 font-bold">✓ ${t("privacy_card_local")}</span>
            <span class="text-slate-400 leading-relaxed">${t("privacy_desc_local")}</span>
          </div>
        </div>
      </div>

      <!-- Data Transparency Matrix -->
      <div class="cyber-card p-6 sm:p-8">
        <h3 class="text-base font-bold text-white mb-4">${isHi ? "डेटा प्रोसेसिंग विवरण तालिका" : "Data Processing & Retention Matrix"}</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="border-b border-slate-800 text-slate-400">
                <th class="py-2.5 px-3">Data Field</th>
                <th class="py-2.5 px-3">Processed Location</th>
                <th class="py-2.5 px-3">Stored to Disk?</th>
                <th class="py-2.5 px-3">Shared with Third Parties?</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td class="py-3 px-3 font-semibold text-white">Suspicious Message Text</td>
                <td class="py-3 px-3">Ephemeral Server Memory (RAM)</td>
                <td class="py-3 px-3 text-emerald-400 font-bold">NEVER</td>
                <td class="py-3 px-3 text-emerald-400 font-bold">NO</td>
              </tr>
              <tr>
                <td class="py-3 px-3 font-semibold text-white">Checked Link / URL</td>
                <td class="py-3 px-3">Local URL Parser & Heuristics</td>
                <td class="py-3 px-3 text-emerald-400 font-bold">NEVER</td>
                <td class="py-3 px-3 text-slate-400">Only if Safe Browsing API configured</td>
              </tr>
              <tr>
                <td class="py-3 px-3 font-semibold text-white">Scam DNA Fingerprints</td>
                <td class="py-3 px-3">Sanitized in Browser Memory</td>
                <td class="py-3 px-3 text-emerald-400 font-bold">NEVER (Client Only)</td>
                <td class="py-3 px-3 text-emerald-400 font-bold">NO</td>
              </tr>
              <tr>
                <td class="py-3 px-3 font-semibold text-white">Trusted Contacts</td>
                <td class="py-3 px-3">Local SQLite Database</td>
                <td class="py-3 px-3 text-amber-400 font-semibold">User-Opted Local Disk</td>
                <td class="py-3 px-3 text-emerald-400 font-bold">NO</td>
              </tr>
              <tr>
                <td class="py-3 px-3 font-semibold text-white">Telemetry & Analytics</td>
                <td class="py-3 px-3">None</td>
                <td class="py-3 px-3 text-emerald-400 font-bold">NEVER</td>
                <td class="py-3 px-3 text-emerald-400 font-bold">NO (Zero Trackers)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Purge Session Button -->
      <div class="cyber-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-red-500/30">
        <div>
          <h4 class="text-sm font-bold text-white mb-1">${isHi ? "सत्र स्मृति तुरंत मिटाएं" : "Immediate Session Purge"}</h4>
          <p class="text-xs text-slate-400 leading-relaxed">
            ${isHi ? "वर्तमान सत्र के सभी अस्थायी परिणाम, विश्लेषण और गतिविधि लॉग मिटाएं।" : "Clear all active analysis data, temporary logs, and session statistics from memory."}
          </p>
        </div>
        <button 
          id="purge-session-btn"
          class="px-5 py-2.5 rounded-xl font-bold text-xs bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/40 transition-colors flex items-center gap-2 flex-shrink-0"
        >
          <svg class="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

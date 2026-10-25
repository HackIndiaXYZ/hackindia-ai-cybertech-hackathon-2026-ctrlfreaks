// Safety Center & Emergency Assistance Page Component

import { t, getLanguage } from "../i18n.js";
import { store } from "../store.js";
import { showToast } from "../components/toast.js";

export function renderSafetyCenter(container) {
  const isHi = getLanguage() === "hi";

  container.innerHTML = `
    <div class="flex flex-col gap-6 pb-12 animate-fade-in max-w-5xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col gap-1.5">
        <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          ${t("safety_title")}
        </h1>
        <p class="text-slate-400 text-sm">
          ${t("safety_sub")}
        </p>
      </div>

      <!-- National Helpline 1930 Emergency Banner -->
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-950/60 via-slate-900 to-amber-950/40 border-2 border-red-500/60 p-6 sm:p-8 shadow-2xl">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div class="flex items-start gap-4">
            <div class="w-14 h-14 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/40 flex items-center justify-center font-extrabold text-2xl flex-shrink-0 animate-pulse-slow">
              🚨
            </div>
            <div>
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/20 text-red-300 border border-red-500/30 mb-1 inline-block">
                Emergency Resource • India
              </span>
              <h2 class="text-xl sm:text-2xl font-black text-white tracking-tight">${t("safety_helpline_banner")}</h2>
              <p class="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                ${t("safety_helpline_sub")}
              </p>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-3 self-start sm:self-center flex-shrink-0">
            <a 
              href="tel:1930" 
              class="px-5 py-3 rounded-xl font-bold text-xs bg-red-500 hover:bg-red-400 text-white transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              <span>Dial 1930</span>
            </a>
            <a 
              href="https://cybercrime.gov.in/" 
              target="_blank" 
              rel="noopener noreferrer"
              class="px-4 py-3 rounded-xl font-semibold text-xs bg-[#162438] hover:bg-[#1E314B] text-slate-200 border border-slate-700 transition-colors flex items-center justify-center gap-2"
            >
              <span>${t("safety_portal_btn")}</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
            </a>
          </div>
        </div>

        <div class="mt-4 pt-4 border-t border-red-500/20 text-[11px] text-slate-400">
          <strong>${isHi ? 'महत्वपूर्ण सूचना:' : 'Important Notice:'}</strong> ${isHi 
            ? 'स्कैमसाथी एक शैक्षिक व विश्लेषणात्मक उपकरण है। यह स्वयं पुलिस शिकायत दर्ज नहीं करता और न ही लेन-देन को फ्रीज करता है। आधिकारिक कार्रवाई के लिए 1930 पर तुरंत कॉल करें।'
            : 'ScamSaathi is an assistive analysis tool. It does not file police reports or freeze bank transactions on its own. For legal recourse or transaction freezing, call 1930 immediately.'}
        </div>
      </div>

      <!-- Action-Oriented Interactive Checklist -->
      <div class="cyber-card p-6 sm:p-8">
        <div class="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div>
            <h3 class="text-base font-bold text-white">${t("safety_checklist_title")}</h3>
            <span class="text-xs text-slate-400">${isHi ? 'कदम पूरा होने पर सही का निशान लगाएं' : 'Mark off protective steps as you complete them'}</span>
          </div>
          <span class="text-xs px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
            Interactive
          </span>
        </div>

        <div class="flex flex-col gap-3">
          <label class="flex items-start gap-3 p-3.5 rounded-xl bg-[#0B1220] border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors">
            <input type="checkbox" id="check-indep" class="w-4 h-4 mt-0.5 rounded text-emerald-500 focus:ring-emerald-400 border-slate-700 bg-[#162438]" ${store.safetyChecklist.msg_verify_independently ? 'checked' : ''}/>
            <div class="flex flex-col text-xs">
              <span class="font-bold text-slate-200">${isHi ? '1. प्रेषक की पहचान की स्वतंत्र रूप से पुष्टि करें' : '1. Verify sender identity independently'}</span>
              <span class="text-slate-400 mt-0.5">${isHi ? 'संदेश में दिए गए नंबर पर कॉल न करें। आधिकारिक बैंक ऐप या गूगल मैप्स पर प्रमाणित नंबर से संपर्क करें।' : 'Do not call numbers inside the message. Look up customer support on the verified official domain.'}</span>
            </div>
          </label>

          <label class="flex items-start gap-3 p-3.5 rounded-xl bg-[#0B1220] border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors">
            <input type="checkbox" id="check-no-otp" class="w-4 h-4 mt-0.5 rounded text-emerald-500 focus:ring-emerald-400 border-slate-700 bg-[#162438]" ${store.safetyChecklist.msg_no_otp_share ? 'checked' : ''}/>
            <div class="flex flex-col text-xs">
              <span class="font-bold text-slate-200">${isHi ? '2. ओटीपी, पासवर्ड या यूपीआई पिन कभी न दें' : '2. Strictly safeguard OTPs & UPI PIN'}</span>
              <span class="text-slate-400 mt-0.5">${isHi ? 'पैसे प्राप्त करने के लिए कभी पिन दर्ज करने की आवश्यकता नहीं होती। पिन केवल पैसे कटने पर ही मांगा जाता है।' : 'UPI PIN is solely for transferring money OUT of your account. You NEVER need a PIN to receive payments.'}</span>
            </div>
          </label>

          <label class="flex items-start gap-3 p-3.5 rounded-xl bg-[#0B1220] border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors">
            <input type="checkbox" id="check-block" class="w-4 h-4 mt-0.5 rounded text-emerald-500 focus:ring-emerald-400 border-slate-700 bg-[#162438]" ${store.safetyChecklist.msg_block_sender ? 'checked' : ''}/>
            <div class="flex flex-col text-xs">
              <span class="font-bold text-slate-200">${isHi ? '3. संदिग्ध नंबर या प्रेषक को ब्लॉक व रिपोर्ट करें' : '3. Block and report sender on device'}</span>
              <span class="text-slate-400 mt-0.5">${isHi ? 'व्हाट्सएप या एसएमएस ऐप में "Report & Block" चुनें ताकि टेलीकॉम स्पैम फ़िल्टर अपडेट हो सके।' : 'Use the native "Report Spam & Block" feature on your SMS/WhatsApp client to train community filters.'}</span>
            </div>
          </label>

          <label class="flex items-start gap-3 p-3.5 rounded-xl bg-[#0B1220] border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors">
            <input type="checkbox" id="check-report" class="w-4 h-4 mt-0.5 rounded text-emerald-500 focus:ring-emerald-400 border-slate-700 bg-[#162438]" ${store.safetyChecklist.msg_report_cybercrime ? 'checked' : ''}/>
            <div class="flex flex-col text-xs">
              <span class="font-bold text-slate-200">${isHi ? '4. यदि वित्तीय नुकसान हुआ है तो बैंक और 1930 पर रिपोर्ट करें' : '4. Report to Bank and 1930 if fraud occurred'}</span>
              <span class="text-slate-400 mt-0.5">${isHi ? 'बैंक से तुरंत खाता/कार्ड ब्लॉक करने का अनुरोध करें और पुलिस डायरी हेतु ट्रांजेक्शन नंबर नोट करें।' : 'Ask your bank to freeze compromised cards/UPI immediately and register complaint on cybercrime.gov.in.'}</span>
            </div>
          </label>
        </div>
      </div>

      <!-- Evidence Preservation Standards -->
      <div class="cyber-card p-6 sm:p-8">
        <h3 class="text-base font-bold text-white mb-3">${t("safety_evidence_title")}</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-4 rounded-xl bg-[#0B1220] border border-slate-800 text-xs flex flex-col gap-2">
            <span class="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center">1</span>
            <strong class="text-slate-200">${isHi ? "स्पष्ट स्क्रीनशॉट लें" : "Capture Clear Screenshots"}</strong>
            <p class="text-slate-400 leading-relaxed">${t("safety_evidence_p1")}</p>
          </div>

          <div class="p-4 rounded-xl bg-[#0B1220] border border-slate-800 text-xs flex flex-col gap-2">
            <span class="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center">2</span>
            <strong class="text-slate-200">${isHi ? "ट्रांजेक्शन UTR नंबर सहेजें" : "Save Transaction UTR"}</strong>
            <p class="text-slate-400 leading-relaxed">${t("safety_evidence_p2")}</p>
          </div>

          <div class="p-4 rounded-xl bg-[#0B1220] border border-slate-800 text-xs flex flex-col gap-2">
            <span class="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center">3</span>
            <strong class="text-slate-200">${isHi ? "चैट या कॉल हिस्ट्री न मिटाएं" : "Preserve Digital History"}</strong>
            <p class="text-slate-400 leading-relaxed">${t("safety_evidence_p3")}</p>
          </div>
        </div>
      </div>
    </div>
  `;

  // Checkbox event listeners
  container.querySelector("#check-indep").addEventListener("change", (e) => {
    store.safetyChecklist.msg_verify_independently = e.target.checked;
    showToast(isHi ? "चेकलिस्ट अपडेट हुई" : "Checklist updated", "info");
  });
  container.querySelector("#check-no-otp").addEventListener("change", (e) => {
    store.safetyChecklist.msg_no_otp_share = e.target.checked;
    showToast(isHi ? "चेकलिस्ट अपडेट हुई" : "Checklist updated", "info");
  });
  container.querySelector("#check-block").addEventListener("change", (e) => {
    store.safetyChecklist.msg_block_sender = e.target.checked;
    showToast(isHi ? "चेकलिस्ट अपडेट हुई" : "Checklist updated", "info");
  });
  container.querySelector("#check-report").addEventListener("change", (e) => {
    store.safetyChecklist.msg_report_cybercrime = e.target.checked;
    showToast(isHi ? "चेकलिस्ट अपडेट हुई" : "Checklist updated", "info");
  });
}

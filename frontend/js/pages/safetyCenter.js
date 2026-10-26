// Safety Center & Emergency Assistance Page Component

import { t, getLanguage } from "../i18n.js";
import { store } from "../store.js";
import { showToast } from "../components/toast.js";

export function renderSafetyCenter(container) {
  const isHi = getLanguage() === "hi";

  container.innerHTML = `
    <div class="flex flex-col gap-6 pb-12 animate-fade-in max-w-5xl mx-auto">
      <!-- Section Header -->
      <div class="flex flex-col gap-1">
        <div class="flex items-center gap-2">
          <span class="badge-subtle badge-rose">INCIDENT RESPONSE</span>
        </div>
        <h1 class="text-xl sm:text-2xl font-bold text-white tracking-tight">
          ${t("safety_title")}
        </h1>
        <p class="text-slate-400 text-xs">
          ${t("safety_sub")}
        </p>
      </div>

      <!-- National Helpline 1930 Emergency Console -->
      <div class="relative overflow-hidden rounded-xl bg-gradient-to-r from-rose-950/40 via-[#10182B] to-[#0A101C] border border-rose-500/40 p-6 sm:p-7 shadow-xl">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <div>
              <span class="badge-subtle badge-rose mb-1.5 inline-flex">
                GOVERNMENT OF INDIA • NATIONAL CYBER HELPLINE
              </span>
              <h2 class="text-lg sm:text-xl font-bold text-white tracking-tight">${t("safety_helpline_banner")}</h2>
              <p class="text-xs text-slate-300 mt-1 leading-relaxed max-w-xl">
                ${t("safety_helpline_sub")}
              </p>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-2.5 self-start sm:self-center flex-shrink-0">
            <a 
              href="tel:1930" 
              class="px-4 py-2.5 rounded-lg font-bold text-xs bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-sm flex items-center justify-center gap-2"
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
              class="px-4 py-2.5 rounded-lg font-semibold text-xs bg-[#10182B] hover:bg-[#16233B] text-slate-200 border border-[rgba(255,255,255,0.08)] transition-colors flex items-center justify-center gap-2"
            >
              <span>${t("safety_portal_btn")}</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
            </a>
          </div>
        </div>

        <div class="mt-4 pt-3.5 border-t border-[rgba(255,255,255,0.06)] text-[11px] text-slate-400">
          <strong class="text-slate-300 font-semibold">${isHi ? 'प्रोटोकॉल सूचना:' : 'Protocol Notice:'}</strong> ${isHi 
            ? 'स्कैमसाथी एक शैक्षिक व विश्लेषणात्मक उपकरण है। यह स्वयं पुलिस शिकायत दर्ज नहीं करता और न ही लेन-देन को फ्रीज करता है। आधिकारिक कार्रवाई के लिए 1930 पर तुरंत कॉल करें।'
            : 'ScamSaathi is an assistive analysis utility. It does not file official police FIRs or freeze banking transactions autonomously. For statutory intervention or payment holding, initiate contact with 1930.'}
        </div>
      </div>

      <!-- Action-Oriented Interactive Checklist -->
      <div class="cyber-card p-5 sm:p-6 bg-[#0D1527] border-[rgba(255,255,255,0.08)]">
        <div class="flex items-center justify-between pb-3.5 mb-3.5 border-b border-[rgba(255,255,255,0.08)]">
          <div>
            <h3 class="text-sm font-bold text-white">${t("safety_checklist_title")}</h3>
            <span class="text-[11px] text-slate-400">${isHi ? 'कदम पूरा होने पर सही का निशान लगाएं' : 'Systematic isolation procedure following suspicious contact'}</span>
          </div>
          <span class="badge-subtle badge-emerald">
            PROTOCOL CHECKLIST
          </span>
        </div>

        <div class="flex flex-col gap-2.5">
          <label class="flex items-start gap-3 p-3 rounded-lg bg-[#080C15] border border-[rgba(255,255,255,0.06)] hover:border-slate-600 cursor-pointer transition-colors">
            <input type="checkbox" id="check-indep" class="w-4 h-4 mt-0.5 rounded text-emerald-500 focus:ring-0 border-slate-700 bg-[#10182B]" ${store.safetyChecklist.msg_verify_independently ? 'checked' : ''}/>
            <div class="flex flex-col text-xs">
              <span class="font-semibold text-slate-200">${isHi ? '1. प्रेषक की पहचान की स्वतंत्र रूप से पुष्टि करें' : '1. Verify sender identity independently'}</span>
              <span class="text-slate-400 text-[11px] mt-0.5">${isHi ? 'संदेश में दिए गए नंबर पर कॉल न करें। आधिकारिक बैंक ऐप या प्रमाणित वेबसाइट से संपर्क करें।' : 'Do not dial phone numbers inside the communication. Reach out via verified customer care domains.'}</span>
            </div>
          </label>

          <label class="flex items-start gap-3 p-3 rounded-lg bg-[#080C15] border border-[rgba(255,255,255,0.06)] hover:border-slate-600 cursor-pointer transition-colors">
            <input type="checkbox" id="check-no-otp" class="w-4 h-4 mt-0.5 rounded text-emerald-500 focus:ring-0 border-slate-700 bg-[#10182B]" ${store.safetyChecklist.msg_no_otp_share ? 'checked' : ''}/>
            <div class="flex flex-col text-xs">
              <span class="font-semibold text-slate-200">${isHi ? '2. ओटीपी, पासवर्ड या यूपीआई पिन कभी न दें' : '2. Strictly safeguard OTPs & UPI PIN'}</span>
              <span class="text-slate-400 text-[11px] mt-0.5">${isHi ? 'पैसे प्राप्त करने के लिए कभी पिन दर्ज करने की आवश्यकता नहीं होती। पिन केवल पैसे कटने पर ही मांगा जाता है।' : 'UPI PIN is strictly required for debits. Receiving refunds or prize money never requires entering a security PIN.'}</span>
            </div>
          </label>

          <label class="flex items-start gap-3 p-3 rounded-lg bg-[#080C15] border border-[rgba(255,255,255,0.06)] hover:border-slate-600 cursor-pointer transition-colors">
            <input type="checkbox" id="check-block" class="w-4 h-4 mt-0.5 rounded text-emerald-500 focus:ring-0 border-slate-700 bg-[#10182B]" ${store.safetyChecklist.msg_block_sender ? 'checked' : ''}/>
            <div class="flex flex-col text-xs">
              <span class="font-semibold text-slate-200">${isHi ? '3. संदिग्ध नंबर या प्रेषक को ब्लॉक व रिपोर्ट करें' : '3. Block and report sender on device'}</span>
              <span class="text-slate-400 text-[11px] mt-0.5">${isHi ? 'व्हाट्सएप या एसएमएस ऐप में "Report & Block" चुनें ताकि टेलीकॉम स्पैम फ़िल्टर अपडेट हो सके।' : 'Utilize native "Report Spam & Block" on telecom/chat clients to reinforce community intelligence.'}</span>
            </div>
          </label>

          <label class="flex items-start gap-3 p-3 rounded-lg bg-[#080C15] border border-[rgba(255,255,255,0.06)] hover:border-slate-600 cursor-pointer transition-colors">
            <input type="checkbox" id="check-report" class="w-4 h-4 mt-0.5 rounded text-emerald-500 focus:ring-0 border-slate-700 bg-[#10182B]" ${store.safetyChecklist.msg_report_cybercrime ? 'checked' : ''}/>
            <div class="flex flex-col text-xs">
              <span class="font-semibold text-slate-200">${isHi ? '4. यदि वित्तीय नुकसान हुआ है तो बैंक और 1930 पर रिपोर्ट करें' : '4. Report to Bank and 1930 if fraud occurred'}</span>
              <span class="text-slate-400 text-[11px] mt-0.5">${isHi ? 'बैंक से तुरंत खाता/कार्ड ब्लॉक करने का अनुरोध करें और पुलिस डायरी हेतु ट्रांजेक्शन नंबर नोट करें।' : 'Direct bank to freeze compromised payment vectors immediately and retain UTR reference codes.'}</span>
            </div>
          </label>
        </div>
      </div>

      <!-- Evidence Preservation Standards -->
      <div class="cyber-card p-5 sm:p-6 bg-[#0D1527] border-[rgba(255,255,255,0.08)]">
        <h3 class="text-sm font-bold text-white mb-3">${t("safety_evidence_title")}</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div class="p-3.5 rounded-lg bg-[#080C15] border border-[rgba(255,255,255,0.06)] text-xs flex flex-col gap-1.5">
            <span class="w-6 h-6 rounded bg-emerald-500/10 text-emerald-400 font-mono-code font-bold text-xs flex items-center justify-center">01</span>
            <strong class="text-slate-200 font-semibold">${isHi ? "स्पष्ट स्क्रीनशॉट लें" : "Capture Forensic Screenshots"}</strong>
            <p class="text-slate-400 text-[11px] leading-relaxed">${t("safety_evidence_p1")}</p>
          </div>

          <div class="p-3.5 rounded-lg bg-[#080C15] border border-[rgba(255,255,255,0.06)] text-xs flex flex-col gap-1.5">
            <span class="w-6 h-6 rounded bg-emerald-500/10 text-emerald-400 font-mono-code font-bold text-xs flex items-center justify-center">02</span>
            <strong class="text-slate-200 font-semibold">${isHi ? "ट्रांजेक्शन UTR नंबर सहेजें" : "Retain Transaction UTR"}</strong>
            <p class="text-slate-400 text-[11px] leading-relaxed">${t("safety_evidence_p2")}</p>
          </div>

          <div class="p-3.5 rounded-lg bg-[#080C15] border border-[rgba(255,255,255,0.06)] text-xs flex flex-col gap-1.5">
            <span class="w-6 h-6 rounded bg-emerald-500/10 text-emerald-400 font-mono-code font-bold text-xs flex items-center justify-center">03</span>
            <strong class="text-slate-200 font-semibold">${isHi ? "चैट या कॉल हिस्ट्री न मिटाएं" : "Preserve Digital Trail"}</strong>
            <p class="text-slate-400 text-[11px] leading-relaxed">${t("safety_evidence_p3")}</p>
          </div>
        </div>
      </div>
    </div>
  `;

  // Checkbox event listeners
  container.querySelector("#check-indep").addEventListener("change", (e) => {
    store.safetyChecklist.msg_verify_independently = e.target.checked;
    showToast(isHi ? "चेकलिस्ट स्थिति अपडेट हुई" : "Checklist status updated", "info");
  });
  container.querySelector("#check-no-otp").addEventListener("change", (e) => {
    store.safetyChecklist.msg_no_otp_share = e.target.checked;
    showToast(isHi ? "चेकलिस्ट स्थिति अपडेट हुई" : "Checklist status updated", "info");
  });
  container.querySelector("#check-block").addEventListener("change", (e) => {
    store.safetyChecklist.msg_block_sender = e.target.checked;
    showToast(isHi ? "चेकलिस्ट स्थिति अपडेट हुई" : "Checklist status updated", "info");
  });
  container.querySelector("#check-report").addEventListener("change", (e) => {
    store.safetyChecklist.msg_report_cybercrime = e.target.checked;
    showToast(isHi ? "चेकलिस्ट स्थिति अपडेट हुई" : "Checklist status updated", "info");
  });
}

// "Pause Before You Act" Intervention Modal

import { t, getLanguage } from "../i18n.js";

export function showPauseModal(customMessage = null, onDismiss = null) {
  const isHi = getLanguage() === "hi";

  const existing = document.getElementById("pause-intervention-modal");
  if (existing) existing.remove();

  const title = isHi ? "रुकें! कोई जल्दबाजी न करें (Pause Before You Act)" : "Pause Before You Act";
  const defaultBody = isHi 
    ? "इस संदेश में उच्च दबाव या भय के गंभीर संकेत हैं। कृपया कुछ क्षण शांत रहें। कोई भी बैंक या पुलिस अधिकारी तुरंत निर्णय लेने या वीडियो कॉल पर रहने को बाध्य नहीं करता। किसी के साथ भी ओटीपी या यूपीआई पिन साझा न करें।"
    : "High psychological pressure detected. You do NOT need to act immediately. Legitimate institutions will never demand rushed decisions, ask for an OTP, or order you to remain on a secretive video call.";

  const bodyText = customMessage || defaultBody;

  const modal = document.createElement("div");
  modal.id = "pause-intervention-modal";
  modal.className = "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in";
  
  modal.innerHTML = `
    <div class="relative w-full max-w-lg p-6 rounded-2xl bg-[#0D1424] border border-amber-500/40 shadow-2xl text-left">
      <!-- Top banner / warning icon -->
      <div class="flex items-center gap-3.5 mb-4">
        <div class="flex items-center justify-center w-11 h-11 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        </div>
        <div>
          <span class="badge-subtle badge-amber mb-1">
            ${isHi ? "मनोवैज्ञानिक हस्तक्षेप" : "BEHAVIORAL INTERVENTION"}
          </span>
          <h3 class="text-lg font-bold text-white tracking-tight">${title}</h3>
        </div>
      </div>

      <div class="p-3.5 rounded-xl bg-[#080C15] border border-[rgba(255,255,255,0.06)] mb-5">
        <p class="text-slate-200 text-xs sm:text-sm leading-relaxed">${bodyText}</p>
      </div>

      <!-- Key safety checklist pills -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5 text-xs text-slate-300">
        <div class="flex items-center gap-2 p-2.5 rounded-lg bg-[#111A2E] border border-[rgba(255,255,255,0.06)]">
          <span class="text-emerald-400 font-bold">•</span>
          <span>${isHi ? "कॉल तुरंत डिस्कनेक्ट करें" : "End the call if pressured"}</span>
        </div>
        <div class="flex items-center gap-2 p-2.5 rounded-lg bg-[#111A2E] border border-[rgba(255,255,255,0.06)]">
          <span class="text-emerald-400 font-bold">•</span>
          <span>${isHi ? "ओटीपी या पिन कभी न दें" : "Never share OTP or UPI PIN"}</span>
        </div>
        <div class="flex items-center gap-2 p-2.5 rounded-lg bg-[#111A2E] border border-[rgba(255,255,255,0.06)]">
          <span class="text-emerald-400 font-bold">•</span>
          <span>${isHi ? "स्वतंत्र रूप से पुष्टि करें" : "Verify via official website"}</span>
        </div>
        <div class="flex items-center gap-2 p-2.5 rounded-lg bg-[#111A2E] border border-[rgba(255,255,255,0.06)]">
          <span class="text-emerald-400 font-bold">•</span>
          <span>${isHi ? "विश्वसनीय व्यक्ति से बात करें" : "Consult a trusted person"}</span>
        </div>
      </div>

      <!-- Action button -->
      <div class="flex justify-end">
        <button id="pause-modal-dismiss-btn" class="w-full sm:w-auto px-5 py-2 rounded-lg font-semibold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors shadow-sm">
          ${isHi ? "मैं समझ गया, रिपोर्ट देखें" : "I Understand — Proceed to Report"}
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const dismissBtn = modal.querySelector("#pause-modal-dismiss-btn");
  dismissBtn.addEventListener("click", () => {
    modal.remove();
    if (onDismiss) onDismiss();
  });
}

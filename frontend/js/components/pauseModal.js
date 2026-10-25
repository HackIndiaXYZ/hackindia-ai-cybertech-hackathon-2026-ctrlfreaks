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
  modal.className = "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in";
  
  modal.innerHTML = `
    <div class="relative w-full max-w-lg p-6 rounded-2xl bg-[#111C2E] border-2 border-amber-500/80 shadow-2xl text-left transform transition-all">
      <!-- Top banner / warning icon -->
      <div class="flex items-center gap-4 mb-4">
        <div class="flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse-slow flex-shrink-0">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div>
          <span class="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-1">
            ${isHi ? "मनोवैज्ञानिक हस्तक्षेप" : "Behavioral Intervention"}
          </span>
          <h3 class="text-xl font-bold text-white tracking-tight">${title}</h3>
        </div>
      </div>

      <div class="p-4 rounded-xl bg-[#0B1220] border border-slate-700/60 mb-6">
        <p class="text-slate-200 text-sm leading-relaxed">${bodyText}</p>
      </div>

      <!-- Key safety checklist pills -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6 text-xs text-slate-300">
        <div class="flex items-center gap-2 p-2.5 rounded-lg bg-[#162438] border border-slate-700">
          <span class="text-emerald-400 font-bold text-base">✓</span>
          <span>${isHi ? "कॉल तुरंत डिस्कनेक्ट करें" : "End the call if pressured"}</span>
        </div>
        <div class="flex items-center gap-2 p-2.5 rounded-lg bg-[#162438] border border-slate-700">
          <span class="text-emerald-400 font-bold text-base">✓</span>
          <span>${isHi ? "ओटीपी या पिन कभी न दें" : "Never share OTP or UPI PIN"}</span>
        </div>
        <div class="flex items-center gap-2 p-2.5 rounded-lg bg-[#162438] border border-slate-700">
          <span class="text-emerald-400 font-bold text-base">✓</span>
          <span>${isHi ? "स्वतंत्र रूप से पुष्टि करें" : "Verify via official website"}</span>
        </div>
        <div class="flex items-center gap-2 p-2.5 rounded-lg bg-[#162438] border border-slate-700">
          <span class="text-emerald-400 font-bold text-base">✓</span>
          <span>${isHi ? "विश्वसनीय व्यक्ति से बात करें" : "Consult a trusted person"}</span>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="flex flex-col sm:flex-row items-center justify-end gap-3">
        <button id="pause-modal-dismiss-btn" class="w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors shadow-lg shadow-emerald-500/20">
          ${isHi ? "मैं समझ गया, अब रिपोर्ट देखें" : "I Understand — Continue to Report"}
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

// Trusted Contacts & Consent-Based SOS Page Component

import { t, getLanguage } from "../i18n.js";
import { store } from "../store.js";
import { api } from "../api.js";
import { showToast } from "../components/toast.js";

let contactsList = [];
let sosStatusBanner = null;

export async function renderTrustedContacts(container) {
  const isHi = getLanguage() === "hi";

  container.innerHTML = `
    <div class="flex flex-col gap-6 pb-12 animate-fade-in max-w-5xl mx-auto">
      <!-- Section Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex flex-col gap-1">
          <div class="flex items-center gap-2">
            <span class="badge-subtle badge-rose">EMERGENCY SOS NETWORK</span>
          </div>
          <h1 class="text-xl sm:text-2xl font-bold text-white tracking-tight">
            ${t("contacts_title")}
          </h1>
          <p class="text-slate-400 text-xs">
            ${t("contacts_sub")}
          </p>
        </div>

        <button 
          id="trigger-sos-btn"
          class="self-start sm:self-auto px-5 py-2.5 rounded-lg font-bold text-xs bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-lg shadow-rose-600/25 flex items-center gap-2 animate-pulse"
        >
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          <span>${t("contacts_sos_btn")}</span>
        </button>
      </div>

      <!-- SOS Status Alert Banner (if recently triggered) -->
      <div id="sos-status-area" class="${sosStatusBanner ? '' : 'hidden'}">
        ${sosStatusBanner || ''}
      </div>

      <!-- How Dispatch Works & Setup Info -->
      <div class="p-4 rounded-xl bg-[#0D1527] border border-[rgba(255,255,255,0.08)] flex flex-col gap-3 text-xs">
        <div class="flex items-start gap-3">
          <div class="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="flex-1">
            <div class="flex items-center justify-between mb-1">
              <strong class="text-white text-xs">${isHi ? 'SOS संदेश भेजने की दोहरी प्रणाली (Dual Dispatch Protocol):' : 'Dual Dispatch Protocol (Direct Device + Backend Gateway):'}</strong>
              <button id="toggle-config-guide-btn" class="text-[11px] text-teal-400 hover:text-teal-300 underline font-medium">
                ${isHi ? 'कॉन्फ़िगरेशन गाइड देखें' : 'Setup Guide (.env)'}
              </button>
            </div>
            <p class="text-slate-400 text-[11px] leading-relaxed">
              ${isHi 
                ? '१. <strong>1-क्लिक डायरेक्ट डिवाइस:</strong> बिना किसी API key के WhatsApp, Phone SMS और Email app तुरंत खुलते हैं।<br/>२. <strong>ऑटोमेटेड बैकएंड:</strong> .env में Gmail (SMTP) या Twilio सेट करने पर बैकएंड सर्वर से स्वतः असली ईमेल व एसएमएस भेजे जाते हैं।'
                : '1. <strong>Direct 1-Click Dispatch:</strong> Opens WhatsApp, SMS app, and Mail client directly from your device with zero API keys required.<br/>2. <strong>Automated Server Gateway:</strong> Configure your Gmail App Password (SMTP) or Twilio in <code class="text-slate-200 bg-[#080C15] px-1 py-0.5 rounded">.env</code> for 100% automated background email/SMS dispatch.'}
            </p>
          </div>
        </div>

        <!-- Hidden Config Instructions Collapsible -->
        <div id="config-guide-container" class="hidden mt-2 p-3.5 rounded-lg bg-[#080C15] border border-[rgba(255,255,255,0.06)] text-[11px] text-slate-300 font-mono-code leading-relaxed">
          <div class="text-emerald-400 font-bold mb-2"># How to enable Automated Real Email via Gmail:</div>
          <div class="text-slate-400 mb-2">Create or edit <strong class="text-white">.env</strong> in project root:</div>
          <div class="bg-[#10182B] p-2.5 rounded text-teal-300 mb-3 select-all">
SMTP_HOST=smtp.gmail.com<br/>
SMTP_PORT=587<br/>
SMTP_USER=youremail@gmail.com<br/>
SMTP_PASSWORD=your-16-char-app-password<br/>
<br/>
# For Real Twilio SMS (Optional):<br/>
TWILIO_ACCOUNT_SID=your_sid<br/>
TWILIO_AUTH_TOKEN=your_token<br/>
TWILIO_PHONE_NUMBER=+1234567890
          </div>
          <div class="text-slate-400 text-[10px]">
            * Note: To generate Gmail App Password, go to Google Account -> Security -> 2-Step Verification -> App Passwords.
          </div>
        </div>
      </div>

      <!-- Trusted Contacts Manager Card -->
      <div class="cyber-card p-5 sm:p-6 bg-[#0D1527] border-[rgba(255,255,255,0.08)]">
        <div class="flex items-center justify-between pb-3.5 mb-3.5 border-b border-[rgba(255,255,255,0.08)]">
          <div>
            <h2 class="text-sm font-bold text-white">${t("contacts_list_title")}</h2>
            <span class="text-[11px] text-slate-400">${isHi ? 'संदिग्ध कॉल या दबाव के समय सहायता हेतु विश्वसनीय व्यक्ति' : 'Designated guardians notified during suspected coercion'}</span>
          </div>
          <button 
            id="show-add-contact-btn"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/25 transition-colors"
          >
            ${t("contacts_add_btn")}
          </button>
        </div>

        <!-- Add Contact Form (Toggleable) -->
        <div id="add-contact-form-container" class="hidden mb-5 p-4 rounded-lg bg-[#080C15] border border-[rgba(255,255,255,0.08)]">
          <h3 class="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3 font-mono-code">Add Trusted Guardian</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label class="text-[11px] text-slate-400 block mb-1">${t("contacts_name")} *</label>
              <input id="new-contact-name" type="text" class="w-full p-2.5 rounded-lg bg-[#10182B] border border-[rgba(255,255,255,0.08)] text-white text-xs" placeholder="e.g. Ramesh Kumar"/>
            </div>
            <div>
              <label class="text-[11px] text-slate-400 block mb-1">${t("contacts_relation")} *</label>
              <input id="new-contact-relation" type="text" class="w-full p-2.5 rounded-lg bg-[#10182B] border border-[rgba(255,255,255,0.08)] text-white text-xs" placeholder="e.g. Family, Son, Lawyer"/>
            </div>
            <div>
              <label class="text-[11px] text-slate-400 block mb-1">${t("contacts_phone")} (For SMS / WhatsApp)</label>
              <input id="new-contact-phone" type="text" class="w-full p-2.5 rounded-lg bg-[#10182B] border border-[rgba(255,255,255,0.08)] text-white text-xs font-mono-code" placeholder="+91 98765 43210"/>
            </div>
            <div>
              <label class="text-[11px] text-slate-400 block mb-1">${t("contacts_email")} (For Email Alert)</label>
              <input id="new-contact-email" type="email" class="w-full p-2.5 rounded-lg bg-[#10182B] border border-[rgba(255,255,255,0.08)] text-white text-xs" placeholder="guardian@example.com"/>
            </div>
          </div>
          <div class="flex justify-end gap-2">
            <button id="cancel-add-contact-btn" class="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white">
              Cancel
            </button>
            <button id="save-contact-btn" class="px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors">
              ${t("contacts_save_btn")}
            </button>
          </div>
        </div>

        <!-- Contacts Table / List -->
        <div id="contacts-list-container" class="flex flex-col gap-2.5">
          <div class="text-xs text-slate-400 py-4 text-center">Querying registered contacts...</div>
        </div>
      </div>
    </div>
  `;

  // Toggle Config Guide
  const guideBtn = container.querySelector("#toggle-config-guide-btn");
  const guideBox = container.querySelector("#config-guide-container");
  if (guideBtn && guideBox) {
    guideBtn.addEventListener("click", () => {
      guideBox.classList.toggle("hidden");
    });
  }

  // Fetch contacts from backend
  try {
    contactsList = await api.getContacts();
    renderContactsList(container);
  } catch (err) {
    showToast(err.message || "Failed to load contacts", "error");
  }

  // Toggle Add Form
  const formContainer = container.querySelector("#add-contact-form-container");
  container.querySelector("#show-add-contact-btn").addEventListener("click", () => {
    formContainer.classList.toggle("hidden");
  });
  container.querySelector("#cancel-add-contact-btn").addEventListener("click", () => {
    formContainer.classList.add("hidden");
  });

  // Save Contact
  container.querySelector("#save-contact-btn").addEventListener("click", async () => {
    const name = container.querySelector("#new-contact-name").value.trim();
    const relation = container.querySelector("#new-contact-relation").value.trim();
    const phone = container.querySelector("#new-contact-phone").value.trim();
    const email = container.querySelector("#new-contact-email").value.trim();

    if (!name || !relation) {
      showToast(isHi ? "कृपया नाम और संबंध दोनों दर्ज करें।" : "Name and relationship are required.", "warning");
      return;
    }

    try {
      await api.addContact({ name, relationship: relation, phone, email });
      showToast(isHi ? "संपर्क सफलतापूर्वक जोड़ा गया!" : "Trusted contact saved successfully.", "success");
      formContainer.classList.add("hidden");
      contactsList = await api.getContacts();
      renderContactsList(container);
    } catch (err) {
      showToast(err.message || "Failed to save contact", "error");
    }
  });

  // Trigger SOS button click
  container.querySelector("#trigger-sos-btn").addEventListener("click", async () => {
    try {
      const preview = await api.previewSOS({ language: isHi ? "hi" : "en" });
      showSOSConfirmationModal(preview, isHi, container);
    } catch (err) {
      showToast(err.message || "Could not prepare SOS preview", "error");
    }
  });
}

function renderContactsList(container) {
  const listContainer = container.querySelector("#contacts-list-container");
  if (!listContainer) return;

  if (contactsList.length === 0) {
    listContainer.innerHTML = `
      <div class="p-6 text-center text-xs text-slate-400 bg-[#080C15] rounded-lg border border-[rgba(255,255,255,0.06)]">
        ${t("contacts_empty")}
      </div>
    `;
    return;
  }

  const defaultMsg = encodeURIComponent("ScamSaathi Safety Alert: I may need your assistance verifying a suspicious message or call. Please reach out to me directly.");
  const defaultSub = encodeURIComponent("ScamSaathi Safety Alert");

  listContainer.innerHTML = contactsList.map(c => {
    const cleanPhone = (c.phone || "").replace(/[^\d+]/g, "");
    const waPhone = cleanPhone.startsWith("+") ? cleanPhone.slice(1) : (cleanPhone.length === 10 ? "91" + cleanPhone : cleanPhone);
    const waUrl = c.phone ? `https://api.whatsapp.com/send?phone=${waPhone}&text=${defaultMsg}` : "";
    const smsUrl = c.phone ? `sms:${c.phone}?body=${defaultMsg}` : "";
    const mailtoUrl = c.email ? `mailto:${c.email}?subject=${defaultSub}&body=${defaultMsg}` : "";

    return `
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 rounded-lg bg-[#080C15] border border-[rgba(255,255,255,0.06)] text-xs">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold flex items-center justify-center flex-shrink-0 text-xs font-mono-code">
            ${c.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-bold text-white text-xs">${c.name}</span>
              <span class="badge-subtle badge-neutral text-[10px]">${c.relationship}</span>
            </div>
            <div class="flex flex-wrap items-center gap-3 mt-1 text-slate-400 text-[11px]">
              ${c.phone ? `<span class="font-mono-code text-slate-300 flex items-center gap-1"><svg class="w-3 h-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>${c.phone}</span>` : ''}
              ${c.email ? `<span class="text-slate-400 flex items-center gap-1"><svg class="w-3 h-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>${c.email}</span>` : ''}
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 self-end md:self-center">
          ${waUrl ? `
            <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="px-2.5 py-1 rounded text-[11px] font-medium bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/25 transition-colors flex items-center gap-1" title="Send WhatsApp Message">
              <span>WhatsApp</span>
            </a>
          ` : ''}
          ${mailtoUrl ? `
            <a href="${mailtoUrl}" class="px-2.5 py-1 rounded text-[11px] font-medium bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/25 transition-colors flex items-center gap-1" title="Send Direct Email">
              <span>Email</span>
            </a>
          ` : ''}
          ${smsUrl ? `
            <a href="${smsUrl}" class="px-2.5 py-1 rounded text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors" title="Send Direct SMS">
              <span>SMS</span>
            </a>
          ` : ''}
          <button 
            data-del-id="${c.id}"
            class="px-2 py-1 rounded text-[11px] font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
    `;
  }).join("");

  // Attach delete handlers
  listContainer.querySelectorAll("button[data-del-id]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = parseInt(btn.getAttribute("data-del-id"), 10);
      if (confirm(getLanguage() === "hi" ? "क्या आप इस संपर्क को हटाना चाहते हैं?" : "Remove this trusted contact?")) {
        try {
          await api.deleteContact(id);
          contactsList = await api.getContacts();
          renderContactsList(container);
          showToast(getLanguage() === "hi" ? "संपर्क हटा दिया गया।" : "Contact removed.", "info");
        } catch (e) {
          showToast(e.message || "Failed to delete contact", "error");
        }
      }
    });
  });
}

function showSOSConfirmationModal(preview, isHi, parentContainer) {
  const existing = document.getElementById("sos-confirm-modal");
  if (existing) existing.remove();

  const modal = document.createElement("div");
  modal.id = "sos-confirm-modal";
  modal.className = "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in";

  modal.innerHTML = `
    <div class="relative w-full max-w-lg p-6 rounded-xl bg-[#0D1527] border border-rose-500/40 shadow-2xl text-left">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-10 h-10 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/25 flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        </div>
        <div>
          <h3 class="text-base font-bold text-white">${t("contacts_modal_sos_title")}</h3>
          <span class="badge-subtle badge-rose font-mono-code text-[10px]">CHANNELS: ${preview.provider_mode}</span>
        </div>
      </div>

      <p class="text-xs text-slate-300 leading-relaxed mb-4">
        ${t("contacts_modal_sos_warning")}
      </p>

      <!-- Alert Preview Bubble -->
      <div class="p-3.5 rounded-lg bg-[#080C15] border border-[rgba(255,255,255,0.08)] text-xs text-slate-200 leading-relaxed font-mono-code mb-4">
        <strong class="text-emerald-400 block mb-1 text-[11px] uppercase tracking-wider">Outbound Safety Message:</strong>
        "${preview.preview_message}"
      </div>

      <div class="flex items-center justify-between text-xs text-slate-400 mb-5 bg-[#10182B] p-3 rounded-lg border border-[rgba(255,255,255,0.06)]">
        <span>Recipients queued: <strong class="text-white font-mono-code">${preview.recipient_count} Contact(s)</strong></span>
        <span class="text-[11px] text-emerald-400 font-semibold">100% PII Sanitized</span>
      </div>

      <div class="flex flex-col sm:flex-row items-center justify-end gap-2.5">
        <button id="sos-modal-cancel" class="w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-[#10182B] hover:bg-[#16233B] border border-[rgba(255,255,255,0.08)] transition-colors">
          ${t("contacts_modal_cancel_btn")}
        </button>
        <button id="sos-modal-confirm" class="w-full sm:w-auto px-5 py-2 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition-colors shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2">
          <span>Authorize & Dispatch SOS</span>
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector("#sos-modal-cancel").addEventListener("click", () => modal.remove());

  modal.querySelector("#sos-modal-confirm").addEventListener("click", async () => {
    modal.remove();
    try {
      const resp = await api.triggerSOS({
        confirmed: true,
        language: isHi ? "hi" : "en"
      });

      const links = resp.action_links || [];
      const channels = resp.channels_dispatched || {};

      let emailStatusText = channels.email ? (channels.email.success ? `<span class="text-emerald-400 font-bold">✓ Email Sent: ${channels.email.detail}</span>` : `<span class="text-amber-400">${channels.email.detail}</span>`) : "";
      let smsStatusText = channels.sms ? (channels.sms.success ? `<span class="text-emerald-400 font-bold">✓ Twilio SMS Sent: ${channels.sms.detail}</span>` : `<span class="text-amber-400">${channels.sms.detail}</span>`) : "";

      sosStatusBanner = `
        <div class="p-5 rounded-xl bg-[#0D1527] border border-rose-500/50 text-slate-200 text-xs flex flex-col gap-3 shadow-xl">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[rgba(255,255,255,0.08)]">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span class="font-bold text-sm text-white">${isHi ? "अलर्ट निष्पादन रिपोर्ट (SOS Dispatch Hub)" : "SOS Alert Dispatch Hub"}</span>
            </div>
            <span class="text-[10px] text-slate-400 font-mono-code">${resp.timestamp}</span>
          </div>

          <div class="bg-[#080C15] p-3 rounded-lg border border-[rgba(255,255,255,0.06)] flex flex-col gap-1.5 text-[11px] leading-relaxed">
            <div class="text-slate-300">${resp.notice}</div>
            ${emailStatusText ? `<div class="font-mono-code mt-1">${emailStatusText}</div>` : ''}
            ${smsStatusText ? `<div class="font-mono-code">${smsStatusText}</div>` : ''}
          </div>

          <!-- Direct Instant Action Links -->
          ${links.length > 0 ? `
            <div class="mt-1">
              <div class="text-[11px] font-bold uppercase tracking-wider text-teal-400 mb-2">
                ${isHi ? 'तुरंत संपर्क साधें (1-Click Action per Guardian):' : 'Instant Device Dispatch Links:'}
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                ${links.map(l => `
                  <div class="p-3 rounded-lg bg-[#10182B] border border-[rgba(255,255,255,0.06)] flex flex-col justify-between gap-2">
                    <div>
                      <div class="font-bold text-white text-xs">${l.name} <span class="text-slate-400 font-normal">(${l.relationship})</span></div>
                      <div class="text-[11px] text-slate-400 font-mono-code mt-0.5">${l.phone || ''} ${l.email ? `• ${l.email}` : ''}</div>
                    </div>
                    <div class="flex items-center gap-2 pt-1 border-t border-[rgba(255,255,255,0.06)]">
                      ${l.whatsapp_url ? `
                        <a href="${l.whatsapp_url}" target="_blank" rel="noopener noreferrer" class="px-2.5 py-1 rounded text-[11px] font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors flex items-center gap-1">
                          <span>WhatsApp</span>
                        </a>
                      ` : ''}
                      ${l.mailto_url ? `
                        <a href="${l.mailto_url}" class="px-2.5 py-1 rounded text-[11px] font-bold bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/30 transition-colors flex items-center gap-1">
                          <span>Email</span>
                        </a>
                      ` : ''}
                      ${l.sms_url ? `
                        <a href="${l.sms_url}" class="px-2 py-1 rounded text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors">
                          <span>SMS</span>
                        </a>
                      ` : ''}
                    </div>
                  </div>
                `).join("")}
              </div>
            </div>
          ` : ''}
        </div>
      `;

      const statusArea = parentContainer.querySelector("#sos-status-area");
      if (statusArea) {
        statusArea.innerHTML = sosStatusBanner;
        statusArea.classList.remove("hidden");
        statusArea.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      showToast(isHi ? "SOS अलर्ट प्रक्रिया शुरू हुई!" : "SOS emergency dispatch hub generated!", "success");
    } catch (err) {
      showToast(err.message || "Failed to trigger SOS", "error");
    }
  });
}

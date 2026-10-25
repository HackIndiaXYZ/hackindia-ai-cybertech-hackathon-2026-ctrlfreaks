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
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            ${t("contacts_title")}
          </h1>
          <p class="text-slate-400 text-sm">
            ${t("contacts_sub")}
          </p>
        </div>

        <button 
          id="trigger-sos-btn"
          class="self-start sm:self-auto px-6 py-3 rounded-xl font-extrabold text-sm bg-red-600 hover:bg-red-500 text-white transition-all shadow-xl shadow-red-600/30 flex items-center gap-2.5 animate-pulse"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          <span>${t("contacts_sos_btn")}</span>
        </button>
      </div>

      <!-- SOS Status Alert Banner (if recently triggered) -->
      <div id="sos-status-area" class="${sosStatusBanner ? '' : 'hidden'}">
        ${sosStatusBanner || ''}
      </div>

      <!-- Privacy & Consent Assurance Card -->
      <div class="p-4 rounded-2xl bg-teal-950/20 border border-teal-500/30 flex items-start gap-3 text-xs text-teal-200">
        <svg class="w-5 h-5 flex-shrink-0 text-teal-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
        </svg>
        <p class="leading-relaxed">
          <strong>${isHi ? 'सहमति-आधारित सुरक्षा:' : 'Consent-Based Safety Guarantee:'}</strong> ${isHi
            ? 'स्कैमसाथी कभी भी स्वतः या चुपके से संदेश नहीं भेजता। अलर्ट केवल आपके द्वारा स्पष्ट पुष्टि करने पर ही भेजा जाता है। आपके मूल संदिग्ध संदेश कभी किसी के साथ साझा नहीं किए जाते।'
            : 'ScamSaathi never silently notifies contacts merely because a message scored high risk. Dispatch requires your explicit manual confirmation. Raw message content and personal details are strictly excluded.'}
        </p>
      </div>

      <!-- Trusted Contacts Manager Card -->
      <div class="cyber-card p-6 sm:p-8">
        <div class="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <h2 class="text-lg font-bold text-white">${t("contacts_list_title")}</h2>
          <button 
            id="show-add-contact-btn"
            class="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-colors"
          >
            ${t("contacts_add_btn")}
          </button>
        </div>

        <!-- Add Contact Form (Toggleable) -->
        <div id="add-contact-form-container" class="hidden mb-6 p-4 rounded-xl bg-[#0B1220] border border-slate-700">
          <h3 class="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Add New Trusted Guardian</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label class="text-[11px] text-slate-400 block mb-1">${t("contacts_name")} *</label>
              <input id="new-contact-name" type="text" class="w-full p-2.5 rounded-lg bg-[#162438] border border-slate-700 text-white text-xs" placeholder="e.g. Ramesh Kumar"/>
            </div>
            <div>
              <label class="text-[11px] text-slate-400 block mb-1">${t("contacts_relation")} *</label>
              <input id="new-contact-relation" type="text" class="w-full p-2.5 rounded-lg bg-[#162438] border border-slate-700 text-white text-xs" placeholder="e.g. Son, Daughter, Friend"/>
            </div>
            <div>
              <label class="text-[11px] text-slate-400 block mb-1">${t("contacts_phone")}</label>
              <input id="new-contact-phone" type="text" class="w-full p-2.5 rounded-lg bg-[#162438] border border-slate-700 text-white text-xs font-mono" placeholder="+91 98765 43210"/>
            </div>
            <div>
              <label class="text-[11px] text-slate-400 block mb-1">${t("contacts_email")}</label>
              <input id="new-contact-email" type="email" class="w-full p-2.5 rounded-lg bg-[#162438] border border-slate-700 text-white text-xs" placeholder="name@example.com"/>
            </div>
          </div>
          <div class="flex justify-end gap-2">
            <button id="cancel-add-contact-btn" class="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white">
              Cancel
            </button>
            <button id="save-contact-btn" class="px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950">
              ${t("contacts_save_btn")}
            </button>
          </div>
        </div>

        <!-- Contacts Table / List -->
        <div id="contacts-list-container" class="flex flex-col gap-3">
          <div class="text-xs text-slate-400 py-4 text-center">Loading trusted contacts...</div>
        </div>
      </div>
    </div>
  `;

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
      showToast(isHi ? "संपर्क सफलतापूर्वक जोड़ा गया!" : "Trusted contact added successfully!", "success");
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
      <div class="p-6 text-center text-xs text-slate-400 bg-[#0B1220] rounded-xl border border-slate-800">
        ${t("contacts_empty")}
      </div>
    `;
    return;
  }

  listContainer.innerHTML = contactsList.map(c => `
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#0B1220] border border-slate-800 text-xs">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-300 font-bold flex items-center justify-center flex-shrink-0">
          ${c.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <div class="flex items-center gap-2">
            <span class="font-bold text-white text-sm">${c.name}</span>
            <span class="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-medium">${c.relationship}</span>
          </div>
          <div class="flex items-center gap-3 mt-1 text-slate-400">
            ${c.phone ? `<span class="font-mono text-slate-300">📞 ${c.phone}</span>` : ''}
            ${c.email ? `<span class="text-slate-400">✉ ${c.email}</span>` : ''}
          </div>
        </div>
      </div>

      <button 
        data-del-id="${c.id}"
        class="self-end sm:self-center px-3 py-1.5 rounded-lg text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-colors"
      >
        Remove
      </button>
    </div>
  `).join("");

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
    <div class="relative w-full max-w-lg p-6 rounded-2xl bg-[#111C2E] border-2 border-red-500/80 shadow-2xl text-left">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-12 h-12 rounded-xl bg-red-500/20 text-red-400 border border-red-500/40 flex items-center justify-center font-bold text-xl flex-shrink-0 animate-pulse">
          🚨
        </div>
        <div>
          <h3 class="text-lg font-bold text-white">${t("contacts_modal_sos_title")}</h3>
          <span class="text-xs text-red-400 font-semibold">Mode: ${preview.provider_mode}</span>
        </div>
      </div>

      <p class="text-xs text-slate-300 leading-relaxed mb-4">
        ${t("contacts_modal_sos_warning")}
      </p>

      <!-- Alert Preview Bubble -->
      <div class="p-3.5 rounded-xl bg-[#0B1220] border border-slate-800 text-xs text-slate-200 leading-relaxed font-mono-code mb-4">
        <strong class="text-teal-400 block mb-1">Proposed Outbound Message:</strong>
        "${preview.preview_message}"
      </div>

      <div class="flex items-center justify-between text-xs text-slate-400 mb-6 bg-[#162438] p-3 rounded-xl border border-slate-800">
        <span>Recipients queued: <strong class="text-white">${preview.recipient_count} Contact(s)</strong></span>
        <span class="text-[11px] text-teal-400 font-semibold">Zero Sensitive Data Sent</span>
      </div>

      <div class="flex flex-col sm:flex-row items-center justify-end gap-3">
        <button id="sos-modal-cancel" class="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-[#162438] hover:bg-[#1E314B] border border-slate-700 transition-colors">
          ${t("contacts_modal_cancel_btn")}
        </button>
        <button id="sos-modal-confirm" class="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 transition-colors shadow-lg shadow-red-600/30">
          ${t("contacts_modal_confirm_btn")}
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

      sosStatusBanner = `
        <div class="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/60 text-emerald-200 text-xs flex flex-col gap-1.5 shadow-lg">
          <div class="flex items-center justify-between">
            <span class="font-bold text-sm text-emerald-300">✓ ${isHi ? "अलर्ट स्थिति (SOS Status)" : "SOS Alert Dispatch Status"}: ${resp.status}</span>
            <span class="text-[11px] text-slate-400">${resp.timestamp}</span>
          </div>
          <p class="leading-relaxed text-slate-300">${resp.notice}</p>
        </div>
      `;

      const statusArea = parentContainer.querySelector("#sos-status-area");
      if (statusArea) {
        statusArea.innerHTML = sosStatusBanner;
        statusArea.classList.remove("hidden");
      }
      showToast(isHi ? "SOS अलर्ट प्रक्रिया पूरी हुई!" : "SOS alert routine executed successfully!", "success");
    } catch (err) {
      showToast(err.message || "Failed to trigger SOS", "error");
    }
  });
}

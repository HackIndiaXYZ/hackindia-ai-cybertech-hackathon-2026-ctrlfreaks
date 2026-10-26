// Responsive Sidebar Navigation Component

import { t } from "../i18n.js";
import { store } from "../store.js";

const NAV_ITEMS = [
  {
    id: "dashboard",
    labelKey: "nav_dashboard",
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>`
  },
  {
    id: "analyzer",
    labelKey: "nav_analyzer",
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>`
  },
  {
    id: "safelink",
    labelKey: "nav_safelink",
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>`
  },
  {
    id: "dna",
    labelKey: "nav_scamdna",
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/>`
  },
  {
    id: "honeyshield",
    labelKey: "nav_honeyshield",
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>`
  },
  {
    id: "safetycenter",
    labelKey: "nav_safetycenter",
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>`
  },
  {
    id: "contacts",
    labelKey: "nav_contacts",
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>`
  },
  {
    id: "privacy",
    labelKey: "nav_privacy",
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>`
  },
  {
    id: "settings",
    labelKey: "nav_settings",
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>`
  }
];

export function renderSidebar(container) {
  const currentTab = store.activeTab;

  container.innerHTML = `
    <nav class="flex flex-col h-full justify-between p-3.5 bg-[#0C1220] border-r border-[rgba(255,255,255,0.08)]">
      <div class="flex flex-col gap-1">
        <div class="px-3 pt-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono-code">
          Security Console
        </div>
        ${NAV_ITEMS.map(item => {
          const isActive = item.id === currentTab;
          return `
            <button 
              data-nav-id="${item.id}"
              class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                isActive 
                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] border border-transparent'
              }"
            >
              <svg class="w-4 h-4 flex-shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-500'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                ${item.icon}
              </svg>
              <span>${t(item.labelKey)}</span>
            </button>
          `;
        }).join("")}
      </div>

      <!-- Clean Minimal Footer Status -->
      <div class="mt-6 pt-3 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between px-2">
        <div class="flex items-center gap-2">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span class="text-[11px] text-slate-400 font-medium">Shield Core</span>
        </div>
        <span class="text-[10px] text-slate-500 font-mono-code">v2.4</span>
      </div>
    </nav>
  `;

  // Attach click events
  const buttons = container.querySelectorAll("button[data-nav-id]");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-nav-id");
      store.setActiveTab(targetId);
      const sidebarContainer = document.getElementById("app-sidebar");
      if (sidebarContainer && window.innerWidth < 1024) {
        sidebarContainer.classList.add("hidden");
      }
    });
  });
}

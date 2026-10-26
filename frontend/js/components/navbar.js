// Top Navigation Bar Component

import { t, getLanguage, setLanguage } from "../i18n.js";
import { store } from "../store.js";

export function renderNavbar(container) {
  const currentLang = getLanguage();

  container.innerHTML = `
    <header class="sticky top-0 z-40 w-full bg-[#080C15]/95 backdrop-blur-md border-b border-[rgba(255,255,255,0.08)] px-4 lg:px-8 py-3 flex items-center justify-between">
      <!-- Left: Mobile Menu Toggle & Brand -->
      <div class="flex items-center gap-3">
        <button id="mobile-menu-btn" class="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors" aria-label="Toggle Navigation">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>

        <a href="#dashboard" class="flex items-center gap-3 text-decoration-none group">
          <div class="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:border-emerald-500/50 transition-colors shadow-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
          </div>
          <div class="flex flex-col">
            <div class="flex items-center gap-2">
              <span class="text-sm font-bold text-white tracking-tight">${t("app_name")}</span>
            </div>
            <span class="text-[11px] text-slate-400 hidden sm:inline-block">${t("tagline")}</span>
          </div>
        </a>
      </div>

      <!-- Right: Operational status, SOS Action, Language Toggle -->
      <div class="flex items-center gap-3">
        <!-- System Status -->
        <div id="backend-status-pill" class="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span class="text-[11px] font-mono-code tracking-wide">OPERATIONAL</span>
        </div>

        <!-- Quick SOS Action -->
        <button id="nav-quick-sos-btn" class="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/30 transition-colors">
          <svg class="w-3.5 h-3.5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          <span>SOS Alert</span>
        </button>

        <!-- Segmented Bilingual Switcher -->
        <div class="flex items-center bg-[#0C1220] p-0.5 rounded-lg border border-[rgba(255,255,255,0.08)]">
          <button id="lang-btn-en" class="px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${currentLang === 'en' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}">
            EN
          </button>
          <button id="lang-btn-hi" class="px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${currentLang === 'hi' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}">
            हिन्दी
          </button>
        </div>
      </div>
    </header>
  `;

  // Attach event handlers
  const btnEn = container.querySelector("#lang-btn-en");
  const btnHi = container.querySelector("#lang-btn-hi");
  const quickSosBtn = container.querySelector("#nav-quick-sos-btn");
  const mobileMenuBtn = container.querySelector("#mobile-menu-btn");

  btnEn.addEventListener("click", () => {
    if (getLanguage() !== "en") {
      setLanguage("en");
      window.location.reload();
    }
  });

  btnHi.addEventListener("click", () => {
    if (getLanguage() !== "hi") {
      setLanguage("hi");
      window.location.reload();
    }
  });

  quickSosBtn.addEventListener("click", () => {
    store.setActiveTab("contacts");
  });

  mobileMenuBtn.addEventListener("click", () => {
    const sidebar = document.getElementById("app-sidebar");
    if (sidebar) {
      sidebar.classList.toggle("hidden");
    }
  });
}

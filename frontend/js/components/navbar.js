// Top Navigation Bar Component

import { t, getLanguage, setLanguage } from "../i18n.js";
import { store } from "../store.js";

export function renderNavbar(container) {
  const currentLang = getLanguage();

  container.innerHTML = `
    <header class="sticky top-0 z-40 w-full bg-[#0B1220]/90 backdrop-blur-md border-b border-[#1E314B] px-4 lg:px-8 py-3.5 flex items-center justify-between">
      <!-- Left: Mobile Menu Toggle & Brand -->
      <div class="flex items-center gap-3">
        <button id="mobile-menu-btn" class="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#162438] transition-colors" aria-label="Toggle Menu">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>

        <a href="#dashboard" class="flex items-center gap-2.5 text-decoration-none group">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <svg class="w-6 h-6 text-slate-950" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
            </svg>
          </div>
          <div class="flex flex-col">
            <div class="flex items-center gap-2">
              <span class="text-lg font-extrabold text-white tracking-tight">${t("app_name")}</span>
              <span class="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">v1.0</span>
            </div>
            <span class="text-xs text-slate-400 hidden sm:inline-block">${t("tagline")}</span>
          </div>
        </a>
      </div>

      <!-- Right: Live System Status, SOS Trigger & Language Toggle -->
      <div class="flex items-center gap-2 sm:gap-3">
        <!-- Live Connection status indicator -->
        <div id="backend-status-pill" class="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Engine Active</span>
        </div>

        <!-- Quick SOS Button -->
        <button id="nav-quick-sos-btn" class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-red-500/15 text-red-300 hover:bg-red-500/25 border border-red-500/40 transition-colors shadow-sm">
          <svg class="w-4 h-4 text-red-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          <span>SOS</span>
        </button>

        <!-- Bilingual Switcher -->
        <div class="flex items-center bg-[#111C2E] p-1 rounded-xl border border-[#1E314B]">
          <button id="lang-btn-en" class="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${currentLang === 'en' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'}">
            EN
          </button>
          <button id="lang-btn-hi" class="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${currentLang === 'hi' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'}">
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

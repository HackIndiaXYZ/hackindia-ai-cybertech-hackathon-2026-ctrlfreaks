// ScamSaathi Master Application Router & Bootstrapper

import { store } from "./store.js";
import { api } from "./api.js";
import { renderNavbar } from "./components/navbar.js";
import { renderSidebar } from "./components/sidebar.js";

import { renderDashboard } from "./pages/dashboard.js";
import { renderMessageAnalyzer } from "./pages/messageAnalyzer.js";
import { renderSafeLink } from "./pages/safeLink.js";
import { renderScamDNA } from "./pages/scamDNA.js";
import { renderHoneyShield } from "./pages/honeyShield.js";
import { renderSafetyCenter } from "./pages/safetyCenter.js";
import { renderTrustedContacts } from "./pages/trustedContacts.js";
import { renderPrivacyCenter } from "./pages/privacyCenter.js";
import { renderSettings } from "./pages/settings.js";

const PAGE_RENDERERS = {
  dashboard: renderDashboard,
  analyzer: renderMessageAnalyzer,
  safelink: renderSafeLink,
  dna: renderScamDNA,
  honeyshield: renderHoneyShield,
  safetycenter: renderSafetyCenter,
  contacts: renderTrustedContacts,
  privacy: renderPrivacyCenter,
  settings: renderSettings
};

function routeCurrentView() {
  const contentArea = document.getElementById("main-content");
  if (!contentArea) return;

  const currentTab = store.activeTab;
  const renderer = PAGE_RENDERERS[currentTab] || renderDashboard;

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });

  // Update hash safely
  if (window.location.hash.slice(1) !== currentTab) {
    window.location.hash = currentTab;
  }

  // Render view
  renderer(contentArea);

  // Re-render sidebar to highlight active item
  const sidebarContainer = document.getElementById("app-sidebar");
  if (sidebarContainer) {
    renderSidebar(sidebarContainer);
  }
}

async function checkBackendConnectivity() {
  const pill = document.getElementById("backend-status-pill");
  if (!pill) return;

  try {
    const health = await api.getHealth();
    pill.classList.remove("border-red-500/30", "bg-red-500/10", "text-red-400");
    pill.classList.add("border-emerald-500/30", "bg-emerald-500/10", "text-emerald-300");
    pill.innerHTML = `
      <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
      <span>Engine Active</span>
    `;
  } catch (err) {
    pill.classList.remove("border-emerald-500/30", "bg-emerald-500/10", "text-emerald-300");
    pill.classList.add("border-amber-500/30", "bg-amber-500/10", "text-amber-300");
    pill.innerHTML = `
      <span class="w-2 h-2 rounded-full bg-amber-400"></span>
      <span>Local Offline Mode</span>
    `;
  }
}

export function initApp() {
  // Render persistent Navbar & Sidebar
  const navbarContainer = document.getElementById("navbar-container");
  const sidebarContainer = document.getElementById("app-sidebar");

  if (navbarContainer) renderNavbar(navbarContainer);
  if (sidebarContainer) renderSidebar(sidebarContainer);

  // Hash change routing
  const initialHash = window.location.hash.slice(1);
  if (initialHash && PAGE_RENDERERS[initialHash]) {
    store.activeTab = initialHash;
  }

  window.addEventListener("hashchange", () => {
    const hash = window.location.hash.slice(1);
    if (hash && PAGE_RENDERERS[hash] && hash !== store.activeTab) {
      store.setActiveTab(hash);
    }
  });

  // Subscribe view changes
  store.subscribe(() => {
    routeCurrentView();
  });

  // Initial render
  routeCurrentView();

  // Test backend connectivity
  checkBackendConnectivity();
}

// Start app on DOMContentLoaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

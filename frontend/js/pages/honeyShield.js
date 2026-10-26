// HoneyShield Simulation Lab Page Component

import { t, getLanguage } from "../i18n.js";
import { store } from "../store.js";
import { api } from "../api.js";
import { showToast } from "../components/toast.js";

let scenariosCache = null;
let currentScenarioIdx = 0;
let lastEvaluation = null;

export async function renderHoneyShield(container) {
  const isHi = getLanguage() === "hi";

  container.innerHTML = `
    <div class="flex flex-col gap-6 pb-12 animate-fade-in max-w-5xl mx-auto">
      <!-- Section Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex flex-col gap-1">
          <div class="flex items-center gap-2">
            <span class="badge-subtle badge-neutral">TRAINING SIMULATOR</span>
          </div>
          <h1 class="text-xl sm:text-2xl font-bold text-white tracking-tight">
            ${t("honey_title")}
          </h1>
          <p class="text-slate-400 text-xs">
            ${t("honey_sub")}
          </p>
        </div>
        <button id="honey-reset-btn" class="self-start sm:self-auto px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-[#10182B] hover:bg-[#16233B] border border-[rgba(255,255,255,0.08)] transition-colors flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          <span>${t("honey_btn_reset")}</span>
        </button>
      </div>

      <!-- Score & Telemetry Banner -->
      <div class="cyber-card p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#0D1527] border-[rgba(255,255,255,0.08)]">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
          </div>
          <div>
            <span class="text-[11px] text-slate-400 font-medium">${t("honey_completed_label")}</span>
            <div class="text-xl font-bold text-white font-mono-code">
              <span id="honey-completed-count">${store.honeyShieldProgress.completedIds.length}</span> <span class="text-xs text-slate-500 font-normal">/ 6 modules</span>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between sm:justify-end gap-6 sm:border-l sm:border-[rgba(255,255,255,0.08)] sm:pl-6">
          <div class="flex flex-col sm:items-end">
            <span class="text-[11px] text-slate-400 font-medium">${t("honey_score_label")}</span>
            <div class="text-xl font-bold text-emerald-400 font-mono-code">
              <span id="honey-score-value">${store.honeyShieldProgress.score}</span><span class="text-xs text-slate-500 font-normal"> / 100</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Scenario Selector Navigation Tabs -->
      <div id="honey-tabs-container" class="flex items-center gap-2 overflow-x-auto pb-1">
        <div class="text-xs text-slate-400 py-2">Loading simulation scenarios...</div>
      </div>

      <!-- Active Scenario Container -->
      <div id="honey-active-scenario-card" class="cyber-card p-5 sm:p-6 bg-[#0D1527] border-[rgba(255,255,255,0.08)]">
        <!-- Rendered dynamically -->
      </div>

      <!-- Evaluation Result Container -->
      <div id="honey-evaluation-area" class="${lastEvaluation ? '' : 'hidden'} flex flex-col gap-4">
        <!-- Rendered dynamically -->
      </div>
    </div>
  `;

  // Attach reset handler
  container.querySelector("#honey-reset-btn").addEventListener("click", () => {
    store.resetHoneyShield();
    lastEvaluation = null;
    showToast(isHi ? "हनीशील्ड प्रगति रीसेट कर दी गई।" : "Simulation progress reset successfully.", "info");
    renderHoneyShield(container);
  });

  // Fetch scenarios from API
  try {
    const scenarios = await api.getScenarios(isHi ? "hi" : "en");
    scenariosCache = scenarios;
    renderScenarioTabs(container, scenarios);
    renderScenarioCard(container, scenarios[currentScenarioIdx]);
  } catch (err) {
    showToast(err.message || "Failed to load simulation scenarios.", "error");
  }
}

function renderScenarioTabs(container, scenarios) {
  const tabsContainer = container.querySelector("#honey-tabs-container");
  if (!tabsContainer) return;

  tabsContainer.innerHTML = scenarios.map((s, idx) => {
    const isCompleted = store.honeyShieldProgress.completedIds.includes(s.id);
    const isActive = idx === currentScenarioIdx;
    return `
      <button 
        data-scenario-idx="${idx}"
        class="scenario-tab-btn flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
          isActive 
            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' 
            : 'bg-[#10182B] hover:bg-[#16233B] text-slate-400 hover:text-white border border-[rgba(255,255,255,0.06)]'
        }"
      >
        <span class="font-mono-code text-[11px] ${isCompleted ? 'text-emerald-400 font-bold' : 'text-slate-500'}">
          ${isCompleted ? '✓' : '#' + (idx + 1)}
        </span>
        <span>${s.title}</span>
      </button>
    `;
  }).join("");

  tabsContainer.querySelectorAll("button[data-scenario-idx]").forEach(btn => {
    btn.addEventListener("click", () => {
      currentScenarioIdx = parseInt(btn.getAttribute("data-scenario-idx"), 10);
      lastEvaluation = null;
      renderScenarioTabs(container, scenarios);
      renderScenarioCard(container, scenarios[currentScenarioIdx]);
      const evalArea = container.querySelector("#honey-evaluation-area");
      if (evalArea) evalArea.classList.add("hidden");
    });
  });
}

function renderScenarioCard(container, scenario) {
  const card = container.querySelector("#honey-active-scenario-card");
  if (!card || !scenario) return;

  const isHi = getLanguage() === "hi";

  card.innerHTML = `
    <!-- Top Scenario Meta -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-[rgba(255,255,255,0.08)]">
      <div>
        <span class="badge-subtle badge-neutral font-mono-code">${scenario.category}</span>
        <h2 class="text-lg font-bold text-white mt-1.5">${scenario.title}</h2>
      </div>
      <div class="flex items-center gap-2 text-xs text-slate-400 bg-[#080C15] px-3 py-1.5 rounded-lg border border-[rgba(255,255,255,0.06)]">
        <span class="text-slate-500 text-[11px]">${t("honey_scenario_sender")}:</span>
        <span class="font-mono-code text-slate-200 text-xs">${scenario.sender}</span>
      </div>
    </div>

    <!-- Fictional Scam Message Bubble -->
    <div class="p-4 rounded-lg bg-[#080C15] border border-[rgba(255,255,255,0.08)] text-slate-200 text-xs leading-relaxed mb-5 font-mono-code relative">
      <div class="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
        <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
        Simulated Inbound Transmission
      </div>
      <div class="text-slate-200">${scenario.message}</div>
    </div>

    <!-- Active Manipulation Tactics Chips -->
    <div class="flex flex-wrap items-center gap-2 mb-5">
      <span class="text-[11px] font-semibold text-slate-400 uppercase">${isHi ? 'प्रयुक्त दबाव तकनीकें:' : 'Identified Manipulation Levers:'}</span>
      ${scenario.manipulation_tactics.map(t => `
        <span class="badge-subtle badge-amber">
          ${t}
        </span>
      `).join("")}
    </div>

    <!-- Response Options -->
    <div class="flex flex-col gap-2.5">
      <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">${t("honey_scenario_prompt")}</span>
      ${scenario.options.map((opt, i) => `
        <button 
          data-opt-id="${opt.id}"
          class="scenario-opt-btn p-3.5 rounded-lg bg-[#10182B] hover:bg-[#16233B] border border-[rgba(255,255,255,0.06)] hover:border-emerald-500/40 text-left transition-all group flex items-start gap-3"
        >
          <span class="flex-shrink-0 w-6 h-6 rounded bg-[#080C15] text-slate-300 border border-[rgba(255,255,255,0.1)] flex items-center justify-center font-mono-code font-bold text-xs group-hover:border-emerald-500/50 group-hover:text-emerald-400 transition-colors">
            ${String.fromCharCode(65 + i)}
          </span>
          <div class="flex flex-col">
            <span class="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">${opt.label}</span>
            <span class="text-[11px] text-slate-400 mt-0.5 leading-relaxed">${opt.description}</span>
          </div>
        </button>
      `).join("")}
    </div>
  `;

  // Attach option click handlers
  card.querySelectorAll("button[data-opt-id]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const optId = btn.getAttribute("data-opt-id");
      try {
        const evalResult = await api.evaluateScenario(scenario.id, optId, isHi ? "hi" : "en");
        lastEvaluation = evalResult;

        // Update session store
        store.recordHoneyShieldProgress(scenario.id, evalResult.score_impact);

        // Update counters on top
        const compCountEl = container.querySelector("#honey-completed-count");
        const scoreValEl = container.querySelector("#honey-score-value");
        if (compCountEl) compCountEl.textContent = store.honeyShieldProgress.completedIds.length;
        if (scoreValEl) scoreValEl.textContent = store.honeyShieldProgress.score;

        // Render evaluation result
        const evalArea = container.querySelector("#honey-evaluation-area");
        evalArea.innerHTML = renderEvaluationResult(evalResult, isHi);
        evalArea.classList.remove("hidden");
        evalArea.scrollIntoView({ behavior: "smooth", block: "start" });

        // Update tabs styling
        renderScenarioTabs(container, scenariosCache);
      } catch (err) {
        showToast(err.message || t("common_error"), "error");
      }
    });
  });
}

function renderEvaluationResult(ev, isHi) {
  const isSafe = ev.is_safe;

  return `
    <div class="cyber-card p-5 sm:p-6 bg-[#0D1527] border ${isSafe ? 'border-emerald-500/40' : 'border-rose-500/40'}">
      <div class="flex items-center justify-between gap-3 pb-3.5 mb-3.5 border-b border-[rgba(255,255,255,0.08)]">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg ${isSafe ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' : 'bg-rose-500/10 text-rose-400 border border-rose-500/25'} flex items-center justify-center font-bold text-sm">
            ${isSafe ? '✓' : '✕'}
          </div>
          <div>
            <h3 class="text-sm font-bold text-white">${ev.feedback_title}</h3>
            <span class="text-[11px] font-mono-code font-semibold ${ev.score_impact > 0 ? 'text-emerald-400' : 'text-rose-400'}">
              Score Assessment: ${ev.score_impact > 0 ? '+' : ''}${ev.score_impact} pts
            </span>
          </div>
        </div>
      </div>

      <div class="p-3.5 rounded-lg bg-[#080C15] border border-[rgba(255,255,255,0.06)] text-xs text-slate-200 leading-relaxed mb-4">
        ${ev.feedback}
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div class="p-3 rounded-lg bg-[#10182B] border border-[rgba(255,255,255,0.06)]">
          <strong class="text-slate-300 block mb-1 text-[11px] font-semibold uppercase tracking-wider">${t("honey_why_title")}</strong>
          <span class="text-slate-400 leading-relaxed text-[11px]">${ev.why_risky_or_safe}</span>
        </div>

        <div class="p-3 rounded-lg bg-[#10182B] border border-[rgba(255,255,255,0.06)]">
          <strong class="text-emerald-400 block mb-1 text-[11px] font-semibold uppercase tracking-wider">${t("honey_safer_title")}</strong>
          <span class="text-slate-300 leading-relaxed text-[11px]">${ev.safer_response}</span>
        </div>
      </div>
    </div>
  `;
}

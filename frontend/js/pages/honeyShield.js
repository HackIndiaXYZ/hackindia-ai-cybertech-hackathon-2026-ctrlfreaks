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
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            ${t("honey_title")}
          </h1>
          <p class="text-slate-400 text-sm">
            ${t("honey_sub")}
          </p>
        </div>
        <button id="honey-reset-btn" class="self-start sm:self-auto px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-[#111C2E] hover:bg-[#1E314B] border border-slate-700 transition-colors">
          ↺ ${t("honey_btn_reset")}
        </button>
      </div>

      <!-- Score & Progress Banner -->
      <div class="cyber-card p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 border-purple-500/30 bg-purple-950/10">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-extrabold text-lg flex-shrink-0">
            🛡️
          </div>
          <div>
            <span class="text-xs text-slate-400 font-semibold">${t("honey_completed_label")}</span>
            <div class="text-2xl font-extrabold text-white">
              <span id="honey-completed-count">${store.honeyShieldProgress.completedIds.length}</span> <span class="text-sm text-slate-500 font-normal">/ 6</span>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between sm:justify-end gap-6 sm:border-l sm:border-slate-800 sm:pl-6">
          <div class="flex flex-col sm:items-end">
            <span class="text-xs text-slate-400 font-semibold">${t("honey_score_label")}</span>
            <div class="text-2xl font-extrabold text-emerald-400">
              <span id="honey-score-value">${store.honeyShieldProgress.score}</span><span class="text-sm text-slate-500 font-normal">/100</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Scenario Selector Navigation Tabs -->
      <div id="honey-tabs-container" class="flex items-center gap-2 overflow-x-auto pb-2">
        <div class="text-xs text-slate-400 py-2">Loading scenarios...</div>
      </div>

      <!-- Active Scenario Container -->
      <div id="honey-active-scenario-card" class="cyber-card p-6 sm:p-8">
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
        class="scenario-tab-btn flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
          isActive 
            ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' 
            : 'bg-[#111C2E] hover:bg-[#1E314B] text-slate-300 border border-slate-800'
        }"
      >
        <span>${isCompleted ? '✓' : '#' + (idx + 1)}</span>
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
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-800">
      <div>
        <span class="text-xs uppercase font-bold tracking-wider text-purple-400">${scenario.category}</span>
        <h2 class="text-xl font-bold text-white mt-1">${scenario.title}</h2>
      </div>
      <div class="flex items-center gap-2 text-xs text-slate-400 bg-[#0B1220] px-3 py-1.5 rounded-lg border border-slate-800">
        <span class="text-slate-500">${t("honey_scenario_sender")}:</span>
        <span class="font-mono text-slate-200 font-semibold">${scenario.sender}</span>
      </div>
    </div>

    <!-- Fictional Scam Message Bubble -->
    <div class="p-5 rounded-2xl bg-[#0B1220] border-2 border-slate-800 text-slate-200 text-sm leading-relaxed mb-6 font-mono-code relative">
      <div class="absolute -top-3 left-4 px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
        Simulated Incoming Communication
      </div>
      ${scenario.message}
    </div>

    <!-- Active Manipulation Tactics Chips -->
    <div class="flex flex-wrap items-center gap-2 mb-6">
      <span class="text-xs font-semibold text-slate-400">${isHi ? 'प्रयुक्त दबाव तकनीकें:' : 'Manipulation levers present:'}</span>
      ${scenario.manipulation_tactics.map(t => `
        <span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30">
          ⚡ ${t}
        </span>
      `).join("")}
    </div>

    <!-- Response Options -->
    <div class="flex flex-col gap-3">
      <span class="text-xs font-bold uppercase tracking-wider text-white">${t("honey_scenario_prompt")}</span>
      ${scenario.options.map((opt, i) => `
        <button 
          data-opt-id="${opt.id}"
          class="scenario-opt-btn p-4 rounded-xl bg-[#111C2E] hover:bg-[#162438] border border-slate-700/80 hover:border-purple-500/50 text-left transition-all group flex items-start gap-3.5"
        >
          <span class="flex-shrink-0 w-7 h-7 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center font-bold text-xs group-hover:bg-purple-500 group-hover:text-slate-950 transition-colors">
            ${String.fromCharCode(65 + i)}
          </span>
          <div class="flex flex-col">
            <span class="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">${opt.label}</span>
            <span class="text-xs text-slate-400 mt-0.5">${opt.description}</span>
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
  let outcomeClass = "border-emerald-500/80 bg-emerald-950/20 text-emerald-300";
  let icon = "✓";
  if (!ev.is_safe) {
    outcomeClass = "border-red-500/80 bg-red-950/20 text-red-300";
    icon = "✕";
  }

  return `
    <div class="cyber-card p-6 sm:p-8 border-2 ${outcomeClass}">
      <div class="flex items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl ${ev.is_safe ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'} flex items-center justify-center font-extrabold text-lg">
            ${icon}
          </div>
          <div>
            <h3 class="text-lg font-bold text-white">${ev.feedback_title}</h3>
            <span class="text-xs font-semibold ${ev.score_impact > 0 ? 'text-emerald-400' : 'text-red-400'}">
              Score impact: ${ev.score_impact > 0 ? '+' : ''}${ev.score_impact} pts
            </span>
          </div>
        </div>
      </div>

      <div class="p-4 rounded-xl bg-[#0B1220] border border-slate-800 text-sm text-slate-200 leading-relaxed mb-4">
        ${ev.feedback}
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div class="p-3.5 rounded-xl bg-[#111C2E] border border-slate-800">
          <strong class="text-slate-300 block mb-1">${t("honey_why_title")}</strong>
          <span class="text-slate-400 leading-relaxed">${ev.why_risky_or_safe}</span>
        </div>

        <div class="p-3.5 rounded-xl bg-[#111C2E] border border-slate-800">
          <strong class="text-emerald-400 block mb-1">${t("honey_safer_title")}</strong>
          <span class="text-slate-300 leading-relaxed">${ev.safer_response}</span>
        </div>
      </div>
    </div>
  `;
}

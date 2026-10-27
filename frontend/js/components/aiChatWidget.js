// Saathi AI Floating Cybersecurity Assistant & Copilot

import { api } from "../api.js";
import { getLanguage } from "../i18n.js";
import { showToast } from "./toast.js";

let chatHistory = [];
let isOpen = false;
let isConfigOpen = false;

export function renderAIChatWidget(container) {
  const isHi = getLanguage() === "hi";

  const widgetHTML = `
    <!-- Floating Action Button -->
    <div id="ai-chat-launcher" class="fixed bottom-6 right-6 z-50 flex items-center gap-2 group cursor-pointer">
      <div class="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#10182B] border border-teal-500/30 text-teal-300 text-xs font-semibold shadow-lg shadow-teal-500/10 group-hover:border-teal-400 transition-all">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        <span>${isHi ? "AI साथी से पूछें" : "Ask Saathi AI"}</span>
      </div>
      <button 
        id="ai-chat-toggle-btn"
        class="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 hover:from-emerald-500 hover:to-cyan-400 text-slate-950 flex items-center justify-center shadow-xl shadow-teal-500/25 transition-transform hover:scale-105 active:scale-95"
        aria-label="Toggle AI CyberGuard Chatbot"
      >
        <svg class="w-6 h-6 text-slate-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
        </svg>
      </button>
    </div>

    <!-- Floating Chat Window -->
    <div 
      id="ai-chat-window" 
      class="hidden fixed bottom-22 right-4 sm:right-6 w-96 max-w-[calc(100vw-32px)] h-[540px] max-h-[80vh] flex-col rounded-2xl bg-[#0D1527] border border-[rgba(255,255,255,0.12)] shadow-2xl backdrop-blur-xl z-50 overflow-hidden animate-fade-in"
    >
      <!-- Chat Header -->
      <div class="px-4 py-3 bg-[#10182B] border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-teal-500/15 border border-teal-500/30 text-teal-300 flex items-center justify-center font-bold text-xs">
            AI
          </div>
          <div class="flex flex-col">
            <span class="text-xs font-bold text-white leading-tight">Saathi AI • CyberGuard</span>
            <span id="ai-chat-provider-badge" class="text-[10px] text-emerald-400 font-mono-code font-medium">Connecting...</span>
          </div>
        </div>

        <div class="flex items-center gap-1">
          <button id="ai-chat-config-btn" class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors" title="Configure Free AI Key (Groq / Gemini)">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            </svg>
          </button>
          <button id="ai-chat-close-btn" class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors" title="Close">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Quick AI Key Setup Tray (Collapsible) -->
      <div id="ai-config-tray" class="hidden p-3 bg-[#080C15] border-b border-[rgba(255,255,255,0.08)] text-xs flex flex-col gap-2 animate-fade-in">
        <div class="flex items-center justify-between">
          <span class="font-bold text-teal-300 text-[11px]">Free AI Provider Setup</span>
          <a href="https://console.groq.com/keys" target="_blank" class="text-[10px] text-emerald-400 underline hover:text-emerald-300">Get Free Groq Key</a>
        </div>
        <div class="flex gap-2">
          <select id="ai-prov-select" class="p-1.5 rounded bg-[#10182B] border border-slate-700 text-[11px] text-white">
            <option value="groq">Groq (Llama-3.3 70B - Free)</option>
            <option value="gemini">Google Gemini (Flash)</option>
          </select>
          <input id="ai-key-input" type="password" class="flex-1 p-1.5 rounded bg-[#10182B] border border-slate-700 text-[11px] text-white font-mono-code" placeholder="Paste gsk_... or AIza... key"/>
        </div>
        <button id="ai-key-save-btn" class="px-3 py-1 rounded text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors">
          Connect Free AI Key
        </button>
      </div>

      <!-- Messages Stream -->
      <div id="ai-chat-messages" class="flex-1 p-4 overflow-y-auto flex flex-col gap-3 text-xs">
        <div class="p-3 rounded-xl bg-[#10182B] border border-[rgba(255,255,255,0.06)] text-slate-200 leading-relaxed">
          ${isHi
            ? "नमस्ते! मैं आपका <strong>Saathi AI</strong> साइबर सुरक्षा साथी हूँ। आप मुझसे किसी भी संदिग्ध मैसेज, लिंक, डिजिटल अरेस्ट कॉल या बैंक फ्रॉड के बारे में पूछ सकते हैं।"
            : "Hello! I am <strong>Saathi AI</strong>, your personal anti-scam copilot. Ask me to inspect any message, phone demand, or suspicious link."
          }
        </div>
      </div>

      <!-- Quick Suggestion Pills -->
      <div class="px-3 py-1.5 bg-[#080C15]/50 flex items-center gap-1.5 overflow-x-auto border-t border-[rgba(255,255,255,0.04)]">
        <button class="ai-quick-chip flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] bg-[#10182B] hover:bg-[#16233B] text-teal-300 border border-[rgba(255,255,255,0.06)] transition-colors">
          Send me 1000 rs on this link?
        </button>
        <button class="ai-quick-chip flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] bg-[#10182B] hover:bg-[#16233B] text-teal-300 border border-[rgba(255,255,255,0.06)] transition-colors">
          Digital arrest kya hota hai?
        </button>
        <button class="ai-quick-chip flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] bg-[#10182B] hover:bg-[#16233B] text-teal-300 border border-[rgba(255,255,255,0.06)] transition-colors">
          1930 Helpline Info
        </button>
      </div>

      <!-- Input Bar -->
      <div class="p-3 bg-[#10182B] border-t border-[rgba(255,255,255,0.08)] flex items-center gap-2">
        <input 
          id="ai-chat-input" 
          type="text" 
          class="flex-1 p-2.5 rounded-xl bg-[#080C15] border border-[rgba(255,255,255,0.08)] focus:border-emerald-500/50 text-white text-xs placeholder:text-slate-500" 
          placeholder="${isHi ? 'मैसेज या सवाल यहाँ लिखें...' : 'Ask about a scam, link, or call...'}" 
        />
        <button 
          id="ai-chat-send-btn" 
          class="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-colors flex items-center justify-center flex-shrink-0"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
          </svg>
        </button>
      </div>
    </div>
  `;

  // Append widget to container
  const wrapper = document.createElement("div");
  wrapper.id = "ai-chat-widget-root";
  wrapper.innerHTML = widgetHTML;
  document.body.appendChild(wrapper);

  // Bind DOM elements
  const launcher = wrapper.querySelector("#ai-chat-launcher");
  const chatWindow = wrapper.querySelector("#ai-chat-window");
  const closeBtn = wrapper.querySelector("#ai-chat-close-btn");
  const configBtn = wrapper.querySelector("#ai-chat-config-btn");
  const configTray = wrapper.querySelector("#ai-config-tray");
  const keyInput = wrapper.querySelector("#ai-key-input");
  const provSelect = wrapper.querySelector("#ai-prov-select");
  const keySaveBtn = wrapper.querySelector("#ai-key-save-btn");
  const inputEl = wrapper.querySelector("#ai-chat-input");
  const sendBtn = wrapper.querySelector("#ai-chat-send-btn");
  const messagesBox = wrapper.querySelector("#ai-chat-messages");
  const badgeEl = wrapper.querySelector("#ai-chat-provider-badge");

  // Load Provider status
  async function updateBadge() {
    try {
      const cfg = await api.getAIConfig();
      if (cfg.configured) {
        badgeEl.textContent = `● ${cfg.active_provider}`;
        badgeEl.className = "text-[10px] text-emerald-400 font-mono-code font-semibold";
      } else {
        badgeEl.textContent = "● Free Local Forensics Engine";
        badgeEl.className = "text-[10px] text-teal-400 font-mono-code";
      }
    } catch {
      badgeEl.textContent = "● Local Engine Active";
    }
  }
  updateBadge();

  // Toggle open/close
  launcher.addEventListener("click", () => {
    isOpen = !isOpen;
    if (isOpen) {
      chatWindow.classList.remove("hidden");
      chatWindow.classList.add("flex");
      inputEl.focus();
    } else {
      chatWindow.classList.add("hidden");
      chatWindow.classList.remove("flex");
    }
  });

  closeBtn.addEventListener("click", () => {
    isOpen = false;
    chatWindow.classList.add("hidden");
    chatWindow.classList.remove("flex");
  });

  // Toggle Config Tray
  configBtn.addEventListener("click", () => {
    isConfigOpen = !isConfigOpen;
    configTray.classList.toggle("hidden", !isConfigOpen);
  });

  // Save AI Key
  keySaveBtn.addEventListener("click", async () => {
    const prov = provSelect.value;
    const key = keyInput.value.trim();
    if (!key) {
      showToast("Please paste an API key", "warning");
      return;
    }
    keySaveBtn.disabled = true;
    keySaveBtn.textContent = "Testing & Connecting...";

    try {
      const res = await api.saveAIConfig(prov, key);
      showToast(res.message, "success");
      configTray.classList.add("hidden");
      isConfigOpen = false;
      updateBadge();
    } catch (err) {
      showToast(err.message || "Failed to connect AI key", "error");
    } finally {
      keySaveBtn.disabled = false;
      keySaveBtn.textContent = "Connect Free AI Key";
    }
  });

  // Send message function
  async function sendMessage(text) {
    const q = text || inputEl.value.trim();
    if (!q) return;

    inputEl.value = "";

    // Append User Bubble
    const userDiv = document.createElement("div");
    userDiv.className = "self-end max-w-[85%] p-3 rounded-xl bg-emerald-600 text-white font-medium text-xs shadow-sm";
    userDiv.textContent = q;
    messagesBox.appendChild(userDiv);

    // Append Loading Bubble
    const loadingDiv = document.createElement("div");
    loadingDiv.className = "self-start max-w-[85%] p-3 rounded-xl bg-[#10182B] border border-[rgba(255,255,255,0.06)] text-slate-400 text-xs flex items-center gap-2";
    loadingDiv.innerHTML = `
      <div class="w-3.5 h-3.5 border-2 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
      <span>Saathi AI is analyzing...</span>
    `;
    messagesBox.appendChild(loadingDiv);
    messagesBox.scrollTop = messagesBox.scrollHeight;

    try {
      const res = await api.sendAIChat(q, chatHistory, isHi ? "hi" : "en");
      chatHistory.push({ role: "user", content: q });
      chatHistory.push({ role: "assistant", content: res.reply });

      // Replace loading bubble with formatted AI response
      loadingDiv.className = "self-start max-w-[88%] p-3.5 rounded-xl bg-[#10182B] border border-teal-500/25 text-slate-200 text-xs leading-relaxed space-y-1.5 shadow-sm";
      loadingDiv.innerHTML = formatMarkdown(res.reply);
    } catch (err) {
      loadingDiv.className = "self-start p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs";
      loadingDiv.textContent = `Error: ${err.message || "Could not retrieve response."}`;
    }

    messagesBox.scrollTop = messagesBox.scrollHeight;
  }

  sendBtn.addEventListener("click", () => sendMessage());
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  // Quick Chips
  wrapper.querySelectorAll(".ai-quick-chip").forEach(btn => {
    btn.addEventListener("click", () => {
      sendMessage(btn.textContent.trim());
    });
  });
}

function formatMarkdown(text) {
  if (!text) return "";
  let html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>')
    .replace(/• (.*?)(?=<br\/>|$)/g, '<div class="flex items-start gap-1.5"><span class="text-teal-400">•</span><span>$1</span></div>');
  return html;
}

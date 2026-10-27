// ScamSaathi API Client with graceful local fallbacks

const API_BASE = window.location.origin;

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  };

  try {
    const res = await fetch(url, config);
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || `Server returned ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`API call to ${endpoint} failed:`, err.message);
    throw err;
  }
}

export const api = {
  // Health
  getHealth: () => request("/api/health"),

  // Message Analyzer
  analyzeMessage: (text, language = "en") => 
    request("/api/analyze/message", {
      method: "POST",
      body: JSON.stringify({ text, language })
    }),

  // SafeLink URL Analyzer
  analyzeUrl: (url, language = "en") => 
    request("/api/analyze/url", {
      method: "POST",
      body: JSON.stringify({ url, language })
    }),

  // Scam DNA Fingerprint
  generateDNA: (payload) => 
    request("/api/dna/generate", {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  // HoneyShield Simulator
  getScenarios: (language = "en") => 
    request(`/api/scenarios?lang=${language}`),

  evaluateScenario: (scenario_id, selected_option_id, language = "en") => 
    request("/api/scenarios/evaluate", {
      method: "POST",
      body: JSON.stringify({ scenario_id, selected_option_id, language })
    }),

  // Trusted Contacts & SOS
  getContacts: () => request("/api/contacts"),

  addContact: (data) => 
    request("/api/contacts", {
      method: "POST",
      body: JSON.stringify(data)
    }),

  deleteContact: (id) => 
    request(`/api/contacts/${id}`, { method: "DELETE" }),

  previewSOS: (data) => 
    request("/api/contacts/sos/preview", {
      method: "POST",
      body: JSON.stringify(data)
    }),

  triggerSOS: (data) => 
    request("/api/contacts/sos/trigger", {
      method: "POST",
      body: JSON.stringify(data)
    }),

  getSMTPConfig: () => request("/api/contacts/config/smtp"),

  saveSMTPConfig: (data) =>
    request("/api/contacts/config/smtp", {
      method: "POST",
      body: JSON.stringify(data)
    }),

  // AI Assistant & Copilot
  sendAIChat: (message, history = [], language = "en") =>
    request("/api/ai/chat", {
      method: "POST",
      body: JSON.stringify({ message, history, language })
    }),

  getAIConfig: () => request("/api/ai/config"),

  saveAIConfig: (provider, api_key) =>
    request("/api/ai/config", {
      method: "POST",
      body: JSON.stringify({ provider, api_key })
    }),

  // Privacy Center
  getPrivacyStatus: () => request("/api/privacy/status"),
  clearSessionPrivacy: () => request("/api/privacy/clear", { method: "POST" })
};

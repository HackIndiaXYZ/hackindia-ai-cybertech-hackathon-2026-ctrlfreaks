// ScamSaathi State Management (Privacy-First & Session Bound)

export const store = {
  activeTab: "dashboard",
  sessionStats: {
    analysesCount: 0,
    tacticsFlaggedCount: 0,
    scenariosCompleted: 0,
    safetyScore: 100
  },
  currentMessageAnalysis: null,
  currentUrlAnalysis: null,
  currentScamDNA: null,
  recentActivity: [],
  honeyShieldProgress: {
    completedIds: [],
    score: 100
  },
  trustedContacts: [],
  safetyChecklist: {
    msg_verify_independently: false,
    msg_no_otp_share: false,
    msg_block_sender: false,
    msg_report_cybercrime: false
  },
  subscribers: [],

  subscribe(fn) {
    this.subscribers.push(fn);
    return () => {
      this.subscribers = this.subscribers.filter(s => s !== fn);
    };
  },

  notify() {
    for (const fn of this.subscribers) {
      try {
        fn(this);
      } catch (err) {
        console.error("Store subscriber error:", err);
      }
    }
  },

  setActiveTab(tabName) {
    this.activeTab = tabName;
    this.notify();
  },

  recordMessageAnalysis(result, snippet = "") {
    this.currentMessageAnalysis = result;
    this.sessionStats.analysesCount += 1;
    this.sessionStats.tacticsFlaggedCount += (result.psychological_tactics || []).length;
    
    this.recentActivity.unshift({
      id: Date.now(),
      type: "MESSAGE",
      risk_level: result.risk_level,
      score: result.risk_score,
      preview: snippet.slice(0, 70) + (snippet.length > 70 ? "..." : ""),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    if (this.recentActivity.length > 8) this.recentActivity.pop();

    this.notify();
  },

  recordUrlAnalysis(result) {
    this.currentUrlAnalysis = result;
    this.sessionStats.analysesCount += 1;
    this.recentActivity.unshift({
      id: Date.now(),
      type: "URL",
      risk_level: result.risk_level,
      score: result.risk_score,
      preview: result.domain,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    if (this.recentActivity.length > 8) this.recentActivity.pop();

    this.notify();
  },

  recordHoneyShieldProgress(scenarioId, scoreImpact) {
    if (!this.honeyShieldProgress.completedIds.includes(scenarioId)) {
      this.honeyShieldProgress.completedIds.push(scenarioId);
      this.sessionStats.scenariosCompleted += 1;
    }
    this.honeyShieldProgress.score = Math.max(0, Math.min(100, this.honeyShieldProgress.score + scoreImpact));
    this.sessionStats.safetyScore = this.honeyShieldProgress.score;
    this.notify();
  },

  resetHoneyShield() {
    this.honeyShieldProgress = { completedIds: [], score: 100 };
    this.sessionStats.scenariosCompleted = 0;
    this.sessionStats.safetyScore = 100;
    this.notify();
  },

  clearSession() {
    this.currentMessageAnalysis = null;
    this.currentUrlAnalysis = null;
    this.currentScamDNA = null;
    this.recentActivity = [];
    this.sessionStats.analysesCount = 0;
    this.sessionStats.tacticsFlaggedCount = 0;
    this.notify();
  }
};

/**
 * MULTI-AGENT COLLABORATIVE BUILDER ENGINE (V2 — Complete Tour to Contact)
 * Inspired by epic Figma/CAD live-authoring portfolios.
 * Simulates an autonomous swarm of 20 AI agents building, measuring, selecting,
 * and live-typing portfolio elements with blueprint rulers, smart guidelines,
 * live minimap radar, and a smooth journey that tours every section until
 * the grand finale at #contact just above the footer.
 */

export class AgentSwarmEngine {
  constructor(lenisInstance = null) {
    this.lenis = lenisInstance || window.lenis || null;
    this.agents = [];
    this.agentCount = 20;
    this.currentMode = 'touring'; // 'touring', 'paused', 'idle'
    this.blueprintActive = true;
    this.speedMultiplier = 1;
    this.layerCount = 204;
    this.builtLayers = 14;
    this.stage = 0;
    this.container = null;
    this.dock = null;
    this.boxesLayer = null;
    this.cursorsLayer = null;
    this.guidelinesLayer = null;
    this.minimap = null;
    this.animationFrameId = null;
    this.tourTimers = [];
    this.isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.agentProfiles = [
      { name: "Agent-01 (FastAPI)", color: "#00F0FF" },
      { name: "Agent-02 (RAG-Core)", color: "#C6FF3D" },
      { name: "Agent-03 (ChromaDB)", color: "#A855F7" },
      { name: "Agent-04 (Ollama-LLM)", color: "#FFB800" },
      { name: "Agent-05 (n8n-Flow)", color: "#FF5757" },
      { name: "Agent-06 (React-UI)", color: "#00E5FF" },
      { name: "Agent-07 (Canvas-2D)", color: "#10B981" },
      { name: "Agent-08 (Security)", color: "#EC4899" },
      { name: "Agent-09 (Embeddings)", color: "#3B82F6" },
      { name: "Agent-10 (Layout-Grid)", color: "#F59E0B" },
      { name: "Agent-11 (Type-System)", color: "#14B8A6" },
      { name: "Agent-12 (Motion-GSAP)", color: "#8B5CF6" },
      { name: "Agent-13 (Streamlit)", color: "#EF4444" },
      { name: "Agent-14 (BatchData)", color: "#84CC16" },
      { name: "Agent-15 (Slack-Hook)", color: "#06B6D4" },
      { name: "Agent-16 (Docker-Env)", color: "#6366F1" },
      { name: "Agent-17 (Vector-Idx)", color: "#D946EF" },
      { name: "Agent-18 (SQL-Engine)", color: "#EAB308" },
      { name: "Agent-19 (REST-Bridge)", color: "#22C55E" },
      { name: "Agent-20 (State-Store)", color: "#F97316" }
    ];
  }

  init() {
    if (this.isReduced) {
      this.blueprintActive = false;
      return;
    }

    this.createDomElements();
    this.createAgents();
    this.setupDockHandlers();
    this.setupScrollReactivity();
    this.startChoreography();
  }

  createDomElements() {
    // 1. Blueprint Rulers & Overlay Layer
    const overlay = document.createElement('div');
    overlay.id = 'blueprint-overlay';
    overlay.className = 'blueprint-overlay active';
    overlay.setAttribute('aria-hidden', 'true');

    overlay.innerHTML = `
      <!-- Top Horizontal Ruler -->
      <div class="ruler-top" id="ruler-top">
        <canvas id="ruler-top-canvas"></canvas>
      </div>
      <!-- Left Vertical Ruler -->
      <div class="ruler-left" id="ruler-left">
        <canvas id="ruler-left-canvas"></canvas>
      </div>

      <!-- Smart Guidelines Layer -->
      <div class="blueprint-guidelines-layer" id="blueprint-guidelines-layer"></div>

      <!-- Live Selection Bounding Boxes Container -->
      <div class="blueprint-boxes-layer" id="blueprint-boxes-layer"></div>

      <!-- Agent Cursors Container -->
      <div class="agent-cursors-layer" id="agent-cursors-layer"></div>

      <!-- Bottom-Left CAD Minimap Radar -->
      <div class="blueprint-minimap" id="blueprint-minimap">
        <div class="minimap-header">
          <span class="minimap-dot"></span>
          <span>SYSTEM RADAR // LAYERS</span>
        </div>
        <div class="minimap-viewport-indicator" id="minimap-viewport"></div>
        <div class="minimap-nodes">
          <span class="minimap-node node-home active"></span>
          <span class="minimap-node node-work"></span>
          <span class="minimap-node node-stats"></span>
          <span class="minimap-node node-showcase"></span>
          <span class="minimap-node node-about"></span>
          <span class="minimap-node node-journey"></span>
          <span class="minimap-node node-contact"></span>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    this.container = overlay;
    this.boxesLayer = document.getElementById('blueprint-boxes-layer');
    this.cursorsLayer = document.getElementById('agent-cursors-layer');
    this.guidelinesLayer = document.getElementById('blueprint-guidelines-layer');
    this.minimap = document.getElementById('blueprint-minimap');

    // 2. Bottom Floating Agent Dock Control Pill
    const dock = document.createElement('div');
    dock.id = 'agent-dock';
    dock.className = 'agent-dock';
    dock.setAttribute('role', 'region');
    dock.setAttribute('aria-label', 'Multi-Agent Collaborative System Toolbar');

    dock.innerHTML = `
      <div class="dock-inner">
        <!-- Agent Avatars Dots -->
        <div class="dock-avatars" title="20 Autonomous AI Agent Builders">
          ${this.agentProfiles.slice(0, 6).map(p => `
            <span class="dock-avatar-dot" style="background-color: ${p.color};"></span>
          `).join('')}
        </div>

        <!-- Progress and Status -->
        <div class="dock-status">
          <span class="dock-status-agents"><strong>20 agents</strong></span>
          <span class="dock-status-divider">|</span>
          <span class="dock-status-layers" id="dock-layers-count">14 / 204 layers</span>
        </div>

        <div class="dock-controls">
          <button type="button" class="dock-pill-btn active" id="dock-btn-tour" title="Toggle Auto Tour">
            <span class="dock-pulse-indicator"></span>
            <span id="dock-tour-label">Touring</span>
          </button>

          <button type="button" class="dock-pill-btn" id="dock-btn-speed" title="Toggle Speed">
            <span id="dock-speed-label">1x</span>
          </button>

          <button type="button" class="dock-pill-btn active" id="dock-btn-blueprint" title="Toggle Blueprint Rulers & Bounding Boxes">
            <span>Blueprint</span>
          </button>

          <button type="button" class="dock-pill-btn" id="dock-btn-replay" title="Rebuild Simulation from Start">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>
            <span>Rebuild</span>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(dock);
    this.dock = dock;

    this.renderRulers();
    window.addEventListener('resize', () => this.renderRulers(), { passive: true });
  }

  renderRulers() {
    const topCanvas = document.getElementById('ruler-top-canvas');
    const leftCanvas = document.getElementById('ruler-left-canvas');
    if (!topCanvas || !leftCanvas) return;

    const w = window.innerWidth;
    const h = window.innerHeight;

    // Top Ruler
    topCanvas.width = w * window.devicePixelRatio;
    topCanvas.height = 24 * window.devicePixelRatio;
    topCanvas.style.width = `${w}px`;
    topCanvas.style.height = `24px`;

    const ctxTop = topCanvas.getContext('2d');
    ctxTop.scale(window.devicePixelRatio, window.devicePixelRatio);
    ctxTop.fillStyle = '#0B0D13';
    ctxTop.fillRect(0, 0, w, 24);

    ctxTop.strokeStyle = 'rgba(0, 240, 255, 0.28)';
    ctxTop.fillStyle = 'rgba(0, 240, 255, 0.7)';
    ctxTop.font = '9px JetBrains Mono, monospace';

    for (let x = 0; x < w; x += 10) {
      const isMajor = x % 100 === 0;
      const isMid = x % 50 === 0;
      const tickH = isMajor ? 14 : (isMid ? 8 : 4);

      ctxTop.beginPath();
      ctxTop.moveTo(x + 0.5, 24 - tickH);
      ctxTop.lineTo(x + 0.5, 24);
      ctxTop.stroke();

      if (isMajor && x > 20) {
        ctxTop.fillText(`${x}`, x + 3, 12);
      }
    }

    // Left Ruler
    leftCanvas.width = 24 * window.devicePixelRatio;
    leftCanvas.height = h * window.devicePixelRatio;
    leftCanvas.style.width = `24px`;
    leftCanvas.style.height = `${h}px`;

    const ctxLeft = leftCanvas.getContext('2d');
    ctxLeft.scale(window.devicePixelRatio, window.devicePixelRatio);
    ctxLeft.fillStyle = '#0B0D13';
    ctxLeft.fillRect(0, 0, 24, h);

    ctxLeft.strokeStyle = 'rgba(0, 240, 255, 0.28)';
    ctxLeft.fillStyle = 'rgba(0, 240, 255, 0.7)';
    ctxLeft.font = '9px JetBrains Mono, monospace';

    for (let y = 0; y < h; y += 10) {
      const isMajor = y % 100 === 0;
      const isMid = y % 50 === 0;
      const tickW = isMajor ? 14 : (isMid ? 8 : 4);

      ctxLeft.beginPath();
      ctxLeft.moveTo(24 - tickW, y + 0.5);
      ctxLeft.lineTo(24, y + 0.5);
      ctxLeft.stroke();

      if (isMajor && y > 30) {
        ctxLeft.save();
        ctxLeft.translate(14, y + 10);
        ctxLeft.rotate(-Math.PI / 2);
        ctxLeft.fillText(`${y}`, 0, 0);
        ctxLeft.restore();
      }
    }
  }

  createAgents() {
    this.agents = [];
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    this.agentProfiles.forEach((profile, index) => {
      const el = document.createElement('div');
      el.className = 'agent-cursor';
      el.id = `agent-${index}`;

      el.innerHTML = `
        <svg class="agent-cursor-pointer" viewBox="0 0 16 16" fill="none">
          <polygon points="1,1 6,15 9,9 15,6" fill="${profile.color}" stroke="#0A0A0B" stroke-width="1.2"/>
        </svg>
        <span class="agent-cursor-badge" style="border-color: ${profile.color}; color: ${profile.color};">
          ${profile.name}
        </span>
      `;

      this.cursorsLayer.appendChild(el);

      this.agents.push({
        id: index,
        el,
        profile,
        x: centerX + (Math.random() - 0.5) * 60,
        y: centerY + (Math.random() - 0.5) * 60,
        targetX: centerX,
        targetY: centerY,
        vx: 0,
        vy: 0,
        angle: (index / this.agentProfiles.length) * Math.PI * 2,
        state: 'swarming'
      });
    });
  }

  startChoreography() {
    let startTime = performance.now();

    const loop = (time) => {
      if (this.currentMode !== 'paused') {
        const elapsed = (time - startTime) * 0.001 * this.speedMultiplier;
        this.updateSwarmPhysics(elapsed);
      }
      this.animationFrameId = requestAnimationFrame(loop);
    };

    this.animationFrameId = requestAnimationFrame(loop);

    // Start Phase 0: Intro Swarm
    this.scheduleStep(0, () => this.runIntroSwarm());
  }

  updateSwarmPhysics(elapsed) {
    this.agents.forEach((agent) => {
      let dx = agent.targetX - agent.x;
      let dy = agent.targetY - agent.y;

      // Smooth easing with velocity
      agent.vx = agent.vx * 0.84 + dx * 0.085;
      agent.vy = agent.vy * 0.84 + dy * 0.085;

      agent.x += agent.vx;
      agent.y += agent.vy;

      // Slight tilt in direction of movement
      const angleDeg = Math.min(Math.max(agent.vx * 1.5, -20), 20);

      agent.el.style.transform = `translate3d(${agent.x}px, ${agent.y}px, 0) rotate(${angleDeg}deg)`;
    });
  }

  clearTourTimers() {
    this.tourTimers.forEach(t => clearTimeout(t));
    this.tourTimers = [];
  }

  scheduleStep(delayMs, callback) {
    const adjustedDelay = delayMs / this.speedMultiplier;
    const timer = setTimeout(() => {
      if (this.currentMode !== 'paused') {
        callback();
      }
    }, adjustedDelay);
    this.tourTimers.push(timer);
  }

  scrollToSection(sectionId, callback) {
    const el = document.getElementById(sectionId);
    if (!el) {
      if (callback) callback();
      return;
    }

    this.updateMinimapActive(sectionId);

    if (this.lenis || window.lenis) {
      const activeLenis = this.lenis || window.lenis;
      activeLenis.scrollTo(el, { offset: -70, duration: 1.2 });
    } else {
      el.scrollIntoView({ behavior: 'smooth' });
    }

    this.scheduleStep(900, () => {
      if (callback) callback(el);
    });
  }

  updateMinimapActive(sectionId) {
    if (!this.minimap) return;
    this.minimap.querySelectorAll('.minimap-node').forEach(node => {
      node.classList.remove('active');
    });
    const targetNode = this.minimap.querySelector(`.node-${sectionId}`);
    if (targetNode) targetNode.classList.add('active');
  }

  // ==========================================================================
  // TOUR PHASES: HERO -> WORK -> STATS -> SHOWCASE -> ABOUT -> JOURNEY -> CONTACT
  // ==========================================================================

  /**
   * Phase 0: Intro Center Swarm
   */
  runIntroSwarm() {
    this.stage = 0;
    this.updateDockStatus(14, "Scanning system architecture...");
    this.updateMinimapActive('home');

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    this.agents.forEach((agent, i) => {
      const radius = i % 2 === 0 ? 85 : 140;
      const speed = i % 2 === 0 ? 0.035 : -0.028;

      const orbitTimer = setInterval(() => {
        if (this.stage !== 0) {
          clearInterval(orbitTimer);
          return;
        }
        agent.angle += speed * this.speedMultiplier;
        agent.targetX = centerX + Math.cos(agent.angle) * radius;
        agent.targetY = centerY + Math.sin(agent.angle) * radius;
      }, 16);
    });

    this.scheduleStep(2200, () => {
      this.runHeroConstruction();
    });
  }

  /**
   * Phase 1: #home (Hero Build)
   */
  runHeroConstruction() {
    this.stage = 1;
    this.clearOverlayArtifacts();

    const heroTitle = document.querySelector('.hero-title');
    const heroHandwritten = document.querySelector('.hero-handwritten');
    const heroPortrait = document.querySelector('.hero-portrait-wrap');
    const heroCtas = document.querySelector('.hero-cta-group');

    const heroElements = [
      { el: heroHandwritten, label: 'HANDWRITTEN_ACCENT [180x42]', agentIdx: 0 },
      { el: heroTitle, label: 'H1: MAITREY THAKAR [840x160]', agentIdx: 1 },
      { el: heroPortrait, label: 'LAYER: PORTRAIT_DEPTH [480x620]', agentIdx: 2 },
      { el: heroCtas, label: 'CTA_ACTION_CLUSTER [320x54]', agentIdx: 3 }
    ];

    heroElements.forEach((item) => {
      if (!item.el) return;
      const rect = item.el.getBoundingClientRect();
      this.createBoundingBox(rect, item.label, this.agentProfiles[item.agentIdx].color);
      this.createSmartGuidelines(rect);

      const agent = this.agents[item.agentIdx];
      if (agent) {
        agent.targetX = rect.left + rect.width * 0.85;
        agent.targetY = rect.top + rect.height * 0.85;
      }
    });

    // Scatter other agents across hero grid
    this.agents.slice(4).forEach((agent, i) => {
      agent.targetX = 60 + Math.random() * (window.innerWidth - 120);
      agent.targetY = 120 + Math.random() * (window.innerHeight - 200);
    });

    this.incrementLayers(14, 52, 2200, () => {
      this.scheduleStep(1600, () => this.runWorkTour());
    });
  }

  /**
   * Phase 2: #work (Projects Construction)
   */
  runWorkTour() {
    this.stage = 2;
    this.scrollToSection('work', (section) => {
      this.clearOverlayArtifacts();
      const cards = section.querySelectorAll('.project-card');
      const filterBtns = section.querySelectorAll('.filter-btn');

      // Agent 0 tests filter tabs
      if (filterBtns.length > 3 && this.agents[0]) {
        const btnRect = filterBtns[3].getBoundingClientRect(); // GenAI tab
        this.agents[0].targetX = btnRect.left + 25;
        this.agents[0].targetY = btnRect.top + 16;

        this.scheduleStep(700, () => {
          this.createClickRipple(this.agents[0].targetX, this.agents[0].targetY, this.agents[0].profile.color);
          filterBtns[3].click();
        });

        this.scheduleStep(2000, () => {
          const allBtnRect = filterBtns[0].getBoundingClientRect();
          this.agents[0].targetX = allBtnRect.left + 20;
          this.agents[0].targetY = allBtnRect.top + 16;
          this.scheduleStep(600, () => {
            this.createClickRipple(this.agents[0].targetX, this.agents[0].targetY, this.agents[0].profile.color);
            filterBtns[0].click();
          });
        });
      }

      // Highlight cards with bounding boxes
      cards.forEach((card, idx) => {
        if (idx < this.agents.length - 1) {
          const rect = card.getBoundingClientRect();
          const agent = this.agents[idx + 1];
          this.createBoundingBox(rect, `COMPONENT: ${card.querySelector('.project-card-title')?.textContent || 'CARD'}`, agent.profile.color);

          agent.targetX = rect.left + rect.width * 0.45 + (Math.random() - 0.5) * 30;
          agent.targetY = rect.top + rect.height * 0.35 + (Math.random() - 0.5) * 30;
        }
      });

      this.incrementLayers(52, 92, 2400, () => {
        this.scheduleStep(1800, () => this.runStatsTour());
      });
    });
  }

  /**
   * Phase 3: #stats (The Numbers Construction)
   */
  runStatsTour() {
    this.stage = 3;
    this.scrollToSection('stats', (section) => {
      this.clearOverlayArtifacts();
      const statCards = section.querySelectorAll('.stat-card');

      statCards.forEach((card, i) => {
        const rect = card.getBoundingClientRect();
        const agent = this.agents[i];
        this.createBoundingBox(rect, `METRIC_NODE: ${card.querySelector('.stat-label')?.textContent || 'DATA'}`, agent.profile.color);

        agent.targetX = rect.left + rect.width * 0.5;
        agent.targetY = rect.top + rect.height * 0.4;
      });

      // Scatter other agents to frame the section header
      const header = section.querySelector('.section-header');
      if (header) {
        const hRect = header.getBoundingClientRect();
        this.createBoundingBox(hRect, 'SECTION_HEADER: [THE NUMBERS]', '#C6FF3D');
        this.agents[5].targetX = hRect.left + 100;
        this.agents[5].targetY = hRect.top + 30;
      }

      this.incrementLayers(92, 126, 2200, () => {
        this.scheduleStep(1600, () => this.runShowcaseTour());
      });
    });
  }

  /**
   * Phase 4: #showcase (From Raw to Real Evolution)
   */
  runShowcaseTour() {
    this.stage = 4;
    this.scrollToSection('showcase', (section) => {
      this.clearOverlayArtifacts();
      const box = document.getElementById('comparison-box');
      const handle = document.getElementById('comparison-handle');

      if (box && handle) {
        const bRect = box.getBoundingClientRect();
        this.createBoundingBox(bRect, 'ARCHITECTURE_CANVAS: RAW_TO_REAL [SPLIT_VIEW]', '#00F0FF');
        this.createSmartGuidelines(bRect);

        // Agents 0 and 1 navigate to slider handle and demonstrate keyboard/drag slide
        const hRect = handle.getBoundingClientRect();
        this.agents[0].targetX = hRect.left + 20;
        this.agents[0].targetY = hRect.top + 100;
        this.agents[1].targetX = hRect.left + 20;
        this.agents[1].targetY = hRect.top + 180;

        // Slide left then right demonstration
        this.scheduleStep(600, () => {
          handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
          handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
          handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
        });

        this.scheduleStep(1400, () => {
          handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
          handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
          handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
          handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
        });
      }

      this.incrementLayers(126, 154, 2200, () => {
        this.scheduleStep(1800, () => this.runAboutTour());
      });
    });
  }

  /**
   * Phase 5: #about (Philosophy, Education & Skills)
   */
  runAboutTour() {
    this.stage = 5;
    this.scrollToSection('about', (section) => {
      this.clearOverlayArtifacts();
      const quoteCard = document.getElementById('about-quote-card');
      const bioText = document.getElementById('about-bio');
      const skillsTags = section.querySelectorAll('.skill-pill');
      const eduCards = section.querySelectorAll('.edu-card');

      if (quoteCard) {
        const qRect = quoteCard.getBoundingClientRect();
        this.createBoundingBox(qRect, 'ACCENT_QUOTE_PANEL [ELECTRIC_LIME]', '#C6FF3D');
        this.agents[0].targetX = qRect.left + 50;
        this.agents[0].targetY = qRect.top + 40;
      }

      if (bioText) {
        const bRect = bioText.getBoundingClientRect();
        const bioBox = this.createBoundingBox(bRect, 'TEXT_CONTAINER: BIO_STREAM', '#00F0FF');
        const caret = document.createElement('span');
        caret.className = 'blueprint-typing-caret';
        bioBox.appendChild(caret);

        this.agents[1].targetX = bRect.left + 80;
        this.agents[1].targetY = bRect.top + 28;
      }

      // Highlight education cards
      eduCards.forEach((edu, idx) => {
        if (this.agents[idx + 2]) {
          const eRect = edu.getBoundingClientRect();
          this.createBoundingBox(eRect, 'EDU_CREDENTIAL', this.agents[idx + 2].profile.color);
          this.agents[idx + 2].targetX = eRect.left + 40;
          this.agents[idx + 2].targetY = eRect.top + 20;
        }
      });

      // Scatter agents on skills
      skillsTags.forEach((pill, idx) => {
        if (idx < 6 && this.agents[idx + 5]) {
          const pRect = pill.getBoundingClientRect();
          this.agents[idx + 5].targetX = pRect.left + 15;
          this.agents[idx + 5].targetY = pRect.top + 10;
        }
      });

      this.incrementLayers(154, 180, 2200, () => {
        this.scheduleStep(1800, () => this.runJourneyTour());
      });
    });
  }

  /**
   * Phase 6: #journey (The Journey Timeline)
   */
  runJourneyTour() {
    this.stage = 6;
    this.scrollToSection('journey', (section) => {
      this.clearOverlayArtifacts();
      const timelineNodes = section.querySelectorAll('.timeline-node');

      timelineNodes.forEach((node, idx) => {
        if (this.agents[idx]) {
          const card = node.querySelector('.timeline-card');
          const cRect = card ? card.getBoundingClientRect() : node.getBoundingClientRect();
          const agent = this.agents[idx];

          this.createBoundingBox(cRect, `TIMELINE_NODE [${idx + 1}/5]`, agent.profile.color);
          agent.targetX = cRect.left + 40;
          agent.targetY = cRect.top + 25;
        }
      });

      this.incrementLayers(180, 198, 2200, () => {
        this.scheduleStep(1800, () => this.runContactFinaleTour());
      });
    });
  }

  /**
   * Phase 7: #contact (Grand Finale — Just Little Up Then The Footer)
   * The tour halts right here at #contact as requested!
   */
  runContactFinaleTour() {
    this.stage = 7;
    this.scrollToSection('contact', (section) => {
      this.clearOverlayArtifacts();
      const contactLinks = section.querySelectorAll('.contact-row');
      const sayHelloBtn = section.querySelector('.contact-cta-panel a');

      // Place bounding boxes on contact rows
      contactLinks.forEach((row, i) => {
        const rRect = row.getBoundingClientRect();
        this.createBoundingBox(rRect, `CONNECT_ENDPOINT: 0${i + 1}`, this.agentProfiles[i].color);
      });

      // Highlight "Say hello" CTA
      if (sayHelloBtn) {
        const btnRect = sayHelloBtn.getBoundingClientRect();
        this.createBoundingBox(btnRect, 'ACTION_TRIGGER: [SAY HELLO]', '#C6FF3D');
        this.createSmartGuidelines(btnRect);
      }

      // Grand Finale: All 20 agents converge in a dual-ring orbiting swarm
      // right around the Say Hello panel, just above the footer!
      const panel = section.querySelector('.contact-cta-panel');
      const targetRect = panel ? panel.getBoundingClientRect() : section.getBoundingClientRect();
      const cx = targetRect.left + targetRect.width / 2;
      const cy = targetRect.top + targetRect.height / 2;

      this.agents.forEach((agent, i) => {
        const radius = i % 2 === 0 ? 110 : 180;
        const speed = i % 2 === 0 ? 0.04 : -0.03;

        const finaleOrbit = setInterval(() => {
          if (this.stage !== 7) {
            clearInterval(finaleOrbit);
            return;
          }
          agent.angle += speed * this.speedMultiplier;
          agent.targetX = cx + Math.cos(agent.angle) * radius;
          agent.targetY = cy + Math.sin(agent.angle) * radius;
        }, 16);
      });

      // Final Layer Count Complete
      this.incrementLayers(198, 204, 1200, () => {
        this.updateDockStatus(204, "Rebuilt by 20 agents in 48.2s");
        
        const tourBtn = document.getElementById('dock-btn-tour');
        const tourLabel = document.getElementById('dock-tour-label');
        if (tourBtn && tourLabel) {
          tourBtn.classList.remove('active');
          tourLabel.textContent = "Re-Tour";
        }
      });
    });
  }

  // ==========================================================================
  // BLUEPRINT GRAPHICS & HELPERS
  // ==========================================================================

  createBoundingBox(rect, labelText, color = '#00F0FF') {
    const box = document.createElement('div');
    box.className = 'blueprint-bounding-box';
    box.style.left = `${rect.left + window.scrollX}px`;
    box.style.top = `${rect.top + window.scrollY}px`;
    box.style.width = `${rect.width}px`;
    box.style.height = `${rect.height}px`;
    box.style.borderColor = color;

    box.innerHTML = `
      <span class="box-tag" style="background-color: ${color}; color: #0A0A0B;">${labelText}</span>
      <span class="box-handle handle-tl" style="background-color: ${color};"></span>
      <span class="box-handle handle-tr" style="background-color: ${color};"></span>
      <span class="box-handle handle-bl" style="background-color: ${color};"></span>
      <span class="box-handle handle-br" style="background-color: ${color};"></span>
      <span class="box-crosshair">+</span>
    `;

    this.boxesLayer.appendChild(box);
    return box;
  }

  createSmartGuidelines(rect) {
    if (!this.guidelinesLayer) return;

    // Line to top ruler
    const guideX = document.createElement('div');
    guideX.className = 'blueprint-guideline-x';
    guideX.style.left = `${rect.left + rect.width / 2}px`;
    guideX.style.height = `${rect.top}px`;
    guideX.innerHTML = `<span class="coord-pill">X: ${Math.round(rect.left + rect.width / 2)}</span>`;
    this.guidelinesLayer.appendChild(guideX);

    // Line to left ruler
    const guideY = document.createElement('div');
    guideY.className = 'blueprint-guideline-y';
    guideY.style.top = `${rect.top + rect.height / 2}px`;
    guideY.style.width = `${rect.left}px`;
    guideY.innerHTML = `<span class="coord-pill">Y: ${Math.round(rect.top + rect.height / 2)}</span>`;
    this.guidelinesLayer.appendChild(guideY);
  }

  clearOverlayArtifacts() {
    if (this.boxesLayer) this.boxesLayer.innerHTML = '';
    if (this.guidelinesLayer) this.guidelinesLayer.innerHTML = '';
  }

  createClickRipple(x, y, color = '#00F0FF') {
    const ripple = document.createElement('div');
    ripple.className = 'agent-click-ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.borderColor = color;
    this.cursorsLayer.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  }

  incrementLayers(from, to, duration, callback) {
    const layersEl = document.getElementById('dock-layers-count');
    if (!layersEl) return;

    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / (duration / this.speedMultiplier), 1);
      const current = Math.round(from + (to - from) * progress);
      layersEl.textContent = `${current} / ${this.layerCount} layers`;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else if (callback) {
        callback();
      }
    };
    requestAnimationFrame(step);
  }

  updateDockStatus(layers, text) {
    const layersEl = document.getElementById('dock-layers-count');
    if (layersEl) layersEl.textContent = `${layers} / ${this.layerCount} layers`;
  }

  setupDockHandlers() {
    const btnTour = document.getElementById('dock-btn-tour');
    const btnSpeed = document.getElementById('dock-btn-speed');
    const btnBlueprint = document.getElementById('dock-btn-blueprint');
    const btnReplay = document.getElementById('dock-btn-replay');
    const tourLabel = document.getElementById('dock-tour-label');
    const speedLabel = document.getElementById('dock-speed-label');

    // Toggle Tour
    btnTour?.addEventListener('click', () => {
      if (this.currentMode === 'touring') {
        this.currentMode = 'paused';
        btnTour.classList.remove('active');
        tourLabel.textContent = "Paused";
        this.clearTourTimers();
      } else {
        this.currentMode = 'touring';
        btnTour.classList.add('active');
        tourLabel.textContent = "Touring";
        if (this.stage === 7) {
          this.runHeroConstruction();
        }
      }
    });

    // Speed Multiplier (1x -> 2x -> 0.5x)
    btnSpeed?.addEventListener('click', () => {
      if (this.speedMultiplier === 1) {
        this.speedMultiplier = 2;
        speedLabel.textContent = "2x";
      } else if (this.speedMultiplier === 2) {
        this.speedMultiplier = 0.5;
        speedLabel.textContent = "0.5x";
      } else {
        this.speedMultiplier = 1;
        speedLabel.textContent = "1x";
      }
    });

    // Toggle Blueprint Overlay (Rulers & Bounding boxes)
    btnBlueprint?.addEventListener('click', () => {
      this.blueprintActive = !this.blueprintActive;
      btnBlueprint.classList.toggle('active', this.blueprintActive);
      this.container.classList.toggle('active', this.blueprintActive);
    });

    // Replay / Rebuild
    btnReplay?.addEventListener('click', () => {
      this.clearTourTimers();
      this.clearOverlayArtifacts();
      this.scrollToSection('home');
      this.currentMode = 'touring';
      btnTour?.classList.add('active');
      if (tourLabel) tourLabel.textContent = "Touring";
      this.scheduleStep(600, () => {
        this.runIntroSwarm();
      });
    });
  }

  setupScrollReactivity() {
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollY = window.scrollY;
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = Math.min(Math.max(scrollY / totalHeight, 0), 1);

        // Update minimap indicator
        const minimapIndicator = document.getElementById('minimap-viewport');
        if (minimapIndicator) {
          minimapIndicator.style.top = `${progress * 80}%`;
        }
      }, 50);
    }, { passive: true });
  }
}

export function initAgentSwarm(lenisInstance) {
  const swarm = new AgentSwarmEngine(lenisInstance);
  swarm.init();
  return swarm;
}

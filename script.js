// Main Application Controller & Interactive Logic
import { PROJECTS, CLIENT_WORK, ACHIEVEMENTS, SKILLS_DATA, EDUCATION_DATA, TEAM_MEMBERS, MORE_BUILDS } from './data.js';

// DOM Elements
const docEl = document.documentElement;
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Mark JS readiness for progressive enhancement
docEl.classList.add('js-ready');

/* ==========================================================================
   1. THEME CONTROLLER (Dark / Light with persistence & system preference)
   ========================================================================== */
function initTheme() {
  const savedTheme = localStorage.getItem('portfolio_theme');
  if (savedTheme) {
    docEl.setAttribute('data-theme', savedTheme);
  } else {
    const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    docEl.setAttribute('data-theme', sysDark ? 'dark' : 'light');
  }

  const toggleBtns = document.querySelectorAll('.theme-toggle');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const current = docEl.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      docEl.setAttribute('data-theme', next);
      localStorage.setItem('portfolio_theme', next);
      updateCanvasColors();
    });
  });

  // System theme change listener
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('portfolio_theme')) {
      const next = e.matches ? 'dark' : 'light';
      docEl.setAttribute('data-theme', next);
      updateCanvasColors();
    }
  });
}

/* ==========================================================================
   2. SCROLL REVEALS & METRIC COUNTERS
   ========================================================================== */
function initScrollReveals() {
  if (prefersReduced || !('IntersectionObserver' in window)) {
    document.querySelectorAll('[data-r]').forEach(el => el.classList.add('in'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('[data-r]').forEach(el => observer.observe(el));

  // Metric counter
  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      obs.unobserve(entry.target);
      const counterEl = entry.target.querySelector('[data-count]');
      if (!counterEl) return;

      const targetVal = parseFloat(counterEl.dataset.count);
      const startTime = performance.now();
      const duration = 1200;

      function updateCounter(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const easeVal = 1 - Math.pow(1 - progress, 3);
        counterEl.textContent = (targetVal * easeVal).toFixed(1);
        if (progress < 1) requestAnimationFrame(updateCounter);
      }
      requestAnimationFrame(updateCounter);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.metric-item').forEach(el => counterObserver.observe(el));
}

/* ==========================================================================
   3. HERO CANVAS SCULPTURE (Cached styles & off-screen pause)
   ========================================================================== */
let updateCanvasColors = () => {};

function initHeroCanvas() {
  const canvas = document.getElementById('sculpt');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height, dpr = Math.min(window.devicePixelRatio || 1, 2);
  let mouseX = 0, mouseY = 0, time = 0;
  let isVisible = true;
  let cachedStroke = '#eceae4';

  function refreshColors() {
    cachedStroke = getComputedStyle(docEl).getPropertyValue('--ink').trim() || '#eceae4';
  }
  refreshColors();
  updateCanvasColors = refreshColors;

  function resize() {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  window.addEventListener('pointermove', e => {
    mouseX = (e.clientX / window.innerWidth) - 0.5;
    mouseY = (e.clientY / window.innerHeight) - 0.5;
  }, { passive: true });

  const visObserver = new IntersectionObserver(entries => {
    isVisible = entries[0].isIntersecting;
    if (isVisible && !prefersReduced) requestAnimationFrame(render);
  });
  visObserver.observe(canvas);

  const rings = window.innerWidth < 700 ? 9 : 14;
  const nodes = window.innerWidth < 700 ? 18 : 26;

  function render() {
    if (!isVisible || prefersReduced) return;
    time += 0.0035;
    ctx.clearRect(0, 0, width, height);

    const isSmall = width < 700;
    const cx = width * (isSmall ? 0.5 : 0.68) + mouseX * 24;
    const cy = height * (isSmall ? 0.28 : 0.42) + mouseY * 18;
    const scale = Math.min(width, height) * (isSmall ? 0.35 : 0.38);

    const ax = 0.9 + mouseY * 0.25;
    const ay = time + mouseX * 0.4;
    const pointRings = [];

    for (let r = 0; r < rings; r++) {
      const yNorm = (r / (rings - 1) - 0.5) * 2;
      const radius = Math.sqrt(Math.max(0, 1 - yNorm * yNorm)) * (0.6 + 0.4 * Math.sin(r * 0.6 + time * 1.8) * 0.5);
      const ring = [];

      for (let n = 0; n < nodes; n++) {
        const angle = (n / nodes) * Math.PI * 2 + r * 0.16;
        const px = Math.cos(angle) * radius;
        const py = yNorm * 1.1;
        const pz = Math.sin(angle) * radius;

        const x1 = px * Math.cos(ay) - pz * Math.sin(ay);
        const z1 = px * Math.sin(ay) + pz * Math.cos(ay);
        const y2 = py * Math.cos(ax) - z1 * Math.sin(ax);
        const z2 = py * Math.sin(ax) + z1 * Math.cos(ax);

        const factor = 1 / (1.8 - z2 * 0.5);
        ring.push({
          x: cx + x1 * scale * factor,
          y: cy + y2 * scale * factor,
          z: z2
        });
      }
      pointRings.push(ring);
    }

    ctx.lineWidth = 1;
    pointRings.forEach((ring, idx) => {
      ctx.beginPath();
      ring.forEach((pt, pIdx) => (pIdx === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y)));
      ctx.closePath();
      ctx.strokeStyle = cachedStroke;
      ctx.globalAlpha = 0.14;
      ctx.stroke();

      if (idx > 0) {
        for (let j = 0; j < nodes; j += 2) {
          ctx.beginPath();
          ctx.moveTo(ring[j].x, ring[j].y);
          ctx.lineTo(pointRings[idx - 1][j].x, pointRings[idx - 1][j].y);
          ctx.globalAlpha = 0.06;
          ctx.stroke();
        }
      }

      ring.forEach((pt, jIdx) => {
        if ((idx * 3 + jIdx) % 7 === 0) {
          ctx.globalAlpha = 0.35 + pt.z * 0.4;
          ctx.fillStyle = (idx + jIdx) % 5 === 0 ? '#c9984f' : '#5b8cff';
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    });

    ctx.globalAlpha = 1;
    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   4. IMPOSTR COMPACT SCROLL INTERACTION (3-4 Stages, ~120vh)
   ========================================================================== */
function initImpostrInteraction() {
  const wrapper = document.querySelector('.impostr-scroll-wrapper');
  const simUrl = document.getElementById('simUrl');
  const panels = document.querySelectorAll('.stage-panel');
  const segments = document.querySelectorAll('.progress-segment');
  const stageCounter = document.getElementById('stageCounter');
  const stageName = document.getElementById('stageName');

  if (!wrapper || prefersReduced) return;

  const STAGES = [
    { title: "Target Identification", text: "suspicious-link.example/login" },
    { title: "Telemetry & DNS Lookups", text: "crt.sh / DNS / WHOIS verification" },
    { title: "Feeds Cross-Referencing", text: "URLhaus · OpenPhish · PhishTank" },
    { title: "Forensic Scoring & Verdict", text: "Risk index: 88/100 (Phishing)" }
  ];

  let ticking = false;

  function updateScroll() {
    ticking = false;
    const rect = wrapper.getBoundingClientRect();
    const scrollProgress = Math.min(1, Math.max(0, -rect.top / (rect.height - window.innerHeight)));

    const stageIdx = Math.min(3, Math.floor(scrollProgress * 4));

    if (stageCounter) stageCounter.textContent = `0${stageIdx + 1} / 04`;
    if (stageName) stageName.textContent = STAGES[stageIdx].title;

    if (simUrl) {
      const typePercent = Math.min(100, Math.max(0, scrollProgress * 300));
      simUrl.style.clipPath = `inset(0 ${100 - typePercent}% 0 0)`;
    }

    panels.forEach((p, idx) => {
      p.classList.toggle('active', idx === stageIdx);
    });

    segments.forEach((s, idx) => {
      s.classList.toggle('active', idx <= stageIdx);
    });
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateScroll);
    }
  }, { passive: true });

  updateScroll();
}

/* ==========================================================================
   5. CASE STUDY MODAL ENGINE (Accessible dialog with focus trapping)
   ========================================================================== */
function initCaseStudyModal() {
  const modalBackdrop = document.getElementById('caseStudyModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const modalContent = document.getElementById('modalDynamicContent');
  let previouslyFocused = null;

  if (!modalBackdrop) return;

  function openModal(projectId) {
    const project = PROJECTS.find(p => p.id === projectId);
    if (!project || !project.caseStudy) return;

    previouslyFocused = document.activeElement;

    const cs = project.caseStudy;
    let decisionsHtml = '';
    if (cs.decisions && cs.decisions.length) {
      decisionsHtml = `
        <div class="modal-section">
          <h4>Key Engineering Decisions</h4>
          <div class="decisions-grid">
            ${cs.decisions.map(d => `
              <div class="decision-card">
                <h5>${d.title}</h5>
                <p>${d.detail}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    let plannedHtml = '';
    if (cs.implementedVsPlanned) {
      plannedHtml = `
        <div class="modal-section">
          <h4>Feature Breakdown (Implemented vs Planned)</h4>
          <div class="planned-grid">
            <div class="planned-col">
              <h5 style="color:var(--acc)">Implemented in Repository</h5>
              <ul>
                ${cs.implementedVsPlanned.implemented.map(i => `<li>${i}</li>`).join('')}
              </ul>
            </div>
            <div class="planned-col">
              <h5 style="color:var(--mute)">Planned / Next Milestones</h5>
              <ul>
                ${cs.implementedVsPlanned.planned.map(i => `<li>${i}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>
      `;
    }

    modalContent.innerHTML = `
      <div class="modal-meta-top" style="display:flex; gap:8px; margin-bottom:12px;">
        <span class="badge ${project.statusType === 'live' ? 'badge-live' : 'badge-dev'}">${project.status}</span>
        ${project.awardBadge ? `<span class="badge badge-award">${project.awardBadge}</span>` : ''}
      </div>
      <h3 style="font-size:clamp(28px, 4vw, 44px); margin:8px 0 16px;">${project.title} — Case Study</h3>
      <p style="color:var(--mute); font-size:16px;">${project.summary}</p>
      
      <div class="modal-section">
        <h4>The Problem</h4>
        <p>${cs.problem}</p>
      </div>

      <div class="modal-section">
        <h4>Architecture &amp; Solution Flow</h4>
        <p>${cs.solution}</p>
        <div class="arch-diagram-wrapper">
          ${cs.architectureSvg || ''}
        </div>
      </div>

      <div class="modal-section">
        <h4>My Specific Contribution</h4>
        <p>${cs.contribution}</p>
      </div>

      ${decisionsHtml}
      ${plannedHtml}

      <div class="modal-section">
        <h4>Evidence &amp; Verification</h4>
        <p>${cs.evidence}</p>
      </div>

      <div class="modal-section">
        <h4>Current Limitations &amp; Next Steps</h4>
        <p><strong>Limitations:</strong> ${cs.limitations}</p>
        <p><strong>Next steps:</strong> ${cs.nextSteps}</p>
      </div>
    `;

    modalBackdrop.classList.add('open');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lock');

    setTimeout(() => closeBtn.focus(), 50);
  }

  function closeModal() {
    modalBackdrop.classList.remove('open');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lock');
    if (previouslyFocused) previouslyFocused.focus();
  }

  // Delegate clicks on case study trigger buttons
  document.addEventListener('click', e => {
    const trigger = e.target.closest('[data-case-study]');
    if (trigger) {
      e.preventDefault();
      openModal(trigger.dataset.caseStudy);
    }
  });

  closeBtn.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', e => {
    if (e.target === modalBackdrop) closeModal();
  });

  window.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
      closeModal();
    }
  });

  // Focus trap inside modal
  modalBackdrop.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const focusables = modalBackdrop.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
}

/* ==========================================================================
   6. PROOF CERTIFICATE MODAL
   ========================================================================== */
function initProofModal() {
  const modal = document.getElementById('proofModal');
  const closeBtn = document.getElementById('proofCloseBtn');
  const imgEl = document.getElementById('proofModalImg');
  const titleEl = document.getElementById('proofModalTitle');
  let prevFocus = null;

  if (!modal) return;

  function openProof(src, title) {
    prevFocus = document.activeElement;
    imgEl.src = src;
    imgEl.alt = title;
    titleEl.textContent = title;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lock');
    setTimeout(() => closeBtn.focus(), 50);
  }

  function closeProof() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lock');
    if (prevFocus) prevFocus.focus();
  }

  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-view-proof]');
    if (btn) {
      e.preventDefault();
      openProof(btn.dataset.viewProof, btn.dataset.proofTitle || "Proof of Achievement");
    }
  });

  closeBtn.addEventListener('click', closeProof);
  modal.addEventListener('click', e => {
    if (e.target === modal) closeProof();
  });

  window.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeProof();
  });

  // Focus trap
  modal.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const focusables = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
}

/* ==========================================================================
   7. SKILLS ACCORDION (Semantic buttons with ARIA states)
   ========================================================================== */
function initSkillsAccordion() {
  const container = document.getElementById('skillsAccordionContainer');
  if (!container) return;

  container.innerHTML = SKILLS_DATA.map((group, idx) => `
    <div class="accordion-group ${idx === 0 ? 'is-open' : ''}">
      <button type="button" class="accordion-trigger" 
              id="skill-btn-${group.id}" 
              aria-expanded="${idx === 0 ? 'true' : 'false'}" 
              aria-controls="skill-panel-${group.id}">
        <span>${group.category}</span>
        <span class="accordion-icon" aria-hidden="true">+</span>
      </button>
      <div id="skill-panel-${group.id}" 
           class="accordion-content" 
           role="region" 
           aria-labelledby="skill-btn-${group.id}">
        <ul class="skill-pills-list">
          ${group.skills.map(s => `
            <li>
              ${s.project ? `
                <a href="#${s.project === 'impostr' ? 'projects' : s.project === 'dormex' ? 'projects' : s.project === 'lucerna' ? 'projects' : s.project}" class="skill-pill-link">
                  <span>${s.name}</span>
                  <small>↗ ${s.projectName}</small>
                </a>
              ` : `
                <span class="skill-pill-link" style="cursor:default">
                  <span>${s.name}</span>
                  <small>• ${s.projectName}</small>
                </span>
              `}
            </li>
          `).join('')}
        </ul>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.accordion-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.accordion-group');
      const isOpen = group.classList.contains('is-open');

      group.classList.toggle('is-open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  });
}

/* ==========================================================================
   8. CERTIFICATES & LEARNING RENDERER
   ========================================================================== */
function initCertificatesRenderer() {
  const container = document.getElementById('certCardsContainer');
  if (!container) return;

  const certCategory = ACHIEVEMENTS.categories.find(c => c.name === "Certifications & Learning");
  if (!certCategory || !certCategory.items) return;

  container.innerHTML = certCategory.items.map(cert => `
    <article class="cert-card">
      <div class="cert-card-header">
        <div>
          <h4>${cert.title}</h4>
          <span class="cert-issuer">${cert.organization} ${cert.score ? `· Score: ${cert.score}` : ''}</span>
        </div>
        <span class="mono" style="font-size:12px; color:var(--mute); white-space:nowrap;">${cert.date}</span>
      </div>
      <p class="cert-summary">${cert.summary}</p>
      <div class="cert-card-footer">
        <span class="mono" style="color:var(--mute); font-size:11px;">${cert.proofType}</span>
        ${cert.proofLink ? `
          <a class="btn sm outline-acc" href="${cert.proofLink}" target="_blank" rel="noopener noreferrer">
            View proof ↗
          </a>
        ` : `
          <span class="mono" style="color:var(--mute); font-size:11px;">Completed</span>
        `}
      </div>
    </article>
  `).join('');
}

/* ==========================================================================
   9. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const menu = document.getElementById('mobileMenu');
  if (!toggleBtn || !menu) return;

  function toggle(open) {
    const shouldOpen = open !== undefined ? open : !menu.classList.contains('open');
    menu.classList.toggle('open', shouldOpen);
    toggleBtn.classList.toggle('open', shouldOpen);
    toggleBtn.setAttribute('aria-expanded', String(shouldOpen));
    toggleBtn.setAttribute('aria-label', shouldOpen ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('lock', shouldOpen);
  }

  toggleBtn.addEventListener('click', () => toggle());

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle(false);
    });
  });

  window.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('open')) toggle(false);
  });
}

/* ==========================================================================
   10. MARQUEE SCROLL CONTROLLER
   ========================================================================== */
function initMarquee() {
  const rows = [...document.querySelectorAll('.marquee-row')];
  if (!rows.length || prefersReduced) return;

  let ticking = false;

  function onScroll() {
    ticking = false;
    const h = window.innerHeight;

    rows.forEach(r => {
      const rc = r.getBoundingClientRect();
      const d = (rc.top + rc.height / 2 - h / 2) / h;
      const w = r.scrollWidth - window.innerWidth;
      const dir = parseFloat(r.dataset.d || '1');

      if (dir > 0) {
        r.style.transform = `translate3d(${-w * Math.max(0, Math.min(1, 0.5 - d * 0.9))}px, 0, 0)`;
      } else {
        r.style.transform = `translate3d(${-w * Math.max(0, Math.min(1, 0.5 + d * 0.9))}px, 0, 0)`;
      }

      r.classList.toggle('active', Math.abs(d) < 0.35);
    });
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onScroll);
    }
  }, { passive: true });

  onScroll();
}

/* ==========================================================================
   11. TERMINAL (SAUGAT.OS) — XSS Fixed, Escaped Inputs & Full Trapping
   ========================================================================== */
function initTerminal() {
  const term = document.getElementById('term');
  const out = document.getElementById('terminalOutput');
  const inp = document.getElementById('terminalInput');
  const openBtns = [document.getElementById('osNavBtn'), document.getElementById('osMobileBtn')].filter(Boolean);
  const closeBtn = document.getElementById('termCloseBtn');

  if (!term || !out || !inp) return;

  let history = [];
  let histIdx = 0;
  let isBooted = false;
  let prevFocus = null;

  // Safe HTML escape helper
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function printLine(html) {
    const line = document.createElement('div');
    line.innerHTML = html;
    out.appendChild(line);
    out.scrollTop = out.scrollHeight;
  }

  const COMMANDS = {
    help: () => `Available commands:
  about         - About Saugat Rauniyar
  whoami        - System persona summary
  skills        - Full technology breakdown
  projects      - List flagship engineering projects
  achievements  - HackaFest 2026 award details & timeline
  impostr       - Inspect IMPOSTR threat analysis platform
  lucerna       - Inspect LUCERNA human-in-the-loop workstation
  dormex        - Inspect DORMEX hostel allocation system
  clients       - Real client websites (Capital Marketing & ShubhLabh)
  writing       - Technical Medium article on web threat engine
  resume        - Download or open verified PDF resume
  education     - SIT CGPA & academic background
  contact       - Direct email and phone
  social        - GitHub, LinkedIn, Medium profiles
  neofetch      - System summary info
  clear         - Clear terminal console
  gui           - Exit terminal and return to page
  open &lt;id&gt;    - Jump directly to section (e.g. open impostr)`,

    about: () => `Saugat Rauniyar — Computer Science student building intelligent software,
cybersecurity tools, and practical web platforms across AI, threat intelligence, and systems.`,

    whoami: () => `<span style="color:var(--acc)">SAUGAT RAUNIYAR</span>
Role: Software Engineer · Cybersecurity Builder · AI Enthusiast
Institution: Siddaganga Institute of Technology (CSE @ SIT)
Academic Standing: CGPA 9.5 / 10.0
Focus: AI Telemetry, Web Forensics, Full-Stack Systems`,

    skills: () => SKILLS_DATA.map(g => `<span style="color:var(--acc)">${g.category}</span>\n  ${g.skills.map(s => s.name).join(', ')}`).join('\n\n'),

    projects: () => `01 — IMPOSTR (Live · HackaFest 2026 3rd Place)
02 — LUCERNA (In development · Healthcare AI & Human-in-the-loop)
03 — DORMEX (In development · Student Hostel Management Platform)

More builds:
  - AI Quiz Generator
  - Vehicle Number Plate Detection / Parking System
  - ATM Management System
  - Obstacle Avoiding Robot
  - Student Portfolio Dashboard
  - Wearable SpO₂ Monitoring System

Type "impostr", "lucerna", or "dormex" for comprehensive specs.`,

    impostr: () => `<span style="color:var(--bronze)">IMPOSTR</span> — AI Threat Analysis Platform
Category: Cybersecurity · Threat Intelligence · AI
Award: 3rd Place — HackaFest 2026 (Biratnagar International College)
Telemetry: URLhaus, PhishTank, OpenPhish, crt.sh, DNS/WHOIS/SSL
Live Demo: <a href="https://impostr-virid.vercel.app/" target="_blank" rel="noopener">impostr-virid.vercel.app ↗</a>
Source Code: <a href="https://github.com/saugat2737/Impostr" target="_blank" rel="noopener">github.com/saugat2737/Impostr ↗</a>`,

    lucerna: () => `<span style="color:var(--acc)">LUCERNA</span> — Radiological Imaging Workstation
Category: Healthcare AI · Human-in-the-Loop Review
Status: In development
Notice: Prototype under development, not a clinically validated diagnostic product.
Focus: Clinician auditability, spatial confidence heatmaps, manual override ergonomics.`,

    dormex: () => `<span style="color:var(--acc)">DORMEX</span> — Campus Accommodation Engine
Category: Full-Stack · Workflow Automation · Student Services
Status: In development
GitHub: <a href="https://github.com/saugat2737/DORMEX" target="_blank" rel="noopener">github.com/saugat2737/DORMEX ↗</a>
Core: PostgreSQL partial unique index concurrency locks, server-authoritative turn scheduler.`,

    clients: () => `Capital Marketing: <a href="https://capitalmarketingnp.com" target="_blank" rel="noopener">capitalmarketingnp.com ↗</a> (<a href="https://github.com/saugat2737/capitalmarketingnp" target="_blank" rel="noopener">Repo ↗</a>)
ShubhLabh Construction: <a href="https://shubhlabhconstruction.com.np/" target="_blank" rel="noopener">shubhlabhconstruction.com.np ↗</a> (<a href="https://github.com/saugat2737/shubhlabhconstruction" target="_blank" rel="noopener">Repo ↗</a>)`,

    achievements: () => `<span style="color:var(--bronze)">3rd Place · HackaFest 2026</span>
Awarded by: Biratnagar International College
Project: IMPOSTR (Team Incognitus)
Verified certificate available in the achievements archive.`,

    writing: () => `Medium Article: "From URL to Verdict: Constructing a Multi-Vector Web Threat Forensics Engine"
Read: <a href="https://medium.com/@saugat.rauniyar.work/from-url-to-verdict-constructing-a-multi-vector-web-threat-forensics-engine-c9eb4722d352" target="_blank" rel="noopener">medium.com/@saugat.rauniyar.work/... ↗</a>`,

    resume: () => `<a href="./assets/final-saugat-resume.pdf" target="_blank" rel="noopener">[OPEN RESUME PDF ↗]</a>  <a href="./assets/final-saugat-resume.pdf" download>[DOWNLOAD RESUME]</a>`,

    education: () => `Siddaganga Institute of Technology
  B.E. Computer Science and Engineering, 2025 — 2029, CGPA 9.5

Shikshadeep Higher Secondary School, Biratnagar
  Science, 2023 — 2025, GPA 3.46 / 4.0

DAV School, Biratnagar
  Secondary, 2023, GPA 3.14 / 4.0`,

    contact: () => `Email: saugat.rauniyar.work@gmail.com
Phone: +91 8050812045
GitHub: github.com/saugat2737
LinkedIn: linkedin.com/in/saugat-rauniyar`,

    social: () => `GitHub: <a href="https://github.com/saugat2737" target="_blank" rel="noopener">github.com/saugat2737 ↗</a>
LinkedIn: <a href="https://www.linkedin.com/in/saugat-rauniyar" target="_blank" rel="noopener">linkedin.com/in/saugat-rauniyar ↗</a>
Medium: <a href="https://medium.com/@saugat.rauniyar.work/" target="_blank" rel="noopener">medium.com/@saugat.rauniyar.work/ ↗</a>`,

    neofetch: () => `SAUGAT
────────────────────
OS: SAUGAT.OS
Role: Software Engineer
Focus: AI / Security / Full Stack
Education: CSE @ SIT
CGPA: 9.5
HackaFest: 3rd Place
Certifications: APIsec ACP (93/100), NVIDIA, Anthropic, Infosys
Status: Building...`,

    gui: () => {
      closeTerminal();
      return '';
    },

    clear: () => {
      out.innerHTML = '';
      return '';
    }
  };

  function execute(raw) {
    const trimmed = raw.trim();
    if (!trimmed) return;
    history.push(trimmed);
    histIdx = history.length;

    // Safe command echo
    printLine(`<span style="color:var(--acc)">saugat@saugatrauniyar:~$</span> ${escapeHtml(trimmed)}`);

    const lower = trimmed.toLowerCase();

    // Handle "open <target>" navigation safely
    if (lower.startsWith('open ')) {
      const target = lower.slice(5).trim();
      const sectionMap = {
        impostr: 'projects',
        lucerna: 'projects',
        dormex: 'projects',
        projects: 'projects',
        clients: 'clients',
        achievements: 'achievements',
        writing: 'writing',
        resume: 'skills-education',
        skills: 'skills-education',
        contact: 'contact'
      };

      if (sectionMap[target]) {
        printLine(`<span style="color:var(--mute)">Navigating to ${escapeHtml(target)}...</span>`);
        setTimeout(() => {
          closeTerminal();
          const el = document.getElementById(sectionMap[target]);
          if (el) el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
        }, 300);
        return;
      } else {
        printLine(`Target unknown: "${escapeHtml(target)}". Valid targets: projects, impostr, lucerna, dormex, clients, achievements, writing, resume, contact.`);
        return;
      }
    }

    if (COMMANDS[lower]) {
      const res = COMMANDS[lower]();
      if (res) printLine(res);
      return;
    }

    printLine(`Command not found: "${escapeHtml(trimmed)}". Type "help" to see valid commands.`);
  }

  function boot() {
    isBooted = true;
    printLine(`┌──────────────────────────────────────────────┐
│ <span style="color:var(--acc)">SAUGAT.OS (v2.6)</span>                             │
│ Interactive Portfolio Terminal Engine        │
│                                              │
│ Type "help" for command directory.           │
│ Type "gui" or press ESC to return.           │
└──────────────────────────────────────────────┘`);
  }

  function openTerminal() {
    prevFocus = document.activeElement;
    term.classList.add('open');
    term.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lock');
    if (!isBooted) boot();
    setTimeout(() => inp.focus(), 60);
  }

  function closeTerminal() {
    term.classList.remove('open');
    term.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lock');
    if (prevFocus) prevFocus.focus();
  }

  openBtns.forEach(btn => btn.addEventListener('click', openTerminal));
  if (closeBtn) closeBtn.addEventListener('click', closeTerminal);

  term.addEventListener('click', e => {
    if (e.target === term) closeTerminal();
  });

  window.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      term.classList.contains('open') ? closeTerminal() : openTerminal();
    }
    if (e.key === 'Escape' && term.classList.contains('open')) {
      closeTerminal();
    }
  });

  inp.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const val = inp.value;
      inp.value = '';
      execute(val);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (histIdx > 0) {
        histIdx--;
        inp.value = history[histIdx] || '';
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx < history.length - 1) {
        histIdx++;
        inp.value = history[histIdx] || '';
      } else {
        histIdx = history.length;
        inp.value = '';
      }
    }
  });

  // Focus trap inside terminal
  term.addEventListener('keydown', e => {
    if (e.key === 'Tab') {
      e.preventDefault();
      inp.focus();
    }
  });
}

/* ==========================================================================
   11. SR MONOGRAM CINEMATIC INTRO CONTROLLER
   ========================================================================== */
function initSrIntro() {
  const overlay = document.getElementById('srIntroOverlay');
  if (!overlay) return;

  // Respect prefers-reduced-motion
  if (prefersReduced) {
    overlay.classList.add('dismissed');
    setTimeout(() => {
      overlay.remove();
    }, 50);
    return;
  }

  // Trigger animation sequence
  requestAnimationFrame(() => {
    overlay.classList.add('active');
  });

  // Smooth dismiss after monogram stroke completion and composition hold (3.1s)
  const introTimer = setTimeout(() => {
    overlay.classList.add('dismissed');
    setTimeout(() => {
      if (overlay.parentNode) {
        overlay.remove();
      }
    }, 750);
  }, 3100);

  // Safety fallback: allow instant dismiss on Esc key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay.classList.contains('dismissed')) {
      clearTimeout(introTimer);
      overlay.classList.add('dismissed');
    }
  }, { once: true });
}

/* ==========================================================================
   12. REAL-TIME REEL / FLIP CLOCK CONTROLLER
   ========================================================================== */
function initReelClock() {
  const clockEl = document.getElementById('navClock');
  if (!clockEl) return;

  // Populate ribbons 0-9
  const digitEls = clockEl.querySelectorAll('.reel-digit');
  digitEls.forEach(digit => {
    const ribbon = digit.querySelector('.reel-ribbon');
    if (!ribbon) return;
    ribbon.innerHTML = '';
    for (let i = 0; i <= 9; i++) {
      const span = document.createElement('span');
      span.textContent = i;
      ribbon.appendChild(span);
    }
  });

  // Track previous digit states so only changed digits animate
  const currentDigits = {
    h0: -1,
    h1: -1,
    m0: -1,
    m1: -1,
    s0: -1,
    s1: -1
  };

  // Detect and set local timezone label
  const tzEl = document.getElementById('navClockTz');
  if (tzEl) {
    try {
      const tzName = Intl.DateTimeFormat().resolvedOptions().timeZone;
      // If IST / Asia/Kolkata
      if (tzName.includes('Kolkata') || tzName.includes('Calcutta') || tzName.includes('India')) {
        tzEl.textContent = 'IST';
      } else {
        // Short timezone abbreviation or city name
        const shortName = tzName.split('/').pop().replace(/_/g, ' ').substring(0, 4).toUpperCase();
        tzEl.textContent = shortName || 'LCL';
      }
    } catch {
      tzEl.textContent = 'LCL';
    }
  }

  function updateClock(isInitial = false) {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const newDigits = {
      h0: parseInt(hours[0], 10),
      h1: parseInt(hours[1], 10),
      m0: parseInt(minutes[0], 10),
      m1: parseInt(minutes[1], 10),
      s0: parseInt(seconds[0], 10),
      s1: parseInt(seconds[1], 10)
    };

    const digitHeight = 17; // matches CSS reel-digit and span height

    for (const [key, val] of Object.entries(newDigits)) {
      if (isInitial || currentDigits[key] !== val) {
        currentDigits[key] = val;
        const digitWrap = clockEl.querySelector(`[data-digit-id="${key}"]`);
        if (digitWrap) {
          const ribbon = digitWrap.querySelector('.reel-ribbon');
          if (ribbon) {
            ribbon.style.transform = `translateY(-${val * digitHeight}px)`;
          }
        }
      }
    }
  }

  // Initial immediate sync
  updateClock(true);

  // Self-synchronizing interval aligned to device clock boundary
  let timerId = null;
  function scheduleNextTick() {
    const now = Date.now();
    const delay = 1000 - (now % 1000);
    timerId = setTimeout(() => {
      updateClock(false);
      scheduleNextTick();
    }, delay);
  }
  scheduleNextTick();

  // Active nav link spy observer
  initNavSpy();
}

/* ==========================================================================
   13. ACTIVE NAVIGATION SCROLL SPY
   ========================================================================== */
function initNavSpy() {
  const sections = document.querySelectorAll('section[id], header.hero[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });

  sections.forEach(sec => observer.observe(sec));
}

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSrIntro();
  initReelClock();
  initScrollReveals();
  initHeroCanvas();
  initImpostrInteraction();
  initCaseStudyModal();
  initProofModal();
  initSkillsAccordion();
  initCertificatesRenderer();
  initMobileNav();
  initMarquee();
  initTerminal();
});


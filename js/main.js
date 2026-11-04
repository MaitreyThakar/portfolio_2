/**
 * MAIN CONTROLLER
 * Core orchestration: Lenis, GSAP, Content Rendering & Interactions
 */

import { portfolioData } from '../data/content.js';
import { initCursors } from './cursors.js';
import { initProjectFilters } from './filter.js';
import { initCounters } from './counters.js';
import { initTimeline } from './timeline.js';
import { initMarquee } from './marquee.js';
import { initAgentSwarm } from './agent-swarm.js';

document.addEventListener('DOMContentLoaded', () => {
  // Mark JavaScript capability for progressive styling
  document.documentElement.classList.add('js-ready');

  // 1. Initialize Smooth Scroll & GSAP Sync
  const lenis = setupSmoothScroll();
  window.lenis = lenis;

  // 2. Populate Static & Dynamic Content from content.js
  renderAboutSection(portfolioData);
  renderShowcaseSection(portfolioData.showcase);
  renderContactSection(portfolioData);

  // 3. Initialize Interactive Components
  initProjectFilters(portfolioData.projects);
  initMarquee(portfolioData.marqueeTech);
  initCounters(portfolioData.stats);
  initTimeline(portfolioData.timeline);
  initCursors(portfolioData.floatingCursors);

  // 4. Initialize Multi-Agent Collaborative Builder Swarm & Blueprint Rulers
  initAgentSwarm(lenis);

  // 5. Setup Global UI Handlers
  setupNavigation(lenis);
  setupShowcaseSlider();
  setupEmailCopy(portfolioData.links.email);
  setupBackToTop(lenis);
  setupFooterYear();

  // 6. Run Intro Page Loader & Entrance Reveal
  runPageIntro();
});

/**
 * 1. Lenis Smooth Scroll Integration with GSAP ScrollTrigger
 */
function setupSmoothScroll() {
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isReduced || typeof Lenis === 'undefined' || typeof gsap === 'undefined') {
    return null;
  }

  const lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
    infinite: false,
  });

  // Sync Lenis scroll updates with ScrollTrigger
  if (typeof ScrollTrigger !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  }

  return lenis;
}

/**
 * 2. Intro Page Loader & Hero Entrance
 */
function runPageIntro() {
  const loader = document.getElementById('page-loader');
  const counterEl = document.getElementById('loader-counter');
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (isReduced || !loader || !counterEl) {
    if (loader) loader.classList.add('dismissed');
    revealHeroContentImmediately();
    setupScrollReveals();
    return;
  }

  // 0 to 100 Counter Animation (Max 1.4s)
  const counterObj = { count: 0 };
  gsap.to(counterObj, {
    count: 100,
    duration: 1.25,
    ease: 'power2.inOut',
    onUpdate: () => {
      counterEl.textContent = Math.round(counterObj.count);
    },
    onComplete: () => {
      // Wipe loader upwards
      loader.classList.add('dismissed');
      
      // Animate Hero Elements into view
      animateHeroEntrance();
      setupScrollReveals();
    }
  });
}

function animateHeroEntrance() {
  if (typeof gsap === 'undefined') return;

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.fromTo('.hero-backdrop-word', 
    { opacity: 0, scale: 0.9 }, 
    { opacity: 1, scale: 1, duration: 1.2 }, 
    0.1
  );

  tl.fromTo('.hero-portrait-wrap', 
    { opacity: 0, y: 50 }, 
    { opacity: 1, y: 0, duration: 1.1 }, 
    0.2
  );

  tl.fromTo('.hero-handwritten', 
    { opacity: 0, y: 20, rotate: -8 }, 
    { opacity: 1, y: 0, rotate: -3, duration: 0.8 }, 
    0.3
  );

  tl.fromTo('.hero-title-line', 
    { y: '110%' }, 
    { y: '0%', duration: 1.0, stagger: 0.12 }, 
    0.4
  );

  tl.fromTo('.hero-subtitle', 
    { opacity: 0, y: 20 }, 
    { opacity: 1, y: 0, duration: 0.8 }, 
    0.65
  );

  tl.fromTo('.hero-cta-group', 
    { opacity: 0, y: 20 }, 
    { opacity: 1, y: 0, duration: 0.8 }, 
    0.8
  );

  tl.fromTo('.hero-scroll-hint', 
    { opacity: 0 }, 
    { opacity: 0.7, duration: 0.8 }, 
    1.0
  );
}

function revealHeroContentImmediately() {
  document.querySelectorAll('.hero-title-line').forEach(el => {
    el.style.transform = 'translateY(0)';
  });
}

/**
 * 3. Scroll Reveals for Headings and Cards
 */
function setupScrollReveals() {
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isReduced || typeof ScrollTrigger === 'undefined' || typeof gsap === 'undefined') {
    return;
  }

  // Section titles mask reveal
  document.querySelectorAll('.reveal-mask').forEach((mask) => {
    const target = mask.querySelector('.mask-child');
    if (!target) return;

    ScrollTrigger.create({
      trigger: mask,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        target.classList.add('revealed');
      }
    });
  });

  // Hero subtle parallax on scroll
  const portrait = document.querySelector('.hero-portrait-wrap');
  if (portrait) {
    gsap.to(portrait, {
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      },
      y: 80,
      ease: 'none'
    });
  }
}

/**
 * 4. Render About Section Elements
 */
function renderAboutSection(data) {
  // Bio paragraphs
  const bioContainer = document.getElementById('about-bio');
  if (bioContainer) {
    bioContainer.innerHTML = `
      <p>${data.about.paragraph1}</p>
      <p>${data.about.paragraph2}</p>
    `;
  }

  // Quote Card
  const quoteContainer = document.getElementById('about-quote-card');
  if (quoteContainer) {
    quoteContainer.innerHTML = `
      <div class="quote-mark" aria-hidden="true">&ldquo;</div>
      <div class="quote-text">${data.about.quote}</div>
      <div class="quote-author">&mdash; ${data.about.quoteAuthor}</div>
    `;
  }

  // Education list
  const eduContainer = document.getElementById('about-education');
  if (eduContainer) {
    eduContainer.innerHTML = data.education.map(edu => `
      <div class="edu-card">
        <div class="edu-card-info">
          <h4 class="edu-card-degree">${edu.degree}</h4>
          <p class="edu-card-inst">${edu.institution}</p>
        </div>
        <span class="edu-card-score">${edu.score}</span>
      </div>
    `).join('');
  }

  // Skills grouped list
  const skillsContainer = document.getElementById('about-skills');
  if (skillsContainer) {
    skillsContainer.innerHTML = data.skills.map(skillGroup => `
      <div class="skills-group">
        <h4 class="skills-group-title">${skillGroup.group}</h4>
        <div class="skills-tags">
          ${skillGroup.items.map(item => `<span class="skill-pill">${item}</span>`).join('')}
        </div>
      </div>
    `).join('');
  }
}

/**
 * 5. Render Showcase Before/After
 */
function renderShowcaseSection(showcase) {
  const container = document.getElementById('showcase-container');
  if (!container || !showcase) return;

  container.innerHTML = `
    <div class="comparison-container" id="comparison-box" aria-label="Before and after comparison of architecture versus real-time interface">
      <!-- Layer 1: Before (Raw Backend Architecture) -->
      <div class="comparison-image-layer comparison-before">
        <img src="${showcase.beforeImage}" alt="Raw Architecture and Data Pipelines" width="1000" height="650" loading="lazy">
        <span class="comparison-badge comparison-badge-before">${showcase.beforeLabel}</span>
      </div>

      <!-- Layer 2: After (Real Production Interface) -->
      <div class="comparison-image-layer comparison-after" id="comparison-after">
        <img src="${showcase.afterImage}" id="comparison-after-img" alt="Real Production GenAI Interface" width="1000" height="650" loading="lazy">
        <span class="comparison-badge comparison-badge-after">${showcase.afterLabel}</span>
      </div>

      <!-- Center Draggable Divider -->
      <div class="comparison-handle" id="comparison-handle" 
           role="slider" 
           tabindex="0" 
           aria-valuenow="50" 
           aria-valuemin="0" 
           aria-valuemax="100" 
           aria-label="Drag slider to compare raw architecture and real interface">
        <div class="comparison-handle-knob" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
      </div>
    </div>
    <div class="comparison-hint">
      <span>Use mouse, touch or &larr; / &rarr; keys to compare</span>
      <span>${showcase.subheading}</span>
    </div>
  `;
}

/**
 * Interactive Before/After Drag Slider
 */
function setupShowcaseSlider() {
  const box = document.getElementById('comparison-box');
  const handle = document.getElementById('comparison-handle');
  const afterLayer = document.getElementById('comparison-after');
  const afterImg = document.getElementById('comparison-after-img');

  if (!box || !handle || !afterLayer || !afterImg) return;

  let isDragging = false;
  let currentPercent = 50;

  function updateSlider(percent) {
    currentPercent = Math.min(Math.max(percent, 0), 100);
    afterLayer.style.width = `${currentPercent}%`;
    handle.style.left = `${currentPercent}%`;
    handle.setAttribute('aria-valuenow', Math.round(currentPercent));

    // Keep after image synced to container width
    const boxWidth = box.offsetWidth;
    afterImg.style.width = `${boxWidth}px`;
  }

  // Handle Resize
  window.addEventListener('resize', () => {
    updateSlider(currentPercent);
  }, { passive: true });

  // Initial Sync
  updateSlider(50);

  // Mouse & Touch events
  function onPointerMove(e) {
    if (!isDragging) return;
    const rect = box.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const x = clientX - rect.left;
    const percent = (x / rect.width) * 100;
    updateSlider(percent);
  }

  function startDrag(e) {
    isDragging = true;
    onPointerMove(e);
  }

  function stopDrag() {
    isDragging = false;
  }

  handle.addEventListener('mousedown', startDrag);
  box.addEventListener('mousedown', startDrag);
  window.addEventListener('mousemove', onPointerMove, { passive: false });
  window.addEventListener('mouseup', stopDrag);

  handle.addEventListener('touchstart', startDrag, { passive: true });
  box.addEventListener('touchstart', startDrag, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });
  window.addEventListener('touchend', stopDrag);

  // Keyboard accessibility
  handle.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      updateSlider(currentPercent - 5);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      updateSlider(currentPercent + 5);
    }
  });
}

/**
 * 6. Contact Section & Toast Notification
 */
function renderContactSection(data) {
  const list = document.getElementById('contact-links');
  if (!list) return;

  list.innerHTML = `
    <!-- Email Row -->
    <div class="contact-row">
      <div class="contact-row-info">
        <span class="contact-row-type">Email Contact</span>
        <span class="contact-row-value" id="display-email">${data.links.email}</span>
      </div>
      <button class="copy-btn" id="copy-email-btn" type="button" aria-label="Copy email address to clipboard">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
        <span>Copy</span>
      </button>
    </div>

    <!-- GitHub Row -->
    <a href="${data.links.github}" class="contact-row" target="_blank" rel="noopener noreferrer">
      <div class="contact-row-info">
        <span class="contact-row-type">GitHub Profile</span>
        <span class="contact-row-value">github.com/MaitreyThakar</span>
      </div>
      <span class="btn-icon" aria-hidden="true">&rarr;</span>
    </a>

    <!-- LinkedIn Row -->
    <a href="${data.links.linkedin}" class="contact-row" target="_blank" rel="noopener noreferrer">
      <div class="contact-row-info">
        <span class="contact-row-type">LinkedIn Connection</span>
        <span class="contact-row-value">linkedin.com/in/maitrey-thakar-87b218273</span>
      </div>
      <span class="btn-icon" aria-hidden="true">&rarr;</span>
    </a>
  `;
}

function setupEmailCopy(emailAddress) {
  const copyBtn = document.getElementById('copy-email-btn');
  const toast = document.getElementById('copy-toast');
  if (!copyBtn || !toast) return;

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(emailAddress);
      showToast('Copied to clipboard');
    } catch {
      // Fallback
      const input = document.createElement('input');
      input.value = emailAddress;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      showToast('Copied to clipboard');
    }
  });

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }
}

/**
 * 7. Navigation, Active Highlighting & Mobile Overlay
 */
function setupNavigation(lenis) {
  const header = document.querySelector('.site-header');
  const menuToggle = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  // Sticky header background transition
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile menu toggle
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.contains('open');
      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    function openMobileNav() {
      mobileNav.classList.add('open');
      menuToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeMobileNav() {
      mobileNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    // Close when link clicked
    mobileNav.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', closeMobileNav);
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        closeMobileNav();
        menuToggle.focus();
      }
    });
  }

  // Smooth scroll click handler
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          if (lenis) {
            lenis.scrollTo(targetEl, { offset: -60 });
          } else {
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    });
  });

  // Active section observer
  setupActiveSectionSpy();
}

function setupActiveSectionSpy() {
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        desktopNavLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));
}

/**
 * 8. Back to Top Button
 */
function setupBackToTop(lenis) {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  backToTopBtn.addEventListener('click', () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

/**
 * 9. Footer Auto Year
 */
function setupFooterYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}


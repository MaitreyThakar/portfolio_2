/**
 * CURSORS ENGINE
 * Custom mouse follower and drifting hero skill cursors
 */

export function initCursors(floatingCursorData) {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = window.matchMedia('(hover: none) or (pointer: coarse)').matches;

  if (isReducedMotion || isTouchDevice) {
    return;
  }

  setupCustomMouseFollower();
  setupFloatingHeroCursors(floatingCursorData);
}

/**
 * Custom Desktop Mouse Follower
 */
function setupCustomMouseFollower() {
  const dot = document.querySelector('.custom-cursor-dot');
  const follower = document.querySelector('.custom-cursor-follower');

  if (!dot || !follower) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let followerX = mouseX;
  let followerY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  }, { passive: true });

  // Smooth lerp follower loop
  function renderFollower() {
    followerX += (mouseX - followerX) * 0.16;
    followerY += (mouseY - followerY) * 0.16;
    follower.style.transform = `translate(${followerX}px, ${followerY}px)`;
    requestAnimationFrame(renderFollower);
  }
  requestAnimationFrame(renderFollower);

  // Hover state detection
  const interactiveTargets = 'a, button, input, [role="button"], .project-card, .filter-btn, .comparison-handle';
  
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveTargets)) {
      document.body.classList.add('cursor-hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveTargets)) {
      document.body.classList.remove('cursor-hover');
    }
  });
}

/**
 * Floating Hero Cursors (GSAP powered drifting)
 */
function setupFloatingHeroCursors(floatingCursorData) {
  const heroStage = document.querySelector('.hero-stage');
  if (!heroStage || !floatingCursorData || typeof gsap === 'undefined') return;

  floatingCursorData.forEach((item, index) => {
    const el = document.createElement('div');
    el.className = 'floating-cursor';
    el.setAttribute('aria-hidden', 'true');
    el.style.left = item.initialX;
    el.style.top = item.initialY;

    el.innerHTML = `
      <svg class="floating-cursor-pointer" viewBox="0 0 16 16" fill="none">
        <polygon points="1,1 6,15 9,9 15,6" fill="${item.color || '#C6FF3D'}" stroke="#0A0A0B" stroke-width="1.2"/>
      </svg>
      <span class="floating-cursor-badge">${item.label}</span>
    `;

    heroStage.appendChild(el);

    // Drifting motion via GSAP
    const driftRangeX = 25 + index * 6;
    const driftRangeY = 18 + index * 5;
    const duration = 3.5 + index * 0.8;

    gsap.to(el, {
      x: `+=${driftRangeX}`,
      y: `-=${driftRangeY}`,
      rotation: index % 2 === 0 ? 3 : -3,
      duration: duration,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: index * 0.3
    });
  });
}


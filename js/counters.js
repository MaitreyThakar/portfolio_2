/**
 * STATS COUNTERS ENGINE
 * ScrollTrigger-driven animated numeral counting
 */

export function initCounters(stats) {
  const grid = document.getElementById('stats-grid');
  if (!grid || !stats || stats.length === 0) return;

  // Render stats cards into grid
  grid.innerHTML = stats.map((stat, i) => `
    <div class="stat-card" data-index="${i}">
      <div class="stat-number-wrap">
        <span class="stat-number" data-target="${stat.value}" data-decimal="${stat.value % 1 !== 0}">0</span>
        <span class="stat-suffix">${stat.suffix}</span>
      </div>
      <div class="stat-label">${stat.label}</div>
      <p class="stat-desc">${stat.description}</p>
    </div>
  `).join('');

  setupCounterScrollTriggers();
}

function setupCounterScrollTriggers() {
  const numberEls = document.querySelectorAll('.stat-number');
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  numberEls.forEach((el) => {
    const target = parseFloat(el.getAttribute('data-target'));
    const isDecimal = el.getAttribute('data-decimal') === 'true';

    if (isReduced || typeof ScrollTrigger === 'undefined' || typeof gsap === 'undefined') {
      el.textContent = isDecimal ? target.toFixed(1) : Math.round(target);
      return;
    }

    const obj = { val: 0 };

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: target,
          duration: 1.8,
          ease: 'power3.out',
          onUpdate: () => {
            el.textContent = isDecimal ? obj.val.toFixed(1) : Math.round(obj.val);
          }
        });
      }
    });
  });
}


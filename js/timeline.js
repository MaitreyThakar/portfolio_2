/**
 * JOURNEY TIMELINE ENGINE
 * Vertical line fill and progressive entry reveal on scroll
 */

export function initTimeline(timelineData) {
  const container = document.getElementById('timeline-items');
  const progressBar = document.getElementById('timeline-progress');
  const timelineSection = document.getElementById('journey');

  if (!container || !timelineData || timelineData.length === 0) return;

  // Render items into DOM
  container.innerHTML = timelineData.map((item, index) => `
    <div class="timeline-node" data-index="${index}">
      <span class="timeline-dot" aria-hidden="true"></span>
      <div class="timeline-card">
        <div class="timeline-card-header">
          <span class="timeline-year">${item.year}</span>
          ${item.score ? `<span class="timeline-score-badge">${item.score}</span>` : ''}
        </div>
        <h3 class="timeline-role">${item.title}</h3>
        <p class="timeline-org">${item.organization}${item.location ? ` &bull; ${item.location}` : ''}</p>
        <p class="timeline-desc">${item.description}</p>
      </div>
    </div>
  `).join('');

  setupTimelineScroll(timelineSection, progressBar);
}

function setupTimelineScroll(timelineSection, progressBar) {
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!timelineSection || !progressBar) return;

  if (isReduced || typeof ScrollTrigger === 'undefined' || typeof gsap === 'undefined') {
    progressBar.style.height = '100%';
    document.querySelectorAll('.timeline-node').forEach(node => node.classList.add('active'));
    return;
  }

  // Animate progress bar fill along with scroll position through journey section
  ScrollTrigger.create({
    trigger: timelineSection,
    start: 'top 70%',
    end: 'bottom 85%',
    scrub: true,
    onUpdate: (self) => {
      const progressPercent = Math.min(Math.max(self.progress * 100, 0), 100);
      progressBar.style.height = `${progressPercent}%`;

      // Activate nodes as progress passes them
      const nodes = document.querySelectorAll('.timeline-node');
      const activeCount = Math.floor(self.progress * (nodes.length + 0.5));
      nodes.forEach((node, idx) => {
        if (idx <= activeCount) {
          node.classList.add('active');
        } else {
          node.classList.remove('active');
        }
      });
    }
  });

  // Entry slide-in reveals
  const nodes = document.querySelectorAll('.timeline-node');
  nodes.forEach((node) => {
    gsap.from(node.querySelector('.timeline-card'), {
      scrollTrigger: {
        trigger: node,
        start: 'top 88%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      x: 30,
      duration: 0.8,
      ease: 'power3.out'
    });
  });
}


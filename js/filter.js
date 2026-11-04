/**
 * WORK PROJECTS & FILTERING ENGINE
 * Grid rendering, animated category filtering, and accessible modal
 */

export function initProjectFilters(projects) {
  const grid = document.getElementById('projects-grid');
  const tabsContainer = document.getElementById('filter-tabs');
  if (!grid || !projects || projects.length === 0) return;

  // Render initial project cards
  renderProjectCards(grid, projects);
  setupFilterTabs(tabsContainer, grid, projects);
  setupProjectModal(projects);
}

/**
 * Render cards into DOM
 */
function renderProjectCards(grid, projects) {
  grid.innerHTML = projects.map((p) => `
    <article class="project-card" data-category="${p.category}" data-id="${p.id}" tabindex="0" role="button" aria-haspopup="dialog" aria-label="View project details for ${p.title}">
      <div class="project-thumbnail-wrap">
        <img class="project-thumbnail" src="${p.image}" alt="${p.title} preview" width="800" height="500" loading="lazy">
        <span class="project-overlay-badge">${p.category}</span>
      </div>
      <div class="project-card-body">
        <h3 class="project-card-title">${p.title}</h3>
        <p class="project-card-tagline">${p.tagline}</p>
        <div class="project-stack-chips">
          ${p.stack.map(s => `<span class="stack-chip">${s}</span>`).join('')}
        </div>
        <div class="project-view-indicator" aria-hidden="true">
          <span>View Details</span>
          <span>&rarr;</span>
        </div>
      </div>
    </article>
  `).join('');
}

/**
 * Filter Tabs Logic with FLIP animation
 */
function setupFilterTabs(tabsContainer, grid, allProjects) {
  if (!tabsContainer) return;

  const buttons = tabsContainer.querySelectorAll('.filter-btn');

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const activeCategory = btn.getAttribute('data-filter');

      // Update active button
      buttons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      filterGrid(grid, activeCategory);
    });
  });
}

function filterGrid(grid, category) {
  const cards = Array.from(grid.querySelectorAll('.project-card'));
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  cards.forEach((card) => {
    const cardCat = card.getAttribute('data-category');
    const matches = (category === 'all' || cardCat.toLowerCase() === category.toLowerCase());

    if (isReduced || typeof gsap === 'undefined') {
      card.style.display = matches ? 'flex' : 'none';
      if (matches) {
        card.removeAttribute('aria-hidden');
      } else {
        card.setAttribute('aria-hidden', 'true');
      }
      return;
    }

    gsap.killTweensOf(card);

    if (matches) {
      card.style.display = 'flex';
      card.removeAttribute('aria-hidden');
      gsap.fromTo(card, 
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out', clearProps: 'transform' }
      );
    } else {
      card.setAttribute('aria-hidden', 'true');
      gsap.to(card, {
        opacity: 0,
        scale: 0.96,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          card.style.display = 'none';
        }
      });
    }
  });
}

/**
 * Project Modal with Focus Trap & Keyboard Navigation
 */
function setupProjectModal(projects) {
  const backdrop = document.getElementById('project-modal');
  const closeBtn = document.getElementById('modal-close');
  if (!backdrop || !closeBtn) return;

  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalImage = document.getElementById('modal-image');
  const modalDesc = document.getElementById('modal-desc');
  const modalStack = document.getElementById('modal-stack');
  const modalActions = document.getElementById('modal-actions');

  let lastActiveElement = null;

  function openModal(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    lastActiveElement = document.activeElement;

    modalTitle.textContent = project.title;
    modalCategory.textContent = project.category;
    modalImage.src = project.image;
    modalImage.alt = `${project.title} detailed visual`;
    
    // Verbatim 2-line description representation
    modalDesc.innerHTML = `
      <p style="margin-bottom: 0.75rem; font-weight: 500;">${project.tagline}</p>
      <p style="color: var(--text-muted);">${project.description}</p>
    `;

    modalStack.innerHTML = project.stack.map(s => `<span class="stack-chip">${s}</span>`).join('');

    // Dynamic CTA links (with note if placeholder)
    const demoText = project.demoUrl === '#' ? 'Live Demo (TODO: URL)' : 'Live Demo';
    const repoText = project.repoUrl === '#' ? 'Repository (TODO: URL)' : 'View Code';

    modalActions.innerHTML = `
      <a href="${project.demoUrl}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">
        <span>${demoText}</span>
        <svg class="btn-icon" viewBox="0 0 16 16" fill="none"><path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
      </a>
      <a href="${project.repoUrl}" class="btn btn-secondary" target="_blank" rel="noopener noreferrer">
        <span>${repoText}</span>
        <svg class="btn-icon" viewBox="0 0 16 16" fill="none"><path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
      </a>
    `;

    backdrop.classList.add('open');
    backdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeModal() {
    backdrop.classList.remove('open');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastActiveElement) {
      lastActiveElement.focus();
    }
  }

  // Open on card click or Enter/Space key
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.project-card');
    if (card) {
      const id = card.getAttribute('data-id');
      openModal(id);
    }
  });

  document.addEventListener('keydown', (e) => {
    const card = e.target.closest('.project-card');
    if (card && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      const id = card.getAttribute('data-id');
      openModal(id);
    }
  });

  // Close handlers
  closeBtn.addEventListener('click', closeModal);

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (backdrop.classList.contains('open')) {
      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'Tab') {
        // Simple focus trap inside modal
        trapFocus(backdrop, e);
      }
    }
  });
}

function trapFocus(container, e) {
  const focusables = container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  const first = focusables[0];
  const last = focusables[focusables.length - 1];

  if (e.shiftKey) {
    if (document.activeElement === first) {
      last.focus();
      e.preventDefault();
    }
  } else {
    if (document.activeElement === last) {
      first.focus();
      e.preventDefault();
    }
  }
}

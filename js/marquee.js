/**
 * TECH MARQUEE COMPONENT
 * Infinite horizontal ticker of core technologies
 */

export function initMarquee(techItems) {
  const track = document.getElementById('marquee-track');
  if (!track || !techItems || techItems.length === 0) return;

  // Duplicate items to ensure a seamless infinite loop
  const duplicatedList = [...techItems, ...techItems];

  const html = duplicatedList.map((tech) => `
    <div class="marquee-item">
      <span>${escapeHtml(tech)}</span>
      <span class="marquee-separator" aria-hidden="true"></span>
    </div>
  `).join('');

  track.innerHTML = html;
}

function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, (tag) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag] || tag));
}


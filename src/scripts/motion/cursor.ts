export function initCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const spotlight = document.createElement('div');
  spotlight.className = 'cursor-spotlight';
  document.body.appendChild(spotlight);

  document.addEventListener('mousemove', (e) => {
    spotlight.style.setProperty('--x', `${e.clientX}px`);
    spotlight.style.setProperty('--y', `${e.clientY}px`);
  });

  const glowCards = document.querySelectorAll(
    '.project-card, .feature-card, .learning-card, .portfolio-card'
  );

  glowCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e as MouseEvent).clientX - rect.left) / rect.width * 100;
      const y = ((e as MouseEvent).clientY - rect.top) / rect.height * 100;
      (card as HTMLElement).style.setProperty('--gx', `${x}%`);
      (card as HTMLElement).style.setProperty('--gy', `${y}%`);
    });
  });
}

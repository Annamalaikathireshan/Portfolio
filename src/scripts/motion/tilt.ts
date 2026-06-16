export function initTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cards = document.querySelectorAll(
    '.portfolio-card, .project-card, .feature-card, .learning-card'
  );

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e as MouseEvent).clientX - rect.left) / rect.width - 0.5;
      const y = ((e as MouseEvent).clientY - rect.top) / rect.height - 0.5;
      (card as HTMLElement).style.transform =
        `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      (card as HTMLElement).style.transform = '';
    });
  });
}

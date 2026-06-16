import { initCursor } from './motion/cursor';
import { initTilt } from './motion/tilt';
import { initLenis } from './motion/lenis';

document.addEventListener('DOMContentLoaded', () => {
  initLenis();
  initCursor();
  initTilt();

  const grid = document.querySelector('.portfolio-grid');
  if (grid) {
    grid.classList.add('active');
    grid.querySelectorAll('.reveal-child').forEach((child, i) => {
      setTimeout(() => child.classList.add('active'), i * 120);
    });
  }
});

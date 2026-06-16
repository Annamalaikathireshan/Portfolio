import Lenis from 'lenis';

let lenis: Lenis | null = null;

export function initLenis() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  function raf(time: number) {
    lenis?.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
  document.documentElement.classList.add('lenis');
}

export function getLenis() {
  return lenis;
}

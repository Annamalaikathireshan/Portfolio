import Lenis from 'lenis';
import { gsap, ScrollTrigger, prefersReducedMotion } from './gsap-core';

let lenis: Lenis | null = null;
let tickerFn: ((time: number) => void) | null = null;

export function initLenis() {
  if (prefersReducedMotion() || lenis) return;

  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    anchors: true,
  });

  lenis.on('scroll', ScrollTrigger.update);

  tickerFn = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(tickerFn);
  gsap.ticker.lagSmoothing(0);

  document.documentElement.classList.add('lenis');
}

export function destroyLenis() {
  if (tickerFn) {
    gsap.ticker.remove(tickerFn);
    tickerFn = null;
  }
  lenis?.destroy();
  lenis = null;
  document.documentElement.classList.remove('lenis');
}

export function getLenis() {
  return lenis;
}

import { initLenis } from './motion/lenis';
import { initScrollReveal, initHeaderScroll } from './motion/scroll-reveal';
import { initParallax } from './motion/parallax';
import { initCursor } from './motion/cursor';
import { initTilt } from './motion/tilt';
import { initMagnetic } from './motion/magnetic';
import { initParticles } from './motion/particles';
import {
  initScrollProgress,
  initCountUp,
  initActiveNav,
  initMobileMenu,
} from './motion/nav';

if (history.scrollRestoration) {
  history.scrollRestoration = 'manual';
}

document.addEventListener('DOMContentLoaded', () => {
  window.scrollTo(0, 0);
  initLenis();
  initScrollReveal();
  initHeaderScroll();
  initParallax();
  initCursor();
  initTilt();
  initMagnetic();
  initParticles();
  initScrollProgress();
  initCountUp();
  initActiveNav();
  initMobileMenu();
});

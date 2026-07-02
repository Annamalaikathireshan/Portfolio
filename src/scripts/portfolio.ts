import { gsap, ScrollTrigger } from './motion/gsap-core';
import { initLenis, destroyLenis } from './motion/lenis';
import { initIntro } from './motion/intro';
import { initScrollAnims } from './motion/scroll-anims';
import { initHeaderScroll } from './motion/scroll-reveal';
import { initTilt } from './motion/tilt';
import { initMagnetic } from './motion/magnetic';
import { initParticles } from './motion/particles';
import { initActiveNav, initMobileMenu } from './motion/nav';

if (history.scrollRestoration) {
  history.scrollRestoration = 'manual';
}

let ctx: gsap.Context | null = null;

function init() {
  window.scrollTo(0, 0);
  initLenis();

  ctx = gsap.context(() => {
    initIntro();
    initScrollAnims();
  });

  initHeaderScroll();
  initTilt();
  initMagnetic();
  initParticles();
  initActiveNav();
  initMobileMenu();

  // Recalculate trigger positions once fonts/layout settle.
  requestAnimationFrame(() => ScrollTrigger.refresh());
}

function cleanup() {
  ctx?.revert();
  ctx = null;
  ScrollTrigger.getAll().forEach((t) => t.kill());
  destroyLenis();
}

document.addEventListener('astro:page-load', init);
document.addEventListener('astro:before-swap', cleanup);

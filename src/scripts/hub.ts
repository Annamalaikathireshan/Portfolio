import { gsap, prefersReducedMotion } from './motion/gsap-core';
import { initLenis, destroyLenis } from './motion/lenis';
import { initTilt } from './motion/tilt';

let ctx: gsap.Context | null = null;

function init() {
  initLenis();
  initTilt();

  const list = document.querySelector('.portfolio-list');
  const terminal = document.querySelectorAll('.hub-terminal > *');
  const tagline = document.querySelector('.hub-tagline');
  const name = document.querySelector('.neutral-name');
  const email = document.querySelector('.neutral-email');
  const cards = list ? Array.from(list.querySelectorAll('.reveal-child')) : [];

  if (prefersReducedMotion()) {
    cards.forEach((c) => c.classList.add('active'));
    return;
  }

  ctx = gsap.context(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (terminal.length) {
      tl.fromTo(
        terminal,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.12 }
      );
    }

    const fadeItems = [name, tagline, email].filter(Boolean) as Element[];
    if (fadeItems.length) {
      tl.fromTo(
        fadeItems,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.1 },
        '-=0.2'
      );
    }

    if (cards.length) {
      cards.forEach((c) => c.classList.add('active'));
      tl.fromTo(
        cards,
        { opacity: 0, clipPath: 'inset(0% 100% 0% 0%)' },
        {
          opacity: 1,
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 0.6,
          stagger: 0.12,
          ease: 'power4.out',
          clearProps: 'clipPath',
        },
        '-=0.25'
      );
    }
  });
}

function cleanup() {
  ctx?.revert();
  ctx = null;
  destroyLenis();
}

document.addEventListener('astro:page-load', init);
document.addEventListener('astro:before-swap', cleanup);

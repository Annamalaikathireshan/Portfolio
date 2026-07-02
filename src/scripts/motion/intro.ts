import { gsap, SplitText, prefersReducedMotion } from './gsap-core';

/**
 * Page-load choreography: overlay wipe, then hero reveal
 * (SplitText name, typed role line, photo clip-path, staggered CTAs).
 */
export function initIntro() {
  const overlay = document.querySelector('.page-intro') as HTMLElement | null;
  const hero = document.querySelector('.hero');

  if (!hero || prefersReducedMotion()) {
    overlay?.remove();
    return;
  }

  const header = document.querySelector('header');
  const content = hero.querySelector('.hero-content') as HTMLElement | null;
  const h1 = hero.querySelector('.hero-text h1');
  const roleLine = hero.querySelector('.hero-role-line');
  const tagline = hero.querySelector('.hero-text > p:not(.hero-role-line)');
  const actions = hero.querySelectorAll('.hero-actions .btn');
  const photoFrame = hero.querySelector('.profile-img-container');
  const photo = hero.querySelector('.profile-img');

  if (!content || !h1) {
    overlay?.remove();
    return;
  }

  // 'words' keeps line wraps at word boundaries once chars become inline-block.
  const nameSplit = new SplitText(h1, { type: 'words,chars', mask: 'chars' });
  const roleSplit = roleLine ? new SplitText(roleLine, { type: 'chars' }) : null;

  // Container is CSS-hidden (.reveal); make it visible and hide children
  // individually so the timeline controls every reveal.
  gsap.set(content, { opacity: 1, y: 0 });
  gsap.set(nameSplit.chars, { yPercent: 110 });
  if (roleSplit) gsap.set(roleSplit.chars, { opacity: 0 });
  if (tagline) gsap.set(tagline, { opacity: 0, y: 18 });
  if (actions.length) gsap.set(actions, { opacity: 0, y: 22 });
  if (photoFrame) gsap.set(photoFrame, { clipPath: 'inset(0% 100% 0% 0%)' });
  if (photo) gsap.set(photo, { scale: 1.35, filter: 'grayscale(80%)' });
  if (header) gsap.set(header, { opacity: 0, y: -14 });

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  if (overlay) {
    tl.to(overlay.querySelector('.page-intro-mark'), {
      opacity: 0,
      duration: 0.25,
      delay: 0.15,
      ease: 'power1.in',
    })
      .to(overlay, {
        scaleY: 0,
        transformOrigin: 'top center',
        duration: 0.7,
        ease: 'power4.inOut',
      })
      .set(overlay, { display: 'none' });
  }

  if (header) {
    tl.to(header, { opacity: 1, y: 0, duration: 0.6 }, overlay ? '-=0.35' : 0);
  }

  if (photoFrame) {
    tl.to(
      photoFrame,
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'power4.inOut' },
      '<'
    );
  }
  if (photo) {
    tl.to(photo, { scale: 1, filter: 'grayscale(20%)', duration: 1.4, ease: 'power3.out' }, '<');
  }

  tl.to(
    nameSplit.chars,
    { yPercent: 0, duration: 0.9, stagger: 0.035, ease: 'power4.out' },
    photoFrame ? '-=0.9' : '-=0.3'
  );

  if (roleSplit) {
    // Per-char opacity snaps read as terminal typing.
    tl.to(
      roleSplit.chars,
      { opacity: 1, duration: 0.01, stagger: 0.022, ease: 'none' },
      '-=0.45'
    );
  }

  if (tagline) tl.to(tagline, { opacity: 1, y: 0, duration: 0.7 }, '-=0.25');
  if (actions.length) {
    tl.to(actions, { opacity: 1, y: 0, duration: 0.6, stagger: 0.09 }, '-=0.45');
  }

  return tl;
}

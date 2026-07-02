import { gsap, ScrollTrigger, SplitText, prefersReducedMotion } from './gsap-core';

/** All ScrollTrigger-driven animation. No-op under prefers-reduced-motion. */
export function initScrollAnims() {
  if (prefersReducedMotion()) {
    // CSS shows everything instantly; just set final counter values.
    document.querySelectorAll('.stat-number').forEach((el) => {
      el.textContent =
        (el.getAttribute('data-target') || '0') + (el.getAttribute('data-suffix') || '');
    });
    return;
  }

  initSectionHeadings();
  initGenericReveals();
  initHeroParallax();
  initStatsCountUp();
  initProjectsGallery();
  initExperienceTimeline();
  initArchitectureStrip();
  initSkillRows();
  initLearningLog();
  initSkillsMarquee();
  initScrollProgressBar();
}

/** Infinite left-drifting marquee; speeds up slightly while scrolling. */
function initSkillsMarquee() {
  const track = document.querySelector('.marquee-track') as HTMLElement | null;
  if (!track) return;

  const loop = gsap.to(track, {
    xPercent: -50,
    duration: 40,
    ease: 'none',
    repeat: -1,
  });

  ScrollTrigger.create({
    trigger: '.skills-marquee',
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: (self) => {
      gsap.to(loop, {
        timeScale: 1 + Math.min(Math.abs(self.getVelocity()) / 900, 2.5),
        duration: 0.4,
        overwrite: true,
      });
    },
  });
}

function initSectionHeadings() {
  document.querySelectorAll('.section-title').forEach((title) => {
    gsap.set(title, { opacity: 1, y: 0 });
    const split = new SplitText(title, { type: 'words,chars', mask: 'chars' });
    gsap.fromTo(
      split.chars,
      { yPercent: 110 },
      {
        yPercent: 0,
        duration: 0.8,
        stagger: 0.025,
        ease: 'power4.out',
        scrollTrigger: { trigger: title, start: 'top 88%' },
      }
    );
  });

  document.querySelectorAll('.section-label').forEach((label) => {
    gsap.fromTo(
      label,
      { opacity: 0, x: -16 },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: { trigger: label, start: 'top 90%' },
      }
    );
  });
}

function initGenericReveals() {
  const excluded = '.hero-content, .case-study, .learning-entry, .experience-entry, .architecture-strip, .skills-categories';
  document.querySelectorAll('.reveal').forEach((el) => {
    if (el.matches(excluded)) return;
    gsap.fromTo(
      el,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' },
      }
    );
  });
}

function initHeroParallax() {
  const hero = document.querySelector('.hero');
  const content = document.querySelector('.hero-content');
  if (!hero || !content) return;

  gsap.to(content, {
    yPercent: 20,
    opacity: 0.15,
    ease: 'none',
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });

  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    gsap.to(canvas, {
      yPercent: 12,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }
}

function initStatsCountUp() {
  document.querySelectorAll('.stat-number').forEach((el) => {
    const target = Number(el.getAttribute('data-target') || 0);
    const suffix = el.getAttribute('data-suffix') || '';
    const counter = { value: 0 };

    gsap.to(counter, {
      value: target,
      duration: 1.8,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
      onUpdate: () => {
        el.textContent = Math.round(counter.value) + suffix;
      },
    });
  });
}

/** Pinned horizontal gallery on desktop, staggered vertical stack elsewhere. */
function initProjectsGallery() {
  const section = document.querySelector('.projects') as HTMLElement | null;
  const track = section?.querySelector('.case-studies') as HTMLElement | null;
  if (!section || !track) return;

  const cards = Array.from(track.querySelectorAll('.case-study')) as HTMLElement[];
  if (!cards.length) return;

  // GSAP owns visibility; clear the .reveal transition-delay inline styles.
  cards.forEach((card) => (card.style.transitionDelay = '0ms'));

  const mm = gsap.matchMedia();

  mm.add('(min-width: 1024px)', () => {
    section.classList.add('projects-horizontal');
    gsap.set(cards, { opacity: 1, y: 0 });

    // Track uses width: max-content, so scrollWidth === clientWidth; measure
    // against the space between the track's start position and viewport edge.
    const container = section.querySelector('.container') as HTMLElement;
    const distance = () => {
      const visible = window.innerWidth - container.getBoundingClientRect().left - 48;
      return Math.max(0, track.scrollWidth - visible);
    };

    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // Subtle per-card entrance as each slides into view.
    cards.forEach((card) => {
      gsap.fromTo(
        card,
        { scale: 0.96, opacity: 0.55 },
        {
          scale: 1,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            containerAnimation: tween,
            start: 'left 90%',
            end: 'left 55%',
            scrub: true,
          },
        }
      );
    });

    return () => {
      section.classList.remove('projects-horizontal');
      gsap.set(track, { clearProps: 'all' });
      gsap.set(cards, { clearProps: 'all' });
    };
  });

  mm.add('(max-width: 1023px)', () => {
    cards.forEach((card, i) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: (i % 2) * 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 90%' },
        }
      );
    });
  });
}

/** Timeline line draws as you scroll; entries slide in alternately. */
function initExperienceTimeline() {
  const list = document.querySelector('.experience-list');
  if (!list) return;

  const line = list.querySelector('.timeline-line');
  if (line) {
    gsap.fromTo(
      line,
      { scaleY: 0 },
      {
        scaleY: 1,
        transformOrigin: 'top center',
        ease: 'none',
        scrollTrigger: {
          trigger: list,
          start: 'top 80%',
          end: 'bottom 60%',
          scrub: true,
        },
      }
    );
  }

  list.querySelectorAll('.experience-entry').forEach((entry, i) => {
    gsap.fromTo(
      entry,
      { opacity: 0, x: i % 2 === 0 ? -32 : 32 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: entry, start: 'top 88%' },
      }
    );
  });
}

function initArchitectureStrip() {
  const strip = document.querySelector('.architecture-strip');
  if (!strip) return;

  gsap.set(strip, { opacity: 1, y: 0 });
  gsap.fromTo(
    strip.children,
    { opacity: 0, x: -14 },
    {
      opacity: 1,
      x: 0,
      duration: 0.5,
      stagger: 0.07,
      ease: 'power2.out',
      scrollTrigger: { trigger: strip, start: 'top 90%' },
    }
  );
}

function initSkillRows() {
  const wrap = document.querySelector('.skills-categories');
  if (!wrap) return;

  gsap.set(wrap, { opacity: 1, y: 0 });
  gsap.fromTo(
    wrap.querySelectorAll('.skill-row'),
    { opacity: 0, y: 16 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: { trigger: wrap, start: 'top 88%' },
    }
  );
}

function initLearningLog() {
  const entries = document.querySelectorAll('.learning-entry');
  if (!entries.length) return;

  entries.forEach((entry) => ((entry as HTMLElement).style.transitionDelay = '0ms'));
  gsap.fromTo(
    entries,
    { opacity: 0, y: 24 },
    {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.learning-log', start: 'top 85%' },
    }
  );
}

function initScrollProgressBar() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  gsap.set(bar, { scaleX: 0, transformOrigin: 'left center' });
  gsap.to(bar, {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.3,
    },
  });
}

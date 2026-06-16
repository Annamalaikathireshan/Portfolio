export function initParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const blobs = document.querySelectorAll('.ambient-blob, .parallax-blob');
  const heroContent = document.querySelector('.hero-content') as HTMLElement | null;

  const onScroll = () => {
    const scrollY = window.scrollY;

    blobs.forEach((blob, i) => {
      const speed = 0.15 + i * 0.1;
      (blob as HTMLElement).style.transform = `translateY(${scrollY * speed}px)`;
    });

    if (heroContent && scrollY < window.innerHeight) {
      heroContent.style.transform = `translateY(${scrollY * 0.25}px)`;
      heroContent.style.opacity = String(1 - scrollY / (window.innerHeight * 0.8));
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

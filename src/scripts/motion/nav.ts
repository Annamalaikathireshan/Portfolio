export function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('#nav-links a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

export function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const backdrop = document.getElementById('nav-backdrop');
  if (!hamburger || !navLinks) return;

  const close = () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
    backdrop?.classList.remove('active');
  };

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    backdrop?.classList.toggle('active', navLinks.classList.contains('active'));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', close);
  });

  backdrop?.addEventListener('click', close);

  document.addEventListener('click', (e) => {
    if (
      !navLinks.contains(e.target as Node) &&
      !hamburger.contains(e.target as Node) &&
      navLinks.classList.contains('active')
    ) {
      close();
    }
  });
}

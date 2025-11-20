// Force scroll to top on reload
if (history.scrollRestoration) {
  history.scrollRestoration = 'manual';
} else {
  window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.scrollTo(0, 0);
  initTheme();
  initScrollReveal();
  initHeroAnimation();
  initMagneticButtons();
  initMobileMenu();
  initCountUp();
});

/* =========================================
   Count-Up Animation
   ========================================= */
function initCountUp() {
  const stats = document.querySelectorAll('.stat-number');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = +entry.target.getAttribute('data-target');
        const duration = 2000; // ms
        const increment = target / (duration / 16); // 60fps

        let current = 0;
        const updateCount = () => {
          current += increment;
          if (current < target) {
            entry.target.innerText = Math.ceil(current) + (target > 10 ? '+' : ''); // Add + for larger numbers
            if (target === 100) entry.target.innerText += '%'; // Special case for 100%
            requestAnimationFrame(updateCount);
          } else {
            entry.target.innerText = target + (target > 10 && target !== 100 ? '+' : '');
            if (target === 100) entry.target.innerText += '%';
          }
        };

        updateCount();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(stat => observer.observe(stat));
}

/* =========================================
   Mobile Menu
   ========================================= */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const links = navLinks.querySelectorAll('a');

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close menu when a link is clicked
  links.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !hamburger.contains(e.target) && navLinks.classList.contains('active')) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    }
  });
}

/* =========================================
   Theme Management
   ========================================= */
function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle');
  const html = document.documentElement;
  const iconSun = `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
  const iconMoon = `<svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;

  // Check local storage or system preference
  const savedTheme = localStorage.getItem('theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  let currentTheme = savedTheme || (systemDark ? 'dark' : 'light');
  applyTheme(currentTheme);

  toggleBtn.addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(currentTheme);
  });

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    toggleBtn.innerHTML = theme === 'light' ? iconMoon : iconSun;
  }
}

/* =========================================
   Scroll Reveal Animation
   ========================================= */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Optional: Stop observing once revealed
        // observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.reveal, .section-title').forEach(el => {
    observer.observe(el);
  });

  // Header scroll effect
  window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* =========================================
   Hero Background Animation (Canvas)
   ========================================= */
function initHeroAnimation() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  // Performance: Disable on mobile
  const isMobile = window.innerWidth < 768;
  if (isMobile) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];

  // Configuration
  const particleCount = 60;
  const connectionDistance = 150;
  const mouseDistance = 200;

  let mouse = { x: null, y: null };

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  function resize() {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  }

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.size = Math.random() * 2 + 1;
      this.baseColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim();
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Bounce off edges
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interaction
      if (mouse.x != null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseDistance) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (mouseDistance - distance) / mouseDistance;
          const directionX = forceDirectionX * force * 0.6;
          const directionY = forceDirectionY * force * 0.6;

          this.vx += directionX;
          this.vy += directionY;
        }
      }

      // Friction
      this.vx *= 0.98; // slightly less friction for more movement
      this.vy *= 0.98;

      // Minimum speed check to keep them moving
      if (Math.abs(this.vx) < 0.1) this.vx += (Math.random() - 0.5) * 0.05;
      if (Math.abs(this.vy) < 0.1) this.vy += (Math.random() - 0.5) * 0.05;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim();
      ctx.globalAlpha = 0.3;
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Update and draw particles
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    // Draw connections
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim();

    for (let i = 0; i < particles.length; i++) {
      for (let j = i; j < particles.length; j++) {
        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < connectionDistance) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.globalAlpha = 1 - (distance / connectionDistance);
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => {
    resize();
    initParticles();
  });

  resize();
  initParticles();
  animate();
}

/* =========================================
   Magnetic Buttons
   ========================================= */
function initMagneticButtons() {
  // Disable on mobile
  if (window.matchMedia("(pointer: coarse)").matches) return;

  const buttons = document.querySelectorAll('.btn, .social-btn');

  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });
}

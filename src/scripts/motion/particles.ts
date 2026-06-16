export function initParticles() {
  const canvas = document.getElementById('hero-canvas') as HTMLCanvasElement | null;
  if (!canvas) return;

  if (window.innerWidth < 768 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let particles: Particle[] = [];
  const role = document.documentElement.getAttribute('data-role');
  const particleCount = role === 'ai' ? 70 : 60;
  const connectionDistance = role === 'ai' ? 160 : 150;
  const mouseDistance = 200;
  let mouse = { x: null as number | null, y: null as number | null };

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
    width = canvas!.width = canvas!.parentElement!.offsetWidth;
    height = canvas!.height = canvas!.parentElement!.offsetHeight;
  }

  class Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;

    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.size = Math.random() * 2 + 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      if (mouse.x != null && mouse.y != null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouseDistance) {
          const force = (mouseDistance - distance) / mouseDistance;
          this.vx -= (dx / distance) * force * 0.6;
          this.vy -= (dy / distance) * force * 0.6;
        }
      }

      this.vx *= 0.98;
      this.vy *= 0.98;
    }

    draw() {
      const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
      ctx!.beginPath();
      ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx!.fillStyle = accent;
      ctx!.globalAlpha = role === 'ai' ? 0.5 : 0.35;
      ctx!.fill();
    }
  }

  function initParticleList() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx!.clearRect(0, 0, width, height);
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < connectionDistance) {
          ctx!.beginPath();
          ctx!.moveTo(particles[i].x, particles[i].y);
          ctx!.lineTo(particles[j].x, particles[j].y);
          ctx!.strokeStyle = accent;
          ctx!.globalAlpha = (1 - distance / connectionDistance) * (role === 'ai' ? 0.7 : 0.5);
          ctx!.lineWidth = role === 'ai' ? 1.2 : 1;
          ctx!.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => {
    resize();
    initParticleList();
  });

  resize();
  initParticleList();
  animate();
}

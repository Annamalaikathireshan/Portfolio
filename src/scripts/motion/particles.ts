function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const value = hex.trim().replace('#', '');
  const full = value.length === 3 ? value.split('').map((c) => c + c).join('') : value;
  const num = parseInt(full, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

export function initParticles() {
  const canvas = document.getElementById('hero-canvas') as HTMLCanvasElement | null;
  if (!canvas) return;

  if (window.innerWidth < 768 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Per-role theming: particles pick up the role accent; the AI portfolio
  // gets a denser network for a neural feel.
  const role = document.documentElement.getAttribute('data-role') || '';
  const accentHex =
    getComputedStyle(document.documentElement).getPropertyValue('--accent') || '#9a9a9a';
  const accent = hexToRgb(accentHex);

  let width = 0;
  let height = 0;
  let particles: Particle[] = [];
  const particleCount = role === 'ai' ? 70 : 45;
  const connectionDistance = role === 'ai' ? 120 : 100;
  const mouseDistance = 120;
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

    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
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
          this.vx -= (dx / distance) * force * 0.3;
          this.vy -= (dy / distance) * force * 0.3;
        }
      }

      this.vx *= 0.99;
      this.vy *= 0.99;
    }

    draw() {
      ctx!.fillStyle = `rgba(${accent.r}, ${accent.g}, ${accent.b}, 0.5)`;
      ctx!.fillRect(this.x - 0.75, this.y - 0.75, 1.5, 1.5);
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

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    ctx!.strokeStyle = `rgba(${accent.r}, ${accent.g}, ${accent.b}, 0.35)`;
    ctx!.lineWidth = 0.5;

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < connectionDistance) {
          ctx!.globalAlpha = (1 - distance / connectionDistance) * 0.4;
          ctx!.beginPath();
          ctx!.moveTo(particles[i].x, particles[i].y);
          ctx!.lineTo(particles[j].x, particles[j].y);
          ctx!.stroke();
        }
      }
    }

    ctx!.globalAlpha = 1;
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

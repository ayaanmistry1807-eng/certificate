/* ═══════════════════════════════════════════════
   AYAAN ASIF MISTRY — SCRIPT.JS
   ═══════════════════════════════════════════════ */

// ── Set year ──
document.getElementById('year').textContent = new Date().getFullYear();

// ── Certificate sources ──
const certs = [
  'certificate1.jpeg',
  'certificate2.jpeg',
  'certificate3.jpeg',
  'certificate4.jpeg',
  'certificate5.jpeg',
  'certificate6.jpeg'
];

let currentIndex = 0;

// ── Lightbox ──
const lightbox   = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lbLabel    = document.getElementById('lbLabel');

function openLightbox(index) {
  currentIndex = index;
  lightboxImg.src = certs[index];
  lbLabel.textContent = `CERT-${String(index + 1).padStart(3, '0')}  |  ${index + 1} / ${certs.length}`;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  setTimeout(() => { lightboxImg.src = ''; }, 350);
}

function navigateLightbox(dir) {
  currentIndex = (currentIndex + dir + certs.length) % certs.length;
  lightboxImg.style.opacity = '0';
  lightboxImg.style.transform = 'scale(0.9)';
  setTimeout(() => {
    lightboxImg.src = certs[currentIndex];
    lbLabel.textContent = `CERT-${String(currentIndex + 1).padStart(3, '0')}  |  ${currentIndex + 1} / ${certs.length}`;
    lightboxImg.style.transition = 'opacity 0.25s, transform 0.25s';
    lightboxImg.style.opacity = '1';
    lightboxImg.style.transform = 'scale(1)';
  }, 220);
}

// Keyboard nav
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') navigateLightbox(1);
  if (e.key === 'ArrowLeft')  navigateLightbox(-1);
});

// ── Particle Canvas ──
(function () {
  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [];

  const NUM_PARTICLES = 90;
  const COLOR = '0, 212, 255';

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : H + 10;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -(Math.random() * 0.5 + 0.2);
      this.r  = Math.random() * 1.4 + 0.3;
      this.a  = Math.random() * 0.5 + 0.1;
      this.da = (Math.random() - 0.5) * 0.004;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.a += this.da;
      if (this.a <= 0 || this.a >= 0.65) this.da *= -1;
      if (this.y < -10) this.reset(false);
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${COLOR}, ${this.a})`;
      ctx.fill();
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: NUM_PARTICLES }, () => new Particle());
  }

  // Draw connection lines between close particles
  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${COLOR}, ${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  init();
  loop();
})();

// ── Mouse parallax on photo ──
(function () {
  const photoWrapper = document.querySelector('.photo-wrapper');
  if (!photoWrapper) return;

  document.addEventListener('mousemove', e => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    photoWrapper.style.transform = `translateY(0) rotateY(${dx * 8}deg) rotateX(${-dy * 8}deg)`;
  });

  document.addEventListener('mouseleave', () => {
    photoWrapper.style.transform = '';
  });
})();

// ── Intersection Observer: animate cert cards on scroll ──
(function () {
  const cards = document.querySelectorAll('.cert-card');
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(c => {
    c.style.animationPlayState = 'paused';
    observer.observe(c);
  });
})();

// ── Glitch flicker on title occasionally ──
(function () {
  const nameLines = document.querySelectorAll('.name-line');

  setInterval(() => {
    if (Math.random() > 0.7) {
      const el = nameLines[Math.floor(Math.random() * nameLines.length)];
      el.style.textShadow = '3px 0 #ff00ff, -3px 0 #00ffff';
      setTimeout(() => {
        el.style.textShadow = '';
      }, 80);
    }
  }, 2500);
})();

// ── Typing cursor blink on mono elements ──
(function () {
  const tagline = document.querySelector('.hero-tagline .mono-text');
  if (!tagline) return;
  const text = tagline.textContent;
  tagline.textContent = '';
  let i = 0;
  const interval = setInterval(() => {
    tagline.textContent = text.slice(0, i) + (i < text.length ? '|' : '');
    i++;
    if (i > text.length + 1) clearInterval(interval);
  }, 45);
})();
/* =============================================
   AYAAN ASIF MISTRY — CERTIFICATE VAULT JS
   ============================================= */

'use strict';

// ===== CANVAS BACKGROUND =====
(function bgCanvas() {
  const canvas = document.getElementById('bgCanvas');
  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // --- Floating orbs ---
  const orbs = Array.from({ length: 6 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: 180 + Math.random() * 220,
    vx: (Math.random() - 0.5) * 0.25,
    vy: (Math.random() - 0.5) * 0.25,
    hue: Math.random() < 0.5 ? 'gold' : (Math.random() < 0.5 ? 'pink' : 'blue')
  }));

  const orbColors = {
    gold: 'rgba(232,184,109,',
    pink: 'rgba(255,60,172,',
    blue: 'rgba(76,201,240,'
  };

  // --- Grid lines ---
  function drawGrid() {
    ctx.strokeStyle = 'rgba(232,184,109,0.025)';
    ctx.lineWidth = 1;
    const gap = 80;
    for (let x = 0; x < W; x += gap) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += gap) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
  }

  // --- Particles ---
  const particles = Array.from({ length: 55 }, () => resetParticle({}));

  function resetParticle(p) {
    p.x = Math.random() * W;
    p.y = Math.random() * H;
    p.r = Math.random() * 1.5 + 0.3;
    p.vy = -(Math.random() * 0.35 + 0.08);
    p.vx = (Math.random() - 0.5) * 0.15;
    p.alpha = Math.random() * 0.5 + 0.1;
    p.life = 0;
    p.maxLife = 200 + Math.random() * 300;
    p.color = Math.random() < 0.6 ? 'rgba(232,184,109,' : 'rgba(255,60,172,';
    return p;
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);

    drawGrid();

    // Orbs
    orbs.forEach(o => {
      o.x += o.vx; o.y += o.vy;
      if (o.x < -o.r) o.x = W + o.r;
      if (o.x > W + o.r) o.x = -o.r;
      if (o.y < -o.r) o.y = H + o.r;
      if (o.y > H + o.r) o.y = -o.r;

      const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
      g.addColorStop(0, orbColors[o.hue] + '0.06)');
      g.addColorStop(1, orbColors[o.hue] + '0)');
      ctx.beginPath();
      ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    });

    // Particles
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.life++;
      if (p.life > p.maxLife) resetParticle(p);
      const ratio = p.life / p.maxLife;
      const a = p.alpha * (ratio < 0.1 ? ratio * 10 : ratio > 0.85 ? (1 - ratio) * 6.67 : 1);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + a + ')';
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }
  animate();
})();


// ===== PAGE LOADER =====
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
    // Trigger entrance
    startAnimations();
  }, 900);
});

function startAnimations() {
  // Counter
  animateCount('cCount', 5, 1400);
  // Reveal cards
  revealOnScroll();
}


// ===== COUNT ANIMATION =====
function animateCount(id, target, duration) {
  const el = document.getElementById(id);
  if (!el) return;
  const start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(ease * target);
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}


// ===== SCROLL REVEAL =====
function revealOnScroll() {
  const cards = document.querySelectorAll('.cert-card');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  cards.forEach(c => io.observe(c));
}


// ===== HEADER SCROLL =====
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) header.style.top = '8px';
  else header.style.top = '16px';
});


// ===== FILTER BAR =====
document.querySelectorAll('.fb').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.fb').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const f = btn.dataset.f;
    document.querySelectorAll('.cert-card').forEach(card => {
      if (f === 'all' || card.dataset.n === f) {
        card.style.display = '';
        card.style.opacity = '1';
      } else {
        card.style.display = 'none';
      }
    });
  });
});


// ===== LIGHTBOX =====
const CERTS = [
  'certificate1.jpeg',
  'certificate2.jpeg',
  'certificate3.jpeg',
  'certificate4.jpeg',
  'certificate5.jpeg'
];

let currentIdx = 0;
const lightbox = document.getElementById('lightbox');
const lbImg    = document.getElementById('lbImg');
const lbCnt    = document.getElementById('lbCnt');
const lbThumbs = document.getElementById('lbThumbs');
const lbSpin   = document.getElementById('lbSpin');

// Build thumbnails once
function buildThumbs() {
  lbThumbs.innerHTML = '';
  CERTS.forEach((src, i) => {
    const t = document.createElement('div');
    t.className = 'lb-thumb' + (i === currentIdx ? ' active' : '');
    t.innerHTML = `<img src="${src}" alt="cert ${i+1}" loading="lazy" />`;
    t.addEventListener('click', (e) => { e.stopPropagation(); loadLB(i); });
    lbThumbs.appendChild(t);
  });
}

function openLB(idx) {
  currentIdx = idx;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  buildThumbs();
  loadLB(idx);
}

function closeLB() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => {
    if (!lightbox.classList.contains('open')) lbImg.src = '';
  }, 450);
}

function loadLB(idx) {
  currentIdx = idx;
  lbSpin.classList.add('active');
  lbImg.classList.add('loading');

  const src = CERTS[idx];
  const tmp = new Image();
  tmp.onload = () => {
    lbImg.src = src;
    lbImg.alt = `Certificate ${idx + 1} — Ayaan Asif Mistry`;
    lbImg.classList.remove('loading');
    lbSpin.classList.remove('active');
  };
  tmp.src = src;

  lbCnt.textContent = `${idx + 1} / ${CERTS.length}`;

  // Update thumbs
  document.querySelectorAll('.lb-thumb').forEach((t, i) => {
    t.classList.toggle('active', i === idx);
  });
}

function moveLB(dir) {
  let next = currentIdx + dir;
  if (next < 0) next = CERTS.length - 1;
  if (next >= CERTS.length) next = 0;
  loadLB(next);
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLB();
  if (e.key === 'ArrowRight') moveLB(1);
  if (e.key === 'ArrowLeft')  moveLB(-1);
});

// Swipe support
let touchStartX = 0;
lightbox.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].clientX;
}, { passive: true });
lightbox.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 50) moveLB(dx < 0 ? 1 : -1);
});

// Expose to HTML onclick
window.openLB  = openLB;
window.closeLB = closeLB;
window.moveLB  = moveLB;


// ===== CURSOR TRAIL (desktop only) =====
(function cursor() {
  if (window.innerWidth < 900) return;
  const trail = document.createElement('div');
  trail.style.cssText = `
    position:fixed; width:280px; height:280px; border-radius:50%;
    pointer-events:none; z-index:0;
    background:radial-gradient(circle, rgba(232,184,109,0.05) 0%, transparent 70%);
    transform:translate(-50%,-50%);
    transition:left 0.18s ease, top 0.18s ease;
    will-change:left,top;
  `;
  document.body.appendChild(trail);
  document.addEventListener('mousemove', e => {
    trail.style.left = e.clientX + 'px';
    trail.style.top  = e.clientY + 'px';
  });
})();


// ===== 3D TILT ON CARDS =====
document.querySelectorAll('.cert-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r   = card.getBoundingClientRect();
    const cx  = r.left + r.width  / 2;
    const cy  = r.top  + r.height / 2;
    const dx  = (e.clientX - cx) / (r.width  / 2);
    const dy  = (e.clientY - cy) / (r.height / 2);
    card.querySelector('.cc-wrap').style.transform =
      `perspective(900px) rotateY(${dx * 5}deg) rotateX(${-dy * 5}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.querySelector('.cc-wrap').style.transform = '';
  });
});
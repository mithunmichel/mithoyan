/* ═══════════════════════════════════════
   MITHUN MURALI PORTFOLIO — main.js
   All interactions, routing, animations
═══════════════════════════════════════ */

/* ─── THEME ─── */
(function(){
  const saved = localStorage.getItem('mm-theme');
  if(saved) document.documentElement.setAttribute('data-theme', saved);
})();

function toggleTheme(){
  const h = document.documentElement;
  const next = h.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  h.setAttribute('data-theme', next);
  localStorage.setItem('mm-theme', next);
}

/* ─── CUSTOM CURSOR ─── */
const curDot = document.getElementById('cur-d');
const curRing = document.getElementById('cur-r');
let mx = 0, my = 0, rx = 0, ry = 0, cursorOn = false;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  if(!cursorOn){
    cursorOn = true;
    document.body.classList.add('cursor-ready');
    document.getElementById('cur').style.opacity = '1';
  }
  curDot.style.left = mx + 'px';
  curDot.style.top  = my + 'px';
});

document.addEventListener('mouseleave', () => {
  curDot.style.opacity = '0';
  curRing.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  curDot.style.opacity = '1';
  curRing.style.opacity = '.5';
});

(function rafCursor(){
  rx += (mx - rx) * 0.1;
  ry += (my - ry) * 0.1;
  curRing.style.left = rx + 'px';
  curRing.style.top  = ry + 'px';
  requestAnimationFrame(rafCursor);
})();

function attachCursorHover(selector){
  document.querySelectorAll(selector).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('ch'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('ch'));
  });
}
attachCursorHover('a, button, .project-card, .illus-item, .skill-c, .social-l, .ps, .pillar');

/* ─── PAGE ROUTING ─── */
let currentPage = 'home';
const wipe = document.getElementById('wipe');

function setActiveNav(page){
  const links = document.querySelectorAll('.nav-links a, #mob-menu a');
  links.forEach(a => a.classList.remove('active'));
  const map = {
    'home': 'nav-home',
    'projects': 'nav-projects',
    'detail-flyght': 'nav-projects',
    'detail-map': 'nav-projects',
    'detail-pmay': 'nav-projects',
    'illustrations': 'nav-illus',
    'about': 'nav-about',
    'contact': 'nav-contact'
  };
  const id = map[page];
  if(id){
    document.querySelectorAll('[data-nav="'+id+'"]').forEach(el => el.classList.add('active'));
  }
}

function goPage(name){
  if(currentPage === name) return;
  wipe.className = 'in';
  setTimeout(() => {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById('page-' + name);
    if(target){
      target.classList.add('active');
      target.querySelectorAll('.reveal').forEach(el => el.classList.remove('vis'));
    }
    currentPage = name;
    setActiveNav(name);
    window.scrollTo(0, 0);
    wipe.className = 'out';
    setTimeout(() => {
      wipe.className = '';
      triggerReveals();
      if(name === 'home') initCardTilt();
      if(name === 'projects') initCardTilt();
      if(name === 'illustrations') initIllusPage();
    }, 600);
  }, 500);
}

function navTo(section){
  if(section === 'illustrations'){ goPage('illustrations'); return; }
  if(section === 'projects'){ goPage('projects'); return; }
  if(currentPage === 'home'){
    scrollToSection(section);
    setActiveNav(section);
  } else {
    goPage('home');
    setTimeout(() => { scrollToSection(section); setActiveNav(section); }, 800);
  }
}

function scrollToSection(id){
  const el = document.getElementById(id) || document.getElementById(id + '-home');
  if(el) el.scrollIntoView({ behavior: 'smooth' });
}

/* ─── SCROLL REVEAL ─── */
function triggerReveals(){
  setTimeout(() => {
    document.querySelectorAll('.page.active .reveal:not(.vis)').forEach(el => {
      el.classList.add('vis');
    });
  }, 80);
}
triggerReveals();

/* ─── NAV SCROLL BEHAVIOUR ─── */
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', scrollY > 40);
  // Update active nav based on scroll position when on home
  if(currentPage !== 'home') return;
  const sections = ['contact', 'about', 'projects-home', 'home'];
  for(const id of sections){
    const el = document.getElementById(id);
    if(el && el.getBoundingClientRect().top <= 100){
      if(id === 'contact') setActiveNav('contact');
      else if(id === 'about') setActiveNav('about');
      else setActiveNav('home');
      break;
    }
  }
}, { passive: true });

setActiveNav('home');

/* ─── MOBILE MENU ─── */
function toggleMenu(){
  const h = document.getElementById('hamburger');
  const m = document.getElementById('mob-menu');
  h.classList.toggle('open');
  m.classList.toggle('open');
  document.body.style.overflow = m.classList.contains('open') ? 'hidden' : '';
}
function closeMenu(){
  document.getElementById('hamburger').classList.remove('open');
  document.getElementById('mob-menu').classList.remove('open');
  document.body.style.overflow = '';
}

/* ─── HERO PARALLAX ─── */
window.addEventListener('scroll', () => {
  if(currentPage !== 'home') return;
  const y = window.scrollY;
  document.querySelectorAll('#home .hero-grid, #home .orb').forEach(el => {
    el.style.transform = `translateY(${y * 0.18}px)`;
  });
  document.querySelectorAll('#home .hero-content').forEach(el => {
    el.style.transform = `translateY(${y * 0.06}px)`;
  });
}, { passive: true });

/* ─── MAGNETIC BUTTON ─── */
document.querySelectorAll('.btn-mag').forEach(wrap => {
  const btn = wrap.querySelector('.btn-primary');
  if(!btn) return;
  wrap.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const cx = r.left + r.width/2, cy = r.top + r.height/2;
    const dx = e.clientX - cx, dy = e.clientY - cy;
    const dist = Math.sqrt(dx*dx + dy*dy);
    if(dist < 120){
      const f = (1 - dist/120) * 14;
      btn.style.transform = `translate(${dx/dist*f}px,${dy/dist*f}px)`;
      btn.style.transition = 'transform .1s';
    }
  });
  wrap.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0,0)';
    btn.style.transition = 'transform .5s cubic-bezier(0.16,1,0.3,1)';
  });
});

/* ─── 3D CARD TILT ─── */
function applyTilt(card, intensity){
  intensity = intensity || 10;
  if(card._tiltDone) return;
  card._tiltDone = true;
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * intensity;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * -intensity;
    card.style.transform = `perspective(900px) rotateX(${y}deg) rotateY(${x}deg) translateY(-6px)`;
    card.style.transition = 'transform .08s';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translateY(0)';
    card.style.transition = 'transform .6s cubic-bezier(0.16,1,0.3,1)';
  });
}

function initCardTilt(){
  document.querySelectorAll('.page.active .project-card').forEach(c => applyTilt(c, 10));
}
initCardTilt();

/* ─── SPLIT PORTRAIT ─── */
const portrait  = document.getElementById('splitPortrait');
const artLayer  = document.getElementById('portraitArt');
const dividerEl = document.getElementById('portraitDivider');

if(portrait && artLayer && dividerEl){
  let curX = 50, tgtX = 50;
  portrait.addEventListener('mousemove', e => {
    const r = portrait.getBoundingClientRect();
    tgtX = Math.max(0, Math.min(100, (e.clientX - r.left) / r.width * 100));
  });
  portrait.addEventListener('mouseleave', () => { tgtX = 50; });
  (function lerpPortrait(){
    curX += (tgtX - curX) * 0.1;
    artLayer.style.clipPath = `inset(0 ${(100 - curX).toFixed(1)}% 0 0)`;
    dividerEl.style.left = curX.toFixed(1) + '%';
    requestAnimationFrame(lerpPortrait);
  })();
}

/* ─── ILLUSTRATIONS ─── */
const illusData = [
  {label:'Character Study',   sub:'Pencil · 2024',   c:'rgba(190,120,210,'},
  {label:'Editorial Piece',   sub:'Ink · 2024',      c:'rgba(212,184,150,'},
  {label:'Caricature',        sub:'Procreate · 2023',c:'rgba(100,180,160,'},
  {label:'Urban Sketch',      sub:'Pen · 2023',      c:'rgba(190,120,210,'},
  {label:'Character Design',  sub:'Procreate · 2024',c:'rgba(212,184,150,'},
  {label:'Abstract',          sub:'Digital · 2024',  c:'rgba(100,140,200,'},
  {label:'Ink Study',         sub:'Ink · 2023',      c:'rgba(190,120,210,'},
  {label:'Environment',       sub:'Procreate · 2024',c:'rgba(100,180,140,'},
];
const svgTemplates = [
  c=>`<circle cx="60" cy="50" r="28" fill="${c}0.1)" stroke="${c}0.35)" stroke-width="1.2"/><ellipse cx="60" cy="46" rx="14" ry="18" fill="${c}0.07)" stroke="${c}0.28)" stroke-width="1"/><circle cx="52" cy="43" r="3.5" fill="${c}0.5)"/><circle cx="68" cy="43" r="3.5" fill="${c}0.5)"/><path d="M50,56 Q60,64 70,56" stroke="${c}0.45)" stroke-width="1.5" fill="none" stroke-linecap="round"/>`,
  c=>`<rect x="15" y="15" width="90" height="90" fill="none" stroke="${c}0.18)" stroke-width="1"/><line x1="15" y1="42" x2="105" y2="42" stroke="${c}0.1)" stroke-width="1"/><path d="M22,88 L38,42 L55,65 L72,32 L92,52" stroke="${c}0.65)" stroke-width="2.2" fill="none" stroke-linejoin="round"/><circle cx="92" cy="52" r="4" fill="${c}0.75)"/>`,
  c=>`<ellipse cx="60" cy="52" rx="22" ry="28" fill="${c}0.1)" stroke="${c}0.35)" stroke-width="1.2"/><circle cx="60" cy="30" r="16" fill="${c}0.07)" stroke="${c}0.26)" stroke-width="1"/><circle cx="54" cy="28" r="2.5" fill="${c}0.55)"/><circle cx="66" cy="28" r="2.5" fill="${c}0.55)"/><path d="M54,36 Q60,41 66,36" stroke="${c}0.42)" stroke-width="1.2" fill="none"/>`,
  c=>`<line x1="10" y1="100" x2="110" y2="100" stroke="${c}0.25)" stroke-width="1"/><rect x="15" y="65" width="18" height="35" fill="${c}0.1)" stroke="${c}0.3)" stroke-width="1"/><rect x="38" y="50" width="14" height="50" fill="${c}0.12)" stroke="${c}0.32)" stroke-width="1"/><rect x="82" y="44" width="16" height="56" fill="${c}0.13)" stroke="${c}0.3)" stroke-width="1"/>`,
  c=>`<ellipse cx="60" cy="30" rx="14" ry="17" fill="${c}0.1)" stroke="${c}0.32)" stroke-width="1.2"/><rect x="47" y="48" width="26" height="36" rx="4" fill="${c}0.07)" stroke="${c}0.26)" stroke-width="1.2"/><line x1="47" y1="54" x2="32" y2="74" stroke="${c}0.28)" stroke-width="1.5"/><line x1="73" y1="54" x2="88" y2="74" stroke="${c}0.28)" stroke-width="1.5"/>`,
  c=>`<circle cx="40" cy="40" r="28" fill="${c}0.07)" stroke="${c}0.18)" stroke-width="1"/><circle cx="72" cy="72" r="22" fill="${c}0.06)" stroke="${c}0.16)" stroke-width="1"/><path d="M18,75 Q45,55 75,80 Q95,95 108,70" stroke="${c}0.5)" stroke-width="2" fill="none"/>`,
  c=>`<path d="M20,95 Q35,50 55,70 Q70,85 80,45 Q88,20 105,55" stroke="${c}0.6)" stroke-width="2.5" fill="none" stroke-linecap="round"/><circle cx="20" cy="95" r="4" fill="${c}0.65)"/><circle cx="105" cy="55" r="4" fill="${c}0.65)"/>`,
  c=>`<ellipse cx="60" cy="88" rx="52" ry="20" fill="${c}0.07)" stroke="${c}0.18)" stroke-width="1"/><path d="M28,88 Q40,44 60,68 Q80,44 92,88" fill="${c}0.07)" stroke="${c}0.26)" stroke-width="1.2"/><circle cx="60" cy="32" r="18" fill="${c}0.06)" stroke="${c}0.2)" stroke-width="1"/>`,
];

function buildIllusItem(d, i){
  const svgContent = svgTemplates[i % svgTemplates.length](d.c);
  const item = document.createElement('div');
  item.className = 'illus-item';
  item.innerHTML = `
    <div class="illus-reveal-cover"></div>
    <div class="illus-inner">
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="120" fill="rgba(16,16,18,1)"/>
        ${svgContent}
      </svg>
    </div>
    <div class="illus-overlay">
      <div class="illus-ov-label">${d.label}</div>
      <div class="illus-ov-view">${d.sub}</div>
    </div>`;
  item.addEventListener('click', () => openLB(d.label, svgContent));
  applyTilt(item, 16);
  return item;
}

// Home preview grid (8 items)
const homeGrid = document.getElementById('illusGrid');
if(homeGrid){
  illusData.forEach((d, i) => homeGrid.appendChild(buildIllusItem(d, i)));
  observeIllusItems(homeGrid);
}

// Full illustrations page grid (12 items)
const pageGrid = document.getElementById('illusGridPage');
if(pageGrid){
  const extra = [
    {label:'Caricature Study', sub:'Pencil · 2024',   c:'rgba(212,184,150,'},
    {label:'Portrait Sketch',  sub:'Ink · 2023',      c:'rgba(190,120,210,'},
    {label:'Editorial Concept',sub:'Procreate · 2024',c:'rgba(100,180,160,'},
    {label:'Character Sheet',  sub:'Pencil · 2024',   c:'rgba(100,140,200,'},
  ];
  [...illusData, ...extra].forEach((d, i) => pageGrid.appendChild(buildIllusItem(d, i)));
  observeIllusItems(pageGrid);
}

function observeIllusItems(grid){
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, idx) => {
      if(e.isIntersecting) setTimeout(() => e.target.classList.add('revealed'), idx * 60);
    });
  }, { threshold: 0.1 });
  grid.querySelectorAll('.illus-item').forEach(el => obs.observe(el));
}

function initIllusPage(){
  document.querySelectorAll('#page-illustrations .illus-item').forEach((el, idx) => {
    setTimeout(() => el.classList.add('revealed'), idx * 60);
  });
  // Apply tilt to newly added items
  document.querySelectorAll('#page-illustrations .illus-item').forEach(el => applyTilt(el, 16));
}

/* ─── LIGHTBOX ─── */
function openLB(label, svg){
  const lb = document.getElementById('lightbox');
  document.getElementById('lb-img').innerHTML = `<rect width="120" height="120" fill="rgba(14,14,16,1)"/>${svg}`;
  document.getElementById('lb-caption').textContent = label;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLB(){
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeLB(); });

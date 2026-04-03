/* ─── ACTIVE NAV STATE ─── */
function setActiveNav(page){
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  const map = {
    'home': 0,
    'projects': 1, 'detail-flyght': 1, 'detail-map': 1, 'detail-pmay': 1,
    'illustrations': 2,
    'about-section': 3,
    'contact-section': 4
  };
  const idx = map[page];
  if(idx !== undefined){
    const links = document.querySelectorAll('.nav-links a');
    if(links[idx]) links[idx].classList.add('active');
  }
}

/* ─── CURSOR ─── */
const cd=document.getElementById('cur-d'),cr=document.getElementById('cur-r');
let mx=0,my=0,rx=0,ry=0;
let cursorActive = false;

// Only activate custom cursor on true pointer devices
document.addEventListener('mousemove',e=>{
  if(!cursorActive){
    cursorActive = true;
    document.body.classList.add('cursor-ready');
    document.getElementById('cur').style.opacity = '1';
  }
  mx=e.clientX;my=e.clientY;
  cd.style.left=mx+'px';cd.style.top=my+'px';
});

// Hide cursor when mouse leaves window
document.addEventListener('mouseleave',()=>{
  if(cd) cd.style.opacity='0';
  if(cr) cr.style.opacity='0';
});
document.addEventListener('mouseenter',()=>{
  if(cd) cd.style.opacity='1';
  if(cr) cr.style.opacity='.4';
});

(function raf(){rx+=(mx-rx)*.08;ry+=(my-ry)*.08;cr.style.left=rx+'px';cr.style.top=ry+'px';requestAnimationFrame(raf)})();
document.querySelectorAll('a,button,.project-card,.illus-item,.social-l,.skill-c,.mod-chip,.pillar,.ps').forEach(el=>{
  el.addEventListener('mouseenter',()=>document.body.classList.add('ch'));
  el.addEventListener('mouseleave',()=>document.body.classList.remove('ch'));
});

/* ─── NAV ─── */
window.addEventListener('scroll',()=>{
  document.getElementById('nav').classList.toggle('scrolled',scrollY>40);
});

/* ─── THEME #1 ─── */
function toggleTheme(){
  const h=document.documentElement;
  h.setAttribute('data-theme',h.getAttribute('data-theme')==='dark'?'light':'dark');
}

/* ─── MOBILE MENU #6 ─── */
function toggleMenu(){
  const h=document.getElementById('hamburger');
  const m=document.getElementById('mob-menu');
  h.classList.toggle('open');
  m.classList.toggle('open');
  document.body.style.overflow=m.classList.contains('open')?'hidden':'';
}
function closeMenu(){
  document.getElementById('hamburger').classList.remove('open');
  document.getElementById('mob-menu').classList.remove('open');
  document.body.style.overflow='';
}

/* ─── PAGE WIPE ─── */
const wipe=document.getElementById('wipe');

// Track current page
let currentPage = 'home';

function goPage(name){
  if(currentPage === name) return;
  wipe.className='in';
  setTimeout(()=>{
    document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
    const t=document.getElementById('page-'+name);
    if(t){
      t.classList.add('active');
      // Reset reveals only on the new page
      t.querySelectorAll('.reveal').forEach(el=>el.classList.remove('vis'));
    }
    currentPage = name;
    setActiveNav(name);
    window.scrollTo(0,0);
    wipe.className='out';
    setTimeout(()=>{
      wipe.className='';
      triggerReveals();
      if(name==='illustrations') initIllusPage();
    },600);
  },560);
}

// Smart nav — if already on home, just scroll; otherwise go home then scroll
function navTo(section){
  if(section === 'illustrations'){
    goPage('illustrations');
    return;
  }
  if(currentPage === 'home'){
    toSec(section);
  } else {
    goPage('home');
    later(()=>toSec(section));
  }
}

function later(fn){setTimeout(fn,750)}
function toSec(id){
  const el=document.getElementById(id)||document.getElementById(id+'-home');
  if(el)el.scrollIntoView({behavior:'smooth'});
}

/* ─── SCROLL REVEAL — handled by CSS, JS just adds vis class ─── */
function triggerReveals(){
  document.querySelectorAll('.page.active .reveal').forEach(el=>{
    el.classList.add('vis');
  });
}
setTimeout(triggerReveals, 50);


// Set initial active nav state
setActiveNav('home');

// Scroll-based nav highlighting for home sections
window.addEventListener('scroll',()=>{
  if(currentPage !== 'home') return;
  const sections = ['contact','about','projects-home','home'];
  for(const id of sections){
    const el = document.getElementById(id);
    if(el && el.getBoundingClientRect().top <= 120){
      if(id === 'contact') setActiveNav('contact-section');
      else if(id === 'about') setActiveNav('about-section');
      else setActiveNav('home');
      break;
    }
  }
},{passive:true});

/* ─── HERO PARALLAX ─── */
window.addEventListener('scroll',()=>{
  const y=window.scrollY;
  document.querySelectorAll('#home .hero-grid, #home .orb').forEach(el=>{
    el.style.transform=`translateY(${y*.18}px)`;
  });
  document.querySelectorAll('#home .hero-content').forEach(el=>{
    el.style.transform=`translateY(${y*.06}px)`;
  });
},{passive:true});

/* ─── MAGNETIC BUTTONS #4 ─── */
document.querySelectorAll('.btn-mag').forEach(wrap=>{
  const btn=wrap.querySelector('.btn-primary');
  wrap.addEventListener('mousemove',e=>{
    const r=btn.getBoundingClientRect();
    const cx=r.left+r.width/2,cy=r.top+r.height/2;
    const dx=e.clientX-cx,dy=e.clientY-cy;
    const dist=Math.sqrt(dx*dx+dy*dy);
    if(dist<110){
      const f=(1-dist/110)*13;
      btn.style.transform=`translate(${dx/dist*f}px,${dy/dist*f}px)`;
      btn.style.transition='transform .1s';
    }
  });
  wrap.addEventListener('mouseleave',()=>{
    btn.style.transform='translate(0,0)';
    btn.style.transition='transform .5s cubic-bezier(0.16,1,0.3,1)';
  });
});

/* ─── SPLIT PORTRAIT REVEAL ─── */
const portrait = document.getElementById('splitPortrait');
const art = document.getElementById('portraitArt');
const divider = document.getElementById('portraitDivider');

if(portrait && art && divider){
  // Start at 50/50
  let currentX = 50;
  let targetX = 50;

  portrait.addEventListener('mousemove', e => {
    const r = portrait.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100));
    targetX = pct;
  });

  portrait.addEventListener('mouseleave', () => {
    targetX = 50;
  });

  // Smooth lerp animation
  (function lerpPortrait(){
    currentX += (targetX - currentX) * 0.12;
    const p = currentX.toFixed(2);
    art.style.clipPath = `inset(0 ${(100 - p).toFixed(2)}% 0 0)`;
    divider.style.left = `${p}%`;
    requestAnimationFrame(lerpPortrait);
  })();
}

/* ─── 3D TILT ON PROJECT CARDS ─── */
document.querySelectorAll('.project-card').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    const x=((e.clientX-r.left)/r.width-.5)*10;
    const y=((e.clientY-r.top)/r.height-.5)*-10;
    card.style.transform=`perspective(800px) rotateX(${y}deg) rotateY(${x}deg) translateY(-8px)`;
    card.style.transition='transform .1s';
  });
  card.addEventListener('mouseleave',()=>{
    card.style.transform='perspective(800px) rotateX(0) rotateY(0) translateY(0)';
    card.style.transition='transform .6s cubic-bezier(0.16,1,0.3,1)';
  });
});

/* ─── ILLUSTRATIONS ─── */
const illusData=[
  {label:'Character Study',sub:'Pencil · 2024',c:'rgba(190,120,210,'},
  {label:'Editorial Piece',sub:'Ink · 2024',c:'rgba(212,184,150,'},
  {label:'Caricature',sub:'Procreate · 2023',c:'rgba(100,180,160,'},
  {label:'Urban Sketch',sub:'Pen · 2023',c:'rgba(190,120,210,'},
  {label:'Character Design',sub:'Procreate · 2024',c:'rgba(212,184,150,'},
  {label:'Abstract',sub:'Digital · 2024',c:'rgba(100,140,200,'},
  {label:'Ink Study',sub:'Ink · 2023',c:'rgba(190,120,210,'},
  {label:'Environment',sub:'Procreate · 2024',c:'rgba(100,180,140,'},
];
const svgT=[
  (c)=>`<circle cx="60" cy="50" r="28" fill="${c}0.1)" stroke="${c}0.35)" stroke-width="1.2"/><ellipse cx="60" cy="46" rx="14" ry="18" fill="${c}0.07)" stroke="${c}0.28)" stroke-width="1"/><circle cx="52" cy="43" r="3.5" fill="${c}0.5)"/><circle cx="68" cy="43" r="3.5" fill="${c}0.5)"/><path d="M50,56 Q60,64 70,56" stroke="${c}0.45)" stroke-width="1.5" fill="none" stroke-linecap="round"/>`,
  (c)=>`<rect x="15" y="15" width="90" height="90" fill="none" stroke="${c}0.18)" stroke-width="1"/><line x1="15" y1="42" x2="105" y2="42" stroke="${c}0.1)" stroke-width="1"/><line x1="15" y1="68" x2="105" y2="68" stroke="${c}0.1)" stroke-width="1"/><path d="M22,88 L38,42 L55,65 L72,32 L92,52" stroke="${c}0.65)" stroke-width="2.2" fill="none" stroke-linejoin="round" stroke-linecap="round"/><circle cx="92" cy="52" r="4" fill="${c}0.75)"/>`,
  (c)=>`<ellipse cx="60" cy="52" rx="22" ry="28" fill="${c}0.1)" stroke="${c}0.35)" stroke-width="1.2"/><circle cx="60" cy="30" r="16" fill="${c}0.07)" stroke="${c}0.26)" stroke-width="1"/><ellipse cx="60" cy="88" rx="32" ry="20" fill="${c}0.06)" stroke="${c}0.2)" stroke-width="1"/><circle cx="54" cy="28" r="2.5" fill="${c}0.55)"/><circle cx="66" cy="28" r="2.5" fill="${c}0.55)"/><path d="M54,36 Q60,41 66,36" stroke="${c}0.42)" stroke-width="1.2" fill="none"/>`,
  (c)=>`<line x1="10" y1="100" x2="110" y2="100" stroke="${c}0.25)" stroke-width="1"/><rect x="15" y="65" width="18" height="35" fill="${c}0.1)" stroke="${c}0.3)" stroke-width="1"/><rect x="38" y="50" width="14" height="50" fill="${c}0.12)" stroke="${c}0.32)" stroke-width="1"/><rect x="57" y="58" width="20" height="42" fill="${c}0.1)" stroke="${c}0.28)" stroke-width="1"/><rect x="82" y="44" width="16" height="56" fill="${c}0.13)" stroke="${c}0.3)" stroke-width="1"/>`,
  (c)=>`<ellipse cx="60" cy="30" rx="14" ry="17" fill="${c}0.1)" stroke="${c}0.32)" stroke-width="1.2"/><rect x="47" y="48" width="26" height="36" rx="4" fill="${c}0.07)" stroke="${c}0.26)" stroke-width="1.2"/><line x1="47" y1="54" x2="32" y2="74" stroke="${c}0.28)" stroke-width="1.5"/><line x1="73" y1="54" x2="88" y2="74" stroke="${c}0.28)" stroke-width="1.5"/><line x1="54" y1="84" x2="50" y2="105" stroke="${c}0.26)" stroke-width="1.5"/><line x1="66" y1="84" x2="70" y2="105" stroke="${c}0.26)" stroke-width="1.5"/>`,
  (c)=>`<circle cx="40" cy="40" r="28" fill="${c}0.07)" stroke="${c}0.18)" stroke-width="1"/><circle cx="72" cy="72" r="22" fill="${c}0.06)" stroke="${c}0.16)" stroke-width="1"/><path d="M18,75 Q45,55 75,80 Q95,95 108,70" stroke="${c}0.5)" stroke-width="2" fill="none" stroke-linecap="round"/>`,
  (c)=>`<path d="M20,95 Q35,50 55,70 Q70,85 80,45 Q88,20 105,55" stroke="${c}0.6)" stroke-width="2.5" fill="none" stroke-linecap="round"/><circle cx="20" cy="95" r="4" fill="${c}0.65)"/><circle cx="105" cy="55" r="4" fill="${c}0.65)"/>`,
  (c)=>`<ellipse cx="60" cy="88" rx="52" ry="20" fill="${c}0.07)" stroke="${c}0.18)" stroke-width="1"/><path d="M28,88 Q40,44 60,68 Q80,44 92,88" fill="${c}0.07)" stroke="${c}0.26)" stroke-width="1.2"/><circle cx="60" cy="32" r="18" fill="${c}0.06)" stroke="${c}0.2)" stroke-width="1"/><circle cx="60" cy="32" r="9" fill="${c}0.14)" stroke="${c}0.34)" stroke-width="1"/>`,
];

const grid=document.getElementById('illusGrid');
illusData.forEach((d,i)=>{
  const svgContent=svgT[i](d.c);
  const item=document.createElement('div');
  item.className='illus-item tilt-wrap';
  item.innerHTML=`
    <div class="illus-reveal-cover"></div>
    <div class="illus-inner" style="padding:20px">
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;display:block">
        <rect width="120" height="120" fill="rgba(16,16,18,1)"/>
        ${svgContent}
      </svg>
    </div>
    <div class="illus-overlay">
      <div class="illus-ov-label">${d.label}</div>
      <div class="illus-ov-view">${d.sub}</div>
    </div>`;
  item.addEventListener('click',()=>openLB(d.label,svgContent));
  grid.appendChild(item);
});

const ilObs=new IntersectionObserver(entries=>{
  entries.forEach((e,idx)=>{if(e.isIntersecting)setTimeout(()=>e.target.classList.add('revealed'),idx*70)});
},{threshold:.1});
document.querySelectorAll('.illus-item').forEach(el=>ilObs.observe(el));

document.querySelectorAll('.illus-item.tilt-wrap').forEach(el=>{
  el.addEventListener('mousemove',e=>{
    const r=el.getBoundingClientRect();
    const x=((e.clientX-r.left)/r.width-.5)*16;
    const y=((e.clientY-r.top)/r.height-.5)*-16;
    el.style.transform=`perspective(600px) rotateX(${y}deg) rotateY(${x}deg) scale(1.02)`;
    el.style.transition='transform .1s';
  });
  el.addEventListener('mouseleave',()=>{
    el.style.transform='perspective(600px) rotateX(0) rotateY(0) scale(1)';
    el.style.transition='transform .6s cubic-bezier(0.16,1,0.3,1)';
  });
});

// Also populate the illustrations PAGE grid
const gridPage = document.getElementById('illusGridPage');
if(gridPage){
  // Use same data but add more placeholder tiles
  const pageData = [
    ...illusData,
    {label:'Caricature Study',sub:'Pencil · 2024',c:'rgba(212,184,150,'},
    {label:'Portrait Sketch',sub:'Ink · 2023',c:'rgba(190,120,210,'},
    {label:'Editorial Concept',sub:'Procreate · 2024',c:'rgba(100,180,160,'},
    {label:'Character Sheet',sub:'Pencil · 2024',c:'rgba(100,140,200,'},
  ];
  pageData.forEach((d,i)=>{
    const svgContent=svgT[i%svgT.length](d.c);
    const item=document.createElement('div');
    item.className='illus-item tilt-wrap';
    item.innerHTML=`
      <div class="illus-reveal-cover"></div>
      <div class="illus-inner" style="padding:20px">
        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;display:block">
          <rect width="120" height="120" fill="rgba(16,16,18,1)"/>
          ${svgContent}
        </svg>
      </div>
      <div class="illus-overlay">
        <div class="illus-ov-label">${d.label}</div>
        <div class="illus-ov-view">${d.sub}</div>
      </div>`;
    item.addEventListener('click',()=>openLB(d.label,svgContent));
    gridPage.appendChild(item);
  });

  // Tilt on page grid items
  gridPage.querySelectorAll('.illus-item.tilt-wrap').forEach(el=>{
    el.addEventListener('mousemove',e=>{
      const r=el.getBoundingClientRect();
      const x=((e.clientX-r.left)/r.width-.5)*16;
      const y=((e.clientY-r.top)/r.height-.5)*-16;
      el.style.transform=`perspective(600px) rotateX(${y}deg) rotateY(${x}deg) scale(1.02)`;
      el.style.transition='transform .1s';
    });
    el.addEventListener('mouseleave',()=>{
      el.style.transform='perspective(600px) rotateX(0) rotateY(0) scale(1)';
      el.style.transition='transform .6s cubic-bezier(0.16,1,0.3,1)';
    });
  });
}

// Trigger reveal covers on illustrations page when it becomes active
function initIllusPage(){
  document.querySelectorAll('#page-illustrations .illus-item').forEach((el,idx)=>{
    setTimeout(()=>el.classList.add('revealed'), idx*60);
  });
}
  const lb=document.getElementById('lightbox');
  document.getElementById('lb-img').innerHTML=`<rect width="120" height="120" fill="rgba(14,14,16,1)"/>${svg}`;
  document.getElementById('lb-caption').textContent=label;
  lb.classList.add('open');
  document.body.style.overflow='hidden';
}
function closeLB(){
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow='';
}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeLB()});
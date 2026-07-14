
window.addEventListener('load', function() {
  var src = document.getElementById('alice-photo');
  var winImg = document.getElementById('alice-win-photo');
  if (src && winImg) winImg.src = src.src;
});

// ====== WINDOW MANAGEMENT ======
let topZ = 100;
let openWindows = [];

function openWindow(name) {
  const win = document.getElementById('win-' + name);
  if (!win) return;
  win.classList.add('show');
  win.style.zIndex = ++topZ;
  // center if not yet positioned
  if (!win._positioned) {
    const pw = win.offsetWidth || 400, ph = win.offsetHeight || 300;
    win.style.left = Math.max(20, (window.innerWidth - pw) / 2 - 30 + Math.random()*60) + 'px';
    win.style.top = Math.max(20, (window.innerHeight - ph) / 2 - 30 + Math.random()*60) + 'px';
    win._positioned = true;
  }
  if (!openWindows.includes(name)) openWindows.push(name);
  updateTaskbar();
  if (name === 'paint') initPaint();
}

function closeWindow(id) {
  const win = document.getElementById(id);
  if (win) win.classList.remove('show');
  const name = id.replace('win-','');
  openWindows = openWindows.filter(n => n !== name);
  updateTaskbar();;
  updateTaskbar();
}

function minimizeWindow(id) {
  const win = document.getElementById(id);
  if (win) win.classList.remove('show');
  updateTaskbar();
}

function focusWindow(name) {
  const win = document.getElementById('win-' + name);
  if (win) {
    win.classList.add('show');
    win.style.zIndex = ++topZ;
  }
}

// ====== TASKBAR BUTTONS ======
function updateTaskbar() {
  const container = document.getElementById('taskbar-buttons');
  container.innerHTML = '';
  const icons = {workshops:'🧶',events:'📋',links:'🔗',about:'🌈',halloffame:'🏛️',duck:'🦆',paint:'🎨',music:'🎵',portfolio:'✨',alice:'📷'};
  const labels = {workshops:'workshops',events:'events',links:'links',about:'about',halloffame:'hall of fame',duck:'duck',paint:'paint',music:'music',portfolio:'portfolio',alice:'4l1c3'};
  openWindows.forEach(name => {
    const btn = document.createElement('button');
    const win = document.getElementById('win-' + name);
    const isFocused = win && win.classList.contains('show') && parseInt(win.style.zIndex) === topZ;
    btn.className = 'taskbar-button' + (isFocused ? ' active' : '');
    btn.id = 'taskbar-btn-' + name;
    btn.textContent = (icons[name]||'📁') + ' ' + (labels[name]||name);
    btn.onclick = () => {
      const w = document.getElementById('win-' + name);
      if (!w) return;
      if (!w.classList.contains('show')) {
        // restore from minimized
        w.classList.add('show');
        w.style.zIndex = ++topZ;
      } else if (w.style.zIndex == topZ) {
        // already focused — minimize
        minimizeWindow('win-' + name);
        return;
      } else {
        // bring to front
        w.style.zIndex = ++topZ;
      }
      updateTaskbar();
    };
    container.appendChild(btn);
  });
}

// ====== DRAG ======
let dragging = null, dragOffX = 0, dragOffY = 0;
function startDrag(e, id) {
  dragging = id;
  const win = document.getElementById(id);
  win.style.zIndex = ++topZ;
  dragOffX = e.clientX - win.offsetLeft;
  dragOffY = e.clientY - win.offsetTop;
  e.preventDefault();
  updateTaskbar();
}
document.addEventListener('mousemove', e => {
  if (!dragging) return;
  const win = document.getElementById(dragging);
  win.style.left = (e.clientX - dragOffX) + 'px';
  win.style.top = Math.max(0, e.clientY - dragOffY) + 'px';
});
document.addEventListener('mouseup', () => { dragging = null; });
document.addEventListener('mousedown', e => {
  const win = e.target.closest('.xp-window');
  if (win && parseInt(win.style.zIndex) !== topZ) {
    win.style.zIndex = ++topZ;
    updateTaskbar();
  }
});

// ====== START MENU ======
function toggleStartMenu(e) {
  e.stopPropagation();
  document.getElementById('start-menu').classList.toggle('show');
}
function closeStartMenu(e) {
  if (!e || !e.target.closest('#start-menu')) {
    document.getElementById('start-menu').classList.remove('show');
  }
}

// ====== CLOCK ======
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2,'0');
  const m = String(now.getMinutes()).padStart(2,'0');
  document.getElementById('tray-time').textContent = h + ':' + m;
}
updateClock();
setInterval(updateClock, 30000);

// ====== WORKSHOP DETAIL ======
function showWorkshop(name) {
  document.getElementById('workshop-grid-view').style.display = 'none';
  document.querySelectorAll('.workshop-detail').forEach(d => d.classList.remove('show'));
  const detail = document.getElementById('ws-' + name);
  if (detail) detail.classList.add('show');
}
function closeWorkshop() {
  document.getElementById('workshop-grid-view').style.display = '';
  document.querySelectorAll('.workshop-detail').forEach(d => d.classList.remove('show'));
}

// ====== DUCK ======
let quackTimeout;
function quack() {
  const duck = document.getElementById('duck-emoji');
  const quackEl = document.getElementById('duck-quack');
  const quacks = ['QUACK!!! 🎉','quack quack quack','🦆💨','HONK HONK','quaaack~ ✨','...quack','DUCK RIGHTS! 🦆','ᕕ( ᐛ )ᕗ'];
  quackEl.textContent = quacks[Math.floor(Math.random()*quacks.length)];
  quackEl.classList.add('show');
  duck.style.transform = 'scale(1.3) rotate(10deg)';
  clearTimeout(quackTimeout);
  quackTimeout = setTimeout(() => {
    quackEl.classList.remove('show');
    duck.style.transform = '';
  }, 1200);
}

// ====== GIF PLAYER ======
const gifs = [
  {emoji:'✨',caption:'you are doing amazing sweetie'},
  {emoji:'🌈',caption:'rainbow vibes only'},
  {emoji:'🧶',caption:'yarn is just thread with potential'},
  {emoji:'🦆',caption:'duck duck duck'},
  {emoji:'🎨',caption:'make something messy today'},
  {emoji:'💜',caption:'neurodivergent and thriving'},
  {emoji:'🌸',caption:'sensory friendly ✓'},
  {emoji:'🪡',caption:'one stitch at a time'},
  {emoji:'✂️',caption:'cut the world up and rearrange it'},
  {emoji:'🐸',caption:'just vibing'},
  {emoji:'⭐',caption:'star citizen of craft club'},
  {emoji:'🍵',caption:'craft & tea & nothing to prove'},
];
function shuffleGif() {
  const g = gifs[Math.floor(Math.random()*gifs.length)];
  document.getElementById('gif-main').textContent = g.emoji;
  document.getElementById('gif-caption').textContent = g.caption;
}

// ====== PAINT ======
let paintCtx, painting = false, paintColor = '#000', paintSize = 3;
function initPaint() {
  const canvas = document.getElementById('paint-canvas');
  if (canvas._init) return;
  canvas._init = true;
  paintCtx = canvas.getContext('2d');
  canvas.addEventListener('mousedown', e => { painting = true; paintCtx.beginPath(); dot(e, canvas); });
  canvas.addEventListener('mousemove', e => { if (painting) draw(e, canvas); });
  canvas.addEventListener('mouseup', () => { painting = false; });
  canvas.addEventListener('mouseleave', () => { painting = false; });
  // touch support (mobile)
  canvas.addEventListener('touchstart', e => { e.preventDefault(); painting = true; paintCtx.beginPath(); dot(touchAsMouse(e), canvas); }, { passive: false });
  canvas.addEventListener('touchmove', e => { e.preventDefault(); if (painting) draw(touchAsMouse(e), canvas); }, { passive: false });
  canvas.addEventListener('touchend', () => { painting = false; });
}
function touchAsMouse(e) {
  const t = e.touches[0] || e.changedTouches[0];
  return { clientX: t.clientX, clientY: t.clientY };
}
function getPos(e, canvas) {
  const r = canvas.getBoundingClientRect();
  return { x: e.clientX - r.left, y: e.clientY - r.top };
}
function dot(e, canvas) {
  const p = getPos(e, canvas);
  paintCtx.fillStyle = paintColor;
  paintCtx.beginPath();
  paintCtx.arc(p.x, p.y, paintSize/2, 0, Math.PI*2);
  paintCtx.fill();
}
function draw(e, canvas) {
  const p = getPos(e, canvas);
  paintCtx.strokeStyle = paintColor;
  paintCtx.lineWidth = paintSize;
  paintCtx.lineCap = 'round';
  paintCtx.lineTo(p.x, p.y);
  paintCtx.stroke();
  paintCtx.beginPath();
  paintCtx.moveTo(p.x, p.y);
}
function setPaintColor(c, el) {
  paintColor = c;
  document.querySelectorAll('.paint-color').forEach(e => e.classList.remove('active'));
  el.classList.add('active');
}
function setPaintSize(s, el) {
  paintSize = s;
  document.querySelectorAll('.paint-size').forEach(e => e.classList.remove('active'));
  el.classList.add('active');
}
function clearPaint() {
  if (paintCtx) paintCtx.clearRect(0,0,560,380);
}

// ====== HALL OF FAME SLIDESHOW ======
const hofPhotos = [
  // Add your photos here as objects: { src: 'URL or data:image/...', caption: 'your caption' }
  // Example: { src: 'https://example.com/photo.jpg', caption: 'collage night, march 2025' }
];

let hofIndex = 0;
let hofView = 'grid';
let hofAutoTimer = null;

function hofInit() {
  hofRenderGrid();
  hofUpdateCounter();
  hofUpdateStatus();
}

function hofRenderGrid() {
  const grid = document.getElementById('hof-grid');
  if (!grid) return;
  grid.innerHTML = '';
  if (hofPhotos.length === 0) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:30px;color:#888;font-size:11px;">📸 no photos yet — be the first to share one!<br><br>DM <strong>@neurocrafting.berlin</strong> on instagram 💜</div>';
    return;
  }
  hofPhotos.forEach((p, i) => {
    const div = document.createElement('div');
    div.style.cssText = 'border:2px solid #ccc;background:#f0f0f0;cursor:pointer;text-align:center;overflow:hidden;aspect-ratio:1;';
    div.title = p.caption || '';
    div.ondblclick = () => { hofIndex = i; hofSetView('slideshow'); };
    div.onclick = () => { hofIndex = i; hofUpdateSlide(); };
    div.onmouseenter = () => { div.style.borderColor = '#ff9ec4'; };
    div.onmouseleave = () => { div.style.borderColor = '#ccc'; };
    const img = document.createElement('img');
    img.src = p.src;
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
    div.appendChild(img);
    grid.appendChild(div);
  });
}

function hofSetView(v) {
  hofView = v;
  const gridEl = document.getElementById('hof-grid-view');
  const slideEl = document.getElementById('hof-slide-view');
  const prevBtn = document.getElementById('hof-prev-btn');
  const nextBtn = document.getElementById('hof-next-btn');
  const autoBtn = document.getElementById('hof-auto-btn');
  if (v === 'slideshow') {
    gridEl.style.display = 'none';
    slideEl.style.display = 'flex';
    if (prevBtn) prevBtn.style.display = '';
    if (nextBtn) nextBtn.style.display = '';
    if (autoBtn) autoBtn.style.display = '';
    hofUpdateSlide();
  } else {
    gridEl.style.display = 'block';
    slideEl.style.display = 'none';
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    if (autoBtn) autoBtn.style.display = 'none';
    hofStopAuto();
  }
  hofUpdateCounter();
}

function hofUpdateSlide() {
  const img = document.getElementById('hof-slide-img');
  const placeholder = document.getElementById('hof-slide-placeholder');
  const caption = document.getElementById('hof-slide-caption');
  if (!img) return;
  if (hofPhotos.length === 0) {
    img.style.display = 'none';
    if (placeholder) placeholder.style.display = 'block';
    if (caption) caption.textContent = 'no photos yet 💜';
  } else {
    const p = hofPhotos[hofIndex];
    img.src = p.src;
    img.style.display = 'block';
    if (placeholder) placeholder.style.display = 'none';
    if (caption) caption.textContent = p.caption || '';
  }
  hofUpdateCounter();
}

function hofNext() {
  if (hofPhotos.length === 0) return;
  hofIndex = (hofIndex + 1) % hofPhotos.length;
  hofUpdateSlide();
}
function hofPrev() {
  if (hofPhotos.length === 0) return;
  hofIndex = (hofIndex - 1 + hofPhotos.length) % hofPhotos.length;
  hofUpdateSlide();
}
function hofToggleAuto() {
  const btn = document.getElementById('hof-auto-btn');
  if (hofAutoTimer) {
    hofStopAuto();
    if (btn) btn.textContent = '⏵ Auto';
  } else {
    hofAutoTimer = setInterval(hofNext, 3000);
    if (btn) btn.textContent = '⏸ Stop';
  }
}
function hofStopAuto() {
  clearInterval(hofAutoTimer);
  hofAutoTimer = null;
  const btn = document.getElementById('hof-auto-btn');
  if (btn) btn.textContent = '⏵ Auto';
}
function hofUpdateCounter() {
  const el = document.getElementById('hof-counter');
  if (!el) return;
  if (hofPhotos.length === 0) { el.textContent = ''; return; }
  el.textContent = hofView === 'slideshow' ? (hofIndex + 1) + ' / ' + hofPhotos.length : hofPhotos.length + ' photos';
}
function hofUpdateStatus() {
  const el = document.getElementById('hof-status');
  if (el) el.textContent = hofPhotos.length + ' photo' + (hofPhotos.length !== 1 ? 's' : '');
}

// Hook into openWindow to init slideshow
const _origOpenWindow = openWindow;
openWindow = function(name) {
  _origOpenWindow(name);
  if (name === 'halloffame') setTimeout(() => { hofSetView('grid'); hofInit(); }, 50);
};

// ====== MOBILE / HANDHELD ENHANCEMENTS ======
// On the desktop the icons and workshop cards open on double-click, which is
// unreliable on touch. On small/touch screens, make a single tap trigger the
// same action.
(function () {
  const isHandheld = window.matchMedia('(max-width: 768px)').matches || ('ontouchstart' in window);
  if (!isHandheld) return;
  function tapToOpen(selector) {
    document.querySelectorAll(selector).forEach(el => {
      el.addEventListener('click', function (e) {
        if (typeof el.ondblclick === 'function') el.ondblclick.call(el, e);
      });
    });
  }
  tapToOpen('.desktop-icon');
  tapToOpen('.workshop-card');
})();

// ====== CURSOR STARS ======
const stars = ['✨','⭐','🌸','💜','★','✦'];
document.addEventListener('mousemove', e => {
  if (Math.random() > 0.93) {
    const s = document.createElement('div');
    s.className = 'cursor-star';
    s.textContent = stars[Math.floor(Math.random()*stars.length)];
    s.style.left = e.clientX + 'px';
    s.style.top = e.clientY + 'px';
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 800);
  }
});

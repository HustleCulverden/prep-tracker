// ── Navigation ──────────────────────────────────────────────────────────────
function initNav(activePage) {
  const nav = document.querySelector('.bottom-nav');
  if (!nav) return;
  nav.querySelectorAll('.nav-item').forEach(item => {
    if (item.dataset.page === activePage) item.classList.add('active');
  });
}

// ── Toast ───────────────────────────────────────────────────────────────────
function showToast(msg, duration = 2200) {
  let t = document.querySelector('.toast');
  if (!t) {
    t = document.createElement('div');
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

// ── Rating buttons ──────────────────────────────────────────────────────────
function initRatingGroup(container, onChange) {
  container.querySelectorAll('.rating-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.rating-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      if (onChange) onChange(btn.dataset.value);
    });
  });
}

function setRatingValue(container, value) {
  container.querySelectorAll('.rating-btn').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.value === String(value));
  });
}

function getRatingValue(container) {
  const sel = container.querySelector('.rating-btn.selected');
  return sel ? sel.dataset.value : null;
}

// ── Build rating buttons ────────────────────────────────────────────────────
function buildRatingGroup(values, name) {
  const div = document.createElement('div');
  div.className = 'rating-group';
  div.dataset.name = name;
  values.forEach(v => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'rating-btn';
    btn.dataset.value = v;
    btn.textContent = v;
    div.appendChild(btn);
  });
  initRatingGroup(div);
  return div;
}

// ── Countdown ───────────────────────────────────────────────────────────────
function renderCountdowns(containerEl) {
  const shows = [
    { label: 'Show 1', date: CONFIG.show1 },
    { label: 'Show 2', date: CONFIG.show2 },
    { label: 'Show 3', date: CONFIG.show3 },
  ];
  containerEl.innerHTML = shows.map(s => `
    <div class="countdown-box">
      <div class="countdown-num">${daysToShow(s.date)}</div>
      <div class="countdown-label">${s.label}</div>
    </div>
  `).join('');
}

// ── KPI helper ──────────────────────────────────────────────────────────────
function kpiBox(value, label, style = '') {
  return `<div class="kpi-box ${style}">
    <div class="kpi-value">${value}</div>
    <div class="kpi-label">${label}</div>
  </div>`;
}

// ── Number formatting ───────────────────────────────────────────────────────
function fmt(n, decimals = 1) {
  if (n === null || n === undefined || isNaN(n)) return '—';
  return Number(n).toFixed(decimals);
}
function fmtInt(n) {
  if (n === null || n === undefined || isNaN(n)) return '—';
  return Math.round(n).toLocaleString();
}

// ── Phase badge colour ──────────────────────────────────────────────────────
function phaseBg(phase) {
  if (phase === 'Peak Week')   return '#FADBD8';
  if (phase === 'Competition') return '#E8DAEF';
  return '#FDEBD0';
}

// ── Date display ────────────────────────────────────────────────────────────
function dayLabel(dateStr) {
  const d = parseDate(dateStr);
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  return days[d.getDay()];
}

// ── Progress bar ────────────────────────────────────────────────────────────
function progressBar(label, value, max, unit = '') {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return `<div class="progress-bar-wrap">
    <div class="progress-bar-label">
      <span>${label}</span>
      <span>${fmtInt(value)}${unit} / ${fmtInt(max)}${unit}</span>
    </div>
    <div class="progress-bar-bg">
      <div class="progress-bar-fill" style="width:${pct}%"></div>
    </div>
  </div>`;
}

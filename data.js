// ── Prep Config ────────────────────────────────────────────────────────────
const CONFIG = {
  prepStart:   '2026-05-11',
  show1:       '2026-10-10',
  show2:       '2026-10-17',
  show3:       '2026-10-31',
  totalWeeks:  25,
  calTarget:   1640,
  proteinTarget: 200,
  stepTarget:  10000,
  stepPeakWk:  8000,
  waterTarget: 3,
  sleepTarget: 7.5,
  cardioType:  'Incline Walk',
  cardioDuration: 45,
  sessionsPerWeek: 5,
  phases: [
    { name: 'Cut / Deficit', startWeek: 1,  endWeek: 19 },
    { name: 'Peak Week',     startWeek: 20, endWeek: 21 },
    { name: 'Competition',   startWeek: 22, endWeek: 25 },
  ]
};

// ── Storage Keys ───────────────────────────────────────────────────────────
const KEYS = {
  daily:   'pt_daily',    // { "2026-05-11": { weight, cals, protein, ... } }
  weekly:  'pt_weekly',   // { "1": { notes, adjustments, ... } }
  config:  'pt_config',   // user-editable config overrides
};

// ── Helpers ─────────────────────────────────────────────────────────────────
function toISO(date) {
  if (typeof date === 'string') return date;
  return date.toISOString().split('T')[0];
}

function parseDate(str) {
  const [y,m,d] = str.split('-').map(Number);
  return new Date(y, m-1, d);
}

function daysBetween(a, b) {
  return Math.round((parseDate(b) - parseDate(a)) / 86400000);
}

function addDays(dateStr, n) {
  const d = parseDate(dateStr);
  d.setDate(d.getDate() + n);
  return toISO(d);
}

function weekNumber(dateStr) {
  const days = daysBetween(CONFIG.prepStart, dateStr);
  if (days < 0) return null;
  return Math.floor(days / 7) + 1;
}

function weekStartDate(weekNum) {
  return addDays(CONFIG.prepStart, (weekNum - 1) * 7);
}

function phaseForWeek(w) {
  for (const p of CONFIG.phases) {
    if (w >= p.startWeek && w <= p.endWeek) return p.name;
  }
  return '';
}

function daysToShow(showDate) {
  const today = toISO(new Date());
  return Math.max(0, daysBetween(today, showDate));
}

function formatDate(dateStr, opts = {}) {
  const d = parseDate(dateStr);
  return d.toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', ...opts });
}

function todayISO() { return toISO(new Date()); }

// ── Data Access ─────────────────────────────────────────────────────────────
function getAllDaily() {
  return JSON.parse(localStorage.getItem(KEYS.daily) || '{}');
}
function saveAllDaily(data) {
  localStorage.setItem(KEYS.daily, JSON.stringify(data));
}
function getDay(dateStr) {
  return getAllDaily()[dateStr] || {};
}
function saveDay(dateStr, data) {
  const all = getAllDaily();
  all[dateStr] = { ...all[dateStr], ...data };
  saveAllDaily(all);
}

function getAllWeekly() {
  return JSON.parse(localStorage.getItem(KEYS.weekly) || '{}');
}
function saveAllWeekly(data) {
  localStorage.setItem(KEYS.weekly, JSON.stringify(data));
}
function getWeek(weekNum) {
  return getAllWeekly()[String(weekNum)] || {};
}
function saveWeek(weekNum, data) {
  const all = getAllWeekly();
  all[String(weekNum)] = { ...all[weekNum], ...data };
  saveAllWeekly(all);
}

function getUserConfig() {
  return { ...CONFIG, ...JSON.parse(localStorage.getItem(KEYS.config) || '{}') };
}
function saveUserConfig(updates) {
  const existing = JSON.parse(localStorage.getItem(KEYS.config) || '{}');
  localStorage.setItem(KEYS.config, JSON.stringify({ ...existing, ...updates }));
}

// ── Computed stats ──────────────────────────────────────────────────────────
function sevenDayAvg(upToDate) {
  const all = getAllDaily();
  const weights = [];
  for (let i = 0; i < 7; i++) {
    const d = addDays(upToDate, -i);
    if (all[d] && all[d].weight) weights.push(Number(all[d].weight));
  }
  if (!weights.length) return null;
  return weights.reduce((a, b) => a + b, 0) / weights.length;
}

function weeklyAvgWeight(weekNum) {
  const start = weekStartDate(weekNum);
  const all = getAllDaily();
  const weights = [];
  for (let i = 0; i < 7; i++) {
    const d = addDays(start, i);
    if (all[d] && all[d].weight) weights.push(Number(all[d].weight));
  }
  if (!weights.length) return null;
  return weights.reduce((a, b) => a + b, 0) / weights.length;
}

function weeklyStats(weekNum) {
  const start = weekStartDate(weekNum);
  const all = getAllDaily();
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = addDays(start, i);
    if (all[d]) days.push(all[d]);
  }
  if (!days.length) return null;

  const avg = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null;
  const sum = (arr) => arr.reduce((a, b) => a + b, 0);

  const weights  = days.map(d => d.weight).filter(Boolean).map(Number);
  const cals     = days.map(d => d.cals).filter(Boolean).map(Number);
  const protein  = days.map(d => d.protein).filter(Boolean).map(Number);
  const steps    = days.map(d => d.steps).filter(Boolean).map(Number);
  const sleep    = days.map(d => d.sleep).filter(Boolean).map(Number);
  const energy   = days.map(d => d.energy).filter(Boolean).map(Number);
  const hunger   = days.map(d => d.hunger).filter(Boolean).map(Number);
  const cardioMins = days.map(d => d.cardioDuration).filter(Boolean).map(Number);
  const sessions = days.filter(d => d.trained === 'yes').length;

  return {
    avgWeight: avg(weights),
    avgCals: avg(cals),
    avgProtein: avg(protein),
    avgSteps: avg(steps),
    avgSleep: avg(sleep),
    avgEnergy: avg(energy),
    avgHunger: avg(hunger),
    totalCardio: sum(cardioMins),
    sessions,
    daysLogged: days.length,
  };
}

function currentWeekNum() {
  return weekNumber(todayISO()) || 1;
}

function startingWeight() {
  const all = getAllDaily();
  const sorted = Object.keys(all).sort();
  for (const d of sorted) {
    if (all[d].weight) return Number(all[d].weight);
  }
  return null;
}

function currentWeight() {
  const all = getAllDaily();
  const sorted = Object.keys(all).sort().reverse();
  for (const d of sorted) {
    if (all[d].weight) return Number(all[d].weight);
  }
  return null;
}

// ── Export ──────────────────────────────────────────────────────────────────
function exportCSV() {
  const all = getAllDaily();
  const headers = ['Date','Week','Phase','Weight','7DayAvg','Calories','Protein','Trained','SessionType','CardioType','CardioDuration','Steps','Water','Sleep','Energy','Hunger','Notes'];
  const rows = [headers.join(',')];

  Object.keys(all).sort().forEach(date => {
    const d = all[date];
    const wk = weekNumber(date);
    const avg7 = sevenDayAvg(date);
    const row = [
      date, wk || '', wk ? phaseForWeek(wk) : '',
      d.weight || '', avg7 ? avg7.toFixed(2) : '',
      d.cals || '', d.protein || '',
      d.trained || '', d.sessionType || '',
      d.cardioType || '', d.cardioDuration || '',
      d.steps || '', d.water || '', d.sleep || '',
      d.energy || '', d.hunger || '',
      (d.notes || '').replace(/,/g, ';'),
    ];
    rows.push(row.join(','));
  });

  const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `prep-tracker-export-${todayISO()}.csv`;
  a.click();
}

// ── Weight history for chart ────────────────────────────────────────────────
function weightHistory() {
  const all = getAllDaily();
  return Object.keys(all)
    .filter(d => all[d].weight)
    .sort()
    .map(d => ({ date: d, weight: Number(all[d].weight), avg7: sevenDayAvg(d) }));
}

function weeklyWeightHistory() {
  const result = [];
  for (let w = 1; w <= CONFIG.totalWeeks; w++) {
    const avg = weeklyAvgWeight(w);
    if (avg !== null) result.push({ week: w, avg, phase: phaseForWeek(w) });
  }
  return result;
}

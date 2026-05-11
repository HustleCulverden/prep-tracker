# 🏆 Prep Tracker

A mobile-first bodybuilding prep tracking app built with plain HTML/CSS/JS. Hosted free on GitHub Pages.

**Prep dates:** 11 May 2026 → Shows on 10 Oct · 17 Oct · 31 Oct 2026

---

## Pages

| Page | File | Purpose |
|------|------|---------|
| Daily Log | `index.html` | Log weight, nutrition, training, cardio, steps, sleep & biofeedback each morning |
| Weekly Check-In | `checkin.html` | Monday review — auto-filled stats from the daily log + your notes |
| Dashboard | `dashboard.html` | Weight trend chart, countdowns to shows, KPIs |
| Plan | `plan.html` | Your targets, training split, meal plan & phase timeline at a glance |

---

## Setup — GitHub Pages (5 minutes)

1. **Create a new GitHub repo** called `prep-tracker` (make it public)

2. **Upload all files** keeping the folder structure:
   ```
   prep-tracker/
   ├── index.html
   ├── checkin.html
   ├── dashboard.html
   ├── plan.html
   ├── css/
   │   └── style.css
   ├── js/
   │   ├── data.js
   │   └── app.js
   └── README.md
   ```

3. **Enable GitHub Pages:**
   - Go to your repo → Settings → Pages
   - Source: `Deploy from a branch`
   - Branch: `main` / `(root)`
   - Click Save

4. **Done!** Your app will be live at:
   `https://yourusername.github.io/prep-tracker`

   (Takes ~2 minutes to go live after first enable)

---

## Install on your phone (PWA)

**iPhone (Safari):**
1. Open the app URL in Safari
2. Tap the Share button (box with arrow)
3. Scroll down → "Add to Home Screen"
4. Tap Add — it appears on your home screen like a native app

**Android (Chrome):**
1. Open the app URL in Chrome
2. Tap the three-dot menu → "Add to Home screen"

---

## Data & Privacy

All data is stored locally in your browser's `localStorage` — nothing is sent to any server. Data persists between visits on the same device/browser.

**To back up your data:** Dashboard → Export CSV button — downloads all your logs as a spreadsheet.

**To transfer to another device:** Export CSV, then re-import manually (or use the same browser signed into Chrome sync).

---

## Customising

All prep config lives at the top of `js/data.js`:

```js
const CONFIG = {
  prepStart:      '2026-05-11',
  show1:          '2026-10-10',
  show2:          '2026-10-17',
  show3:          '2026-10-31',
  totalWeeks:     25,
  calTarget:      1640,
  proteinTarget:  200,
  stepTarget:     10000,
  waterTarget:    3,
  sleepTarget:    7.5,
  sessionsPerWeek: 5,
  // ...
};
```

Edit these values and push the updated `data.js` to GitHub — the site updates automatically.

Your meal plan and training split are editable directly in the app (Plan page → Edit buttons) and saved to localStorage.

---

## Colour scheme

Matches the Excel tracker:
- **Navy** `#1C1C2E` — headers, text
- **Pink** `#D63384` — accent, active states  
- **Gold** `#E67E22` — highlights

---

## Keeping it separate from Hustle

This is a completely independent repo from your Hustle training app. No shared code or dependencies. You can link between them in the nav if you want later.

(function () {
  var app = document.getElementById('app');
  var P = window.PLAN, EX = window.EXERCISES;
  var DOW = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  var FIRST = new Date(2026, 9, 26), SHIPD = new Date(2027, 0, 12);

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {} return null; }
  function key(d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function parse(s) { var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || ''); return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null; }
  function addDays(d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); }
  function clamp(d) { return d < FIRST ? FIRST : d > SHIPD ? SHIPD : d; }
  function today() { var n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); }
  function runCleared() { return store('cg.run') === '1'; }

  var CFG = window.CG_CONFIG || {};
  function code() { return store('cg.code') || ''; }
  function rpc(fn, body) {
    return fetch(CFG.url + '/rest/v1/rpc/' + fn, { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: CFG.anon, Authorization: 'Bearer ' + CFG.anon }, body: JSON.stringify(body) })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.status === 204 ? null : r.text().then(function (t) { return t ? JSON.parse(t) : null; }); });
  }

  /* ---------- completion state ---------- */
  function doneMap() { try { return JSON.parse(store('cg.done') || '{}'); } catch (e) { return {}; } }
  function saveDone(m) { store('cg.done', JSON.stringify(m)); }
  function streak() {
    var m = doneMap(), t = today(), n = 0, d = t > SHIPD ? SHIPD : t;
    if (d < FIRST) return 0;
    for (; d >= FIRST; d = addDays(d, -1)) {
      if (m[key(d)]) n++;
      else if (key(d) === key(t)) continue;           // today not finished yet: does not break the streak
      else if (P.getDay(d).rest) continue;            // rest days never break it
      else break;
    }
    return n;
  }
  var syncing = false;
  function syncDone() {
    if (!code() || syncing) return; syncing = true;
    rpc('list_checkins', { p_code: code() }).then(function (rows) {
      var srv = {}, loc = doneMap(), changed = false;
      (rows || []).forEach(function (r) { srv[r.day] = !!r.done; });
      Object.keys(loc).forEach(function (k) { if (loc[k] && !srv[k]) rpc('submit_checkin', { p_code: code(), p_day: k, p_done: true, p_ankle: null, p_pushups: null, p_plank: null, p_notes: null }).catch(function () {}); });
      var merged = {}; Object.keys(srv).forEach(function (k) { if (srv[k]) merged[k] = true; });
      Object.keys(loc).forEach(function (k) { if (loc[k]) merged[k] = true; });
      if (JSON.stringify(merged) !== JSON.stringify(loc)) { saveDone(merged); changed = true; }
      syncing = false; if (changed) route();
    }).catch(function () { syncing = false; });
  }
  function setDone(day, val) {
    var m = doneMap(); if (val) m[day] = true; else delete m[day]; saveDone(m);
    if (code()) rpc('submit_checkin', { p_code: code(), p_day: day, p_done: !!val, p_ankle: null, p_pushups: null, p_plank: null, p_notes: null }).catch(function () {});
  }
  var CHEV = '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
  var FLAGS = '<div class="flags" aria-hidden="true">' +
    '<svg width="34" height="26" viewBox="0 0 34 26"><rect width="34" height="26" fill="#fff"/><rect width="34" height="5.2" fill="#0B3D91"/><rect y="10.4" width="34" height="5.2" fill="#C8332A"/><rect y="20.8" width="34" height="5.2" fill="#0B3D91"/></svg>' +
    '<svg width="34" height="26" viewBox="0 0 34 26"><rect width="34" height="26" fill="#F5C400"/><g fill="#0B3D91"><rect x="5.7" width="5.7" height="26"/><rect x="17" width="5.7" height="26"/><rect x="28.3" width="5.7" height="26"/></g></svg></div>';

  function header(active) {
    var left = Math.max(0, Math.round((SHIPD - today()) / 86400000));
    var tabs = [['day', '#/', 'TODAY'], ['plan', '#/plan', 'PLAN'], ['tests', '#/tests', 'TESTS'], ['fuel', '#/fuel', 'FUEL']];
    if (code()) tabs.push(['family', '#/family', 'LOG']);
    return '<header class="head"><div class="head-top">' + FLAGS + (streak() > 0 ? '<div class="streak" title="Days in a row" aria-label="' + streak() + ' day streak">🔥 ' + streak() + '</div>' : '') + '<div class="count" style="margin:0;text-align:right">' + (left > 0 ? left + ' DAYS TO SHIP DAY<br>TUE JAN 12' : 'SHIP DAY') + '</div></div>' +
      '<div class="brand">THE COASTIE GRIND</div>' +
      '<nav class="tabs" aria-label="Main">' + tabs.map(function (t) { return '<a href="' + t[1] + '" ' + (active === t[0] ? 'aria-current="page"' : '') + '>' + t[2] + '</a>'; }).join('') + '</nav></header>';
  }
  var FOOT = '<div class="wrap"><p class="small">Unofficial training plan. Not affiliated with or endorsed by the U.S. Coast Guard. Test standards (15 push-ups in 60 sec, 1:09 forearm plank, 1.5-mile run in 15:05) assume a woman under 30; confirm yours with your recruiter. If an exercise hurts your ankle, stop and check with your PT or doctor.</p></div>';

  function itemHTML(it) {
    var e = it.ex ? EX[it.ex] : null;
    if (!e) return '<li><div class="plain"><span class="nm">' + esc(it.label || '') + '</span><span class="dose">' + esc(it.dose || '') + '</span></div></li>';
    var q = encodeURIComponent(e.search + ' how to');
    var steps = e.steps.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('');
    var media = e.video
      ? '<div class="video"><button class="play" type="button" data-vid="' + e.video + '" aria-label="Play video: ' + esc(e.name) + '" style="background-image:url(https://i.ytimg.com/vi/' + e.video + '/hqdefault.jpg)"><i></i></button></div>'
      : '';
    return '<li><details><summary><span class="nm">' + esc(e.name) + '</span><span class="dose">' + esc(it.dose || '') + '</span>' + CHEV + '</summary><div class="how">' + media +
      '<ol>' + steps + '</ol>' + (e.cue ? '<div class="cue">' + esc(e.cue) + '</div>' : '') +
      '<a class="alt" target="_blank" rel="noopener" href="https://www.youtube.com/results?search_query=' + q + '">' + (e.video ? 'Different video? Search YouTube' : 'Watch a demo on YouTube') + '</a></div></details></li>';
  }
  function blockHTML(b, i) {
    return '<section class="block"><div class="bh"><h3>' + (i + 1) + ' · ' + esc(b.name) + '</h3><span>' + b.minutes + ' MIN</span></div>' +
      (b.desc ? '<div class="bd">' + esc(b.desc) + '</div>' : '') + '<ul class="items">' + b.items.map(itemHTML).join('') + '</ul></section>';
  }

  function strip(d) {
    var mon = addDays(d, -((d.getDay() + 6) % 7)), t = key(today()), m = doneMap(), h = '<nav class="strip" aria-label="Days this week">';
    for (var i = 0; i < 7; i++) {
      var x = addDays(mon, i), k = key(x), ok = x >= FIRST && x <= SHIPD, cls = '', mark = '', lab = '';
      if (ok) {
        var rest = P.getDay(x).rest;
        if (m[k]) { cls += 'done '; mark = '✓'; lab = ', completed'; }
        else if (k < t && !rest) { cls += 'missed '; mark = '✕'; lab = ', missed'; }
      }
      h += (ok ? '<a href="#/' + k + '"' : '<a aria-disabled="true" style="opacity:.35;pointer-events:none"') + ' aria-label="' + P.label(x) + lab + '" class="' + cls + (k === key(d) ? 'sel ' : '') + (k === t ? 'today' : '') + '"><span class="d">' + DOW[x.getDay()] + '</span><span class="n">' + x.getDate() + '</span><span class="mk">' + mark + '</span></a>';
    }
    return h + '</nav>';
  }

  function renderDay(d) {
    d = clamp(d);
    var rc = runCleared(), day = P.getDay(d, { runCleared: rc }), h = header('day');
    var prev = d > FIRST ? '<a href="#/' + key(addDays(d, -1)) + '">‹ Yesterday</a>' : '<span></span>';
    var next = d < SHIPD ? '<a href="#/' + key(addDays(d, 1)) + '">Next day ›</a>' : '<span></span>';
    h += '<main class="wrap">' + strip(d) + '<div class="daynav">' + prev + (key(d) !== key(clamp(today())) ? '<a href="#/">Jump to today</a>' : '') + next + '</div>';
    if (day.state === 'ship') {
      h += '<div class="ship"><div class="disp" style="font-size:13px;letter-spacing:.14em">TUESDAY, JANUARY 12</div><h2>SHIP DAY</h2><p>You did the work. Rest, eat, bring your paperwork, and go show them.</p></div>';
    } else {
      var kick = 'WEEK ' + day.week + ' · ' + day.label.toUpperCase() + ' · ' + day.phase.name.toUpperCase();
      var dk = key(d), isDone = !!doneMap()[dk], future = dk > key(today());
      h += '<div class="card daycard"><button class="chk' + (isDone ? ' on' : '') + '" id="chk" type="button" ' + (future ? 'disabled ' : '') + 'aria-pressed="' + isDone + '" aria-label="' + (isDone ? 'Completed. Tap to undo' : 'Mark workout complete') + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></button><div class="kick">' + kick + '</div><h1 class="dtitle">' + esc(day.title) + '</h1><div class="chips"><span class="chip">' + day.minutes + ' MIN</span><span class="chip">PLANET FITNESS</span>' + (day.noImpact ? '<span class="chip red">NO IMPACT</span>' : '') + (isDone ? '<span class="chip ok">DONE ✓</span>' : '') + '</div></div>';
      h += '<div class="marks" aria-label="Test pass marks"><div class="mark"><b>15</b><span>PUSH-UPS / 60 SEC</span></div><div class="mark"><b>1:09</b><span>FOREARM PLANK</span></div><div class="mark"><b>15:05</b><span>1.5-MILE RUN</span></div></div>';
      h += day.blocks.map(blockHTML).join('');
      if (day.title === 'Mock Test') h += '<a class="btn" style="text-decoration:none" href="#/tests">LOG YOUR TEST RESULTS</a><div style="height:14px"></div>';
      h += code() ? checkinHTML(day) : '';
      var txt = P.stravaText(day);
      h += '<section class="strava"><h3>AFTER YOU FINISH</h3><p>Copy this and paste it into the Strava description.</p><textarea id="st" readonly rows="8" aria-label="Workout text for Strava">' + esc(txt) + '</textarea><button class="btn" id="cp" type="button">COPY FOR STRAVA</button></section>';
    }
    h += '<div class="card"><label class="toggle"><input type="checkbox" id="rc" ' + (rc ? 'checked' : '') + '><span><b>My PT or doctor cleared me to run</b><br><span class="small">Off: bike, elliptical and rower only. On: run sessions appear from Week 4.</span></span></label></div></main>' + FOOT;
    app.innerHTML = h;
    document.title = day.title ? day.title + ' · THE COASTIE GRIND' : 'THE COASTIE GRIND';
    bind();
  }

  function renderPlan() {
    var h = header('plan'), t = P.getDay(clamp(today())), nowWeek = t.week || 1;
    var gates = {
      1: 'To start Phase 2: PT or doctor says go · 30 min brisk walk with no pain · 15 single-leg calf raises · 30 sec single-leg balance',
      2: 'To start Phase 3: 20 min continuous jog, ankle quiet the next morning · 10+ push-ups · 50+ sec plank'
    };
    h += '<main class="wrap"><h1 class="dtitle" style="margin:4px 0 6px">THE PLAN</h1><p style="margin:0 0 14px;color:#2F4A63">Four phases. Move up when your ankle and your numbers say so, not just when the calendar does.</p>';
    P.PHASES.forEach(function (ph) {
      var wk = '';
      for (var w = ph.weeks[0]; w <= Math.min(ph.weeks[1], 12); w++) {
        var start = addDays(FIRST, (w - 1) * 7);
        if (start > SHIPD) break;
        wk += '<a href="#/' + key(start) + '" class="' + (w === nowWeek ? 'now' : '') + '">Wk ' + w + '<small>' + (start.getMonth() + 1) + '/' + start.getDate() + '</small></a>';
      }
      h += '<section class="card phase ' + (nowWeek >= ph.weeks[0] && nowWeek <= ph.weeks[1] ? 'now' : '') + '"><h3>' + ph.n + ' · ' + esc(ph.name) + '</h3><p style="margin:4px 0 0;color:#2F4A63">' + esc(ph.blurb) + '</p>' +
        (gates[ph.n] ? '<p class="small" style="margin-top:8px"><b>' + esc(gates[ph.n]) + '</b></p>' : '') + '<div class="weeks">' + wk + '</div></section>';
    });
    h += '<section class="card"><h3 style="font-size:19px">A TYPICAL WEEK</h3>' +
      [['MON', 'Base Engine: steady cardio, core, push-ups'], ['TUE', 'Intervals'], ['WED', 'Upper body, push-up and plank builder'], ['THU', 'Steady cardio, glutes and back'], ['FRI', 'Mock test: push-ups, plank, cardio'], ['SAT', 'Long and easy'], ['SUN', 'Rest, 5 min ankle reset']].map(function (r) {
        return '<div style="display:flex;padding:9px 0;border-top:1px solid var(--line)"><b style="width:52px">' + r[0] + '</b><span style="flex:1;color:#2F4A63">' + r[1] + '</span></div>';
      }).join('') + '<p class="small">Every session is 45 minutes or less.</p></section></main>' + FOOT;
    app.innerHTML = h; document.title = 'The Plan · THE COASTIE GRIND'; window.scrollTo(0, 0);
  }

  function checkinHTML(day) {
    var mock = day.title === 'Mock Test' || day.title === 'Upper Body and Core';
    var opts = '<option value="">Ankle pain (0 to 10)</option>';
    for (var i = 0; i <= 10; i++) opts += '<option value="' + i + '">' + i + (i === 0 ? ' · none' : i === 10 ? ' · worst' : '') + '</option>';
    return '<section class="card checkin" id="ci" data-day="' + key(day.date) + '"><h3 style="font-size:18px">HOW DID IT GO?</h3><p class="small" style="margin:4px 0 10px">Optional. Saves your ankle score and notes, and marks the day complete.</p>' +
      '<select id="ci-ankle" aria-label="Ankle pain">' + opts + '</select>' +
      (mock ? '<div class="two"><input id="ci-pu" type="number" inputmode="numeric" min="0" placeholder="Push-ups"><input id="ci-pl" type="number" inputmode="numeric" min="0" placeholder="Plank (sec)"></div>' : '') +
      '<input id="ci-notes" type="text" maxlength="500" placeholder="Notes (optional)">' +
      '<button class="btn" id="ci-btn" type="button">SAVE AND MARK COMPLETE</button><p class="small" id="ci-msg" role="status"></p></section>';
  }
  function bindCheckin() {
    var c = document.getElementById('ci'); if (!c) return;
    var btn = document.getElementById('ci-btn'), msg = document.getElementById('ci-msg'), day = c.getAttribute('data-day');
    function show(r) {
      btn.textContent = 'DONE ✓ (TAP TO UPDATE)'; btn.classList.add('ok');
      msg.textContent = 'Logged for ' + day + '.';
      if (r.ankle_pain != null) document.getElementById('ci-ankle').value = r.ankle_pain;
      if (r.notes) document.getElementById('ci-notes').value = r.notes;
      var pu = document.getElementById('ci-pu'), pl = document.getElementById('ci-pl');
      if (pu && r.pushups != null) pu.value = r.pushups; if (pl && r.plank_seconds != null) pl.value = r.plank_seconds;
    }
    rpc('list_checkins', { p_code: code() }).then(function (rows) {
      (rows || []).forEach(function (r) { if (r.day === day && r.done) show(r); });
    }).catch(function () {});
    function num(id) { var e = document.getElementById(id); return e && e.value !== '' ? parseInt(e.value, 10) : null; }
    btn.onclick = function () {
      btn.disabled = true; msg.textContent = 'Saving…';
      var a = document.getElementById('ci-ankle').value;
      rpc('submit_checkin', { p_code: code(), p_day: day, p_done: true, p_ankle: a === '' ? null : parseInt(a, 10), p_pushups: num('ci-pu'), p_plank: num('ci-pl'), p_notes: document.getElementById('ci-notes').value || null })
        .then(function () { btn.disabled = false; var m = doneMap(); m[day] = true; saveDone(m); show({}); if (!document.querySelector('#chk.on')) route(); })
        .catch(function () { btn.disabled = false; msg.textContent = 'Could not save. Check your connection and try again.'; });
    };
  }

  function renderFamily() {
    var h = header('family') + '<main class="wrap"><h1 class="dtitle" style="margin:4px 0 6px">CHECK-INS</h1>';
    if (!code()) {
      h += '<div class="card"><p>Enter the family code to see check-ins.</p><input id="fc" type="password" placeholder="Family code"><button class="btn" id="fcb" type="button">VIEW</button></div></main>' + FOOT;
      app.innerHTML = h;
      document.getElementById('fcb').onclick = function () { var v = document.getElementById('fc').value.trim(); if (v) { store('cg.code', v); renderFamily(); } };
      return;
    }
    h += '<div id="fl" class="card"><p class="small">Loading…</p></div></main>' + FOOT;
    app.innerHTML = h;
    rpc('list_checkins', { p_code: code() }).then(function (rows) {
      var by = {}; (rows || []).forEach(function (r) { by[r.day] = r; });
      var t = today(), last = t > SHIPD ? SHIPD : t, out = '', done = 0, total = 0;
      for (var d = new Date(last); d >= FIRST; d = addDays(d, -1)) {
        var k = key(d), r = by[k], info = P.getDay(d), rest = info.rest;
        if (r && r.done) done++; if (!rest || (r && r.done)) total++;
        var bits = [];
        if (r && r.ankle_pain != null) bits.push('ankle ' + r.ankle_pain + '/10');
        if (r && r.pushups != null) bits.push(r.pushups + ' push-ups');
        if (r && r.plank_seconds != null) bits.push('plank ' + r.plank_seconds + 's');
        if (r && r.notes) bits.push('“' + r.notes + '”');
        var status = r && r.done ? '<b class="yes">✓</b>' : (rest ? '<span class="small">rest</span>' : (key(d) === key(t) ? '<span class="small">today</span>' : '<b class="no">—</b>'));
        out += '<div class="frow"><div class="fd"><b>' + P.label(d) + '</b><br><span class="small">' + esc(info.title || '') + '</span></div><div class="fs">' + status + '</div><div class="fb small">' + esc(bits.join(' · ')) + '</div></div>';
      }
      document.getElementById('fl').innerHTML = '<p style="margin:0 0 8px"><b>' + done + '</b> of ' + total + ' training days marked complete</p>' + out;
    }).catch(function () { document.getElementById('fl').innerHTML = '<p>Could not load. The code may be wrong.</p><button class="btn ghost" id="fcr" type="button">Re-enter code</button>'; document.getElementById('fcr').onclick = function () { store('cg.code', ''); renderFamily(); }; });
  }


  /* ---------- tests ---------- */
  var GOAL = { pushups: 15, plank: 69, run: 905, row: 640 };
  function mmss(sec) { if (sec == null) return '-'; return Math.floor(sec / 60) + ':' + ('0' + (sec % 60)).slice(-2); }
  function parseTime(v) {
    v = String(v || '').trim(); if (!v) return null;
    var m = /^(\d+):([0-5]?\d)$/.exec(v); if (m) return +m[1] * 60 + +m[2];
    return /^\d+$/.test(v) ? parseInt(v, 10) : NaN;
  }
  function localTests() { try { return JSON.parse(store('cg.tests') || '[]'); } catch (e) { return []; } }
  function saveLocal(rows) { store('cg.tests', JSON.stringify(rows)); }
  function loadTests() {
    if (!code()) return Promise.resolve(localTests());
    return rpc('list_tests', { p_code: code() }).then(function (rows) { rows = rows || []; saveLocal(rows); return rows; }).catch(function () { return localTests(); });
  }
  function meets(t) {
    var cg = t.cardio_kind === 'row' ? GOAL.row : GOAL.run;
    return { p: t.pushups != null && t.pushups >= GOAL.pushups, pl: t.plank_seconds != null && t.plank_seconds >= GOAL.plank, c: t.cardio_seconds != null && (t.cardio_kind === 'bike' ? false : t.cardio_seconds <= cg) };
  }
  function meter(label, now, goalTxt, pct, ok, nowTxt) {
    return '<div class="meter"><div class="mh"><b>' + label + '</b><span class="small">goal ' + goalTxt + '</span></div><div class="bar" role="img" aria-label="' + label + ' progress ' + Math.round(pct) + ' percent"><i style="width:' + Math.max(2, Math.min(100, pct)) + '%" class="' + (ok ? 'ok' : '') + '"></i></div><div class="mv">' + nowTxt + (ok ? ' <b class="yes">✓</b>' : '') + '</div></div>';
  }
  function renderTests() {
    var h = header('tests') + '<main class="wrap"><h1 class="dtitle" style="margin:4px 0 6px">TEST TRACKER</h1><p style="margin:0 0 14px;color:#2F4A63">Log a mock test any time. Friday is test day in the plan.</p><div id="tt"><div class="card"><p class="small">Loading…</p></div></div></main>' + FOOT;
    app.innerHTML = h; document.title = 'Tests · THE COASTIE GRIND'; window.scrollTo(0, 0);
    loadTests().then(drawTests);
  }
  function drawTests(rows) {
    rows = rows.slice().sort(function (a, b) { return a.tested_on < b.tested_on ? 1 : -1; });
    var bestP = null, bestPl = null, bestRun = null, bestRow = null;
    rows.forEach(function (t) {
      if (t.pushups != null) bestP = Math.max(bestP == null ? 0 : bestP, t.pushups);
      if (t.plank_seconds != null) bestPl = Math.max(bestPl == null ? 0 : bestPl, t.plank_seconds);
      if (t.cardio_seconds != null && t.cardio_kind === 'run') bestRun = bestRun == null ? t.cardio_seconds : Math.min(bestRun, t.cardio_seconds);
      if (t.cardio_seconds != null && t.cardio_kind === 'row') bestRow = bestRow == null ? t.cardio_seconds : Math.min(bestRow, t.cardio_seconds);
    });
    var h = '<div class="card"><h3 style="font-size:18px;margin-bottom:10px">BEST SO FAR vs PASS MARK</h3>' +
      meter('Push-ups in 60 sec', bestP, '15', bestP == null ? 0 : bestP / GOAL.pushups * 100, bestP != null && bestP >= GOAL.pushups, bestP == null ? 'No test yet' : bestP + ' reps') +
      meter('Forearm plank', bestPl, '1:09', bestPl == null ? 0 : bestPl / GOAL.plank * 100, bestPl != null && bestPl >= GOAL.plank, bestPl == null ? 'No test yet' : mmss(bestPl)) +
      meter('1.5-mile run', bestRun, '15:05', bestRun == null ? 0 : GOAL.run / bestRun * 100, bestRun != null && bestRun <= GOAL.run, bestRun == null ? 'No run test yet' : mmss(bestRun)) +
      meter('2,000 m row (alternate)', bestRow, '10:40', bestRow == null ? 0 : GOAL.row / bestRow * 100, bestRow != null && bestRow <= GOAL.row, bestRow == null ? 'No row test yet' : mmss(bestRow)) + '</div>';
    h += '<form class="card checkin" id="tf"><h3 style="font-size:18px;margin-bottom:10px">LOG A TEST</h3>' +
      '<label class="lb">Date<input id="t-d" type="date" min="2026-10-26" max="2027-01-12" value="' + key(clamp(today())) + '"></label>' +
      '<div class="two"><label class="lb">Push-ups<input id="t-p" type="number" inputmode="numeric" min="0" placeholder="in 60 sec"></label><label class="lb">Plank<input id="t-pl" type="text" inputmode="numeric" placeholder="1:05 or 65"></label></div>' +
      '<div class="two"><label class="lb">Cardio<select id="t-k"><option value="">None</option><option value="run">1.5-mile run</option><option value="row">2,000 m row</option><option value="bike">Bike (not scored)</option></select></label><label class="lb">Time<input id="t-c" type="text" inputmode="numeric" placeholder="15:30"></label></div>' +
      '<input id="t-n" type="text" maxlength="300" placeholder="Notes (optional)"><button class="btn" type="submit">SAVE TEST</button><p class="small" id="t-m" role="status"></p></form>';
    h += '<div class="card"><h3 style="font-size:18px;margin-bottom:6px">HISTORY</h3>' + (rows.length ? rows.map(function (t) {
      var m = meets(t), bits = [];
      if (t.pushups != null) bits.push('<span class="' + (m.p ? 'g' : '') + '">' + t.pushups + ' push-ups</span>');
      if (t.plank_seconds != null) bits.push('<span class="' + (m.pl ? 'g' : '') + '">plank ' + mmss(t.plank_seconds) + '</span>');
      if (t.cardio_seconds != null) bits.push('<span class="' + (m.c ? 'g' : '') + '">' + (t.cardio_kind === 'row' ? '2k row ' : t.cardio_kind === 'bike' ? 'bike ' : '1.5 mi ') + mmss(t.cardio_seconds) + '</span>');
      return '<div class="frow"><div class="fd"><b>' + P.label(parse(t.tested_on)) + '</b></div><div class="fs"><button class="x" data-del="' + t.tested_on + '" aria-label="Delete test ' + t.tested_on + '">×</button></div><div class="fb">' + bits.join(' · ') + (t.notes ? '<br><span class="small">' + esc(t.notes) + '</span>' : '') + '</div></div>';
    }).join('') : '<p class="small">No tests yet. Try a mini test this Friday.</p>') + '</div>';
    if (!code()) h += '<p class="small">Saved on this phone only. Open your family link to share results.</p>';
    document.getElementById('tt').innerHTML = h;
    var f = document.getElementById('tf'), msg = document.getElementById('t-m');
    f.onsubmit = function (e) {
      e.preventDefault();
      var pl = parseTime(document.getElementById('t-pl').value), cs = parseTime(document.getElementById('t-c').value), kind = document.getElementById('t-k').value;
      var pu = document.getElementById('t-p').value === '' ? null : parseInt(document.getElementById('t-p').value, 10);
      if (isNaN(pl) || isNaN(cs)) { msg.textContent = 'Use times like 1:05 or 65.'; return; }
      if (cs != null && !kind) { msg.textContent = 'Pick which cardio test that time is for.'; return; }
      if (pu == null && pl == null && cs == null) { msg.textContent = 'Enter at least one result.'; return; }
      var rec = { tested_on: document.getElementById('t-d').value, pushups: pu, plank_seconds: pl, cardio_kind: cs == null ? null : kind, cardio_seconds: cs, notes: document.getElementById('t-n').value || null };
      msg.textContent = 'Saving…';
      var local = localTests().filter(function (x) { return x.tested_on !== rec.tested_on; }); local.push(rec); saveLocal(local);
      var done = function () { loadTests().then(drawTests); };
      if (!code()) return done();
      rpc('submit_test', { p_code: code(), p_day: rec.tested_on, p_pushups: rec.pushups, p_plank: rec.plank_seconds, p_kind: rec.cardio_kind, p_cardio: rec.cardio_seconds, p_notes: rec.notes }).then(done).catch(function () { msg.textContent = 'Saved on this phone, but could not sync. Try again later.'; });
    };
    Array.prototype.forEach.call(document.querySelectorAll('[data-del]'), function (b) {
      b.onclick = function () {
        var d = b.getAttribute('data-del');
        if (!window.confirm('Delete the test from ' + d + '?')) return;
        saveLocal(localTests().filter(function (x) { return x.tested_on !== d; }));
        if (code()) rpc('delete_test', { p_code: code(), p_day: d }).then(function () { loadTests().then(drawTests); }).catch(function () { loadTests().then(drawTests); }); else drawTests(localTests());
      };
    });
  }

  /* ---------- fuel & recover ---------- */
  function renderFuel() {
    function card(t, items) { return '<section class="card"><h3 style="font-size:18px;margin-bottom:6px">' + t + '</h3><ul class="tips">' + items.map(function (i) { return '<li><b>' + i[0] + '</b> ' + i[1] + '</li>'; }).join('') + '</ul></section>'; }
    app.innerHTML = header('fuel') + '<main class="wrap"><h1 class="dtitle" style="margin:4px 0 14px">FUEL &amp; RECOVER</h1>' +
      card('FUEL', [['Protein at every meal.', 'Eggs, chicken, Greek yogurt, beans, tuna or a shake help your muscles rebuild.'], ['Carbs before hard days.', 'A banana, oatmeal or toast an hour before intervals or a test.'], ['Water all day.', 'Pale yellow is the goal. Sip during workouts.'], ['Eat within an hour after.', 'Protein plus carbs. Chocolate milk and a sandwich both work.'], ['Keep it simple.', 'Whole foods most of the time. No crash diets while training this hard.']]) +
      card('RECOVER', [['Sleep 8 to 9 hours.', 'This is when your body adapts. Boot camp sleep is short, so bank it now.'], ['Take Sundays.', 'Rest days are part of the plan.'], ['Ankle first.', 'Sharp or increasing pain means stop and check with your PT or doctor. Do the 5 minute ankle reset on rest days.'], ['Shoes matter.', 'Get properly fitted running shoes and break them in before Jan 12.']]) +
      card('PLANET FITNESS TIPS', [['Machines are first come.', 'Go off-peak if you can. Weekday evenings are busy.'], ['No barbells.', 'Dumbbells, Smith machine, cables and plate-loaded machines cover this plan.'], ['Ask for a walkthrough.', 'Staff will show you the machines for free.'], ['No pool.', 'Check with your recruiter how swimming will be tested, then find a community pool if needed.']]) + '</main>' + FOOT;
    document.title = 'Fuel and Recover · THE COASTIE GRIND'; window.scrollTo(0, 0);
  }

  function bind() {
    var ck = document.getElementById('chk');
    if (ck) ck.onclick = function () {
      var dk = (parse((location.hash || '').replace(/^#\/?/, '')) || today()); dk = key(clamp(dk));
      setDone(dk, !doneMap()[dk]); route();
    };
    syncDone();
    bindCheckin();
    var cp = document.getElementById('cp'), st = document.getElementById('st'), rc = document.getElementById('rc');
    if (cp) cp.onclick = function () {
      var done = function () { cp.textContent = 'COPIED'; setTimeout(function () { cp.textContent = 'COPY FOR STRAVA'; }, 2000); };
      st.focus(); st.select();
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(st.value).then(done, function () { try { document.execCommand('copy'); done(); } catch (e) {} });
      else { try { document.execCommand('copy'); done(); } catch (e) {} }
    };
    if (rc) rc.onchange = function () { store('cg.run', rc.checked ? '1' : '0'); route(); };
    Array.prototype.forEach.call(document.querySelectorAll('.play'), function (b) {
      b.onclick = function () {
        var f = document.createElement('iframe');
        f.src = 'https://www.youtube-nocookie.com/embed/' + b.getAttribute('data-vid') + '?autoplay=1&rel=0&playsinline=1';
        f.allow = 'autoplay; encrypted-media; picture-in-picture'; f.allowFullscreen = true; f.title = 'Exercise demo video';
        b.parentNode.replaceChild(f, b);
      };
    });
  }

  function route() {
    var h = (location.hash || '').replace(/^#\/?/, '');
    var j = /^join\/([A-Za-z0-9]+)$/.exec(h);
    if (j) { store('cg.code', j[1]); location.replace('#/'); return; }
    if (h === 'tests') return renderTests();
    if (h === 'fuel') return renderFuel();
    if (h === 'family') return renderFamily();
    if (h === 'plan') return renderPlan();
    var d = parse(h);
    renderDay(d || today());
  }
  window.addEventListener('hashchange', function () { route(); window.scrollTo(0, 0); });
  route();
})();

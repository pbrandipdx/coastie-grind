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
  var CHEV = '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
  var FLAGS = '<div class="flags" aria-hidden="true">' +
    '<svg width="34" height="26" viewBox="0 0 34 26"><rect width="34" height="26" fill="#fff"/><rect width="34" height="5.2" fill="#0B3D91"/><rect y="10.4" width="34" height="5.2" fill="#C8332A"/><rect y="20.8" width="34" height="5.2" fill="#0B3D91"/></svg>' +
    '<svg width="34" height="26" viewBox="0 0 34 26"><rect width="34" height="26" fill="#F5C400"/><g fill="#0B3D91"><rect x="5.7" width="5.7" height="26"/><rect x="17" width="5.7" height="26"/><rect x="28.3" width="5.7" height="26"/></g></svg></div>';

  function header(active, d) {
    var left = Math.max(0, Math.round((SHIPD - today()) / 86400000));
    return '<header class="head"><div class="head-top">' + FLAGS +
      '<nav class="nav" aria-label="Main"><a href="#/" ' + (active === 'day' ? 'aria-current="page"' : '') + '>TODAY</a><a href="#/plan" ' + (active === 'plan' ? 'aria-current="page"' : '') + '>THE PLAN</a>' + (code() ? '<a href="#/family" ' + (active === 'family' ? 'aria-current="page"' : '') + '>CHECK-INS</a>' : '') + '</nav></div>' +
      '<div class="brand">THE COASTIE GRIND</div><div class="count">' + (left > 0 ? left + ' DAYS TO SHIP DAY · TUE JAN 12' : 'SHIP DAY') + '</div></header>';
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
    var mon = addDays(d, -((d.getDay() + 6) % 7)), t = key(today()), h = '<nav class="strip" aria-label="Days this week">';
    for (var i = 0; i < 7; i++) {
      var x = addDays(mon, i), k = key(x), ok = x >= FIRST && x <= SHIPD;
      h += (ok ? '<a href="#/' + k + '"' : '<a aria-disabled="true" style="opacity:.35;pointer-events:none"') + ' class="' + (k === key(d) ? 'sel ' : '') + (k === t ? 'today' : '') + '"><span class="d">' + DOW[x.getDay()] + '</span><span class="n">' + x.getDate() + '</span></a>';
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
      h += '<div class="card daycard"><div class="kick">' + kick + '</div><h1 class="dtitle">' + esc(day.title) + '</h1><div class="chips"><span class="chip">' + day.minutes + ' MIN</span><span class="chip">PLANET FITNESS</span>' + (day.noImpact ? '<span class="chip red">NO IMPACT</span>' : '') + '</div></div>';
      h += '<div class="marks" aria-label="Test pass marks"><div class="mark"><b>15</b><span>PUSH-UPS / 60 SEC</span></div><div class="mark"><b>1:09</b><span>FOREARM PLANK</span></div><div class="mark"><b>15:05</b><span>1.5-MILE RUN</span></div></div>';
      h += day.blocks.map(blockHTML).join('');
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
    return '<section class="card checkin" id="ci" data-day="' + key(day.date) + '"><h3 style="font-size:18px">MARK COMPLETE</h3><p class="small" style="margin:4px 0 10px">Lets your coach see you finished.</p>' +
      '<select id="ci-ankle" aria-label="Ankle pain">' + opts + '</select>' +
      (mock ? '<div class="two"><input id="ci-pu" type="number" inputmode="numeric" min="0" placeholder="Push-ups"><input id="ci-pl" type="number" inputmode="numeric" min="0" placeholder="Plank (sec)"></div>' : '') +
      '<input id="ci-notes" type="text" maxlength="500" placeholder="Notes (optional)">' +
      '<button class="btn" id="ci-btn" type="button">I FINISHED TODAY</button><p class="small" id="ci-msg" role="status"></p></section>';
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
        .then(function () { btn.disabled = false; show({}); })
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

  function bind() {
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
    if (h === 'family') return renderFamily();
    if (h === 'plan') return renderPlan();
    var d = parse(h);
    renderDay(d || today());
  }
  window.addEventListener('hashchange', function () { route(); window.scrollTo(0, 0); });
  route();
})();

/* STUDY tab for THE COASTIE GRIND.
   Adaptive mock tests built from js/questions.js. Progress lives in this browser (localStorage).

   How the "always updating" part works:
   - Every answer updates a Leitner box (0 to 4) for that question. Wrong sends it back to box 0; right moves it up.
   - Each new test is assembled fresh: new and missed questions are favored, due questions come back on a schedule
     (same day, 1, 3, 7, 14 days), weak topics get extra weight, and anything just asked is held back.
   - Generated questions (pace, military time, math...) use new numbers each time, so they never run out. */
(function (root) {
  var D = root.CG_STUDY, H = null;
  var KEY = 'cg.study.v1', RUNKEY = 'cg.study.run', OPTKEY = 'cg.study.asvab';
  var DAY = 86400000, INTERVAL = [0, 1, 3, 7, 14];
  var LETTERS = ['A', 'B', 'C', 'D'];
  var S = { mode: 'home', run: null, loaded: false };
  var TOP = {}, SIDS = {}, db = null;

  D.topics.forEach(function (t) { TOP[t.id] = t; SIDS[t.id] = []; });
  D.items.forEach(function (it) { if (SIDS[it.topic].indexOf(it.sid) < 0) SIDS[it.topic].push(it.sid); });

  /* ---------- storage ---------- */
  function load() {
    var raw = H.store(KEY), o = null;
    try { o = raw ? JSON.parse(raw) : null; } catch (e) { o = null; }
    if (!o || !o.q) o = { q: {}, h: [], d: [], r: [] };
    o.h = o.h || []; o.d = o.d || []; o.r = o.r || [];
    return o;
  }
  function save() { H.store(KEY, JSON.stringify(db)); }
  function saveRun() { if (S.run) H.store(RUNKEY, JSON.stringify(S.run)); }
  function clearRun() { H.store(RUNKEY, ''); }
  function loadRun() {
    var raw = H.store(RUNKEY), r = null;
    try { r = raw ? JSON.parse(raw) : null; } catch (e) { r = null; }
    if (!r || !r.qs || !r.qs.length || typeof r.i !== 'number' || r.i >= r.qs.length) return null;
    for (var i = 0; i < r.qs.length; i++) if (!r.qs[i].opts || r.qs[i].opts.length < 2) return null;
    r.ans = r.ans || [];
    return r;
  }
  function useAsvab() { return H.store(OPTKEY) !== '0'; }
  function inScope(it) { return useAsvab() || TOP[it.topic].group === 'cg'; }
  function scopedTopics() { return D.topics.filter(function (t) { return useAsvab() || t.group === 'cg'; }); }

  /* ---------- stats ---------- */
  function topicStats(id) {
    var sids = SIDS[id], m = 0, seen = 0, n = 0, c = 0, i, r;
    for (i = 0; i < sids.length; i++) {
      r = db.q[sids[i]];
      if (r) { seen++; m += r.b / 4; n += r.n; c += r.c; }
    }
    return { mastery: sids.length ? m / sids.length : 0, seen: seen, total: sids.length, n: n, acc: (c + 1) / (n + 2) };
  }
  function overall() {
    var ts = scopedTopics(), m = 0, seen = 0, total = 0;
    ts.forEach(function (t) { var s = topicStats(t.id); m += s.mastery; seen += s.seen; total += s.total; });
    return { mastery: ts.length ? m / ts.length : 0, seen: seen, total: total };
  }
  function missedCount() {
    var n = 0;
    Object.keys(db.q).forEach(function (sid) { if (db.q[sid].l === 0) n++; });
    return n;
  }
  function lastMocks() { return db.h.filter(function (h) { return h.m === 'mock'; }).slice(-3); }
  function streak() {
    var set = {}, d = H.today(), n = 0;
    db.d.forEach(function (k) { set[k] = 1; });
    if (!set[H.key(d)]) d = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1);
    while (set[H.key(d)]) { n++; d = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1); }
    return n;
  }
  function weakest() {
    var best = null, bs = 2;
    scopedTopics().forEach(function (t) { var s = topicStats(t.id), v = s.mastery; if (v < bs) { bs = v; best = t; } });
    return best;
  }
  function badge(m, mocks) {
    var good = mocks.length ? mocks.reduce(function (a, x) { return a + x.c / x.n; }, 0) / mocks.length >= 0.8 : false;
    var ready = mocks.length === 3 && mocks.every(function (x) { return x.c / x.n >= 0.8; }) && m >= 0.5;
    if (ready) return 'TEST-READY';
    if (good) return 'ON TRACK';
    if (m >= 0.75) return 'STRONG';
    if (m >= 0.5) return 'GETTING SOLID';
    if (m >= 0.2) return 'BUILDING';
    return 'JUST STARTING';
  }

  /* ---------- picking questions ---------- */
  function weight(it, now, recent, acc) {
    var r = db.q[it.sid], w;
    if (!r) w = 2.2;
    else {
      var due = (now - r.t) >= INTERVAL[r.b] * DAY;
      w = (5 - r.b) * (due ? 1.6 : 0.5);
      if (r.l === 0) w += 2;
    }
    w *= 1 + (1 - acc[it.topic]) * 1.5;
    if (recent[it.sid]) w *= 0.25;
    return w;
  }
  function choose(n, filter) {
    var now = Date.now(), recent = {}, acc = {}, cands = D.items.filter(filter), out = [], tcount = {}, scount = {}, ws, tot, r, i, it;
    db.r.forEach(function (s) { recent[s] = 1; });
    D.topics.forEach(function (t) { acc[t.id] = topicStats(t.id).acc; });
    while (out.length < n && cands.length) {
      ws = cands.map(function (c) { return weight(c, now, recent, acc) * Math.pow(0.55, tcount[c.topic] || 0) * Math.pow(0.5, scount[c.sid] || 0); });
      tot = ws.reduce(function (a, b) { return a + b; }, 0);
      r = Math.random() * tot; i = 0;
      while (i < ws.length - 1 && (r -= ws[i]) > 0) i++;
      it = cands.splice(i, 1)[0];
      out.push(it); tcount[it.topic] = (tcount[it.topic] || 0) + 1; scount[it.sid] = (scount[it.sid] || 0) + 1;
    }
    return out;
  }
  function build(it) {
    var o = it.kind === 'g' ? it.make() : { q: it.q, a: it.a, w: it.w, e: it.e, ctx: it.ctx };
    var seen = {}, wrong = o.w.filter(function (x) { if (x === o.a || seen[x]) return false; seen[x] = 1; return true; });
    var opts = D.shuffle([o.a].concat(wrong.slice(0, 3)));
    if (opts.length === 2 && opts.indexOf('True') >= 0) opts = ['True', 'False'];
    return { sid: it.sid, topic: it.topic, q: o.q, ctx: o.ctx || '', opts: opts, ans: opts.indexOf(o.a), e: o.e || '' };
  }

  function startRun(mode, topic) {
    var items, title, qs = [], texts = {}, k, q, tries;
    if (mode === 'mock') { title = 'Mock Test'; items = choose(20, inScope); }
    else if (mode === 'quick') { title = 'Quick 5'; items = choose(5, inScope); }
    else if (mode === 'missed') { title = 'Missed Questions'; items = choose(10, function (it) { var r = db.q[it.sid]; return r && r.l === 0; }); }
    else { title = TOP[topic].name; items = choose(10, function (it) { return it.topic === topic; }); }
    if (!items.length) return;
    D.shuffle(items).forEach(function (it) {
      tries = 0;
      do { q = build(it); tries++; } while (texts[q.q] && tries < 6);
      texts[q.q] = 1; qs.push(q);
    });
    S.run = { mode: mode, title: title, qs: qs, i: 0, ans: [], t: Date.now() };
    S.mode = 'quiz'; saveRun(); render();
  }

  function answer(idx) {
    var run = S.run, q = run.qs[run.i], ok, r, k;
    if (!run || run.ans[run.i] != null || idx >= q.opts.length) return;
    run.ans[run.i] = idx; ok = idx === q.ans;
    r = db.q[q.sid] || (db.q[q.sid] = { b: 0, n: 0, c: 0, t: 0, l: 1 });
    r.n++;
    if (ok) { r.c++; r.b = Math.min(4, r.b + 1); } else r.b = 0;
    r.t = Date.now(); r.l = ok ? 1 : 0;
    k = H.key(H.today());
    if (db.d[db.d.length - 1] !== k) { db.d.push(k); if (db.d.length > 200) db.d.shift(); }
    save(); saveRun(); render(true);
  }
  function next() {
    var run = S.run;
    if (run.i < run.qs.length - 1) { run.i++; saveRun(); render(); window.scrollTo(0, 0); }
    else finish();
  }
  function finish() {
    var run = S.run, tp = {}, c = 0;
    run.qs.forEach(function (q, i) {
      var ok = run.ans[i] === q.ans;
      tp[q.topic] = tp[q.topic] || [0, 0]; tp[q.topic][1]++; if (ok) { tp[q.topic][0]++; c++; }
    });
    run.score = c; run.done = true;
    db.h.push({ t: Date.now(), m: run.mode, n: run.qs.length, c: c, tp: tp });
    if (db.h.length > 80) db.h.shift();
    db.r = run.qs.map(function (q) { return q.sid; }).concat(db.r).slice(0, 60);
    save(); clearRun(); S.mode = 'results'; render(); window.scrollTo(0, 0);
  }

  /* ---------- screens ---------- */
  var esc = function (s) { return H.esc(s); };
  function pct(x) { return Math.round(x * 100); }

  function homeHTML() {
    var o = overall(), mocks = lastMocks(), st = streak(), weak = weakest(), missed = missedCount(), h = '';
    var tot = D.items.filter(function (i) { return i.kind === 's'; }).length;
    h += '<main class="wrap st"><h1 class="dtitle" style="margin:4px 0 6px">STUDY</h1>';
    h += '<p class="st-lead">Mock tests for everything on the Coast Guard exams. Each test is built fresh from what you missed, so the more you take, the sharper it aims.</p>';
    if (S.run && !S.run.done && S.run.i < S.run.qs.length) {
      h += '<section class="card st-resume"><div class="kick">UNFINISHED TEST</div><p style="margin:4px 0 0"><b>' + esc(S.run.title) + '</b> · question ' + (S.run.i + 1) + ' of ' + S.run.qs.length + '</p><button class="btn" type="button" data-act="resume">CONTINUE</button></section>';
    }
    h += '<section class="st-ready" aria-label="Your readiness"><div class="kick" style="color:#fff;opacity:.9">MASTERY</div>' +
      '<div class="st-big">' + pct(o.mastery) + '% <span class="st-badge">' + badge(o.mastery, mocks) + '</span></div>' +
      '<div class="st-meter" role="img" aria-label="' + pct(o.mastery) + ' percent mastery"><i style="width:' + pct(o.mastery) + '%"></i></div>' +
      '<p class="st-line">Seen ' + o.seen + ' of ' + o.total + ' questions, plus endless generated ones.</p>' +
      '<p class="st-line">Last mock tests: ' + (mocks.length ? mocks.map(function (m) { return pct(m.c / m.n) + '%'; }).join(' · ') : 'none yet') + '</p>' +
      '<p class="st-line">Study streak: ' + st + (st === 1 ? ' day' : ' days') + '</p></section>';
    h += '<div class="st-goal small">Your goal: 80% or better on three mock tests in a row. Mastery climbs as you get questions right again and again over several days.</div>';
    if (o.seen > 0 && weak) h += '<p class="st-focus"><b>Next test leans on:</b> ' + esc(weak.name) + '</p>';
    h += '<button class="btn" type="button" data-act="start" data-mode="mock">START MOCK TEST · 20 QUESTIONS</button>';
    h += '<div class="st-actions"><button class="btn line" type="button" data-act="start" data-mode="quick">QUICK 5</button>' +
      '<button class="btn line" type="button" data-act="start" data-mode="missed"' + (missed ? '' : ' disabled') + '>REVIEW MISSED' + (missed ? ' (' + missed + ')' : '') + '</button></div>';
    h += '<section class="card" style="margin-top:14px"><label class="toggle"><input type="checkbox" id="st-asvab" data-act="asvab" ' + (useAsvab() ? 'checked' : '') + '><span><b>Include ASVAB review</b><br><span class="small">Math, vocabulary and reading, science and mechanical. Turn off if you only want Coast Guard training material.</span></span></label></section>';
    h += '<section class="card"><h3 style="font-size:19px">TOPICS</h3><p class="small" style="margin:2px 0 6px">Tap a topic for a 10-question drill.</p><div class="st-topics">';
    D.topics.forEach(function (t) {
      var s = topicStats(t.id), p = pct(s.mastery);
      h += '<button class="st-topic" type="button" data-act="start" data-mode="topic" data-topic="' + t.id + '"><span class="nm">' + esc(t.name) + '</span><span class="pc">' + p + '%</span><span class="st-mini" aria-hidden="true"><i style="width:' + p + '%"></i></span><span class="sm small">' + s.seen + ' of ' + s.total + ' seen' + (t.group === 'asvab' ? ' · ASVAB' : '') + '</span></button>';
    });
    h += '</div></section>';
    h += '<p class="small" style="margin:0 0 6px">' + tot + ' written questions and 17 generated question types. Based on The Helmsman (the official recruit guide) plus general first-aid, UCMJ and ASVAB review. Unofficial; confirm anything important with your recruiter. Your progress is saved on this device.</p></main>';
    return h;
  }

  function quizHTML() {
    var run = S.run, q = run.qs[run.i], a = run.ans[run.i], done = a != null, h = '', i, cls, mark, last = run.i === run.qs.length - 1;
    h += '<main class="wrap st"><div class="st-top"><button class="st-quit" type="button" data-act="quit">‹ Exit</button><span class="st-count">' + esc(run.title.toUpperCase()) + ' · ' + (run.i + 1) + ' OF ' + run.qs.length + '</span></div>';
    h += '<div class="st-bar" role="progressbar" aria-label="Test progress" aria-valuemin="0" aria-valuemax="' + run.qs.length + '" aria-valuenow="' + (run.i + (done ? 1 : 0)) + '"><i style="width:' + Math.round(100 * (run.i + (done ? 1 : 0)) / run.qs.length) + '%"></i></div>';
    h += '<section class="card st-card"><div class="kick">' + esc(TOP[q.topic].name.toUpperCase()) + '</div>';
    if (q.ctx) h += '<p class="st-ctx">' + esc(q.ctx) + '</p>';
    h += '<h2 class="st-q" id="stq" tabindex="-1">' + esc(q.q) + '</h2><div class="st-opts" role="group" aria-labelledby="stq">';
    for (i = 0; i < q.opts.length; i++) {
      cls = 'st-opt'; mark = LETTERS[i]; var sr = '';
      if (done) {
        cls += ' locked';
        if (i === q.ans) { cls += ' right'; mark = '✓'; sr = '<span class="sr"> Correct answer.</span>'; }
        else if (i === a) { cls += ' wrong'; mark = '✕'; sr = '<span class="sr"> Your answer, incorrect.</span>'; }
        else cls += ' dim';
      }
      h += '<button type="button" class="' + cls + '" data-act="pick" data-i="' + i + '"' + (done ? ' aria-disabled="true"' : '') + '><b aria-hidden="true">' + mark + '</b><span>' + esc(q.opts[i]) + sr + '</span></button>';
    }
    h += '</div>';
    if (done) {
      var ok = a === q.ans;
      h += '<div class="st-fb ' + (ok ? 'ok' : 'no') + '" role="status"><b>' + (ok ? '✓ Correct.' : '✕ Not quite.') + '</b> ' + (ok ? '' : 'The answer is <b>' + esc(q.opts[q.ans]) + '</b>. ') + esc(q.e) + '</div>';
    }
    h += '</section>';
    if (done) h += '<button class="btn" type="button" id="st-next" data-act="next">' + (last ? 'SEE RESULTS' : 'NEXT QUESTION') + '</button>';
    else h += '<p class="small" style="text-align:center">Tip: press 1 to 4 on a keyboard to answer.</p>';
    return h + '</main>';
  }

  function resultsHTML() {
    var run = S.run, c = run.score, n = run.qs.length, p = c / n, h = '', tp = {}, label, msg;
    run.qs.forEach(function (q, i) { tp[q.topic] = tp[q.topic] || [0, 0]; tp[q.topic][1]++; if (run.ans[i] === q.ans) tp[q.topic][0]++; });
    if (p >= 0.8) { label = 'ON TARGET'; msg = 'Strong work. Keep it above 80% three times in a row.'; }
    else if (p >= 0.6) { label = 'GETTING THERE'; msg = 'Close. Re-drill what you missed and take another.'; }
    else { label = 'KEEP DRILLING'; msg = 'That is what practice is for. The missed ones come back until they stick.'; }
    h += '<main class="wrap st"><h1 class="dtitle" style="margin:4px 0 10px">' + esc(run.title) + ' RESULTS</h1>';
    h += '<section class="st-ready"><div class="st-big">' + c + ' / ' + n + ' <span class="st-badge">' + pct(p) + '% · ' + label + '</span></div><div class="st-meter" role="img" aria-label="' + pct(p) + ' percent correct"><i style="width:' + pct(p) + '%"></i></div><p class="st-line">' + msg + '</p></section>';
    h += '<button class="btn" type="button" data-act="start" data-mode="' + (run.mode === 'topic' ? 'mock' : run.mode === 'missed' ? 'mock' : run.mode) + '">' + (run.mode === 'quick' ? 'NEW QUICK 5' : 'NEW MOCK TEST') + '</button>';
    var missed = missedCount();
    h += '<div class="st-actions"><button class="btn line" type="button" data-act="start" data-mode="missed"' + (missed ? '' : ' disabled') + '>RE-DRILL MISSED' + (missed ? ' (' + missed + ')' : '') + '</button><button class="btn line" type="button" data-act="home">BACK TO STUDY</button></div>';
    h += '<section class="card" style="margin-top:14px"><h3 style="font-size:19px">BY TOPIC</h3>';
    Object.keys(tp).forEach(function (id) {
      var t = tp[id], pp = Math.round(100 * t[0] / t[1]);
      h += '<div class="st-row"><span class="nm">' + esc(TOP[id].name) + '</span><span class="pc">' + t[0] + ' of ' + t[1] + '</span><span class="st-mini" aria-hidden="true"><i style="width:' + pp + '%"></i></span></div>';
    });
    h += '</section>';
    var wrong = run.qs.map(function (q, i) { return { q: q, i: i }; }).filter(function (x) { return run.ans[x.i] !== x.q.ans; });
    if (wrong.length) {
      h += '<section class="card"><h3 style="font-size:19px">WHAT YOU MISSED (' + wrong.length + ')</h3><ul class="items" style="margin-top:6px">';
      wrong.forEach(function (x) {
        h += '<li><details><summary><span class="nm">' + esc(x.q.q) + '</span>' + H.chev + '</summary><div class="how">' + (x.q.ctx ? '<p class="st-ctx">' + esc(x.q.ctx) + '</p>' : '') +
          '<p style="margin:0 0 6px"><b>Your answer:</b> ' + esc(x.q.opts[run.ans[x.i]]) + '</p><p style="margin:0 0 6px"><b>Correct:</b> ' + esc(x.q.opts[x.q.ans]) + '</p>' + (x.q.e ? '<div class="cue">' + esc(x.q.e) + '</div>' : '') + '</div></details></li>';
      });
      h += '</ul></section>';
    }
    return h + '</main>';
  }

  /* ---------- wiring ---------- */
  function onClick(e) {
    var t = e.target.closest ? e.target.closest('[data-act]') : null;
    if (!t || t.disabled) return;
    var act = t.getAttribute('data-act');
    if (act === 'start') startRun(t.getAttribute('data-mode'), t.getAttribute('data-topic'));
    else if (act === 'pick') answer(parseInt(t.getAttribute('data-i'), 10));
    else if (act === 'next') next();
    else if (act === 'quit' || act === 'home') { S.mode = 'home'; render(); window.scrollTo(0, 0); }
    else if (act === 'resume') { S.mode = 'quiz'; render(); window.scrollTo(0, 0); }
  }
  function onChange(e) {
    var t = e.target;
    if (t && t.getAttribute && t.getAttribute('data-act') === 'asvab') { H.store(OPTKEY, t.checked ? '1' : '0'); render(); }
  }
  document.addEventListener('keydown', function (e) {
    if (S.mode !== 'quiz' || !S.run || (location.hash || '').replace(/^#\/?/, '') !== 'study') return;
    var tg = (e.target && e.target.tagName) || '';
    if (/INPUT|TEXTAREA|SELECT/.test(tg) || e.ctrlKey || e.metaKey || e.altKey) return;
    var n = parseInt(e.key, 10);
    if (n >= 1 && n <= 4 && S.run.ans[S.run.i] == null) answer(n - 1);
  });

  function render(afterAnswer) {
    var html = H.header;
    if (S.mode === 'quiz' && S.run) html += quizHTML();
    else if (S.mode === 'results' && S.run) html += resultsHTML();
    else { S.mode = 'home'; html += homeHTML(); }
    html += H.foot;
    H.app.innerHTML = html;
    H.app.onclick = onClick; H.app.onchange = onChange;
    document.title = 'Study · THE COASTIE GRIND';
    var el = null;
    if (S.mode === 'quiz') el = afterAnswer ? document.getElementById('st-next') : document.getElementById('stq');
    if (el && el.focus) el.focus();
  }

  root.CGStudy = {
    render: function (ctx) {
      H = ctx;
      if (!db) db = load();
      if (!S.loaded) { S.loaded = true; if (!S.run) S.run = loadRun(); }
      if (S.mode === 'quiz' && !S.run) S.mode = 'home';
      render();
    }
  };
})(typeof window !== 'undefined' ? window : this);

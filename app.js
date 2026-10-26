(function () {
  const P = window.CGPlan;
  const $ = s => document.querySelector(s);
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const LS = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  // ---- state ----
  let done = LS.get("cg_done", {});          // { "2026-10-26": true }
  let tests = LS.get("cg_tests", []);        // [{id, tested_on, pushups, situps, plank_seconds, run_seconds, swim_note}]
  let goals = LS.get("cg_goals", { pushups: 15, situps: 32, plank_seconds: 69, run_seconds: 905 });
  let pain = LS.get("cg_pain", {});          // { "2026-10-26": 2 }
  let selected = P.fmt(new Date());
  if (selected < P.fmt(P.START)) selected = P.fmt(P.START);
  let sb = null, user = null;

  const cfg = window.CG_CONFIG || {};
  if (cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY && window.supabase) {
    sb = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
  } else {
    $("#authBtn").style.display = "none";
  }

  const mmss = s => s == null ? "-" : Math.floor(s / 60) + ":" + String(Math.round(s % 60)).padStart(2, "0");
  const parseMMSS = v => { if (!v) return null; const m = String(v).trim().split(":"); return m.length === 2 ? (+m[0]) * 60 + (+m[1]) : (+v || null); };
  const uid = () => (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random());

  // ---- streaks / stats ----
  function stats() {
    const today = P.fmt(new Date());
    let streak = 0, d = new Date();
    if (!done[P.fmt(d)]) d = new Date(d.getTime() - 86400000);
    while (done[P.fmt(d)]) { streak++; d = new Date(d.getTime() - 86400000); }
    const total = Object.keys(done).filter(k => done[k]).length;
    const elapsed = Math.max(1, Math.min(77, P.diffDays(new Date(), P.START) + 1));
    return { streak, total, pct: Math.round(total / 77 * 100), elapsed, today };
  }

  function updateCountdown() {
    const n = P.diffDays(P.SHIP, new Date());
    $("#countNum").textContent = n > 0 ? n : (n === 0 ? "TODAY" : "0");
  }

  // ---- views ----
  function renderToday() {
    const date = P.parse(selected), plan = P.planFor(date), s = stats();
    const isDone = !!done[selected];
    const nice = date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
    $("#today").innerHTML =
      '<div class="stats"><div class="stat"><b>' + s.streak + '</b>day streak</div><div class="stat"><b>' + s.total + '</b>workouts done</div><div class="stat"><b>' + s.pct + '%</b>of plan</div></div>' +
      '<div class="bar"><i style="width:' + s.pct + '%"></i></div>' +
      '<div class="card"><span class="tag o">' + esc(plan.phase) + '</span>' + (plan.week >= 1 && plan.week <= 11 ? '<span class="tag">Week ' + plan.week + '</span>' : '') +
      '<h2 style="margin-top:10px">' + esc(plan.title) + '</h2><div class="muted">' + esc(nice) + '</div>' +
      '<ul class="steps">' + plan.items.map(i => '<li>' + esc(i) + '</li>').join("") + '</ul>' +
      (plan.test ? '<button class="primary bigdone" id="goTest">Log test results</button>' : '') +
      '<label style="margin-top:10px">Ankle pain today (0 = none, 10 = worst)<select id="painSel"><option value="">-</option>' +
      [0,1,2,3,4,5,6,7,8,9,10].map(n => '<option value="' + n + '"' + (pain[selected] === n ? " selected" : "") + '>' + n + '</option>').join("") + '</select></label>' +
      '<div class="muted" id="painHint">' + (pain[selected] >= 4 ? "Pain is 4 or higher. Take it easy, stick to bike/row and upper body, and get it looked at if it keeps up." : "Under 3 is fine to train. Stop any exercise that makes it sharper.") + '</div>' +
      '<button class="bigdone ' + (isDone ? "is" : "") + '" id="doneBtn">' + (isDone ? "Done. Nice work." : "Mark workout done") + '</button></div>' +
      '<div class="row"><button id="prevDay">&larr; Prev</button><button id="todayBtn">Today</button><button id="nextDay">Next &rarr;</button></div>';
    $("#doneBtn").onclick = () => toggleDone(selected);
    $("#painSel").onchange = e => { const v = e.target.value; if (v === "") delete pain[selected]; else pain[selected] = +v; LS.set("cg_pain", pain); syncDay(selected); renderToday(); };
    const gt = $("#goTest"); if (gt) gt.onclick = () => showTab("tests");
    const shift = n => { selected = P.fmt(new Date(P.parse(selected).getTime() + n * 86400000)); renderToday(); };
    $("#prevDay").onclick = () => shift(-1); $("#nextDay").onclick = () => shift(1);
    $("#todayBtn").onclick = () => { selected = P.fmt(new Date()); if (selected < P.fmt(P.START)) selected = P.fmt(P.START); renderToday(); };
  }

  function renderPlan() {
    const todayStr = P.fmt(new Date());
    let html = '<p class="muted">11 weeks: low-impact base (1-4), return to running (5-8), peak (9-10), taper (11). Tap a day to open it.</p>';
    for (let w = 1; w <= P.TOTAL_WEEKS; w++) {
      const rows = [];
      for (let d = 0; d < 7; d++) {
        const dt = new Date(P.START.getFullYear(), P.START.getMonth(), P.START.getDate() + (w - 1) * 7 + d);
        const key = P.fmt(dt), p = P.planFor(dt);
        rows.push('<div class="dayrow ' + (key === todayStr ? "today" : "") + '" data-date="' + key + '"><span class="d">' +
          dt.toLocaleDateString(undefined, { weekday: "short", month: "numeric", day: "numeric" }) + '</span><span class="t">' + esc(p.title) + '</span><span class="ck">' + (done[key] ? "&#10003;" : "") + '</span></div>');
      }
      const open = P.planFor(new Date()).week === w || (w === 1 && P.diffDays(new Date(), P.START) < 0);
      html += '<details class="week" ' + (open ? "open" : "") + '><summary>Week ' + w + ' - ' + esc(P.planFor(new Date(P.START.getFullYear(), P.START.getMonth(), P.START.getDate() + (w - 1) * 7)).phase) + '</summary>' + rows.join("") + '</details>';
    }
    $("#plan").innerHTML = html;
    document.querySelectorAll(".dayrow").forEach(r => r.onclick = () => { selected = r.dataset.date; showTab("today"); });
  }

  function best(key, lower) {
    const v = tests.map(t => t[key]).filter(x => x != null);
    if (!v.length) return null;
    return lower ? Math.min.apply(null, v) : Math.max.apply(null, v);
  }
  function spark(key, goal, lower) {
    const pts = tests.filter(t => t[key] != null).sort((a, b) => a.tested_on.localeCompare(b.tested_on));
    if (pts.length < 1) return '<div class="muted">No data yet.</div>';
    const vals = pts.map(p => p[key]).concat([goal]);
    const lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals), W = 300, H = 100, pad = 10;
    const x = i => pts.length === 1 ? W / 2 : pad + i * (W - 2 * pad) / (pts.length - 1);
    const y = v => hi === lo ? H / 2 : H - pad - (v - lo) / (hi - lo) * (H - 2 * pad);
    const line = pts.map((p, i) => (i ? "L" : "M") + x(i).toFixed(1) + " " + y(p[key]).toFixed(1)).join(" ");
    const dots = pts.map((p, i) => '<circle cx="' + x(i).toFixed(1) + '" cy="' + y(p[key]).toFixed(1) + '" r="4" fill="#ff6b1a"/>').join("");
    return '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(key) + ' progress"><line x1="0" x2="' + W + '" y1="' + y(goal) + '" y2="' + y(goal) +
      '" stroke="#1b9a59" stroke-dasharray="4 4"/><path d="' + line + '" fill="none" stroke="#ff6b1a" stroke-width="2.5"/>' + dots + '</svg>';
  }
  function renderTests() {
    const last = tests.slice().sort((a, b) => b.tested_on.localeCompare(a.tested_on));
    const metric = (label, key, goal, lower, f) => {
      const b = best(key, lower), met = b != null && (lower ? b <= goal : b >= goal);
      return '<div class="card"><h3>' + label + '</h3><div class="muted">Goal: ' + f(goal) + ' &middot; Best: <span class="' + (met ? "good" : "") + '">' + (b == null ? "-" : f(b)) + '</span></div>' + spark(key, goal, lower) + '</div>';
    };
    $("#tests").innerHTML =
      '<div class="card"><h2>Log a test</h2><form class="grid" id="testForm">' +
      '<label>Date<input type="date" id="tDate" value="' + P.fmt(new Date()) + '" required></label>' +
      '<label>Push-ups (60s)<input type="number" min="0" id="tPush"></label>' +
      '<label>Sit-ups (60s)<input type="number" min="0" id="tSit"></label>' +
      '<label>Plank (seconds)<input type="number" min="0" id="tPlank"></label>' +
      '<label>1.5 mi run (m:ss)<input type="text" id="tRun" placeholder="15:00" pattern="\\d{1,2}:\\d{2}"></label>' +
      '<label>Swim / notes<input type="text" id="tSwim" maxlength="200" placeholder="tread 5 min OK"></label>' +
      '<button class="primary" type="submit" style="align-self:end">Save</button></form></div>' +
      metric("Push-ups (60 s)", "pushups", goals.pushups, false, v => v) +
      metric("Sit-ups (60 s)", "situps", goals.situps, false, v => v) +
      metric("Plank hold", "plank_seconds", goals.plank_seconds, false, mmss) +
      metric("1.5 mile run", "run_seconds", goals.run_seconds, true, mmss) +
      '<div class="card"><h3>History</h3>' + (last.length ? '<table><tr><th>Date</th><th>Push</th><th>Sit</th><th>Plank</th><th>Run</th><th></th></tr>' +
        last.map(t => '<tr><td>' + esc(t.tested_on) + '</td><td>' + (t.pushups ?? "-") + '</td><td>' + (t.situps ?? "-") + '</td><td>' + mmss(t.plank_seconds) + '</td><td>' + mmss(t.run_seconds) +
          '</td><td><button data-del="' + esc(t.id) + '" aria-label="Delete">&times;</button></td></tr>').join("") + '</table>' : '<div class="muted">Nothing logged yet. Your first baseline is scheduled for Sat Oct 31.</div>') + '</div>' +
      '<div class="card"><h3>Goals</h3><p class="muted">Standards differ by source, age and sex, and change over time. Confirm the current numbers with your recruiter and edit them here.</p>' +
      '<form class="grid" id="goalForm"><label>Push-ups<input type="number" id="gPush" value="' + goals.pushups + '"></label><label>Sit-ups<input type="number" id="gSit" value="' + goals.situps + '"></label>' +
      '<label>Plank (sec)<input type="number" id="gPlank" value="' + goals.plank_seconds + '"></label><label>Run (m:ss)<input type="text" id="gRun" value="' + mmss(goals.run_seconds) + '"></label>' +
      '<button type="submit" style="align-self:end">Update goals</button></form></div>';
    $("#testForm").onsubmit = e => {
      e.preventDefault();
      const n = id => { const v = $(id).value; return v === "" ? null : Math.max(0, parseInt(v, 10)); };
      const rec = { id: uid(), tested_on: $("#tDate").value, pushups: n("#tPush"), situps: n("#tSit"), plank_seconds: n("#tPlank"), run_seconds: parseMMSS($("#tRun").value), swim_note: $("#tSwim").value.trim() || null };
      tests.push(rec); LS.set("cg_tests", tests); pushTest(rec); renderTests();
    };
    $("#goalForm").onsubmit = e => {
      e.preventDefault();
      goals = { pushups: +$("#gPush").value || 0, situps: +$("#gSit").value || 0, plank_seconds: +$("#gPlank").value || 0, run_seconds: parseMMSS($("#gRun").value) || 905 };
      LS.set("cg_goals", goals); renderTests();
    };
    document.querySelectorAll("[data-del]").forEach(b => b.onclick = () => {
      if (!confirm("Delete this test entry?")) return;
      const id = b.dataset.del; tests = tests.filter(t => t.id !== id); LS.set("cg_tests", tests);
      if (sb && user) sb.from("cg_test_results").delete().eq("id", id).then(() => {});
      renderTests();
    });
  }

  function renderFuel() {
    $("#fuel").innerHTML =
      '<div class="card"><h2>Fuel</h2><ul class="steps">' +
      '<li><b>Protein at every meal.</b> Eggs, chicken, Greek yogurt, beans, tuna, or a protein shake help your muscles rebuild.</li>' +
      '<li><b>Carbs before runs.</b> A banana, oatmeal, or toast an hour before a hard session. Add more on long-run days.</li>' +
      '<li><b>Water all day.</b> Pale-yellow pee is the goal. Drink before you feel thirsty and sip during workouts.</li>' +
      '<li><b>Eat after training.</b> Within an hour, get protein plus carbs (chocolate milk and a sandwich both work).</li>' +
      '<li><b>Keep it simple.</b> Whole foods most of the time. Do not crash-diet or skip meals while you are training this hard.</li></ul></div>' +
      '<div class="card"><h2>Recover</h2><ul class="steps">' +
      '<li><b>Sleep 8-9 hours.</b> This is when your body adapts. Boot camp sleep is short, so bank it now.</li>' +
      '<li><b>Take the rest days.</b> Sundays are not optional. Progress happens when you recover.</li>' +
      '<li><b>Stretch for 5-10 minutes</b> after runs: calves, hamstrings, hips, chest.</li>' +
      '<li><b>Shin or knee pain?</b> Cut the run short, swap in the stair climber or elliptical, and tell a coach or doctor if it lasts more than a few days. Sharp pain means stop.</li>' +
      '<li><b>Shoes matter.</b> Get properly fitted running shoes now and break them in before Jan 12.</li></ul></div>' +
      '<div class="card"><h2>Gym tips (Planet Fitness)</h2><ul class="steps">' +
      '<li>Treadmills are first-come, so go at off-peak times if you can. Tuesday-Thursday evenings are usually busy.</li>' +
      '<li>No barbells or deadlifts there. Dumbbells, the Smith machine, cable stations, and the plate-loaded leg press cover what you need.</li>' +
      '<li>Ask staff for a quick machine walkthrough if you are new. It is free.</li>' +
      '<li>No pool. Find a YMCA or community pool for the swim practice noted on Sundays.</li></ul></div>';
  }

  // ---- actions ----
  function syncDay(date) {
    if (!sb || !user) return;
    sb.from("cg_workout_logs").upsert({ user_id: user.id, day: date, done: !!done[date], ankle_pain: pain[date] == null ? null : pain[date], updated_at: new Date().toISOString() }).then(r => { if (r.error) console.warn(r.error.message); });
  }
  function toggleDone(date) {
    if (done[date]) delete done[date]; else done[date] = true;
    LS.set("cg_done", done); syncDay(date);
    renderToday(); renderPlan();
  }
  function pushTest(rec) {
    if (!sb || !user) return;
    sb.from("cg_test_results").upsert(Object.assign({ user_id: user.id }, rec)).then(r => { if (r.error) console.warn(r.error.message); });
  }

  // ---- sync ----
  async function pull() {
    if (!sb || !user) return;
    const [l, t] = await Promise.all([sb.from("cg_workout_logs").select("day,done,ankle_pain"), sb.from("cg_test_results").select("*")]);
    if (!l.error) { l.data.forEach(r => { if (r.done) done[r.day] = true; if (r.ankle_pain != null && pain[r.day] == null) pain[r.day] = r.ankle_pain; }); }
    if (!t.error) {
      const ids = new Set(tests.map(x => x.id));
      t.data.forEach(r => { if (!ids.has(r.id)) tests.push({ id: r.id, tested_on: r.tested_on, pushups: r.pushups, situps: r.situps, plank_seconds: r.plank_seconds, run_seconds: r.run_seconds, swim_note: r.swim_note }); });
    }
    // push local-only items up
    const remoteDays = new Set((l.data || []).map(r => r.day));
    const localDays = new Set(Object.keys(done).filter(k => done[k]).concat(Object.keys(pain)));
    const missingLogs = Array.from(localDays).filter(k => !remoteDays.has(k)).map(k => ({ user_id: user.id, day: k, done: !!done[k], ankle_pain: pain[k] == null ? null : pain[k] }));
    if (missingLogs.length) await sb.from("cg_workout_logs").upsert(missingLogs);
    const remoteIds = new Set((t.data || []).map(r => r.id));
    const missingTests = tests.filter(x => !remoteIds.has(x.id)).map(x => Object.assign({ user_id: user.id }, x));
    if (missingTests.length) await sb.from("cg_test_results").upsert(missingTests);
    LS.set("cg_done", done); LS.set("cg_tests", tests); LS.set("cg_pain", pain);
    renderAll();
  }
  function setUser(u) {
    user = u;
    $("#authBtn").textContent = u ? "Signed in. Sign out" : "Sign in to sync";
    if (u) pull();
  }

  // ---- tabs / auth UI ----
  function showTab(name) {
    document.querySelectorAll(".tabs button").forEach(b => b.classList.toggle("on", b.dataset.tab === name));
    document.querySelectorAll(".pane").forEach(p => p.classList.toggle("on", p.id === name));
    window.scrollTo(0, 0);
    if (name === "today") renderToday();
  }
  document.querySelectorAll(".tabs button").forEach(b => b.onclick = () => showTab(b.dataset.tab));

  if (sb) {
    $("#authBtn").onclick = async () => {
      if (user) { await sb.auth.signOut(); setUser(null); return; }
      $("#authMsg").textContent = ""; $("#authDlg").showModal();
    };
    $("#authClose").onclick = () => $("#authDlg").close();
    const run = async mode => {
      const email = $("#authEmail").value.trim(), password = $("#authPw").value;
      if (!email || password.length < 6) { $("#authMsg").textContent = "Enter an email and a password of 6+ characters."; return; }
      const r = mode === "in" ? await sb.auth.signInWithPassword({ email, password }) : await sb.auth.signUp({ email, password });
      if (r.error) { $("#authMsg").textContent = r.error.message; return; }
      if (mode === "up" && !r.data.session) { $("#authMsg").textContent = "Check your email to confirm, then sign in."; return; }
      $("#authDlg").close();
    };
    $("#signInBtn").onclick = () => run("in");
    $("#signUpBtn").onclick = () => run("up");
    sb.auth.onAuthStateChange((_e, session) => setUser(session ? session.user : null));
    sb.auth.getSession().then(r => setUser(r.data.session ? r.data.session.user : null));
  }

  function renderAll() { updateCountdown(); renderToday(); renderPlan(); renderTests(); renderFuel(); }
  renderAll();
  setInterval(updateCountdown, 60 * 60 * 1000);
})();

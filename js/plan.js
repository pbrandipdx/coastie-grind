/* 78-day plan generator for THE COASTIE GRIND.
   getDay(date, opts) returns a day object. Every training day is 45 minutes or less.
   opts.runCleared: true once her PT/doctor says she can run. Until then, run sessions
   are swapped for bike / elliptical / rower work at the same effort. */
(function (root) {
  var START = Date.UTC(2026, 9, 26);   // Mon Oct 26, 2026 = Week 1 Day 1
  var SHIP = Date.UTC(2027, 0, 12);    // Tue Jan 12, 2027
  var DAY = 86400000;
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var DOWS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  var PHASES = [
    { n: 1, name: 'Base Engine', weeks: [1, 3], blurb: 'No running. Build the engine and the push-up and plank base.' },
    { n: 2, name: 'Return to Run', weeks: [4, 7], blurb: 'Walk-jog intervals once the ankle is cleared.' },
    { n: 3, name: 'Test Pace', weeks: [8, 10], blurb: 'Practice the real test pace and take full mock tests.' },
    { n: 4, name: 'Taper', weeks: [11, 12], blurb: 'Cut volume, stay sharp, arrive rested.' }
  ];

  function utc(d) { return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()); }
  function dayIndex(date) { return Math.round((utc(date) - START) / DAY); }
  function phaseOf(week) {
    for (var i = 0; i < PHASES.length; i++) if (week >= PHASES[i].weeks[0] && week <= PHASES[i].weeks[1]) return PHASES[i];
    return PHASES[3];
  }
  function label(date) { return DOWS[date.getDay()] + ' ' + MONTHS[date.getMonth()] + ' ' + date.getDate(); }

  /* ---------- pieces ---------- */
  function warmup(minutes) {
    return { name: 'Warm-up', minutes: minutes || 7, items: [
      { label: 'Easy bike or walk', dose: '3 min' },
      { ex: 'arm_swings', dose: '10 each way' },
      { ex: 'hip_circles', dose: '10 each way' },
      { ex: 'half_squat', dose: '10' }
    ] };
  }
  function cooldown(kind) {
    var items = kind === 'upper'
      ? [{ ex: 'chest_stretch', dose: '30 sec' }, { ex: 'low_back', dose: '30 sec' }, { ex: 'hip_flexor', dose: '30 sec each side' }]
      : [{ ex: 'hip_flexor', dose: '30 sec each side' }, { ex: 'hamstring', dose: '30 sec each side' }, { ex: 'low_back', dose: '30 sec' }, { ex: 'chest_stretch', dose: '30 sec' }];
    return { name: 'Cool-down', minutes: 5, items: items };
  }
  function pushupReps(week) { return Math.min(14, 4 + Math.floor(week * 0.9)); }
  function plankSecs(week) { return Math.min(75, 20 + week * 5); }

  function gluteBack(week) {
    var rounds = week >= 6 ? 3 : 2;
    var items = [
      { ex: 'glute_bridge', dose: '12, hold 2 sec' },
      { ex: 'back_extension', dose: '12' },
      { ex: 'superman', dose: '10 per side' },
      { ex: 'bird_dog', dose: '8 per side' }
    ];
    if (week >= 3) items.splice(1, 0, { ex: 'single_leg_bridge', dose: '8 per leg' });
    return { name: 'Glutes and back', minutes: rounds === 3 ? 14 : 11, desc: rounds + ' rounds, little rest between moves.', items: items };
  }
  function coreCircuit(week) {
    return { name: 'Core and push-up circuit', minutes: 12, desc: '2 rounds, 30 sec rest between rounds.', items: [
      { ex: week >= 5 ? 'pushup' : 'incline_pushup', dose: pushupReps(week) + ' reps' },
      { ex: 'dead_bug', dose: '8 per side' },
      { ex: 'side_plank', dose: '20 sec per side' },
      { ex: 'forearm_plank', dose: Math.max(20, plankSecs(week) - 10) + ' sec' }
    ] };
  }
  function upperStrength(week) {
    return { name: 'Upper body', minutes: 14, desc: '3 rounds. Pick a weight where the last 2 reps are tough.', items: [
      { ex: 'lat_pulldown', dose: '10 reps' },
      { ex: 'seated_row', dose: '10 reps' },
      { ex: 'shoulder_press', dose: '10 reps' },
      { ex: week >= 5 ? 'pushup' : 'incline_pushup', dose: pushupReps(week) + ' reps' }
    ] };
  }
  function pushPlankBuilder(week) {
    var sets = week >= 6 ? 5 : 4;
    return { name: 'Push-up and plank builder', minutes: 14, desc: sets + ' rounds. Stop each set 2 reps before you would fail.', items: [
      { ex: week >= 5 ? 'pushup' : 'incline_pushup', dose: pushupReps(week) + ' reps' },
      { ex: 'forearm_plank', dose: plankSecs(week) + ' sec' },
      { label: 'Rest', dose: '60 sec' }
    ] };
  }
  function ankleReset() {
    return { name: 'Ankle reset', minutes: 5, items: [
      { ex: 'ankle_alphabet', dose: '1 time each foot' },
      { ex: 'calf_raise', dose: '15 slow reps' },
      { ex: 'single_leg_balance', dose: '30 sec each foot' }
    ] };
  }

  /* ---------- cardio blocks ---------- */
  function steady(week, ph, runCleared, allowRun, max) {
    var mins = Math.min(max, [0, 15, 18, 20, 20, 22, 24, 25, 25, 25, 25, 15, 12][Math.min(week, 12)]);
    if (allowRun && runCleared && ph.n >= 2) return runWalk(week, ph, max);
    return { name: 'Steady cardio', minutes: mins, desc: 'Bike, elliptical or rower. Effort 6 out of 10: you can talk in short sentences.', items: [
      { label: 'Pick one machine and stay on it', dose: mins + ' min' }
    ] };
  }
  function runWalk(week, ph, max) {
    var t = { 4: [1, 2, 8], 5: [2, 2, 6], 6: [3, 1, 6], 7: [5, 1, 4] };
    var w = Math.min(Math.max(week, 4), 7), r = t[w];
    if (ph.n >= 3) {
      var ej = Math.min(max, 20 + (week - 7) * 2);
      return { name: 'Easy jog', minutes: ej, desc: 'Treadmill about 5.5 mph or an easy outdoor pace. Stay relaxed.', items: [{ label: 'Continuous easy jog', dose: ej + ' min' }] };
    }
    var cyc = r[0] + r[1], reps = Math.min(r[2], Math.floor(max / cyc));
    r = [r[0], r[1], reps];
    return { name: 'Run-walk', minutes: r[0] * r[2] + r[1] * r[2], desc: 'Treadmill, flat. Walk about 3.5 mph, jog about 5.0 mph. Stop if the ankle hurts.', items: [
      { label: 'Jog', dose: r[0] + ' min' }, { label: 'Walk', dose: r[1] + ' min' }, { label: 'Repeat', dose: r[2] + ' times' }
    ] };
  }
  function intervals(week, ph, runCleared) {
    var n = Math.min(10, 4 + week);
    if (ph.n >= 3 && runCleared) {
      var reps = week === 8 ? 6 : week === 9 ? 7 : 8;
      return { name: 'Test-pace repeats', minutes: reps * 3 + 6, desc: 'Treadmill 6.0 mph is 10:03 per mile, the pace she needs on test day. Quarter-mile at 6.0 mph is 2:30.', items: [
        { label: 'Fast: quarter mile (400 m) at 6.0 mph', dose: '2:30' }, { label: 'Walk or stand', dose: '60 sec' }, { label: 'Repeat', dose: reps + ' times' }, { label: 'Easy jog to cool', dose: '3 min' }
      ] };
    }
    var mach = ph.n >= 3 ? 'Row hard at about 2:08 per 500 m.' : 'Hard at 8 out of 10 effort.';
    return { name: 'Intervals', minutes: n * 3 + 3, desc: 'Elliptical, bike or rower. ' + mach, items: [
      { label: 'Hard', dose: '1 min' }, { label: 'Easy', dose: '2 min' }, { label: 'Repeat', dose: n + ' times' }
    ] };
  }
  function timeTrial(week, ph, runCleared) {
    if (ph.n >= 3 && runCleared) {
      return { name: 'Cardio test: 1.5 miles', minutes: 20, desc: 'Treadmill. Goal 15:05 or faster, which is 6.0 mph. Start easy for the first quarter mile, then settle in.', items: [
        { label: 'Easy jog to warm up', dose: '5 min' }, { label: '1.5 miles, as fast as you can hold', dose: 'goal 15:05' }, { label: 'Walk it off', dose: '3 min' }
      ] };
    }
    return { name: 'Cardio test: 2,000 m row', minutes: 14, ex: 'rower', desc: 'The Coast Guard lists a 2,000 m row (10:40 or better) as an alternate. Use it until you are cleared to run, and check with your recruiter.', items: [
      { ex: 'rower', dose: 'review technique' }, { label: '2,000 m, even pace', dose: 'goal 10:40' }, { label: 'Easy row to cool', dose: '3 min' }
    ] };
  }
  function longEasy(week, ph, runCleared) {
    var mins = Math.min(35, 25 + week * 2);
    if (ph.n === 4) mins = 20;
    var run = runCleared && ph.n >= 3;
    return { name: 'Long and easy', minutes: mins, desc: run ? 'Easy jog or jog-walk. You should finish feeling like you could do more.' : 'Any machine. Effort 5 out of 10. This builds the engine without stress on the ankle.', items: [
      { label: run ? 'Easy jog' : 'Steady cardio', dose: mins + ' min' }
    ] };
  }

  /* ---------- day builders ---------- */
  function build(date, week, ph, runCleared) {
    var dow = date.getDay(), blocks, title, tag;
    var taper = ph.n === 4;
    if (dow === 1) {
      title = 'Base Engine'; blocks = [warmup(), steady(week, ph, runCleared, false, 21), coreCircuit(week), cooldown()];
    } else if (dow === 2) {
      title = 'Intervals'; blocks = [warmup(), intervals(week, ph, runCleared), cooldown()];
    } else if (dow === 3) {
      title = 'Upper Body and Core'; blocks = [warmup(), upperStrength(week), pushPlankBuilder(week), cooldown('upper')];
    } else if (dow === 4) {
      title = 'Steady Cardio and Glutes'; var gb = gluteBack(week); blocks = [warmup(), steady(week, ph, runCleared, true, 45 - 12 - gb.minutes), gb, cooldown()];
    } else if (dow === 5) {
      title = 'Mock Test';
      blocks = [warmup(), { name: 'Push-ups', minutes: 2, desc: 'Max in 60 seconds. Test pass mark: 15. Full range, chest to a fist from the floor.', items: [{ ex: 'pushup', dose: 'max in 60 sec' }] },
        { name: 'Forearm plank', minutes: 3, desc: 'Hold as long as you can with good form. Pass mark: 1:09.', items: [{ ex: 'forearm_plank', dose: 'max hold' }] },
        timeTrial(week, ph, runCleared), cooldown()];
    } else if (dow === 6) {
      title = 'Long and Easy'; blocks = [warmup(5), longEasy(week, ph, runCleared), cooldown()];
    } else {
      title = 'Rest Day'; blocks = [ankleReset()];
    }
    if (taper && dow !== 0) {
      blocks = blocks.map(function (b) { var c = JSON.parse(JSON.stringify(b)); if (c.name !== 'Warm-up' && c.name !== 'Cool-down') c.minutes = Math.round(c.minutes * 0.6); return c; });
    }
    return { title: title, blocks: blocks, rest: dow === 0 };
  }

  function getDay(date, opts) {
    opts = opts || {};
    var idx = dayIndex(date);
    var out = { date: date, label: label(date), index: idx, daysToShip: Math.round((SHIP - utc(date)) / DAY) };
    if (idx < 0) { out.state = 'before'; return out; }
    if (utc(date) === SHIP) {
      out.state = 'ship'; out.title = 'Ship Day'; out.week = 12; out.phase = PHASES[3]; out.blocks = []; out.minutes = 0;
      return out;
    }
    if (utc(date) > SHIP) { out.state = 'after'; return out; }
    var week = Math.floor(idx / 7) + 1, ph = phaseOf(week);
    var d = utc(date) === Date.UTC(2027, 0, 11)
      ? { title: 'Last Day: Easy Shakeout', rest: false, blocks: [warmup(5), { name: 'Easy movement', minutes: 15, desc: 'Walk or easy bike. Pack, hydrate, sleep.', items: [{ label: 'Easy walk or bike', dose: '15 min' }] }, ankleReset()] }
      : build(date, week, ph, !!opts.runCleared);
    out.state = 'train'; out.week = week; out.dayOfWeek = date.getDay(); out.phase = ph; out.title = d.title; out.rest = d.rest; out.blocks = d.blocks;
    out.minutes = d.blocks.reduce(function (s, b) { return s + b.minutes; }, 0);
    out.noImpact = !(opts.runCleared && ph.n >= 2 && /Run|Interval|Easy|Long|Mock|Steady|Test/.test(d.title));
    return out;
  }

  function stravaText(day) {
    if (day.state !== 'train') return '';
    var lines = ['THE COASTIE GRIND · Wk ' + day.week + ' · ' + day.title + ' · ' + day.label];
    day.blocks.forEach(function (b) {
      var bits = b.items.filter(function (i) { return i.ex || i.dose; }).map(function (i) {
        var lib = (typeof EXERCISES !== 'undefined' ? EXERCISES : root.EXERCISES) || {}; var nm = i.ex ? lib[i.ex] : null;
        return (nm ? nm.name : i.label) + (i.dose ? ' ' + i.dose : '');
      });
      lines.push(b.name + ' (' + b.minutes + ' min): ' + bits.join(', '));
    });
    if (day.title === 'Mock Test') lines.push('Push-ups: ___ in 60 sec · Plank: ___ · Cardio: ___');
    lines.push('Ankle: ___/10');
    return lines.join('\n');
  }

  var api = { START: START, SHIP: SHIP, PHASES: PHASES, getDay: getDay, phaseOf: phaseOf, stravaText: stravaText, label: label };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  else { root.PLAN = api; }
})(typeof window !== 'undefined' ? window : this);

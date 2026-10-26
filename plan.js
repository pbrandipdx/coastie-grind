// 11-week plan, Mon Oct 26 2026 -> Sun Jan 10 2027, built for a Planet Fitness gym.
(function () {
  const START = new Date(2026, 9, 26);
  const SHIP = new Date(2027, 0, 12);
  const DAY = 86400000;
  const fmt = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  const parse = s => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
  const diffDays = (a, b) => Math.round((new Date(a.getFullYear(), a.getMonth(), a.getDate()) - new Date(b.getFullYear(), b.getMonth(), b.getDate())) / DAY);

  const GATE = " Ankle gate: if pain is above 2/10 during or after, stop and use the bike or rower instead.";
  // Weeks 1-4 are no-impact. Weeks 5+ reintroduce jogging only if the ankle allows.
  const lowIntervals = ["6 rounds: 2 min hard / 1 min easy", "7 rounds: 2 min hard / 1 min easy", "8 rounds: 2 min hard / 1 min easy", "6 rounds: 3 min hard / 1 min easy"];
  const runBack = [
    "10 rounds: 1 min jog / 2 min walk", "8 rounds: 2 min jog / 1 min walk", "6 rounds: 3 min jog / 1 min walk", "5 rounds: 4 min jog / 1 min walk",
    "4 rounds: 5 min jog / 1 min walk", "3 rounds: 8 min jog / 1 min walk", "3 x 0.5 mi at goal pace, 2 min walk between"];
  const easyMin = [20, 20, 25, 25, 12, 14, 16, 18, 20, 16, 10];       // wk1-4 incline walk/elliptical, wk5+ easy jog
  const longMin = [25, 30, 35, 40, 15, 18, 20, 22, 25, 20, 12];       // wk1-4 bike/row, wk5+ continuous jog
  const phaseOf = w => w <= 4 ? "Base (low-impact)" : w <= 8 ? "Return to run" : w <= 10 ? "Peak" : "Taper";
  const pushSets = w => (w <= 4 ? 4 : w <= 8 ? 5 : 4);
  const pushReps = w => 5 + Math.round(w * 1.2);
  const plank = w => Math.min(90, 20 + 7 * w);
  const situps = w => 15 + 2 * w;

  const WARM = "5 min easy bike or elliptical warm-up + hip circles, arm circles, gentle ankle circles";
  const COOL = "5 min easy walk or spin + stretch calves, hamstrings, hip flexors, chest";
  const ankleCheck = "Rate your ankle 0-10 after the session (log it on the Today screen)";

  function testDay(w) {
    const runOK = w >= 7;
    return {
      title: "Mock Fitness Test", icon: "target", test: true,
      items: [
        WARM,
        "Push-ups: max reps in 60 seconds (chest to a fist-height target, full lock-out)",
        "Sit-ups: max reps in 60 seconds (feet held, shoulder blades to the mat)",
        "Plank: max hold time",
        runOK ? "1.5-mile run on the treadmill at 1% incline, only if your ankle is under 2/10. Otherwise do the 2,000 m row and put the time in the notes box."
              : "Cardio test: 2,000 m row for time (low-impact stand-in for the run, put the time in the notes box). Skip the 1.5-mile run until the ankle is cleared.",
        COOL,
        "Log every number in the Tests tab"
      ]
    };
  }

  function buildWeek(w, dow) {
    const ps = pushSets(w), pr = pushReps(w), lowImpact = w <= 4;
    switch (dow) {
      case 0: return { title: lowImpact ? "Bike/Row Intervals + Push-ups" : "Run Intervals + Push-ups", icon: lowImpact ? "bolt" : "run", items: [
        WARM,
        lowImpact ? "Bike or rower intervals: " + lowIntervals[w - 1] : "Treadmill intervals: " + runBack[w - 5] + "." + GATE,
        "Push-up ladder: " + ps + " sets of " + pr + " (incline on the Smith machine bar if form breaks down), rest 60-90 sec",
        COOL, ankleCheck] };
      case 1: return { title: "Lower Body Strength + Core", icon: "lift", items: [
        "5 min bike warm-up",
        "Leg press: 3 x 12 (light-to-moderate, pain-free range)",
        "Dumbbell goblet squat: 3 x 10",
        "Dumbbell Romanian deadlift: 3 x 10",
        w >= 5 ? "Reverse lunges: 2 x 10 per leg (stop if the ankle complains)" : "Glute bridges: 3 x 15",
        "Seated calf raise or slow standing calf raise: 3 x 12, 3 sec down",
        "Single-leg balance: 3 x 30 sec per side (hold a rail if needed)",
        "Plank: 3 x " + plank(w) + " sec, rest 45 sec",
        "Sit-ups: 3 x " + situps(w), ankleCheck] };
      case 2: return { title: lowImpact ? "Incline Walk + Mobility" : "Easy Jog + Mobility", icon: "run", items: [
        WARM,
        lowImpact ? "Treadmill incline walk (3.0-3.5 mph, 8-12% incline) or elliptical: " + easyMin[w - 1] + " min steady" : "Easy conversational jog on the treadmill: " + easyMin[w - 1] + " min (walk breaks are fine)." + GATE,
        "Stair climber: 10 min steady (stop if the ankle hurts)",
        "Mobility: hips, hamstrings, thoracic rotations, gentle ankle circles, 8 min", ankleCheck] };
      case 3: return { title: "Upper Body + Core", icon: "lift", items: [
        "5 min rower or elliptical warm-up",
        "Lat pulldown: 3 x 12",
        "Dumbbell bench or machine chest press: 3 x 10",
        "Seated cable row: 3 x 12",
        "Dumbbell shoulder press: 3 x 10",
        "Push-ups: 3 sets to 2 reps short of failure",
        "Plank variations (forearm, side planks 30 sec each side): 3 rounds",
        "Captain's-chair knee raises or lying leg raises: 3 x 10"] };
      case 4: return w >= 11 ? { title: "Light Shakeout", icon: "run", items: [
        "10 min easy jog (or bike if the ankle is sore)", "Push-ups: 2 x 8, plank: 2 x 30 sec", COOL] } :
        { title: "Full-Body Circuit + Sit-ups", icon: "bolt", items: [
        "5 min warm-up",
        "Circuit, " + (w <= 4 ? 3 : 4) + " rounds, 90 sec rest between rounds: 12 goblet squats, " + pr + " push-ups, 12 cable rows, " + Math.min(60, 15 + 4 * w) + " sec plank, " + (w >= 5 ? "10 dumbbell step-ups per leg" : "15 glute bridges"),
        "Timed sit-ups: 1 min max reps (record it), then 2 x " + situps(w) + " controlled",
        COOL, ankleCheck] };
      case 5:
        if ([1, 4, 7, 10].includes(w)) return testDay(w);
        return w >= 11 ? { title: "Rest + Visualize", icon: "rest", items: [
          "Full rest day. Pack, hydrate, and sleep well.", "10 min easy walk if restless"] } :
          { title: lowImpact ? "Long Bike/Row Session" : "Long Jog", icon: "run", items: [
          WARM,
          lowImpact ? "Steady bike or rower at a talking pace: " + longMin[w - 1] + " min" : "Continuous jog on the treadmill: " + longMin[w - 1] + " min at a talking pace (short walk breaks OK)." + GATE,
          COOL, ankleCheck] };
      default: return { title: "Rest + Optional Pool Day", icon: "rest", items: [
        "Rest day. Walk, stretch, foam roll.",
        "Optional: get to a community pool. Swimming is easy on the ankle. Practice jumping in from the side, treading water 5 min, and swimming 100 m without stopping. Planet Fitness has no pool, so find a YMCA or rec center",
        "Sleep goal tonight: 8+ hours"] };
    }
  }

  function planFor(date) {
    const n = diffDays(date, START);
    if (n < 0) return { phase: "Pre-plan", title: "Plan starts Oct 26", icon: "rest", items: ["The plan begins Monday, Oct 26, 2026."], week: 0 };
    if (diffDays(date, SHIP) === 0) return { phase: "Ship Day", title: "SHIP DAY. You are ready.", icon: "flag", items: ["Report to Cape May. You put in the work.", "Bring all required documents and stay calm."], week: 12 };
    if (diffDays(date, SHIP) > 0) return { phase: "Boot Camp", title: "Boot camp has started", icon: "flag", items: ["Plan complete. Stay strong, Recruit."], week: 13 };
    if (n >= 77) return { week: 11, phase: "Taper", title: "Final Rest Day", icon: "rest", items: ["Light walk, lay out your gear, eat well, and sleep early. Ship day is tomorrow."], date: fmt(date) };
    const w = Math.floor(n / 7) + 1, dow = n % 7;
    const day = buildWeek(w, dow);
    return Object.assign({ week: w, dow, phase: phaseOf(w), date: fmt(date) }, day);
  }

  window.CGPlan = { START, SHIP, fmt, parse, diffDays, planFor, TOTAL_WEEKS: 11 };
})();

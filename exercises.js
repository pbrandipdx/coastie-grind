// How-to cues + demo search links, matched against plan item text.
(function () {
  const E = [
    [/circuit/i, "Circuit", ["Do each move back to back, rest 90 seconds after the full round.", "Keep reps clean over fast."], "bodyweight circuit workout gym"],
    [/push-up ladder|^Push-ups|push-ups: 3 sets|Push-ups: max/i, "Push-up", ["Hands just wider than shoulders, body in one straight line from head to heels.", "Lower until your chest is a fist from the floor, elbows about 45 degrees from your sides.", "Press up until your arms lock out. Too hard? Use a Smith machine bar set at hip height (incline), or drop to your knees."], "push up proper form beginner"],
    [/sit-ups/i, "Sit-up", ["Lie on your back, knees bent, feet held down. Hands crossed on your chest or behind your head.", "Curl up until your shoulder blades leave the mat and you reach upright, then lower under control.", "Do not yank your neck. Exhale on the way up."], "sit up proper form coast guard"],
    [/plank variations/i, "Plank variations", ["Forearm plank: elbows under shoulders, glutes tight, ribs down.", "Side plank: stack your feet, lift your hips so your body is a straight line, hold 30 seconds per side."], "side plank form"],
    [/plank/i, "Plank", ["Forearms on the floor, elbows under shoulders, body in a straight line.", "Squeeze glutes and abs, keep hips level (no sagging or piking), breathe steadily.", "Stop the set when your form breaks, not when you shake a little."], "forearm plank proper form"],
    [/leg press/i, "Leg press", ["Feet shoulder-width on the platform, lower back flat against the pad.", "Lower until your knees are about 90 degrees, then press through your heels. Do not lock your knees.", "Start light. Keep the range pain-free for the ankle."], "leg press machine proper form"],
    [/goblet squat/i, "Dumbbell goblet squat", ["Hold one dumbbell against your chest with both hands.", "Feet shoulder-width, sit down and back between your knees, chest tall.", "Stand by driving through your whole foot."], "goblet squat form"],
    [/romanian deadlift/i, "Dumbbell Romanian deadlift", ["Dumbbells in front of your thighs, soft knees.", "Push your hips back like closing a car door, keep the weights close to your legs and your back flat.", "Lower to mid-shin, feel the hamstrings stretch, then squeeze glutes to stand."], "dumbbell romanian deadlift form"],
    [/glute bridge/i, "Glute bridge", ["Lie on your back, knees bent, feet flat.", "Drive through your heels and lift your hips until shoulders, hips and knees line up.", "Squeeze at the top for a second, lower slowly."], "glute bridge proper form"],
    [/reverse lunge/i, "Reverse lunge", ["Stand tall, step one foot back and lower until both knees are near 90 degrees.", "Push through the front heel to return. Keep your front knee over your ankle.", "Stop if the ankle complains."], "reverse lunge form"],
    [/calf raise/i, "Calf raise", ["Rise onto the balls of your feet, pause one second, lower for three seconds.", "Keep it slow and pain-free. This builds ankle strength."], "calf raise form ankle strengthening"],
    [/single-leg balance/i, "Single-leg balance", ["Stand on one foot near a rail, soft knee, eyes forward.", "Hold 30 seconds, then switch. This rebuilds ankle stability."], "single leg balance exercise ankle"],
    [/step-ups/i, "Dumbbell step-up", ["Place your whole foot on a bench, dumbbells at your sides.", "Drive through the top heel to stand, lower under control, finish all reps on one leg then switch."], "dumbbell step up form"],
    [/lat pulldown/i, "Lat pulldown", ["Grip just outside shoulder width, sit tall with thighs under the pad.", "Pull the bar to your upper chest by driving elbows down, then control it back up."], "lat pulldown proper form"],
    [/chest press|bench/i, "Chest press", ["Feet flat, shoulder blades pinched back.", "Lower the weights to chest level, press up without locking elbows hard."], "dumbbell chest press form"],
    [/cable row/i, "Seated cable row", ["Sit tall, slight knee bend, pull the handle to your belly button.", "Squeeze shoulder blades together, then return slowly. Do not rock your torso."], "seated cable row form"],
    [/shoulder press/i, "Dumbbell shoulder press", ["Dumbbells at shoulder height, ribs down.", "Press overhead until arms are straight, lower with control."], "dumbbell shoulder press form"],
    [/knee raises|leg raises/i, "Knee raise / leg raise", ["Support yourself on the captain's chair or lie flat.", "Curl knees toward your chest without swinging, lower slowly."], "captain's chair knee raise form"],
    [/stair climber/i, "Stair climber", ["Stand tall, light hand on the rails (do not lean on them), full steps.", "Steady pace you can talk through. Stop if your ankle hurts."], "stair climber machine proper form"],
    [/incline walk/i, "Treadmill incline walk", ["Set 8-12% incline and 3.0-3.5 mph.", "Hands off the rails, walk tall. This builds the same engine as running with far less impact."], "treadmill incline walking form"],
    [/bike or rower intervals|bike\/row|bike or rower at|steady bike|2,000 m row|rower/i, "Bike / rower intervals", ["Hard = breathing heavy, can only say a few words. Easy = fully recover.", "Rowing: push with legs first, then lean back, then pull arms. Reverse it on the way back."], "rowing machine proper form"],
    [/jog|run|mile/i, "Treadmill jog / run", ["Land softly under your hips, short quick steps, relaxed shoulders.", "Easy pace means you can talk. Walk breaks are part of the plan.", "Ankle pain above 2/10? Switch to bike or rower for that session."], "treadmill running form beginner"],
    [/swim|pool|tread/i, "Pool practice", ["Jump in from the side, then tread water or float for 5 minutes.", "Swim 100 m any stroke without stopping. Swimming is easy on the ankle."], "treading water technique"],
    [/mobility|stretch|foam roll/i, "Mobility / stretching", ["Hold each stretch 20-30 seconds, no bouncing.", "Calves, hamstrings, hip flexors, chest. Gentle ankle circles both directions."], "post workout stretching routine"]
  ];
  window.CGEx = function (text) {
    for (const e of E) if (e[0].test(text)) return { name: e[1], cues: e[2], q: e[3] };
    return null;
  };
})();

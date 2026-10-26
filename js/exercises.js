/* Exercise library for THE COASTIE GRIND.
   Each entry: name, steps (how-to), cue (one-liner), video (YouTube id, optional), search (fallback query).
   Video ids were picked from YouTube search results by title and have NOT been watched or
   embed-tested: skim each one before trusting it, and swap the id here if one is off. */
(function (root) {
  var EX = {
    arm_swings: {
      name: 'Arm swings',
      steps: ['Stand tall, feet shoulder-width apart, knees soft.', 'Swing both arms in big circles like propellers.', 'Then swing them across your chest and back open.'],
      cue: 'Loose shoulders, no shrugging.',
      search: 'arm swings dynamic warm up'
    },
    hip_circles: {
      name: 'Hip circles',
      steps: ['Hands on hips, feet shoulder-width apart.', 'Draw big circles with your hips, like a hula hoop.', 'Reverse direction halfway through.'],
      cue: 'Shift weight to your good foot if the ankle is sore.',
      search: 'standing hip circles warm up'
    },
    half_squat: {
      name: 'Half-squat',
      steps: ['Feet shoulder-width apart, hands out in front.', 'Sit your hips back and down until your thighs are about parallel to the floor.', 'Stand back up slowly.'],
      cue: 'Keep both heels flat on the floor.',
      search: 'bodyweight squat form'
    },
    leg_swings: {
      name: 'Leg swings',
      steps: ['Hold a wall or machine for balance.', 'Swing one leg forward and back like a pendulum.', 'Switch legs. Then swing each leg side to side across your body.'],
      cue: 'Skip this one if standing on the sore ankle hurts.',
      search: 'leg swings warm up'
    },
    pushup: {
      name: 'Push-up',
      steps: ['Hands just wider than your shoulders, body in one straight line from head to heels.', 'Lower until your chest is about a fist-width from the floor.', 'Push up until your arms are fully straight. That is one rep.'],
      cue: 'Squeeze your glutes so your hips do not sag.',
      video: 'i9sTjhN4Z3M',
      search: 'push up proper form'
    },
    incline_pushup: {
      name: 'Incline push-up',
      steps: ['Rest your hands on the Smith bar, just wider than your shoulders.', 'Walk your feet back until your body is one straight line.', 'Lower your chest to the bar, then push back up.', 'Lower the bar over the weeks as it gets easier.'],
      cue: 'The lower the bar, the closer you are to a real push-up.',
      video: 'j0q5wD9Lcg0',
      search: 'incline push up form'
    },
    forearm_plank: {
      name: 'Forearm plank',
      steps: ['Forearms flat on the floor, elbows directly under your shoulders.', 'Legs straight, body in one line from head to heels.', 'Squeeze your glutes and brace your stomach. Breathe steadily.', 'Stop when your hips sag or lift. Shaking is fine as long as you hold the position.'],
      cue: 'Tuck your tailbone slightly. Do not let your lower back sag.',
      video: 'BjGVnfGk6j8',
      search: 'forearm plank proper form'
    },
    side_plank: {
      name: 'Side plank',
      steps: ['Lie on your side, forearm under your shoulder, legs stacked.', 'Lift your hips until your body is a straight line.', 'Hold, then switch sides.'],
      cue: 'Drop to your bottom knee if you cannot hold the line.',
      video: '0M-erHBl48U',
      search: 'side plank form'
    },
    glute_bridge: {
      name: 'Glute bridge',
      steps: ['Lie on your back, knees bent, feet flat, arms by your sides.', 'Squeeze your glutes and lift your hips until only your shoulders and feet touch the floor.', 'Hold at the top, then lower slowly.'],
      cue: 'Push through your heels, not your toes.',
      video: 'Q_Bpj91Yiis',
      search: 'glute bridge form'
    },
    single_leg_bridge: {
      name: 'Single-leg bridge',
      steps: ['Set up like a glute bridge, then lift one leg straight up.', 'Push through the heel of the planted foot and lift your hips.', 'Lower slowly. Finish all reps, then switch legs.'],
      cue: 'Keep your hips level. Do not let one side drop.',
      video: 'Q_Bpj91Yiis',
      search: 'single leg glute bridge'
    },
    back_extension: {
      name: 'Back extension',
      steps: ['Lie face down, legs shoulder-width apart, arms stretched in front of you.', 'Squeeze your lower back and lift your chest slightly off the floor.', 'Hold, then lower. Keep your neck long.'],
      cue: 'Small lift is enough. Do not crank your neck up.',
      video: 'HAjQVUp9mS4',
      search: 'back extension superman exercise'
    },
    superman: {
      name: 'Superman',
      steps: ['Lie face down, arms stretched forward.', 'Lift your right arm and left leg together, hold briefly, lower.', 'Switch to left arm and right leg. That is one rep per side.'],
      cue: 'Move slowly and keep your hips on the floor.',
      video: 'z6PJMT2y8GQ',
      search: 'superman exercise form'
    },
    dead_bug: {
      name: 'Dead bug',
      steps: ['Lie on your back, arms straight up, knees bent over your hips.', 'Slowly lower your right arm overhead and extend your left leg, keeping your low back pressed into the floor.', 'Return and switch sides.'],
      cue: 'If your back arches, shorten the range.',
      video: 'g_BYB0R-4Ws',
      search: 'dead bug exercise'
    },
    bird_dog: {
      name: 'Bird dog',
      steps: ['On hands and knees, hands under shoulders, knees under hips.', 'Reach your right arm forward and left leg back at the same time.', 'Hold a moment without twisting, return, and switch.'],
      cue: 'Imagine a glass of water on your lower back.',
      video: 'ZdAHe9_HeEw',
      search: 'bird dog exercise'
    },
    lat_pulldown: {
      name: 'Lat pulldown',
      steps: ['Sit with your thighs snug under the pad and grip the bar just wider than your shoulders.', 'Lean back slightly and pull the bar down to your upper chest.', 'Let it rise slowly until your arms are straight.'],
      cue: 'Lead with your elbows, not your hands.',
      video: 'gCW_VWcTtbw',
      search: 'lat pulldown machine form'
    },
    seated_row: {
      name: 'Seated row',
      steps: ['Sit tall, feet braced, chest up.', 'Pull the handle to your lower ribs, squeezing your shoulder blades together.', 'Let your arms straighten slowly without rounding your back.'],
      cue: 'Do not rock your body to move the weight.',
      video: 'EU7bOadUsNI',
      search: 'seated cable row form'
    },
    shoulder_press: {
      name: 'Shoulder press',
      steps: ['Sit with your back against the pad, handles at shoulder height.', 'Press straight up until your arms are almost straight.', 'Lower under control to shoulder height.'],
      cue: 'Choose a weight you can lift 10 times with good form.',
      search: 'machine shoulder press form'
    },
    calf_raise: {
      name: 'Calf raise',
      steps: ['Stand holding a wall or machine for balance.', 'Rise onto the balls of both feet, hold a second, lower slowly.', 'As your PT clears it, progress to one leg at a time.'],
      cue: 'Slow down for 3 seconds, up for 1.',
      video: '2rVrPZ5fZLs',
      search: 'calf raise ankle sprain rehab'
    },
    single_leg_balance: {
      name: 'Single-leg balance',
      steps: ['Stand on one foot next to a wall for safety.', 'Hold still for the time shown, then switch.', 'Make it harder by closing your eyes or standing on a folded towel, only if your PT approves.'],
      cue: 'Keep your standing knee soft, not locked.',
      video: 'FjwiVMhBhw0',
      search: 'single leg balance ankle'
    },
    ankle_alphabet: {
      name: 'Ankle alphabet',
      steps: ['Sit with your leg out in front, foot off the floor.', 'Trace each letter of the alphabet in the air with your big toe.', 'Move from the ankle, not the knee.'],
      cue: 'Slow and smooth. Stay within comfortable range.',
      search: 'ankle alphabet exercise'
    },
    chest_stretch: {
      name: 'Chest stretch',
      steps: ['Stand in a doorway with your arms out in a T, forearms on the frame.', 'Step one foot forward and lean until you feel a gentle stretch across your chest.'],
      cue: 'Breathe slowly. No pain.',
      search: 'doorway chest stretch'
    },
    hip_flexor: {
      name: 'Hip flexor stretch',
      steps: ['Kneel on one knee, the other foot flat in front, knee over the ankle.', 'Keep your torso upright and push your hips forward until the front of your back hip stretches.', 'Switch sides.'],
      cue: 'Squeeze the glute of the back leg.',
      video: 'iZ1eZBY4fwM',
      search: 'kneeling hip flexor stretch'
    },
    hamstring: {
      name: 'Hamstring stretch',
      steps: ['Sit with one leg straight and the other foot against your inner thigh.', 'Fold forward from the hips, back long, until you feel it behind the straight leg.', 'Switch legs.'],
      cue: 'Hinge at the hips. Do not round your back.',
      search: 'seated hamstring stretch'
    },
    low_back: {
      name: 'Low back stretch',
      steps: ['Lie on your back and pull both knees toward your chest with your hands behind your knees.', 'Breathe slowly and let your lower back relax into the floor.'],
      cue: 'Let the floor hold your weight.',
      search: 'knees to chest stretch'
    },
    rower: {
      name: 'Rowing machine technique',
      steps: ['Sit tall, feet strapped in, shins vertical at the start.', 'Drive: push with your legs first, then lean back slightly, then pull the handle to your lower ribs.', 'Recover: arms out first, then lean forward, then bend your knees. Keep the sequence smooth.'],
      cue: 'Legs, body, arms on the way back. Arms, body, legs on the way in.',
      video: '4zWu1yuJ0_g',
      search: 'rowing machine technique'
    }
  };

  if (typeof module !== 'undefined' && module.exports) { module.exports = EX; }
  else { root.EXERCISES = EX; }
})(typeof window !== 'undefined' ? window : this);

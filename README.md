# THE COASTIE GRIND

A static daily workout site with optional check-ins: 78 days (Oct 26, 2026 to Jan 12, 2027), 45 minutes or less per day, built around the Coast Guard fitness test (15 push-ups in 60 sec, 1:09 forearm plank, 1.5-mile run in 15:05; women under 30, confirm with a recruiter).

- Open `index.html`, or host on GitHub Pages (Settings > Pages > deploy from `main`, root).
- `js/plan.js` generates each day. `js/exercises.js` holds how-tos and YouTube IDs (picked from search results, not watched; skim and swap as needed).
- "Cleared to run" toggle (saved in the browser) switches run sessions on from Week 4.

Unofficial training plan. Not affiliated with or endorsed by the U.S. Coast Guard.

## Check-ins (optional)
After a workout she taps "I finished today" (ankle score, notes, and push-ups/plank on test days). Data goes to Supabase through two functions, `submit_checkin` and `list_checkins`, both gated by a secret family code stored in the `family_code` table (never in this repo). The tables themselves are locked by RLS.
- Open `#/join/<code>` once on her phone to unlock check-ins.
- Open `#/family` to see the check-in log. The Tests tab logs push-ups, plank and run/row times against the pass marks (shared through the same code).

## Study tab (`#/study`)
Adaptive mock tests for everything she needs for Coast Guard recruit training: core values and history, chain of command and customs, ranks and rates, the 11 General Orders, phonetic alphabet and military time, nautical terms, the swim and fitness tests, first aid and CPR, UCMJ, plus optional ASVAB review.
- `js/questions.js` is the question bank. Add a line like `Q('topic', 'question', 'right answer', ['wrong 1', 'wrong 2', 'wrong 3'], 'why');` and it flows into every test. Generated questions (pace math, military time, ranks, general orders, etc.) use fresh numbers each time.
- `js/study.js` is the engine. Each answer moves a question up or down a spaced-repetition box, and every new test is built from what she missed, what is due, and her weakest topics.
- Progress is saved in her browser only (not Supabase). Sources: The Helmsman (official recruit guide) plus general first-aid, UCMJ and ASVAB review. Unofficial.

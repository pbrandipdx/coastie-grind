/* Question bank for the STUDY tab of THE COASTIE GRIND.

   HOW TO ADD QUESTIONS
   - Static question: add a line to the right topic below using  Q('topic', 'question', 'right answer', ['wrong 1', 'wrong 2', 'wrong 3'], 'why');
   - Her progress is saved per question (matched by its text), so add freely, but if you reword a question it starts over as "new".
   - Generated questions (G(...) near the bottom) build fresh numbers every time, so they never repeat.

   SOURCES: The Helmsman (official Coast Guard recruit guide, forcecom.uscg.mil) for core values, chain of command,
   phonetic alphabet, military time, nautical terms, customs, general orders and the swim test. The rest is
   standard first-aid, UCMJ and ASVAB-style review. Unofficial; confirm anything that matters with her recruiter.
   Fitness targets are the ones this plan uses (15 push-ups, 1:09 plank, 1.5 mi in 15:05). */
(function (root) {
  var TOPICS = [
    { id: 'values',   name: 'Core Values & History',     group: 'cg' },
    { id: 'command',  name: 'Chain of Command & Customs', group: 'cg' },
    { id: 'ranks',    name: 'Ranks & Rates',             group: 'cg' },
    { id: 'orders',   name: '11 General Orders',         group: 'cg' },
    { id: 'comms',    name: 'Phonetic Alphabet & Military Time', group: 'cg' },
    { id: 'nautical', name: 'Nautical Terms & Ship Life', group: 'cg' },
    { id: 'swimfit',  name: 'Swim & Fitness Test',       group: 'cg' },
    { id: 'firstaid', name: 'First Aid & CPR',           group: 'cg' },
    { id: 'ucmj',     name: 'UCMJ & Conduct',            group: 'cg' },
    { id: 'math',     name: 'ASVAB Math',                group: 'asvab' },
    { id: 'words',    name: 'ASVAB Words & Reading',     group: 'asvab' },
    { id: 'mech',     name: 'ASVAB Science & Mechanical', group: 'asvab' }
  ];

  var ITEMS = [];
  function hash(s) { var h = 5381, i; for (i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36); }
  function Q(topic, q, a, w, e, ctx) { ITEMS.push({ kind: 's', topic: topic, sid: topic + ':' + hash(q), q: q, a: a, w: w, e: e || '', ctx: ctx || '' }); }

  /* ---------- helpers for generators ---------- */
  function rint(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function shuffle(arr) { var a = arr.slice(), i, j, t; for (i = a.length - 1; i > 0; i--) { j = Math.floor(Math.random() * (i + 1)); t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function pad(n, w) { var s = String(n); while (s.length < w) s = '0' + s; return s; }
  function uniqWrong(correct, cands, n) {
    var out = [], i, c;
    cands = shuffle(cands);
    for (i = 0; i < cands.length && out.length < n; i++) { c = cands[i]; if (c !== correct && out.indexOf(c) < 0) out.push(c); }
    return out;
  }
  function gcd(a, b) { return b ? gcd(b, a % b) : a; }
  function mmss(s) { return Math.floor(s / 60) + ':' + pad(s % 60, 2); }
  function numWrongs(c, deltas) { return deltas.map(function (d) { return c + d; }).filter(function (v) { return v > 0 && v !== c; }); }

  /* =====================================================================
     STATIC QUESTIONS
     ===================================================================== */

  /* ---- Core Values & History ---- */
  Q('values', 'What are the three Coast Guard core values?', 'Honor, Respect, Devotion to Duty', ['Honor, Courage, Commitment', 'Loyalty, Duty, Respect', 'Integrity First, Service Before Self, Excellence'], 'Honor, Respect and Devotion to Duty. Honor, Courage, Commitment is the Navy; Integrity First is the Air Force.');
  Q('values', 'Which core value is defined as "integrity is the standard"?', 'Honor', ['Respect', 'Devotion to Duty'], 'Honor: integrity is the standard, shown through ethical conduct and accountability to the public trust.');
  Q('values', 'Which core value says, "We exist to serve. We serve with pride."?', 'Devotion to Duty', ['Honor', 'Respect'], 'Devotion to Duty: accept responsibility and accountability, and serve with pride.');
  Q('values', 'Which core value means treating others with fairness, dignity and compassion, and valuing a diverse workforce?', 'Respect', ['Honor', 'Devotion to Duty'], 'Respect includes fairness, dignity, compassion, and working as a team.');
  Q('values', 'What does the Coast Guard motto, Semper Paratus, mean?', 'Always Ready', ['Always Faithful', 'Always Vigilant', 'Ready for Anything'], '"Always Ready." Semper Fidelis ("Always Faithful") is the Marine Corps motto.');
  Q('values', 'What is the Coast Guard\'s birthday?', 'August 4', ['October 13', 'November 10', 'June 14'], 'August 4, 1790. October 13 is the Navy, November 10 the Marine Corps, June 14 the Army.');
  Q('values', 'Who proposed the Revenue Marine, the Coast Guard\'s earliest ancestor?', 'Alexander Hamilton', ['Thomas Jefferson', 'Benjamin Franklin', 'John Adams'], 'Treasury Secretary Alexander Hamilton proposed a fleet of armed cutters in 1790 to enforce tariff laws.');
  Q('values', 'In what year did the Revenue Cutter Service and the Life-Saving Service merge to form the Coast Guard?', '1915', ['1790', '1861', '1947'], 'The name "Coast Guard" dates from the 1915 merger.');
  Q('values', 'Which service joined the Coast Guard in 1939?', 'Lighthouse Service', ['Life-Saving Service', 'Marine Hospital Service', 'Postal Service'], 'The Lighthouse Service joined in 1939, which is why the Coast Guard maintains aids to navigation.');
  Q('values', 'Which department is the Coast Guard part of today?', 'Department of Homeland Security', ['Department of Defense', 'Department of the Navy', 'Department of Transportation'], 'It moved to DHS in 2003 (it was in the Department of Transportation from 1967).');
  Q('values', 'In time of war, the President can transfer the Coast Guard to which department?', 'Department of the Navy', ['Department of the Army', 'Department of State', 'Department of the Treasury'], 'The Coast Guard is always an armed force, and in wartime it can operate under the Navy.');
  Q('values', 'What are the Coast Guard\'s three roles?', 'Maritime safety, maritime security, maritime stewardship', ['Air defense, ground combat, space operations', 'Fishing, shipping, tourism', 'Search, rescue, salvage'], 'Safety, security and stewardship. The Coast Guard is a military, multi-mission, maritime force.');
  Q('values', 'Where do Coast Guard enlisted recruits go to boot camp?', 'Training Center Cape May, New Jersey', ['Great Lakes, Illinois', 'Parris Island, South Carolina', 'Fort Jackson, South Carolina'], 'Cape May is the "Birthplace of the U.S. Coast Guard Enlisted Corps."');
  Q('values', 'How long is Coast Guard basic training?', 'Eight weeks', ['Four weeks', 'Twelve weeks', 'Sixteen weeks'], 'Eight weeks, longer if a recruit is held back for medical, academic, disciplinary or fitness reasons.');
  Q('values', 'Where is the Coast Guard Academy?', 'New London, Connecticut', ['Annapolis, Maryland', 'Cape May, New Jersey', 'Newport, Rhode Island'], 'The Academy trains Coast Guard officers in New London.');
  Q('values', 'Who is the only Coast Guardsman to receive the Medal of Honor?', 'Signalman First Class Douglas Munro', ['Joshua James', 'Ida Lewis', 'Bernard Webber'], 'Munro earned it at Guadalcanal in 1942. The others are famed rescuers.');
  Q('values', 'How many statutory missions does the Coast Guard have?', '11', ['5', '8', '14'], 'Including search and rescue, aids to navigation, drug interdiction, migrant interdiction, ice operations, marine safety, environmental protection, living marine resources, defense readiness, port security and other law enforcement.');
  Q('values', 'Which of these is one of the Coast Guard\'s missions?', 'Ice operations', ['Strategic bombing', 'Close air support', 'Nuclear deterrence'], 'Icebreaking is a real Coast Guard mission.');
  Q('values', 'The Coast Guard is one of how many U.S. armed forces?', 'Six', ['Four', 'Five', 'Seven'], 'Army, Marine Corps, Navy, Air Force, Space Force and Coast Guard.');
  Q('values', 'Who is the current Commandant of the Coast Guard (as of fall 2026)?', 'Admiral Kevin E. Lunday', ['Admiral Linda Fagan', 'Admiral Karl Schultz', 'Admiral Paul Zukunft'], 'Lunday is the 28th Commandant, in office since January 15, 2026. Names change, so double-check this one on arrival.');

  /* ---- Chain of Command & Customs ---- */
  Q('command', 'Who is the Commander-in-Chief of the armed forces?', 'The President', ['The Secretary of Homeland Security', 'The Commandant of the Coast Guard', 'The Secretary of Defense'], 'The President is at the top of every chain of command.');
  Q('command', 'Which Cabinet secretary sits between the President and the Commandant in the Coast Guard chain of command?', 'Secretary of Homeland Security', ['Secretary of Defense', 'Secretary of the Navy', 'Secretary of Transportation'], 'President, then Secretary of Homeland Security, then Commandant.');
  Q('command', 'Who is the highest-ranking officer in the Coast Guard?', 'The Commandant', ['The Master Chief Petty Officer of the Coast Guard', 'The Vice Commandant', 'The Commanding Officer of Cape May'], 'The Commandant is an Admiral. The Vice Commandant is second.');
  Q('command', 'Who leads Training Center Cape May?', 'The Commanding Officer (CO)', ['The Executive Officer (XO)', 'The Command Master Chief (CMC)', 'The Company Commander (CC)'], 'The CO is in charge; the XO is second in command.');
  Q('command', 'Who is second in command of a unit, directly below the Commanding Officer?', 'Executive Officer (XO)', ['Command Master Chief (CMC)', 'Training Officer (TO)', 'Battalion Commander (BC)'], 'The XO backs up the CO.');
  Q('command', 'Who is the recruits\' day-to-day leader and trainer at Cape May?', 'Company Commander (CC)', ['Executive Officer (XO)', 'Regimental Officer (RO)', 'Command Master Chief (CMC)'], 'The Company Commander is the recruits\' direct supervisor.');
  Q('command', 'Which list shows the chain of command in the correct order, top to bottom?', 'President, Secretary of Homeland Security, Commandant, Commanding Officer, Executive Officer', ['President, Commandant, Secretary of Homeland Security, Commanding Officer, Executive Officer', 'President, Secretary of Homeland Security, Commandant, Executive Officer, Commanding Officer', 'Secretary of Homeland Security, President, Commandant, Commanding Officer, Executive Officer'], 'Know the order cold; you will be asked to recite it.');
  Q('command', 'Who is the senior enlisted advisor to the Commanding Officer of a unit?', 'Command Master Chief (CMC)', ['Executive Officer (XO)', 'Chaplain', 'Company Commander (CC)'], 'The CMC is the senior enlisted leader and a helpful resource for recruits.');
  Q('command', 'Which person is a helpful resource for recruits but is NOT in the chain of command?', 'Chaplain', ['Company Commander', 'Battalion Commander', 'Commanding Officer'], 'Chaplain, Command Master Chief and the Equal Opportunity Advisor are people recruits can go to for help.');
  Q('command', 'A petty officer gives you a direct order. What is the correct response?', '"Aye, aye, Sir/Ma\'am."', ['"Okay."', '"Roger that."', '"Yeah, got it."'], '"Aye, aye" shows you understand the order and will carry it out.');
  Q('command', 'What does "Aye, aye" mean?', 'I understand the order and will carry it out', ['I agree with you', 'Maybe I will', 'I have a question'], 'It is more than "yes": it is a promise to follow the order.');
  Q('command', 'A superior asks you a yes or no question. What is the correct reply?', '"Yes, Sir/Ma\'am" or "No, Sir/Ma\'am"', ['"Yeah" or "Nope"', '"Affirmative" or "Negative"', '"Aye" or "Nay"'], 'Use Sir or Ma\'am every time.');
  Q('command', 'Recruits start and end every sentence spoken to staff with what?', '"Sir" or "Ma\'am"', ['"Excuse me"', '"Please"', '"Respectfully"'], 'Address all personnel as Sir or Ma\'am at the start and end of sentences.');
  Q('command', 'In the position of attention, your feet form about what angle?', '45 degrees', ['90 degrees', 'Parallel (0 degrees)', '180 degrees'], 'Heels together, feet at about 45 degrees, eyes forward.');
  Q('command', 'What does a salute recognize?', 'The other person\'s seniority', ['That you are in a hurry', 'That you outrank them', 'A friendly greeting'], 'A salute recognizes seniority and is paired with a proper greeting, such as "Sir, Good Morning, Sir."');
  Q('command', 'Which hand do you use to salute?', 'Right hand', ['Left hand', 'Whichever is free', 'Either hand'], 'The right hand.');
  Q('command', 'Who do you salute?', 'All officers, and the colors', ['Only the Commandant', 'Anyone in uniform', 'Only your own Company Commander'], 'General Order 10: salute all officers and all colors and standards not cased.');
  Q('command', 'When a permanent party member speaks to you, what do you do?', 'Assume the position of attention', ['Stand at ease', 'Keep walking', 'Sit down'], 'Recruits come to attention when speaking with, or being addressed by, permanent party.');
  Q('command', 'At Cape May, what does "permanent party" mean?', 'Staff assigned to the training center', ['Recruits who have graduated', 'Visiting family', 'Civilian guests'], 'Permanent party are the staff; recruits are in training.');
  Q('command', '"Carry on" is only granted to a recruit who shows what?', 'Proper military bearing', ['A fast run time', 'A loud voice', 'A clean rack'], 'Show military bearing and you may be told to carry on.');

  /* ---- Ranks & Rates ---- */
  Q('ranks', 'At what pay grade does a Coast Guardsman become a petty officer?', 'E-4', ['E-2', 'E-3', 'E-5'], 'E-1 to E-3 are not yet rated (Seaman Recruit, Seaman Apprentice, Seaman). E-4 is Petty Officer Third Class.');
  Q('ranks', 'At what pay grade do most recruits enlist?', 'E-1', ['E-2', 'E-3', 'E-4'], 'Most enlist as E-1 (Seaman Recruit). Some programs enlist at E-2 or E-3.');
  Q('ranks', 'In the Coast Guard, what pay grade is a Captain?', 'O-6', ['O-3', 'O-4', 'O-7'], 'A Coast Guard Captain is O-6 (like the Navy). It is not the Army captain, which is O-3.');
  Q('ranks', 'What is the highest enlisted pay grade?', 'E-9 (Master Chief Petty Officer)', ['E-7 (Chief Petty Officer)', 'E-8 (Senior Chief Petty Officer)', 'W-4 (Chief Warrant Officer 4)'], 'E-9 is Master Chief Petty Officer.');
  Q('ranks', 'What pay-grade range do Coast Guard warrant officers hold?', 'W-2 to W-4', ['W-1 to W-3', 'W-3 to W-5', 'W-1 to W-5'], 'Chief Warrant Officer 2, 3 and 4.');
  Q('ranks', 'What do the letters E, W and O stand for in pay grades like E-4?', 'Enlisted, Warrant, Officer', ['Entry, Wage, Order', 'Enlisted, Watch, Operations', 'Engineer, Warrant, Officer'], 'E-1 to E-9, W-2 to W-4, O-1 to O-10.');
  Q('ranks', 'A single gold bar is the insignia of which rank?', 'Ensign (O-1)', ['Lieutenant (O-3)', 'Captain (O-6)', 'Commander (O-5)'], 'Gold bar = Ensign.');
  Q('ranks', 'A single silver bar is the insignia of which rank?', 'Lieutenant Junior Grade (O-2)', ['Ensign (O-1)', 'Lieutenant (O-3)', 'Lieutenant Commander (O-4)'], 'Silver bar = Lieutenant Junior Grade.');
  Q('ranks', 'Two silver bars are the insignia of which rank?', 'Lieutenant (O-3)', ['Lieutenant Junior Grade (O-2)', 'Ensign (O-1)', 'Lieutenant Commander (O-4)'], 'Two silver bars = Lieutenant.');
  Q('ranks', 'A gold oak leaf is the insignia of which rank?', 'Lieutenant Commander (O-4)', ['Commander (O-5)', 'Captain (O-6)', 'Lieutenant (O-3)'], 'Gold oak leaf = Lieutenant Commander.');
  Q('ranks', 'A silver oak leaf is the insignia of which rank?', 'Commander (O-5)', ['Lieutenant Commander (O-4)', 'Captain (O-6)', 'Rear Admiral (O-8)'], 'Silver oak leaf = Commander.');
  Q('ranks', 'A silver eagle is the insignia of which rank?', 'Captain (O-6)', ['Commander (O-5)', 'Rear Admiral (O-8)', 'Lieutenant Commander (O-4)'], 'Silver eagle = Captain.');
  Q('ranks', 'How many chevrons does a Petty Officer Second Class (E-5) wear?', 'Two', ['One', 'Three', 'Four'], 'PO3 wears one, PO2 two, PO1 three.');
  Q('ranks', 'Which rate wears three chevrons and no rocker?', 'Petty Officer First Class (E-6)', ['Petty Officer Second Class (E-5)', 'Chief Petty Officer (E-7)', 'Seaman (E-3)'], 'PO1 has three chevrons. A Chief (E-7) adds a rocker.');
  Q('ranks', 'What does CPO stand for?', 'Chief Petty Officer', ['Chief Pay Officer', 'Company Petty Officer', 'Chief Personnel Officer'], 'E-7 is a Chief Petty Officer.');
  Q('ranks', 'Who is the senior enlisted member of the whole Coast Guard?', 'Master Chief Petty Officer of the Coast Guard (MCPOCG)', ['Command Master Chief of Cape May', 'Vice Commandant', 'Chief Warrant Officer 4'], 'The MCPOCG advises the Commandant on enlisted matters.');
  Q('ranks', 'Which of these is an enlisted rate, not an officer rank?', 'Senior Chief Petty Officer', ['Ensign', 'Chief Warrant Officer 2', 'Commander'], 'Senior Chief Petty Officer is E-8.');

  /* ---- 11 General Orders ---- */
  Q('orders', 'How many General Orders of a Sentry are there?', '11', ['5', '10', '12'], 'There are eleven. Learn them word for word.');
  Q('orders', 'A sentry may quit his post only when:', 'Properly relieved', ['He is tired', 'His shift ends by the clock', 'Another recruit asks him to'], 'General Order 5.');
  Q('orders', 'Who may give a sentry orders to receive, obey and pass on (General Order 6)?', 'Commanding Officer, Command Duty Officer, Officer of the Deck, and Officers and Petty Officers of the Watch', ['Any officer', 'Any petty officer', 'Anyone standing on the quarterdeck'], 'Only those listed in General Order 6.');
  Q('orders', 'A sentry faces a situation not covered by his instructions. Whom does he call?', 'The Officer of the Deck', ['A nearby sailor', 'The Company Commander', 'Nobody; use own judgment'], 'General Order 9.');
  Q('orders', 'What should a sentry do if fire or disorder breaks out?', 'Give the alarm', ['Leave the post to help', 'Finish the patrol first', 'Wait to be told'], 'General Order 8: give the alarm in case of fire or disorder.');
  Q('orders', 'A sentry should talk to no one except:', 'In the line of duty', ['Friends', 'Other sentries', 'Visitors'], 'General Order 7.');

  /* ---- Phonetic Alphabet & Military Time ---- */
  Q('comms', 'How is midnight written in military time?', '0000', ['1200', '0100', '2000'], 'Midnight is 0000 and noon is 1200.');
  Q('comms', 'How is noon written in military time?', '1200', ['0000', '0012', '2400'], 'Noon is 1200; 1 p.m. is 1300.');
  Q('comms', 'Military time hours run from:', '00 to 23', ['01 to 24', '1 to 12', '0 to 25'], 'Hours run from 00 to 23. Minutes work the same as regular time.');
  Q('comms', 'True or false: AM and PM are not used in military time.', 'True', ['False'], 'The 24-hour clock does not need AM or PM.');
  Q('comms', '"Zulu time" refers to:', 'Coordinated Universal Time (UTC)', ['Eastern Standard Time', 'Local ship\'s time', 'Pacific Standard Time'], 'Zulu is the phonetic word for Z, the UTC time zone.');

  /* ---- Nautical Terms & Ship Life ---- */
  Q('nautical', 'What is a Coast Guard "cutter"?', 'A vessel 65 feet or longer with crew quarters', ['Any small boat', 'A type of sword', 'Only a ship that carries a helicopter'], 'Smaller vessels are called boats.');
  Q('nautical', 'Returning from sea, which side should red buoys be on?', 'Right (starboard)', ['Left (port)', 'Dead ahead', 'Behind you'], '"Red, Right, Returning."');
  Q('nautical', 'What color is the navigation light on a vessel\'s starboard side?', 'Green', ['Red', 'White', 'Yellow'], 'Red on port, green on starboard.');
  Q('nautical', 'What color is the navigation light on a vessel\'s port side?', 'Red', ['Green', 'White', 'Blue'], 'Red on port, green on starboard.');
  Q('nautical', 'Which watch runs from 0000 to 0400?', 'Midwatch', ['Morning watch', 'Forenoon watch', 'Afternoon watch'], 'Midwatch 0000 to 0400, morning watch 0400 to 0800, forenoon 0800 to 1200, afternoon 1200 to 1600.');
  Q('nautical', 'Which watch runs from 0400 to 0800?', 'Morning watch', ['Midwatch', 'Forenoon watch', 'Afternoon watch'], 'Morning watch is 0400 to 0800.');
  Q('nautical', 'The two short watches between 1600 and 2000 are called:', 'Dog watches', ['Mid watches', 'Quarter watches', 'Lookout watches'], 'Two two-hour dog watches split the evening.');
  Q('nautical', 'Eight bells marks:', 'The end of a four-hour watch', ['Midnight only', 'The start of a watch', 'A fire alarm'], 'One bell is added every half hour; eight bells ends the watch.');
  Q('nautical', 'A rope that is in use aboard ship is called a:', 'Line', ['Cord', 'Strap', 'Cable'], 'Aboard ship, rope in use is a line.');
  Q('nautical', 'A "bight" in a line is:', 'A loop or slack curve in the line', ['The end of the line', 'A kind of knot', 'A kind of anchor'], 'Bight, standing part and bitter end are the parts of a line.');
  Q('nautical', 'The square (reef) knot is used to:', 'Join two lines of similar size', ['Make a loop that never slips', 'Tie a line to a post', 'Anchor a boat'], 'Right over left, then left over right.');
  Q('nautical', 'The bowline is best for:', 'Making a fixed loop that will not slip', ['Joining two lines', 'Stopping a line from running out', 'Shortening a line'], 'A bowline makes a strong fixed loop.');
  Q('nautical', 'A clove hitch is commonly used to:', 'Secure a line to a post or piling', ['Join two ropes', 'Make a fixed loop', 'Splice a line'], 'Clove hitch = line to a post.');
  Q('nautical', 'A "knot" is a unit of speed equal to:', 'One nautical mile per hour', ['One mile per hour', 'One mile per minute', 'One kilometer per hour'], 'A nautical mile is about 1.15 statute miles.');
  Q('nautical', 'One nautical mile is about:', '6,076 feet', ['5,280 feet', '3,000 feet', '10,000 feet'], '6,076 feet (1,852 meters). A statute mile is 5,280 feet.');
  Q('nautical', 'A fathom measures:', 'Six feet of depth', ['One foot', 'Ten feet', 'One yard'], 'One fathom = 6 feet.');
  Q('nautical', 'A vessel\'s "draft" is:', 'How deep the hull sits below the waterline', ['How wide it is', 'How tall it is above water', 'How fast it goes'], 'Draft is the depth of the hull below the waterline.');
  Q('nautical', 'A ship\'s "beam" is its:', 'Width', ['Length', 'Height', 'Speed'], 'Beam = width at the widest point.');
  Q('nautical', 'Which end of the ship is the stern?', 'The rear', ['The front', 'The left side', 'The right side'], 'Bow = front, stern = rear.');

  /* ---- Swim & Fitness Test ---- */
  Q('swimfit', 'For the swim qualification, you jump into the pool from what height?', 'A six-foot platform', ['A three-foot platform', 'A ten-foot platform', 'Poolside'], 'Jump from a six-foot platform, swim 100 meters, then tread water for five minutes.');
  Q('swimfit', 'How far must you swim in the swim qualification?', '100 meters', ['25 meters', '50 meters', '200 meters'], '100 meters after the jump.');
  Q('swimfit', 'How long must you tread water?', 'Five minutes', ['One minute', 'Two minutes', 'Ten minutes'], 'Five minutes of treading water.');
  Q('swimfit', 'True or false: you may swim on your back during the swim qualification.', 'False', ['True'], 'Backstroke (swimming on your back) is not permitted.');
  Q('swimfit', 'In this plan, how many push-ups in 60 seconds is the goal?', '15', ['10', '20', '29'], '15 is the target here (women under 30). 29 is the men\'s standard.');
  Q('swimfit', 'In this plan, what forearm plank time is the goal?', '1:09', ['0:45', '1:30', '2:00'], '1 minute 9 seconds.');
  Q('swimfit', 'In this plan, what is the goal time for the 1.5-mile run?', 'Under 15:05', ['Under 12:51', 'Under 16:30', 'Under 18:00'], '15:05 for the plan; 12:51 is the men\'s standard.');
  Q('swimfit', 'How many laps of a quarter-mile track make 1.5 miles?', '6', ['3', '4', '12'], '1.5 miles = 6 quarter-mile laps.');
  Q('swimfit', 'If an exercise hurts your ankle, what should you do?', 'Stop and check with your PT or doctor', ['Push through it', 'Ignore it until tomorrow', 'Add more weight'], 'Pain is a stop sign. Protect the ankle so you can ship on time.');

  /* ---- First Aid & CPR ---- */
  Q('firstaid', 'How fast should chest compressions be on an adult?', '100 to 120 per minute', ['60 to 80 per minute', '80 to 100 per minute', '140 to 160 per minute'], 'Think of the beat of "Stayin\' Alive."');
  Q('firstaid', 'How deep should adult chest compressions be?', 'At least 2 inches (5 cm)', ['About half an inch', 'About 1 inch', 'About 4 inches'], 'At least 2 inches, letting the chest fully rise between compressions.');
  Q('firstaid', 'What is the one-rescuer adult CPR ratio?', '30 compressions to 2 breaths', ['15 to 2', '5 to 1', '60 to 4'], '30:2.');
  Q('firstaid', 'Where do chest compressions go?', 'Center of the chest, on the lower half of the breastbone', ['Left side of the chest', 'Upper abdomen', 'Near the collarbone'], 'Hands center of the chest, lower half of the breastbone.');
  Q('firstaid', 'You find someone collapsed. What is the first step?', 'Make sure the scene is safe', ['Start rescue breaths', 'Move them right away', 'Give them water'], 'Scene safety first, then check responsiveness.');
  Q('firstaid', 'An adult is unresponsive and not breathing normally. What next?', 'Call 911 and start CPR; use an AED when it arrives', ['Wait five minutes', 'Give water', 'Prop their head on a pillow'], 'Call for help, push hard and fast, and use an AED.');
  Q('firstaid', 'When should an AED be used?', 'As soon as it arrives; turn it on and follow the prompts', ['Only by doctors', 'Only after 10 minutes of CPR', 'Only if a pulse is felt'], 'AEDs talk you through every step.');
  Q('firstaid', 'What is the first action for severe bleeding?', 'Apply firm, direct pressure', ['Remove any object and rinse', 'Elevate and wait', 'Apply ice only'], 'Direct pressure with a clean cloth or dressing.');
  Q('firstaid', 'Life-threatening bleeding from a limb will not stop with pressure. What next?', 'Apply a tourniquet above the wound', ['Keep rinsing with water', 'Wrap loosely', 'Wait'], 'A tourniquet placed between the wound and the heart.');
  Q('firstaid', 'What is first aid for a minor burn?', 'Cool it under running water', ['Apply butter', 'Apply ice directly', 'Pop the blisters'], 'Cool running water, never ice or butter.');
  Q('firstaid', 'A conscious adult is choking and cannot cough or speak. What do you do?', 'Abdominal thrusts (Heimlich maneuver)', ['Give water', 'Slap them on the head', 'Lay them flat and wait'], 'Abdominal thrusts until the object comes out or they pass out.');
  Q('firstaid', 'What does RICE stand for in treating a sprain?', 'Rest, Ice, Compression, Elevation', ['Run, Ice, Cool, Exercise', 'Rest, Inhale, Cool, Elevate', 'Relax, Ice, Cut, Elevate'], 'Useful for ankles.');
  Q('firstaid', 'What does FAST stand for when spotting a stroke?', 'Face drooping, Arm weakness, Speech difficulty, Time to call 911', ['Fever, Aches, Sweating, Tiredness', 'Faint, Ache, Sick, Tingling', 'Face, Arm, Skin, Temperature'], 'Time matters; call 911 immediately.');
  Q('firstaid', 'Which is a sign of heat stroke, a life-threatening emergency?', 'Confusion with a very high body temperature', ['Shivering with blue lips', 'Mild thirst only', 'Itchy skin'], 'Call 911 and cool the person fast.');
  Q('firstaid', 'How should you treat a nosebleed?', 'Lean forward and pinch the soft part of the nose', ['Tilt the head back', 'Lie flat', 'Plug deeply with tissue'], 'Lean forward and pinch for about ten minutes.');
  Q('firstaid', 'What is the first aid for shock?', 'Lay them down, keep them warm, call 911', ['Give a large drink', 'Make them walk it off', 'Sit them up and shake them'], 'Signs include pale, cool, clammy skin and a fast pulse.');
  Q('firstaid', 'What is the first step for mild hypothermia?', 'Get out of the wind and wet; remove wet clothes and wrap in dry layers', ['Rub the skin with snow', 'Give alcohol', 'Put them in a very hot bath'], 'Warm gradually.');

  /* ---- UCMJ & Conduct ---- */
  Q('ucmj', 'What does UCMJ stand for?', 'Uniform Code of Military Justice', ['United Code of Military Justice', 'Uniform Command of Military Judges', 'Universal Code for Military Jobs'], 'The UCMJ is the law that governs the armed forces.');
  Q('ucmj', 'Who does the UCMJ apply to?', 'All members of the armed forces, including the Coast Guard', ['Only officers', 'Only people in combat', 'Only the Navy'], 'It applies to everyone in uniform.');
  Q('ucmj', 'Under UCMJ Article 15, what is nonjudicial punishment commonly called?', 'Captain\'s Mast', ['Court-martial', 'Summary hearing', 'Board of inquiry'], 'Article 15 lets a commanding officer punish minor offenses without a court-martial.');
  Q('ucmj', 'UCMJ Article 86 covers:', 'Absence without leave (AWOL)', ['Disobeying an order', 'Theft', 'Disrespect toward an officer'], 'Article 86: absence without leave.');
  Q('ucmj', 'UCMJ Article 92 covers:', 'Failure to obey an order or regulation', ['Absence without leave', 'Desertion', 'Theft'], 'Article 92: failure to obey an order or regulation.');
  Q('ucmj', 'How many types of court-martial are there?', 'Three: summary, special, general', ['Two', 'Four', 'Five'], 'Summary, special and general.');
  Q('ucmj', 'A service member must obey:', 'Any lawful order', ['Any order at all', 'Only written orders', 'Only orders from officers'], 'An order to break the law is unlawful and must not be obeyed.');
  Q('ucmj', 'You believe you are being treated unfairly or harassed. What should you do?', 'Report it through the chain of command, or to the chaplain or Equal Opportunity Advisor', ['Stay quiet', 'Tell only other recruits', 'Retaliate'], 'Speak up; there are people whose job is to help.');

  /* ---- ASVAB Math ---- */
  Q('math', 'What is the area of a circle with radius r?', 'πr²', ['2πr', 'πd²', 'πr'], '2πr is the circumference.');
  Q('math', 'A right triangle has legs of 6 and 8. How long is the hypotenuse?', '10', ['12', '14', '9'], 'a² + b² = c², so 36 + 64 = 100 and c = 10.');
  Q('math', 'What is 2 + 3 × 4?', '14', ['20', '24', '9'], 'Multiply before adding.');
  Q('math', 'What is 0.75 as a fraction?', '3/4', ['1/2', '2/3', '4/5'], '0.75 = 75/100 = 3/4.');
  Q('math', 'Which is greater: 5/8 or 2/3?', '2/3', ['5/8', 'They are equal', 'Cannot tell'], '5/8 = 0.625 and 2/3 ≈ 0.667.');
  Q('math', 'What is the square root of 144?', '12', ['11', '14', '72'], '12 × 12 = 144.');
  Q('math', 'What is the slope of the line through (0, 0) and (2, 6)?', '3', ['2', '6', '1/3'], 'Rise over run: 6 ÷ 2 = 3.');
  Q('math', 'What is x² · x³?', 'x⁵', ['x⁶', 'x', '2x⁵'], 'Add the exponents when multiplying.');

  /* ---- ASVAB Words & Reading ---- */
  [
    ['abundant', 'plentiful', ['scarce', 'tiny', 'costly']],
    ['alleviate', 'ease', ['worsen', 'ignore', 'measure']],
    ['candid', 'honest', ['secret', 'polite', 'careless']],
    ['cease', 'stop', ['begin', 'continue', 'repeat']],
    ['diligent', 'hardworking', ['lazy', 'careless', 'quiet']],
    ['hinder', 'obstruct', ['help', 'finish', 'notice']],
    ['imminent', 'about to happen', ['long past', 'unlikely', 'harmless']],
    ['meticulous', 'very careful', ['messy', 'quick', 'loud']],
    ['novice', 'beginner', ['expert', 'leader', 'stranger']],
    ['obsolete', 'outdated', ['brand new', 'valuable', 'fragile']],
    ['prudent', 'wise and careful', ['reckless', 'generous', 'angry']],
    ['reluctant', 'unwilling', ['eager', 'tired', 'certain']],
    ['scarce', 'in short supply', ['plentiful', 'heavy', 'loud']],
    ['tedious', 'boring and tiresome', ['exciting', 'dangerous', 'brief']],
    ['vigilant', 'watchful', ['sleepy', 'hasty', 'friendly']],
    ['benevolent', 'kind', ['cruel', 'wealthy', 'shy']],
    ['frugal', 'thrifty', ['wasteful', 'generous', 'hungry']],
    ['ambiguous', 'unclear', ['obvious', 'harmful', 'final']],
    ['enhance', 'improve', ['reduce', 'hide', 'copy']],
    ['adhere', 'stick', ['separate', 'forget', 'argue']],
    ['deter', 'discourage', ['encourage', 'reward', 'announce']],
    ['resilient', 'able to recover', ['fragile', 'wasteful', 'noisy']]
  ].forEach(function (w) {
    Q('words', w[0].toUpperCase() + ' most nearly means:', w[1], w[2], '"' + w[0] + '" means ' + w[1] + '.');
  });
  Q('words', 'What is the main idea of the passage?', 'Cutter crews must be able to handle problems without outside help', ['Cutters never leave port', 'Engines are the hardest part of the job', 'Crews avoid medical training'], 'Help can be days away, so crews train to be self-reliant.', 'Coast Guard cutters often work far from shore. Because help can be days away, crews train to fix engines, fight fires, and give medical care on their own.');
  Q('words', 'The passage suggests that:', 'Regular checks keep small problems from becoming big ones', ['Gear never fails', 'Checks are a waste of time', 'Only large faults matter'], 'Small checks catch small faults before they grow.', 'A sailor who checks her gear before every watch rarely finds a problem at the worst possible moment. Small checks catch small faults before they grow.');
  Q('words', 'Why must boaters near shore know the tide times?', 'A boat can run aground when the water gets low', ['Tides make boats go faster', 'High tide is always dangerous', 'Tides only happen at night'], 'A boat that floats at high tide can run aground a few hours later.', 'Tides rise and fall about twice a day. Boaters near shore must know when the water will be low, because a boat that floats easily at high tide can run aground a few hours later.');
  Q('words', 'Which word best describes the recruit?', 'Selfless', ['Jealous', 'Careless', 'Stubborn'], 'She put a teammate ahead of her own rest.', 'Though the recruit was exhausted after the long run, she stayed to help a teammate finish. Her company commander noted it in the evening report.');

  /* ---- ASVAB Science & Mechanical ---- */
  Q('mech', 'Which part of a cell produces most of its energy?', 'Mitochondria', ['Nucleus', 'Ribosome', 'Cell wall'], 'Mitochondria are the "powerhouse" of the cell.');
  Q('mech', 'What is the chemical symbol for sodium?', 'Na', ['So', 'S', 'Sd'], 'Na comes from the Latin natrium.');
  Q('mech', 'At sea level, water boils at:', '212°F (100°C)', ['180°F', '100°F', '250°F'], '212°F or 100°C.');
  Q('mech', 'What is the unit of electrical resistance?', 'Ohm', ['Volt', 'Ampere', 'Watt'], 'Resistance is measured in ohms.');
  Q('mech', 'What is the unit of electric current?', 'Ampere', ['Ohm', 'Watt', 'Volt'], 'Current is measured in amperes (amps).');
  Q('mech', 'Force equals mass times what?', 'Acceleration', ['Velocity', 'Time', 'Distance'], 'F = ma.');
  Q('mech', 'In photosynthesis, plants take in ___ and release ___.', 'Carbon dioxide; oxygen', ['Oxygen; carbon dioxide', 'Nitrogen; helium', 'Hydrogen; oxygen'], 'They take in CO₂ and give off O₂.');
  Q('mech', 'A pH of 7 is:', 'Neutral', ['Acidic', 'Basic', 'Toxic'], 'Below 7 is acidic, above 7 is basic.');
  Q('mech', 'Which planet is closest to the Sun?', 'Mercury', ['Venus', 'Mars', 'Earth'], 'Mercury.');
  Q('mech', 'Which law says every action has an equal and opposite reaction?', 'Newton\'s third law', ['Newton\'s first law', 'Newton\'s second law', 'Ohm\'s law'], 'Newton\'s third law of motion.');
  Q('mech', 'Two gears that mesh together turn:', 'In opposite directions', ['In the same direction', 'Not at all', 'At exactly the same speed always'], 'Meshed gears reverse each other\'s direction.');
  Q('mech', 'A small gear drives a larger gear. The larger gear turns:', 'More slowly', ['Faster', 'At the same speed', 'Backward only'], 'The larger gear has more teeth, so it turns slower with more torque.');
  Q('mech', 'A single fixed pulley changes:', 'The direction of the force', ['The amount of force needed', 'The weight of the load', 'Nothing'], 'A fixed pulley only redirects the pull.');
  Q('mech', 'A movable pulley supported by two rope segments reduces the force needed to about:', 'Half', ['One-third', 'Double', 'The same'], 'Two supporting segments share the load.');
  Q('mech', 'A longer ramp raising a load to the same height needs:', 'Less force over a longer distance', ['More force', 'The same force', 'No force'], 'Longer ramp, gentler slope, less force.');
  Q('mech', 'Moving a lever\'s pivot (fulcrum) closer to the load makes lifting:', 'Easier', ['Harder', 'Impossible', 'No different'], 'A longer effort arm gives more leverage.');
  Q('mech', 'In a series circuit, if one bulb burns out:', 'All the bulbs go out', ['The others stay lit', 'The others get brighter', 'Nothing changes'], 'The circuit is broken.');
  Q('mech', 'Which material is a good electrical conductor?', 'Copper', ['Rubber', 'Glass', 'Wood'], 'Metals like copper conduct electricity well.');
  Q('mech', 'Hydraulic systems work by:', 'Transmitting pressure through a liquid', ['Compressing a gas', 'Using gears', 'Using springs'], 'Pascal\'s principle.');
  Q('mech', 'Density equals:', 'Mass divided by volume', ['Volume divided by mass', 'Mass times volume', 'Weight times height'], 'ρ = m / V.');
  Q('mech', 'Which of these is a unit of power?', 'Watt', ['Joule', 'Newton', 'Pascal'], 'A watt is one joule per second.');

  /* =====================================================================
     GENERATORS (fresh numbers every time)
     G(topic, id, copies, fn)   fn returns {q, a, w:[...], e}
     ===================================================================== */
  function G(topic, id, copies, fn) {
    var k;
    for (k = 1; k <= copies; k++) ITEMS.push({ kind: 'g', topic: topic, sid: 'g:' + id, slot: k, make: fn });
  }

  /* --- Military time --- */
  function hhmm(h, m) { return pad((h + 24) % 24, 2) + pad(m, 2); }
  function to24(h, m, ap) { var hh = h % 12; if (ap === 'PM') hh += 12; return hhmm(hh, m); }
  function to12(h24, m) { var ap = h24 >= 12 ? 'PM' : 'AM', h = h24 % 12; if (h === 0) h = 12; return h + ':' + pad(m, 2) + ' ' + ap; }
  G('comms', 'miltime', 3, function () {
    var mode = rint(1, 3), h, m, ap, c, w;
    if (mode === 1) {
      h = rint(1, 12); m = pick([0, 5, 10, 15, 20, 30, 40, 45, 50, 55]); ap = pick(['AM', 'PM']);
      c = to24(h, m, ap);
      w = uniqWrong(c, [to24(h, m, ap === 'AM' ? 'PM' : 'AM'), hhmm(h, m), hhmm(h + 1, m), hhmm((h % 12) + 11, m), hhmm(h + 12 + (ap === 'AM' ? 12 : 0), m)], 3);
      return { q: 'What is ' + h + ':' + pad(m, 2) + ' ' + ap + ' in military time?', a: c, w: fill(w, c), e: ap === 'AM' ? 'AM hours stay the same (12 AM becomes 00).' : 'PM hours add 12 (12 PM stays 12).' };
    }
    if (mode === 2) {
      var h24 = rint(0, 23); m = pick([0, 10, 15, 20, 30, 45, 55]);
      c = to12(h24, m);
      var h12 = h24 % 12 || 12;
      w = uniqWrong(c, [to12((h24 + 12) % 24, m), to12((h24 + 1) % 24, m), to12((h24 + 23) % 24, m), to12((h24 + 13) % 24, m), to12((h24 + 11) % 24, m)], 3);
      return { q: 'What time is ' + hhmm(h24, m) + ' on a regular 12-hour clock?', a: c, w: fill(w, c), e: hhmm(h24, m) + ' is ' + c + '. Subtract 12 from hours after 1200.' };
    }
    var start = pick([0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22]), len = pick([4, 6, 8, 12]);
    var end = (start + len) % 24;
    return { q: 'A duty section musters at ' + hhmm(start, 0) + ' and secures at ' + hhmm(end, 0) + '. How many hours is that?', a: len + ' hours', w: fill(uniqWrong(len + ' hours', [(len + 2) + ' hours', (len - 2) + ' hours', (len + 4) + ' hours', (24 - len) + ' hours', (len * 2) + ' hours'], 3), len + ' hours'), e: 'Count forward on the 24-hour clock, rolling past 2400 back to 0000 if needed.' };
  });
  function fill(w, c) { var extra = 1; while (w.length < 3) { w.push(String(parseInt(c, 10) + extra * 7) + (isNaN(parseInt(c, 10)) ? '?' : '')); extra++; } return w; }

  /* --- Phonetic alphabet --- */
  var PH = { A: 'Alpha', B: 'Bravo', C: 'Charlie', D: 'Delta', E: 'Echo', F: 'Foxtrot', G: 'Golf', H: 'Hotel', I: 'India', J: 'Juliett', K: 'Kilo', L: 'Lima', M: 'Mike', N: 'November', O: 'Oscar', P: 'Papa', Q: 'Quebec', R: 'Romeo', S: 'Sierra', T: 'Tango', U: 'Uniform', V: 'Victor', W: 'Whiskey', X: 'X-ray', Y: 'Yankee', Z: 'Zulu' };
  var LET = Object.keys(PH);
  function spell(word) { return word.split('').map(function (ch) { return PH[ch]; }).join(' '); }
  G('comms', 'phonetic', 3, function () {
    var mode = rint(1, 3), L, w, words, word, c, bad;
    if (mode === 1) {
      L = pick(LET);
      w = uniqWrong(PH[L], LET.map(function (x) { return PH[x]; }), 3);
      return { q: 'Which phonetic word stands for the letter ' + L + '?', a: PH[L], w: w, e: L + ' is ' + PH[L] + '.' };
    }
    if (mode === 2) {
      L = pick(LET);
      w = uniqWrong(L, LET, 3);
      return { q: 'The phonetic word "' + PH[L] + '" stands for which letter?', a: L, w: w, e: PH[L] + ' = ' + L + '.' };
    }
    words = ['CG', 'SAR', 'USCG', 'BOAT', 'DOCK', 'MAST', 'HULL', 'HELM', 'CAPE', 'MAY'];
    word = pick(words); c = spell(word);
    w = [];
    while (w.length < 3) {
      var i = rint(0, word.length - 1), repl = pick(LET), arr = word.split('');
      if (repl === arr[i]) continue;
      arr[i] = repl; bad = spell(arr.join(''));
      var parts = c.split(' '); parts[i] = PH[repl]; bad = parts.join(' ');
      if (bad !== c && w.indexOf(bad) < 0) w.push(bad);
    }
    return { q: 'How do you spell "' + word + '" using the phonetic alphabet?', a: c, w: w, e: word.split('').map(function (ch) { return ch + ' = ' + PH[ch]; }).join(', ') + '.' };
  });

  /* --- Ship's bells --- */
  G('nautical', 'bells', 2, function () {
    var m, t, bells, c, label;
    do { m = rint(0, 47) * 30; } while (m >= 990 && m <= 1170);
    bells = (m % 240) / 30; if (bells === 0) bells = 8;
    t = hhmm(Math.floor(m / 60), m % 60);
    c = bells + (bells === 1 ? ' bell' : ' bells');
    var w = uniqWrong(c, [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) { return n + (n === 1 ? ' bell' : ' bells'); }), 3);
    return { q: 'On a ship, how many bells are struck at ' + t + '? (Ignore the dog watches.)', a: c, w: w, e: 'Watches are four hours long. One bell rings at 30 minutes into the watch, and one more every half hour, ending with eight bells at 0000, 0400, 0800, 1200, 1600 and 2000.' };
  });

  /* --- Nautical vocabulary --- */
  var NV = [['Port', 'The left side of the ship (facing forward)'], ['Starboard', 'The right side of the ship (facing forward)'], ['Bow', 'The front of the ship'], ['Stern', 'The rear of the ship'], ['Deck', 'Floor'], ['Bulkhead', 'Wall'], ['Overhead', 'Ceiling'], ['Ladder', 'Stairs'], ['Head', 'Bathroom'], ['Galley', 'Kitchen'], ['Rack', 'Bed'], ['Swab', 'Mop'], ['Compartment', 'Room'], ['Topside', 'Upstairs, on deck'], ['Below', 'Downstairs'], ['Colors', 'The flag'], ['Scuttlebutt', 'Drinking fountain, or rumor'], ['Belay', 'Stop, cancel that order'], ['Avast', 'Stop'], ['Underway', 'Not tied to a pier or at anchor'], ['Muster', 'To assemble the crew'], ['Watch', 'A period of duty, usually four hours'], ['Aft', 'Toward the rear of the ship'], ['Forward', 'Toward the bow'], ['Secure', 'To lock up, or to finish']];
  G('nautical', 'navvocab', 4, function () {
    var e = pick(NV), others = NV.filter(function (x) { return x !== e; });
    if (Math.random() < 0.5) return { q: 'In Coast Guard talk, what is "' + e[0].toLowerCase() + '"?', a: e[1], w: uniqWrong(e[1], others.map(function (x) { return x[1]; }), 3), e: e[0] + ' = ' + e[1].toLowerCase() + '.' };
    return { q: 'Which nautical word means "' + e[1].toLowerCase() + '"?', a: e[0], w: uniqWrong(e[0], others.map(function (x) { return x[0]; }), 3), e: e[0] + ' = ' + e[1].toLowerCase() + '.' };
  });

  /* --- Ranks & rates --- */
  var ENL = [['E-1', 'Seaman Recruit', 'SR'], ['E-2', 'Seaman Apprentice', 'SA'], ['E-3', 'Seaman', 'SN'], ['E-4', 'Petty Officer Third Class', 'PO3'], ['E-5', 'Petty Officer Second Class', 'PO2'], ['E-6', 'Petty Officer First Class', 'PO1'], ['E-7', 'Chief Petty Officer', 'CPO'], ['E-8', 'Senior Chief Petty Officer', 'SCPO'], ['E-9', 'Master Chief Petty Officer', 'MCPO']];
  var OFF = [['O-1', 'Ensign', 'ENS'], ['O-2', 'Lieutenant Junior Grade', 'LTJG'], ['O-3', 'Lieutenant', 'LT'], ['O-4', 'Lieutenant Commander', 'LCDR'], ['O-5', 'Commander', 'CDR'], ['O-6', 'Captain', 'CAPT'], ['O-7', 'Rear Admiral (Lower Half)', 'RDML'], ['O-8', 'Rear Admiral', 'RADM'], ['O-9', 'Vice Admiral', 'VADM'], ['O-10', 'Admiral', 'ADM']];
  G('ranks', 'ranks', 4, function () {
    var fam = pick([ENL, OFF]), r = pick(fam), mode = rint(1, 3), kind = fam === ENL ? 'enlisted' : 'officer';
    var e = r[0] + ' = ' + r[1] + ' (' + r[2] + ').';
    if (mode === 1) return { q: 'What is the title for pay grade ' + r[0] + '?', a: r[1], w: uniqWrong(r[1], fam.map(function (x) { return x[1]; }), 3), e: e };
    if (mode === 2) return { q: 'Which pay grade is a ' + r[1] + '?', a: r[0], w: uniqWrong(r[0], fam.map(function (x) { return x[0]; }), 3), e: e };
    return { q: 'What does the abbreviation ' + r[2] + ' stand for?', a: r[1], w: uniqWrong(r[1], fam.map(function (x) { return x[1]; }), 3), e: e };
  });

  /* --- General Orders --- */
  var GO = ['To take charge of this post and all government property in view.', 'To walk my post in a military manner, keeping always on the alert and observing everything that takes place within sight or hearing.', 'To report all violations of orders I am instructed to enforce.', 'To repeat all calls from posts more distant from the guardhouse than my own.', 'To quit my post only when properly relieved.', 'To receive, obey, and pass on to the sentry who relieves me all orders from the Commanding Officer, Command Duty Officer, Officer of the Deck, and Officers and Petty Officers of the Watch only.', 'To talk to no one except in the line of duty.', 'To give the alarm in case of fire or disorder.', 'To call the Officer of the Deck in any case not covered by instructions.', 'To salute all officers and all colors and standards not cased.', 'To be especially watchful at night and during the time for challenging, to challenge all persons on or near my post, and to allow no one to pass without proper authority.'];
  G('orders', 'gorders', 4, function () {
    var n = rint(0, 10), nums = GO.map(function (_, i) { return 'General Order ' + (i + 1); });
    if (Math.random() < 0.5) return { q: 'Which General Order is this? "' + GO[n] + '"', a: nums[n], w: uniqWrong(nums[n], nums, 3), e: nums[n] + ': ' + GO[n] };
    var near = GO.filter(function (_, i) { return i !== n; });
    return { q: 'What is General Order ' + (n + 1) + '?', a: GO[n], w: uniqWrong(GO[n], near, 3), e: 'General Order ' + (n + 1) + ': ' + GO[n] };
  });

  /* --- Cape May chain of command --- */
  var CH = ['President (Commander-in-Chief)', 'Secretary of Homeland Security', 'Commandant of the Coast Guard', 'Force Readiness Command', 'Commanding Officer (CO)', 'Executive Officer (XO)', 'Training Officer (TO)', 'Regimental Officer (RO)', 'Battalion Officer (BO)', 'Battalion Commander (BC)', 'Section Commander (SC)', 'Lead Company Commander (LCC)', 'Company Commander (CC)'];
  G('command', 'chain', 3, function () {
    var up = Math.random() < 0.5, i = up ? rint(1, CH.length - 1) : rint(0, CH.length - 2), c = CH[up ? i - 1 : i + 1];
    var near = CH.filter(function (x, j) { return x !== c && x !== CH[i] && Math.abs(j - i) <= 3; });
    var w = uniqWrong(c, near.concat(CH), 3);
    return { q: 'Who is directly ' + (up ? 'above' : 'below') + ' the ' + CH[i] + ' in the chain of command?', a: c, w: w, e: 'Top to bottom: ' + CH.join(', ') + '.' };
  });

  /* --- Run pace --- */
  G('swimfit', 'pace', 3, function () {
    var mode = rint(1, 3), total, pace, c, w, t;
    if (mode === 1) {
      total = pick([870, 900, 905, 930, 960, 990]);
      pace = Math.round(total / 1.5); c = mmss(pace);
      w = uniqWrong(c, numWrongs(pace, [-30, -15, 15, 30, 45]).map(mmss), 3);
      return { q: 'To run 1.5 miles in ' + mmss(total) + ', about what pace per mile do you need?', a: c, w: w, e: mmss(total) + ' = ' + total + ' seconds. Divide by 1.5 miles to get about ' + c + ' per mile.' };
    }
    if (mode === 2) {
      pace = pick([570, 590, 600, 610, 620, 630]); total = pace * 1.5; c = mmss(total);
      w = uniqWrong(c, numWrongs(total, [-45, -30, -15, 15, 30, 45]).map(mmss), 3);
      return { q: 'You hold ' + mmss(pace) + ' per mile. What is your 1.5-mile time?', a: c, w: w, e: mmss(pace) + ' × 1.5 = ' + c + '.' };
    }
    total = pick([840, 870, 900, 930, 990]); t = total / 6; c = mmss(t);
    w = uniqWrong(c, numWrongs(t, [-15, -10, -5, 5, 10, 15]).map(mmss), 3);
    return { q: 'You want to run 1.5 miles in ' + mmss(total) + ' on a quarter-mile track. What average time per lap is that?', a: c, w: w, e: '1.5 miles is 6 laps. ' + mmss(total) + ' ÷ 6 = ' + c + ' per lap.' };
  });

  /* --- ASVAB math --- */
  G('math', 'rtd', 2, function () {
    var s = pick([6, 8, 10, 12, 15, 20, 24]), t = rint(2, 6), d = s * t, mode = rint(1, 2);
    if (mode === 1) return { q: 'A cutter steams at ' + s + ' knots for ' + t + ' hours. How many nautical miles does it travel?', a: String(d), w: uniqWrong(String(d), numWrongs(d, [s, -s, 2 * s, -2 * s, t, 10]).map(String), 3), e: 'Distance = speed × time = ' + s + ' × ' + t + ' = ' + d + '. A knot is one nautical mile per hour.' };
    return { q: 'A boat travels ' + d + ' nautical miles at ' + s + ' knots. How many hours does the trip take?', a: String(t), w: uniqWrong(String(t), numWrongs(t, [1, -1, 2, -2, 3]).map(String), 3), e: 'Time = distance ÷ speed = ' + d + ' ÷ ' + s + ' = ' + t + '.' };
  });
  G('math', 'percent', 2, function () {
    var mode = rint(1, 2), p, n, c, price, off;
    if (mode === 1) {
      p = pick([10, 15, 20, 25, 30, 40, 50, 60, 75]); n = pick([40, 60, 80, 120, 160, 200, 240, 400]); c = p * n / 100;
      return { q: 'What is ' + p + '% of ' + n + '?', a: String(c), w: uniqWrong(String(c), numWrongs(c, [p / 5, -p / 5, 10, -10, n / 10, n / 20]).filter(function (v) { return v === Math.floor(v); }).map(String), 3), e: p + '% of ' + n + ' = ' + n + ' × ' + p / 100 + ' = ' + c + '.' };
    }
    price = pick([40, 60, 80, 120, 200]); off = pick([10, 20, 25, 50]); c = price * (100 - off) / 100;
    return { q: 'A uniform item costs $' + price + ' and is ' + off + '% off. What is the sale price?', a: '$' + c, w: uniqWrong('$' + c, [price * off / 100, price + price * off / 100, price - off, price - 5, price - 2 * off].filter(function (v) { return v > 0; }).map(function (v) { return '$' + v; }), 3), e: 'Discount = ' + price + ' × ' + off / 100 + ' = ' + price * off / 100 + '; ' + price + ' − ' + price * off / 100 + ' = ' + c + '.' };
  });
  G('math', 'avg', 1, function () {
    var n = rint(4, 5), xs = [], i, sum, c;
    do { xs = []; sum = 0; for (i = 0; i < n; i++) { xs.push(rint(60, 100)); sum += xs[i]; } } while (sum % n !== 0);
    c = sum / n;
    return { q: 'A recruit scores ' + xs.join(', ') + ' on ' + n + ' quizzes. What is the average?', a: String(c), w: uniqWrong(String(c), numWrongs(c, [-3, -2, 2, 3, 5]).map(String), 3), e: 'Sum = ' + sum + '; ' + sum + ' ÷ ' + n + ' = ' + c + '.' };
  });
  G('math', 'linear', 2, function () {
    var x = rint(2, 12), a = rint(2, 9), b = rint(1, 20), neg = Math.random() < 0.5, c = neg ? a * x - b : a * x + b;
    var ans = String(x);
    return { q: 'Solve for x: ' + a + 'x ' + (neg ? '−' : '+') + ' ' + b + ' = ' + c, a: ans, w: uniqWrong(ans, numWrongs(x, [-2, -1, 1, 2, 3]).concat([(neg ? c - b : c + b) / a]).filter(function (v) { return v > 0 && v !== x; }).map(String), 3), e: 'Undo the ' + (neg ? 'subtraction' : 'addition') + ', then divide by ' + a + ': x = ' + x + '.' };
  });
  G('math', 'fraction', 1, function () {
    var a = rint(1, 3), b = pick([2, 3, 4, 5, 6, 8]), c = rint(1, 3), d = pick([2, 3, 4, 5, 6, 8]), n, m, g, ans;
    n = a * d + c * b; m = b * d; g = gcd(n, m); n /= g; m /= g;
    ans = n + '/' + m;
    return { q: 'What is ' + a + '/' + b + ' + ' + c + '/' + d + '? (answer as a fraction)', a: ans, w: uniqWrong(ans, [(a + c) + '/' + (b + d), (a + c) + '/' + (b * d), n + '/' + (m + 1), (n + 1) + '/' + m, (n + 2) + '/' + m], 3), e: 'Use a common denominator of ' + b * d + ': (' + a * d + ' + ' + c * b + ')/' + b * d + ' = ' + ans + ' in lowest terms.' };
  });
  G('math', 'area', 1, function () {
    var mode = rint(1, 3), l = rint(4, 20), w = rint(3, 15), b, h, r;
    if (mode === 1) return { q: 'A deck is ' + l + ' ft long and ' + w + ' ft wide. What is its area?', a: l * w + ' sq ft', w: uniqWrong(l * w + ' sq ft', [2 * (l + w) + ' sq ft', (l + w) + ' sq ft', l * w + l + ' sq ft', l * w - w + ' sq ft'], 3), e: 'Area = length × width = ' + l + ' × ' + w + ' = ' + l * w + '.' };
    if (mode === 2) return { q: 'A rectangle is ' + l + ' ft by ' + w + ' ft. What is its perimeter?', a: 2 * (l + w) + ' ft', w: uniqWrong(2 * (l + w) + ' ft', [l * w + ' ft', (l + w) + ' ft', 2 * l + w + ' ft', 2 * (l + w) + 2 + ' ft'], 3), e: 'Perimeter = 2 × (' + l + ' + ' + w + ') = ' + 2 * (l + w) + '.' };
    b = rint(3, 12) * 2; h = rint(3, 12);
    return { q: 'A triangular sail has a base of ' + b + ' ft and a height of ' + h + ' ft. What is its area?', a: b * h / 2 + ' sq ft', w: uniqWrong(b * h / 2 + ' sq ft', [b * h + ' sq ft', b + h + ' sq ft', b * h / 4 + ' sq ft', b * h / 2 + b + ' sq ft'], 3), e: 'Area = ½ × base × height = ½ × ' + b + ' × ' + h + ' = ' + b * h / 2 + '.' };
  });
  G('math', 'ratio', 1, function () {
    var a = rint(1, 5), b = rint(2, 7), k = rint(2, 9), total = (a + b) * k, big = Math.max(a, b) * k;
    if (a === b) b += 1, total = (a + b) * k, big = Math.max(a, b) * k;
    return { q: 'Two crews share ' + total + ' rations in the ratio ' + a + ':' + b + '. How many does the larger share get?', a: String(big), w: uniqWrong(String(big), numWrongs(big, [-k, k, 2 * k, -2 * k, 3]).map(String), 3), e: 'There are ' + (a + b) + ' parts; each part is ' + total + ' ÷ ' + (a + b) + ' = ' + k + '. The larger share is ' + Math.max(a, b) + ' × ' + k + ' = ' + big + '.' };
  });

  /* --- Mechanical / electrical --- */
  G('mech', 'ohm', 2, function () {
    var i = rint(1, 6), r = pick([2, 3, 4, 5, 6, 8, 10, 12]), v = i * r, mode = rint(1, 3);
    if (mode === 1) return { q: 'A circuit has ' + i + ' amps flowing through ' + r + ' ohms of resistance. What is the voltage?', a: v + ' volts', w: uniqWrong(v + ' volts', [r / i + ' volts', i + r + ' volts', v + r + ' volts', Math.max(1, v - i) + ' volts'].filter(function (x) { return x.indexOf('.') < 0; }), 3), e: 'V = I × R = ' + i + ' × ' + r + ' = ' + v + '.' };
    if (mode === 2) return { q: 'A ' + v + '-volt battery pushes current through ' + r + ' ohms. How many amps flow?', a: i + ' amps', w: uniqWrong(i + ' amps', numWrongs(i, [1, 2, -1, 3, r]).map(function (x) { return x + ' amps'; }), 3), e: 'I = V ÷ R = ' + v + ' ÷ ' + r + ' = ' + i + '.' };
    return { q: 'A ' + v + '-volt source drives ' + i + ' amps. What is the resistance?', a: r + ' ohms', w: uniqWrong(r + ' ohms', numWrongs(r, [1, 2, -1, 3, i]).map(function (x) { return x + ' ohms'; }), 3), e: 'R = V ÷ I = ' + v + ' ÷ ' + i + ' = ' + r + '.' };
  });
  G('mech', 'lever', 1, function () {
    var f2, d1, d2, f1, tries = 0;
    do { f1 = pick([10, 20, 30, 40, 50, 60]); d1 = rint(2, 8); d2 = rint(1, 6); tries++; } while ((f1 * d1) % d2 !== 0 && tries < 100);
    f2 = f1 * d1 / d2;
    return { q: 'A lever is balanced. A ' + f1 + ' lb weight sits ' + d1 + ' ft from the pivot. How heavy is the weight on the other side, ' + d2 + ' ft from the pivot?', a: f2 + ' lb', w: uniqWrong(f2 + ' lb', [f1 + ' lb', f1 + d1 - d2 + ' lb', f1 * d2 + ' lb', Math.round(f1 * d2 / d1) + ' lb', f2 + 10 + ' lb'], 3), e: 'Balanced levers: force × distance matches on both sides. ' + f1 + ' × ' + d1 + ' = ' + f1 * d1 + ', so the other side is ' + f1 * d1 + ' ÷ ' + d2 + ' = ' + f2 + ' lb.' };
  });

  root.CG_STUDY = { topics: TOPICS, items: ITEMS, shuffle: shuffle };
})(typeof window !== 'undefined' ? window : this);

# THE COASTIE GRIND

11-week Planet Fitness training plan for the Coast Guard fitness test (ship date Jan 12, 2027).
Static site (GitHub Pages) + Supabase for optional sync.

## Setup
1. Create a Supabase project, run `supabase/schema.sql` in the SQL editor.
2. Put the project URL and anon key in `config.js`.
3. Push to GitHub, then Settings > Pages > Deploy from branch `main` / root.
4. In Supabase Auth > URL Configuration, add the Pages URL as the Site URL.

Works without Supabase too (progress is kept in the browser).

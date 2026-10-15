-- Run this ONCE in the Supabase SQL editor (Dashboard → SQL Editor → New
-- query), same project already used for course_reviews and the schedule
-- tables. Needed before the Root Rush leaderboard will actually show or
-- accept scores — until this runs, the game still plays fine, it just
-- can't read/write the leaderboard (the client handles that failure
-- quietly rather than breaking the game).
--
-- Design: append-only. Every solved level inserts one row; "a player's
-- best for a level" is computed by the client from the full row history
-- (fewest steps, earliest timestamp on ties), not by updating rows in
-- place. That means:
--   - No edit_token / ownership column is needed (unlike course_reviews) —
--     there's nothing to let a visitor edit or delete later.
--   - The anon (publishable) key — the same one already used client-side
--     for course_reviews — can SELECT (read the board) and INSERT (submit
--     a score) directly from the browser, but has no UPDATE or DELETE
--     policy at all, so nobody can alter or erase another player's row.
--   - Only the service-role key can delete rows, via
--     app/api/root-rush/admin/clear (ROOT_RUSH_ADMIN_SECRET-gated) — the
--     "owner can clear test entries" control from the spec.

create table if not exists root_rush_scores (
  id           bigint generated always as identity primary key,
  difficulty   text not null check (difficulty in ('easy','medium','hard')),
  level        smallint not null check (level in (1,2,3)),
  player_name  text not null check (char_length(player_name) between 1 and 20),
  device_id    text not null check (char_length(device_id) between 8 and 100),
  steps        smallint not null check (steps > 0 and steps < 500),
  time_ms      integer not null check (time_ms >= 0),
  created_at   timestamptz not null default now()
);

-- Every leaderboard read filters by (difficulty, level) and orders by
-- steps then created_at — this index covers exactly that query.
create index if not exists root_rush_scores_board_idx
  on root_rush_scores (difficulty, level, steps, created_at);

alter table root_rush_scores enable row level security;

create policy "anyone can read root rush scores"
  on root_rush_scores for select
  to public
  using (true);

create policy "anyone can submit a root rush score"
  on root_rush_scores for insert
  to public
  with check (
    difficulty in ('easy','medium','hard')
    and level in (1,2,3)
    and char_length(player_name) between 1 and 20
    and char_length(device_id) between 8 and 100
    and steps > 0 and steps < 500
    and time_ms >= 0
  );

-- Deliberately no update/delete policy for the public role — see note above.

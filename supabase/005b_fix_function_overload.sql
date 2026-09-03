-- Run this ONCE, right after 005_true_overlap_and_halfhour_oh.sql.
--
-- CREATE OR REPLACE only replaces a function with the exact same parameter
-- types — since 005 changed p_hour from integer to numeric, Postgres kept
-- BOTH versions around (an overload) instead of swapping one for the other,
-- which breaks calling it via RPC ("could not choose the best candidate").
-- This drops the stale integer-typed version so only the numeric one remains.

drop function if exists book_ta_office_hour(bigint, text, smallint, integer);

-- Run this ONCE in the Supabase SQL editor (after 016).
-- Adds a Question 5 column to exam_results (Mid-2 has five questions).
-- Existing rows (Mid-1) simply have it null.
alter table exam_results add column if not exists q5 text;

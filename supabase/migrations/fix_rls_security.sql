-- =============================================================
-- FlowTrack - Security Fix: Enable RLS on all public tables
-- Run this in: Supabase Dashboard > SQL Editor
-- Project: cjepifujptjwynnypxbg
-- =============================================================

-- Tables confirmed (PascalCase):
-- ExerciseRecord, Routine, RoutineExercise, TrainingPlan, User, Workout

-- =====================
-- 1. ENABLE RLS ON ALL TABLES
-- =====================

ALTER TABLE "User"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Workout"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ExerciseRecord"  ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TrainingPlan"    ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Routine"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE "RoutineExercise" ENABLE ROW LEVEL SECURITY;


-- =====================
-- 2. PROTECT SENSITIVE COLUMNS ON User TABLE
-- Removes anon + authenticated direct access to password, googleTokens, etc.
-- =====================

REVOKE SELECT ON "User" FROM anon;
REVOKE SELECT ON "User" FROM authenticated;

REVOKE SELECT ON "Workout"         FROM anon;
REVOKE SELECT ON "ExerciseRecord"  FROM anon;
REVOKE SELECT ON "TrainingPlan"    FROM anon;
REVOKE SELECT ON "Routine"         FROM anon;
REVOKE SELECT ON "RoutineExercise" FROM anon;


-- =====================
-- VERIFY: all should show rowsecurity = true
-- =====================
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

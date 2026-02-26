-- ============================================================
-- Inserimento 2 schede per Mattia, create da Elisa
-- Eseguire nel Supabase SQL Editor
-- ============================================================

DO $$
DECLARE
  v_elisa_id UUID;
  v_mattia_id UUID;
  v_plan_a_id UUID;
  v_plan_b_id UUID;
  -- Exercise IDs
  v_bike UUID;
  v_deadbug UUID;
  v_plank_tocco UUID;
  v_ext_knee UUID;
  v_squat_trx UUID;
  v_heel_raises UUID;
  v_sl_bridge UUID;
  v_plank_stacco UUID;
  v_l_sit UUID;
  v_slr UUID;
  v_slr_long UUID;
  v_clamshell UUID;
  v_squat_bfr UUID;
  -- Nuovi esercizi
  v_slr_long_ostacolo UUID;
  v_ext_knee_anca UUID;
BEGIN

  -- ========== TROVA UTENTI ==========
  SELECT id INTO v_elisa_id FROM public.profiles WHERE role = 'physio' AND (
    lower(username) = 'elisa' OR lower(full_name) LIKE '%elisa%'
  ) LIMIT 1;

  IF v_elisa_id IS NULL THEN
    RAISE EXCEPTION 'Account Elisa (physio) non trovato!';
  END IF;

  SELECT id INTO v_mattia_id FROM public.profiles WHERE physio_id = v_elisa_id AND role = 'patient' AND (
    lower(username) = 'mattia' OR lower(full_name) LIKE '%mattia%'
  ) LIMIT 1;

  IF v_mattia_id IS NULL THEN
    -- Fallback: primo paziente di Elisa
    SELECT id INTO v_mattia_id FROM public.profiles WHERE physio_id = v_elisa_id AND role = 'patient' LIMIT 1;
  END IF;

  IF v_mattia_id IS NULL THEN
    RAISE EXCEPTION 'Nessun paziente trovato per Elisa!';
  END IF;

  RAISE NOTICE 'Elisa ID: %, Mattia ID: %', v_elisa_id, v_mattia_id;

  -- ========== TROVA ESERCIZI ESISTENTI ==========
  SELECT id INTO v_bike FROM public.exercises WHERE lower(name) = 'bike' LIMIT 1;
  SELECT id INTO v_deadbug FROM public.exercises WHERE lower(name) = 'deadbug con bastone' LIMIT 1;
  SELECT id INTO v_plank_tocco FROM public.exercises WHERE lower(name) = 'plank tocco spalla' LIMIT 1;
  SELECT id INTO v_ext_knee FROM public.exercises WHERE lower(name) = 'extension knee banded' LIMIT 1;
  SELECT id INTO v_squat_trx FROM public.exercises WHERE lower(name) = 'squat al trx' LIMIT 1;
  SELECT id INTO v_heel_raises FROM public.exercises WHERE lower(name) = 'heel raises da gradino' LIMIT 1;
  SELECT id INTO v_sl_bridge FROM public.exercises WHERE lower(name) = 'sl bridge' LIMIT 1;
  SELECT id INTO v_plank_stacco FROM public.exercises WHERE lower(name) = 'plank stacco una gamba' LIMIT 1;
  SELECT id INTO v_l_sit FROM public.exercises WHERE lower(name) = 'l sit' LIMIT 1;
  SELECT id INTO v_slr FROM public.exercises WHERE lower(name) = 'slr' LIMIT 1;
  SELECT id INTO v_slr_long FROM public.exercises WHERE lower(name) = 'slr in long sitting a muro' LIMIT 1;
  SELECT id INTO v_clamshell FROM public.exercises WHERE lower(name) = 'clamshell' LIMIT 1;
  SELECT id INTO v_squat_bfr FROM public.exercises WHERE lower(name) = 'squat bfr' LIMIT 1;

  -- ========== CREA ESERCIZI NUOVI (se non esistono) ==========

  -- SLR in Long Sitting a Muro con Ostacolo
  SELECT id INTO v_slr_long_ostacolo FROM public.exercises
    WHERE lower(name) = 'slr in long sitting a muro con ostacolo' LIMIT 1;

  IF v_slr_long_ostacolo IS NULL THEN
    INSERT INTO public.exercises (name, description, category, created_by, is_global)
    VALUES (
      'SLR in Long Sitting a Muro con Ostacolo',
      'Seduto con schiena contro il muro, gambe distese, cubotto davanti da superare. Solleva la gamba dritta superando l''ostacolo. Schiena contro il muro, contrazione massima del quadricipite. Serie: 3x10.',
      'lower_body',
      v_elisa_id,
      false
    ) RETURNING id INTO v_slr_long_ostacolo;
  END IF;

  -- Extension Knee Banded Flettendo l'Anca Controlaterale
  SELECT id INTO v_ext_knee_anca FROM public.exercises
    WHERE lower(name) = 'extension knee banded flettendo l''anca controlaterale' LIMIT 1;

  IF v_ext_knee_anca IS NULL THEN
    INSERT INTO public.exercises (name, description, category, created_by, is_global)
    VALUES (
      'Extension Knee Banded Flettendo l''Anca Controlaterale',
      'Seduto, elastico alla caviglia fissato dietro. Estendi il ginocchio contro resistenza flettendo contemporaneamente l''anca controlaterale. Movimento lento, pausa in estensione completa. Serie: 3x10.',
      'lower_body',
      v_elisa_id,
      false
    ) RETURNING id INTO v_ext_knee_anca;
  END IF;

  -- ========== DISATTIVA PIANI PRECEDENTI (opzionale) ==========
  -- UPDATE public.workout_plans SET active = false
  --   WHERE patient_id = v_mattia_id AND active = true;

  -- ========== SCHEDA A: Rehab A ==========
  INSERT INTO public.workout_plans (patient_id, physio_id, name, description, active)
  VALUES (v_mattia_id, v_elisa_id, 'Rehab A', 'Core + Ginocchio + Lower Body', true)
  RETURNING id INTO v_plan_a_id;

  -- A1: Bike — 5 minuti (300s)
  INSERT INTO public.plan_items (plan_id, exercise_id, "order", sets, duration, rest_time, rest_after, notes)
  VALUES (v_plan_a_id, v_bike, 1, 1, 300, 0, 60, NULL);

  -- B1: Deadbug con Bastone — 3x20 — 1' rest
  INSERT INTO public.plan_items (plan_id, exercise_id, "order", sets, reps, rest_time, rest_after, notes)
  VALUES (v_plan_a_id, v_deadbug, 2, 3, 20, 60, 60, 'Estensione completa di ginocchio, non sollevare la lombare da terra');

  -- C1: Plank Tocco Spalla — 3x20 — 1' rest
  INSERT INTO public.plan_items (plan_id, exercise_id, "order", sets, reps, rest_time, rest_after, notes)
  VALUES (v_plan_a_id, v_plank_tocco, 3, 3, 20, 60, 60, NULL);

  -- D1: Extension Knee Banded Flettendo l'Anca Controlaterale — 3x10 — 1' rest — Loop viola
  INSERT INTO public.plan_items (plan_id, exercise_id, "order", sets, reps, rest_time, rest_after, notes)
  VALUES (v_plan_a_id, v_ext_knee_anca, 4, 3, 10, 60, 60, 'Carico: Loop viola');

  -- E1: Squat al TRX — 3x8 — 1' rest
  INSERT INTO public.plan_items (plan_id, exercise_id, "order", sets, reps, rest_time, rest_after, notes)
  VALUES (v_plan_a_id, v_squat_trx, 5, 3, 8, 60, 60, NULL);

  -- F1: Heel Raises da Gradino — 3x15 — SS con SL Bridge — Ginocchia in estensione
  INSERT INTO public.plan_items (plan_id, exercise_id, "order", sets, reps, rest_time, rest_after, notes, superset_group, transition_rest)
  VALUES (v_plan_a_id, v_heel_raises, 6, 3, 15, 60, 90, 'Ginocchia in estensione', 1, 10);

  -- F2: SL Bridge — 3x8 per lato — SS con Heel Raises
  INSERT INTO public.plan_items (plan_id, exercise_id, "order", sets, reps, rest_time, rest_after, notes, superset_group, transition_rest)
  VALUES (v_plan_a_id, v_sl_bridge, 7, 3, 8, 60, 90, 'Per lato', 1, 10);

  -- ========== SCHEDA B: Rehab B ==========
  INSERT INTO public.workout_plans (patient_id, physio_id, name, description, active)
  VALUES (v_mattia_id, v_elisa_id, 'Rehab B', 'Core + Ginocchio + Anca + BFR', true)
  RETURNING id INTO v_plan_b_id;

  -- A1: Bike — 5 minuti (300s)
  INSERT INTO public.plan_items (plan_id, exercise_id, "order", sets, duration, rest_time, rest_after, notes)
  VALUES (v_plan_b_id, v_bike, 1, 1, 300, 0, 60, NULL);

  -- B1: Plank Stacco Una Gamba — 3x30" — SS con L Sit
  INSERT INTO public.plan_items (plan_id, exercise_id, "order", sets, duration, rest_time, rest_after, notes, superset_group, transition_rest)
  VALUES (v_plan_b_id, v_plank_stacco, 2, 3, 30, 60, 90, NULL, 1, 10);

  -- C1: L Sit — 3x30" — 1' rest (fine superserie)
  INSERT INTO public.plan_items (plan_id, exercise_id, "order", sets, duration, rest_time, rest_after, notes, superset_group, transition_rest)
  VALUES (v_plan_b_id, v_l_sit, 3, 3, 30, 60, 90, NULL, 1, 10);

  -- D1: SLR — 3x10 — 1' rest — Cavigliera
  INSERT INTO public.plan_items (plan_id, exercise_id, "order", sets, reps, rest_time, rest_after, notes)
  VALUES (v_plan_b_id, v_slr, 4, 3, 10, 60, 60, 'Carico: Cavigliera');

  -- E1: SLR in Long Sitting a Muro con Ostacolo — 3x10 — 1' rest — Cubotto da superare
  INSERT INTO public.plan_items (plan_id, exercise_id, "order", sets, reps, rest_time, rest_after, notes)
  VALUES (v_plan_b_id, v_slr_long_ostacolo, 5, 3, 10, 60, 60, 'Carico: Cubotto da superare');

  -- F1: Clamshell — 3x12 per lato — 1' rest — Miniband nera sulle ginocchia
  INSERT INTO public.plan_items (plan_id, exercise_id, "order", sets, reps, rest_time, rest_after, notes)
  VALUES (v_plan_b_id, v_clamshell, 6, 3, 12, 60, 60, 'Per lato. Carico: Miniband nera sulle ginocchia');

  -- G1: Squat BFR — 30-15-15-15 (4 set, reps=30 primo set) — 1' rest — Manubrio 3 kg
  INSERT INTO public.plan_items (plan_id, exercise_id, "order", sets, reps, rest_time, rest_after, notes)
  VALUES (v_plan_b_id, v_squat_bfr, 7, 4, 30, 60, 60, 'Schema: 30-15-15-15. Carico: Manubrio 3 kg');

  RAISE NOTICE '✅ Scheda A (Rehab A) creata: %', v_plan_a_id;
  RAISE NOTICE '✅ Scheda B (Rehab B) creata: %', v_plan_b_id;
  RAISE NOTICE 'Totale: 7 esercizi Rehab A + 7 esercizi Rehab B';

END $$;

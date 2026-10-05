-- ============================================================
-- Inserimento 2 schede palestra (A / B) per la paziente Marion
-- Contenuti in 3 lingue: italiano (colonne base) + en/fr (colonna translations)
-- Richiede la migration 20261005000001_content_translations.sql
-- Eseguire nel Supabase SQL Editor
--
-- Range dalla scheda originale: le ripetizioni salvate sono il valore
-- massimo del range (es. 10-12 → 12); il range completo è nelle note.
-- Recupero 60-90" → 90". Riscaldamento 5 min, defaticamento 3-5 min → 5 min.
-- ============================================================

DO $$
DECLARE
  v_patient_id UUID;
  v_physio_id  UUID;
  v_plan_a     UUID;
  v_plan_b     UUID;
  -- Esercizi
  v_riscaldamento  UUID;
  v_defaticamento  UUID;
  v_leg_press      UUID;
  v_glute_bridge   UUID;
  v_lat_machine    UUID;
  v_chest_press    UUID;
  v_dead_bug       UUID;
  v_abductor       UUID;
  v_affondi        UUID;
  v_seated_row     UUID;
  v_shoulder_press UUID;
  v_plank_ginocchia UUID;
BEGIN

  -- ========== TROVA UTENTI ==========
  SELECT id, physio_id INTO v_patient_id, v_physio_id
  FROM public.profiles
  WHERE role = 'patient' AND (lower(username) = 'marion' OR lower(full_name) LIKE '%marion%')
  LIMIT 1;

  IF v_patient_id IS NULL THEN
    RAISE EXCEPTION 'Paziente Marion non trovata!';
  END IF;

  IF v_physio_id IS NULL THEN
    RAISE EXCEPTION 'Marion non è collegata a nessun fisioterapista (physio_id NULL)!';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.workout_plans
    WHERE patient_id = v_patient_id
      AND (name LIKE 'Scheda A — %' OR name LIKE 'Scheda B — %')
  ) THEN
    RAISE EXCEPTION 'Le schede A/B esistono già per Marion: script già eseguito?';
  END IF;

  RAISE NOTICE 'Marion ID: %, Fisioterapista ID: %', v_patient_id, v_physio_id;

  -- ========== CREA ESERCIZI (idempotente) ==========
  -- Se l'esercizio esiste già, viene riutilizzato e riceve le traduzioni solo se non ne ha.

  -- Riscaldamento
  SELECT id INTO v_riscaldamento FROM public.exercises WHERE lower(name) = 'riscaldamento' LIMIT 1;
  IF v_riscaldamento IS NULL THEN
    INSERT INTO public.exercises (name, description, category, created_by, is_global) VALUES (
      'Riscaldamento',
      'Attività cardio a ritmo moderato per scaldare muscoli e articolazioni prima della seduta.',
      'cardio', v_physio_id, false
    ) RETURNING id INTO v_riscaldamento;
  END IF;
  UPDATE public.exercises SET translations = $j${
    "en": {"name": "Warm-up", "description": "Moderate-pace cardio to warm up muscles and joints before the session."},
    "fr": {"name": "Échauffement", "description": "Cardio à rythme modéré pour échauffer les muscles et les articulations avant la séance."}
  }$j$::jsonb WHERE id = v_riscaldamento AND translations = '{}'::jsonb;

  -- Defaticamento
  SELECT id INTO v_defaticamento FROM public.exercises WHERE lower(name) = 'defaticamento' LIMIT 1;
  IF v_defaticamento IS NULL THEN
    INSERT INTO public.exercises (name, description, category, created_by, is_global) VALUES (
      'Defaticamento',
      'Fase finale di recupero: movimenti lenti e allungamenti dolci per far tornare il corpo a riposo.',
      'flexibility', v_physio_id, false
    ) RETURNING id INTO v_defaticamento;
  END IF;
  UPDATE public.exercises SET translations = $j${
    "en": {"name": "Cool-down", "description": "Final recovery phase: slow movements and gentle stretches to bring the body back to rest."},
    "fr": {"name": "Retour au calme", "description": "Phase finale de récupération : mouvements lents et étirements doux pour ramener le corps au repos."}
  }$j$::jsonb WHERE id = v_defaticamento AND translations = '{}'::jsonb;

  -- Leg Press Orizzontale
  SELECT id INTO v_leg_press FROM public.exercises WHERE lower(name) = 'leg press orizzontale' LIMIT 1;
  IF v_leg_press IS NULL THEN
    INSERT INTO public.exercises (name, description, category, created_by, is_global) VALUES (
      'Leg Press Orizzontale',
      'Posiziona i piedi in alto sulla pedana per coinvolgere di più i glutei. Spingi coi talloni.',
      'lower_body', v_physio_id, false
    ) RETURNING id INTO v_leg_press;
  END IF;
  UPDATE public.exercises SET translations = $j${
    "en": {"name": "Horizontal Leg Press", "description": "Place your feet high on the platform to work your glutes more. Push through your heels."},
    "fr": {"name": "Presse à cuisses horizontale", "description": "Place les pieds en haut de la plateforme pour solliciter davantage les fessiers. Pousse avec les talons."}
  }$j$::jsonb WHERE id = v_leg_press AND translations = '{}'::jsonb;

  -- Glute Bridge a terra
  SELECT id INTO v_glute_bridge FROM public.exercises WHERE lower(name) = 'glute bridge a terra' LIMIT 1;
  IF v_glute_bridge IS NULL THEN
    INSERT INTO public.exercises (name, description, category, created_by, is_global) VALUES (
      'Glute Bridge a terra',
      'A pancia in su con ginocchia piegate: stacca il bacino e contrai forte i glutei in cima per 1 secondo.',
      'lower_body', v_physio_id, false
    ) RETURNING id INTO v_glute_bridge;
  END IF;
  UPDATE public.exercises SET translations = $j${
    "en": {"name": "Floor Glute Bridge", "description": "Lie on your back with knees bent: lift your hips and squeeze your glutes hard at the top for 1 second."},
    "fr": {"name": "Pont fessier au sol", "description": "Allongée sur le dos, genoux fléchis : décolle le bassin et contracte fort les fessiers en haut pendant 1 seconde."}
  }$j$::jsonb WHERE id = v_glute_bridge AND translations = '{}'::jsonb;

  -- Lat Machine avanti
  SELECT id INTO v_lat_machine FROM public.exercises WHERE lower(name) = 'lat machine avanti' LIMIT 1;
  IF v_lat_machine IS NULL THEN
    INSERT INTO public.exercises (name, description, category, created_by, is_global) VALUES (
      'Lat Machine avanti',
      'Fondamentale per rinforzare la schiena e contrastare la postura da allattamento/gestione bimbi.',
      'upper_body', v_physio_id, false
    ) RETURNING id INTO v_lat_machine;
  END IF;
  UPDATE public.exercises SET translations = $j${
    "en": {"name": "Front Lat Pulldown", "description": "Key for strengthening the back and counteracting the posture that comes from breastfeeding and caring for little ones."},
    "fr": {"name": "Tirage vertical poitrine", "description": "Essentiel pour renforcer le dos et contrer la posture liée à l'allaitement et au portage des enfants."}
  }$j$::jsonb WHERE id = v_lat_machine AND translations = '{}'::jsonb;

  -- Chest Press (macchina)
  SELECT id INTO v_chest_press FROM public.exercises WHERE lower(name) = 'chest press (macchina)' LIMIT 1;
  IF v_chest_press IS NULL THEN
    INSERT INTO public.exercises (name, description, category, created_by, is_global) VALUES (
      'Chest Press (macchina)',
      'Spinta petto guidata, carico leggero per bilanciare la parte superiore.',
      'upper_body', v_physio_id, false
    ) RETURNING id INTO v_chest_press;
  END IF;
  UPDATE public.exercises SET translations = $j${
    "en": {"name": "Chest Press (machine)", "description": "Guided chest press with a light load to balance the upper body."},
    "fr": {"name": "Développé poitrine (machine)", "description": "Poussée guidée pour la poitrine, charge légère pour équilibrer le haut du corps."}
  }$j$::jsonb WHERE id = v_chest_press AND translations = '{}'::jsonb;

  -- Dead Bug (Addome)
  SELECT id INTO v_dead_bug FROM public.exercises WHERE lower(name) = 'dead bug (addome)' LIMIT 1;
  IF v_dead_bug IS NULL THEN
    INSERT INTO public.exercises (name, description, category, created_by, is_global) VALUES (
      'Dead Bug (Addome)',
      'A terra, schiena ben adesa al pavimento: estendi un braccio e la gamba opposta alternandoli.',
      'core', v_physio_id, false
    ) RETURNING id INTO v_dead_bug;
  END IF;
  UPDATE public.exercises SET translations = $j${
    "en": {"name": "Dead Bug (Abs)", "description": "On the floor, lower back pressed into the ground: extend one arm and the opposite leg, alternating sides."},
    "fr": {"name": "Dead Bug (Abdos)", "description": "Au sol, le dos bien plaqué contre le sol : tends un bras et la jambe opposée en alternant."}
  }$j$::jsonb WHERE id = v_dead_bug AND translations = '{}'::jsonb;

  -- Abductor Machine
  SELECT id INTO v_abductor FROM public.exercises WHERE lower(name) = 'abductor machine' LIMIT 1;
  IF v_abductor IS NULL THEN
    INSERT INTO public.exercises (name, description, category, created_by, is_global) VALUES (
      'Abductor Machine',
      'Busto leggermente inclinato in avanti per attivare meglio il gluteo medio e modellare i fianchi.',
      'lower_body', v_physio_id, false
    ) RETURNING id INTO v_abductor;
  END IF;
  UPDATE public.exercises SET translations = $j${
    "en": {"name": "Hip Abductor Machine", "description": "Lean your torso slightly forward to better activate the glute medius and shape the hips."},
    "fr": {"name": "Machine à abducteurs", "description": "Buste légèrement penché en avant pour mieux activer le moyen fessier et sculpter les hanches."}
  }$j$::jsonb WHERE id = v_abductor AND translations = '{}'::jsonb;

  -- Affondi posteriori a corpo libero
  SELECT id INTO v_affondi FROM public.exercises WHERE lower(name) = 'affondi posteriori a corpo libero' LIMIT 1;
  IF v_affondi IS NULL THEN
    INSERT INTO public.exercises (name, description, category, created_by, is_global) VALUES (
      'Affondi posteriori a corpo libero',
      'Passo indietro alternato. Se manca l''equilibrio, ci si può appoggiare a una colonna o struttura.',
      'lower_body', v_physio_id, false
    ) RETURNING id INTO v_affondi;
  END IF;
  UPDATE public.exercises SET translations = $j${
    "en": {"name": "Bodyweight Reverse Lunges", "description": "Alternate stepping backwards. If your balance is off, hold on to a pillar or a frame."},
    "fr": {"name": "Fentes arrière au poids du corps", "description": "Pas en arrière en alternant. Si l'équilibre manque, tu peux t'appuyer sur un poteau ou une structure."}
  }$j$::jsonb WHERE id = v_affondi AND translations = '{}'::jsonb;

  -- Pulley Basso / Seated Row
  SELECT id INTO v_seated_row FROM public.exercises WHERE lower(name) = 'pulley basso / seated row' LIMIT 1;
  IF v_seated_row IS NULL THEN
    INSERT INTO public.exercises (name, description, category, created_by, is_global) VALUES (
      'Pulley Basso / Seated Row',
      'Trazione per la schiena: petto aperto, spalla lontana dalle orecchie mentre sposti il carico.',
      'upper_body', v_physio_id, false
    ) RETURNING id INTO v_seated_row;
  END IF;
  UPDATE public.exercises SET translations = $j${
    "en": {"name": "Seated Cable Row", "description": "Back pull: chest open, shoulders away from your ears as you move the weight."},
    "fr": {"name": "Tirage horizontal assis", "description": "Tirage pour le dos : poitrine ouverte, épaules loin des oreilles pendant que tu déplaces la charge."}
  }$j$::jsonb WHERE id = v_seated_row AND translations = '{}'::jsonb;

  -- Shoulder Press (macchina)
  SELECT id INTO v_shoulder_press FROM public.exercises WHERE lower(name) = 'shoulder press (macchina)' LIMIT 1;
  IF v_shoulder_press IS NULL THEN
    INSERT INTO public.exercises (name, description, category, created_by, is_global) VALUES (
      'Shoulder Press (macchina)',
      'Lavoro leggero per le spalle, utile a dare tono alla parte superiore.',
      'upper_body', v_physio_id, false
    ) RETURNING id INTO v_shoulder_press;
  END IF;
  UPDATE public.exercises SET translations = $j${
    "en": {"name": "Shoulder Press (machine)", "description": "Light shoulder work, helpful for toning the upper body."},
    "fr": {"name": "Développé épaules (machine)", "description": "Travail léger pour les épaules, utile pour tonifier le haut du corps."}
  }$j$::jsonb WHERE id = v_shoulder_press AND translations = '{}'::jsonb;

  -- Plank facilitato (sulle ginocchia)
  SELECT id INTO v_plank_ginocchia FROM public.exercises WHERE lower(name) = 'plank facilitato (sulle ginocchia)' LIMIT 1;
  IF v_plank_ginocchia IS NULL THEN
    INSERT INTO public.exercises (name, description, category, created_by, is_global) VALUES (
      'Plank facilitato (sulle ginocchia)',
      'Appoggio su gomiti e ginocchia. Mantieni l''addome attivo senza far cedere la zona lombare.',
      'core', v_physio_id, false
    ) RETURNING id INTO v_plank_ginocchia;
  END IF;
  UPDATE public.exercises SET translations = $j${
    "en": {"name": "Kneeling Plank", "description": "Rest on your elbows and knees. Keep your abs engaged without letting your lower back sag."},
    "fr": {"name": "Planche sur les genoux", "description": "Appui sur les coudes et les genoux. Garde les abdos actifs sans laisser le bas du dos s'affaisser."}
  }$j$::jsonb WHERE id = v_plank_ginocchia AND translations = '{}'::jsonb;

  -- ========== SCHEDA A ==========
  INSERT INTO public.workout_plans (patient_id, physio_id, name, description, translations, active)
  VALUES (
    v_patient_id, v_physio_id,
    'Scheda A — Glutei, Schiena & Core',
    'Macchine e corpo libero — glutei, schiena e postura',
    $j${
      "en": {"name": "Workout A — Glutes, Back & Core", "description": "Machines and bodyweight — glutes, back and posture"},
      "fr": {"name": "Séance A — Fessiers, Dos & Gainage", "description": "Machines et poids du corps — fessiers, dos et posture"}
    }$j$::jsonb,
    true
  ) RETURNING id INTO v_plan_a;

  INSERT INTO public.plan_items (plan_id, exercise_id, "order", sets, reps, duration, rest_time, rest_after, per_lato, notes, translations) VALUES
    (v_plan_a, v_riscaldamento, 1, 1, NULL, 300,  0, 60, false,
      'Tapis roulant (camminata in pendenza leggera 3%) o cyclette',
      $j${"en": {"notes": "Treadmill (walking at a slight 3% incline) or exercise bike"},
          "fr": {"notes": "Tapis de course (marche en légère pente à 3 %) ou vélo d'appartement"}}$j$::jsonb),
    (v_plan_a, v_leg_press,     2, 3, 12, NULL,  90, 90, false,
      '10-12 ripetizioni · recupero 60-90"',
      $j${"en": {"notes": "10-12 reps · rest 60-90\""},
          "fr": {"notes": "10-12 répétitions · récupération 60-90\""}}$j$::jsonb),
    (v_plan_a, v_glute_bridge,  3, 3, 15, NULL,  60, 60, false,
      '12-15 ripetizioni',
      $j${"en": {"notes": "12-15 reps"}, "fr": {"notes": "12-15 répétitions"}}$j$::jsonb),
    (v_plan_a, v_lat_machine,   4, 3, 12, NULL,  60, 60, false,
      '10-12 ripetizioni',
      $j${"en": {"notes": "10-12 reps"}, "fr": {"notes": "10-12 répétitions"}}$j$::jsonb),
    (v_plan_a, v_chest_press,   5, 3, 12, NULL,  60, 60, false,
      '10-12 ripetizioni',
      $j${"en": {"notes": "10-12 reps"}, "fr": {"notes": "10-12 répétitions"}}$j$::jsonb),
    (v_plan_a, v_dead_bug,      6, 3,  8, NULL,  45, 60, true,
      '8 per lato',
      $j${"en": {"notes": "8 per side"}, "fr": {"notes": "8 par côté"}}$j$::jsonb),
    (v_plan_a, v_defaticamento, 7, 1, NULL, 300,  0,  0, false,
      '3-5 min · Stretching dolce per catena posteriore e lombare',
      $j${"en": {"notes": "3-5 min · Gentle stretching for the posterior chain and lower back"},
          "fr": {"notes": "3-5 min · Étirements doux de la chaîne postérieure et des lombaires"}}$j$::jsonb);

  -- ========== SCHEDA B ==========
  INSERT INTO public.workout_plans (patient_id, physio_id, name, description, translations, active)
  VALUES (
    v_patient_id, v_physio_id,
    'Scheda B — Fianchi, Schiena & Core',
    'Macchine e corpo libero — gluteo medio, schiena e core',
    $j${
      "en": {"name": "Workout B — Hips, Back & Core", "description": "Machines and bodyweight — glute medius, back and core"},
      "fr": {"name": "Séance B — Hanches, Dos & Gainage", "description": "Machines et poids du corps — moyen fessier, dos et gainage"}
    }$j$::jsonb,
    true
  ) RETURNING id INTO v_plan_b;

  INSERT INTO public.plan_items (plan_id, exercise_id, "order", sets, reps, duration, rest_time, rest_after, per_lato, notes, translations) VALUES
    (v_plan_b, v_riscaldamento,   1, 1, NULL, 300,  0, 60, false,
      'Tapis roulant o ellittica a ritmo moderato',
      $j${"en": {"notes": "Treadmill or elliptical at a moderate pace"},
          "fr": {"notes": "Tapis de course ou vélo elliptique à rythme modéré"}}$j$::jsonb),
    (v_plan_b, v_abductor,        2, 3, 15, NULL,  60, 60, false,
      '12-15 ripetizioni',
      $j${"en": {"notes": "12-15 reps"}, "fr": {"notes": "12-15 répétitions"}}$j$::jsonb),
    (v_plan_b, v_affondi,         3, 3, 10, NULL,  60, 60, true,
      '10 per gamba',
      $j${"en": {"notes": "10 per leg"}, "fr": {"notes": "10 par jambe"}}$j$::jsonb),
    (v_plan_b, v_seated_row,      4, 3, 12, NULL,  60, 60, false,
      '10-12 ripetizioni',
      $j${"en": {"notes": "10-12 reps"}, "fr": {"notes": "10-12 répétitions"}}$j$::jsonb),
    (v_plan_b, v_shoulder_press,  5, 2, 12, NULL,  60, 60, false,
      NULL, '{}'::jsonb),
    (v_plan_b, v_plank_ginocchia, 6, 3, NULL, 30,  45, 60, false,
      '20-30 secondi',
      $j${"en": {"notes": "20-30 seconds"}, "fr": {"notes": "20-30 secondes"}}$j$::jsonb),
    (v_plan_b, v_defaticamento,   7, 1, NULL, 300,  0,  0, false,
      '3-5 min · Mobilizzazione bacino (esercizi di "gatto-mucca" a terra) e allungamento',
      $j${"en": {"notes": "3-5 min · Pelvic mobility (cat-cow on the floor) and stretching"},
          "fr": {"notes": "3-5 min · Mobilisation du bassin (exercice du « chat-vache » au sol) et étirements"}}$j$::jsonb);

  RAISE NOTICE '✅ Scheda A creata: %', v_plan_a;
  RAISE NOTICE '✅ Scheda B creata: %', v_plan_b;
  RAISE NOTICE 'Totale: 12 esercizi, 2 schede (7+7 plan_items)';

END $$;

-- ============================================================
-- Media: video YouTube (tutti i 12) + GIF fitnessprogramer.com (11 su 12)
-- Link verificati: oEmbed YouTube 200 (incorporabili), GIF 200 image/gif.
-- Non sovrascrive media già presenti su esercizi preesistenti.
-- Plank facilitato: solo video (nessuna GIF fedele della variante sulle ginocchia).
-- ============================================================

UPDATE public.exercises SET
  video_url  = COALESCE(video_url, 'https://www.youtube.com/watch?v=9ccVxEvWtpA'),
  image_urls = CASE WHEN cardinality(image_urls) = 0 THEN ARRAY['https://fitnessprogramer.com/wp-content/uploads/2021/06/Incline-Treadmill.gif', 'https://fitnessprogramer.com/wp-content/uploads/2021/10/Elliptical-Machine.gif'] ELSE image_urls END
WHERE lower(name) = 'riscaldamento';

UPDATE public.exercises SET
  video_url  = COALESCE(video_url, 'https://www.youtube.com/watch?v=8EMbB0tCn7Q'),
  image_urls = CASE WHEN cardinality(image_urls) = 0 THEN ARRAY['https://fitnessprogramer.com/wp-content/uploads/2021/08/Lever-Horizontal-Leg-Press.gif'] ELSE image_urls END
WHERE lower(name) = 'leg press orizzontale';

UPDATE public.exercises SET
  video_url  = COALESCE(video_url, 'https://www.youtube.com/watch?v=PhTDzR0TpZs'),
  image_urls = CASE WHEN cardinality(image_urls) = 0 THEN ARRAY['https://fitnessprogramer.com/wp-content/uploads/2021/02/Glute-Bridge-.gif'] ELSE image_urls END
WHERE lower(name) = 'glute bridge a terra';

UPDATE public.exercises SET
  video_url  = COALESCE(video_url, 'https://www.youtube.com/watch?v=AOpi-p0cJkc'),
  image_urls = CASE WHEN cardinality(image_urls) = 0 THEN ARRAY['https://fitnessprogramer.com/wp-content/uploads/2021/02/Lat-Pulldown.gif'] ELSE image_urls END
WHERE lower(name) = 'lat machine avanti';

UPDATE public.exercises SET
  video_url  = COALESCE(video_url, 'https://www.youtube.com/watch?v=sqNwDkUU_Ps'),
  image_urls = CASE WHEN cardinality(image_urls) = 0 THEN ARRAY['https://fitnessprogramer.com/wp-content/uploads/2021/02/Chest-Press-Machine.gif'] ELSE image_urls END
WHERE lower(name) = 'chest press (macchina)';

UPDATE public.exercises SET
  video_url  = COALESCE(video_url, 'https://www.youtube.com/watch?v=GbSC02oU3To'),
  image_urls = CASE WHEN cardinality(image_urls) = 0 THEN ARRAY['https://fitnessprogramer.com/wp-content/uploads/2021/05/Dead-Bug.gif'] ELSE image_urls END
WHERE lower(name) = 'dead bug (addome)';

UPDATE public.exercises SET
  video_url  = COALESCE(video_url, 'https://www.youtube.com/watch?v=1UVIT5G1R2k'),
  image_urls = CASE WHEN cardinality(image_urls) = 0 THEN ARRAY['https://fitnessprogramer.com/wp-content/uploads/2022/10/Single-Knee-To-Chest-Stretch.gif', 'https://fitnessprogramer.com/wp-content/uploads/2021/02/cat-cow.gif'] ELSE image_urls END
WHERE lower(name) = 'defaticamento';

UPDATE public.exercises SET
  video_url  = COALESCE(video_url, 'https://www.youtube.com/watch?v=G_8LItOiZ0Q'),
  image_urls = CASE WHEN cardinality(image_urls) = 0 THEN ARRAY['https://fitnessprogramer.com/wp-content/uploads/2021/02/HiP-ABDUCTION-MACHINE.gif'] ELSE image_urls END
WHERE lower(name) = 'abductor machine';

UPDATE public.exercises SET
  video_url  = COALESCE(video_url, 'https://www.youtube.com/watch?v=Ry-wqegeKlE'),
  image_urls = CASE WHEN cardinality(image_urls) = 0 THEN ARRAY['https://fitnessprogramer.com/wp-content/uploads/2022/08/bodyweight-reverse-lunge.gif'] ELSE image_urls END
WHERE lower(name) = 'affondi posteriori a corpo libero';

UPDATE public.exercises SET
  video_url  = COALESCE(video_url, 'https://www.youtube.com/watch?v=xQNrFHEMhI4'),
  image_urls = CASE WHEN cardinality(image_urls) = 0 THEN ARRAY['https://fitnessprogramer.com/wp-content/uploads/2021/02/Seated-Cable-Row.gif'] ELSE image_urls END
WHERE lower(name) = 'pulley basso / seated row';

UPDATE public.exercises SET
  video_url  = COALESCE(video_url, 'https://www.youtube.com/watch?v=TnhIyp4kmO8'),
  image_urls = CASE WHEN cardinality(image_urls) = 0 THEN ARRAY['https://fitnessprogramer.com/wp-content/uploads/2021/04/Lever-Shoulder-Press.gif'] ELSE image_urls END
WHERE lower(name) = 'shoulder press (macchina)';

UPDATE public.exercises SET
  video_url  = COALESCE(video_url, 'https://www.youtube.com/watch?v=bMfpFiupXkA')
WHERE lower(name) = 'plank facilitato (sulle ginocchia)';

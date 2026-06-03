-- ============================================================
-- Inserimento scheda PALESTRA (ipertrofia) su 3 giorni
-- Paziente: tomthias — Fisioterapista: Elisa
-- Split: Lunedì (push) / Mercoledì (pull) / Venerdì (spalle)
-- Recupero: 60" tra le serie, 90" tra gli esercizi
-- Eseguire nel Supabase SQL Editor
-- ============================================================

DO $$
DECLARE
  v_elisa_id   UUID;
  v_patient_id UUID;
  v_plan_lun   UUID;
  v_plan_mer   UUID;
  v_plan_ven   UUID;
  -- Esercizi
  v_piegamenti        UUID;
  v_spinte_man        UUID;
  v_alzate_front_inv  UUID;
  v_kickback          UUID;
  v_french_press      UUID;
  v_rematore          UUID;
  v_pulley_elastico   UUID;
  v_pullover          UUID;
  v_curl_seduto       UUID;
  v_hammer_curl       UUID;
  v_alzate_lat        UUID;
  v_alzate_front      UUID;
  v_alzate_post       UUID;
  v_iperestensioni    UUID;
  v_addominali        UUID;
BEGIN

  -- ========== TROVA UTENTI ==========
  SELECT id INTO v_elisa_id FROM public.profiles WHERE role = 'physio' AND (
    lower(username) = 'elisa' OR lower(full_name) LIKE '%elisa%'
  ) LIMIT 1;

  IF v_elisa_id IS NULL THEN
    RAISE EXCEPTION 'Account Elisa (physio) non trovato!';
  END IF;

  -- Paziente tomthias (con fallback al primo paziente di Elisa)
  SELECT id INTO v_patient_id FROM public.profiles WHERE physio_id = v_elisa_id AND role = 'patient' AND (
    lower(username) = 'tomthias' OR lower(full_name) LIKE '%tomthias%'
    OR lower(username) = 'mattia' OR lower(full_name) LIKE '%mattia%'
  ) LIMIT 1;

  IF v_patient_id IS NULL THEN
    SELECT id INTO v_patient_id FROM public.profiles WHERE physio_id = v_elisa_id AND role = 'patient' LIMIT 1;
  END IF;

  IF v_patient_id IS NULL THEN
    RAISE EXCEPTION 'Nessun paziente trovato per Elisa!';
  END IF;

  RAISE NOTICE 'Elisa ID: %, Paziente ID: %', v_elisa_id, v_patient_id;

  -- ========== CREA ESERCIZI (idempotente) ==========

  -- Piegamenti a Terra
  SELECT id INTO v_piegamenti FROM public.exercises WHERE lower(name) = 'piegamenti a terra' LIMIT 1;
  IF v_piegamenti IS NULL THEN
    INSERT INTO public.exercises (name, description, category, created_by, is_global) VALUES (
      'Piegamenti a Terra',
      'Push-up classico. Mani poco più larghe delle spalle, corpo in linea dalla testa ai talloni, core attivo. Scendi controllato fino a sfiorare il petto a terra, spingi in alto distendendo le braccia. Eseguire a cedimento (max ripetizioni).',
      'upper_body', v_elisa_id, false
    ) RETURNING id INTO v_piegamenti;
  END IF;

  -- Spinte con Manubri
  SELECT id INTO v_spinte_man FROM public.exercises WHERE lower(name) = 'spinte con manubri' LIMIT 1;
  IF v_spinte_man IS NULL THEN
    INSERT INTO public.exercises (name, description, category, created_by, is_global) VALUES (
      'Spinte con Manubri',
      'Seduto o in piedi, manubri all''altezza delle spalle. Spingi verso l''alto distendendo le braccia senza bloccare i gomiti, poi torna controllato. Schiena neutra, addome contratto.',
      'upper_body', v_elisa_id, false
    ) RETURNING id INTO v_spinte_man;
  END IF;

  -- Alzate Frontali Inverse
  SELECT id INTO v_alzate_front_inv FROM public.exercises WHERE lower(name) = 'alzate frontali inverse' LIMIT 1;
  IF v_alzate_front_inv IS NULL THEN
    INSERT INTO public.exercises (name, description, category, created_by, is_global) VALUES (
      'Alzate Frontali Inverse',
      'In piedi, busto leggermente flesso in avanti, manubri davanti alle cosce con presa inversa. Solleva le braccia controllando il movimento, scapole stabili. Movimento lento, niente slancio.',
      'upper_body', v_elisa_id, false
    ) RETURNING id INTO v_alzate_front_inv;
  END IF;

  -- Kick Back Tricipiti
  SELECT id INTO v_kickback FROM public.exercises WHERE lower(name) = 'kick back tricipiti' LIMIT 1;
  IF v_kickback IS NULL THEN
    INSERT INTO public.exercises (name, description, category, created_by, is_global) VALUES (
      'Kick Back Tricipiti',
      'Busto inclinato in avanti, gomito alto e fermo lungo il fianco. Estendi l''avambraccio all''indietro fino a distendere completamente il braccio, contrai il tricipite, poi torna controllato. Il gomito non si muove.',
      'upper_body', v_elisa_id, false
    ) RETURNING id INTO v_kickback;
  END IF;

  -- French Press con Manubri
  SELECT id INTO v_french_press FROM public.exercises WHERE lower(name) = 'french press con manubri' LIMIT 1;
  IF v_french_press IS NULL THEN
    INSERT INTO public.exercises (name, description, category, created_by, is_global) VALUES (
      'French Press con Manubri',
      'Estensione dei tricipiti sopra la testa. Gomiti puntati in alto e fermi, fletti gli avambracci portando i manubri dietro la nuca, poi distendi in alto. Schiena neutra, addome contratto.',
      'upper_body', v_elisa_id, false
    ) RETURNING id INTO v_french_press;
  END IF;

  -- Rematore con Manubri
  SELECT id INTO v_rematore FROM public.exercises WHERE lower(name) = 'rematore con manubri' LIMIT 1;
  IF v_rematore IS NULL THEN
    INSERT INTO public.exercises (name, description, category, created_by, is_global) VALUES (
      'Rematore con Manubri',
      'Busto inclinato in avanti con schiena neutra, manubri appesi. Tira i gomiti verso l''alto stringendo le scapole, porta i manubri verso i fianchi, poi torna controllato. Non slanciare con la schiena.',
      'upper_body', v_elisa_id, false
    ) RETURNING id INTO v_rematore;
  END IF;

  -- Pulley con Elastico
  SELECT id INTO v_pulley_elastico FROM public.exercises WHERE lower(name) = 'pulley con elastico' LIMIT 1;
  IF v_pulley_elastico IS NULL THEN
    INSERT INTO public.exercises (name, description, category, created_by, is_global) VALUES (
      'Pulley con Elastico',
      'Seduto, elastico fissato davanti all''altezza del petto. Tira i gomiti indietro stringendo le scapole, porta le mani verso l''addome, poi rilascia controllando il ritorno. Schiena eretta, petto in fuori.',
      'upper_body', v_elisa_id, false
    ) RETURNING id INTO v_pulley_elastico;
  END IF;

  -- Pullover con Manubrio
  SELECT id INTO v_pullover FROM public.exercises WHERE lower(name) = 'pullover con manubrio' LIMIT 1;
  IF v_pullover IS NULL THEN
    INSERT INTO public.exercises (name, description, category, created_by, is_global) VALUES (
      'Pullover con Manubrio',
      'Supino su panca, un manubrio tenuto con entrambe le mani sopra il petto. Porta il manubrio dietro la testa con braccia quasi distese controllando l''allungamento, poi riporta sopra il petto. Bacino fermo.',
      'upper_body', v_elisa_id, false
    ) RETURNING id INTO v_pullover;
  END IF;

  -- Curl Seduto con Manubri
  SELECT id INTO v_curl_seduto FROM public.exercises WHERE lower(name) = 'curl seduto con manubri' LIMIT 1;
  IF v_curl_seduto IS NULL THEN
    INSERT INTO public.exercises (name, description, category, created_by, is_global) VALUES (
      'Curl Seduto con Manubri',
      'Seduto, braccia lungo i fianchi, manubri con presa supina. Fletti gli avambracci portando i manubri verso le spalle, contrai i bicipiti in alto, poi torna controllato. Gomiti fermi, niente slancio.',
      'upper_body', v_elisa_id, false
    ) RETURNING id INTO v_curl_seduto;
  END IF;

  -- Hammer Curl
  SELECT id INTO v_hammer_curl FROM public.exercises WHERE lower(name) = 'hammer curl' LIMIT 1;
  IF v_hammer_curl IS NULL THEN
    INSERT INTO public.exercises (name, description, category, created_by, is_global) VALUES (
      'Hammer Curl',
      'Curl a presa neutra (martello), pollici verso l''alto. Schema 7-7-7: 7 ripetizioni nella metà bassa del movimento, 7 nella metà alta, 7 complete. Gomiti fermi lungo i fianchi.',
      'upper_body', v_elisa_id, false
    ) RETURNING id INTO v_hammer_curl;
  END IF;

  -- Alzate Laterali con Manubri
  SELECT id INTO v_alzate_lat FROM public.exercises WHERE lower(name) = 'alzate laterali con manubri' LIMIT 1;
  IF v_alzate_lat IS NULL THEN
    INSERT INTO public.exercises (name, description, category, created_by, is_global) VALUES (
      'Alzate Laterali con Manubri',
      'In piedi, manubri ai fianchi. Solleva le braccia lateralmente fino all''altezza delle spalle con gomiti leggermente flessi, poi scendi controllato. Niente slancio, scapole stabili.',
      'upper_body', v_elisa_id, false
    ) RETURNING id INTO v_alzate_lat;
  END IF;

  -- Alzate Frontali
  SELECT id INTO v_alzate_front FROM public.exercises WHERE lower(name) = 'alzate frontali' LIMIT 1;
  IF v_alzate_front IS NULL THEN
    INSERT INTO public.exercises (name, description, category, created_by, is_global) VALUES (
      'Alzate Frontali',
      'In piedi, manubri davanti alle cosce. Solleva le braccia in avanti fino all''altezza delle spalle, poi scendi controllato. Movimento lento, busto fermo, niente compensi con la schiena.',
      'upper_body', v_elisa_id, false
    ) RETURNING id INTO v_alzate_front;
  END IF;

  -- Alzate Posteriori
  SELECT id INTO v_alzate_post FROM public.exercises WHERE lower(name) = 'alzate posteriori' LIMIT 1;
  IF v_alzate_post IS NULL THEN
    INSERT INTO public.exercises (name, description, category, created_by, is_global) VALUES (
      'Alzate Posteriori',
      'Busto inclinato in avanti, manubri appesi sotto il petto. Apri le braccia lateralmente stringendo le scapole per attivare i deltoidi posteriori, poi torna controllato. Movimento lento, niente slancio.',
      'upper_body', v_elisa_id, false
    ) RETURNING id INTO v_alzate_post;
  END IF;

  -- Iperestensioni a Terra
  SELECT id INTO v_iperestensioni FROM public.exercises WHERE lower(name) = 'iperestensioni a terra' LIMIT 1;
  IF v_iperestensioni IS NULL THEN
    INSERT INTO public.exercises (name, description, category, created_by, is_global) VALUES (
      'Iperestensioni a Terra',
      'Prono a terra (superman), braccia distese in avanti. Solleva contemporaneamente busto e gambe contraendo i lombari e i glutei, pausa breve in alto, poi torna controllato. Collo neutro, movimento senza scatti.',
      'core', v_elisa_id, false
    ) RETURNING id INTO v_iperestensioni;
  END IF;

  -- Addominali a Piacere
  SELECT id INTO v_addominali FROM public.exercises WHERE lower(name) = 'addominali a piacere' LIMIT 1;
  IF v_addominali IS NULL THEN
    INSERT INTO public.exercises (name, description, category, created_by, is_global) VALUES (
      'Addominali a Piacere',
      'Lavoro per il core a fine seduta, a scelta tra: crunch, isometria (plank), piegamenti obliqui. Volume libero in base alla giornata.',
      'core', v_elisa_id, false
    ) RETURNING id INTO v_addominali;
  END IF;

  -- ========== SCHEDA LUNEDÌ — Petto, Spalle & Tricipiti ==========
  INSERT INTO public.workout_plans (patient_id, physio_id, name, description, active)
  VALUES (v_patient_id, v_elisa_id, 'Lunedì — Petto, Spalle & Tricipiti', 'Spinta — manubri e corpo libero', true)
  RETURNING id INTO v_plan_lun;

  INSERT INTO public.plan_items (plan_id, exercise_id, "order", sets, reps, rest_time, rest_after, notes) VALUES
    (v_plan_lun, v_piegamenti,       1, 3, 20, 60, 90, 'Max ripetizioni — a cedimento'),
    (v_plan_lun, v_spinte_man,       2, 3, 10, 60, 90, NULL),
    (v_plan_lun, v_alzate_front_inv, 3, 3, 12, 60, 90, NULL),
    (v_plan_lun, v_kickback,         4, 3, 10, 60, 90, NULL),
    (v_plan_lun, v_french_press,     5, 3,  8, 60, 90, NULL),
    (v_plan_lun, v_addominali,       6, 3, 15, 60, 60, 'A piacere — crunch, isometria, piegamenti obliqui');

  -- ========== SCHEDA MERCOLEDÌ — Schiena & Bicipiti ==========
  INSERT INTO public.workout_plans (patient_id, physio_id, name, description, active)
  VALUES (v_patient_id, v_elisa_id, 'Mercoledì — Schiena & Bicipiti', 'Tirata — manubri ed elastico', true)
  RETURNING id INTO v_plan_mer;

  INSERT INTO public.plan_items (plan_id, exercise_id, "order", sets, reps, rest_time, rest_after, notes) VALUES
    (v_plan_mer, v_rematore,        1, 3,  8, 60, 90, NULL),
    (v_plan_mer, v_pulley_elastico, 2, 3, 10, 60, 90, NULL),
    (v_plan_mer, v_pullover,        3, 3, 12, 60, 90, NULL),
    (v_plan_mer, v_curl_seduto,     4, 3, 15, 60, 90, NULL),
    (v_plan_mer, v_hammer_curl,     5, 3,  7, 60, 90, 'Schema: 7-7-7 (mezze basse + mezze alte + complete)'),
    (v_plan_mer, v_addominali,      6, 3, 15, 60, 60, 'A piacere — crunch, isometria, piegamenti obliqui');

  -- ========== SCHEDA VENERDÌ — Spalle & Lombari ==========
  INSERT INTO public.workout_plans (patient_id, physio_id, name, description, active)
  VALUES (v_patient_id, v_elisa_id, 'Venerdì — Spalle & Lombari', 'Spalle a 360° + catena posteriore', true)
  RETURNING id INTO v_plan_ven;

  INSERT INTO public.plan_items (plan_id, exercise_id, "order", sets, reps, rest_time, rest_after, notes) VALUES
    (v_plan_ven, v_alzate_lat,     1, 3,  8, 60, 90, NULL),
    (v_plan_ven, v_alzate_front,   2, 3, 10, 60, 90, NULL),
    (v_plan_ven, v_alzate_post,    3, 3, 12, 60, 90, NULL),
    (v_plan_ven, v_iperestensioni, 4, 3, 20, 60, 90, NULL),
    (v_plan_ven, v_addominali,     5, 3, 15, 60, 60, 'A piacere — crunch, isometria, piegamenti obliqui');

  RAISE NOTICE '✅ Scheda Lunedì creata: %', v_plan_lun;
  RAISE NOTICE '✅ Scheda Mercoledì creata: %', v_plan_mer;
  RAISE NOTICE '✅ Scheda Venerdì creata: %', v_plan_ven;
  RAISE NOTICE 'Totale: 15 esercizi nuovi, 3 schede (6+6+5 plan_items)';

END $$;

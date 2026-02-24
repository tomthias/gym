-- Seed data: rehabilitation exercises
-- Auto-generated from exercises.js (ACL rehab program)

-- Riscaldamento
INSERT INTO public.exercises (name, description, category, is_global) VALUES (
  'Bike',
  'Pedalare sulla cyclette a intensità moderata mantenendo una frequenza cardiaca costante. Respirazione regolare, postura corretta sulla sella. Riscaldamento 5 minuti.',
  'cardio',
  true
);

-- REHAB A: Core + Ginocchio + Lower Body

INSERT INTO public.exercises (name, description, category, is_global) VALUES (
  'Deadbug con Bastone',
  'Supino, braccia che tengono un bastone sopra il petto. Estendi gamba e braccio opposto alternando. Schiena aderente al pavimento, movimento lento e controllato. Serie: 3x20.',
  'core',
  true
);

INSERT INTO public.exercises (name, description, category, is_global) VALUES (
  'Plank Tocco Spalla',
  'In plank sulle mani, tocca la spalla opposta alternando le mani. Non ruotare il bacino, core sempre attivo, piedi larghi per stabilità. Serie: 3x20.',
  'core',
  true
);

INSERT INTO public.exercises (name, description, category, is_global) VALUES (
  'Extension Knee Banded',
  'Seduto, elastico alla caviglia fissato dietro. Estendi il ginocchio contro resistenza. Movimento lento, pausa in estensione completa 2 secondi. Serie: 3x10.',
  'lower_body',
  true
);

INSERT INTO public.exercises (name, description, category, is_global) VALUES (
  'Squat al TRX',
  'Impugnare il TRX, eseguire squat assistito mantenendo tensione sulle cinghie. Talloni a terra, ginocchia in linea con le punte dei piedi, scendi controllato. Serie: 3x8.',
  'lower_body',
  true
);

INSERT INTO public.exercises (name, description, category, is_global) VALUES (
  'Heel Raises da Gradino',
  'In piedi su un gradino con la punta del piede, solleva e abbassa i talloni con escursione completa. Massima escursione, pausa di 1 secondo in alto. Serie: 3x15. Superset con SL Bridge.',
  'lower_body',
  true
);

INSERT INTO public.exercises (name, description, category, is_global) VALUES (
  'SL Bridge',
  'Supino, un piede a terra, l''altro sollevato. Solleva i fianchi contraendo il gluteo. Contrazione massima in alto 2 secondi, non ruotare il bacino. Serie: 3x8. Superset con Heel Raises.',
  'lower_body',
  true
);

-- REHAB B: Core + Ginocchio + Anca + BFR

INSERT INTO public.exercises (name, description, category, is_global) VALUES (
  'Plank Stacco Una Gamba',
  'In plank, solleva una gamba alla volta mantenendo la posizione per 30 secondi. Non far cedere i fianchi, core sempre attivo, respira regolare. Serie: 3x30". Superset con L Sit.',
  'core',
  true
);

INSERT INTO public.exercises (name, description, category, is_global) VALUES (
  'L Sit',
  'Seduto per terra, gambe distese, solleva tutto il corpo con le braccia. Ginocchia in massima estensione, piedi a martello. Non mollare mai, gambe che non si toccano. Serie: 3x30".',
  'core',
  true
);

INSERT INTO public.exercises (name, description, category, is_global) VALUES (
  'SLR',
  'Supino, gamba tesa. Solleva la gamba dritta fino a 45 gradi e mantieni 2 secondi. Ginocchio bloccato in estensione completa, contrazione del quadricipite. Serie: 3x10.',
  'lower_body',
  true
);

INSERT INTO public.exercises (name, description, category, is_global) VALUES (
  'SLR in Long Sitting a Muro',
  'Seduto con schiena contro il muro, gambe distese. Solleva la gamba dritta. Schiena contro il muro, contrazione massima del quadricipite in alto. Serie: 3x10.',
  'lower_body',
  true
);

INSERT INTO public.exercises (name, description, category, is_global) VALUES (
  'Clamshell',
  'Sul fianco, ginocchia piegate a 45 gradi. Apri il ginocchio superiore come una conchiglia. Piedi uniti, non ruotare il bacino, movimento controllato. Serie: 3x12.',
  'lower_body',
  true
);

INSERT INTO public.exercises (name, description, category, is_global) VALUES (
  'Squat BFR',
  'Squat con fasce BFR applicate alla parte superiore delle cosce. Schema rep: 30-15-15-15. Fasce strette a 7/10 percezione. Recupero 60" tra set. Non rimuovere le fasce tra i set. Ultimo esercizio della sessione.',
  'lower_body',
  true
);

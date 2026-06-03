-- ============================================================
-- Media (video YouTube + GIF) per gli esercizi della scheda palestra
-- Da eseguire nel Supabase SQL Editor DOPO insert_scheda_palestra.sql
--
-- Video: tutti i 15 esercizi (embed YouTube in-app).
-- GIF (hotlink fitnessprogramer.com): 12 esercizi.
-- 3 esercizi SENZA GIF, da rivedere (solo video):
--   - Alzate Frontali Inverse  (nessuna GIF a presa inversa disponibile)
--   - Rematore con Manubri      (GIF trovata = variante mono-braccio)
--   - Curl Seduto con Manubri   (GIF da confermare)
-- ============================================================

-- ---- Esercizi con video + GIF ----

UPDATE public.exercises SET
  video_url  = 'https://www.youtube.com/watch?v=Zi6c09DRGxk',
  image_urls = ARRAY['https://fitnessprogramer.com/wp-content/uploads/2021/02/Push-Up.gif']
WHERE lower(name) = 'piegamenti a terra';

UPDATE public.exercises SET
  video_url  = 'https://www.youtube.com/watch?v=qEwKCR5JCog',
  image_urls = ARRAY['https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Shoulder-Press.gif']
WHERE lower(name) = 'spinte con manubri';

UPDATE public.exercises SET
  video_url  = 'https://www.youtube.com/watch?v=6SS6K3lAwZ8',
  image_urls = ARRAY['https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Kickback.gif']
WHERE lower(name) = 'kick back tricipiti';

UPDATE public.exercises SET
  video_url  = 'https://www.youtube.com/watch?v=mc5fXk6voZU',
  image_urls = ARRAY['https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Triceps-Extension.gif']
WHERE lower(name) = 'french press con manubri';

UPDATE public.exercises SET
  video_url  = 'https://www.youtube.com/watch?v=TBNt2DBvkl4',
  image_urls = ARRAY['https://fitnessprogramer.com/wp-content/uploads/2022/02/Band-Seated-Row.gif']
WHERE lower(name) = 'pulley con elastico';

UPDATE public.exercises SET
  video_url  = 'https://www.youtube.com/watch?v=5YStMv6m2g8',
  image_urls = ARRAY['https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Pullover.gif']
WHERE lower(name) = 'pullover con manubrio';

UPDATE public.exercises SET
  video_url  = 'https://www.youtube.com/watch?v=zC3nLlEvin4',
  image_urls = ARRAY['https://fitnessprogramer.com/wp-content/uploads/2021/02/Hammer-Curl.gif']
WHERE lower(name) = 'hammer curl';

UPDATE public.exercises SET
  video_url  = 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
  image_urls = ARRAY['https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Lateral-Raise.gif']
WHERE lower(name) = 'alzate laterali con manubri';

UPDATE public.exercises SET
  video_url  = 'https://www.youtube.com/watch?v=-t7fuZ0KhDA',
  image_urls = ARRAY['https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Front-Raise.gif']
WHERE lower(name) = 'alzate frontali';

UPDATE public.exercises SET
  video_url  = 'https://www.youtube.com/watch?v=ttvfGg9d76c',
  image_urls = ARRAY['https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Reverse-Fly.gif']
WHERE lower(name) = 'alzate posteriori';

UPDATE public.exercises SET
  video_url  = 'https://www.youtube.com/watch?v=cZxtPxeR2H8',
  image_urls = ARRAY['https://fitnessprogramer.com/wp-content/uploads/2021/02/Superman.gif']
WHERE lower(name) = 'iperestensioni a terra';

UPDATE public.exercises SET
  video_url  = 'https://www.youtube.com/watch?v=0OxOI3sAIrM',
  image_urls = ARRAY['https://fitnessprogramer.com/wp-content/uploads/2015/11/Crunch.gif']
WHERE lower(name) = 'addominali a piacere';

-- ---- Esercizi SOLO video (GIF da rivedere) ----

UPDATE public.exercises SET
  video_url = 'https://www.youtube.com/watch?v=hjrNLPFsVtI'
WHERE lower(name) = 'alzate frontali inverse';

UPDATE public.exercises SET
  video_url = 'https://www.youtube.com/watch?v=pYcpY20QaE8'
WHERE lower(name) = 'rematore con manubri';

UPDATE public.exercises SET
  video_url = 'https://www.youtube.com/watch?v=BsULGO70tcU'
WHERE lower(name) = 'curl seduto con manubri';

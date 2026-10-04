import { defineMessages } from "../define";

const it = {
  loadError: "Non è stato possibile caricare i tuoi dati. Controlla la connessione e riprova.",
  retry: "Riprova",
  greeting: "Ciao,",
  subtitle: "Il tuo percorso di riabilitazione",
  thisWeek: "Questa settimana",
  lastSession: "Ultima sessione",
  exercises: (n: number) => `${n} esercizi`,
  active: "Attiva",
  reps: (n: number) => `${n} rep`,
  moreExercises: (n: number) => `+${n} altri esercizi`,
  startWorkout: "Inizia Workout",
  noPlan: "La tua fisioterapista non ha ancora assegnato una scheda",
};

export const dashboard = defineMessages<typeof it>({
  it,
  en: {
    loadError: "We couldn't load your data. Check your connection and try again.",
    retry: "Try again",
    greeting: "Hi,",
    subtitle: "Your rehabilitation journey",
    thisWeek: "This week",
    lastSession: "Last session",
    exercises: (n) => `${n} ${n === 1 ? "exercise" : "exercises"}`,
    active: "Active",
    reps: (n) => `${n} reps`,
    moreExercises: (n) => `+${n} more ${n === 1 ? "exercise" : "exercises"}`,
    startWorkout: "Start workout",
    noPlan: "Your physio hasn't assigned you a plan yet",
  },
  fr: {
    loadError: "Impossible de charger tes données. Vérifie ta connexion et réessaie.",
    retry: "Réessayer",
    greeting: "Salut,",
    subtitle: "Ton parcours de rééducation",
    thisWeek: "Cette semaine",
    lastSession: "Dernière séance",
    exercises: (n) => `${n} ${n === 1 ? "exercice" : "exercices"}`,
    active: "Active",
    reps: (n) => `${n} rép.`,
    moreExercises: (n) => `+${n} ${n === 1 ? "autre exercice" : "autres exercices"}`,
    startWorkout: "Commencer la séance",
    noPlan: "Ta kiné ne t'a pas encore attribué de programme",
  },
});

import { defineMessages } from "../define";

const it = {
  title: "Storico sessioni",
  empty: "Nessuna sessione completata..",
  session: "Sessione",
  pain: (score: number) => `Dolore: ${score}/10`,
  exercises: (n: number) => `${n} esercizi`,
};

export const history = defineMessages<typeof it>({
  it,
  en: {
    title: "Session history",
    empty: "No completed sessions yet.",
    session: "Session",
    pain: (score) => `Pain: ${score}/10`,
    exercises: (n) => `${n} ${n === 1 ? "exercise" : "exercises"}`,
  },
  fr: {
    title: "Historique des séances",
    empty: "Aucune séance terminée pour l'instant.",
    session: "Séance",
    pain: (score) => `Douleur : ${score}/10`,
    exercises: (n) => `${n} ${n === 1 ? "exercice" : "exercices"}`,
  },
});

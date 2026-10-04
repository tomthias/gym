import { defineMessages } from "../define";

const it = {
  nav: {
    label: "Navigazione principale",
    home: "Home",
    workout: "Workout",
    history: "Storico",
    nutrition: "Nutrizione",
    profile: "Profilo",
  },
  back: "Indietro",
  loading: "Caricamento…",
  yourPhysio: "Il tuo fisioterapista",
};

export const common = defineMessages<typeof it>({
  it,
  en: {
    nav: {
      label: "Main navigation",
      home: "Home",
      workout: "Workout",
      history: "History",
      nutrition: "Nutrition",
      profile: "Profile",
    },
    back: "Back",
    loading: "Loading…",
    yourPhysio: "Your physio",
  },
  fr: {
    nav: {
      label: "Navigation principale",
      home: "Accueil",
      workout: "Séance",
      history: "Historique",
      nutrition: "Nutrition",
      profile: "Profil",
    },
    back: "Retour",
    loading: "Chargement…",
    yourPhysio: "Ton kiné",
  },
});

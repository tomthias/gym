# 📁 Struttura Progetto

Organizzazione delle cartelle del progetto Scheda Allenamento Mattia.

## 🗂️ Struttura Cartelle

```
schedaPalestra/
├── 📄 index.html                # Home page (entry point)
├── 📄 manifest.json             # PWA manifest
├── 📄 service-worker.js         # Service worker per PWA
├── 📄 icon.svg                  # Icona app
│
├── 📁 pages/                    # Pagine HTML secondarie
│   ├── history.html
│   ├── nutrition.html
│   ├── workout-flow.html
│   └── todesign.html
│
├── 📁 css/                      # Tutti i file CSS
│   ├── shared.css
│   ├── home.css
│   ├── history.css
│   ├── nutrition.css
│   └── workout-flow.css
│
├── 📁 js/                       # JavaScript organizzato
│   ├── shared.js                # Utility condivise
│   ├── 📁 pages/                # JavaScript per le pagine
│   │   ├── home.js
│   │   ├── history.js
│   │   ├── nutrition.js
│   │   └── workout-flow.js
│   ├── 📁 data/                 # Dati statici
│   │   ├── exercises.js
│   │   └── nutrition.js
│   └── 📁 utils/                # Utility functions
│       └── workoutState.js
│
├── 📁 assets/                   # Assets statici
│   ├── 📁 icons/                # Icone SVG/PNG
│   └── 📁 images/
│       └── 📁 exercises/        # Immagini esercizi (locale)
│
├── 📁 workouts-data/            # Dati allenamenti (JSON)
│   ├── allenamento_a.json
│   ├── allenamento_b.json
│   └── ...
│
├── 📁 nutrition-data/           # Dati nutrizionali (JSON)
│   └── pasti.json
│
├── 📁 docs/                     # Documentazione
│   ├── README.md
│   ├── RECOVERY_DOCUMENTATION.md
│   ├── figma-prompt.md
│   └── BACKUP_allenamenti_originali_mattia.json
│
├── 📁 data/                     # Dati legacy (da verificare)
└── 📁 utils/                    # Utility legacy (da verificare)
```

## 🔄 Modifiche Recenti

### Ottobre 2025
- ✅ Spostati tutti i CSS in `/css/`
- ✅ Spostati tutti i JS delle pagine in `/js/pages/`
- ✅ Spostate le pagine HTML secondarie in `/pages/`
- ✅ Spostata la documentazione in `/docs/`
- ✅ Rinominate cartelle per consistenza:
  - `asset palestra` → `workouts-data`
  - `nutrizione assets` → `nutrition-data`
- ✅ Scaricate tutte le immagini degli esercizi in locale (`/assets/images/exercises/`)
- ✅ Aggiornati tutti i path relativi nei file HTML e JS

## 🧭 Path Relativi

### Da Root (index.html)
```html
<link rel="stylesheet" href="css/shared.css">
<script type="module" src="js/shared.js"></script>
```

### Da Pages/ (history.html, nutrition.html, workout-flow.html)
```html
<link rel="stylesheet" href="../css/shared.css">
<script type="module" src="../js/shared.js"></script>
```

## 🚀 Come Avviare

1. Apri `index.html` nel browser
2. Oppure usa un server locale:
   ```bash
   python3 -m http.server 8000
   # Vai su http://localhost:8000
   ```

## 📝 Note

- Tutte le immagini degli esercizi sono ora in locale
- I path sono gestiti dinamicamente in `shared.js` per navigazione corretta
- Il progetto è una PWA installabile

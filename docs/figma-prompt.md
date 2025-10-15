# Prompt per Figma Make - App Scheda Palestra

Crea un design UI/UX per un'applicazione mobile di allenamento in palestra con le seguenti caratteristiche:

## Pagine da creare:

### 1. Home / Dashboard
- Header con titolo "Scheda Allenamento"
- 3 card allenamenti con:
  - Titolo dell'allenamento (es. "Allenamento 1")
  - Giorno della settimana (es. "LUNEDÌ")
  - Tipo di allenamento (es. "Upper Body Push + Fisio 1")
  - Durata stimata (es. "75-85 minuti")
  - Progress bar con percentuale completamento (es. "0/24")
  - Pulsante "Avvia Allenamento"
- Navigazione bottom bar con 3 icone (Home, Cronologia, Impostazioni)

### 2. Dettaglio Allenamento
- Header con:
  - Pulsante indietro
  - Titolo allenamento
  - Pulsante reset (icona refresh)
- Timer circolare centrale con:
  - Tempo corrente visualizzato al centro
  - Cerchio di progresso animato
  - Pulsanti Play/Pause/Reset sotto il timer
- Sezioni espandibili (accordion) per gruppi di esercizi:
  - Riscaldamento (3 esercizi)
  - Fisioterapia (5 esercizi)
  - Push Exercises (6 esercizi)
  - Addominali (4 esercizi)
- Ogni esercizio con:
  - Checkbox circolare (unchecked: cerchio grigio con bordo, checked: cerchio verde con checkmark)
  - Nome esercizio
  - Dettagli (serie, ripetizioni, tempo)
  - Icona info circolare cliccabile

### 3. Modal Dettaglio Esercizio
- Overlay scuro semi-trasparente
- Card centrata con:
  - Pulsante chiudi (X) in alto a destra
  - Titolo esercizio grande
  - Sezioni con icone per:
    - Serie e ripetizioni
    - Tempo di recupero
    - Note/istruzioni
  - Sfondo scuro con testo chiaro

### 4. Timer View (durante allenamento attivo)
- Timer fullscreen circolare molto grande
- Tempo in formato MM:SS al centro
- Cerchio di progresso animato verde
- Pulsanti Play/Pause grandi e visibili
- Pulsante Reset secondario

## Palette Colori:
- **Primary Green**: #4CAF50
- **Background Dark**: #1a1a1a
- **Card Background**: #2a2a2a
- **Secondary Background**: #2d2d2d
- **Text Primary**: #ffffff
- **Text Secondary**: #aaaaaa
- **Border**: #444444
- **Accent Blue**: #2196F3

## Stile e Design:
- Dark theme moderno
- Card con bordi arrotondati (16px radius)
- Gradienti sottili per le card
- Shadow leggere per profondità
- Font: System fonts (San Francisco per iOS, Roboto per Android)
- Icone minimali e moderne
- Animazioni fluide per transizioni
- Design mobile-first (375px width standard)

## Componenti Chiave:
- Checkbox circolari custom
- Progress bar lineari e circolari
- Accordion espandibili
- Bottom navigation bar
- Modal overlay
- Timer circolare con SVG
- Pulsanti con stati hover/active/disabled

## Interazioni da rappresentare:
- Stati di checkbox (checked/unchecked)
- Sezioni accordion (espanse/collassate)
- Progress bar a diverse percentuali (0%, 50%, 100%)
- Timer in diversi stati (inattivo, in esecuzione, in pausa)

Crea mockup ad alta fedeltà per tutte queste schermate, mostrando gli stati principali e le interazioni chiave.

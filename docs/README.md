# 💪 Scheda Allenamento Mattia

App web per seguire la tua scheda di allenamento personalizzata con integrazione esercizi fisioterapia.

## ✨ Features

### 🏠 **Dashboard Principale**
- **Calendario settimanale** con evidenziazione giorno corrente
- **3 Allenamenti completi** (A, B, C)
- **Progress bar** che mostra quanti esercizi hai completato
- **Navigazione bottom** per Home, Storico, Reset

### 🏋️ **Allenamenti**
- **Allenamento A** (Lunedì): Upper Body Push + Fisio 1 - 75-85 min
- **Allenamento B** (Mercoledì): Upper Body Pull + Fisio 2 - 70-80 min
- **Allenamento C** (Sabato): Total Body Leggero OPZIONALE - 45-50 min

### ⏱️ **Timer Integrati**
- **Timer Tabata**: 20" lavoro / 10" riposo per 4 minuti
  - Rotazione automatica esercizi addominali
  - Allarmi sonori e vibrazione
  - Pausa/Play/Stop
- **Timer Recuperi**: Avvia countdown per ogni esercizio
  - Toast floating con tempo rimanente
  - Vibrazione fine recupero

### 📊 **Tracking & Progressi**
- **Checklist interattiva** per ogni esercizio
- **Salvataggio automatico** progressi (localStorage)
- **Pagina Storico** con tutti gli allenamenti completati
- **Dettagli completi** per ogni esercizio (serie, carico, recupero, tecnica)

### 🎨 **Design**
- **Mobile-first** ottimizzato per telefono
- **PWA** - Può essere aggiunta alla home screen
- **Offline** - Funziona senza connessione
- **Dark mode** con temi colorati
- **Haptic feedback** (vibrazione su tap)

## 📱 Come Usarla

### Installazione su Google Pixel

1. **Trasferisci il file** sul telefono:
   - Email, Google Drive, o cavo USB
   - Oppure hosla su un server web

2. **Apri con Chrome**:
   - Apri `scheda-palestra.html` con Chrome

3. **Aggiungi alla Home Screen**:
   - Tap sul menu (⋮) in alto a destra
   - "Aggiungi a schermata Home"
   - Inserisci nome (es. "Palestra")
   - Tap "Aggiungi"

4. **Usa come app**:
   - Tocca l'icona dalla home
   - Si apre fullscreen come app nativa

### Utilizzo Durante l'Allenamento

#### **Home Screen**
- Vedi il **calendario settimanale** con giorni allenamento evidenziati
- Oggi è evidenziato con **bordo dorato**
- Tap su una card allenamento per iniziare

#### **Durante l'Allenamento**
1. **Tap su esercizio** per spuntare come completato
2. **Tap su ℹ️** per vedere dettagli completi (come si fa, tecnica, focus)
3. Le **sezioni sono espandibili** - tap sull'header per aprire/chiudere
4. **Blocchi fisioterapia** evidenziati in arancione (NON modificabili)

#### **Timer Tabata** (Allenamento A - Addominali)
1. Tap su **"⏱️ Avvia Timer Tabata"**
2. Timer parte automaticamente: 20" lavoro / 10" riposo
3. Rotazione automatica: V-up → Crunch → Biciclette → Plank
4. **Pausa** in qualsiasi momento
5. **Beep sonoro** e **vibrazione** a ogni cambio fase
6. 8 round totali = 4 minuti

#### **Bottom Navigation**
- **🏠** Home - Torna alla lista allenamenti
- **📊** Storico - Vedi allenamenti passati
- **🔄** Reset - Azzera tutti i progressi (chiede conferma)

## 🎯 Struttura Allenamenti

### **Allenamento A - Lunedì**
1. **Riscaldamento** (10 min)
   - Bike, circonduzione braccia, mobilità
2. **Fisioterapia Scheda 1** (25 min) 🟡
   - SL Heel Raises, Box Bridge, Hip Thrust, Side Walk, Elvis
3. **Upper Body Push** (35 min)
   - Panca piana, croci, military press, alzate laterali, tricipiti
4. **Addominali Tabata** (4 min)
   - Timer automatico integrato

### **Allenamento B - Mercoledì**
1. **Riscaldamento** (8 min)
   - Bike, cat-cow, dead bug
2. **Fisioterapia Scheda 2** (25 min) 🟡
   - Plank + estensione, L-sit, squat tempo, wall sit, affondo
3. **Upper Body Pull** (30 min)
   - Trazioni, pulley, curl bicipiti, hammer curl, avambracci
4. **Addominali Avanzati** (12 min)
   - Hollow hold, reverse crunch, plank laterale

### **Allenamento C - Sabato (Opzionale)**
1. **Cardio** (15 min)
2. **Spalle + Avambracci** (20 min)
3. **Core** (10 min)

## ⚠️ Note Importanti

### **Esercizi Fisioterapia** 🟡
- **ORDINE MEDICO** - NON modificare
- Evidenziati con **sfondo arancione**
- Serie, ripetizioni, carichi esatti come prescritto
- Priorità assoluta su tutto il resto

### **Vincoli LCA** (Crociato Anteriore)
- ✅ **Sicuri**: Bike, upper body, plank, hip thrust, wall sit
- ❌ **Evitare**: Salti, pliometrici, rotazioni sotto carico, sprint

## 🔧 Funzionalità Tecniche

- **localStorage** per salvare progressi
- **PWA manifest** per installazione home screen
- **Offline capability** - dati salvati localmente
- **Responsive design** mobile-first
- **Vibration API** per feedback tattile
- **Web Audio API** per beep timer

## 📊 Dati Salvati

L'app salva localmente:
- ✅ Checklist esercizi completati
- 📅 Storico allenamenti con date
- 💪 Log carichi per esercizio (futuro)

## 🚀 Aggiornamenti Futuri

- [ ] Input log carichi per esercizio
- [ ] Grafici progressione
- [ ] Suggerimenti aumento carichi automatici
- [ ] Notifiche promemoria giorni allenamento
- [ ] Export dati CSV
- [ ] Immagini/GIF esercizi

## 📄 Licenza

Uso personale - Mattia

---

**Versione**: 2.0
**Ultima modifica**: Ottobre 2025
**Made with**: HTML, CSS, JavaScript vanilla ⚡

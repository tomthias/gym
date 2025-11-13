// ========== SESSION LOADER UTILITY ==========
// Utility per caricare dinamicamente le sessioni settimanali dai file JSON

/**
 * Struttura settimanale delle 9 sessioni
 * Ogni giorno può avere 1 o 2 sessioni
 */
export const WEEKLY_STRUCTURE = {
    lunedi: {
        nome: 'Lunedì',
        sessioni: [
            { id: 'lunedi_fisio_1', file: 'lunedi_fisio_1.json', turno: 'mattina', tipo: 'fisioterapia' },
            { id: 'lunedi_corda', file: 'lunedi_corda.json', turno: 'pomeriggio', tipo: 'arrampicata_corda' }
        ]
    },
    martedi: {
        nome: 'Martedì',
        sessioni: [
            { id: 'martedi_boulder_1', file: 'martedi_boulder_1.json', turno: 'tutto_giorno', tipo: 'arrampicata_boulder' }
        ]
    },
    mercoledi: {
        nome: 'Mercoledì',
        sessioni: [
            { id: 'mercoledi_off', file: 'mercoledi_off.json', turno: 'tutto_giorno', tipo: 'riposo' }
        ]
    },
    giovedi: {
        nome: 'Giovedì',
        sessioni: [
            { id: 'giovedi_fisio_2', file: 'giovedi_fisio_2.json', turno: 'mattina', tipo: 'fisioterapia' },
            { id: 'giovedi_boulder_2', file: 'giovedi_boulder_2.json', turno: 'pomeriggio', tipo: 'arrampicata_boulder' }
        ]
    },
    venerdi: {
        nome: 'Venerdì',
        sessioni: [
            { id: 'venerdi_scarico', file: 'venerdi_scarico.json', turno: 'tutto_giorno', tipo: 'recupero' }
        ]
    },
    sabato: {
        nome: 'Sabato',
        sessioni: [
            { id: 'sabato_montagna', file: 'sabato_montagna.json', turno: 'tutto_giorno', tipo: 'arrampicata_outdoor' }
        ]
    },
    domenica: {
        nome: 'Domenica',
        sessioni: [
            { id: 'domenica_variabile', file: 'domenica_variabile.json', turno: 'tutto_giorno', tipo: 'variabile' }
        ]
    }
};

/**
 * Colori per tipo di sessione
 */
export const SESSION_COLORS = {
    fisioterapia: '#20B2AA',      // Teal - medico/fisio
    arrampicata_corda: '#FFB347',  // Yellow - corda
    arrampicata_boulder: '#FF6B35', // Orange - boulder intenso
    arrampicata_outdoor: '#4169E1', // Blue - outdoor
    riposo: '#808080',             // Gray - riposo
    recupero: '#90EE90',           // Light green - active recovery
    variabile: '#DDA0DD'           // Plum - variabile
};

/**
 * Icon names for session types (SVG-based)
 */
export const SESSION_ICONS = {
    fisioterapia: 'physio',
    arrampicata_corda: 'rope',
    arrampicata_boulder: 'boulder',
    arrampicata_outdoor: 'mountain',
    riposo: 'rest',
    recupero: 'recovery',
    variabile: 'variable'
};

/**
 * Cache per i dati delle sessioni caricate
 */
let sessionCache = {};

/**
 * Carica tutti i JSON delle sessioni
 * @returns {Promise<Object>} Oggetto con tutte le sessioni caricate
 */
export async function loadAllSessions() {
    const allSessions = {};

    for (const [giornoKey, giornoData] of Object.entries(WEEKLY_STRUCTURE)) {
        allSessions[giornoKey] = {
            ...giornoData,
            sessioni: await Promise.all(
                giornoData.sessioni.map(async (sessione) => {
                    const data = await loadSessionData(sessione.file);
                    return {
                        ...sessione,
                        data: data
                    };
                })
            )
        };
    }

    return allSessions;
}

/**
 * Carica i dati di una singola sessione dal JSON
 * @param {string} filename - Nome del file JSON
 * @returns {Promise<Object>} Dati della sessione
 */
export async function loadSessionData(filename) {
    // Check cache
    if (sessionCache[filename]) {
        return sessionCache[filename];
    }

    try {
        const response = await fetch(`/workouts-data/${filename}`);
        if (!response.ok) {
            throw new Error(`Failed to load ${filename}: ${response.statusText}`);
        }
        const data = await response.json();

        // Cache the result
        sessionCache[filename] = data;
        return data;
    } catch (error) {
        console.error(`Error loading session ${filename}:`, error);
        return null;
    }
}

/**
 * Ottiene informazioni su una specifica sessione
 * @param {string} sessionId - ID della sessione (es. 'lunedi_fisio_1')
 * @returns {Object|null} Info sulla sessione
 */
export function getSessionInfo(sessionId) {
    for (const giornoData of Object.values(WEEKLY_STRUCTURE)) {
        const sessione = giornoData.sessioni.find(s => s.id === sessionId);
        if (sessione) {
            return {
                ...sessione,
                giorno: giornoData.nome
            };
        }
    }
    return null;
}

/**
 * Ottiene il numero del giorno della settimana (0-6, 0=Domenica)
 * @returns {number}
 */
export function getCurrentDayOfWeek() {
    return new Date().getDay();
}

/**
 * Mappa numero giorno → chiave italiana
 */
const DAY_MAP = {
    0: 'domenica',
    1: 'lunedi',
    2: 'martedi',
    3: 'mercoledi',
    4: 'giovedi',
    5: 'venerdi',
    6: 'sabato'
};

/**
 * Ottiene la chiave del giorno corrente
 * @returns {string} Chiave giorno (es. 'lunedi')
 */
export function getCurrentDayKey() {
    return DAY_MAP[getCurrentDayOfWeek()];
}

/**
 * Ottiene il nome del giorno corrente
 * @returns {string} Nome giorno (es. 'Lunedì')
 */
export function getCurrentDayName() {
    const key = getCurrentDayKey();
    return WEEKLY_STRUCTURE[key]?.nome || '';
}

/**
 * Verifica se una sessione è completata
 * @param {string} sessionId - ID della sessione
 * @param {string} date - Data in formato YYYY-MM-DD (opzionale, default oggi)
 * @returns {boolean}
 */
export function isSessionCompleted(sessionId, date = getTodayDate()) {
    const history = JSON.parse(localStorage.getItem('sessionHistory') || '{}');
    return history[date]?.[sessionId]?.completed === true;
}

/**
 * Marca una sessione come completata
 * @param {string} sessionId - ID della sessione
 * @param {Object} sessionData - Dati aggiuntivi (duration, grade, etc.)
 * @param {string} date - Data in formato YYYY-MM-DD (opzionale, default oggi)
 */
export function markSessionCompleted(sessionId, sessionData = {}, date = getTodayDate()) {
    const history = JSON.parse(localStorage.getItem('sessionHistory') || '{}');

    if (!history[date]) {
        history[date] = {};
    }

    history[date][sessionId] = {
        completed: true,
        timestamp: new Date().toISOString(),
        ...sessionData
    };

    localStorage.setItem('sessionHistory', JSON.stringify(history));
}

/**
 * Ottiene la data odierna in formato YYYY-MM-DD
 * @returns {string}
 */
export function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

/**
 * Calcola le statistiche settimanali
 * @param {string} weekStart - Data inizio settimana YYYY-MM-DD (opzionale)
 * @returns {Object} Statistiche
 */
export function getWeeklyStats(weekStart = null) {
    const history = JSON.parse(localStorage.getItem('sessionHistory') || '{}');

    // Se non specificato, usa la settimana corrente
    if (!weekStart) {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const monday = new Date(today);
        monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
        weekStart = monday.toISOString().split('T')[0];
    }

    // Conta sessioni completate nella settimana
    let completedCount = 0;
    const totalSessions = 9;

    // Itera sui 7 giorni della settimana
    for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];

        const dayData = history[dateStr];
        if (dayData) {
            completedCount += Object.values(dayData).filter(s => s.completed).length;
        }
    }

    return {
        completed: completedCount,
        total: totalSessions,
        percentage: Math.round((completedCount / totalSessions) * 100)
    };
}

/**
 * Reset di tutto lo storico (per testing o nuovo inizio)
 */
export function resetAllSessionHistory() {
    if (confirm('Vuoi resettare tutto lo storico delle sessioni? Questa azione non può essere annullata.')) {
        localStorage.removeItem('sessionHistory');
        console.log('Storico sessioni resettato');
        return true;
    }
    return false;
}

/**
 * Esporta dati per debug
 */
export function exportSessionHistory() {
    const history = localStorage.getItem('sessionHistory');
    console.log('Session History:', history);
    return history;
}

// ========== WEEKLY SCHEDULE UI LOGIC ==========

import {
    WEEKLY_STRUCTURE,
    SESSION_COLORS,
    SESSION_EMOJI,
    loadAllSessions,
    getCurrentDayKey,
    isSessionCompleted,
    getWeeklyStats,
    getTodayDate
} from '../utils/session-loader.js';

/**
 * Dati delle sessioni caricati
 */
let weeklySessionsData = null;

/**
 * Inizializza il calendario settimanale
 */
export async function initWeeklySchedule() {
    console.log('Inizializzazione weekly schedule...');

    // Carica tutti i dati delle sessioni
    try {
        weeklySessionsData = await loadAllSessions();
        console.log('Sessioni caricate:', weeklySessionsData);
    } catch (error) {
        console.error('Errore caricamento sessioni:', error);
        showError('Errore nel caricamento delle sessioni. Riprova.');
        return;
    }

    // Render della UI
    renderWeeklyList();
    renderWeeklyStats();
    highlightCurrentDay();
}

/**
 * Render della lista settimanale (7 giorni)
 */
function renderWeeklyList() {
    const container = document.getElementById('weeklyListContainer');
    if (!container) {
        console.error('Container weeklyListContainer non trovato');
        return;
    }

    container.innerHTML = '';

    const currentDayKey = getCurrentDayKey();
    const today = getTodayDate();

    // Ordine giorni: Lunedì → Domenica
    const giorniOrdinati = ['lunedi', 'martedi', 'mercoledi', 'giovedi', 'venerdi', 'sabato', 'domenica'];

    giorniOrdinati.forEach(giornoKey => {
        const giornoData = weeklySessionsData[giornoKey];
        if (!giornoData) return;

        const isToday = giornoKey === currentDayKey;

        // Container giorno
        const dayCard = document.createElement('div');
        dayCard.className = `day-card ${isToday ? 'day-today' : ''}`;
        dayCard.id = `day-${giornoKey}`;

        // Header giorno
        const dayHeader = document.createElement('div');
        dayHeader.className = 'day-header';

        const dayTitle = document.createElement('h2');
        dayTitle.className = 'day-title';
        dayTitle.textContent = giornoData.nome;
        if (isToday) {
            dayTitle.innerHTML += ' <span class="badge-today">Oggi</span>';
        }

        // Badge numero sessioni
        const sessionsCount = giornoData.sessioni.length;
        const completedCount = giornoData.sessioni.filter(s => isSessionCompleted(s.id, today)).length;

        const sessionsBadge = document.createElement('span');
        sessionsBadge.className = 'sessions-badge';
        sessionsBadge.textContent = `${completedCount}/${sessionsCount}`;
        if (completedCount === sessionsCount && sessionsCount > 0) {
            sessionsBadge.classList.add('all-completed');
        }

        dayHeader.appendChild(dayTitle);
        dayHeader.appendChild(sessionsBadge);
        dayCard.appendChild(dayHeader);

        // Render sessioni del giorno
        const sessionsContainer = document.createElement('div');
        sessionsContainer.className = 'sessions-container';

        giornoData.sessioni.forEach(sessione => {
            const sessionCard = renderSessionCard(sessione, giornoKey);
            sessionsContainer.appendChild(sessionCard);
        });

        dayCard.appendChild(sessionsContainer);
        container.appendChild(dayCard);
    });
}

/**
 * Render di una singola session card
 */
function renderSessionCard(sessione, giornoKey) {
    const sessionData = sessione.data;
    const isCompleted = isSessionCompleted(sessione.id);
    const today = getTodayDate();

    const card = document.createElement('div');
    card.className = `session-card session-type-${sessione.tipo} ${isCompleted ? 'session-completed' : ''}`;
    card.style.borderLeftColor = SESSION_COLORS[sessione.tipo];

    // Badge turno (mattina/pomeriggio)
    if (sessione.turno !== 'tutto_giorno') {
        const turnoBadge = document.createElement('span');
        turnoBadge.className = `turno-badge turno-${sessione.turno}`;
        turnoBadge.textContent = sessione.turno === 'mattina' ? '☀️ Mattina' : '🌙 Pomeriggio';
        card.appendChild(turnoBadge);
    }

    // Emoji tipo
    const emoji = document.createElement('span');
    emoji.className = 'session-emoji';
    emoji.textContent = SESSION_EMOJI[sessione.tipo];
    card.appendChild(emoji);

    // Titolo sessione
    const title = document.createElement('h3');
    title.className = 'session-title';
    title.textContent = sessionData?.nome || sessione.id;
    card.appendChild(title);

    // Durata
    if (sessionData?.durata) {
        const duration = document.createElement('p');
        duration.className = 'session-duration';
        duration.innerHTML = `⏱️ ${sessionData.durata}`;
        card.appendChild(duration);
    }

    // Focus tags
    if (sessionData?.focus && Array.isArray(sessionData.focus)) {
        const focusTags = document.createElement('div');
        focusTags.className = 'focus-tags';
        sessionData.focus.slice(0, 3).forEach(f => {
            const tag = document.createElement('span');
            tag.className = 'focus-tag';
            tag.textContent = f;
            focusTags.appendChild(tag);
        });
        card.appendChild(focusTags);
    }

    // Validazioni e warning
    if (sessione.tipo === 'riposo') {
        const restWarning = document.createElement('div');
        restWarning.className = 'session-warning';
        restWarning.innerHTML = '⚠️ Giorno OFF obbligatorio';
        card.appendChild(restWarning);
    }

    if (sessionData?.obbligatorio) {
        const mandatoryBadge = document.createElement('span');
        mandatoryBadge.className = 'mandatory-badge';
        mandatoryBadge.textContent = 'Obbligatorio';
        card.appendChild(mandatoryBadge);
    }

    // Bottone azione
    const actionButton = document.createElement('button');
    actionButton.className = `btn-start-session ${isCompleted ? 'btn-completed' : ''}`;

    if (isCompleted) {
        actionButton.innerHTML = '✓ Completata';
        actionButton.disabled = false;
        actionButton.onclick = () => {
            if (confirm('Vuoi riaprire questa sessione?')) {
                startSession(sessione.id, giornoKey);
            }
        };
    } else {
        actionButton.textContent = 'Inizia Sessione';
        actionButton.onclick = () => startSession(sessione.id, giornoKey);
    }

    card.appendChild(actionButton);

    // Checkbox per completamento rapido
    if (isCompleted) {
        const checkmark = document.createElement('div');
        checkmark.className = 'session-checkmark';
        checkmark.innerHTML = '✓';
        card.appendChild(checkmark);
    }

    return card;
}

/**
 * Avvia una sessione (naviga al workout flow)
 */
function startSession(sessionId, giornoKey) {
    console.log(`Avvio sessione: ${sessionId} (${giornoKey})`);

    // Salva stato corrente
    localStorage.setItem('currentSession', JSON.stringify({
        sessionId: sessionId,
        giorno: giornoKey,
        startTime: new Date().toISOString()
    }));

    // Naviga alla pagina workout-flow
    window.location.href = `pages/workout-flow.html?session=${sessionId}`;
}

/**
 * Evidenzia il giorno corrente
 */
function highlightCurrentDay() {
    const currentDayKey = getCurrentDayKey();
    const dayCard = document.getElementById(`day-${currentDayKey}`);
    if (dayCard) {
        dayCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

/**
 * Render statistiche settimanali
 */
function renderWeeklyStats() {
    const statsContainer = document.getElementById('weeklyStats');
    if (!statsContainer) return;

    const stats = getWeeklyStats();

    statsContainer.innerHTML = `
        <div class="stat-item">
            <span class="stat-label">Sessioni Completate:</span>
            <span class="stat-value">${stats.completed}/${stats.total}</span>
        </div>
        <div class="stat-progress">
            <div class="stat-progress-bar" style="width: ${stats.percentage}%"></div>
        </div>
        <div class="stat-percentage">${stats.percentage}%</div>
    `;
}

/**
 * Mostra errore
 */
function showError(message) {
    const container = document.getElementById('weeklyListContainer');
    if (container) {
        container.innerHTML = `
            <div class="error-message">
                <p>⚠️ ${message}</p>
            </div>
        `;
    }
}

/**
 * Refresh della UI (da chiamare dopo completamento sessione)
 */
export function refreshWeeklySchedule() {
    renderWeeklyList();
    renderWeeklyStats();
}

// Esporta per uso globale
window.startSession = startSession;
window.refreshWeeklySchedule = refreshWeeklySchedule;

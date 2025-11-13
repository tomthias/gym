// ========== WORKOUT FLOW LOGIC - SESSION BASED ==========

import { getUrlParameter } from '../shared.js';
import { loadSessionData, getSessionInfo, markSessionCompleted, getTodayDate } from '../utils/session-loader.js';
import { exerciseData } from '../data/exercises.js';

/**
 * Session Flow State
 */
let sessionFlowState = {
    sessionId: null,
    sessionData: null,
    sessionInfo: null,
    currentPhaseIndex: 0,
    currentExerciseIndex: 0,
    currentSet: 1,
    totalSets: 0,
    exercises: [],
    startTime: null
};

/**
 * Timer State
 */
let timerState = {
    seconds: 0,
    interval: null,
    isRunning: false,
    mode: 'stopwatch' // 'stopwatch' or 'countdown'
};

/**
 * Wake Lock
 */
let wakeLock = null;

/**
 * Initialize Session Flow
 */
async function initSessionFlow() {
    console.log('Inizializzazione session flow...');

    // Get session ID from URL
    const sessionId = getUrlParameter('session');
    if (!sessionId) {
        showError('Sessione non specificata. Torna alla home.');
        return;
    }

    // Load session data
    try {
        const sessionInfo = getSessionInfo(sessionId);
        if (!sessionInfo) {
            throw new Error('Sessione non trovata');
        }

        const sessionData = await loadSessionData(sessionInfo.file);
        if (!sessionData) {
            throw new Error('Impossibile caricare i dati della sessione');
        }

        // Initialize state
        sessionFlowState.sessionId = sessionId;
        sessionFlowState.sessionData = sessionData;
        sessionFlowState.sessionInfo = sessionInfo;
        sessionFlowState.startTime = new Date().toISOString();
        sessionFlowState.exercises = extractExercisesFromSession(sessionData);

        console.log('Sessione caricata:', sessionData);
        console.log('Esercizi estratti:', sessionFlowState.exercises);

        // Render UI
        renderSessionHeader();
        renderSessionExercises();

        // Request wake lock
        await requestWakeLock();

    } catch (error) {
        console.error('Errore caricamento sessione:', error);
        showError(`Errore: ${error.message}`);
    }
}

/**
 * Extract exercises from session JSON structure
 */
function extractExercisesFromSession(sessionData) {
    const exercises = [];
    let exerciseCounter = 0;

    // Handle different session types
    if (sessionData.fasi) {
        // Iterate through phases (riscaldamento, fisioterapia, etc.)
        Object.entries(sessionData.fasi).forEach(([phaseName, phaseData]) => {
            if (phaseData.esercizi && Array.isArray(phaseData.esercizi)) {
                phaseData.esercizi.forEach((esercizio, idx) => {
                    exercises.push({
                        id: `${phaseName}-${idx}`,
                        name: esercizio.nome,
                        phase: phaseName,
                        phaseName: phaseData.nome || phaseName,
                        ...esercizio,
                        index: exerciseCounter++
                    });
                });
            }
        });
    }

    return exercises;
}

/**
 * Render session header
 */
function renderSessionHeader() {
    const header = document.getElementById('sessionHeader');
    if (!header) return;

    const { sessionData, sessionInfo } = sessionFlowState;

    header.innerHTML = `
        <div class="session-header">
            <button onclick="confirmExitSession()" class="btn-back">← Indietro</button>
            <div class="session-title">
                <h1>${sessionData.nome || sessionInfo.id}</h1>
                <p class="session-meta">${sessionData.giorno || ''} ${sessionData.sessione ? '- ' + sessionData.sessione : ''}</p>
                <p class="session-duration">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                        <polyline points="12 6 12 12 16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    ${sessionData.durata || 'N/A'}
                </p>
            </div>
        </div>
    `;
}

/**
 * Render session exercises
 */
function renderSessionExercises() {
    const container = document.getElementById('exercisesContainer');
    if (!container) return;

    const { exercises } = sessionFlowState;

    if (exercises.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>Nessun esercizio definito per questa sessione.</p>
                <p class="info-text">Questa potrebbe essere una sessione di riposo o con istruzioni generali.</p>
                ${renderSessionNotes()}
                <button onclick="completeSession()" class="btn-complete-session">
                    Completa Sessione
                </button>
            </div>
        `;
        return;
    }

    let html = '<div class="exercises-list">';

    let currentPhase = null;
    exercises.forEach((exercise, idx) => {
        // Phase header
        if (exercise.phase !== currentPhase) {
            if (currentPhase !== null) {
                html += '</div>'; // Close previous phase
            }
            html += `
                <div class="phase-section">
                    <h2 class="phase-header">${exercise.phaseName || exercise.phase}</h2>
                    <div class="phase-exercises">
            `;
            currentPhase = exercise.phase;
        }

        // Exercise card
        html += renderExerciseCard(exercise, idx);
    });

    html += '</div></div></div>'; // Close last phase and list
    html += renderSessionNotes();
    html += `
        <div class="session-actions">
            <button onclick="completeSession()" class="btn-complete-session" aria-label="Completa sessione">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Completa Sessione
            </button>
        </div>
    `;

    container.innerHTML = html;
}

/**
 * Render single exercise card
 */
function renderExerciseCard(exercise, idx) {
    const detailsExist = exerciseData[exercise.key];

    return `
        <div class="exercise-card" id="exercise-${idx}">
            <div class="exercise-header">
                <h3 class="exercise-name">${exercise.name}</h3>
                ${exercise.serie_reps ? `<span class="exercise-sets">${exercise.serie_reps}</span>` : ''}
            </div>

            ${exercise.focus ? `<p class="exercise-focus">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    <circle cx="12" cy="12" r="6" stroke="currentColor" stroke-width="2"/>
                    <circle cx="12" cy="12" r="2" stroke="currentColor" stroke-width="2"/>
                </svg>
                ${exercise.focus}
            </p>` : ''}

            ${exercise.tecnica ? `
                <div class="exercise-technique">
                    <strong>Tecnica:</strong> ${exercise.tecnica}
                </div>
            ` : ''}

            ${exercise.note ? `<p class="exercise-note">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    <line x1="12" y1="16" x2="12" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <line x1="12" y1="8" x2="12.01" y2="8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                ${exercise.note}
            </p>` : ''}

            ${exercise.carico ? `<p class="exercise-load">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="9" y1="4" x2="9" y2="20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <line x1="15" y1="4" x2="15" y2="20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <line x1="4" y1="9" x2="20" y2="9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <line x1="4" y1="15" x2="20" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                ${exercise.carico}
            </p>` : ''}

            ${exercise.rest ? `<p class="exercise-rest">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    <polyline points="12 6 12 12 16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                Recupero: ${exercise.rest}
            </p>` : ''}

            ${detailsExist ? `
                <button onclick="showExerciseDetails('${exercise.key}')" class="btn-details" aria-label="Vedi dettagli esercizio">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Vedi Dettagli
                </button>
            ` : ''}

            <div class="exercise-checkbox">
                <label>
                    <input type="checkbox" id="check-${idx}" onchange="updateProgress()">
                    <span>Completato</span>
                </label>
            </div>
        </div>
    `;
}

/**
 * Render session notes/warnings
 */
function renderSessionNotes() {
    const { sessionData } = sessionFlowState;
    let html = '';

    if (sessionData.warnings) {
        html += '<div class="session-warnings">';
        html += `<h3>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" stroke-width="2"/>
                <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" stroke-width="2"/>
                <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" stroke-width="2"/>
            </svg>
            Avvisi Importanti
        </h3>`;

        if (sessionData.warnings.stop_signals) {
            html += '<div class="warning-box">';
            html += '<strong>Segnali di Stop:</strong><ul>';
            sessionData.warnings.stop_signals.forEach(signal => {
                html += `<li>${signal}</li>`;
            });
            html += '</ul></div>';
        }

        if (sessionData.warnings.spacing) {
            html += `<div class="warning-box spacing">${sessionData.warnings.spacing}</div>`;
        }

        html += '</div>';
    }

    if (sessionData.nota) {
        html += `<div class="session-note-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <polyline points="14 2 14 8 20 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            ${sessionData.nota}
        </div>`;
    }

    return html;
}

/**
 * Show exercise details modal
 */
function showExerciseDetails(exerciseKey) {
    const details = exerciseData[exerciseKey];
    if (!details) return;

    const modal = document.getElementById('exerciseModal') || createExerciseModal();
    const modalContent = modal.querySelector('.modal-content');

    modalContent.innerHTML = `
        <span class="close-modal" onclick="closeExerciseModal()">&times;</span>
        <h2>${details.name}</h2>
        ${details.image ? `<img src="${details.image}" alt="${details.name}" class="exercise-image">` : ''}
        ${details.come ? `<p><strong>Come:</strong> ${details.come}</p>` : ''}
        ${details.tecnica ? `<p><strong>Tecnica:</strong> ${details.tecnica}</p>` : ''}
        ${details.focus ? `<p><strong>Focus:</strong> ${details.focus}</p>` : ''}
        ${details.note ? `<p><strong>Note:</strong> ${details.note}</p>` : ''}
    `;

    modal.style.display = 'block';
}

/**
 * Create exercise modal if doesn't exist
 */
function createExerciseModal() {
    const modal = document.createElement('div');
    modal.id = 'exerciseModal';
    modal.className = 'modal';
    modal.innerHTML = '<div class="modal-content"></div>';
    modal.onclick = (e) => {
        if (e.target === modal) closeExerciseModal();
    };
    document.body.appendChild(modal);
    return modal;
}

/**
 * Close exercise modal
 */
function closeExerciseModal() {
    const modal = document.getElementById('exerciseModal');
    if (modal) modal.style.display = 'none';
}

/**
 * Update progress counter
 */
function updateProgress() {
    const total = sessionFlowState.exercises.length;
    if (total === 0) return;

    let completed = 0;
    for (let i = 0; i < total; i++) {
        const checkbox = document.getElementById(`check-${i}`);
        if (checkbox && checkbox.checked) completed++;
    }

    const progressText = document.querySelector('.progress-text');
    if (progressText) {
        progressText.textContent = `${completed}/${total} esercizi completati`;
    }

    // Update progress bar if exists
    const progressBar = document.querySelector('.progress-bar-fill');
    if (progressBar) {
        const percentage = (completed / total) * 100;
        progressBar.style.width = `${percentage}%`;
    }
}

/**
 * Complete session
 */
function completeSession() {
    const { sessionId, sessionData, startTime } = sessionFlowState;

    // Calculate duration
    const endTime = new Date();
    const start = new Date(startTime);
    const durationMinutes = Math.round((endTime - start) / 1000 / 60);

    // Mark as completed
    markSessionCompleted(sessionId, {
        duration: durationMinutes,
        completedAt: endTime.toISOString(),
        notes: ''
    });

    // Release wake lock
    releaseWakeLock();

    // Show completion message
    if (confirm(`Sessione completata! 🎉\n\nDurata: ${durationMinutes} minuti\n\nTornare alla home?`)) {
        window.location.href = '/index.html';
    }
}

/**
 * Confirm exit session
 */
function confirmExitSession() {
    if (confirm('Sei sicuro di voler uscire? Il progresso non verrà salvato.')) {
        releaseWakeLock();
        window.location.href = '/index.html';
    }
}

/**
 * Wake Lock Management
 */
async function requestWakeLock() {
    try {
        if ('wakeLock' in navigator) {
            wakeLock = await navigator.wakeLock.request('screen');
            console.log('Wake Lock attivo');
        }
    } catch (err) {
        console.error('Errore Wake Lock:', err);
    }
}

function releaseWakeLock() {
    if (wakeLock) {
        wakeLock.release();
        wakeLock = null;
        console.log('Wake Lock rilasciato');
    }
}

/**
 * Show error
 */
function showError(message) {
    const container = document.getElementById('exercisesContainer');
    if (container) {
        container.innerHTML = `
            <div class="error-state">
                <h2>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" stroke-width="2"/>
                        <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" stroke-width="2"/>
                        <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    Errore
                </h2>
                <p>${message}</p>
                <button onclick="window.location.href='/index.html'" class="btn-primary" aria-label="Torna alla home">
                    Torna alla Home
                </button>
            </div>
        `;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initSessionFlow);

// Expose functions to global scope
window.showExerciseDetails = showExerciseDetails;
window.closeExerciseModal = closeExerciseModal;
window.updateProgress = updateProgress;
window.completeSession = completeSession;
window.confirmExitSession = confirmExitSession;

// ========== HOME PAGE LOGIC - WEEKLY SCHEDULE ==========

import { clearAllCache } from '../shared.js';
import { initWeeklySchedule, refreshWeeklySchedule } from './weekly-schedule.js';
import { resetAllSessionHistory } from '../utils/session-loader.js';

/**
 * Initialize on page load
 */
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Inizializzazione home page con weekly schedule...');

    // Mostra loader
    showLoader();

    try {
        // Inizializza il calendario settimanale
        await initWeeklySchedule();

        // Nascondi loader
        hideLoader();

        // Setup event listeners
        setupEventListeners();

    } catch (error) {
        console.error('Errore inizializzazione:', error);
        hideLoader();
        showError('Errore nel caricamento dell\'app. Riprova ricariando la pagina.');
    }
});

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Reset progress button
    const resetBtn = document.querySelector('.btn-reset-progress');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetProgress);
    }

    // Clear cache button
    const clearCacheBtn = document.querySelector('.clear-cache-btn');
    if (clearCacheBtn) {
        clearCacheBtn.addEventListener('click', clearAllCache);
    }

    // Refresh button
    const refreshBtn = document.querySelector('.btn-refresh');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            refreshWeeklySchedule();
        });
    }
}

/**
 * Reset progress con conferma
 */
function resetProgress() {
    const success = resetAllSessionHistory();
    if (success) {
        // Ricarica la pagina per aggiornare la UI
        window.location.reload();
    }
}

/**
 * Mostra loader
 */
function showLoader() {
    let loader = document.getElementById('appLoader');
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'appLoader';
        loader.className = 'app-loader';
        loader.innerHTML = `
            <div class="loader-spinner"></div>
            <p>Caricamento sessioni...</p>
        `;
        document.body.appendChild(loader);
    }
    loader.style.display = 'flex';
}

/**
 * Nascondi loader
 */
function hideLoader() {
    const loader = document.getElementById('appLoader');
    if (loader) {
        loader.style.display = 'none';
    }
}

/**
 * Mostra errore
 */
function showError(message) {
    const container = document.getElementById('weeklyListContainer');
    if (container) {
        container.innerHTML = `
            <div class="error-message">
                <h3>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" stroke-width="2"/>
                        <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" stroke-width="2"/>
                        <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    Errore
                </h3>
                <p>${message}</p>
                <button onclick="window.location.reload()" class="btn-primary">
                    Ricarica
                </button>
            </div>
        `;
    }
}

// Expose functions to window for onclick handlers
window.resetProgress = resetProgress;
window.clearAllCache = clearAllCache;
window.refreshWeeklySchedule = refreshWeeklySchedule;

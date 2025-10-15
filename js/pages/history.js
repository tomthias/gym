// ========== HISTORY PAGE LOGIC ==========

// Load workout history
function loadHistory() {
    const history = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
    const container = document.getElementById('historyList');

    if (!container) return;

    if (history.length === 0) {
        container.innerHTML = '<div style="text-align:center;color:var(--color-text-dim);padding:40px;">Nessun allenamento completato ancora</div>';
        return;
    }

    container.innerHTML = history.map(item => `
        <div class="history-item">
            <div class="history-date">${item.date}</div>
            <div class="history-workout">${item.workout}</div>
            <div style="font-size:14px;color:var(--color-text-dim);">Esercizi: ${item.completed}/${item.total}</div>
        </div>
    `).reverse().join('');
}

// Save workout session to history
function saveWorkoutSession(workoutName, completed, total) {
    const history = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
    const date = new Date().toLocaleDateString('it-IT');

    history.push({
        date,
        workout: workoutName,
        completed,
        total,
        timestamp: Date.now()
    });

    localStorage.setItem('workoutHistory', JSON.stringify(history));
}

// Initialize on page load if on history page
document.addEventListener('DOMContentLoaded', function() {
    const historyList = document.getElementById('historyList');
    if (historyList) {
        loadHistory();
    }
});

// Expose functions to window
window.loadHistory = loadHistory;
window.saveWorkoutSession = saveWorkoutSession;

// ========== HISTORY PAGE LOGIC ==========

import { getWeeklyHistory, getWeeklyStats, getDailyBudget } from '../utils/calorieManager.js';

let currentTab = 'workout'; // 'workout' or 'nutrition'

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

// Load nutrition history
function loadNutritionHistory() {
    const weekHistory = getWeeklyHistory(7);
    const stats = getWeeklyStats();
    const budget = getDailyBudget();

    // Render stats
    const statsContainer = document.getElementById('nutritionStats');
    if (statsContainer) {
        statsContainer.innerHTML = `
            <div class="nutrition-stats-card">
                <h3>Statistiche Settimanali</h3>
                <div class="stats-grid">
                    <div class="stat-item">
                        <div class="stat-label">Media Calorie</div>
                        <div class="stat-value">${stats.avgCalories} kcal</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Giorni On-Target</div>
                        <div class="stat-value">${stats.daysOnTarget} / ${stats.totalDays}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Target Giornaliero</div>
                        <div class="stat-value">${budget} kcal</div>
                    </div>
                </div>
            </div>
        `;
    }

    // Render history list
    const listContainer = document.getElementById('nutritionHistoryList');
    if (!listContainer) return;

    if (weekHistory.every(day => day.isEmpty)) {
        listContainer.innerHTML = '<div style="text-align:center;color:var(--color-text-dim);padding:40px;">Nessun dato nutrizionale ancora</div>';
        return;
    }

    listContainer.innerHTML = weekHistory.map(day => {
        if (day.isEmpty) {
            return `
                <div class="nutrition-day-card empty">
                    <div class="nutrition-day-header">
                        <div class="nutrition-date">${day.dateFormatted}</div>
                        <div class="nutrition-calories-total">-</div>
                    </div>
                    <div class="nutrition-empty">Nessun pasto registrato</div>
                </div>
            `;
        }

        const meals = Object.entries(day.history);
        const progressColor = day.percentage < 70 ? 'good' : day.percentage < 90 ? 'warning' : 'danger';

        return `
            <div class="nutrition-day-card">
                <div class="nutrition-day-header">
                    <div class="nutrition-date">${day.dateFormatted}</div>
                    <div class="nutrition-calories-total">${day.totalCalories} kcal</div>
                </div>
                <div class="nutrition-day-progress">
                    <div class="nutrition-progress-bar">
                        <div class="nutrition-progress-fill status-${progressColor}" style="width: ${Math.min(day.percentage, 100)}%"></div>
                    </div>
                    <div class="nutrition-progress-label">${day.percentage}% del target</div>
                </div>
                <div class="nutrition-meals">
                    ${meals.map(([key, meal]) => {
                        const mealEmoji = getMealEmoji(key);
                        return `
                            <div class="nutrition-meal-item">
                                <span class="meal-emoji">${mealEmoji}</span>
                                <span class="meal-name">${meal.name}</span>
                                <span class="meal-calories">${meal.calories} kcal</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }).join('');
}

// Get emoji for meal type
function getMealEmoji(mealKey) {
    const emojis = {
        'workout-colazione': '🥣',
        'workout-spuntino': '🍎',
        'workout-pranzo': '🍽️',
        'workout-cena': '🌙',
        'rest-colazione': '🥣',
        'rest-spuntino': '🍎',
        'rest-pranzo': '🍽️',
        'rest-cena': '🌙'
    };
    return emojis[mealKey] || '🍴';
}

// Switch between tabs
function switchHistoryTab(tab) {
    currentTab = tab;

    // Update buttons
    document.querySelectorAll('.history-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtn = document.getElementById(tab === 'workout' ? 'btnWorkoutHistory' : 'btnNutritionHistory');
    if (activeBtn) activeBtn.classList.add('active');

    // Update views
    document.querySelectorAll('.history-view').forEach(view => {
        view.classList.remove('active');
    });
    const activeView = document.getElementById(tab === 'workout' ? 'workoutHistoryView' : 'nutritionHistoryView');
    if (activeView) activeView.classList.add('active');

    // Load appropriate data
    if (tab === 'nutrition') {
        loadNutritionHistory();
    }
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

    // Setup tab buttons
    const btnWorkoutHistory = document.getElementById('btnWorkoutHistory');
    const btnNutritionHistory = document.getElementById('btnNutritionHistory');

    if (btnWorkoutHistory) {
        btnWorkoutHistory.addEventListener('click', () => switchHistoryTab('workout'));
    }
    if (btnNutritionHistory) {
        btnNutritionHistory.addEventListener('click', () => switchHistoryTab('nutrition'));
    }
});

// Expose functions to window
window.loadHistory = loadHistory;
window.loadNutritionHistory = loadNutritionHistory;
window.saveWorkoutSession = saveWorkoutSession;
window.switchHistoryTab = switchHistoryTab;

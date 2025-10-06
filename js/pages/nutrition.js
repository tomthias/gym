// ========== NUTRITION PAGE LOGIC ==========

import { nutritionData } from '../data/nutrition.js';

// Stato nutrizionale
let currentDayType = 'workout'; // 'workout' o 'rest'
let completedMeals = JSON.parse(localStorage.getItem('completedMeals') || '{}');

// Switch tra tipo giornata
function switchDayType(type) {
    currentDayType = type;

    // Aggiorna bottoni
    document.querySelectorAll('.day-type-btn').forEach(btn => btn.classList.remove('active'));
    if (type === 'workout') {
        const btnWorkout = document.getElementById('btnWorkout');
        if (btnWorkout) btnWorkout.classList.add('active');
    } else {
        const btnRest = document.getElementById('btnRest');
        if (btnRest) btnRest.classList.add('active');
    }

    // Ricarica i pasti
    loadMeals();
}

// Carica i pasti per il tipo di giornata corrente
function loadMeals() {
    const container = document.getElementById('mealsContainer');
    if (!container) return;

    const meals = nutritionData[currentDayType];
    const today = new Date().toLocaleDateString('it-IT');

    let html = '';

    for (const [key, meal] of Object.entries(meals)) {
        const mealId = `${today}-${currentDayType}-${key}`;
        const isCompleted = completedMeals[mealId] || false;

        html += `
            <div class="meal-card ${isCompleted ? 'completed' : ''}">
                <div class="meal-header">
                    <div>
                        <div class="meal-time">${meal.time}</div>
                    </div>
                    <div class="checkbox-meal ${isCompleted ? 'checked' : ''}" onclick="toggleMeal('${mealId}')">
                        ${isCompleted ? '✓' : ''}
                    </div>
                </div>
                <div class="meal-name">${meal.name}</div>
                <div class="meal-description">${meal.description}</div>
                <div class="meal-actions">
                    <button class="meal-btn primary" onclick="showMealDetail('${currentDayType}', '${key}')">
                        Vedi Opzioni (${meal.options.length})
                    </button>
                </div>
            </div>
        `;
    }

    container.innerHTML = html;
}

// Toggle completamento pasto
function toggleMeal(mealId) {
    completedMeals[mealId] = !completedMeals[mealId];
    localStorage.setItem('completedMeals', JSON.stringify(completedMeals));
    loadMeals();
}

// Mostra dettagli pasto
function showMealDetail(dayType, mealKey) {
    const meal = nutritionData[dayType][mealKey];
    const modal = document.getElementById('mealModal');
    const title = document.getElementById('mealModalTitle');
    const body = document.getElementById('mealModalBody');

    if (!modal || !title || !body || !meal) return;

    title.textContent = meal.name;

    let html = `<div class="meal-detail-section">
        <div class="meal-detail-title">Scegli un'opzione:</div>`;

    meal.options.forEach((option, index) => {
        html += `
            <div class="meal-detail-option">
                <div class="meal-detail-option-name">${option.name}</div>
                <div class="meal-detail-option-desc">${option.items}</div>
                ${option.macros ? `
                    <div class="meal-macro-pills">
                        <div class="macro-pill protein">🥩 ${option.macros.protein}</div>
                        <div class="macro-pill carbs">🍞 ${option.macros.carbs}</div>
                        <div class="macro-pill fats">🥑 ${option.macros.fats}</div>
                    </div>
                ` : ''}
            </div>
        `;
    });

    html += `</div>`;

    if (meal.isImportant && dayType === 'workout') {
        html += `
            <div style="background: rgba(255, 107, 53, 0.1); padding: 12px; border-radius: 10px; margin-top: 16px;">
                <strong>💡 Consiglio:</strong> Questo pasto è fondamentale dopo l'allenamento per il recupero muscolare.
                Cerca di consumarlo entro 60 minuti dalla fine dell'allenamento.
            </div>
        `;
    }

    body.innerHTML = html;
    modal.style.display = 'flex';
}

// Chiudi modal pasto
function closeMealModal() {
    const modal = document.getElementById('mealModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Storico alimentazione
function showNutritionHistory() {
    alert('Funzionalità in arrivo: Qui vedrai lo storico completo dei pasti completati per ogni giorno!');
}

// Initialize on page load if on nutrition page
document.addEventListener('DOMContentLoaded', function() {
    const nutritionView = document.getElementById('nutritionView');
    if (nutritionView) {
        loadMeals();
    }
});

// Expose functions to window for onclick handlers
window.switchDayType = switchDayType;
window.toggleMeal = toggleMeal;
window.showMealDetail = showMealDetail;
window.closeMealModal = closeMealModal;
window.showNutritionHistory = showNutritionHistory;

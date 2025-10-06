// ========== NUTRITION PAGE LOGIC ==========

import { nutritionRecipes } from '../data/nutrition.js';

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

    const meals = nutritionRecipes[currentDayType];
    // Use ISO date format (YYYY-MM-DD) for consistency across locales
    const today = new Date().toISOString().split('T')[0];

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
                        Vedi Opzioni (${meal.recipes.length})
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
    const meal = nutritionRecipes[dayType][mealKey];
    const modal = document.getElementById('mealModal');
    const title = document.getElementById('mealModalTitle');
    const body = document.getElementById('mealModalBody');

    if (!modal || !title || !body || !meal) return;

    title.textContent = meal.name;

    let html = `<div class="meal-detail-section">
        <div class="meal-detail-title">Scegli un'opzione:</div>`;

    meal.recipes.forEach((recipe, index) => {
        const ingredients = recipe.ingredients ? recipe.ingredients.join(', ') : '';
        html += `
            <div class="meal-detail-option">
                <div class="meal-detail-option-name">${recipe.name}</div>
                <div class="meal-detail-option-desc">${ingredients}</div>
                ${recipe.macros ? `
                    <div class="meal-macro-pills">
                        <div class="macro-pill protein">🥩 ${recipe.macros.protein}</div>
                        <div class="macro-pill carbs">🍞 ${recipe.macros.carbs}</div>
                        <div class="macro-pill fats">🥑 ${recipe.macros.fats}</div>
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
    // Load initial meals
    loadMeals();

    // Add event listeners for day type buttons
    const btnWorkout = document.getElementById('btnWorkout');
    const btnRest = document.getElementById('btnRest');

    if (btnWorkout) {
        btnWorkout.addEventListener('click', () => switchDayType('workout'));
    }
    if (btnRest) {
        btnRest.addEventListener('click', () => switchDayType('rest'));
    }

    // Close modal when clicking outside
    const modal = document.getElementById('mealModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeMealModal();
            }
        });
    }
});

// Expose functions to window for onclick handlers
window.switchDayType = switchDayType;
window.toggleMeal = toggleMeal;
window.showMealDetail = showMealDetail;
window.closeMealModal = closeMealModal;
window.showNutritionHistory = showNutritionHistory;

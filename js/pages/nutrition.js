// ========== NUTRITION PAGE LOGIC - REFACTORED ==========

import { nutritionRecipes } from '../data/nutrition.js';

// ========== STATE MANAGEMENT ==========
let currentDayType = 'workout'; // 'workout' or 'rest'
let currentMealKey = null;
let currentMeal = null;
let allRecipes = [];
let filteredRecipes = [];

// Check and reset selections if new day
function checkAndResetDaily() {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const lastResetDate = localStorage.getItem('lastResetDate');

    if (lastResetDate !== today) {
        // New day! Reset selections
        localStorage.setItem('selectedRecipes', '{}');
        localStorage.setItem('lastResetDate', today);
        console.log('🔄 Daily reset: recipe selections cleared for new day');
    }
}

// Initialize and check for daily reset
checkAndResetDaily();

let selectedRecipes = JSON.parse(localStorage.getItem('selectedRecipes') || '{}');
let completedMeals = JSON.parse(localStorage.getItem('completedMeals') || '{}');

// Current filters
let activeFilters = {
    search: '',
    quick: 'all', // 'all', 'veloce', 'veggie'
    advanced: [] // ['carne', 'pesce', 'time-5', etc.]
};

// ========== ICON SYSTEM ==========
const ICONS = {
    // Recipe types
    meat: 'assets/icons/meat.svg',
    fish: 'assets/icons/fish.svg',
    veggie: 'assets/icons/veggie.svg',
    egg: 'assets/icons/egg.svg',
    pancake: 'assets/icons/pancake.svg',
    dish: 'assets/icons/dish.svg',
    // Macros
    protein: 'assets/icons/protein.svg',
    carbs: 'assets/icons/carbs.svg',
    fats: 'assets/icons/fats.svg',
    // UI
    search: 'assets/icons/search.svg',
    clock: 'assets/icons/clock.svg',
    fast: 'assets/icons/fast.svg',
    tip: 'assets/icons/tip.svg',
    check: 'assets/icons/check.svg',
    refresh: 'assets/icons/refresh.svg'
};

function icon(name, className = 'icon') {
    return `<img src="${ICONS[name]}" class="${className}" alt="${name}">`;
}

// ========== UTILITY FUNCTIONS ==========

// Get icon for recipe type
function getRecipeIcon(recipe) {
    if (recipe.tags.includes('vegano') || recipe.tags.includes('vegetariano') || recipe.category === 'vegano') {
        return icon('veggie', 'recipe-type-icon');
    }
    if (recipe.tags.includes('pesce')) return icon('fish', 'recipe-type-icon');
    if (recipe.tags.includes('carne') || recipe.tags.includes('proteico')) return icon('meat', 'recipe-type-icon');
    if (recipe.category === 'dolce') return icon('pancake', 'recipe-type-icon');
    return icon('dish', 'recipe-type-icon');
}

// Check if recipe matches filters
function matchesFilters(recipe) {
    // Search filter
    if (activeFilters.search) {
        const searchTerm = activeFilters.search.toLowerCase();
        const matchName = recipe.name.toLowerCase().includes(searchTerm);
        const matchIngredients = recipe.ingredients?.some(ing =>
            ing.toLowerCase().includes(searchTerm)
        );
        if (!matchName && !matchIngredients) return false;
    }

    // Quick filters
    if (activeFilters.quick !== 'all') {
        if (activeFilters.quick === 'veloce') {
            if (recipe.time > 15) return false;
        }
        if (activeFilters.quick === 'veggie') {
            const isVeggie = recipe.tags.includes('vegano') ||
                           recipe.tags.includes('vegetariano') ||
                           recipe.category === 'vegano';
            if (!isVeggie) return false;
        }
    }

    // Advanced filters
    for (const filter of activeFilters.advanced) {
        if (filter === 'carne' && !recipe.tags.includes('carne') && !recipe.tags.includes('proteico')) {
            return false;
        }
        if (filter === 'pesce' && !recipe.tags.includes('pesce')) {
            return false;
        }
        if (filter === 'vegano' && recipe.category !== 'vegano') {
            return false;
        }
        if (filter === 'uova' && !recipe.ingredients?.some(ing => ing.toLowerCase().includes('uov'))) {
            return false;
        }
        if (filter === 'time-5' && recipe.time > 5) {
            return false;
        }
        if (filter === 'time-15' && (recipe.time <= 5 || recipe.time > 15)) {
            return false;
        }
        if (filter === 'time-30' && (recipe.time <= 15 || recipe.time > 30)) {
            return false;
        }
        if (filter === 'facilissimo' && recipe.difficulty !== 'facilissimo') {
            return false;
        }
        if (filter === 'facile' && recipe.difficulty !== 'facile') {
            return false;
        }
        if (filter === 'media' && recipe.difficulty !== 'media') {
            return false;
        }
    }

    return true;
}

// Apply smart pre-filters based on context
function getSmartPreFilters(mealKey) {
    const hour = new Date().getHours();
    const filters = { quick: 'all', advanced: [] };

    // Morning breakfast - suggest quick recipes
    if (mealKey === 'colazione' && hour >= 6 && hour < 10) {
        filters.quick = 'veloce';
    }

    // Post-workout lunch - suggest proteic (handled by tags naturally)
    if (mealKey === 'pranzo' && currentDayType === 'workout') {
        // Recipes already tagged appropriately
    }

    return filters;
}

// ========== MEAL CARDS (MAIN PAGE) ==========

function loadMeals() {
    const container = document.getElementById('mealsContainer');
    if (!container) return;

    const meals = nutritionRecipes[currentDayType];
    const today = new Date().toISOString().split('T')[0];

    let html = '';

    for (const [key, meal] of Object.entries(meals)) {
        const mealId = `${today}-${currentDayType}-${key}`;
        const isCompleted = completedMeals[mealId] || false;
        const selectedRecipeId = selectedRecipes[`${currentDayType}-${key}`];
        const selectedRecipe = selectedRecipeId ?
            meal.recipes.find(r => r.id === selectedRecipeId) : null;

        html += `
            <div class="meal-card ${isCompleted ? 'completed' : ''}">
                <div class="meal-header">
                    <div>
                        <div class="meal-time">${meal.time}</div>
                    </div>
                    <div class="checkbox-meal ${isCompleted ? 'checked' : ''}" onclick="toggleMeal('${mealId}')">
                        ${isCompleted ? icon('check', 'checkbox-icon') : ''}
                    </div>
                </div>
                <div class="meal-name">${meal.name}</div>
                <div class="meal-description">${meal.description}</div>

                ${selectedRecipe ? `
                    <div class="meal-selected-recipe">
                        <div class="selected-recipe-label">${icon('check', 'selected-icon')} Selezionata:</div>
                        <div class="selected-recipe-name">${selectedRecipe.name}</div>
                        <div class="selected-recipe-macros">
                            ${selectedRecipe.macros.calories} •
                            ${selectedRecipe.macros.protein} P •
                            ${selectedRecipe.macros.carbs} C
                        </div>
                    </div>
                ` : ''}

                <div class="meal-actions">
                    <button class="meal-btn primary" onclick="openRecipeSheet('${currentDayType}', '${key}')">
                        ${selectedRecipe ? 'Cambia Ricetta' : `Scegli Ricetta (${meal.recipes.length})`}
                    </button>
                </div>
            </div>
        `;
    }

    container.innerHTML = html;
}

function toggleMeal(mealId) {
    completedMeals[mealId] = !completedMeals[mealId];
    localStorage.setItem('completedMeals', JSON.stringify(completedMeals));
    loadMeals();
}

// ========== BOTTOM SHEET ==========

function openRecipeSheet(dayType, mealKey) {
    currentDayType = dayType;
    currentMealKey = mealKey;
    currentMeal = nutritionRecipes[dayType][mealKey];
    allRecipes = currentMeal.recipes;

    // Apply smart pre-filters
    const smartFilters = getSmartPreFilters(mealKey);
    activeFilters.quick = smartFilters.quick;
    activeFilters.advanced = smartFilters.advanced;
    activeFilters.search = '';

    // Update UI
    const sheet = document.getElementById('recipeBottomSheet');
    const title = document.getElementById('sheetTitle');

    if (title) title.textContent = currentMeal.name;

    // Reset search
    const searchInput = document.getElementById('recipeSearch');
    if (searchInput) searchInput.value = '';

    // Update filter chips
    updateFilterChips();

    // Filter and render recipes
    applyFiltersAndRender();

    // Show sheet
    if (sheet) {
        sheet.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeRecipeSheet() {
    const sheet = document.getElementById('recipeBottomSheet');
    if (sheet) {
        sheet.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ========== FILTERING ==========

function updateFilterChips() {
    const chips = document.querySelectorAll('.filter-chips .chip');
    chips.forEach(chip => {
        const filter = chip.getAttribute('data-filter');
        if (filter === activeFilters.quick) {
            chip.classList.add('active');
        } else {
            chip.classList.remove('active');
        }
    });
}

function applyFiltersAndRender() {
    filteredRecipes = allRecipes.filter(matchesFilters);
    renderRecipeCards();
    updateRecipeCount();
}

function updateRecipeCount() {
    const countElement = document.getElementById('recipeCount');
    if (countElement) {
        countElement.textContent = filteredRecipes.length;
    }
}

// ========== RECIPE CARDS RENDERING ==========

function renderRecipeCards() {
    const container = document.getElementById('recipesList');
    if (!container) return;

    if (filteredRecipes.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: var(--color-text-muted);">
                <div style="font-size: 48px; margin-bottom: 16px;">${icon('search', 'empty-state-icon')}</div>
                <div style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">Nessuna ricetta trovata</div>
                <div style="font-size: 14px;">Prova a modificare i filtri</div>
            </div>
        `;
        return;
    }

    const selectedRecipeId = selectedRecipes[`${currentDayType}-${currentMealKey}`];

    let html = '';
    filteredRecipes.forEach(recipe => {
        const recipeIcon = getRecipeIcon(recipe);
        const isSelected = recipe.id === selectedRecipeId;
        const isVeloce = recipe.time <= 15;
        const isProteico = recipe.macros && parseInt(recipe.macros.protein) >= 25;

        html += `
            <div class="recipe-card ${isSelected ? 'selected' : ''}" data-recipe-id="${recipe.id}">
                <div class="recipe-header">
                    <div class="recipe-name" onclick="toggleRecipeDetail('${recipe.id}')">
                        ${recipe.name}
                    </div>
                    <div class="recipe-tags">
                        <span class="recipe-tag">${recipeIcon}</span>
                    </div>
                </div>

                <div class="recipe-meta">
                    <div class="recipe-meta-item">
                        ${recipe.difficulty === 'facilissimo' ? 'Facilissimo' :
                          recipe.difficulty === 'facile' ? 'Facile' :
                          recipe.difficulty === 'media' ? 'Medio' : 'Difficile'}
                    </div>
                    <div class="recipe-meta-item">
                        ${icon('clock', 'icon-inline')} ${recipe.time} min
                    </div>
                </div>

                ${isVeloce || isProteico || recipe.tags.includes('meal-prep') ? `
                    <div class="recipe-badges">
                        ${isVeloce ? `<span class="recipe-badge veloce">${icon('fast', 'badge-icon')} Veloce</span>` : ''}
                        ${isProteico ? '<span class="recipe-badge proteico">Proteico</span>' : ''}
                        ${recipe.tags.includes('meal-prep') ? '<span class="recipe-badge">Meal Prep</span>' : ''}
                    </div>
                ` : ''}

                ${recipe.macros ? `
                    <div class="recipe-macros">
                        <div class="macro-item">
                            <span class="value">${recipe.macros.calories}</span>
                        </div>
                        <div class="macro-item">
                            ${icon('protein', 'macro-icon')}
                            <span class="value">${recipe.macros.protein}</span>
                        </div>
                        <div class="macro-item">
                            ${icon('carbs', 'macro-icon')}
                            <span class="value">${recipe.macros.carbs}</span>
                        </div>
                        <div class="macro-item">
                            ${icon('fats', 'macro-icon')}
                            <span class="value">${recipe.macros.fats}</span>
                        </div>
                    </div>
                ` : ''}

                <div class="recipe-actions">
                    <button class="recipe-btn recipe-btn-primary" onclick="selectRecipe('${recipe.id}')">
                        ${isSelected ? `Deseleziona ${icon('check', 'icon-inline')}` : 'Seleziona'}
                    </button>
                </div>

                <div class="recipe-detail" id="detail-${recipe.id}">
                    ${recipe.ingredients ? `
                        <h4>Ingredienti</h4>
                        <ul>
                            ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
                        </ul>
                    ` : ''}
                    ${recipe.tips ? `
                        <div style="margin-top: 12px; padding: 10px; background: rgba(0, 135, 95, 0.1); border-radius: 8px; font-size: 13px;">
                            ${icon('tip', 'icon-inline')} ${recipe.tips}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function toggleRecipeDetail(recipeId) {
    const detail = document.getElementById(`detail-${recipeId}`);
    if (detail) {
        detail.classList.toggle('expanded');
    }
}

function selectRecipe(recipeId) {
    const key = `${currentDayType}-${currentMealKey}`;

    // Toggle: if already selected, deselect it
    if (selectedRecipes[key] === recipeId) {
        delete selectedRecipes[key];
        localStorage.setItem('selectedRecipes', JSON.stringify(selectedRecipes));

        // Update UI immediately
        renderRecipeCards();
        loadMeals();

        // Don't close the sheet, user might want to select another
        return;
    }

    // Otherwise, select this recipe
    selectedRecipes[key] = recipeId;
    localStorage.setItem('selectedRecipes', JSON.stringify(selectedRecipes));

    // Update UI
    renderRecipeCards();

    // Close sheet after short delay
    setTimeout(() => {
        closeRecipeSheet();
        loadMeals(); // Reload meal cards to show selection
    }, 300);
}

// ========== FILTER DRAWER ==========

function openFilterDrawer() {
    const drawer = document.getElementById('filterDrawer');
    if (drawer) {
        drawer.classList.add('active');

        // Update active state of advanced filters
        document.querySelectorAll('.filter-option').forEach(option => {
            const filter = option.getAttribute('data-filter');
            if (activeFilters.advanced.includes(filter)) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }
}

function closeFilterDrawer() {
    const drawer = document.getElementById('filterDrawer');
    if (drawer) {
        drawer.classList.remove('active');
    }
}

function resetAllFilters() {
    activeFilters.quick = 'all';
    activeFilters.advanced = [];
    activeFilters.search = '';

    const searchInput = document.getElementById('recipeSearch');
    if (searchInput) searchInput.value = '';

    updateFilterChips();
    closeFilterDrawer();
    applyFiltersAndRender();
}

function applyAdvancedFilters() {
    closeFilterDrawer();
    applyFiltersAndRender();
}

// ========== EVENT HANDLERS ==========

function switchDayType(type) {
    currentDayType = type;

    // Update buttons
    document.querySelectorAll('.day-type-btn').forEach(btn => btn.classList.remove('active'));
    const btn = document.getElementById(type === 'workout' ? 'btnWorkout' : 'btnRest');
    if (btn) btn.classList.add('active');

    loadMeals();
}

// ========== INITIALIZATION ==========

document.addEventListener('DOMContentLoaded', function() {
    // Load initial meals
    loadMeals();

    // Day type buttons
    const btnWorkout = document.getElementById('btnWorkout');
    const btnRest = document.getElementById('btnRest');

    if (btnWorkout) btnWorkout.addEventListener('click', () => switchDayType('workout'));
    if (btnRest) btnRest.addEventListener('click', () => switchDayType('rest'));

    // Bottom sheet backdrop click
    const sheetBackdrop = document.querySelector('.sheet-backdrop');
    if (sheetBackdrop) {
        sheetBackdrop.addEventListener('click', closeRecipeSheet);
    }

    // Search input
    const searchInput = document.getElementById('recipeSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            activeFilters.search = e.target.value;
            applyFiltersAndRender();
        });
    }

    // Filter chips
    document.querySelectorAll('.filter-chips .chip:not(.filter-more)').forEach(chip => {
        chip.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            activeFilters.quick = filter;
            updateFilterChips();
            applyFiltersAndRender();
        });
    });

    // Advanced filter options
    document.querySelectorAll('.filter-option').forEach(option => {
        option.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            const index = activeFilters.advanced.indexOf(filter);

            if (index > -1) {
                activeFilters.advanced.splice(index, 1);
                this.classList.remove('active');
            } else {
                activeFilters.advanced.push(filter);
                this.classList.add('active');
            }
        });
    });

    // Swipe gesture for bottom sheet (basic implementation)
    let startY = 0;
    let currentY = 0;
    const sheetHandle = document.querySelector('.sheet-handle');

    if (sheetHandle) {
        sheetHandle.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
        });

        sheetHandle.addEventListener('touchmove', (e) => {
            currentY = e.touches[0].clientY;
            const diff = currentY - startY;

            if (diff > 50) {
                closeRecipeSheet();
            }
        });
    }
});

// Make functions globally accessible
window.switchDayType = switchDayType;
window.toggleMeal = toggleMeal;
window.openRecipeSheet = openRecipeSheet;
window.closeRecipeSheet = closeRecipeSheet;
window.selectRecipe = selectRecipe;
window.toggleRecipeDetail = toggleRecipeDetail;
window.openFilterDrawer = openFilterDrawer;
window.closeFilterDrawer = closeFilterDrawer;
window.resetAllFilters = resetAllFilters;
window.applyAdvancedFilters = applyAdvancedFilters;

// ========== CALORIE MANAGER - BUDGET TRACKING SYSTEM ==========

const DEFAULT_DAILY_BUDGET = 2300; // kcal

/**
 * Get daily calorie budget (configurable via settings)
 */
export function getDailyBudget() {
    const budget = localStorage.getItem('dailyCaloriesBudget');
    return budget ? parseInt(budget) : DEFAULT_DAILY_BUDGET;
}

/**
 * Set daily calorie budget
 */
export function setDailyBudget(calories) {
    localStorage.setItem('dailyCaloriesBudget', calories.toString());
}

/**
 * Get today's date in YYYY-MM-DD format
 */
function getTodayKey() {
    return new Date().toISOString().split('T')[0];
}

/**
 * Get consumed calories for a specific date
 */
export function getConsumedCalories(date = null) {
    const dateKey = date || getTodayKey();
    const key = `consumedCalories_${dateKey}`;
    const consumed = localStorage.getItem(key);
    return consumed ? parseInt(consumed) : 0;
}

/**
 * Get nutrition history for a specific date
 */
export function getNutritionHistory(date = null) {
    const dateKey = date || getTodayKey();
    const key = `nutritionHistory_${dateKey}`;
    const history = localStorage.getItem(key);
    return history ? JSON.parse(history) : {};
}

/**
 * Save nutrition history for a specific date
 */
function saveNutritionHistory(history, date = null) {
    const dateKey = date || getTodayKey();
    const key = `nutritionHistory_${dateKey}`;
    localStorage.setItem(key, JSON.stringify(history));
}

/**
 * Calculate remaining calorie budget for today
 */
export function calculateRemainingBudget() {
    const budget = getDailyBudget();
    const consumed = getConsumedCalories();
    return budget - consumed;
}

/**
 * Get calorie info with percentage
 */
export function getCalorieStats() {
    const budget = getDailyBudget();
    const consumed = getConsumedCalories();
    const remaining = budget - consumed;
    const percentage = Math.round((consumed / budget) * 100);

    return {
        budget,
        consumed,
        remaining,
        percentage,
        status: percentage < 70 ? 'good' : percentage < 90 ? 'warning' : 'danger'
    };
}

/**
 * Parse calories from recipe macros
 * Handles formats like "380 kcal" or "380"
 */
function parseCalories(caloriesString) {
    if (!caloriesString) return 0;
    const match = caloriesString.toString().match(/\d+/);
    return match ? parseInt(match[0]) : 0;
}

/**
 * Update consumed calories when selecting/deselecting a recipe
 * @param {string} recipeId - Recipe ID
 * @param {string} recipeName - Recipe name
 * @param {string} caloriesString - Calories (e.g., "380 kcal")
 * @param {string} mealKey - Meal key (e.g., "workout-colazione")
 * @param {boolean} isSelecting - true if selecting, false if deselecting
 */
export function updateConsumedCalories(recipeId, recipeName, caloriesString, mealKey, isSelecting) {
    const today = getTodayKey();
    const calories = parseCalories(caloriesString);

    // Get current nutrition history
    const history = getNutritionHistory();

    if (isSelecting) {
        // Add recipe to history
        history[mealKey] = {
            id: recipeId,
            name: recipeName,
            calories: calories,
            timestamp: Date.now()
        };
    } else {
        // Remove recipe from history
        delete history[mealKey];
    }

    // Save updated history
    saveNutritionHistory(history);

    // Recalculate total consumed calories
    const totalConsumed = Object.values(history).reduce((sum, meal) => {
        return sum + (meal.calories || 0);
    }, 0);

    // Update consumed calories
    const consumedKey = `consumedCalories_${today}`;
    localStorage.setItem(consumedKey, totalConsumed.toString());

    return {
        totalConsumed,
        remaining: getDailyBudget() - totalConsumed
    };
}

/**
 * Check if selecting a recipe would exceed budget
 * @param {string} caloriesString - Recipe calories
 * @returns {boolean} true if would exceed budget
 */
export function wouldExceedBudget(caloriesString) {
    const calories = parseCalories(caloriesString);
    const remaining = calculateRemainingBudget();
    return calories > remaining;
}

/**
 * Check if selecting a recipe would put user in warning zone (>90%)
 */
export function wouldTriggerWarning(caloriesString) {
    const calories = parseCalories(caloriesString);
    const stats = getCalorieStats();
    const newConsumed = stats.consumed + calories;
    const newPercentage = (newConsumed / stats.budget) * 100;
    return newPercentage >= 90;
}

/**
 * Reset daily calories (called by daily reset system)
 * This is integrated with the existing reset in nutrition.js
 */
export function resetDailyCalories() {
    const today = getTodayKey();
    const consumedKey = `consumedCalories_${today}`;
    const historyKey = `nutritionHistory_${today}`;

    // Don't delete old data, just ensure today starts fresh
    // The checkAndResetDaily in nutrition.js handles selectedRecipes reset

    console.log('✅ Calorie tracking ready for new day');
}

/**
 * Get nutrition history for the last N days
 * @param {number} days - Number of days to retrieve
 * @returns {Array} Array of {date, history, totalCalories}
 */
export function getWeeklyHistory(days = 7) {
    const history = [];
    const today = new Date();

    for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateKey = date.toISOString().split('T')[0];

        const dayHistory = getNutritionHistory(dateKey);
        const totalCalories = getConsumedCalories(dateKey);

        history.push({
            date: dateKey,
            dateFormatted: date.toLocaleDateString('it-IT', {
                weekday: 'short',
                day: 'numeric',
                month: 'short'
            }),
            history: dayHistory,
            totalCalories,
            percentage: Math.round((totalCalories / getDailyBudget()) * 100),
            isEmpty: Object.keys(dayHistory).length === 0
        });
    }

    return history;
}

/**
 * Get weekly statistics
 */
export function getWeeklyStats() {
    const weekHistory = getWeeklyHistory(7);
    const daysWithData = weekHistory.filter(day => !day.isEmpty);

    if (daysWithData.length === 0) {
        return {
            avgCalories: 0,
            daysOnTarget: 0,
            daysOffTarget: 0,
            totalDays: 0
        };
    }

    const totalCalories = daysWithData.reduce((sum, day) => sum + day.totalCalories, 0);
    const avgCalories = Math.round(totalCalories / daysWithData.length);
    const budget = getDailyBudget();

    const daysOnTarget = daysWithData.filter(day => {
        const diff = Math.abs(day.totalCalories - budget);
        return diff <= budget * 0.1; // Within 10% of target
    }).length;

    return {
        avgCalories,
        daysOnTarget,
        daysOffTarget: daysWithData.length - daysOnTarget,
        totalDays: daysWithData.length
    };
}

/**
 * Export nutrition data for analytics
 */
export function exportNutritionData(days = 30) {
    const history = getWeeklyHistory(days);
    return {
        exportDate: new Date().toISOString(),
        dailyBudget: getDailyBudget(),
        data: history
    };
}

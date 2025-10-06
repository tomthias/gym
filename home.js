// ========== HOME PAGE LOGIC ==========

import { initCheckboxes, clearAllCache, toggleSection } from '../shared.js';
import { exerciseData } from '../data/exercises.js';

// Workout progress management
function toggleCheck(id) {
    const checkbox = document.getElementById(id);
    if (checkbox) {
        checkbox.classList.toggle('checked');
        saveProgress();
        updateProgress();
    }
}

function saveProgress() {
    const checkboxes = document.querySelectorAll('.checkbox');
    const progress = {};
    checkboxes.forEach(cb => {
        progress[cb.id] = cb.classList.contains('checked');
    });
    localStorage.setItem('workoutProgress', JSON.stringify(progress));
}

function loadProgress() {
    const saved = localStorage.getItem('workoutProgress');
    if (saved) {
        const progress = JSON.parse(saved);
        Object.keys(progress).forEach(id => {
            const checkbox = document.getElementById(id);
            if (checkbox && progress[id]) {
                checkbox.classList.add('checked');
            }
        });
    }
    updateProgress();
}

function updateProgress() {
    updateWorkoutProgress('A', 24);
    updateWorkoutProgress('B', 22);
    updateWorkoutProgress('C', 12);
}

function updateWorkoutProgress(workout, total) {
    const prefix = workout.toLowerCase();
    const checkboxes = document.querySelectorAll(`[id^="${prefix}-"]`);
    let completed = 0;
    checkboxes.forEach(cb => {
        if (cb.classList.contains('checked')) completed++;
    });
    const percentage = (completed / total) * 100;
    const progressBar = document.getElementById(`progress${workout}`);
    const progressText = document.getElementById(`progressText${workout}`);
    if (progressBar) progressBar.style.width = percentage + '%';
    if (progressText) progressText.textContent = `${completed}/${total}`;
}

function resetAllProgress() {
    if (confirm('Vuoi resettare tutti i progressi degli allenamenti?')) {
        localStorage.removeItem('workoutProgress');
        document.querySelectorAll('.checkbox').forEach(cb => {
            cb.classList.remove('checked');
        });
        updateProgress();
    }
}

// Workout navigation
function openWorkout(workoutId) {
    const homeView = document.getElementById('homeView');
    const workoutDetail = document.getElementById(workoutId);
    if (homeView) homeView.classList.add('hidden');
    if (workoutDetail) workoutDetail.classList.add('visible');
    window.scrollTo(0, 0);
}

function closeWorkout() {
    document.querySelectorAll('.workout-detail').forEach(w => {
        w.classList.remove('visible');
    });
    const homeView = document.getElementById('homeView');
    if (homeView) homeView.classList.remove('hidden');
    window.scrollTo(0, 0);
}

// Calendar - Highlight today
function updateCalendar() {
    const today = new Date().getDay(); // 0 = Dom, 1 = Lun, ...
    document.querySelectorAll('.calendar-day').forEach(day => {
        const dayNum = parseInt(day.dataset.day);
        if (dayNum === today) {
            day.classList.add('today');
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initCheckboxes();
    loadProgress();
    updateCalendar();

    // Add event listeners for workout start buttons
    document.querySelectorAll('.btn-start-full-workout').forEach(btn => {
        btn.addEventListener('click', function() {
            const workoutId = this.dataset.workout;
            window.location.href = `workout-flow.html?workout=${workoutId}`;
        });
    });

    // Add event listener for reset cache button
    const resetBtn = document.querySelector('.clear-cache-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetAllProgress);
    }
});

// Expose functions to window for onclick handlers
window.toggleCheck = toggleCheck;
window.toggleSection = toggleSection;
window.openWorkout = openWorkout;
window.closeWorkout = closeWorkout;
window.resetAllProgress = resetAllProgress;
window.clearCache = clearAllCache;

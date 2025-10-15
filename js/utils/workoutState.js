// ========== WORKOUT FLOW STATE PERSISTENCE ==========
// Shared utility functions for saving/loading workout state
// Can be used from both home.js and workout-flow.js

const workoutExercisesConfig = {
    workoutA: 24,
    workoutB: 22,
    workoutC: 12,
    workoutD: 24,
    workoutE: 24
};

// Save workout flow state to localStorage for recovery after app close/refresh
export function saveWorkoutFlowState(state) {
    if (!state.workoutId) {
        // No active workout, nothing to save
        return;
    }

    const stateToSave = {
        workoutId: state.workoutId,
        currentExerciseIndex: state.currentExerciseIndex,
        currentSet: state.currentSet,
        timerSeconds: state.timerSeconds,
        timerMode: state.timerMode,
        restSeconds: state.restSeconds,
        totalRestSeconds: state.totalRestSeconds,
        isTransitionRest: state.isTransitionRest,
        exerciseStarted: state.exerciseStarted,
        timestamp: new Date().toISOString()
    };

    localStorage.setItem('workoutFlowState', JSON.stringify(stateToSave));
    console.log('Workout flow state saved:', stateToSave);
}

// Load saved workout flow state from localStorage
export function loadWorkoutFlowState() {
    const saved = localStorage.getItem('workoutFlowState');
    if (!saved) return null;

    try {
        const state = JSON.parse(saved);

        // Check if state is not too old (max 6 hours)
        const timestamp = new Date(state.timestamp);
        const now = new Date();
        const hoursDiff = (now - timestamp) / (1000 * 60 * 60);

        if (hoursDiff > 6) {
            console.log('Saved workout state is too old, discarding');
            clearWorkoutFlowState();
            return null;
        }

        return state;
    } catch (err) {
        console.error('Error loading workout flow state:', err);
        return null;
    }
}

// Clear saved workout flow state
export function clearWorkoutFlowState() {
    localStorage.removeItem('workoutFlowState');
    console.log('Workout flow state cleared');
}

// Check if there's an active workout
export function hasActiveWorkout() {
    const saved = loadWorkoutFlowState();
    return saved !== null;
}

// Get active workout info for display
// workoutExercises parameter is optional - if provided, will get full exercise details
export function getActiveWorkoutInfo(workoutExercises = null) {
    const saved = loadWorkoutFlowState();
    if (!saved) return null;

    const workoutNames = {
        workoutA: 'Allenamento 1',
        workoutB: 'Allenamento 2',
        workoutC: 'Allenamento 3',
        workoutD: 'Allenamento 1A',
        workoutE: 'Allenamento 2A'
    };

    const baseInfo = {
        workoutId: saved.workoutId,
        workoutName: workoutNames[saved.workoutId] || saved.workoutId,
        exerciseIndex: saved.currentExerciseIndex,
        currentSet: saved.currentSet
    };

    // If workoutExercises provided, get full exercise details
    if (workoutExercises && workoutExercises[saved.workoutId]) {
        const exercises = workoutExercises[saved.workoutId];
        const exercise = exercises[saved.currentExerciseIndex];

        if (exercise) {
            baseInfo.exerciseName = exercise.name;
            baseInfo.totalSets = exercise.sets || 1;
            baseInfo.totalExercises = exercises.length;
        } else {
            baseInfo.exerciseName = 'Caricamento...';
            baseInfo.totalSets = 3;
        }
    } else {
        // For home page without workoutExercises
        baseInfo.exerciseName = 'Caricamento...';
        baseInfo.totalSets = 3;
    }

    return baseInfo;
}

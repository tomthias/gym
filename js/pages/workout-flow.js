// ========== WORKOUT FLOW LOGIC ==========

import { getUrlParameter, initCheckboxes, toggleSection } from '../shared.js';
import { exerciseData } from '../data/exercises.js';
import { playCountdownBeep, stopSquatTempoMetronome, isSquatTempoMetronomeActive, toggleSquatTempoMetronome } from '../utils/timers.js';
import { showExerciseDetail, closeExerciseModal } from '../utils/modal.js';

// Workout exercises database
const workoutExercises = {
    workoutA: [
        { id: 'a-warm1', name: 'Bike/Tapirulan', key: 'bike', type: 'warmup', duration: 720 },
        { id: 'a-warm2', name: 'Circonduzione Braccia', key: 'circonduzione', type: 'warmup' },
        { id: 'a-warm3', name: 'Mobilità Spalle e Polsi', key: 'mobilita', type: 'warmup' },
        { id: 'a-fisio1', name: 'Heel Raises', key: 'heelraises', sets: 3, reps: 10, recovery: 0, superset: true, supersetPair: 'ss0', supersetPartner: 'a-fisio2', supersetColor: '#9B59B6' },
        { id: 'a-fisio2', name: 'Box Bridge', key: 'boxbridge', sets: 3, reps: 10, recovery: 60, superset: true, supersetPair: 'ss0', supersetPartner: 'a-fisio1', supersetColor: '#9B59B6' },
        { id: 'a-fisio3', name: 'Hip Thrust', key: 'hipthrust', sets: 3, reps: 12, recovery: 0, superset: true, supersetPair: 'ss1', supersetPartner: 'a-fisio4', supersetColor: '#FF6B35' },
        { id: 'a-fisio4', name: 'Side Walk', key: 'sidewalk', sets: 3, reps: 20, recovery: 60, superset: true, supersetPair: 'ss1', supersetPartner: 'a-fisio3', supersetColor: '#FF6B35' },
        { id: 'a-fisio5', name: 'Elvis', key: 'elvis', sets: 2, reps: 15, recovery: 60 },
        { id: 'a-push1', name: 'Panca Piana Manubri', key: 'pancapiana', sets: 4, reps: 8, recovery: 90 },
        { id: 'a-push2', name: 'Croci Panca Inclinata', key: 'croci', sets: 3, reps: 20, recovery: 120 },
        { id: 'a-push3', name: 'Military Press', key: 'militarypress', sets: 4, reps: 10, recovery: 90 },
        { id: 'a-push4', name: 'Alzate Laterali', key: 'alzatelaterali', sets: 3, reps: 15, recovery: 60 },
        { id: 'a-push5', name: 'Push Down', key: 'pushdown', sets: 3, reps: 12, recovery: 60 },
        { id: 'a-push6', name: 'Dips', key: 'dips', sets: 3, reps: 12, recovery: 90 }
    ],
    workoutB: [
        { id: 'b-warm1', name: 'Bike/Tapirulan', key: 'bike', type: 'warmup', duration: 720 },
        { id: 'b-warm2', name: 'Cat-Cow', key: 'catcow', type: 'warmup' },
        { id: 'b-warm3', name: 'Dead Bug', key: 'deadbug', type: 'warmup' },
        { id: 'b-fisio1', name: 'Plank Estensione Gamba', key: 'plankestensione', sets: 3, reps: 10, recovery: 0, superset: true, supersetPair: 'ss3', supersetPartner: 'b-fisio2', supersetColor: '#3498DB' },
        { id: 'b-fisio2', name: 'L-Sit', key: 'lsit', sets: 3, reps: 30, recovery: 45, superset: true, supersetPair: 'ss3', supersetPartner: 'b-fisio1', supersetColor: '#3498DB' },
        { id: 'b-fisio3', name: 'Squat Tempo', key: 'squattempo', sets: 3, reps: 8, recovery: 0, superset: true, supersetPair: 'ss4', supersetPartner: 'b-fisio4', supersetColor: '#E74C3C' },
        { id: 'b-fisio4', name: 'Wall Sit', key: 'wallsit', sets: 3, duration: 45, recovery: 120, superset: true, supersetPair: 'ss4', supersetPartner: 'b-fisio3', supersetColor: '#E74C3C' },
        { id: 'b-fisio5', name: 'Affondo Camminato', key: 'affondo', sets: 3, reps: 12, recovery: 120 },
        { id: 'b-pull1', name: 'Lat Machine', key: 'latmachine', sets: 4, reps: 8, recovery: 120 },
        { id: 'b-pull2', name: 'Pulley', key: 'pulley', sets: 3, reps: 12, recovery: 90 },
        { id: 'b-pull3', name: 'Curl Panca 45°', key: 'curlpanca', sets: 3, reps: 10, recovery: 60 },
        { id: 'b-pull4', name: 'Hammer Curl', key: 'hammercurl', sets: 3, reps: 12, recovery: 60 },
        { id: 'b-pull5', name: 'Curl Polsi', key: 'curlpolsi', sets: 3, reps: 15, recovery: 45 },
        { id: 'b-pull6', name: 'Reverse Curl', key: 'reversecurl', sets: 3, reps: 12, recovery: 45 },
        { id: 'b-pull7', name: 'Farmer Walk', key: 'farmerswalk', sets: 3, reps: 60, recovery: 90 }
    ],
    workoutC: [
        { id: 'c-cardio1', name: 'Bike/Tapirulan', key: 'bike', type: 'warmup', duration: 720 },
        { id: 'c-cardio2', name: 'Ellittica', key: 'ellittica', type: 'warmup' },
        { id: 'c-spalle1', name: 'Alzate Laterali Cavo', key: 'alzatecavo', sets: 3, reps: 15, recovery: 45 },
        { id: 'c-spalle2', name: 'Aperture 90°', key: 'aperture90', sets: 3, reps: 12, recovery: 45 },
        { id: 'c-spalle3', name: 'Farmer Walk', key: 'farmerswalk', sets: 2, reps: 60, recovery: 60 },
        { id: 'c-spalle4', name: 'Burpees', key: 'burpees', sets: 3, reps: 180, recovery: 60 },
        { id: 'c-core1', name: 'Russian Twist', key: 'russiantwist', sets: 3, reps: 30, recovery: 45 },
        { id: 'c-core2', name: 'Hollow Rock', key: 'hollowrock', sets: 3, reps: 20, recovery: 45 },
        { id: 'c-core3', name: 'Plank', key: 'plank', sets: 3, reps: 60, recovery: 45 }
    ]
};

// Workout Flow State Management
let workoutFlowState = {
    workoutId: null,
    currentExerciseIndex: 0,
    currentSet: 1,
    timerSeconds: 0,
    timerInterval: null,
    timerRunning: false,
    timerMode: 'stopwatch', // 'stopwatch' or 'countdown'
    restSeconds: 90,
    totalRestSeconds: 90,
    restInterval: null,
    restRunning: false,
    isTransitionRest: false, // Flag to track if it's transition rest between exercises
    exerciseStarted: false, // Flag to track if exercise timer has been manually started
    exercises: []
};

// Wake Lock for keeping screen on during workout
let wakeLock = null;

async function requestWakeLock() {
    try {
        if ('wakeLock' in navigator) {
            wakeLock = await navigator.wakeLock.request('screen');
            console.log('Screen Wake Lock attivo - lo schermo non si bloccherà durante l\'allenamento');

            wakeLock.addEventListener('release', () => {
                console.log('Screen Wake Lock rilasciato');
            });
        } else {
            console.log('Wake Lock API non supportata da questo browser');
        }
    } catch (err) {
        console.error('Errore nell\'attivazione del Wake Lock:', err);
    }
}

function releaseWakeLock() {
    if (wakeLock) {
        wakeLock.release().then(() => {
            wakeLock = null;
            console.log('Screen Wake Lock rilasciato - lo schermo può bloccarsi normalmente');
        });
    }
}

// Re-acquire wake lock when page becomes visible again (user returns to app)
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && workoutFlowState.workoutId) {
        requestWakeLock();
    }
});

// Workout Log for progressive overload tracking
let workoutLog = JSON.parse(localStorage.getItem('workoutLog') || '[]');

function saveSetData(exerciseId, exerciseName, setNumber, load, rpe) {
    const logEntry = {
        date: new Date().toISOString(),
        workoutId: workoutFlowState.workoutId,
        exerciseId: exerciseId,
        exerciseName: exerciseName,
        set: setNumber,
        load: load || null,
        rpe: rpe || null
    };

    workoutLog.push(logEntry);

    // Limit workoutLog to last 200 entries to prevent localStorage overflow
    if (workoutLog.length > 200) {
        workoutLog = workoutLog.slice(-200);
    }

    localStorage.setItem('workoutLog', JSON.stringify(workoutLog));
    console.log('Set salvato:', logEntry);
}

function getLastSetData(exerciseId) {
    // Find the most recent entry for this exercise
    const exerciseLogs = workoutLog.filter(log => log.exerciseId === exerciseId);
    if (exerciseLogs.length === 0) return null;

    // Return the most recent one
    return exerciseLogs[exerciseLogs.length - 1];
}

function startFullWorkout(workoutId) {
    // Initialize flow state
    workoutFlowState.workoutId = workoutId;
    workoutFlowState.exercises = workoutExercises[workoutId];
    workoutFlowState.currentExerciseIndex = 0;

    // Set title
    const titles = {
        workoutA: 'Allenamento 1',
        workoutB: 'Allenamento 2',
        workoutC: 'Allenamento 3'
    };
    const titleEl = document.getElementById('flowWorkoutTitle');
    if (titleEl) titleEl.textContent = titles[workoutId];

    // Hide navigation bar during workout
    const navBar = document.querySelector('.nav-bottom');
    if (navBar) navBar.classList.add('hidden');

    // Show flow view
    const homeView = document.getElementById('homeView');
    const flowView = document.getElementById('workoutFlowView');
    if (homeView) homeView.classList.add('hidden');
    if (flowView) flowView.classList.add('visible');

    // Build sections for start state
    buildFlowSections('flowStartSections', workoutId);

    // Show start state
    setWorkoutFlowState('start');

    // Request Wake Lock to keep screen on
    requestWakeLock();
}

function setWorkoutFlowState(state) {
    const states = ['Start', 'Exercise', 'Rest'];
    states.forEach(s => {
        const el = document.getElementById('flowState' + s);
        if (el) {
            if (s.toLowerCase() === state) {
                el.classList.remove('hidden');
            } else {
                el.classList.add('hidden');
            }
        }
    });
}

function buildFlowSections(containerId, workoutId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    const exercises = workoutExercises[workoutId];
    if (!exercises) return;

    // Group exercises by category
    const grouped = {};
    exercises.forEach(ex => {
        const category = getCategoryForExercise(ex.id);
        if (!grouped[category]) grouped[category] = [];
        grouped[category].push(ex);
    });

    // Generate HTML for each section
    Object.keys(grouped).forEach(category => {
        const exList = grouped[category];
        let html = `<div class="section">
            <div class="section-header" onclick="toggleSection(this)">
                <div class="section-title">${category}</div>
                <div class="section-duration">${exList.length} esercizi</div>
            </div>
            <div class="section-content">`;

        exList.forEach(ex => {
            const exData = exerciseData[ex.key];
            const details = exData && exData.series ? exData.series + (exData.recupero ? ' • Rec ' + exData.recupero : '') : '';

            html += `<div class="exercise-item" onclick="event.stopPropagation(); toggleCheck('${ex.id}')">
                <div class="exercise-header">
                    <div class="checkbox" id="${ex.id}"></div>
                    <div class="exercise-info">
                        <div class="exercise-name">${ex.name}</div>
                        ${details ? `<div class="exercise-details">${details}</div>` : ''}
                    </div>
                    <div class="info-icon" onclick="event.stopPropagation(); showExerciseDetail('${ex.key}')">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2.25C17.3848 2.25 21.75 6.61522 21.75 12C21.75 17.3848 17.3848 21.75 12 21.75C6.61522 21.75 2.25 17.3848 2.25 12C2.25 6.61522 6.61522 2.25 12 2.25ZM12 3.75C7.44365 3.75 3.75 7.44365 3.75 12C3.75 16.5563 7.44365 20.25 12 20.25C16.5563 20.25 20.25 16.5563 20.25 12C20.25 7.44365 16.5563 3.75 12 3.75Z" fill="white"/>
                            <path d="M13.31 14.75C13.7242 14.75 14.06 15.0858 14.06 15.5C14.06 15.8797 13.7778 16.1935 13.4118 16.2432L13.31 16.25H11C10.5858 16.25 10.25 15.9142 10.25 15.5C10.25 15.1203 10.5322 14.8065 10.8982 14.7568L11 14.75H13.31Z" fill="white"/>
                            <path d="M12.159 10.5C12.5387 10.5 12.8525 10.7822 12.9022 11.1482L12.909 11.25V15.5C12.909 15.9142 12.5732 16.25 12.159 16.25C11.7793 16.25 11.4655 15.9678 11.4158 15.6018L11.409 15.5V12H11.009C10.6293 12 10.3155 11.7178 10.2658 11.3518L10.259 11.25C10.259 10.8703 10.5412 10.5565 10.9072 10.5068L11.009 10.5H12.159Z" fill="white"/>
                            <path d="M11.85 7.24726C12.0916 7.24726 12.3066 7.36152 12.4437 7.53896L12.489 7.607L12.5583 7.65353C12.7104 7.7711 12.8161 7.94581 12.8432 8.14549L12.85 8.24726C12.85 8.79954 12.4023 9.24726 11.85 9.24726C11.2977 9.24726 10.85 8.79954 10.85 8.24726C10.85 7.69498 11.2977 7.24726 11.85 7.24726Z" fill="white"/>
                            <path d="M11.85 7.24726C12.4023 7.24726 12.85 7.69498 12.85 8.24726C12.85 8.66147 12.5142 8.99726 12.1 8.99726C11.8584 8.99726 11.6434 8.883 11.5063 8.70556L11.46 8.636L11.3917 8.59099C11.2396 8.47342 11.1339 8.29871 11.1068 8.09903L11.1 7.99726C11.1 7.58305 11.4358 7.24726 11.85 7.24726Z" fill="white"/>
                        </svg>
                    </div>
                </div>
            </div>`;
        });

        html += `</div></div>`;
        container.innerHTML += html;
    });

    // Initialize checkboxes
    initCheckboxes();
}

// Helper to get category name from exercise ID
function getCategoryForExercise(id) {
    if (id.includes('warm')) return 'Riscaldamento';
    if (id.includes('fisio')) return 'Fisioterapia';
    if (id.includes('push')) return 'Push';
    if (id.includes('pull')) return 'Pull';
    if (id.includes('spalle')) return 'Spalle';
    if (id.includes('core') || id.includes('cardio')) return 'Core/Cardio';
    return 'Esercizi';
}

function beginFirstExercise() {
    // Find the first uncompleted exercise based on checkbox state
    const exercises = workoutFlowState.exercises;
    let firstUncompletedIndex = 0;

    for (let i = 0; i < exercises.length; i++) {
        const exercise = exercises[i];
        const checkbox = document.getElementById(exercise.id);
        if (checkbox && !checkbox.classList.contains('checked')) {
            firstUncompletedIndex = i;
            break;
        }
        // If we checked all and none are uncompleted, start from beginning
        if (i === exercises.length - 1) {
            firstUncompletedIndex = 0;
        }
    }

    workoutFlowState.currentExerciseIndex = firstUncompletedIndex;
    startExerciseState();
}

function startExerciseState() {
    console.log('>>> startExerciseState called');
    console.log('State at START:', {
        exerciseIndex: workoutFlowState.currentExerciseIndex,
        currentSet: workoutFlowState.currentSet
    });

    let exercise = workoutFlowState.exercises[workoutFlowState.currentExerciseIndex];
    if (!exercise) {
        console.error('No exercise found at index:', workoutFlowState.currentExerciseIndex);
        return;
    }

    console.log('Exercise:', exercise.name, 'ID:', exercise.id, 'Superset:', exercise.superset, 'Recovery:', exercise.recovery, 'Set:', workoutFlowState.currentSet);

    // Stop metronome if active and not squattempo exercise
    if (exercise.key !== 'squattempo' && isSquatTempoMetronomeActive()) {
        stopSquatTempoMetronome();
    }

    const exerciseInfo = exercise.key ? exerciseData[exercise.key] : null;

    // Update UI
    const category = getCategoryForExercise(exercise.id);
    const categoryElement = document.getElementById('flowExerciseCategory');
    if (categoryElement) categoryElement.textContent = category;

    // Apply superset color if applicable
    const supersetBadge = document.getElementById('flowSupersetBadge');
    if (exercise.superset === true && exercise.supersetPartner) {
        if (categoryElement) categoryElement.style.display = 'none'; // Hide category badge for superset
        if (supersetBadge) supersetBadge.classList.remove('hidden');
    } else {
        if (categoryElement) {
            categoryElement.style.display = ''; // Show category badge
            categoryElement.style.backgroundColor = ''; // Reset to default
        }
        if (supersetBadge) supersetBadge.classList.add('hidden');
    }

    // Show/hide Squat Tempo metronome (ONLY for squattempo exercise)
    const metronomeToggle = document.getElementById('squatTempoMetronome');
    if (metronomeToggle) {
        if (exercise.key === 'squattempo') {
            metronomeToggle.classList.add('visible');
        } else {
            metronomeToggle.classList.remove('visible');
            // Stop metronome if it was active and we're changing exercise
            if (isSquatTempoMetronomeActive()) {
                stopSquatTempoMetronome();
            }
        }
    }

    const exerciseName = document.getElementById('flowExerciseName');
    if (exerciseName) exerciseName.textContent = exercise.name || 'Esercizio';

    // Update stats (hide for warmup exercises)
    const isWarmupOrCardio = exercise.type === 'warmup' || (exercise.duration && !exercise.sets);

    const seriesInfo = document.getElementById('flowSeriesInfo');
    const seriesLabel = seriesInfo?.parentElement;
    if (seriesInfo && seriesLabel) {
        if (isWarmupOrCardio) {
            seriesLabel.style.display = 'none';
        } else {
            seriesLabel.style.display = '';
            if (exercise.sets) {
                seriesInfo.textContent = `${workoutFlowState.currentSet}/${exercise.sets}`;
            } else {
                seriesInfo.textContent = '-';
            }
        }
    }

    const repsInfo = document.getElementById('flowRepsInfo');
    const repsLabel = repsInfo?.parentElement;
    if (repsInfo && repsLabel) {
        if (isWarmupOrCardio) {
            repsLabel.style.display = 'none';
        } else {
            repsLabel.style.display = '';
            if (exercise.reps) {
                repsInfo.textContent = exercise.reps;
            } else if (exercise.duration) {
                repsInfo.textContent = `${exercise.duration}"`;
            } else {
                repsInfo.textContent = '-';
            }
        }
    }

    // Display previous load/RPE data
    const previousDataElement = document.getElementById('flowPreviousData');
    if (previousDataElement) {
        const lastData = getLastSetData(exercise.id);
        if (lastData) {
            let displayText = 'Ultima volta: ';
            const parts = [];
            if (lastData.load) parts.push(`<strong>${lastData.load} Kg</strong>`);
            if (lastData.rpe) parts.push(`RPE <strong>${lastData.rpe}</strong>`);
            displayText += parts.join(' • ');
            previousDataElement.innerHTML = displayText;
            previousDataElement.classList.remove('hidden');
        } else {
            previousDataElement.classList.add('hidden');
        }
    }

    // Update instructions and hide/show "Come eseguire" section for warmup/cardio exercises
    const howToSection = document.querySelector('.how-to-section');
    const howToContent = document.getElementById('flowHowToContent');

    // Hide "Come eseguire" for warmup/cardio exercises (those with type: 'warmup' or only duration, no sets)

    if (howToSection) {
        if (isWarmupOrCardio) {
            howToSection.style.display = 'none';
        } else {
            howToSection.style.display = '';

            if (exerciseInfo && howToContent) {
                let html = '';

                // Add image or video if available
                if (exerciseInfo.image) {
                    html += `<img src="${exerciseInfo.image}" alt="${exerciseInfo.name}" class="exercise-image" />`;
                } else if (exerciseInfo.video) {
                    const videoId = exerciseInfo.video.includes('youtube.com') || exerciseInfo.video.includes('youtu.be')
                        ? exerciseInfo.video.split('/').pop().split('?')[0].replace('watch?v=', '')
                        : '';
                    if (videoId) {
                        html += `<iframe class="exercise-video" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
                    }
                }

                // Add text instructions
                let instructions = exerciseInfo.come || '';
                if (exerciseInfo.tecnica) {
                    instructions += '\n\nTecnica: ' + exerciseInfo.tecnica;
                }
                if (exerciseInfo.note) {
                    instructions += '\n\nNote: ' + exerciseInfo.note;
                }
                html += `<p id="flowExerciseInstructions">${instructions.replace(/\n/g, '<br>')}</p>`;

                howToContent.innerHTML = html;
            } else if (howToContent) {
                howToContent.innerHTML = '<p id="flowExerciseInstructions">Nessuna istruzione disponibile.</p>';
            }
        }
    }

    // Reset timer - check if exercise has duration (countdown) or not (stopwatch)
    if (exercise.duration) {
        workoutFlowState.timerSeconds = exercise.duration;
        workoutFlowState.timerMode = 'countdown';
    } else {
        workoutFlowState.timerSeconds = 0;
        workoutFlowState.timerMode = 'stopwatch';
    }
    updateExerciseTimerDisplay();

    // Reset exercise started flag - user needs to press play
    workoutFlowState.exerciseStarted = false;

    // Update main button to show Play icon
    updateMainExerciseButton();

    // Build sections
    buildFlowSections('flowExerciseSections', workoutFlowState.workoutId);

    // Show exercise state
    setWorkoutFlowState('exercise');
}

function updateMainExerciseButton() {
    const mainButton = document.querySelector('.action-btn-main');
    if (!mainButton) return;

    if (!workoutFlowState.exerciseStarted) {
        // Show Play icon
        mainButton.innerHTML = `
            <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="26" cy="26" r="24" stroke="white" stroke-width="3"/>
                <path d="M20 16L36 26L20 36V16Z" fill="white"/>
            </svg>
        `;
        mainButton.setAttribute('aria-label', 'Start');
    } else {
        // Show Check icon
        mainButton.innerHTML = `
            <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="26" cy="26" r="24" stroke="white" stroke-width="3"/>
                <path d="M16 26L23 33L36 20" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
        mainButton.setAttribute('aria-label', 'Complete');
    }
}

function handleMainExerciseButtonClick() {
    if (!workoutFlowState.exerciseStarted) {
        // First click - start the exercise
        workoutFlowState.exerciseStarted = true;
        startExerciseTimer();
        updateMainExerciseButton();
    } else {
        // Second click - complete the exercise
        completeCurrentExercise();
    }
}

function startExerciseTimer() {
    if (workoutFlowState.timerRunning) return;

    workoutFlowState.timerRunning = true;
    workoutFlowState.timerInterval = setInterval(() => {
        if (workoutFlowState.timerMode === 'countdown') {
            workoutFlowState.timerSeconds--;

            // Countdown beep in last 3 seconds
            if (workoutFlowState.timerSeconds > 0 && workoutFlowState.timerSeconds <= 3) {
                playCountdownBeep(workoutFlowState.timerSeconds === 1);
            }

            if (workoutFlowState.timerSeconds <= 0) {
                workoutFlowState.timerSeconds = 0;
                stopExerciseTimer();
                // Auto complete when countdown reaches 0
                if (navigator.vibrate) navigator.vibrate([200, 100, 200]);

                // For timed exercises (duration-based), automatically proceed to next step
                const exercise = workoutFlowState.exercises[workoutFlowState.currentExerciseIndex];
                if (exercise && exercise.duration) {
                    // Automatically complete the exercise after a short delay
                    setTimeout(() => {
                        completeCurrentExercise();
                    }, 500);
                }
            }
        } else {
            workoutFlowState.timerSeconds++;
        }
        updateExerciseTimerDisplay();
    }, 1000);

    // Update UI
    const playIcon = document.getElementById('flowTimerPlayIcon');
    const pauseIcon = document.getElementById('flowTimerPauseIcon');
    if (playIcon) playIcon.classList.add('hidden');
    if (pauseIcon) pauseIcon.classList.remove('hidden');
}

function stopExerciseTimer() {
    workoutFlowState.timerRunning = false;
    if (workoutFlowState.timerInterval) {
        clearInterval(workoutFlowState.timerInterval);
        workoutFlowState.timerInterval = null;
    }

    // Update UI
    const playIcon = document.getElementById('flowTimerPlayIcon');
    const pauseIcon = document.getElementById('flowTimerPauseIcon');
    if (playIcon) playIcon.classList.remove('hidden');
    if (pauseIcon) pauseIcon.classList.add('hidden');
}

function toggleExerciseTimer() {
    if (workoutFlowState.timerRunning) {
        stopExerciseTimer();
    } else {
        startExerciseTimer();
    }
}

function resetExerciseTimer() {
    stopExerciseTimer();
    const exercise = workoutFlowState.exercises[workoutFlowState.currentExerciseIndex];
    if (exercise && exercise.duration) {
        workoutFlowState.timerSeconds = exercise.duration;
    } else {
        workoutFlowState.timerSeconds = 0;
    }
    updateExerciseTimerDisplay();
}

function updateExerciseTimerDisplay() {
    const mins = Math.floor(workoutFlowState.timerSeconds / 60);
    const secs = workoutFlowState.timerSeconds % 60;
    const timerEl = document.getElementById('flowTimer');
    if (timerEl) {
        timerEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
}

function toggleHowTo() {
    const header = document.querySelector('.how-to-header');
    const content = document.getElementById('flowHowToContent');
    if (header) header.classList.toggle('expanded');
    if (content) content.classList.toggle('expanded');
}

function completeCurrentExercise() {
    console.log('=== completeCurrentExercise called ===');
    console.log('Current state BEFORE:', {
        exerciseIndex: workoutFlowState.currentExerciseIndex,
        currentSet: workoutFlowState.currentSet
    });
    stopExerciseTimer();

    const exercise = workoutFlowState.exercises[workoutFlowState.currentExerciseIndex];
    if (!exercise) {
        console.error('No exercise found at index:', workoutFlowState.currentExerciseIndex);
        return;
    }

    console.log('Exercise:', exercise.name, 'ID:', exercise.id, 'Sets:', exercise.sets, 'CurrentSet:', workoutFlowState.currentSet, 'Superset:', exercise.superset, 'Recovery:', exercise.recovery);

    // Check if this is a superset exercise
    if (exercise.superset && exercise.supersetPartner) {
        // Find the partner exercise
        const partnerIndex = workoutFlowState.exercises.findIndex(ex => ex.id === exercise.supersetPartner);
        const partner = workoutFlowState.exercises[partnerIndex];

        // Determine if we just completed the first or second exercise in the pair
        const isFirstInPair = exercise.recovery === 0;

        if (isFirstInPair) {
            // Just completed first exercise (A), go immediately to second (B)
            console.log('SUPERSET FLOW: First exercise done, moving to second');
            console.log('From:', exercise.name, 'To:', partner.name, 'CurrentSet:', workoutFlowState.currentSet);
            workoutFlowState.currentExerciseIndex = partnerIndex;
            // currentSet stays the same - we're in the middle of the same set
            console.log('State AFTER switch:', {
                exerciseIndex: workoutFlowState.currentExerciseIndex,
                currentSet: workoutFlowState.currentSet
            });
            startExerciseState();
        } else {
            // Just completed second exercise (B), check if more sets needed
            // Use max sets to handle cases where exercises have different set counts
            const maxSets = Math.max(exercise.sets || 0, partner.sets || 0);
            console.log('SUPERSET FLOW: Second exercise done');
            console.log('Current set:', workoutFlowState.currentSet, 'Max sets:', maxSets);
            if (workoutFlowState.currentSet < maxSets) {
                // More sets to do, take rest then go back to first exercise (A)
                console.log('SUPERSET FLOW: More sets needed, going to rest');
                console.log('Current exercise:', exercise.name, 'at index:', workoutFlowState.currentExerciseIndex);
                console.log('Partner:', partner.name, 'at index:', partnerIndex, 'recovery:', partner.recovery);

                // The first exercise in the pair is the one with recovery: 0
                // We need to determine which one is first based on recovery value
                const firstExerciseIndex = partner.recovery === 0 ? partnerIndex : workoutFlowState.currentExerciseIndex;

                // IMPORTANT: Set currentExerciseIndex BEFORE incrementing currentSet
                workoutFlowState.currentExerciseIndex = firstExerciseIndex;
                workoutFlowState.currentSet++;

                console.log('State BEFORE rest:', {
                    exerciseIndex: workoutFlowState.currentExerciseIndex,
                    currentSet: workoutFlowState.currentSet,
                    willRestartWith: workoutFlowState.exercises[firstExerciseIndex].name,
                    exerciseName: workoutFlowState.exercises[workoutFlowState.currentExerciseIndex].name
                });
                startRestState(exercise.recovery);
            } else {
                // All sets complete for this superset
                console.log('Superset complete, marking exercises as done');
                markExerciseComplete(exercise.id);
                markExerciseComplete(partner.id);

                // Find the next exercise after both superset exercises
                const nextIndex = Math.max(
                    workoutFlowState.exercises.findIndex(ex => ex.id === exercise.id),
                    workoutFlowState.exercises.findIndex(ex => ex.id === partner.id)
                ) + 1;

                // Set to the last superset exercise, moveToNextExercise will increment to nextIndex
                workoutFlowState.currentExerciseIndex = nextIndex - 1;
                workoutFlowState.currentSet = 1;

                if (nextIndex >= workoutFlowState.exercises.length) {
                    // Workout complete
                    exitWorkoutFlow();
                    alert('Allenamento completato! Ottimo lavoro!');
                } else {
                    startTransitionRest();
                }
            }
        }
    } else {
        // Regular exercise (not superset)
        // Check if this is a warmup/cardio exercise with only duration (no sets)
        const isWarmupOrCardio = exercise.type === 'warmup' || (exercise.duration && !exercise.sets);

        if (isWarmupOrCardio) {
            // Warmup/cardio exercise complete, mark and move to next
            console.log('Warmup/cardio exercise complete, starting transition rest');
            markExerciseComplete(exercise.id);
            startTransitionRest();
        } else if (exercise.recovery && exercise.sets && workoutFlowState.currentSet < exercise.sets) {
            // Go to rest state
            console.log('Going to rest - has recovery');
            workoutFlowState.currentSet++;
            startRestState(exercise.recovery);
        } else if (exercise.sets && workoutFlowState.currentSet < exercise.sets) {
            // More sets but no recovery specified
            console.log('Going to rest - default recovery');
            workoutFlowState.currentSet++;
            startRestState(90); // Default 90 seconds
        } else {
            // Exercise complete, mark checkbox and add transition rest before next exercise
            console.log('Exercise complete, starting transition rest');
            markExerciseComplete(exercise.id);
            startTransitionRest();
        }
    }
}

function markExerciseComplete(exerciseId) {
    console.log('markExerciseComplete called for:', exerciseId);

    // Mark all checkboxes with this ID (original + clones)
    const checkboxes = document.querySelectorAll(`#${exerciseId}`);
    console.log('Found checkboxes:', checkboxes.length);

    if (checkboxes.length > 0) {
        checkboxes.forEach(checkbox => {
            if (!checkbox.classList.contains('checked')) {
                checkbox.classList.add('checked');
                console.log('Checkbox marked as checked');
            }
        });
        saveProgress();
        updateProgress();
    } else {
        console.error('No checkboxes found for ID:', exerciseId);
    }

    // Also update all cloned checkboxes in the flow sections
    updateFlowSectionsCheckbox(exerciseId);
}

function saveProgress() {
    const checkboxes = document.querySelectorAll('.checkbox');
    const progress = {};
    checkboxes.forEach(cb => {
        progress[cb.id] = cb.classList.contains('checked');
    });
    localStorage.setItem('workoutProgress', JSON.stringify(progress));
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

function updateFlowSectionsCheckbox(exerciseId) {
    // Update checkboxes in all flow section containers
    const containers = ['flowStartSections', 'flowExerciseSections', 'flowRestSections'];
    containers.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container) {
            const checkboxes = container.querySelectorAll(`[id="${exerciseId}"]`);
            checkboxes.forEach(cb => {
                cb.classList.add('checked');
            });
        }
    });
}

function startRestState(restTime) {
    // Stop exercise timer if it's still running
    stopExerciseTimer();

    workoutFlowState.restSeconds = restTime || 90;
    workoutFlowState.totalRestSeconds = workoutFlowState.restSeconds;
    workoutFlowState.isTransitionRest = false; // This is a regular rest between sets

    updateRestTimerDisplay();
    updateRestCircle(1); // Start at 100%

    // Hide/show log inputs based on exercise type
    const exercise = workoutFlowState.exercises[workoutFlowState.currentExerciseIndex];
    const logInputsSection = document.getElementById('rest-log-inputs');

    // Hide log inputs for warmup/cardio exercises (those with type: 'warmup' or only duration, no sets)
    const isWarmupOrCardio = exercise && (exercise.type === 'warmup' || (exercise.duration && !exercise.sets));

    if (logInputsSection) {
        if (isWarmupOrCardio) {
            logInputsSection.style.display = 'none';
        } else {
            logInputsSection.style.display = '';
        }
    }

    // Build sections
    buildFlowSections('flowRestSections', workoutFlowState.workoutId);

    // Show rest state
    setWorkoutFlowState('rest');

    // Start rest timer
    startRestTimer();
}

function startRestTimer() {
    if (workoutFlowState.restRunning) return;

    workoutFlowState.restRunning = true;

    workoutFlowState.restInterval = setInterval(() => {
        workoutFlowState.restSeconds--;
        updateRestTimerDisplay();

        const progress = workoutFlowState.restSeconds / workoutFlowState.totalRestSeconds;
        updateRestCircle(progress);

        // Countdown beep in last 3 seconds
        if (workoutFlowState.restSeconds > 0 && workoutFlowState.restSeconds <= 3) {
            playCountdownBeep(workoutFlowState.restSeconds === 1);
        }

        if (workoutFlowState.restSeconds <= 0) {
            stopRestTimer();
            // Auto advance with logging opportunity
            logAndMoveToNextSet();
        }
    }, 1000);

    // Update UI
    const pauseIcon = document.getElementById('flowRestPauseIcon');
    const playIcon = document.getElementById('flowRestPlayIcon');
    if (pauseIcon) pauseIcon.classList.remove('hidden');
    if (playIcon) playIcon.classList.add('hidden');
}

function stopRestTimer() {
    workoutFlowState.restRunning = false;
    if (workoutFlowState.restInterval) {
        clearInterval(workoutFlowState.restInterval);
        workoutFlowState.restInterval = null;
    }

    // Update UI
    const pauseIcon = document.getElementById('flowRestPauseIcon');
    const playIcon = document.getElementById('flowRestPlayIcon');
    if (pauseIcon) pauseIcon.classList.add('hidden');
    if (playIcon) playIcon.classList.remove('hidden');
}

function toggleRestTimer() {
    if (workoutFlowState.restRunning) {
        stopRestTimer();
    } else {
        startRestTimer();
    }
}

function updateRestTimerDisplay() {
    const mins = Math.floor(workoutFlowState.restSeconds / 60);
    const secs = workoutFlowState.restSeconds % 60;
    const timerEl = document.getElementById('flowRestTimer');
    if (timerEl) {
        timerEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
}

function updateRestCircle(progress) {
    const circle = document.getElementById('flowRestCircle');
    if (!circle) return;
    const radius = 136;
    const circumference = 2 * Math.PI * radius;

    circle.style.strokeDasharray = circumference;
    const offset = circumference * (1 - progress);
    circle.style.strokeDashoffset = offset;
}

function skipRest() {
    stopRestTimer();
    startExerciseState();
}

function logAndMoveToNextSet() {
    // Get the current exercise
    const exercise = workoutFlowState.exercises[workoutFlowState.currentExerciseIndex];
    if (!exercise) {
        console.error('No exercise found');
        return;
    }

    // Get load and RPE values from inputs (only for regular rest, not transition)
    if (!workoutFlowState.isTransitionRest) {
        const loadInput = document.getElementById('load-during-rest');
        const rpeInput = document.getElementById('rpe-during-rest');
        if (loadInput && rpeInput) {
            let load = loadInput.value ? parseFloat(loadInput.value) : null;
            let rpe = rpeInput.value ? parseFloat(rpeInput.value) : null;

            // Validate load (must be >= 0)
            if (load !== null && (isNaN(load) || load < 0)) {
                console.warn('Invalid load value:', loadInput.value);
                load = null;
            }

            // Validate RPE (must be between 1 and 10)
            if (rpe !== null && (isNaN(rpe) || rpe < 1 || rpe > 10)) {
                console.warn('Invalid RPE value:', rpeInput.value);
                rpe = null;
            }

            // Save the set data if at least one valid value was entered
            if (load !== null || rpe !== null) {
                saveSetData(
                    exercise.id,
                    exercise.name,
                    workoutFlowState.currentSet - 1, // We already incremented in completeCurrentExercise
                    load,
                    rpe
                );
            }

            // Clear the input fields
            loadInput.value = '';
            rpeInput.value = '';
        }
    }

    // Provide feedback (vibration + audio)
    if (navigator.vibrate) {
        navigator.vibrate([200]);
    }

    // Play a simple beep sound using Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);

        // Close AudioContext after beep finishes
        setTimeout(() => {
            audioContext.close();
        }, 250);
    } catch (err) {
        console.log('Audio feedback non disponibile:', err);
    }

    // Stop the rest timer
    stopRestTimer();

    // Move to next set or next exercise depending on the rest type
    if (workoutFlowState.isTransitionRest) {
        // This was a transition rest, move to the next exercise
        moveToNextExercise();
    } else {
        // This was a regular rest between sets, start the next set
        startExerciseState();
    }
}

function startTransitionRest() {
    console.log('Starting transition rest between exercises');

    // Stop exercise timer and metronome if still running
    stopExerciseTimer();
    if (isSquatTempoMetronomeActive()) {
        stopSquatTempoMetronome();
    }

    // Set transition rest time (60 seconds default for equipment change)
    workoutFlowState.restSeconds = 60;
    workoutFlowState.totalRestSeconds = workoutFlowState.restSeconds;
    workoutFlowState.isTransitionRest = true; // Mark this as transition rest

    updateRestTimerDisplay();
    updateRestCircle(1); // Start at 100%

    // Build sections
    buildFlowSections('flowRestSections', workoutFlowState.workoutId);

    // Show rest state
    setWorkoutFlowState('rest');

    // Start transition rest timer
    startTransitionRestTimer();
}

function startTransitionRestTimer() {
    if (workoutFlowState.restRunning) return;

    workoutFlowState.restRunning = true;

    workoutFlowState.restInterval = setInterval(() => {
        workoutFlowState.restSeconds--;
        updateRestTimerDisplay();

        const progress = workoutFlowState.restSeconds / workoutFlowState.totalRestSeconds;
        updateRestCircle(progress);

        if (workoutFlowState.restSeconds <= 0) {
            stopRestTimer();
            // Move to next exercise after transition rest
            moveToNextExercise();
        }
    }, 1000);

    // Update UI
    const pauseIcon = document.getElementById('flowRestPauseIcon');
    const playIcon = document.getElementById('flowRestPlayIcon');
    if (pauseIcon) pauseIcon.classList.remove('hidden');
    if (playIcon) playIcon.classList.add('hidden');
}

function skipTransitionRest() {
    stopRestTimer();
    moveToNextExercise();
}

function moveToNextExercise() {
    console.log('moveToNextExercise called, current index:', workoutFlowState.currentExerciseIndex);
    workoutFlowState.currentExerciseIndex++;
    workoutFlowState.currentSet = 1;

    console.log('New index:', workoutFlowState.currentExerciseIndex, 'Total exercises:', workoutFlowState.exercises.length);

    if (workoutFlowState.currentExerciseIndex >= workoutFlowState.exercises.length) {
        // Workout complete
        console.log('Workout complete!');
        exitWorkoutFlow();
        alert('Allenamento completato! Ottimo lavoro!');
    } else {
        console.log('Starting next exercise');
        startExerciseState();
    }
}

function exitWorkoutFlow() {
    // Stop all timers
    stopExerciseTimer();
    stopRestTimer();

    // Stop Squat Tempo metronome if active
    if (isSquatTempoMetronomeActive()) {
        stopSquatTempoMetronome();
    }

    // Release Wake Lock
    releaseWakeLock();

    // Reset state
    workoutFlowState = {
        workoutId: null,
        currentExerciseIndex: 0,
        currentSet: 1,
        timerSeconds: 0,
        timerInterval: null,
        timerRunning: false,
        timerMode: 'stopwatch',
        restSeconds: 90,
        totalRestSeconds: 90,
        restInterval: null,
        restRunning: false,
        isTransitionRest: false,
        exerciseStarted: false,
        exercises: []
    };

    // Navigate back to home page
    window.location.href = 'index.html';
}

// Initialize on page load if on workout-flow page
document.addEventListener('DOMContentLoaded', function() {
    const workoutId = getUrlParameter('workout');
    if (workoutId && workoutExercises[workoutId]) {
        initCheckboxes();
        startFullWorkout(workoutId);
    }

    // Add event listeners for flow buttons
    const btnStartWorkout = document.getElementById('btnStartWorkout');
    if (btnStartWorkout) {
        btnStartWorkout.addEventListener('click', beginFirstExercise);
    }

    const btnCompleteExercise = document.getElementById('btnCompleteExercise');
    if (btnCompleteExercise) {
        btnCompleteExercise.addEventListener('click', completeCurrentExercise);
    }

    const btnSkipExercise = document.getElementById('btnSkipExercise');
    if (btnSkipExercise) {
        btnSkipExercise.addEventListener('click', () => {
            workoutFlowState.currentExerciseIndex++;
            startExerciseState();
        });
    }

    const btnSkipRest = document.getElementById('btnSkipRest');
    if (btnSkipRest) {
        btnSkipRest.addEventListener('click', skipRest);
    }

    const btnAddTime = document.getElementById('btnAddTime');
    if (btnAddTime) {
        btnAddTime.addEventListener('click', () => {
            workoutFlowState.restSeconds += 30;
            updateRestTimerDisplay();
        });
    }
});

// Expose functions to window for onclick handlers
window.startFullWorkout = startFullWorkout;
window.beginFirstExercise = beginFirstExercise;
window.toggleExerciseTimer = toggleExerciseTimer;
window.resetExerciseTimer = resetExerciseTimer;
window.completeCurrentExercise = completeCurrentExercise;
window.handleMainExerciseButtonClick = handleMainExerciseButtonClick;
window.toggleHowTo = toggleHowTo;
window.toggleRestTimer = toggleRestTimer;
window.skipRest = skipRest;
window.skipTransitionRest = skipTransitionRest;
window.exitWorkoutFlow = exitWorkoutFlow;
window.toggleSquatTempoMetronome = toggleSquatTempoMetronome;
window.toggleSection = toggleSection;
window.showExerciseDetail = (key) => showExerciseDetail(key, exerciseData);
window.closeExerciseModal = closeExerciseModal;
window.logAndMoveToNextSet = logAndMoveToNextSet;
window.toggleCheck = (id) => {
    const checkbox = document.getElementById(id);
    if (checkbox) {
        checkbox.classList.toggle('checked');
        // Save to localStorage if needed
    }
};

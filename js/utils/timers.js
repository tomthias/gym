// ========== TIMER UTILITIES ==========

// Audio beep sound
const beepSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZSA0PVqzn77BdGAg+ltrzxnMpBSl+zPLaizsIGGS57OihUQ0MUKXi8bllHAU2j9n0z30sBS1+zPDajjwIF2u/7eScTgwOVKvl8LJfGwk7ldf0yHYpBSyAzvLaizgJGGe87OijTA0NUqbh8bllHAU2j9ny0H4tBS1/zPDajzwIGGu/7eScTgwOVKvl8LJfGwk7ldf0yHYpBSyBzvLaizcJGWe87OijTA0NUqfh8blmHAU2kNny0H4tBS2AzvDajzwIF2u/7eScTgwOVKvm8LJfGwk7ldf0yHYpBSyBzvLaizcJGWe87OijTA0NU6fi8blmHAU2kNny0H4tBS2AzvDajzwIF2vA7eSbTgwOVKvm8LJfGwk7ltf0yHYpBSyBzvLaizcJGWe87OijTA0NU6fi8blmHAU2kNny0H4tBS2AzvDajzwIF2vA7eSbTgwOVKzm8LJfGwk7ltf0yHYpBSyBzvLaizcJGWe87OijTA0NU6fi8blmHAU2kNny0H4tBS2AzvDajzwIF2vA7eSbTgwOVKzm8LJfGwk7ltf0yHYpBSyBzvLaizcJGWe87OijTA0NU6fi8blmHAU2kNny0H4tBS2AzvDajzwIF2vA7eSbTgwOVKzm8LJfGwk7ltf0yHYpBSyBzvLaizcJGWe87OijTA0NU6fi8blmHAU2kNny0H4tBS2AzvDajzwIF2vA7eSbTgwOVKzm8LJfGwk7ltf0yHYpBSyBzvLaizcJGWe87OijTA0NU6fi8blmHAU2kNny0H4tBS2AzvDajzwIF2vA7eSbTgwOVKzm8LJfGwk7ltf0yHYpBSyBzvLaizcJGWe87OijTA0NU6fi8blmHAU2kNny0H4tBS2AzvDajzwIF2vA7eSbTgwOVKzm8LJfGwk7ltf0yHYpBSyBzvLaizcJGWe87OijTA0NU6fi8blmHAU2kNny0H4tBS2AzvDajzwIF2vA7eSbTgwOVKzm8LJfGwk7ltf0yHYpBSyBzvLaizcJGWe87OijTA0NU6fi8blmHAU2kNny0H4tBS2AzvDajzwIF2vA7eSbTgwOVKzm8LJfGwk7ltf0yHYpBSyBzvLaizcJGWe87OijTA0NU6fi8bmHAg==');

// ========== TABATA TIMER ==========
let tabataInterval;
let tabataTime;
let tabataPhase = 'work'; // 'work' or 'rest'
let tabataRound = 0;
let tabataExerciseIndex = 0;
let tabataPaused = false;
const tabataExercises = ['V-up', 'Crunch', 'Biciclette', 'Plank'];

export function startTabata() {
    tabataRound = 0;
    tabataExerciseIndex = 0;
    tabataPhase = 'work';
    tabataTime = 20;
    tabataPaused = false;

    document.getElementById('tabataTimer').classList.add('active');
    updateTabataUI();
    runTabata();
}

function runTabata() {
    if (!tabataPaused) {
        tabataInterval = setInterval(() => {
            if (!tabataPaused) {
                tabataTime--;
                updateTabataUI();

                if (tabataTime === 0) {
                    playBeep();
                    if (navigator.vibrate) navigator.vibrate(200);

                    if (tabataPhase === 'work') {
                        // Just finished work phase, go to rest
                        tabataPhase = 'rest';
                        tabataTime = 10;
                    } else {
                        // Just finished rest phase, start new work round
                        tabataPhase = 'work';
                        tabataTime = 20;
                        tabataRound++;

                        if (tabataRound >= 8) {
                            stopTabata();
                            alert('Tabata completato! Grande lavoro!');
                            return;
                        }

                        // Change exercise at the START of new work round
                        tabataExerciseIndex++;
                        if (tabataExerciseIndex >= tabataExercises.length) {
                            tabataExerciseIndex = 0;
                        }
                    }
                    updateTabataUI();
                }
            }
        }, 1000);
    }
}

function updateTabataUI() {
    document.getElementById('timerNumber').textContent = tabataTime;
    document.getElementById('timerPhase').textContent = tabataPhase === 'work' ? 'LAVORO' : 'RIPOSO';
    document.getElementById('timerExercise').textContent = tabataExercises[tabataExerciseIndex];
    document.getElementById('timerRounds').textContent = `Round ${tabataRound + 1}/8`;

    const circle = document.getElementById('timerCircleProgress');
    const maxTime = tabataPhase === 'work' ? 20 : 10;
    const dashOffset = 817 - (817 * tabataTime / maxTime);
    circle.style.strokeDashoffset = dashOffset;

    if (tabataPhase === 'rest') {
        circle.classList.add('rest');
    } else {
        circle.classList.remove('rest');
    }
}

export function toggleTabata() {
    tabataPaused = !tabataPaused;
    const pauseIcon = document.getElementById('tabataPauseIcon');
    const playIcon = document.getElementById('tabataPlayIcon');

    if (tabataPaused) {
        pauseIcon.style.display = 'none';
        playIcon.style.display = 'block';
    } else {
        pauseIcon.style.display = 'block';
        playIcon.style.display = 'none';
    }
}

export function stopTabata() {
    clearInterval(tabataInterval);
    document.getElementById('tabataTimer').classList.remove('active');
}

function playBeep() {
    try {
        beepSound.play().catch(() => {});
    } catch (e) {}
}

// ========== RECOVERY TIMER ==========
let recoveryInterval;
let recoverySeconds = 0;

export function startRecoveryTimer(seconds) {
    stopRecoveryTimer();
    recoverySeconds = seconds;

    const toast = document.getElementById('recoveryToast');
    toast.classList.add('active');
    updateRecoveryUI();

    recoveryInterval = setInterval(() => {
        recoverySeconds--;
        updateRecoveryUI();

        if (recoverySeconds <= 0) {
            stopRecoveryTimer();
            if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
        }
    }, 1000);
}

function updateRecoveryUI() {
    const mins = Math.floor(recoverySeconds / 60);
    const secs = recoverySeconds % 60;
    document.getElementById('recoveryTime').textContent =
        `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function stopRecoveryTimer() {
    clearInterval(recoveryInterval);
    const toast = document.getElementById('recoveryToast');
    if (toast) {
        toast.classList.remove('active');
    }
}

// ========== SQUAT TEMPO METRONOME (3-3-3) ==========
let squatTempoMetronomeInterval = null;
let squatTempoMetronomeActive = false;

export function startSquatTempoMetronome() {
    if (squatTempoMetronomeInterval) return;

    squatTempoMetronomeActive = true;
    const metronomeBtn = document.getElementById('squatTempoMetronome');
    const metronomeLabel = document.getElementById('metronomeLabel');

    metronomeBtn.classList.add('active');
    metronomeLabel.textContent = 'Disattiva Metronomo';

    // Beep every 1 second
    squatTempoMetronomeInterval = setInterval(() => {
        playMetronomeBeep();
    }, 1000);

    // Play first beep immediately
    playMetronomeBeep();
}

export function stopSquatTempoMetronome() {
    if (squatTempoMetronomeInterval) {
        clearInterval(squatTempoMetronomeInterval);
        squatTempoMetronomeInterval = null;
    }

    squatTempoMetronomeActive = false;
    const metronomeBtn = document.getElementById('squatTempoMetronome');
    const metronomeLabel = document.getElementById('metronomeLabel');

    if (metronomeBtn) {
        metronomeBtn.classList.remove('active');
        metronomeLabel.textContent = 'Attiva Metronomo 3-3-3';
    }
}

export function toggleSquatTempoMetronome() {
    if (squatTempoMetronomeActive) {
        stopSquatTempoMetronome();
    } else {
        startSquatTempoMetronome();
    }
}

function playMetronomeBeep() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;  // 800Hz for clear beep
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);

        // Close AudioContext after beep finishes
        setTimeout(() => {
            audioContext.close();
        }, 150);
    } catch (err) {
        console.log('Metronome beep not available:', err);
    }
}

export function isSquatTempoMetronomeActive() {
    return squatTempoMetronomeActive;
}

// ========== COUNTDOWN BEEP ==========
export function playCountdownBeep(isFinal = false) {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Higher pitch for final beep, lower for countdown
        oscillator.frequency.value = isFinal ? 1200 : 800;
        oscillator.type = 'sine';

        const duration = isFinal ? 0.3 : 0.15;
        gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);

        // Close AudioContext after beep finishes
        setTimeout(() => {
            audioContext.close();
        }, (duration + 0.05) * 1000);
    } catch (err) {
        console.log('Countdown beep not available:', err);
    }
}

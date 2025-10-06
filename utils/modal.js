// ========== MODAL MANAGEMENT ==========

// Show exercise detail modal
export function showExerciseDetail(exerciseKey, exerciseData) {
    const exercise = exerciseData[exerciseKey];
    if (!exercise) return;

    const modal = document.getElementById('exerciseModal');
    const title = document.getElementById('modalTitle');
    const body = document.getElementById('modalBody');

    title.textContent = exercise.name;

    let html = '';

    // Immagine o video
    if (exercise.image) {
        html += `<img src="${exercise.image}" alt="${exercise.name}" class="exercise-image" />`;
    } else if (exercise.video) {
        const videoId = exercise.video.includes('youtube.com') || exercise.video.includes('youtu.be')
            ? exercise.video.split('/').pop().split('?')[0].replace('watch?v=', '')
            : '';
        if (videoId) {
            html += `<iframe class="exercise-video" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
        }
    }

    // Info principali
    if (exercise.series || exercise.carico || exercise.recupero) {
        html += '<div class="detail-grid">';
        if (exercise.series) {
            html += `<div class="detail-box">
                <div class="detail-box-label">Serie × Rip</div>
                <div class="detail-box-value">${exercise.series}</div>
            </div>`;
        }
        if (exercise.carico) {
            html += `<div class="detail-box">
                <div class="detail-box-label">Carico</div>
                <div class="detail-box-value">${exercise.carico}</div>
            </div>`;
        }
        if (exercise.recupero) {
            html += `<div class="detail-box">
                <div class="detail-box-label">Recupero</div>
                <div class="detail-box-value">${exercise.recupero}</div>
            </div>`;
        }
        html += '</div>';
    }

    // Focus
    if (exercise.focus) {
        html += `<div class="detail-section">
            <div class="detail-label">Focus</div>
            <div class="detail-value">${exercise.focus}</div>
        </div>`;
    }

    // Come si fa
    if (exercise.come) {
        html += `<div class="detail-section">
            <div class="detail-label">Come si fa</div>
            <div class="detail-value">${exercise.come}</div>
        </div>`;
    }

    // Tecnica
    if (exercise.tecnica) {
        html += `<div class="detail-section">
            <div class="detail-label">Tecnica</div>
            <div class="detail-value">${exercise.tecnica}</div>
        </div>`;
    }

    // Note
    if (exercise.note) {
        html += `<div class="detail-section">
            <div class="detail-label">Note</div>
            <div class="detail-value">${exercise.note}</div>
        </div>`;
    }

    // Warning per fisioterapia
    if (exercise.fisio) {
        html += `<div class="warning-box">
        Fisioterapia
        </div>`;
    }

    body.innerHTML = html;
    modal.classList.add('visible');
}

export function closeExerciseModal() {
    const modal = document.getElementById('exerciseModal');
    if (modal) {
        modal.classList.remove('visible');
    }
}

// Close modal when clicking outside
export function initModalClickOutside() {
    const modal = document.getElementById('exerciseModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeExerciseModal();
            }
        });
    }
}

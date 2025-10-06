// ========== SHARED UTILITIES AND NAVIGATION ==========

// LocalStorage helpers
export function saveToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function getFromLocalStorage(key, defaultValue = null) {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
}

// Common modal functions
export function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('visible');
    }
}

export function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('visible');
    }
}

// Navigation between pages
export function navigateToPage(pagePath, params = {}) {
    const url = new URL(pagePath, window.location.origin);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    window.location.href = url.toString();
}

// Get URL parameter
export function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Clear all cache
export function clearAllCache() {
    if (confirm('Vuoi cancellare tutti i progressi salvati? Questa azione non può essere annullata.')) {
        localStorage.clear();
        location.reload();
    }
}

// Initialize checkboxes with SVG inline
export function initCheckboxes() {
    const uncheckedSVG = '<svg class="svg-unchecked" width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="0.5" width="15" height="15" rx="7.5" stroke="#D0D5DD"/></svg>';
    const checkedSVG = '<svg class="svg-checked" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0ZM11.9229 4.91113C11.5974 4.5857 11.0696 4.5857 10.7441 4.91113L6.75 8.9043L5.25586 7.41113C4.93042 7.0857 4.40356 7.0857 4.07812 7.41113C3.75269 7.73657 3.75269 8.26343 4.07812 8.58887L6.16113 10.6729C6.31731 10.8289 6.52921 10.9169 6.75 10.917C6.97099 10.917 7.18358 10.8291 7.33984 10.6729L11.9229 6.08887C12.2481 5.76349 12.248 5.23653 11.9229 4.91113Z" fill="#00875F"/></svg>';

    document.querySelectorAll('.checkbox').forEach(checkbox => {
        if (!checkbox.querySelector('svg')) {
            checkbox.innerHTML = uncheckedSVG + checkedSVG;
        }
    });
}

// Toggle section expand/collapse
export function toggleSection(header) {
    const content = header.nextElementSibling;
    header.classList.toggle('expanded');
    content.classList.toggle('expanded');
}

// PWA Installation
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
});

export function getDeferredPrompt() {
    return deferredPrompt;
}

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then(registration => {
                console.log('Service Worker registered:', registration);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}

// Initialize navigation
document.addEventListener('DOMContentLoaded', function() {
    // Handle bottom navigation clicks
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const view = this.dataset.view;
            if (view) {
                const pages = {
                    'home': 'index.html',
                    'nutrition': 'nutrition.html',
                    'history': 'history.html'
                };
                if (pages[view]) {
                    window.location.href = pages[view];
                }
            }
        });
    });
});

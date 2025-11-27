// src/utils/filtering.js
// Håndterer logikken for søgning og filtrering på siden

/**
 * Sætter event listeners på filterknapperne for at opdatere indholdet.
 * Denne funktion forudsætter, at window.updateFilterAndReload er defineret i HomePage.js
 */
export function setupFiltering() {
    const filterButtonsContainer = document.getElementById('filter-buttons');
    if (!filterButtonsContainer) return;

    // Lyt til klik på hele containeren og deleger eventet til knapperne
    filterButtonsContainer.addEventListener('click', (event) => {
        const target = event.target;
        if (target.classList.contains('filter-btn')) {
            const filterType = target.dataset.filter;
            
            // Kald den globale funktion defineret i HomePage.js for at opdatere state og genindlæse
            if (window.updateFilterAndReload) {
                window.updateFilterAndReload('filterType', filterType);
            }
        }
    });
}
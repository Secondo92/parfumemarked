// src/utils/ui.js

/**
 * Viser en flydende beskedboks i hjørnet.
 */
export function showMessageBox(message, type) {
    const box = document.getElementById('message-box');
    const color = type === 'error' ? 'bg-red-500' : 'bg-green-500';

    const messageHtml = `
        <div class="${color} text-white p-4 rounded-lg shadow-xl mb-3 transform transition-opacity duration-300" style="min-width: 250px;">
            ${message}
        </div>
    `;

    box.insertAdjacentHTML('beforeend', messageHtml);
    const newMessage = box.lastElementChild;
    
    // Vis
    setTimeout(() => {
        newMessage.style.opacity = '1';
        box.style.transform = 'translateX(0)';
    }, 50);

    // Skjul efter 4 sekunder
    setTimeout(() => {
        newMessage.style.opacity = '0';
        newMessage.addEventListener('transitionend', function handler() {
            if (newMessage.style.opacity === '0') {
                newMessage.remove();
                if (!box.children.length) {
                    box.style.transform = 'translateX(100%)';
                }
                newMessage.removeEventListener('transitionend', handler);
            }
        });

    }, 4000);
}

/**
 * Lukker en specifik modal.
 * @param {string} modalId - ID'et på den modal, der skal lukkes.
 */
export function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    modal.classList.add('opacity-0');
    
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300); 
}

// Global funktion til at lukke modaler, eksponeret til HTML's onclick attribut
window.closeModal = closeModal;
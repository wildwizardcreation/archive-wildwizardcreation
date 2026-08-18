document.addEventListener('DOMContentLoaded', () => {
    // Inject CSS for the lightbox
    const style = document.createElement('style');
    style.textContent = `
        .custom-lightbox-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            align-items: center;
            display: flex;
            z-index: 999999;
            flex-direction: column;
            justify-content: center;
            background: rgba(0, 0, 0, 0.8);
            cursor: pointer;
        }

        .custom-lightbox-image {
            max-width: 70vw;
            max-height: 70vh;
            object-fit: contain;
            margin: 0px;
            // cursor: default;
        }
        
        img:hover {
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);

    // Use Event Delegation to handle dynamically loaded images
    document.body.addEventListener('click', (e) => {
        // Check if the clicked element is an image, but NOT the lightbox image itself
        if (e.target.tagName === 'IMG' && !e.target.classList.contains('custom-lightbox-image')) {
            e.preventDefault(); 
            e.stopPropagation();

            const img = e.target;

            // Create overlay
            const overlay = document.createElement('div');
            overlay.className = 'custom-lightbox-overlay';

            // Create image inside overlay
            const fullImg = document.createElement('img');
            fullImg.src = img.src;
            fullImg.className = 'custom-lightbox-image';

            // Append to DOM
            overlay.appendChild(fullImg);
            document.body.appendChild(overlay);

            // Close on click
            overlay.addEventListener('click', () => {
                if (document.body.contains(overlay)) {
                    document.body.removeChild(overlay);
                }
            });
        }
    });
});

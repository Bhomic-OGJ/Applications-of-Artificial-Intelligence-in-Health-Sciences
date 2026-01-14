// Page Navigation System
let currentPage = 1;
const totalPages = 11; // Adjust based on your actual number of pages

// Initialize the page viewer
document.addEventListener('DOMContentLoaded', function() {
    initializeThumbnails();
    initializePageGrid();
    updatePageDisplay();
    setupEventListeners();
    setupSmoothScrolling();
    setupMobileMenu();
});

// Initialize thumbnails
function initializeThumbnails() {
    const thumbnailsContainer = document.getElementById('thumbnails');
    thumbnailsContainer.innerHTML = '';
    
    for (let i = 1; i <= totalPages; i++) {
        const thumbnail = document.createElement('div');
        thumbnail.className = `thumbnail ${i === 1 ? 'active' : ''}`;
        thumbnail.onclick = () => goToPage(i);
        
        const img = document.createElement('img');
        img.src = `assets/pages/page${i}.jpg`;
        img.alt = `Page ${i}`;
        img.onerror = function() {
            this.src = `https://picsum.photos/seed/page${i}/100/140.jpg`;
        };
        
        thumbnail.appendChild(img);
        thumbnailsContainer.appendChild(thumbnail);
    }
}

// Initialize page grid
function initializePageGrid() {
    const gridContainer = document.getElementById('pageGrid');
    gridContainer.innerHTML = '';
    
    for (let i = 1; i <= totalPages; i++) {
        const gridItem = document.createElement('div');
        gridItem.className = 'grid-item';
        gridItem.onclick = () => openModal(`assets/pages/page${i}.jpg`, `Page ${i}`);
        
        const img = document.createElement('img');
        img.src = `assets/pages/page${i}.jpg`;
        img.alt = `Page ${i}`;
        img.onerror = function() {
            this.src = `https://picsum.photos/seed/page${i}/250/350.jpg`;
        };
        
        const overlay = document.createElement('div');
        overlay.className = 'grid-item-overlay';
        overlay.innerHTML = `
            <h4>Page ${i}</h4>
            <p>Click to view full size</p>
        `;
        
        gridItem.appendChild(img);
        gridItem.appendChild(overlay);
        gridContainer.appendChild(gridItem);
    }
}

// Navigation functions
function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        updatePageDisplay();
    }
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        updatePageDisplay();
    }
}

function goToPage(pageNumber) {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
        currentPage = pageNumber;
        updatePageDisplay();
    }
}

function updatePageDisplay() {
    // Update main page image
    const pageImage = document.getElementById('currentPageImage');
    pageImage.src = `assets/pages/page${currentPage}.jpg`;
    pageImage.alt = `Page ${currentPage}`;
    pageImage.onerror = function() {
        this.src = `https://picsum.photos/seed/page${currentPage}/800/1000.jpg`;
    };
    
    // Update page number display
    document.getElementById('currentPage').textContent = currentPage;
    document.getElementById('totalPages').textContent = totalPages;
    
    // Update page number overlay
    const pageNumberOverlay = document.querySelector('.page-number');
    if (pageNumberOverlay) {
        pageNumberOverlay.textContent = `Page ${currentPage}`;
    }
    
    // Update thumbnail active state
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumb, index) => {
        thumb.classList.toggle('active', index + 1 === currentPage);
    });
    
    // Update button states
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    
    // Scroll thumbnail into view
    const activeThumbnail = thumbnails[currentPage - 1];
    if (activeThumbnail) {
        activeThumbnail.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
}

// Modal functions
function openModal(imageSrc, altText) {
    const modal = document.getElementById('fullscreenModal');
    const modalImg = document.getElementById('modalImage');
    
    modalImg.src = imageSrc;
    modalImg.alt = altText;
    modalImg.onerror = function() {
        this.src = `https://picsum.photos/seed/fullscreen/1200/1600.jpg`;
    };
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Ensure proper modal positioning
    setTimeout(() => {
        const modalContent = document.querySelector('.modal-content');
        modalContent.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
}

function closeModal() {
    const modal = document.getElementById('fullscreenModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Click on page image to open modal
document.getElementById('currentPageImage').addEventListener('click', function() {
    openModal(this.src, this.alt);
});

// Close modal when clicking outside
document.getElementById('fullscreenModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// Download PDF function
function downloadPDF() {
    // Create a link element for download
    const link = document.createElement('a');
    link.href = 'assets/Brochure_Application of Artificial Intelligence in Health Sciences (1).pdf';
    link.download = 'brochure.pdf';
    
    // If PDF doesn't exist, show a message
    link.onerror = function() {
        showNotification('PDF will be available soon. Contact us for a copy.');
        return false;
    };
    
    // Try to download
    try {
        link.click();
        showNotification('Download started!');
    } catch (error) {
        showNotification('PDF will be available soon. Contact us for a copy.');
    }
}

// Contact form submission
function handleSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    // Here you would normally send the data to a server
    console.log('Form submitted:', data);
    
    // Show success message
    showNotification('Thank you for your message! We\'ll get back to you soon.');
    
    // Reset form
    event.target.reset();
}

// Notification system
function showNotification(message) {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Setup event listeners
function setupEventListeners() {
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            previousPage();
        } else if (e.key === 'ArrowRight') {
            nextPage();
        } else if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    const pageImage = document.getElementById('currentPageImage');
    
    pageImage.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    pageImage.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next page
                nextPage();
            } else {
                // Swipe right - previous page
                previousPage();
            }
        }
    }
}

// Smooth scrolling
function setupSmoothScrolling() {
    // Update active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

// Scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Mobile menu toggle
function setupMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!navToggle || !navMenu) {
        console.error('Mobile menu elements not found');
        return;
    }
    
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
    
    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
}

// Add mobile menu styles dynamically
const mobileMenuStyles = document.createElement('style');
mobileMenuStyles.textContent = `
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            top: 70px;
            left: 0;
            right: 0;
            background: white;
            flex-direction: column;
            padding: 2rem;
            box-shadow: var(--shadow-lg);
            transform: translateX(-100%);
            transition: transform 0.3s ease;
            z-index: 999;
            max-height: calc(100vh - 70px);
            overflow-y: auto;
        }
        
        .nav-menu.active {
            transform: translateX(0);
        }
        
        .nav-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .nav-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .nav-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
        
        .nav-link {
            padding: 1rem 0;
            border-bottom: 1px solid var(--border-color);
            color: var(--text-primary);
            font-weight: 500;
        }
        
        .nav-link:hover {
            background: var(--background-alt);
            color: var(--primary-color);
        }
    }
`;
document.head.appendChild(mobileMenuStyles);

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe all sections
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });
});

// Print functionality
function printPage() {
    const currentPageImage = document.getElementById('currentPageImage').src;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Print Page ${currentPage}</title>
            <style>
                body { margin: 0; text-align: center; }
                img { max-width: 100%; height: auto; }
                @media print {
                    body { margin: 0; }
                    img { max-width: 100%; height: auto; page-break-inside: avoid; }
                }
            </style>
        </head>
        <body>
            <img src="${currentPageImage}" alt="Page ${currentPage}">
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Share functionality
function sharePage() {
    if (navigator.share) {
        navigator.share({
            title: 'Brochure Showcase',
            text: `Check out page ${currentPage} of our amazing brochure!`,
            url: window.location.href + '#page-' + currentPage
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        const dummy = document.createElement('input');
        document.body.appendChild(dummy);
        dummy.value = window.location.href + '#page-' + currentPage;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
        showNotification('Link copied to clipboard!');
    }
}

// Zoom functionality
let zoomLevel = 1;
const pageImage = document.getElementById('currentPageImage');

function zoomIn() {
    if (zoomLevel < 3) {
        zoomLevel += 0.25;
        pageImage.style.transform = `scale(${zoomLevel})`;
    }
}

function zoomOut() {
    if (zoomLevel > 0.5) {
        zoomLevel -= 0.25;
        pageImage.style.transform = `scale(${zoomLevel})`;
    }
}

function resetZoom() {
    zoomLevel = 1;
    pageImage.style.transform = 'scale(1)';
}

// Add zoom controls dynamically
const zoomControls = document.createElement('div');
zoomControls.innerHTML = `
    <div class="zoom-controls" style="
        position: absolute;
        bottom: 20px;
        left: 20px;
        display: flex;
        gap: 10px;
        background: rgba(0, 0, 0, 0.7);
        padding: 10px;
        border-radius: 25px;
    ">
        <button onclick="zoomOut()" style="
            width: 40px;
            height: 40px;
            border: none;
            border-radius: 50%;
            background: white;
            color: black;
            cursor: pointer;
            font-size: 18px;
        ">−</button>
        <button onclick="resetZoom()" style="
            width: 40px;
            height: 40px;
            border: none;
            border-radius: 50%;
            background: white;
            color: black;
            cursor: pointer;
            font-size: 12px;
        ">100%</button>
        <button onclick="zoomIn()" style="
            width: 40px;
            height: 40px;
            border: none;
            border-radius: 50%;
            background: white;
            color: black;
            cursor: pointer;
            font-size: 18px;
        ">+</button>
    </div>
`;

document.querySelector('.page-container').appendChild(zoomControls);

// Initialize page from URL hash
function initializeFromHash() {
    const hash = window.location.hash;
    if (hash.startsWith('#page-')) {
        const pageNum = parseInt(hash.replace('#page-', ''));
        if (pageNum >= 1 && pageNum <= totalPages) {
            currentPage = pageNum;
            updatePageDisplay();
            // Scroll to pages section
            setTimeout(() => {
                scrollToSection('pages');
            }, 100);
        }
    }
}

// Check hash on load and when it changes
window.addEventListener('load', initializeFromHash);
window.addEventListener('hashchange', initializeFromHash);

// Update URL when page changes
const originalUpdatePageDisplay = updatePageDisplay;
updatePageDisplay = function() {
    originalUpdatePageDisplay();
    window.location.hash = `page-${currentPage}`;
};

// Performance optimization: Lazy loading for images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);

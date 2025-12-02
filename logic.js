// Global Utilities, Reveal-on-Scroll, Parallax, and Toast Component

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Global Toast Utility ---
    const toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'fixed top-5 left-1/2 -translate-x-1/2 z-[90] space-y-2';

    document.body.appendChild(toastContainer);

    window.showToast = (message, type = 'success', duration = 4000) => {
        const toast = document.createElement('div');
        let colorClass = 'bg-slate/90 text-offwhite';
        if (type === 'error') colorClass = 'bg-red-600/90 text-white';
        if (type === 'info') colorClass = 'bg-pistachio/90 text-slate';
        
        toast.className = `p-4 rounded-lg shadow-2xl backdrop-blur-sm transition-all duration-300 transform translate-y-2 opacity-0 ${colorClass}`;
        toast.textContent = message;

        // Add toast to container and show it
        toastContainer.appendChild(toast);
        requestAnimationFrame(() => {
            toast.classList.remove('translate-y-2', 'opacity-0');
            toast.classList.add('translate-y-0', 'opacity-100');
        });

        // Auto-remove
        setTimeout(() => {
            toast.classList.remove('translate-y-0', 'opacity-100');
            toast.classList.add('translate-y-2', 'opacity-0');
            
            // Wait for transition to finish before removing from DOM
            toast.addEventListener('transitionend', () => {
                toast.remove();
            }, { once: true });
        }, duration);
    };

    // --- 2. Reveal on Scroll (Intersection Observer) ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px',
        threshold: 0.1
    });

    document.querySelectorAll('.reveal').forEach(el => {
        el.classList.add('opacity-0', 'transition-all', 'duration-700', 'transform', 'translate-y-8');
        observer.observe(el);
    });

    // Add class when visible
    const style = document.createElement('style');
    style.textContent = `.reveal.is-visible { opacity: 1; transform: translateY(0); }`;
    document.head.appendChild(style);

    // --- 3. Simple Parallax Effect (for sections with .parallax-bg) ---
    const parallaxElements = document.querySelectorAll('.parallax-bg');

    const handleParallax = () => {
        parallaxElements.forEach(el => {
            const scrollFactor = window.scrollY * 0.15; // 15% movement relative to scroll
            el.style.transform = `translateY(${scrollFactor}px)`;
        });
    };

    if (parallaxElements.length > 0) {
        window.addEventListener('scroll', handleParallax);
        // Initial call
        handleParallax();
    }
    
    // --- 4. Mobile Navigation Toggle ---
    const navDock = document.getElementById('nav-dock');
    const mobileNav = document.getElementById('mobile-nav-fab');

    const handleNavVisibility = () => {
        // Toggle mobile nav visibility based on desktop scroll (simple example)
        if (window.innerWidth >= 768) {
            if (navDock) navDock.classList.remove('hidden');
            if (mobileNav) mobileNav.classList.add('hidden');
        } else {
            if (navDock) navDock.classList.add('hidden');
            if (mobileNav) mobileNav.classList.remove('hidden');
        }
    };

    // Initialize and listen for resize
    handleNavVisibility();
    window.addEventListener('resize', handleNavVisibility);


    // --- 5. Carousel Logic (Placeholder - Removed functionality) ---
    window.initCarousel = (carouselSelector) => {
        const carousel = document.querySelector(carouselSelector);
        if (carousel) {
             const inner = carousel.querySelector('.carousel-inner');
             if (inner) {
                 inner.addEventListener('mousedown', (e) => e.preventDefault());
                 inner.addEventListener('touchstart', () => {});
             }
        }
    };

    // --- 6. Gallery Lightbox Logic (for gallery.html) ---
    const gallery = document.getElementById('gallery');
    
    if (gallery) {
        // --- 6a. Filter Logic ---
        const filterChips = document.querySelectorAll('.filter-chip');
        
        filterChips.forEach(chip => {
            chip.addEventListener('click', () => {
                const filter = chip.dataset.filter;

                // Update active chip
                filterChips.forEach(c => c.classList.remove('bg-cocoa', 'text-offwhite', 'ring-2', 'ring-cocoa'));
                chip.classList.add('bg-cocoa', 'text-offwhite', 'ring-2', 'ring-cocoa');

                // Filter items
                gallery.querySelectorAll('.gallery-item').forEach(item => {
                    const isMatch = filter === 'all' || item.dataset.tags.includes(filter);
                    
                    // Use a staggered transition for a smooth filter effect
                    item.style.transition = 'opacity 300ms, transform 300ms';
                    
                    if (isMatch) {
                        item.classList.remove('hidden', 'opacity-0');
                        item.classList.add('opacity-100');
                    } else {
                        item.classList.remove('opacity-100');
                        item.classList.add('opacity-0');
                        // Hide after transition
                        setTimeout(() => item.classList.add('hidden'), 300);
                    }
                });
            });
        });
        
        // Initialize: Show all items by default (since 'All' filter is removed)
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.classList.remove('hidden', 'opacity-0');
            item.classList.add('opacity-100');
        });

        // Set the first chip (Birthday) as active on load
        const defaultChip = document.querySelector('[data-filter="birthday"]');
        if (defaultChip) {
            defaultChip.classList.add('bg-cocoa', 'text-offwhite', 'ring-2', 'ring-cocoa');
        }

        // --- 6b. Lightbox Setup ---
        const lightboxHTML = `
            <div id="custom-lightbox" class="fixed inset-0 bg-slate/95 backdrop-blur-md z-[100] hidden flex justify-center items-center p-4 transition-opacity duration-300 opacity-0" aria-modal="true" role="dialog" aria-hidden="true">
                <button id="lightbox-close" class="absolute top-4 right-4 text-offwhite text-4xl hover:text-blush transition-colors z-20" aria-label="Close Lightbox">
                    &times;
                </button>
                <div id="lightbox-content" class="relative max-w-5xl w-full max-h-full">
                    <img id="lightbox-image" src="" alt="Gallery Image" class="w-full h-auto max-h-[90vh] object-contain rounded-lg shadow-2xl transition-transform duration-300">
                    <div id="lightbox-caption" class="mt-4 text-center text-offwhite font-body text-lg"></div>
                </div>
                <button id="lightbox-prev" class="absolute left-4 top-1/2 -translate-y-1/2 text-offwhite text-5xl hover:text-blush transition-colors p-4 z-20" aria-label="Previous Image">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <button id="lightbox-next" class="absolute right-4 top-1/2 -translate-y-1/2 text-offwhite text-5xl hover:text-blush transition-colors p-4 z-20" aria-label="Next Image">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', lightboxHTML);

        const lightbox = document.getElementById('custom-lightbox');
        const lightboxImage = document.getElementById('lightbox-image');
        const lightboxCaption = document.getElementById('lightbox-caption');
        const lightboxClose = document.getElementById('lightbox-close');
        const lightboxPrev = document.getElementById('lightbox-prev');
        const lightboxNext = document.getElementById('lightbox-next');
        
        let allImages = [];
        let currentImageIndex = -1;
        let initialFocusedElement = null; // To restore focus later

        // Collect all images available in the current filter state
        const updateImagesArray = () => {
            // Only include visible images for navigation
            allImages = Array.from(gallery.querySelectorAll('.gallery-item:not(.hidden) img'));
        };
        
        const showImage = (index) => {
            if (allImages.length === 0) return;
            currentImageIndex = (index + allImages.length) % allImages.length;
            const img = allImages[currentImageIndex];
            
            lightboxImage.src = img.src;
            lightboxImage.alt = img.alt;
            lightboxCaption.textContent = img.dataset.caption || img.alt;
        };
        
        const openLightbox = (imgElement) => {
            updateImagesArray();
            currentImageIndex = allImages.findIndex(img => img === imgElement);
            
            if (currentImageIndex === -1) return;
            
            initialFocusedElement = document.activeElement; // Save focus
            
            showImage(currentImageIndex);
            
            lightbox.classList.remove('hidden', 'opacity-0');
            lightbox.classList.add('opacity-100');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
            lightboxClose.focus(); // Focus the close button for accessibility
        };

        const closeLightbox = () => {
            lightbox.classList.remove('opacity-100');
            lightbox.classList.add('opacity-0');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = ''; // Restore scrolling
            
            // Wait for transition before hiding
            setTimeout(() => {
                lightbox.classList.add('hidden');
                if (initialFocusedElement) {
                    initialFocusedElement.focus(); // Restore focus
                }
            }, 300);
        };

        // Event Listeners
        gallery.addEventListener('click', (e) => {
            if (e.target.tagName === 'IMG' && e.target.closest('.gallery-item')) {
                openLightbox(e.target);
            }
        });

        lightboxClose.addEventListener('click', closeLightbox);
        lightboxNext.addEventListener('click', () => showImage(currentImageIndex + 1));
        lightboxPrev.addEventListener('click', () => showImage(currentImageIndex - 1));

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('opacity-100')) {
                if (e.key === 'Escape') {
                    closeLightbox();
                } else if (e.key === 'ArrowRight') {
                    showImage(currentImageIndex + 1);
                } else if (e.key === 'ArrowLeft') {
                    showImage(currentImageIndex - 1);
                }
            }
        });
        
        // Swipe support (Touch)
        let touchStartX = 0;
        lightbox.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });

        lightbox.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const diff = touchEndX - touchStartX;
            
            if (lightbox.classList.contains('opacity-100') && Math.abs(diff) > 50) { // Swipe threshold
                if (diff < 0) {
                    // Swipe left (next)
                    showImage(currentImageIndex + 1);
                } else {
                    // Swipe right (prev)
                    showImage(currentImageIndex - 1);
                }
            }
        });
    } // end of gallery logic


    
    // --- Code to ADD/REPLACE in logic.js (Place at the end of the DOMContentLoaded listener) ---

// Contact.html: Contact Form Submission Logic (Using Iframe Target for silent submission)
const contactForm = document.getElementById('contact-form');
const hiddenIframe = document.getElementById('hidden_iframe_contact');

    if (contactForm && hiddenIframe) {
        // Create the global function referenced by the iframe's onload attribute
        window.handleiframeload = () => {
            console.log("Iframe loaded successfully");
        };

        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = contactForm.elements['name'].value;
            const submitButton = contactForm.querySelector('button[type="submit"]');

            // Step 1: force silent submit into iframe
            contactForm.target = 'hidden_iframe_contact';

            // Step 1: Scroll to top so toast is visible
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Show toast
            if (typeof window.showToast === 'function') {
                window.showToast(`Thanks, ${name}! Your message has been sent. We'll reply soon.`, 'success', 6000);
            }

            // Step 3: light fade animation while submitting
            contactForm.classList.add('opacity-50', 'pointer-events-none');

            submitButton.disabled = true;

            // submit to Apps Script
            contactForm.submit();

            // after slight delay, reset form and restore visuals
            setTimeout(() => {
                contactForm.reset();
                submitButton.disabled = false;
                contactForm.classList.remove('opacity-50', 'pointer-events-none');
            }, 600);
        });

    }

// IMPORTANT: Delete the old section 9 which looked for ?status=success!
    // Update Footer Year (Global)
    const currentYearFooter = document.getElementById('current-year-footer');
    if (currentYearFooter) {
        currentYearFooter.textContent = new Date().getFullYear();
    }
});

console.log("JS Loaded. Looking for form:", document.getElementById("contact-form"));
console.log("Hidden iframe:", document.getElementById("hidden_iframe_contact"));

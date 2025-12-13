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

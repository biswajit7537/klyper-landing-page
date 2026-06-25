/**
 * Klyper Technology Website - JavaScript
 * Premium interactions and modern UX
 */

// ============================================
// Theme Management (runs immediately)
// ============================================
(function () {
    function getPreferredTheme() {
        const saved = localStorage.getItem('theme');
        if (saved === 'light' || saved === 'dark') return saved;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        let meta = document.querySelector('meta[name="theme-color"]');
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = 'theme-color';
            document.head.appendChild(meta);
        }
        meta.content = theme === 'dark' ? '#020817' : '#fafbff';
    }

    applyTheme(getPreferredTheme());
    window.KlyperTheme = { applyTheme, getPreferredTheme };
})();

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // Theme Toggle
    // ============================================
    const themeToggle = document.getElementById('themeToggle');
    
    if (themeToggle) {
        function toggleTheme(e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }

            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';

            if (window.KlyperTheme) {
                window.KlyperTheme.applyTheme(newTheme);
            } else {
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
            }

            themeToggle.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                themeToggle.style.transform = 'rotate(0deg)';
            }, 300);
        }

        themeToggle.addEventListener('click', toggleTheme);
        themeToggle.addEventListener('touchstart', toggleTheme, { passive: false });
    }
    
    // ============================================
    // Header Scroll Effect
    // ============================================
    const headerElement = document.querySelector('.header');
    
    if (headerElement) {
        const scrollThreshold = document.body.classList.contains('page-home') ? 60 : 50;
        
        function updateHeaderScroll() {
            if (window.scrollY > scrollThreshold) {
                headerElement.classList.add('scrolled');
            } else {
                headerElement.classList.remove('scrolled');
            }
        }
        
        updateHeaderScroll();
        window.addEventListener('scroll', updateHeaderScroll, { passive: true });
    }
    
    // ============================================
    // Mobile Menu Toggle
    // ============================================
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const mobileOverlay = document.getElementById('mobileOverlay');
    
    if (menuToggle && navMenu) {
        // Toggle menu function
        function toggleMenu() {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            if (mobileOverlay) {
                mobileOverlay.classList.toggle('active');
            }
            // Prevent body scroll when menu is open
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        }
        
        // Close menu function
        function closeMenu() {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            if (mobileOverlay) {
                mobileOverlay.classList.remove('active');
            }
            document.body.style.overflow = '';
        }
        
        // Menu toggle click
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMenu();
        });
        
        // Overlay click to close
        if (mobileOverlay) {
            mobileOverlay.addEventListener('click', closeMenu);
        }
        
        // Close menu when clicking nav links
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });
    }
    
    // ============================================
    // Smooth Scrolling for Anchor Links
    // ============================================
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only handle internal anchor links, not just "#"
            if (href && href !== '#' && href.startsWith('#')) {
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    
                    // Calculate offset for fixed header
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // ============================================
    // Contact Form Handling
    // ============================================
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone')?.value || 'Not provided';
            const company = document.getElementById('company')?.value || 'Not provided';
            const service = document.getElementById('service')?.value || 'Not specified';
            const message = document.getElementById('message').value;
            
            // Basic validation
            if (!name || !email || !message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = contactForm.querySelector('.btn-submit-modern');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Sending...</span>';
            
            try {
                // Submit form using Fetch API
                const formData = new FormData(contactForm);
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                
                if (data.success) {
                    showNotification('Thank you for your message! We\'ll get back to you within 24 hours.', 'success');
                    contactForm.reset();
                } else {
                    showNotification('Something went wrong. Please try again or email us directly.', 'error');
                }
            } catch (error) {
                showNotification('Failed to send message. Please try again or email us directly at klypertechnology@gmail.com', 'error');
                console.error('Form submission error:', error);
            } finally {
                // Restore button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
            
            // Log to console (for demo purposes)
            console.log('Form submitted:', {
                name,
                email,
                phone,
                company,
                service,
                message
            });
        });
    }
    
    // ============================================
    // Notification System
    // ============================================
    function showNotification(message, type = 'info') {
        // Remove any existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '1rem 1.5rem';
        notification.style.borderRadius = '0.5rem';
        notification.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
        notification.style.zIndex = '9999';
        notification.style.maxWidth = '400px';
        notification.style.fontSize = '0.9375rem';
        notification.style.fontWeight = '500';
        notification.style.animation = 'slideInRight 0.3s ease-out';
        
        // Set colors based on type
        if (type === 'success') {
            notification.style.backgroundColor = '#10b981';
            notification.style.color = '#ffffff';
        } else if (type === 'error') {
            notification.style.backgroundColor = '#ef4444';
            notification.style.color = '#ffffff';
        } else {
            notification.style.backgroundColor = '#3b82f6';
            notification.style.color = '#ffffff';
        }
        
        // Add to page
        document.body.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }
    
    // Add CSS animations for notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // ============================================
    // Active Navigation Link Highlighting
    // ============================================
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        const linkPath = new URL(link.href).pathname;
        
        // Remove active class from all links
        link.classList.remove('active');
        
        // Add active class to current page link
        if (linkPath === currentPath || 
            (currentPath === '/' && linkPath.includes('index.html')) ||
            (currentPath.includes(linkPath) && linkPath !== '/')) {
            link.classList.add('active');
        }
    });
    
    // ============================================
    // Premium Cursor Glow (desktop)
    // ============================================
    function initCursorGlow() {
        if (window.matchMedia('(hover: none)').matches || window.innerWidth < 1024) return;
        
        const glow = document.createElement('div');
        glow.className = 'cursor-glow';
        document.body.appendChild(glow);
        
        let mouseX = 0, mouseY = 0;
        let glowX = 0, glowY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            document.body.classList.add('cursor-active');
        });
        
        document.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-active');
        });
        
        function animateGlow() {
            glowX += (mouseX - glowX) * 0.08;
            glowY += (mouseY - glowY) * 0.08;
            glow.style.left = glowX + 'px';
            glow.style.top = glowY + 'px';
            requestAnimationFrame(animateGlow);
        }
        animateGlow();
    }
    initCursorGlow();
    
    // ============================================
    // Hero Parallax Effect
    // ============================================
    const heroSection = document.querySelector('.hero');
    const heroOrbs = document.querySelector('.hero-orbs');
    const heroMainVisual = document.querySelector('.hero-main-visual');
    
    if (heroSection && window.matchMedia('(hover: hover)').matches) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            
            if (heroOrbs) {
                heroOrbs.style.transform = `translate(${x * 24}px, ${y * 18}px)`;
            }
            
            if (heroMainVisual) {
                heroMainVisual.style.transform = `translate(calc(-50% + ${x * 12}px), calc(-50% + ${y * 10}px)) rotate(${x * 4}deg)`;
            }
        });
        
        heroSection.addEventListener('mouseleave', () => {
            if (heroOrbs) heroOrbs.style.transform = '';
            if (heroMainVisual) heroMainVisual.style.transform = '';
        });
    }
    
    // ============================================
    // Back to Top Button
    // ============================================
    function createBackToTopButton() {
        const button = document.createElement('button');
        button.innerHTML = '↑';
        button.className = 'back-to-top';
        button.setAttribute('aria-label', 'Back to top');
        
        button.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        document.body.appendChild(button);
        
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                button.classList.add('visible');
            } else {
                button.classList.remove('visible');
            }
        });
    }
    
    createBackToTopButton();
    
    // ============================================
    // Form Input Enhancements
    // ============================================
    const formInputs = document.querySelectorAll('.form-input, .form-textarea');
    
    formInputs.forEach(input => {
        // Add floating label effect
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Check if input has value on page load
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
    
    // ============================================
    // Console Welcome Message
    // ============================================
    console.log('%cKlyper Technology', 'color: #6366f1; font-size: 24px; font-weight: bold;');
    console.log('%cPremium software solutions for the future', 'color: #64748b; font-size: 14px;');
    
});

// ============================================
// Handle Page Load Performance
// ============================================
window.addEventListener('load', function() {
    // Remove any loading animations or overlays
    document.body.classList.add('loaded');
    
    // Log performance metrics (optional, for development)
    if (window.performance) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`Page loaded in ${pageLoadTime}ms`);
    }
});

// ============================================
// Product Card Click - Smooth Scroll to Product
// ============================================
const productShowcaseCards = document.querySelectorAll('.product-showcase-card');

if (productShowcaseCards.length > 0) {
    productShowcaseCards.forEach(card => {
        card.addEventListener('click', function() {
            const productId = this.getAttribute('data-product');
            const targetSection = document.getElementById(productId);
            
            if (targetSection) {
                const headerOffset = 80; // Account for sticky header
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// Scroll Animation with Intersection Observer
// ============================================

// Create intersection observer for scroll animations
const scrollRevealOptions = {
    root: null,
    rootMargin: '0px 0px -8%',
    threshold: 0.12
};

const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
        }
    });
}, scrollRevealOptions);

document.querySelectorAll('.animate-on-scroll').forEach(element => {
    animateOnScroll.observe(element);
});

// Fade-in for inner pages without animate-on-scroll class
const innerPageFadeOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
};

const innerPageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, innerPageFadeOptions);

document.querySelectorAll('.feature-card-large, .process-step, .value-card, .pricing-card').forEach(element => {
    if (!element.classList.contains('animate-on-scroll')) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(24px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        innerPageObserver.observe(element);
    }
});

// ============================================
// Counter Animation
// ============================================

function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + (element.dataset.suffix || '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (element.dataset.suffix || '');
        }
    }, 16);
}

// Observe stat numbers for counter animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.dataset.target);
            animateCounter(entry.target, target);
            statsObserver.unobserve(entry.target);
        }
    });
}, scrollRevealOptions);

document.querySelectorAll('.stat-number').forEach(element => {
    if (element.dataset.target) {
        statsObserver.observe(element);
    }
});

// ============================================
// ============================================
window.KlyperTechnology = {
    showNotification: function(message, type) {
        // Expose notification function globally if needed
        const event = new CustomEvent('showNotification', {
            detail: { message, type }
        });
        document.dispatchEvent(event);
    }
};

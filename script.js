/**
 * XYZ Technology Website - JavaScript
 * Minimal, lightweight functionality for modern UX
 */

// ============================================
// Theme Management (Runs immediately)
// ============================================
(function() {
    // Get saved theme or default to 'light'
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
})();

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // Theme Toggle
    // ============================================
    const themeToggle = document.getElementById('themeToggle');
    
    if (themeToggle) {
        console.log('Theme toggle button found');
        
        // Function to toggle theme
        function toggleTheme(e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            console.log('Theme toggle clicked');
            
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            console.log('Switching from', currentTheme, 'to', newTheme);
            
            // Update theme
            document.documentElement.setAttribute('data-theme', newTheme);
            
            // Save to localStorage
            localStorage.setItem('theme', newTheme);
            
            // Add animation effect
            themeToggle.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                themeToggle.style.transform = 'rotate(0deg)';
            }, 300);
        }
        
        // Add multiple event listeners to ensure it works
        themeToggle.addEventListener('click', toggleTheme);
        themeToggle.addEventListener('touchstart', toggleTheme, { passive: false });
        
    } else {
        console.error('Theme toggle button not found!');
    }
    
    // ============================================
    // Header Scroll Effect
    // ============================================
    const headerElement = document.querySelector('.header');
    
    if (headerElement) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                headerElement.classList.add('scrolled');
            } else {
                headerElement.classList.remove('scrolled');
            }
        });
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
    // Sticky Header on Scroll (Enhanced)
    // ============================================
    const stickyHeader = document.querySelector('.header');
    let lastScroll = 0;
    
    if (stickyHeader) {
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;
            
            // Add/remove scrolled class for glass effect
            if (currentScroll > 50) {
                stickyHeader.classList.add('scrolled');
            } else {
                stickyHeader.classList.remove('scrolled');
            }
            
            lastScroll = currentScroll;
        });
    }
    
    // ============================================
    // Contact Form Handling
    // ============================================
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
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
            
            // Show success message (in production, this would send to backend)
            showNotification('Thank you for your message! We\'ll get back to you within 24 hours.', 'success');
            
            // Reset form
            contactForm.reset();
            
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
    // Fade-in Animation on Scroll
    // ============================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements that should fade in
    const fadeElements = document.querySelectorAll('.service-card, .reason-card, .industry-card, .feature-card-large, .process-step, .value-card, .pricing-card');
    
    fadeElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(element);
    });
    
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
    // Back to Top Button (optional)
    // ============================================
    function createBackToTopButton() {
        const button = document.createElement('button');
        button.innerHTML = '↑';
        button.className = 'back-to-top';
        button.style.position = 'fixed';
        button.style.bottom = '30px';
        button.style.right = '30px';
        button.style.width = '50px';
        button.style.height = '50px';
        button.style.borderRadius = '50%';
        button.style.backgroundColor = '#2563eb';
        button.style.color = '#ffffff';
        button.style.border = 'none';
        button.style.fontSize = '1.5rem';
        button.style.cursor = 'pointer';
        button.style.opacity = '0';
        button.style.visibility = 'hidden';
        button.style.transition = 'all 0.3s ease';
        button.style.zIndex = '1000';
        button.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        
        button.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        document.body.appendChild(button);
        
        // Show/hide based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                button.style.opacity = '1';
                button.style.visibility = 'visible';
            } else {
                button.style.opacity = '0';
                button.style.visibility = 'hidden';
            }
        });
        
        // Hover effect
        button.addEventListener('mouseenter', function() {
            button.style.transform = 'translateY(-5px)';
            button.style.backgroundColor = '#1e40af';
        });
        
        button.addEventListener('mouseleave', function() {
            button.style.transform = 'translateY(0)';
            button.style.backgroundColor = '#2563eb';
        });
    }
    
    // Create back to top button
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
    console.log('%cXYZ Technology', 'color: #2563eb; font-size: 24px; font-weight: bold;');
    console.log('%cWebsite developed with modern web technologies', 'color: #64748b; font-size: 14px;');
    console.log('%cInterested in working with us? Visit: https://xyztechnology.com/contact', 'color: #10b981; font-size: 12px;');
    
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
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            // Optionally unobserve after animation
            // animateOnScroll.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all elements with animate-on-scroll class
document.querySelectorAll('.animate-on-scroll').forEach(element => {
    animateOnScroll.observe(element);
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
}, observerOptions);

// Observe all stat numbers
document.querySelectorAll('.stat-number').forEach(element => {
    if (element.dataset.target) {
        statsObserver.observe(element);
    }
});

// ============================================
// ============================================
window.XYZTechnology = {
    showNotification: function(message, type) {
        // Expose notification function globally if needed
        const event = new CustomEvent('showNotification', {
            detail: { message, type }
        });
        document.dispatchEvent(event);
    }
};

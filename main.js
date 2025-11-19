// TechnoWatch - Main JavaScript File
// Handles all animations, interactions, and dynamic content across all pages

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileMenu();
    initScrollAnimations();
    initSmoothScrolling();
    initFormHandling();
    initMerchInteractions();
    initCounterAnimations();
    initImageCarousels();
    
    console.log('TechnoWatch website initialized successfully');
});

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            
            // Animate hamburger icon
            const icon = mobileMenuBtn.querySelector('svg');
            if (mobileMenu.classList.contains('hidden')) {
                icon.style.transform = 'rotate(0deg)';
            } else {
                icon.style.transform = 'rotate(90deg)';
            }
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.add('hidden');
                mobileMenuBtn.querySelector('svg').style.transform = 'rotate(0deg)';
            }
        });
    }
}

// Scroll Animations
function initScrollAnimations() {
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Add stagger effect for child elements
                const children = entry.target.querySelectorAll('.stagger');
                if (children.length > 0) {
                    anime({
                        targets: children,
                        opacity: [0, 1],
                        translateY: [30, 0],
                        delay: anime.stagger(100),
                        duration: 600,
                        easing: 'easeOutQuad'
                    });
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
}

// Smooth Scrolling for Anchor Links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });
}

// Form Handling
function initFormHandling() {
    const contactForm = document.getElementById('contact-form');
    const earlyAccessForm = document.getElementById('early-access-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Validate form
            if (validateContactForm(name, email, message)) {
                showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
                contactForm.reset();
            }
        });
    }
    
    if (earlyAccessForm) {
        earlyAccessForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            
            if (validateEmail(email)) {
                showNotification('Thank you! We\'ll notify you when early access is available.', 'success');
                earlyAccessForm.reset();
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    }
}

function validateContactForm(name, email, message) {
    if (!name || name.trim().length < 2) {
        showNotification('Please enter a valid name.', 'error');
        return false;
    }
    
    if (!validateEmail(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return false;
    }
    
    if (!message || message.trim().length < 10) {
        showNotification('Please enter a message (at least 10 characters).', 'error');
        return false;
    }
    
    return true;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Merchandise Interactions
function initMerchInteractions() {
    const merchCards = document.querySelectorAll('.merch-card');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const sizeSelectors = document.querySelectorAll('.size-selector');
    
    // Merch card hover effects
    merchCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            anime({
                targets: this,
                scale: 1.05,
                rotateY: 5,
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
        
        card.addEventListener('mouseleave', function() {
            anime({
                targets: this,
                scale: 1,
                rotateY: 0,
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
    });
    
    // Size selector interactions
    sizeSelectors.forEach(selector => {
        const sizeButtons = selector.querySelectorAll('button');
        
        sizeButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons in this selector
                sizeButtons.forEach(btn => btn.classList.remove('bg-blue-600', 'text-white'));
                sizeButtons.forEach(btn => btn.classList.add('bg-gray-200', 'text-gray-700'));
                
                // Add active class to clicked button
                this.classList.remove('bg-gray-200', 'text-gray-700');
                this.classList.add('bg-blue-600', 'text-white');
            });
        });
    });
    
    // Add to cart functionality
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.merch-card');
            const productName = card.querySelector('h3').textContent;
            const selectedSize = card.querySelector('.size-selector button.bg-blue-600');
            
            if (!selectedSize) {
                showNotification('Please select a size first.', 'warning');
                return;
            }
            
            // Animate button
            anime({
                targets: this,
                scale: [1, 0.95, 1],
                duration: 200,
                easing: 'easeInOutQuad'
            });
            
            // Change button text temporarily
            const originalText = this.textContent;
            this.textContent = 'Added!';
            this.style.backgroundColor = '#10b981';
            
            setTimeout(() => {
                this.textContent = originalText;
                this.style.backgroundColor = '#1e40af';
            }, 1500);
            
            showNotification(`${productName} (${selectedSize.textContent}) added to cart!`, 'success');
        });
    });
}

// Counter Animations
function initCounterAnimations() {
    const counters = document.querySelectorAll('.counter');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const suffix = counter.getAttribute('data-suffix') || '';
                animateCounter(counter, target, suffix);
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element, target, suffix) {
    let current = 0;
    const increment = target / 100;
    const duration = 2000; // 2 seconds
    const stepTime = duration / 100;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        element.textContent = Math.floor(current) + suffix;
    }, stepTime);
}

// Image Carousels
function initImageCarousels() {
    const carousels = document.querySelectorAll('.image-carousel');
    
    carousels.forEach(carousel => {
        const images = carousel.querySelectorAll('img');
        let currentIndex = 0;
        
        function showImage(index) {
            images.forEach((img, i) => {
                if (i === index) {
                    img.style.opacity = '1';
                    img.style.transform = 'scale(1)';
                } else {
                    img.style.opacity = '0';
                    img.style.transform = 'scale(0.8)';
                }
            });
        }
        
        function nextImage() {
            currentIndex = (currentIndex + 1) % images.length;
            showImage(currentIndex);
        }
        
        // Initialize first image
        showImage(0);
        
        // Auto-rotate if more than one image
        if (images.length > 1) {
            setInterval(nextImage, 4000);
        }
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transform translate-x-full transition-transform duration-300`;
    
    // Set colors based on type
    const colors = {
        success: 'bg-green-600 text-white',
        error: 'bg-red-600 text-white',
        warning: 'bg-yellow-600 text-white',
        info: 'bg-blue-600 text-white'
    };
    
    notification.className += ` ${colors[type] || colors.info}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 4 seconds
    const autoRemove = setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
    
    // Click to dismiss
    notification.addEventListener('click', () => {
        clearTimeout(autoRemove);
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
}

// Button Hover Effects
function initButtonEffects() {
    const buttons = document.querySelectorAll('button, .btn, .hover-effect');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            anime({
                targets: this,
                scale: 1.05,
                duration: 200,
                easing: 'easeOutQuad'
            });
        });
        
        button.addEventListener('mouseleave', function() {
            anime({
                targets: this,
                scale: 1,
                duration: 200,
                easing: 'easeOutQuad'
            });
        });
    });
}

// Card Hover Effects
function initCardEffects() {
    const cards = document.querySelectorAll('.card-hover, .feature-card, .merch-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            anime({
                targets: this,
                translateY: -10,
                boxShadow: '0 20px 40px rgba(30, 58, 142, 0.2)',
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
        
        card.addEventListener('mouseleave', function() {
            anime({
                targets: this,
                translateY: 0,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
    });
}

// Initialize additional effects when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initButtonEffects();
    initCardEffects();
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized scroll handler
const optimizedScrollHandler = debounce(() => {
    // Handle scroll-based animations here if needed
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// Preload critical images
function preloadImages() {
    const criticalImages = [
        'resources/hero-main.png',
        'resources/team-collaboration.png',
        'resources/merch-showcase.png'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize preloading
preloadImages();
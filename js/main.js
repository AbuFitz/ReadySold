// ============================================
// ReadySold - Main JavaScript
// Navy & Sky Blue Theme - Modern Interactions
// ============================================

'use strict';

// ============================================
// Initialize Lucide Icons
// ============================================
if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}

// ============================================
// Navigation Scroll Behavior
// ============================================

const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ============================================
// Mobile Navigation
// ============================================

const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking nav links
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (event) => {
        const isClickInsideNav = navMenu.contains(event.target);
        const isClickOnToggle = mobileMenuToggle.contains(event.target);

        if (!isClickInsideNav && !isClickOnToggle && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    });
}

// ============================================
// Hero Form and Modal System
// ============================================

const heroForm = document.getElementById('hero-form');
const modalOverlay = document.getElementById('modal-overlay');
const contactModal = document.getElementById('contact-modal');
const contactForm = document.getElementById('contact-form');
const modalStep1 = document.getElementById('modal-step-1');
const modalStep2 = document.getElementById('modal-step-2');

// Store hero form data
let heroFormData = {};

// Hero form submission - opens modal
if (heroForm) {
    heroForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get and store hero form data
        const formData = new FormData(heroForm);
        heroFormData = {
            registration: formData.get('registration'),
            mileage: formData.get('mileage'),
            price: formData.get('price')
        };

        // Validate registration format
        const regRegex = /^[A-Z]{2}\d{2}\s?[A-Z]{3}$/i;
        if (!regRegex.test(heroFormData.registration.replace(/\s/g, ''))) {
            alert('Please enter a valid UK registration (e.g., AB12 CDE)');
            return;
        }

        // Open modal
        openModal();
    });
}

// Contact form submission - shows success
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get contact form data
        const formData = new FormData(contactForm);
        const contactData = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            email: formData.get('email')
        };

        // Validate UK phone number
        const phoneRegex = /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/;
        if (!phoneRegex.test(contactData.phone.replace(/\s/g, ''))) {
            alert('Please enter a valid UK phone number (e.g., 07700 900000)');
            return;
        }

        // Combine all data
        const completeData = { ...heroFormData, ...contactData };

        // Log data (in production, send to backend)
        console.log('Complete valuation request:', completeData);

        // Show success step
        showSuccessStep();

        // In production, send to backend:
        /*
        fetch('/api/valuation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(completeData)
        })
        .then(response => response.json())
        .then(result => {
            showSuccessStep();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Sorry, there was an error. Please try again or call us directly.');
        });
        */
    });
}

// Modal functions
function openModal() {
    if (modalOverlay) {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Reset modal to step 1
        if (modalStep1) modalStep1.style.display = 'block';
        if (modalStep2) modalStep2.classList.remove('active');

        // Focus on first input
        setTimeout(() => {
            const firstInput = contactForm.querySelector('input');
            if (firstInput) firstInput.focus();
        }, 300);

        // Reinitialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
}

function closeModal() {
    if (modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';

        // Reset forms
        if (heroForm) heroForm.reset();
        if (contactForm) contactForm.reset();

        // Reset modal to step 1
        setTimeout(() => {
            if (modalStep1) modalStep1.style.display = 'block';
            if (modalStep2) modalStep2.classList.remove('active');
        }, 300);
    }
}

function showSuccessStep() {
    if (modalStep1) modalStep1.style.display = 'none';
    if (modalStep2) modalStep2.classList.add('active');

    // Reinitialize icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Make functions globally available
window.openModal = openModal;
window.closeModal = closeModal;
window.showSuccessStep = showSuccessStep;

// Close modal on overlay click
if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
        closeModal();
    }
});

// ============================================
// Pricing Calculator (10% Fee)
// ============================================

const calcPrice = document.getElementById('calc-price');
const calcSlider = document.getElementById('calc-slider');
const resultPrice = document.getElementById('result-price');
const resultFee = document.getElementById('result-fee');
const resultReceive = document.getElementById('result-receive');

const FEE_PERCENTAGE = 0.10; // 10%
const MINIMUM_FEE = 350; // £350 minimum

function updateCalculator(price) {
    const salePrice = parseFloat(price);

    if (isNaN(salePrice) || salePrice < 0) {
        return;
    }

    // Calculate fee (10% with minimum £350)
    let fee = salePrice * FEE_PERCENTAGE;
    if (fee < MINIMUM_FEE) {
        fee = MINIMUM_FEE;
    }

    const received = salePrice - fee;

    // Update display
    if (resultPrice) resultPrice.textContent = formatCurrency(salePrice);
    if (resultFee) resultFee.textContent = formatCurrency(fee);
    if (resultReceive) resultReceive.textContent = formatCurrency(received);
}

// Sync price input and slider
if (calcPrice && calcSlider) {
    calcPrice.addEventListener('input', function() {
        const value = this.value;
        calcSlider.value = value;
        updateCalculator(value);
    });

    calcSlider.addEventListener('input', function() {
        const value = this.value;
        calcPrice.value = value;
        updateCalculator(value);
    });

    // Initialize calculator
    updateCalculator(calcPrice.value);
}

// Format number to currency (UK pounds)
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// ============================================
// Form Input Auto-formatting
// ============================================

// Auto-format registration plate
const regInput = document.getElementById('registration');
if (regInput) {
    regInput.addEventListener('input', function() {
        let value = this.value.toUpperCase().replace(/\s/g, '');

        // Format as XX12 XXX
        if (value.length > 4) {
            value = value.slice(0, 4) + ' ' + value.slice(4, 7);
        }

        this.value = value;
    });
}

// Auto-format mileage with commas
const mileageInput = document.getElementById('mileage');
if (mileageInput) {
    mileageInput.addEventListener('input', function() {
        let value = this.value.replace(/\D/g, '');

        // Add commas for thousands
        if (value) {
            value = parseInt(value).toLocaleString('en-GB');
        }

        this.value = value;
    });
}

// Auto-format price
const priceInput = document.getElementById('price');
if (priceInput) {
    priceInput.addEventListener('input', function() {
        let value = this.value.replace(/[^\d]/g, '');

        // Add commas for thousands
        if (value) {
            value = '£' + parseInt(value).toLocaleString('en-GB');
        }

        this.value = value;
    });
}

// Auto-format contact phone number
const contactPhone = document.getElementById('contact-phone');
if (contactPhone) {
    contactPhone.addEventListener('input', function() {
        let value = this.value.replace(/\D/g, '');

        // Format as 07700 900000
        if (value.length > 5) {
            value = value.slice(0, 5) + ' ' + value.slice(5, 11);
        }

        this.value = value;
    });
}

// ============================================
// Smooth Scrolling
// ============================================

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function scrollToHero() {
    window.scrollTo({
        behavior: 'smooth',
        top: 0
    });

    // Focus on first input after scrolling
    setTimeout(() => {
        if (regInput) regInput.focus();
    }, 500);
}

// Make functions globally available
window.scrollToSection = scrollToSection;
window.scrollToHero = scrollToHero;

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');

        // Don't prevent default for just "#"
        if (href === '#') return;

        e.preventDefault();

        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// Scroll Animations
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
        }
    });
}, observerOptions);

// Observe elements with data-aos attribute
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('[data-aos]');
    animatedElements.forEach(el => observer.observe(el));

    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

// ============================================
// Page Load
// ============================================

window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    // Reinitialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

// ============================================
// Error Handling
// ============================================

window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.message);
    // In production, send errors to monitoring service
});

// ============================================
// Console Info
// ============================================

console.log('%cReadySold', 'font-size: 24px; font-weight: bold; color: #0EA5E9;');
console.log('%cModern Car Selling Service - Navy & Sky Blue Theme', 'font-size: 14px; color: #0F172A;');
console.log('Website loaded successfully');

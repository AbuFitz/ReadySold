// ============================================
// ReadySold - Main JavaScript
// Modern interactive functionality
// ============================================

'use strict';

// ============================================
// DOM Elements
// ============================================

const priceInput = document.getElementById('sale-price');
const priceSlider = document.getElementById('price-slider');
const displayPrice = document.getElementById('display-price');
const feeAmount = document.getElementById('fee-amount');
const youReceive = document.getElementById('you-receive');
const valuationForm = document.getElementById('valuation-form');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const cookieBanner = document.getElementById('cookie-banner');
const chatButton = document.getElementById('chat-button');
const chatWindow = document.getElementById('chat-window');
const chatClose = document.getElementById('chat-close');

// ============================================
// Constants
// ============================================

const FEE_PERCENTAGE = 0.05; // 5%
const COOKIE_CONSENT_KEY = 'readysold_cookie_consent';
const COOKIE_PREFERENCES_KEY = 'readysold_cookie_preferences';

// ============================================
// Utility Functions
// ============================================

// Format number to currency (UK pounds)
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Smooth scroll to element
function smoothScrollTo(element) {
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// ============================================
// Mobile Navigation
// ============================================

if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', function() {
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
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navMenu.contains(event.target);
        const isClickOnToggle = mobileMenuToggle.contains(event.target);

        if (!isClickInsideNav && !isClickOnToggle && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    });
}

// ============================================
// Navigation Active Link
// ============================================

// Highlight active section in navigation
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (window.pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ============================================
// Scroll to Valuation Form
// ============================================

function scrollToValuation() {
    const valuationSection = document.getElementById('valuation-section');
    if (valuationSection) {
        smoothScrollTo(valuationSection);

        // Focus on first input after scrolling
        setTimeout(() => {
            const firstInput = valuationForm.querySelector('input');
            if (firstInput) {
                firstInput.focus();
            }
        }, 500);
    }
}

// Make function globally available
window.scrollToValuation = scrollToValuation;

// ============================================
// Price Calculator
// ============================================

function updateCalculator(price) {
    const salePrice = parseFloat(price);

    if (isNaN(salePrice) || salePrice < 0) {
        return;
    }

    const fee = salePrice * FEE_PERCENTAGE;
    const received = salePrice - fee;

    if (displayPrice) displayPrice.textContent = formatCurrency(salePrice);
    if (feeAmount) feeAmount.textContent = formatCurrency(fee);
    if (youReceive) youReceive.textContent = formatCurrency(received);
}

// Sync price input and slider
if (priceInput && priceSlider) {
    priceInput.addEventListener('input', function() {
        const value = this.value;
        priceSlider.value = value;
        updateCalculator(value);
    });

    priceSlider.addEventListener('input', function() {
        const value = this.value;
        priceInput.value = value;
        updateCalculator(value);
    });

    // Initialize calculator
    updateCalculator(priceInput.value);
}

// ============================================
// Valuation Form Handling
// ============================================

if (valuationForm) {
    valuationForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());

        // Validate UK phone number
        const phoneRegex = /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/;
        if (!phoneRegex.test(data.phone.replace(/\s/g, ''))) {
            alert('Please enter a valid UK phone number (e.g., 07700 900000)');
            return;
        }

        // Validate UK registration
        const regRegex = /^[A-Z]{2}\d{2}\s?[A-Z]{3}$/i;
        if (!regRegex.test(data.registration.replace(/\s/g, ''))) {
            alert('Please enter a valid UK registration (e.g., AB12 CDE)');
            return;
        }

        // Log form data (in production, send to backend)
        console.log('Form submitted:', data);

        // Show success message
        alert('Thank you! We\'ll get back to you within 2 hours with your free valuation.');

        // Reset form
        this.reset();

        // In production, send data to backend:
        /*
        fetch('/api/valuation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            alert('Thank you! We\'ll get back to you within 2 hours with your free valuation.');
            this.reset();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Sorry, there was an error. Please try again or call us directly.');
        });
        */
    });
}

// ============================================
// Cookie Consent Banner
// ============================================

function showCookieBanner() {
    if (!cookieBanner) return;

    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);

    if (!consent) {
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 2000);
    }
}

function acceptCookies() {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify({
        necessary: true,
        analytics: true,
        marketing: true
    }));

    if (cookieBanner) {
        cookieBanner.classList.remove('show');
    }

    // Initialize analytics if accepted
    initializeAnalytics();
}

function declineCookies() {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify({
        necessary: true,
        analytics: false,
        marketing: false
    }));

    if (cookieBanner) {
        cookieBanner.classList.remove('show');
    }
}

function manageCookies() {
    // In production, open a modal with detailed cookie preferences
    alert('Cookie settings panel would open here. For now, you can Accept or use browser settings.');
}

// Make functions globally available
window.acceptCookies = acceptCookies;
window.declineCookies = declineCookies;
window.manageCookies = manageCookies;

// Initialize cookie banner
showCookieBanner();

// ============================================
// Analytics Initialization
// ============================================

function initializeAnalytics() {
    const preferences = JSON.parse(localStorage.getItem(COOKIE_PREFERENCES_KEY) || '{}');

    if (preferences.analytics) {
        // Initialize Google Analytics or other analytics
        console.log('Analytics initialized');

        // Example: Google Analytics
        /*
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'GA_MEASUREMENT_ID');
        */
    }
}

// ============================================
// Chat Widget
// ============================================

if (chatButton && chatWindow) {
    chatButton.addEventListener('click', function() {
        chatWindow.classList.toggle('active');
    });
}

if (chatClose) {
    chatClose.addEventListener('click', function() {
        chatWindow.classList.remove('active');
    });
}

// Chat option selection
function selectChatOption(option) {
    let message = '';

    switch(option) {
        case 'valuation':
            message = 'Great! Scroll up to fill out the free valuation form, and we\'ll get back to you within 2 hours with a realistic price for your car.';
            scrollToValuation();
            break;
        case 'process':
            message = 'Our process is simple:\n\n1. Free Valuation - We assess your car\n2. We Take Control - Professional photos, listings, viewings\n3. Sale Complete - You get paid, we handle paperwork\n\nYou only pay when sold!';
            break;
        case 'pricing':
            message = 'Our standard fee is 5% of the sale price, only charged when your car sells successfully. This includes professional photography, multi-platform listings, viewings, negotiations, and all paperwork.';
            break;
        case 'contact':
            message = 'You can reach us at:\n📞 020 1234 5678\n📧 hello@readysold.co.uk\n\nOffice hours: Mon-Sat, 9am-6pm';
            break;
    }

    if (message) {
        alert(message);
    }

    if (chatWindow) {
        chatWindow.classList.remove('active');
    }
}

// Make function globally available
window.selectChatOption = selectChatOption;

// ============================================
// Form Input Enhancements
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

// Auto-format phone number
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', function() {
        let value = this.value.replace(/\D/g, '');

        // Format as 07700 900000
        if (value.length > 5) {
            value = value.slice(0, 5) + ' ' + value.slice(5, 11);
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

// ============================================
// Scroll Animations
// ============================================

// Fade in elements on scroll
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

// Observe elements with data-aos attribute
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('[data-aos]');

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// ============================================
// Parallax Effect for Image Dividers
// ============================================

const parallaxElements = document.querySelectorAll('.image-divider');

if (parallaxElements.length > 0) {
    window.addEventListener('scroll', function() {
        parallaxElements.forEach(element => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.5;
            element.style.backgroundPositionY = rate + 'px';
        });
    });
}

// ============================================
// Smooth Scroll for Anchor Links
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');

        // Don't prevent default for just "#"
        if (href === '#') return;

        e.preventDefault();

        const target = document.querySelector(href);
        if (target) {
            smoothScrollTo(target);
        }
    });
});

// ============================================
// Page Load Animations
// ============================================

window.addEventListener('load', function() {
    document.body.classList.add('loaded');

    // Initialize analytics if consent given
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (consent === 'accepted') {
        initializeAnalytics();
    }
});

// ============================================
// Performance Optimization
// ============================================

// Lazy load images
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// ============================================
// Error Handling
// ============================================

window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.message);
    // In production, send errors to monitoring service
});

// ============================================
// Console Info
// ============================================

console.log('%cReadySold', 'font-size: 24px; font-weight: bold; color: #d32f2f;');
console.log('%cProfessional Car Selling Service', 'font-size: 14px; color: #666;');
console.log('Website loaded successfully');

// ============================================
// ReadySold - Main JavaScript
// Interactive functionality for the website
// ============================================

// DOM Elements
const priceInput = document.getElementById('sale-price');
const priceSlider = document.getElementById('price-slider');
const displayPrice = document.getElementById('display-price');
const feeAmount = document.getElementById('fee-amount');
const youReceive = document.getElementById('you-receive');
const valuationForm = document.getElementById('valuation-form');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

// ============================================
// Calculator Functionality
// ============================================

// Fee percentage (can be adjusted)
const FEE_PERCENTAGE = 0.05; // 5%

// Format number to currency (UK pounds)
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Calculate and update calculator results
function updateCalculator(price) {
    const salePrice = parseFloat(price);

    if (isNaN(salePrice) || salePrice < 0) {
        return;
    }

    // Calculate fee and amount received
    const fee = salePrice * FEE_PERCENTAGE;
    const received = salePrice - fee;

    // Update display
    displayPrice.textContent = formatCurrency(salePrice);
    feeAmount.textContent = formatCurrency(fee);
    youReceive.textContent = formatCurrency(received);
}

// Sync slider and input
function syncCalculatorInputs(value) {
    priceInput.value = value;
    priceSlider.value = value;
    updateCalculator(value);
}

// Event listeners for calculator
if (priceInput && priceSlider) {
    // Input field change
    priceInput.addEventListener('input', (e) => {
        syncCalculatorInputs(e.target.value);
    });

    // Slider change
    priceSlider.addEventListener('input', (e) => {
        syncCalculatorInputs(e.target.value);
    });

    // Initialize calculator with default value
    updateCalculator(priceInput.value);
}

// ============================================
// Form Validation & Submission
// ============================================

// UK registration plate pattern (basic validation)
const regPattern = /^[A-Z]{2}[0-9]{2}\s?[A-Z]{3}$|^[A-Z][0-9]{1,3}[A-Z]{3}$|^[A-Z]{3}[0-9]{1,3}[A-Z]$|^[0-9]{1,4}[A-Z]{1,2}$|^[0-9]{1,3}[A-Z]{1,3}$/i;

// UK phone number pattern (basic validation)
const phonePattern = /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$|^(\+44\s?[1-9]\d{2,4}|\(?0[1-9]\d{2,4}\)?)\s?\d{4,6}$/;

// Validate form fields
function validateForm(formData) {
    const errors = [];

    // Name validation
    if (formData.name.trim().length < 2) {
        errors.push('Please enter a valid name');
    }

    // Phone validation
    if (!phonePattern.test(formData.phone)) {
        errors.push('Please enter a valid UK phone number');
    }

    // Registration validation
    if (!regPattern.test(formData.registration)) {
        errors.push('Please enter a valid UK registration number');
    }

    // Mileage validation
    if (formData.mileage < 0 || formData.mileage > 500000) {
        errors.push('Please enter a valid mileage');
    }

    return errors;
}

// Handle form submission
if (valuationForm) {
    valuationForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            registration: document.getElementById('registration').value.toUpperCase(),
            mileage: document.getElementById('mileage').value
        };

        // Validate form
        const errors = validateForm(formData);

        if (errors.length > 0) {
            alert('Please correct the following errors:\n\n' + errors.join('\n'));
            return;
        }

        // In a real application, this would send data to a server
        console.log('Form submitted:', formData);

        // Success message
        alert('Thank you! We\'ll contact you within 2 hours with your free valuation.\n\nRegistration: ' + formData.registration);

        // Reset form
        valuationForm.reset();
    });
}

// ============================================
// Smooth Scrolling for Navigation Links
// ============================================

// Get all navigation links
const navLinks = document.querySelectorAll('a[href^="#"]');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();

        const targetId = link.getAttribute('href');
        if (targetId === '#') return;

        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            // Calculate offset for fixed header
            const headerOffset = 80;
            const elementPosition = targetSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            if (navMenu.classList.contains('mobile-active')) {
                navMenu.classList.remove('mobile-active');
            }
        }
    });
});

// ============================================
// Mobile Menu Toggle
// ============================================

if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('mobile-active');

        // Change icon
        const icon = mobileMenuToggle.querySelector('i');
        if (navMenu.classList.contains('mobile-active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

// ============================================
// Header Scroll Effect
// ============================================

const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add shadow when scrolled
    if (currentScroll > 50) {
        header.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
    } else {
        header.style.boxShadow = '0 1px 2px 0 rgb(0 0 0 / 0.05)';
    }

    lastScroll = currentScroll;
});

// ============================================
// CTA Button Actions
// ============================================

// Get all CTA buttons that should open the valuation form
const ctaButtons = document.querySelectorAll('.cta-button, .btn-calculator, .btn-cta-primary, .btn-primary');

ctaButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Scroll to valuation form
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

            // Focus on first input after scrolling
            setTimeout(() => {
                const nameInput = document.getElementById('name');
                if (nameInput) {
                    nameInput.focus();
                }
            }, 1000);
        }
    });
});

// ============================================
// Scroll Animations (Intersection Observer)
// ============================================

// Options for the observer
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

// Callback function for intersection
const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
};

// Create observer
const observer = new IntersectionObserver(observerCallback, observerOptions);

// Observe elements for animation
const animateElements = document.querySelectorAll('.step-card, .testimonial-card, .trust-item');

animateElements.forEach(element => {
    // Set initial state
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

    // Observe element
    observer.observe(element);
});

// ============================================
// Form Input Formatting
// ============================================

// Format registration input to uppercase
const registrationInput = document.getElementById('registration');
if (registrationInput) {
    registrationInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.toUpperCase();
    });
}

// Format phone number input
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        // Remove non-numeric characters except + and spaces
        let value = e.target.value.replace(/[^\d+\s]/g, '');
        e.target.value = value;
    });
}

// Format mileage input with commas
const mileageInput = document.getElementById('mileage');
if (mileageInput) {
    mileageInput.addEventListener('blur', (e) => {
        const value = parseInt(e.target.value.replace(/,/g, ''));
        if (!isNaN(value)) {
            e.target.value = value.toLocaleString('en-GB');
        }
    });

    mileageInput.addEventListener('focus', (e) => {
        e.target.value = e.target.value.replace(/,/g, '');
    });
}

// ============================================
// Prevent Form Resubmission on Refresh
// ============================================

if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

// ============================================
// Console Message
// ============================================

console.log('%cReadySold Website', 'color: #0EA5E9; font-size: 24px; font-weight: bold;');
console.log('%cProfessional car selling service in London', 'color: #64748B; font-size: 14px;');
console.log('%cWebsite built with modern web technologies', 'color: #64748B; font-size: 12px;');

// ============================================
// Page Load Complete
// ============================================

window.addEventListener('load', () => {
    console.log('ReadySold website loaded successfully');

    // Remove any loading states
    document.body.classList.add('loaded');
});

// ============================================
// Export functions for testing (if needed)
// ============================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatCurrency,
        updateCalculator,
        validateForm
    };
}

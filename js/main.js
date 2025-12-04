// ============================================
// ReadySold - Modern Interactive Features
// Enhanced JavaScript for dynamic user experience
// ============================================

// ============================================
// SCROLL-BASED HEADER TRANSFORMATION
// ============================================

const header = document.getElementById('main-header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// ============================================
// MOBILE MENU TOGGLE
// ============================================

const mobileToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const menuBars = document.querySelectorAll('.menu-bar');

if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');

        // Animate menu bars to X
        if (navMenu.classList.contains('active')) {
            menuBars[0].style.transform = 'rotate(45deg) translateY(7px)';
            menuBars[1].style.opacity = '0';
            menuBars[2].style.transform = 'rotate(-45deg) translateY(-7px)';
        } else {
            menuBars[0].style.transform = 'none';
            menuBars[1].style.opacity = '1';
            menuBars[2].style.transform = 'none';
        }
    });

    // Close mobile menu when clicking nav links
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuBars[0].style.transform = 'none';
            menuBars[1].style.opacity = '1';
            menuBars[2].style.transform = 'none';
        });
    });
}

// ============================================
// SCROLL TO FORM FUNCTION
// ============================================

function scrollToForm() {
    const heroSection = document.getElementById('home');
    if (heroSection) {
        heroSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Focus on first input after scroll
        setTimeout(() => {
            const nameInput = document.getElementById('name');
            if (nameInput) {
                nameInput.focus();
            }
        }, 1000);
    }
}

// ============================================
// FORM VALIDATION & SUBMISSION
// ============================================

const valuationForm = document.getElementById('valuation-form');

// UK registration plate pattern
const regPattern = /^[A-Z]{2}[0-9]{2}\s?[A-Z]{3}$|^[A-Z][0-9]{1,3}[A-Z]{3}$|^[A-Z]{3}[0-9]{1,3}[A-Z]$|^[0-9]{1,4}[A-Z]{1,2}$|^[0-9]{1,3}[A-Z]{1,3}$/i;

// UK phone number pattern
const phonePattern = /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$|^(\+44\s?[1-9]\d{2,4}|\(?0[1-9]\d{2,4}\)?)\s?\d{4,6}$/;

function validateForm(formData) {
    const errors = [];

    if (formData.name.trim().length < 2) {
        errors.push('Please enter a valid name');
    }

    if (!phonePattern.test(formData.phone)) {
        errors.push('Please enter a valid UK phone number');
    }

    if (!regPattern.test(formData.registration)) {
        errors.push('Please enter a valid UK registration number');
    }

    const mileage = parseInt(formData.mileage.replace(/,/g, ''));
    if (isNaN(mileage) || mileage < 0 || mileage > 500000) {
        errors.push('Please enter a valid mileage');
    }

    return errors;
}

if (valuationForm) {
    valuationForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            registration: document.getElementById('registration').value.toUpperCase(),
            mileage: document.getElementById('mileage').value
        };

        const errors = validateForm(formData);

        if (errors.length > 0) {
            alert('Please correct the following:\n\n' + errors.join('\n'));
            return;
        }

        // Show loading state
        const submitBtn = valuationForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;

        try {
            // In production, this would send to your backend
            // For now, simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Success
            alert(`Thank you ${formData.name}! Your valuation request for ${formData.registration} has been received. We'll contact you within 2 hours.`);

            valuationForm.reset();

            // Track conversion (Google Analytics, etc.)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'conversion', {
                    'event_category': 'Form',
                    'event_label': 'Valuation Request'
                });
            }
        } catch (error) {
            alert('Sorry, there was an error submitting your request. Please try again or call us at 020 1234 5678.');
            console.error('Form submission error:', error);
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

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
        let value = e.target.value.replace(/[^\d+\s]/g, '');
        e.target.value = value;
    });
}

// Format mileage with commas
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
// CALCULATOR FUNCTIONALITY
// ============================================

const priceInput = document.getElementById('sale-price');
const priceSlider = document.getElementById('price-slider');
const displayPrice = document.getElementById('display-price');
const feeAmount = document.getElementById('fee-amount');
const youReceive = document.getElementById('you-receive');

const FEE_PERCENTAGE = 0.05; // 5%

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

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

function syncCalculatorInputs(value) {
    if (priceInput) priceInput.value = value;
    if (priceSlider) priceSlider.value = value;
    updateCalculator(value);
}

if (priceInput && priceSlider) {
    priceInput.addEventListener('input', (e) => {
        syncCalculatorInputs(e.target.value);
    });

    priceSlider.addEventListener('input', (e) => {
        syncCalculatorInputs(e.target.value);
    });

    // Initialize
    updateCalculator(priceInput.value);
}

// ============================================
// COOKIE CONSENT BANNER
// ============================================

const cookieBanner = document.getElementById('cookie-banner');

function showCookieBanner() {
    const cookieConsent = localStorage.getItem('readysold_cookie_consent');
    if (!cookieConsent) {
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 2000); // Show after 2 seconds
    }
}

function acceptCookies() {
    localStorage.setItem('readysold_cookie_consent', 'accepted');
    cookieBanner.classList.remove('show');

    // Initialize analytics
    initializeAnalytics();
}

function declineCookies() {
    localStorage.setItem('readysold_cookie_consent', 'declined');
    cookieBanner.classList.remove('show');
}

function initializeAnalytics() {
    // Initialize Google Analytics or other tracking
    console.log('Analytics initialized');
}

// Check cookie consent on page load
if (cookieBanner) {
    showCookieBanner();
}

// ============================================
// CHAT WIDGET
// ============================================

const chatToggle = document.getElementById('chat-toggle');
const chatWindow = document.getElementById('chat-window');
const chatClose = document.getElementById('chat-close');

if (chatToggle && chatWindow) {
    chatToggle.addEventListener('click', () => {
        chatWindow.classList.toggle('active');

        // Remove notification badge
        const badge = chatToggle.querySelector('.chat-badge');
        if (badge && chatWindow.classList.contains('active')) {
            badge.style.display = 'none';
        }
    });
}

if (chatClose) {
    chatClose.addEventListener('click', () => {
        chatWindow.classList.remove('active');
    });
}

function selectChatOption(option) {
    switch(option) {
        case 'valuation':
            scrollToForm();
            chatWindow.classList.remove('active');
            break;
        case 'process':
            document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' });
            chatWindow.classList.remove('active');
            break;
        case 'pricing':
            document.getElementById('calculator').scrollIntoView({ behavior: 'smooth' });
            chatWindow.classList.remove('active');
            break;
        case 'contact':
            window.location.href = 'tel:02012345678';
            break;
        default:
            console.log('Unknown option:', option);
    }
}

// ============================================
// SMOOTH SCROLL FOR ALL ANCHOR LINKS
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');

        if (targetId === '#' || targetId === '#home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            const target = document.querySelector(targetId);
            if (target) {
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ============================================
// SIMPLE SCROLL ANIMATIONS
// ============================================

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);

// Observe elements with data-aos attribute
document.querySelectorAll('[data-aos]').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
});

// ============================================
// PARALLAX EFFECT FOR IMAGE BREAKS
// ============================================

const parallaxSections = document.querySelectorAll('.parallax-section');

window.addEventListener('scroll', () => {
    parallaxSections.forEach(section => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.5;
        section.style.backgroundPositionY = rate + 'px';
    });
});

// ============================================
// PREVENT FORM RESUBMISSION
// ============================================

if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

// ============================================
// PAGE LOAD ANIMATIONS
// ============================================

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    console.log('%cReadySold', 'color: #0EA5E9; font-size: 24px; font-weight: bold;');
    console.log('%cProfessional Car Selling Service', 'color: #4A5568; font-size: 14px;');
});

// ============================================
// KEYBOARD ACCESSIBILITY
// ============================================

// Close chat on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (chatWindow && chatWindow.classList.contains('active')) {
            chatWindow.classList.remove('active');
        }
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            menuBars[0].style.transform = 'none';
            menuBars[1].style.opacity = '1';
            menuBars[2].style.transform = 'none';
        }
    }
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Debounce function for performance
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

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ============================================
// PERFORMANCE MONITORING
// ============================================

if ('PerformanceObserver' in window) {
    try {
        const perfObserver = new PerformanceObserver((items) => {
            items.getEntries().forEach((entry) => {
                if (entry.entryType === 'navigation') {
                    console.log('Page load time:', entry.loadEventEnd - entry.fetchStart, 'ms');
                }
            });
        });
        perfObserver.observe({ entryTypes: ['navigation'] });
    } catch (e) {
        console.log('Performance monitoring not available');
    }
}

// ============================================
// ERROR HANDLING
// ============================================

window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    // In production, send to error tracking service
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    // In production, send to error tracking service
});

// ============================================
// EXPORT FOR TESTING
// ============================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatCurrency,
        updateCalculator,
        validateForm,
        scrollToForm,
        selectChatOption,
        acceptCookies,
        declineCookies
    };
}

console.log('ReadySold website initialized successfully');

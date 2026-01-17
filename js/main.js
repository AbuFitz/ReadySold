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
        document.body.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
        document.body.classList.remove('scrolled');
    }
});

// ============================================
// Mobile Navigation
// ============================================

const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

// Create overlay element
const navOverlay = document.createElement('div');
navOverlay.className = 'nav-overlay';
document.body.appendChild(navOverlay);

if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
        navOverlay.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Close mobile menu when clicking nav links
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            navOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close mobile menu when clicking overlay
    navOverlay.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
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

        // Open modal with contact-only mode
        openModal(true);
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

        // Get car data (from hero form or modal)
        let carData;
        if (heroFormData && heroFormData.registration) {
            // Data from hero form
            carData = heroFormData;
        } else {
            // Data from modal
            carData = {
                registration: formData.get('registration'),
                mileage: formData.get('mileage'),
                price: formData.get('price')
            };

            // Validate registration format
            const regRegex = /^[A-Z]{2}\d{2}\s?[A-Z]{3}$/i;
            if (!regRegex.test(carData.registration.replace(/\s/g, ''))) {
                alert('Please enter a valid UK registration (e.g., AB12 CDE)');
                return;
            }
        }

        // Validate UK phone number
        const phoneRegex = /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/;
        if (!phoneRegex.test(contactData.phone.replace(/\s/g, ''))) {
            alert('Please enter a valid UK phone number (e.g., 07700 900000)');
            return;
        }

        // Combine all data
        const completeData = { ...carData, ...contactData };

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
function openModal(fromHeroForm = false) {
    if (modalOverlay) {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Reset modal to step 1
        if (modalStep1) modalStep1.style.display = 'block';
        if (modalStep2) modalStep2.classList.remove('active');

        const carFields = document.querySelector('.modal-car-fields');
        const modalTitle = document.getElementById('modal-title');
        const modalSubtitle = document.getElementById('modal-subtitle');

        if (fromHeroForm) {
            // Hide car fields, update text
            if (carFields) carFields.style.display = 'none';
            if (modalTitle) modalTitle.textContent = 'Almost there!';
            if (modalSubtitle) modalSubtitle.textContent = "Enter your details and we'll get back to you promptly.";

            // Make car fields not required
            const modalReg = document.getElementById('modal-registration');
            const modalMileage = document.getElementById('modal-mileage');
            const modalPrice = document.getElementById('modal-price');
            if (modalReg) modalReg.removeAttribute('required');
            if (modalMileage) modalMileage.removeAttribute('required');
            if (modalPrice) modalPrice.removeAttribute('required');
        } else {
            // Show car fields, restore text
            if (carFields) carFields.style.display = 'block';
            if (modalTitle) modalTitle.textContent = 'Get Your Free Valuation';
            if (modalSubtitle) modalSubtitle.textContent = "Tell us about your car and we'll get back to you promptly.";

            // Make car fields required
            const modalReg = document.getElementById('modal-registration');
            const modalMileage = document.getElementById('modal-mileage');
            const modalPrice = document.getElementById('modal-price');
            if (modalReg) modalReg.setAttribute('required', '');
            if (modalMileage) modalMileage.setAttribute('required', '');
            if (modalPrice) modalPrice.setAttribute('required', '');
        }

        // Focus on first input
        setTimeout(() => {
            const firstInput = fromHeroForm ?
                document.getElementById('contact-name') :
                document.getElementById('modal-registration');
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

// Learn More modal function
function openLearnMoreModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.id = 'learn-more-modal';
    modal.innerHTML = `
        <div class="modal-container" style="max-width: 600px;">
            <button class="modal-close" onclick="closeLearnMoreModal()">
                <i data-lucide="x"></i>
            </button>
            <div class="modal-content">
                <h2 style="color: var(--navy); margin-bottom: 1rem; font-size: 2rem;">Your Car Doesn't Need to Be Perfect</h2>
                <p style="font-size: 1.125rem; color: var(--gray-600); margin-bottom: 2rem;">We sell cars in any condition - you'd be surprised what buyers are looking for.</p>
                
                <div style="background: var(--gray-50); padding: 1.5rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
                    <h3 style="color: var(--navy); margin-bottom: 1rem; font-size: 1.25rem;">We Handle:</h3>
                    <ul style="list-style: none; padding: 0; margin: 0;">
                        <li style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem; color: var(--gray-700);">
                            <i data-lucide="check-circle" style="color: var(--primary-color); flex-shrink: 0;"></i>
                            <span>High mileage vehicles</span>
                        </li>
                        <li style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem; color: var(--gray-700);">
                            <i data-lucide="check-circle" style="color: var(--primary-color); flex-shrink: 0;"></i>
                            <span>Cars with minor cosmetic damage</span>
                        </li>
                        <li style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem; color: var(--gray-700);">
                            <i data-lucide="check-circle" style="color: var(--primary-color); flex-shrink: 0;"></i>
                            <span>Vehicles with wear and tear</span>
                        </li>
                        <li style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem; color: var(--gray-700);">
                            <i data-lucide="check-circle" style="color: var(--primary-color); flex-shrink: 0;"></i>
                            <span>Older models with service history gaps</span>
                        </li>
                        <li style="display: flex; align-items: center; gap: 0.75rem; color: var(--gray-700);">
                            <i data-lucide="check-circle" style="color: var(--primary-color); flex-shrink: 0;"></i>
                            <span>Cars needing minor repairs</span>
                        </li>
                    </ul>
                </div>

                <div style="background: linear-gradient(135deg, var(--primary-color) 0%, var(--sky-blue-dark) 100%); padding: 1.5rem; border-radius: var(--radius-md); margin-bottom: 2rem; color: white;">
                    <p style="margin: 0; font-size: 1.063rem; color: rgba(255,255,255,0.95);">
                        <strong style="color: white;">Honest listings attract serious buyers.</strong> We're transparent about condition, which means you get realistic offers from people who actually want your car - not time-wasters expecting perfection.
                    </p>
                </div>

                <button onclick="closeLearnMoreModal(); openModal();" class="btn-hero" style="width: 100%; margin: 0;">
                    Get Free Valuation
                    <i data-lucide="arrow-right"></i>
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Initialize Lucide icons in modal
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function closeLearnMoreModal() {
    const modal = document.getElementById('learn-more-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
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

// Auto-format modal registration
const modalRegInput = document.getElementById('modal-registration');
if (modalRegInput) {
    modalRegInput.addEventListener('input', function() {
        let value = this.value.toUpperCase().replace(/\s/g, '');

        // Format as XX12 XXX
        if (value.length > 4) {
            value = value.slice(0, 4) + ' ' + value.slice(4, 7);
        }

        this.value = value;
    });
}

// Auto-format modal mileage
const modalMileageInput = document.getElementById('modal-mileage');
if (modalMileageInput) {
    modalMileageInput.addEventListener('input', function() {
        let value = this.value.replace(/\D/g, '');

        // Add commas for thousands
        if (value) {
            value = parseInt(value).toLocaleString('en-GB');
        }

        this.value = value;
    });
}

// Auto-format modal price
const modalPriceInput = document.getElementById('modal-price');
if (modalPriceInput) {
    modalPriceInput.addEventListener('input', function() {
        let value = this.value.replace(/[^\d]/g, '');

        // Add commas for thousands
        if (value) {
            value = '£' + parseInt(value).toLocaleString('en-GB');
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

// Chat widget functions
function toggleChat() {
    const chatPanel = document.getElementById('chat-panel');
    chatPanel.classList.toggle('active');
}

function toggleFaq(element) {
    element.classList.toggle('active');
}

window.toggleChat = toggleChat;
window.toggleFaq = toggleFaq;

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
// Mobile Comparison Cards (Dynamic Generation)
// ============================================

function createMobileComparisonCards() {
    if (window.innerWidth > 640) return;
    
    const comparisonSection = document.querySelector('.comparison-section');
    if (!comparisonSection) return;
    
    const existingMobileGrid = comparisonSection.querySelector('.comparison-mobile-grid');
    if (existingMobileGrid) return; // Already created
    
    const container = comparisonSection.querySelector('.comparison-container');
    if (!container) return;
    
    // Create mobile grid
    const mobileGrid = document.createElement('div');
    mobileGrid.className = 'comparison-mobile-grid';
    
    // ReadySold card
    const readysoldCard = `
        <div class="comparison-mobile-card readysold">
            <h3>ReadySold</h3>
            <div class="comparison-mobile-features">
                <div class="comparison-feature-item">
                    <svg class="check" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    <span>Get full market value</span>
                </div>
                <div class="comparison-feature-item">
                    <svg class="check" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    <span>No time wasters</span>
                </div>
                <div class="comparison-feature-item">
                    <svg class="check" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    <span>Keep your car while selling</span>
                </div>
                <div class="comparison-feature-item">
                    <svg class="check" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    <span>Quality photos (all angles)</span>
                </div>
                <div class="comparison-feature-item">
                    <svg class="check" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    <span>Handle viewings & test drives</span>
                </div>
                <div class="comparison-feature-item">
                    <svg class="check" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    <span>Expert negotiation</span>
                </div>
                <div class="comparison-feature-item">
                    <svg class="check" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    <span>All paperwork handled</span>
                </div>
            </div>
        </div>
    `;
    
    // Other options summary
    const othersCard = `
        <div class="comparison-mobile-card">
            <h3>Other Options</h3>
            <div class="comparison-mobile-features">
                <div class="comparison-feature-item">
                    <svg class="cross" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    <span>Lower prices (dealers/buyers)</span>
                </div>
                <div class="comparison-feature-item">
                    <svg class="cross" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    <span>Time wasters (private sale)</span>
                </div>
                <div class="comparison-feature-item">
                    <svg class="cross" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    <span>No professional help</span>
                </div>
                <div class="comparison-feature-item">
                    <svg class="cross" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    <span>Handle everything yourself</span>
                </div>
            </div>
        </div>
    `;
    
    mobileGrid.innerHTML = readysoldCard + othersCard;
    container.appendChild(mobileGrid);
}

// Initialize mobile comparison on load and resize
document.addEventListener('DOMContentLoaded', createMobileComparisonCards);
window.addEventListener('resize', createMobileComparisonCards);

// ============================================
// Console Info
// ============================================

console.log('%cReadySold', 'font-size: 24px; font-weight: bold; color: #0EA5E9;');
console.log('%cModern Car Selling Service - Navy & Sky Blue Theme', 'font-size: 14px; color: #0F172A;');
console.log('Website loaded successfully');

// ============================================
// Chatbot System
// ============================================

let chatInitialized = false;

// Knowledge base for the chatbot
const chatbotKnowledge = {
    greetings: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'thanks', 'thank you', 'appreciate', 'cheers'],
    pricing: ['price', 'cost', 'fee', 'charge', 'expensive', 'how much', 'pricing', 'fees', 'commission', 'percentage', 'cheap', 'affordable', '8%', 'eight percent', 'minimum', '£350', 'rates', 'what do you charge'],
    process: ['how', 'work', 'process', 'steps', 'procedure', 'what happens', 'how does', 'explain', 'walk me through', 'works', 'start', 'begin', 'get started', 'sign up', 'register'],
    driving: ['drive', 'driving', 'keep', 'use', 'car', 'still use', 'keep using', 'access', 'use my car', 'keep my car', 'can i drive', 'will i lose'],
    time: ['long', 'quick', 'fast', 'duration', 'time', 'how long', 'quickly', 'speed', 'when', 'timeline', 'days', 'weeks', 'months', 'soon', 'timeframe'],
    payment: ['pay', 'payment', 'when', 'upfront', 'money', 'paid', 'paying', 'receive', 'get paid', 'payout', 'cash', 'transfer', 'bank transfer'],
    photography: ['photo', 'picture', 'image', 'photos', 'pictures', 'photography', 'images', 'camera', 'take photos', 'pictures taken'],
    selling: ['sell', 'buyer', 'listing', 'advertise', 'market', 'list', 'platform', 'where listed', 'find buyers', 'autotrader', 'ebay', 'facebook', 'advertised'],
    condition: ['damage', 'damaged', 'scratches', 'dent', 'dents', 'condition', 'perfect', 'worn', 'old', 'mileage', 'high mileage', 'issues', 'problems', 'faults', 'mechanical', 'cosmetic', 'repair', 'needs work'],
    locations: ['area', 'location', 'where', 'cover', 'service', 'region', 'city', 'near me', 'local', 'available'],
    paperwork: ['paperwork', 'documents', 'v5c', 'logbook', 'registration', 'mot', 'service history', 'documentation'],
    viewings: ['viewing', 'viewings', 'show', 'appointment', 'meet', 'look at', 'see the car', 'inspection', 'test drive'],
    valuation: ['value', 'worth', 'estimate', 'valuation', 'what is my car worth', 'car value', 'quote', 'assessment', 'appraisal', 'free valuation']
};

const responses = {
    greeting: [
        "Hi! Thanks for stopping by. Whether you're curious about selling or just browsing, I'm here to help answer your questions.",
        "Hello! I can help you understand how selling with us works, answer questions about pricing, or guide you through getting started.",
        "Hey there! Feel free to ask me anything about selling your car - from how our process works to what happens with payment."
    ],
    pricing: [
        "We charge 8% of the final sale price, with a minimum fee of £350. You only pay when your car sells - no upfront costs, no hidden fees. If we don't sell it, you don't pay anything.",
        "Our fee is straightforward: 8% commission with a £350 minimum, and you only pay after your car sells. Zero risk on your part. We're motivated to get you the best price because we only earn when you do.",
        "It's 8% of whatever we sell your car for (minimum £350), but here's the key - you don't pay a penny until the sale completes. No listing fees, no photography charges, nothing upfront."
    ],
    process: [
        "Here's how it works: First, you submit your car details and we provide a free valuation. Then we arrange to take photos covering all angles and create listings on AutoTrader, eBay Motors, Facebook Marketplace, and more. While we handle all buyer enquiries, viewings, and negotiations, you keep driving your car as normal. Once we find the right buyer and the sale completes, you get paid and we collect our 8% commission.",
        "It's pretty simple. Step 1: Free valuation (no obligation). Step 2: We photograph your car and list it everywhere. Step 3: We manage buyers, viewings, and negotiations while you go about your life. Step 4: Sale completes, money goes to your account, you pay our 8%. That's it.",
        "Think of it as us doing all the hard work while you relax. After the free valuation, we handle photography, create listings across multiple platforms, filter out time-wasters, coordinate viewings around your schedule, and negotiate with buyers. Your car stays with you the whole time until it sells."
    ],
    driving: [
        "Absolutely! Your car stays with you throughout. You keep the keys, keep driving, keep using it normally. We just schedule viewings around your availability. You're never without your car until it actually sells.",
        "Yes, 100%. We work around your schedule - you keep full use of your vehicle. When someone wants to view it, we coordinate a time that suits you. No loss of mobility, no inconvenience.",
        "That's one of the best parts - you maintain complete access to your car. We're not one of those services where you hand over the keys. It stays in your possession and you keep driving until the moment it sells."
    ],
    time: [
        "Most cars sell within 2-6 weeks, though it varies based on make, model, condition, and pricing. Popular models in good condition can move in days, while others might take a bit longer. We give realistic expectations based on your specific car and current market demand.",
        "Timeline depends on your vehicle and the market. A well-priced car in decent condition typically sells within a month. Some move faster, some take longer. We'll be honest about realistic timeframes when we value your car.",
        "Selling time varies - factors like make, model, mileage, condition, and price all matter. Most vehicles sell within 4-6 weeks. We respond quickly to valuations (usually same day), and then it's about finding the right buyer at the right price."
    ],
    payment: [
        "Payment is direct and secure. The buyer pays you directly - the money goes straight into your account, not through us. Once you've received the full amount and the sale is complete, you then pay our 8% commission (£350 minimum). You're always in control of the funds.",
        "Here's the payment flow: Buyer transfers money directly to your bank account → You confirm receipt → Sale paperwork completed → You pay our 8% commission. Simple, transparent, secure. We never touch the buyer's money.",
        "When your car sells, the buyer pays you directly. You get the cash in your account first. After you've been paid and the sale is finalized, you settle our 8% fee. Zero upfront costs, you're in control throughout."
    ],
    photography: [
        "Photos are included at no extra cost. We take detailed images from all angles - exterior, interior, engine bay, boot, any features or notable details. Quality photos make a huge difference in attracting serious buyers and getting better offers.",
        "We handle the photography as part of our service. We'll capture your car from every angle to give buyers a complete picture. Exterior shots, interior condition, engine bay - everything they need to see. No additional charge.",
        "Yes, photos are included. We know good images sell cars, so we make sure to cover all angles: outside, inside, under the bonnet, any features worth highlighting. It's all part of getting you the best result."
    ],
    selling: [
        "We list your car on all major platforms: AutoTrader, eBay Motors, Facebook Marketplace, and others. We create compelling listings, field all enquiries, pre-screen buyers to filter out time-wasters, coordinate viewings, and handle negotiations. You stay informed and approve the final sale price.",
        "Think of us as your personal sales team. We advertise your car across multiple platforms, manage all buyer communications, vet potential buyers, arrange viewings around your schedule, and negotiate to get the best price. You're involved in key decisions but free from the daily hassle.",
        "Complete end-to-end service. Multi-platform listings, buyer screening, viewing coordination, expert negotiation, paperwork handling. We bring you serious buyers only, keep you updated throughout, and always get your approval before finalizing any sale."
    ],
    condition: [
        "Your car doesn't need to be perfect. We sell vehicles in all conditions - minor damage, scratches, high mileage, wear and tear, it doesn't matter. We're honest about condition in our listings, which actually attracts more realistic buyers. As long as your car runs and has valid documentation, we can sell it.",
        "Honestly, condition doesn't need to be perfect at all. High mileage? Fine. A few dents or scratches? Not a problem. We handle cars as-is. Being upfront about condition in our listings means we attract buyers who are genuinely interested, not time-wasters expecting showroom perfection.",
        "Don't worry about minor imperfections. We sell cars in any condition - high mileage, cosmetic damage, worn interiors, you name it. We're transparent about condition with buyers, which builds trust and leads to faster sales. If it's roadworthy with proper docs, we can work with it."
    ],
    locations: [
        "We currently operate across [regions/cities]. When you request a valuation, we can confirm if we cover your area. We're expanding our service areas regularly, so even if we're not in your location yet, it's worth checking with us.",
        "Our coverage depends on where you're located. Submit your car details for a free valuation and we'll let you know if we service your area. We're growing our reach, so we might be expanding to your region soon.",
        "Coverage varies by location. The best way to find out is to request a free valuation - we'll confirm whether we can help with your specific area. No obligation either way."
    ],
    paperwork: [
        "We handle all the paperwork for you - V5C logbook transfer, any required documentation, everything needed to complete the sale legally. You'll need to provide your V5C, and we take care of the rest. Makes the whole process smooth and stress-free.",
        "All documentation is sorted by us. We manage the V5C transfer, ensure everything is legal and above board, and handle the admin. You just need your logbook and any service history you have (helps with valuation). We do the rest.",
        "Paperwork is part of our service. When the car sells, we coordinate the V5C transfer and make sure all documents are in order. You provide the logbook and we handle the administrative side of completing the sale."
    ],
    viewings: [
        "We coordinate all viewings around your schedule. When a buyer wants to see the car, we arrange a time that works for you. We're present during viewings to handle conversations and questions, but you're there too since it's your car. We manage the interaction professionally while respecting your time.",
        "Viewings work around you. We schedule them at times that suit your availability - evenings, weekends, whenever. We accompany the viewing to handle buyer questions and negotiations. You're present, but we do the talking and managing. Makes it easy and low-pressure.",
        "We manage the viewing process. Interested buyers go through us first, then we coordinate a time that fits your schedule. We're there with you during the viewing to handle discussions, answer questions, and deal with any negotiations. You're involved but not burdened."
    ],
    valuation: [
        "Getting a free valuation is easy. Just fill in the form on this page with your reg number and a few details, or if you prefer, you can reach out directly. We'll research current market values, look at comparable sales, and get back to you with an honest assessment. Zero obligation to proceed.",
        "Free valuations are our starting point. Enter your registration and details in the form above, and we'll analyze market data, recent sales, and your car's specifics to provide a realistic valuation. It's completely free with no pressure to sell through us.",
        "You can request a free valuation right on this page - just enter your registration number and we'll take it from there. We look at current market conditions, comparable vehicles, and your car's details to give you an accurate figure. No commitment required."
    ],
    default: [
        "That's a good question. Let me know specifically what you'd like to know more about - I can explain our pricing, walk you through how it works, discuss timeline expectations, talk about car conditions we accept, or anything else about the selling process.",
        "I want to make sure I give you the right information. Could you tell me more about what you're curious about? Whether it's fees, process, timelines, paperwork, or something else - I'm here to help.",
        "I can help with that - just need a bit more detail. Are you wondering about pricing, how the process works, how long things take, whether we accept cars in certain conditions, or something else? Let me know and I'll give you a proper answer."
    ]
};

function initializeChat() {
    if (chatInitialized) return;
    
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = '';
    
    // Welcome message
    addBotMessage("👋 Hi! I'm here to help you sell your car.", true);
    setTimeout(() => {
        addBotMessage("What would you like to know?");
        setTimeout(() => {
            addQuickReplies();
        }, 500);
    }, 800);
    
    chatInitialized = true;
}

function addBotMessage(message, isFirst = false) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message bot-message';
    messageDiv.innerHTML = `<div class="message-bubble">${message.replace(/\n/g, '<br>')}</div>`;
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

function addUserMessage(message) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message user-message';
    messageDiv.innerHTML = `<div class="message-bubble">${message}</div>`;
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

function addQuickReplies() {
    const chatMessages = document.getElementById('chat-messages');
    const quickRepliesDiv = document.createElement('div');
    quickRepliesDiv.className = 'quick-replies';
    quickRepliesDiv.innerHTML = `
        <button class="quick-reply-btn" onclick="handleQuickReply('How much do you charge?')">Pricing</button>
        <button class="quick-reply-btn" onclick="handleQuickReply('How does the process work?')">How It Works</button>
        <button class="quick-reply-btn" onclick="handleQuickReply('Can I still drive my car?')">Keep Driving?</button>
        <button class="quick-reply-btn" onclick="handleQuickReply('I want a free valuation')">Get Valuation</button>
    `;
    chatMessages.appendChild(quickRepliesDiv);
    scrollToBottom();
}

function handleQuickReply(message) {
    // Remove quick replies
    const quickReplies = document.querySelector('.quick-replies');
    if (quickReplies) quickReplies.remove();
    
    // Send as user message
    addUserMessage(message);
    setTimeout(() => processMessage(message), 500);
}

function scrollToBottom() {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function processMessage(message) {
    const lowerMessage = message.toLowerCase();
    let responseType = 'default';
    
    // Check for greetings
    if (chatbotKnowledge.greetings.some(word => lowerMessage.includes(word))) {
        responseType = 'greeting';
    }
    // Check other categories with priority to more specific topics
    else if (chatbotKnowledge.condition.some(word => lowerMessage.includes(word))) {
        responseType = 'condition';
    }
    else if (chatbotKnowledge.paperwork.some(word => lowerMessage.includes(word))) {
        responseType = 'paperwork';
    }
    else if (chatbotKnowledge.viewings.some(word => lowerMessage.includes(word))) {
        responseType = 'viewings';
    }
    else if (chatbotKnowledge.locations.some(word => lowerMessage.includes(word))) {
        responseType = 'locations';
    }
    else if (chatbotKnowledge.pricing.some(word => lowerMessage.includes(word))) {
        responseType = 'pricing';
    }
    else if (chatbotKnowledge.process.some(word => lowerMessage.includes(word))) {
        responseType = 'process';
    }
    else if (chatbotKnowledge.driving.some(word => lowerMessage.includes(word))) {
        responseType = 'driving';
    }
    else if (chatbotKnowledge.time.some(word => lowerMessage.includes(word))) {
        responseType = 'time';
    }
    else if (chatbotKnowledge.payment.some(word => lowerMessage.includes(word))) {
        responseType = 'payment';
    }
    else if (chatbotKnowledge.photography.some(word => lowerMessage.includes(word))) {
        responseType = 'photography';
    }
    else if (chatbotKnowledge.selling.some(word => lowerMessage.includes(word))) {
        responseType = 'selling';
    }
    else if (chatbotKnowledge.valuation.some(word => lowerMessage.includes(word))) {
        responseType = 'valuation';
    }
    
    // Get random response from category
    const responseArray = responses[responseType];
    const response = responseArray[Math.floor(Math.random() * responseArray.length)];
    
    addBotMessage(response);
    
    // Add quick replies after certain responses
    if (['pricing', 'process', 'default'].includes(responseType)) {
        setTimeout(() => addQuickReplies(), 500);
    }
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    addUserMessage(message);
    input.value = '';
    
    // Remove any existing quick replies
    const quickReplies = document.querySelector('.quick-replies');
    if (quickReplies) quickReplies.remove();
    
    // Process after short delay
    setTimeout(() => processMessage(message), 600);
}

function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function toggleChat() {
    const panel = document.getElementById('chat-panel');
    const button = document.getElementById('chat-toggle');

    if (panel.classList.contains('active')) {
        panel.classList.remove('active');
        button.classList.remove('active');
    } else {
        panel.classList.add('active');
        button.classList.add('active');
        if (!chatInitialized) {
            setTimeout(initializeChat, 300);
        }
    }
}

// ============================================
// Condition Info Popup - Redesigned
// ============================================

function showConditionPopup() {
    // Check if popup was dismissed this session
    if (localStorage.getItem('conditionPopupDismissed') === 'true') {
        return;
    }

    const popup = document.getElementById('condition-popup');
    if (!popup) return;

    popup.classList.add('visible');

    // Reinitialize icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function closeConditionPopup() {
    const popup = document.getElementById('condition-popup');
    if (!popup) return;

    popup.classList.remove('visible');

    // Remember dismissal for this session
    localStorage.setItem('conditionPopupDismissed', 'true');
}

// Make function globally available
window.closeConditionPopup = closeConditionPopup;

// Initialize popup timing - show after 10 seconds
let popupShown = false;

setTimeout(() => {
    if (!popupShown) {
        showConditionPopup();
        popupShown = true;
    }
}, 10000);

// ============================================
// Step Detail Modal System
// ============================================

const stepDetails = {
    1: {
        title: "Get Your Free Valuation",
        content: `
            <h3>Step 1: Get Your Valuation</h3>
            <p style="font-size: 1.125rem; color: var(--gray-600); margin-bottom: 2rem;">We provide honest, market-based valuations — no inflated promises.</p>
            
            <div style="background: var(--gray-50); padding: 2rem; border-radius: var(--radius-md); margin-bottom: 2rem;">
                <h4 style="margin-bottom: 1rem; color: var(--navy);">What We Do:</h4>
                <ul style="list-style: none; padding: 0;">
                    <li style="display: flex; gap: 0.75rem; margin-bottom: 1rem; align-items: flex-start;">
                        <i data-lucide="check-circle" style="color: var(--sky-blue); flex-shrink: 0; width: 20px; height: 20px;"></i>
                        <span>Analyze recent sales data for your exact make and model</span>
                    </li>
                    <li style="display: flex; gap: 0.75rem; margin-bottom: 1rem; align-items: flex-start;">
                        <i data-lucide="check-circle" style="color: var(--sky-blue); flex-shrink: 0; width: 20px; height: 20px;"></i>
                        <span>Review current market demand and pricing trends</span>
                    </li>
                    <li style="display: flex; gap: 0.75rem; margin-bottom: 1rem; align-items: flex-start;">
                        <i data-lucide="check-circle" style="color: var(--sky-blue); flex-shrink: 0; width: 20px; height: 20px;"></i>
                        <span>Consider your car's condition, mileage, and service history</span>
                    </li>
                    <li style="display: flex; gap: 0.75rem; margin-bottom: 1rem; align-items: flex-start;">
                        <i data-lucide="check-circle" style="color: var(--sky-blue); flex-shrink: 0; width: 20px; height: 20px;"></i>
                        <span>Provide a realistic price that will actually sell</span>
                    </li>
                </ul>
            </div>

            <p style="font-size: 0.938rem; color: var(--gray-500);"><strong>Response time:</strong> We aim to respond promptly during business hours (Mon-Sat, 9am-6pm)</p>
            
            <button class="btn-modal" onclick="closeStepModal(); openModal();" style="margin-top: 2rem;">
                Get Free Valuation Now
            </button>
        `
    },
    2: {
        title: "We Handle Everything",
        content: `
            <h3>Step 2: We Handle Everything</h3>
            <p style="font-size: 1.125rem; color: var(--gray-600); margin-bottom: 2rem;">Sit back and relax. We take complete control of the sale.</p>
            
            <div style="background: var(--gray-50); padding: 2rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
                <h4 style="margin-bottom: 1rem; color: var(--navy);">Quality Photos</h4>
                <p style="margin: 0; color: var(--gray-600);">Detailed images covering all angles of your vehicle. We capture exterior, interior, engine bay, and any notable features to showcase your car effectively.</p>
            </div>

            <div style="background: var(--gray-50); padding: 2rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
                <h4 style="margin-bottom: 1rem; color: var(--navy);">Multi-Platform Advertising</h4>
                <p style="margin: 0; color: var(--gray-600);">Your car gets listed on AutoTrader, eBay Motors, Facebook Marketplace, and more. Maximum exposure = faster sale.</p>
            </div>

            <div style="background: var(--gray-50); padding: 2rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
                <h4 style="margin-bottom: 1rem; color: var(--navy);">Buyer Screening</h4>
                <p style="margin: 0; color: var(--gray-600);">We filter out time-wasters and lowballers. Only serious, qualified buyers get through to viewings.</p>
            </div>

            <div style="background: var(--gray-50); padding: 2rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
                <h4 style="margin-bottom: 1rem; color: var(--navy);">Viewings & Test Drives</h4>
                <p style="margin: 0; color: var(--gray-600);">We coordinate all viewings around your schedule. You're present but we handle the conversations and negotiations.</p>
            </div>

            <p style="font-size: 0.938rem; color: var(--gray-500); margin-top: 2rem;"><strong>Best part:</strong> You keep driving your car the entire time. It stays with you until sold.</p>
        `
    },
    3: {
        title: "Get Paid",
        content: `
            <h3>Step 3: Get Paid</h3>
            <p style="font-size: 1.125rem; color: var(--gray-600); margin-bottom: 2rem;">Simple, secure, and completely transparent.</p>
            
            <div style="background: var(--gray-50); padding: 2rem; border-radius: var(--radius-md); margin-bottom: 2rem;">
                <h4 style="margin-bottom: 1rem; color: var(--navy);">Payment Process:</h4>
                <ol style="padding-left: 1.5rem; color: var(--gray-700);">
                    <li style="margin-bottom: 1rem;"><strong>Sale Agreed:</strong> Once we negotiate the best price with a buyer</li>
                    <li style="margin-bottom: 1rem;"><strong>Buyer Pays You:</strong> Money transfers directly to your account (we never handle the funds)</li>
                    <li style="margin-bottom: 1rem;"><strong>Paperwork Sorted:</strong> We handle V5C transfer and all documentation</li>
                    <li style="margin-bottom: 1rem;"><strong>Our Fee:</strong> You pay us 8% of the sale price (£350 minimum)</li>
                </ol>
            </div>

            <div style="background: linear-gradient(135deg, var(--sky-blue) 0%, var(--sky-blue-dark) 100%); padding: 2rem; border-radius: var(--radius-md); color: white; text-align: center;">
                <h4 style="color: white; margin-bottom: 0.5rem; font-size: 1.5rem;">No Sale, No Fee</h4>
                <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 1.063rem;">You only pay if we successfully sell your car</p>
            </div>

            <p style="font-size: 0.938rem; color: var(--gray-500); margin-top: 2rem;"><strong>Timeline:</strong> Most cars sell within 2-6 weeks, depending on make, model, and market conditions.</p>
            
            <button class="btn-modal" onclick="closeStepModal(); openModal();" style="margin-top: 2rem;">
                Start Selling Today
            </button>
        `
    }
};

function openStepModal(stepNumber) {
    const overlay = document.getElementById('step-modal-overlay');
    const content = document.getElementById('step-modal-content');
    
    if (overlay && content && stepDetails[stepNumber]) {
        content.innerHTML = stepDetails[stepNumber].content;
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Reinitialize icons
        if (typeof lucide !== 'undefined') {
            setTimeout(() => lucide.createIcons(), 100);
        }
    }
}

function closeStepModal() {
    const overlay = document.getElementById('step-modal-overlay');
    if (overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close step modal on overlay click
const stepModalOverlay = document.getElementById('step-modal-overlay');
if (stepModalOverlay) {
    stepModalOverlay.addEventListener('click', (e) => {
        if (e.target === stepModalOverlay) {
            closeStepModal();
        }
    });
}

// Close step modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && stepModalOverlay && stepModalOverlay.classList.contains('active')) {
        closeStepModal();
    }
});

// Make functions globally available
window.openStepModal = openStepModal;
window.closeStepModal = closeStepModal;

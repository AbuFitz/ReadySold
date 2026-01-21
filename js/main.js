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

        // Send to backend via Resend API
        sendEmailNotification('valuation', completeData)
            .then(() => {
                showSuccessStep();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Sorry, there was an error. Please try again or call us directly.');
            });
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
    modal.onclick = function(e) {
        if (e.target === this) closeLearnMoreModal();
    };
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

                <div style="background: linear-gradient(135deg, var(--sky-blue-light) 0%, var(--sky-blue-dark) 100%); padding: 1.5rem; border-radius: var(--radius-md); margin-bottom: 2rem; color: white;">
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
// Fee Breakdown - Tab Navigation
// ============================================

// Tab navigation functionality
const feeTabs = document.querySelectorAll('.fee-tab');
const feeContents = document.querySelectorAll('.fee-content');

if (feeTabs.length > 0) {
    feeTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const feeType = this.getAttribute('data-fee');

            // Remove active class from all tabs and content
            feeTabs.forEach(t => t.classList.remove('active'));
            feeContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            const targetContent = document.getElementById(`fee-${feeType}`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
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
        "Hi! I'm here to help with any questions about ReadySold. Ask me about our fees, process, or anything else.",
        "Hello! Happy to explain how our managed private-sale service works. What would you like to know?",
        "Hey! Feel free to ask about pricing, timeline, or how selling with ReadySold works."
    ],
    pricing: [
        "We charge a flat £495 upfront service fee (non-refundable, paid at inspection) plus a £395 success fee when your car sells. No percentages, no commission.",
        "Simple fees: £495 upfront (covers inspection, photos, listings, admin) and £395 when sold. That's it - no hidden costs or percentages.",
        "£495 at inspection + £395 at sale. Flat fees, not commission-based. The upfront fee is non-refundable as it covers our service costs."
    ],
    process: [
        "Book inspection → We photograph & list your car → Handle all buyers & viewings → You approve offers → Sale completes → You get paid. You keep your car throughout and stay in control.",
        "Simple: inspection, photography, multi-platform listing, we manage buyers/viewings, you approve final sale. Your car stays with you the whole time.",
        "We handle everything - photos, listings, buyers, viewings - while you keep control of pricing and final decisions. It's a managed private sale."
    ],
    driving: [
        "Yes, absolutely. Your car stays with you until it sells. We coordinate viewings around your schedule.",
        "100%. You keep full access to your car throughout. We just arrange viewings when it suits you.",
        "Your car never leaves you until sale completes. We work around your availability for viewings."
    ],
    time: [
        "Timeframes vary - we make no guarantees. Some cars sell quickly, others take longer depending on make, model, condition, and market demand.",
        "It depends on the vehicle and market conditions. We're honest that we can't guarantee timelines, but we work actively to find buyers.",
        "Timeline varies by car and market. We list actively but make no promises on how long it'll take."
    ],
    payment: [
        "£495 paid at inspection (non-refundable). £395 success fee paid when your car sells. Buyer pays you directly, then you settle our success fee.",
        "Upfront fee at inspection, success fee at sale. The buyer's payment goes straight to you - we never handle their money.",
        "You pay £495 before we start, £395 when it sells. Buyer pays you directly, then you pay us the success fee."
    ],
    photography: [
        "Included in the service. We take comprehensive photos covering all angles - exterior, interior, engine bay, details.",
        "Professional photos are part of our £495 service fee. Full coverage from every angle.",
        "Yes, covered in the upfront fee. We shoot all angles to make your listing stand out."
    ],
    selling: [
        "We list on AutoTrader, eBay Motors, Facebook Marketplace, and more. We handle all buyer contact, viewings, and negotiations.",
        "Multi-platform listings (AutoTrader, eBay, Facebook, etc.). We manage buyers, coordinate viewings, negotiate - you approve the final deal.",
        "Listed everywhere major. We screen buyers, handle viewings, negotiate offers, and keep you informed."
    ],
    condition: [
        "We accept cars in any condition - including Category S/N. High mileage, minor damage, wear and tear - all fine. We're upfront with buyers about condition.",
        "Category S/N accepted (A/B not accepted). Minor damage, high mileage, cosmetic issues - we handle it. Transparency attracts serious buyers.",
        "Condition doesn't need to be perfect. We accept Cat S/N and cars with faults. Honest listings get better results."
    ],
    locations: [
        "Service availability depends on your location. Submit a booking request and we'll confirm if we cover your area.",
        "Coverage varies by region. Request an inspection and we'll let you know if we service your area.",
        "Submit your details and we'll confirm whether we operate in your location."
    ],
    paperwork: [
        "We handle V5C transfers and paperwork. You provide the logbook, we manage the admin when the sale completes.",
        "All sorted by us. You need your V5C logbook - we handle the transfer and documentation.",
        "We take care of the paperwork. Just have your V5C ready when it's time to complete the sale."
    ],
    viewings: [
        "We coordinate viewings around your schedule. You're present (it's your car), but we handle conversations and negotiations.",
        "Scheduled to suit you. We're there to manage buyer interactions while you keep control.",
        "Viewings work around your availability. We handle the buyer communication and negotiation."
    ],
    valuation: [
        "We provide market guidance, but pricing is your decision. This is a managed private sale - you set the price and control final decisions.",
        "You control pricing. We can advise on market values, but ultimately it's your call on what price to list and accept.",
        "Pricing is up to you. We offer guidance based on market data, but you're in control."
    ],
    default: [
        "What would you like to know? I can explain our fees, process, timelines, accepted conditions, or anything else.",
        "Happy to help. Ask me about pricing, how it works, viewings, accepted vehicles, or any other questions.",
        "What can I help with? Fees, process, timeline, car condition - just ask."
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
        <button class="quick-reply-btn" onclick="handleQuickReply('What are your fees?')">Pricing</button>
        <button class="quick-reply-btn" onclick="handleQuickReply('How does it work?')">Process</button>
        <button class="quick-reply-btn" onclick="handleQuickReply('Can I keep driving?')">Keep Car?</button>
        <button class="quick-reply-btn" onclick="handleQuickReply('Do you accept damaged cars?')">Condition</button>
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

// Handle mobile keyboard behavior
let originalChatPanelBottom = null;

function toggleChat() {
    const chatPanel = document.getElementById('chat-panel');
    const chatButton = document.getElementById('chat-toggle');
    
    if (!chatPanel || !chatButton) return;
    
    chatPanel.classList.toggle('active');
    chatButton.classList.toggle('active');
    
    if (chatPanel.classList.contains('active')) {
        if (!chatInitialized) {
            initializeChat();
        }
        
        // Handle mobile viewport adjustment
        if (window.innerWidth <= 640) {
            // Store original position
            if (!originalChatPanelBottom) {
                const computedStyle = window.getComputedStyle(chatPanel);
                originalChatPanelBottom = computedStyle.bottom;
            }
            
            // Adjust for mobile keyboard
            const input = document.getElementById('chat-input');
            if (input) {
                input.addEventListener('focus', handleMobileFocus);
                input.addEventListener('blur', handleMobileBlur);
            }
        }
    } else {
        // Clean up event listeners
        const input = document.getElementById('chat-input');
        if (input) {
            input.removeEventListener('focus', handleMobileFocus);
            input.removeEventListener('blur', handleMobileBlur);
        }
    }
}

function handleMobileFocus() {
    const chatPanel = document.getElementById('chat-panel');
    if (chatPanel && window.innerWidth <= 640) {
        // Scroll panel into view when keyboard opens
        setTimeout(() => {
            chatPanel.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }, 300);
    }
}

function handleMobileBlur() {
    const chatPanel = document.getElementById('chat-panel');
    if (chatPanel && window.innerWidth <= 640 && originalChatPanelBottom) {
        chatPanel.style.bottom = originalChatPanelBottom;
    }
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
        title: "Inspection & Eligibility",
        content: `
            <h3>Step 1: Inspection & Eligibility</h3>
            <p style="font-size: 1.125rem; color: var(--gray-600); margin-bottom: 2rem;">We verify your vehicle and confirm suitability for managed private sale.</p>

            <div style="background: var(--gray-50); padding: 2rem; border-radius: var(--radius-md); margin-bottom: 2rem;">
                <h4 style="margin-bottom: 1rem; color: var(--navy);">What We Do:</h4>
                <ul style="list-style: none; padding: 0;">
                    <li style="display: flex; gap: 0.75rem; margin-bottom: 1rem; align-items: flex-start;">
                        <i data-lucide="check-circle" style="color: var(--sky-blue); flex-shrink: 0; width: 20px; height: 20px;"></i>
                        <span>Check vehicle eligibility for managed sale</span>
                    </li>
                    <li style="display: flex; gap: 0.75rem; margin-bottom: 1rem; align-items: flex-start;">
                        <i data-lucide="check-circle" style="color: var(--sky-blue); flex-shrink: 0; width: 20px; height: 20px;"></i>
                        <span>Visual inspection and condition assessment</span>
                    </li>
                    <li style="display: flex; gap: 0.75rem; margin-bottom: 1rem; align-items: flex-start;">
                        <i data-lucide="check-circle" style="color: var(--sky-blue); flex-shrink: 0; width: 20px; height: 20px;"></i>
                        <span>Category status disclosure (if applicable)</span>
                    </li>
                    <li style="display: flex; gap: 0.75rem; margin-bottom: 1rem; align-items: flex-start;">
                        <i data-lucide="check-circle" style="color: var(--sky-blue); flex-shrink: 0; width: 20px; height: 20px;"></i>
                        <span>Discuss pricing strategy and expectations</span>
                    </li>
                </ul>
            </div>

            <p style="font-size: 0.938rem; color: var(--gray-500);"><strong>Note:</strong> You set your own price. We provide market insights but the decision is yours.</p>

            <button class="btn-modal" onclick="closeStepModal(); openModal();" style="margin-top: 2rem;">
                Get Started &ndash; Book Inspection
            </button>
        `
    },
    2: {
        title: "Sell-Ready Preparation",
        content: `
            <h3>Step 2: Sell-Ready Preparation</h3>
            <p style="font-size: 1.125rem; color: var(--gray-600); margin-bottom: 2rem;">Professional presentation with ReadySold Verified system.</p>

            <div style="background: var(--gray-50); padding: 2rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
                <h4 style="margin-bottom: 1rem; color: var(--navy);">Professional Photography</h4>
                <p style="margin: 0; color: var(--gray-600);">Quality images covering all angles — exterior, interior, engine bay, and notable features.</p>
            </div>

            <div style="background: var(--gray-50); padding: 2rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
                <h4 style="margin-bottom: 1rem; color: var(--navy);">ReadySold Verified Documentation</h4>
                <p style="margin: 0; color: var(--gray-600);">Identity verification, history checks, condition summary, and transparent fault disclosure.</p>
            </div>

            <div style="background: var(--gray-50); padding: 2rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
                <h4 style="margin-bottom: 1rem; color: var(--navy);">Professional Listing</h4>
                <p style="margin: 0; color: var(--gray-600);">Comprehensive listing created at your set price. Multi-platform exposure for maximum visibility.</p>
            </div>

            <p style="font-size: 0.938rem; color: var(--gray-500); margin-top: 2rem;"><strong>Upfront Fee:</strong> £495 Sell-Ready Service Fee covers all preparation whether or not the car sells.</p>
        `
    },
    3: {
        title: "We Handle Buyers",
        content: `
            <h3>Step 3: We Handle Buyers</h3>
            <p style="font-size: 1.125rem; color: var(--gray-600); margin-bottom: 2rem;">You keep control. We handle the hassle.</p>

            <div style="background: var(--gray-50); padding: 2rem; border-radius: var(--radius-md); margin-bottom: 2rem;">
                <h4 style="margin-bottom: 1rem; color: var(--navy);">What We Manage:</h4>
                <ul style="list-style: none; padding: 0;">
                    <li style="display: flex; gap: 0.75rem; margin-bottom: 1rem; align-items: flex-start;">
                        <i data-lucide="check-circle" style="color: var(--sky-blue); flex-shrink: 0; width: 20px; height: 20px;"></i>
                        <span>All buyer enquiries and communication</span>
                    </li>
                    <li style="display: flex; gap: 0.75rem; margin-bottom: 1rem; align-items: flex-start;">
                        <i data-lucide="check-circle" style="color: var(--sky-blue); flex-shrink: 0; width: 20px; height: 20px;"></i>
                        <span>Viewing coordination and test drive management</span>
                    </li>
                    <li style="display: flex; gap: 0.75rem; margin-bottom: 1rem; align-items: flex-start;">
                        <i data-lucide="check-circle" style="color: var(--sky-blue); flex-shrink: 0; width: 20px; height: 20px;"></i>
                        <span>You approve or decline all offers — no pressure</span>
                    </li>
                    <li style="display: flex; gap: 0.75rem; margin-bottom: 1rem; align-items: flex-start;">
                        <i data-lucide="check-circle" style="color: var(--sky-blue); flex-shrink: 0; width: 20px; height: 20px;"></i>
                        <span>If you accept: we support handover and completion</span>
                    </li>
                </ul>
            </div>

            <div style="background: var(--off-white); padding: 2rem; border-radius: var(--radius-md); border-left: 4px solid var(--sky-blue);">
                <h4 style="margin-bottom: 1rem; color: var(--navy);">Success Fee</h4>
                <p style="margin: 0; color: var(--gray-700);">£395 flat fee only if sale completes. Covers deal coordination, buyer communication, and completion support. You keep your vehicle throughout and pay nothing extra if the car doesn't sell.</p>
            </div>

            <button class="btn-modal" onclick="closeStepModal(); openModal();" style="margin-top: 2rem;">
                Get Started &ndash; Book Inspection
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

// ============================================
// Email API Integration (Resend)
// ============================================

async function sendEmailNotification(type, data) {
    try {
        const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: type,
                data: data
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to send email');
        }

        const result = await response.json();
        console.log('Email sent successfully:', result.messageId);
        return result;

    } catch (error) {
        console.error('Email sending error:', error);
        throw error;
    }
}

// ============================================
// FAQ Accordion
// ============================================

const faqItems = document.querySelectorAll('.faq-item');

if (faqItems.length > 0) {
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Close all FAQ items
                faqItems.forEach(faqItem => faqItem.classList.remove('active'));

                // Open clicked item if it wasn't already active
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });
}

// Make functions globally available
window.openStepModal = openStepModal;
window.closeStepModal = closeStepModal;
window.sendEmailNotification = sendEmailNotification;

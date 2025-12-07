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
    greetings: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'],
    pricing: ['price', 'cost', 'fee', 'charge', 'expensive', 'how much', 'pricing'],
    process: ['how', 'work', 'process', 'steps', 'procedure'],
    driving: ['drive', 'driving', 'keep', 'use', 'car'],
    coverage: ['area', 'location', 'where', 'cover', 'nationwide', 'region'],
    time: ['long', 'quick', 'fast', 'duration', 'time'],
    payment: ['pay', 'payment', 'when', 'upfront'],
    photography: ['photo', 'picture', 'image'],
    selling: ['sell', 'buyer', 'listing'],
    contact: ['call', 'phone', 'email', 'reach', 'contact', 'talk', 'speak'],
    valuation: ['value', 'worth', 'estimate', 'valuation']
};

const responses = {
    greeting: ["👋 Hi there! I'm here to help you sell your car stress-free.", "Hello! How can I help you today?", "Hey! Got questions about selling your car?"],
    pricing: ["We charge 10% of the sale price (minimum £350).\nYou only pay when your car sells.\nNo upfront costs or hidden fees.", "10% commission when sold (£350 minimum).\nZero upfront costs.\nYou pay nothing if it doesn't sell."],
    process: ["Here's how it works:\n1. Free valuation - we call you within 2 hours\n2. Professional photos & listings on all platforms\n3. We handle viewings, calls & negotiations\n4. You get paid, we get our fee", "Simple process:\n• Get your free valuation\n• We photograph & list your car\n• Keep driving while we find buyers\n• We handle everything until sold"],
    driving: ["Yes, you keep driving your car!\nWe coordinate viewings around your schedule.\nYour car stays with you until sold.", "Absolutely! Keep full use of your car.\nWe work around your availability for viewings."],
    coverage: ["We cover the entire UK.\nNationwide service available.\nWherever you are, we can help.", "UK-wide coverage.\nCall us to confirm your specific area: 020 1234 5678"],
    time: ["We respond within 2 hours for valuations.\nSale time varies by car & market.\nUsually 2-6 weeks for most vehicles.", "Quick response - 2 hours max.\nSelling time depends on your car.\nWe'll give you realistic timescales."],
    payment: ["You only pay when your car sells.\nNo upfront costs ever.\nBuyer pays you directly, then you pay our fee.", "Zero upfront payment.\nPay only on successful sale.\n10% of sale price (£350 minimum)."],
    photography: ["Professional photography is included.\nShowroom-quality images.\nMakes your car sell faster.", "We include pro photos at no extra cost.\nHigh-quality images for all listings."],
    selling: ["We list on all major platforms.\nHandle all buyer communications.\nNegotiate on your behalf.\nYou approve the final sale.", "We manage the entire sale:\n• List everywhere\n• Screen buyers\n• Arrange viewings\n• Negotiate price\n• Handle paperwork"],
    contact: ["📞 Call: 020 1234 5678\n📧 Email: hello@readysold.co.uk\n⏰ Mon-Sat: 9am-6pm", "Reach us:\nPhone: 020 1234 5678\nEmail: hello@readysold.co.uk\nHours: Mon-Sat, 9am-6pm"],
    valuation: ["Get your free valuation now!\nEnter your reg above or call us.\nWe'll research the market & call you within 2 hours.", "Free valuation available.\nNo obligation.\nJust enter your registration and we'll be in touch."],
    default: ["I'm not sure about that.\nWould you like to:\n• Talk about pricing?\n• Learn how it works?\n• Get a free valuation?\n• Speak to someone? 020 1234 5678", "Good question! Let me help:\n• Our fees: 10% when sold\n• How it works: We handle everything\n• Coverage: UK-wide\n• Call us: 020 1234 5678"]
};

function initializeChat() {
    if (chatInitialized) return;
    
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = '';
    
    // Welcome message
    addBotMessage("👋 Hi! I'm the ReadySold assistant.", true);
    setTimeout(() => {
        addBotMessage("Got questions about selling your car?\nI can help with pricing, process, or anything else!");
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
        <button class="quick-reply-btn" onclick="handleQuickReply('What are your fees?')">💰 Pricing</button>
        <button class="quick-reply-btn" onclick="handleQuickReply('How does it work?')">📋 Process</button>
        <button class="quick-reply-btn" onclick="handleQuickReply('Get valuation')">🚗 Get Valuation</button>
        <button class="quick-reply-btn" onclick="handleQuickReply('Contact you')">📞 Contact</button>
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
    // Check other categories
    else if (chatbotKnowledge.pricing.some(word => lowerMessage.includes(word))) {
        responseType = 'pricing';
    }
    else if (chatbotKnowledge.process.some(word => lowerMessage.includes(word))) {
        responseType = 'process';
    }
    else if (chatbotKnowledge.driving.some(word => lowerMessage.includes(word))) {
        responseType = 'driving';
    }
    else if (chatbotKnowledge.coverage.some(word => lowerMessage.includes(word))) {
        responseType = 'coverage';
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
    else if (chatbotKnowledge.contact.some(word => lowerMessage.includes(word))) {
        responseType = 'contact';
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


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
    greetings: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'thanks', 'thank you'],
    pricing: ['price', 'cost', 'fee', 'charge', 'expensive', 'how much', 'pricing', 'fees', 'commission', 'percentage', 'cheap', 'affordable'],
    process: ['how', 'work', 'process', 'steps', 'procedure', 'what happens', 'how does', 'explain', 'walk me through', 'works'],
    driving: ['drive', 'driving', 'keep', 'use', 'car', 'still use', 'keep using', 'access', 'use my car'],
    coverage: ['area', 'location', 'where', 'cover', 'nationwide', 'region', 'available', 'service', 'operate', 'uk'],
    time: ['long', 'quick', 'fast', 'duration', 'time', 'how long', 'quickly', 'speed', 'when', 'timeline'],
    payment: ['pay', 'payment', 'when', 'upfront', 'money', 'paid', 'paying', 'receive', 'get paid'],
    photography: ['photo', 'picture', 'image', 'photos', 'pictures', 'photography', 'images'],
    selling: ['sell', 'buyer', 'listing', 'advertise', 'market', 'list', 'platform', 'where listed', 'find buyers'],
    contact: ['call', 'phone', 'email', 'reach', 'contact', 'talk', 'speak', 'get in touch', 'reach out', 'number'],
    valuation: ['value', 'worth', 'estimate', 'valuation', 'what is my car worth', 'car value', 'quote', 'assessment']
};

const responses = {
    greeting: [
        "Hi there! I'm here to help you sell your car. What would you like to know?",
        "Hello! Thanks for getting in touch. How can I assist with selling your car today?",
        "Hey! Whether you're curious about pricing, the process, or just exploring your options, I'm happy to help."
    ],
    pricing: [
        "Our pricing is straightforward - we charge 10% of the sale price with a minimum fee of £350. You only pay when your car actually sells, so there's zero risk and no upfront costs. If we don't sell it, you don't pay anything.",
        "We work on a success-based model. You'll pay 10% of whatever we sell your car for (minimum £350), but only once the sale completes. No hidden fees, no upfront charges - just a fair commission when we deliver results.",
        "Think of it as risk-free selling. Our 10% commission (£350 minimum) only applies when your car sells. Until then, you're not out of pocket at all. We're motivated to get you the best price because we only earn when you do."
    ],
    process: [
        "The process is designed to be hassle-free for you. First, we provide a free valuation - typically within 2 hours of you contacting us. Then we arrange professional photography and create listings across all major platforms. While we handle viewings, calls, and negotiations, you keep driving your car as normal. Once we find the right buyer, we coordinate the sale and you receive your payment.",
        "Here's what happens: After you request a valuation, we'll call you within 2 hours to discuss your car and give you an accurate estimate. We then photograph your vehicle and list it everywhere - AutoTrader, eBay Motors, Facebook Marketplace, you name it. We manage all the interested buyers, arrange viewings that suit your schedule, and negotiate on your behalf. You stay in the loop and approve the final sale.",
        "It's a four-step journey. Step one: Free valuation where we assess your car's market value. Step two: Professional photos and comprehensive listings. Step three: We handle all buyer interactions and viewings while you keep using your car. Step four: We finalize the sale, you get paid, and we collect our commission. Simple as that."
    ],
    driving: [
        "Yes, absolutely! Your car stays with you throughout the entire selling process. We work around your schedule for viewings, so you maintain full use of your vehicle until the moment it sells. There's no need to hand over keys or lose access - it's your car until someone buys it.",
        "That's one of the best parts of our service. You keep driving your car normally. When potential buyers want to view it, we coordinate times that work for you. No inconvenience, no loss of mobility - your life continues as usual while we work on finding the right buyer.",
        "Definitely! We understand you need your car, so it stays in your possession. We schedule viewings around your availability, whether that's evenings, weekends, or whenever suits you best. You're never without your vehicle until the sale completes."
    ],
    coverage: [
        "We operate across the entire UK. Whether you're in London, Manchester, Edinburgh, Cardiff, or a small village in the countryside, we can help you sell your car. Our nationwide network means we reach buyers everywhere, maximizing your chances of a quick sale at the right price.",
        "Our service covers all of the UK. We've successfully sold cars from the Scottish Highlands to Cornwall and everywhere in between. If you want to double-check coverage for your specific postcode, give us a call on 020 1234 5678.",
        "Nationwide coverage - we're not limited by region. Our platform reaches potential buyers across England, Scotland, Wales, and Northern Ireland, which means more eyes on your listing and better competition for the sale."
    ],
    time: [
        "For valuations, we're very responsive - you'll hear from us within 2 hours during business hours. As for selling time, it varies depending on your car's make, model, condition, and price point. Most vehicles sell within 2-6 weeks, though popular models in good condition often go faster. We'll give you a realistic timeframe when we value your car.",
        "We move quickly on valuations - expect a call within 2 hours. The actual selling time depends on market demand for your specific vehicle. A well-priced car in good condition might sell in days, while others take a few weeks. We'll be upfront about realistic expectations based on current market conditions.",
        "Our response time for valuations is typically under 2 hours. Once listed, sale duration varies - factors like pricing, condition, mileage, and model popularity all play a role. We use real-time market data to price competitively, which helps most cars sell within a month. We'll keep you updated throughout."
    ],
    payment: [
        "Payment is simple and secure. The buyer pays you directly for the car - we're not a middleman in the transaction. Once the sale completes and you've received your money, you then pay us our 10% commission (minimum £350). You're always in control of the funds.",
        "No upfront costs at all. When your car sells, the buyer transfers money directly to you. After you receive the full payment, you pay our commission of 10% of the sale price (£350 minimum). It's straightforward and completely transparent.",
        "Zero payment until your car sells. When it does, you receive the sale price from the buyer, then settle our 10% fee (minimum £350). We don't handle the buyer's money - it goes straight to you, keeping everything simple and secure."
    ],
    photography: [
        "Professional photography is included in our service at no extra charge. High-quality images make a massive difference in attracting buyers and achieving the right price. We'll capture your car in the best light with showroom-quality photos that make it stand out from other listings.",
        "We provide professional photography as standard - it's crucial for online listings. Quality images generate more interest, more viewings, and ultimately better offers. There's no additional cost; it's part of how we ensure your car sells quickly and for the best price.",
        "Yes, professional photos are included. We know that great photography sells cars, so we make sure your vehicle looks its absolute best across all platforms. Crisp, well-lit images that highlight the car's condition and features - all part of the service."
    ],
    selling: [
        "We handle the complete selling process. Your car gets listed on AutoTrader, eBay Motors, Facebook Marketplace, and other major platforms. We field all inquiries, pre-screen buyers, arrange viewings around your schedule, and negotiate to get you the best price. You stay informed and approve the final sale before anything is finalized.",
        "Think of us as your personal car selling team. We create compelling listings with professional photos, manage all buyer communications, handle price negotiations, organize viewings, and deal with the paperwork. You're involved in the key decisions but free from the day-to-day hassle.",
        "Our comprehensive service covers everything: multi-platform listings, buyer vetting, appointment scheduling, professional negotiation, and sale coordination. We only bring you serious, qualified buyers, and we always get your approval before accepting any offer. You get the results without the stress."
    ],
    contact: [
        "You can reach us by phone at 020 1234 5678 or email hello@readysold.co.uk. We're available Monday to Saturday, 9am to 6pm. Whether you want to discuss a valuation, ask questions, or get started with selling your car, we're here to help.",
        "Feel free to call us on 020 1234 5678 during business hours (Mon-Sat, 9am-6pm) or drop us an email anytime at hello@readysold.co.uk. We'll get back to you promptly with answers to your questions or to arrange your free valuation.",
        "Contact details: Phone 020 1234 5678, Email hello@readysold.co.uk. Our team is available Monday through Saturday, 9am to 6pm. We're happy to chat about your car and explain how we can help you sell it hassle-free."
    ],
    valuation: [
        "Getting a free valuation is easy. You can enter your registration number in the form at the top of this page, or simply give us a call on 020 1234 5678. Either way, we'll research current market conditions and get back to you within 2 hours with an accurate, honest valuation. No obligation whatsoever.",
        "Ready for your free valuation? Just pop your reg number into the form above or call us directly. We'll analyze recent sales data, current market trends, and your car's specific details to provide a realistic valuation. You'll hear from us within 2 hours, and there's no pressure to proceed.",
        "Free valuations are our starting point. Enter your registration details on this page, and we'll call you within 2 hours to discuss your car's value based on real market data. It's completely free and there's no commitment required - just helpful information to guide your decision."
    ],
    default: [
        "That's a great question. While I might not have covered that specific point, I can help you with information about our pricing, how the process works, what areas we cover, or put you in touch with the team directly. What would be most helpful for you right now?",
        "I want to make sure I give you accurate information. Could you tell me a bit more about what you'd like to know? I can explain our fees, walk you through the selling process, discuss timelines, or connect you with someone on the team at 020 1234 5678.",
        "Thanks for asking. To give you the best answer, could you clarify what aspect of selling your car you're most curious about? Whether it's about costs, the process, timing, or something else entirely - I'm here to help or can get you speaking with our team."
    ]
};

function initializeChat() {
    if (chatInitialized) return;
    
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = '';
    
    // Welcome message
    addBotMessage("Hi! I'm the ReadySold assistant. I'm here to help you understand how we can sell your car hassle-free.", true);
    setTimeout(() => {
        addBotMessage("I can answer questions about pricing, explain our process, or help you get started with a free valuation. What would you like to know?");
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
        <button class="quick-reply-btn" onclick="handleQuickReply('What are your fees?')">Pricing & Fees</button>
        <button class="quick-reply-btn" onclick="handleQuickReply('How does it work?')">How It Works</button>
        <button class="quick-reply-btn" onclick="handleQuickReply('I want a free valuation')">Free Valuation</button>
        <button class="quick-reply-btn" onclick="handleQuickReply('How do I contact you?')">Contact Details</button>
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


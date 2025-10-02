// ===== GLOBAL VARIABLES =====
let isScrolling = false;
let currentSection = 'home';

// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// ===== MAIN INITIALIZATION =====
function initializeWebsite() {
    // Initialize all components
    initializeNavigation();
    initializeThemeToggle();
    initializeScrollAnimations();
    initializeSkillsAnimation();
    initializeContactForm();
    initializeProjectModals();
    initializeScrollIndicator();
    initializeTypingEffect();
    initializeParallaxEffects();
    initializeResumeDownload();
    
    // Load saved theme
    loadSavedTheme();
    
    // Initialize GSAP animations
    initializeGSAPAnimations();
    
    console.log('Portfolio website initialized successfully!');
}

// ===== NAVIGATION FUNCTIONALITY =====
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            // Close mobile menu
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            
            // Smooth scroll to section
            if (targetSection) {
                smoothScrollTo(targetSection.offsetTop - 70);
            }
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active nav link
        updateActiveNavLink();
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
}

// ===== SMOOTH SCROLLING =====
function smoothScrollTo(targetPosition) {
    if (isScrolling) return;
    
    isScrolling = true;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 1000;
    let start = null;
    
    function animation(currentTime) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        } else {
            isScrolling = false;
        }
    }
    
    function easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
}

// ===== ACTIVE NAV LINK UPDATE =====
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = 'home';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    if (current !== currentSection) {
        currentSection = current;
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
            }
        });
    }
}

// ===== THEME TOGGLE =====
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        
        // Update icon
        if (newTheme === 'dark') {
            themeIcon.className = 'fas fa-sun';
        } else {
            themeIcon.className = 'fas fa-moon';
        }
        
        // Save theme preference
        localStorage.setItem('theme', newTheme);
        
        // Add transition effect
        document.body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    });
}

function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const themeIcon = document.querySelector('#theme-toggle i');
    
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    if (savedTheme === 'dark') {
        themeIcon.className = 'fas fa-sun';
    } else {
        themeIcon.className = 'fas fa-moon';
    }
}

// ===== SCROLL ANIMATIONS =====
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Trigger skill bars animation
                if (entry.target.classList.contains('skills')) {
                    animateSkillBars();
                }
            }
        });
    }, observerOptions);
    
    // Observe sections for fade-in animations
    const animatedElements = document.querySelectorAll('.about, .skills, .projects, .contact');
    animatedElements.forEach(element => {
        element.classList.add('fade-in');
        observer.observe(element);
    });
    
    // Observe individual cards and items
    const cards = document.querySelectorAll('.project-card, .skill-item, .detail-item');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        observer.observe(card);
    });
}

// ===== SKILLS ANIMATION =====
function initializeSkillsAnimation() {
    // This will be triggered by scroll animations
}

function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        bar.style.width = width + '%';
    });
}

// ===== CONTACT FORM =====
function initializeContactForm() {
    // Initialize EmailJS
    emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your EmailJS public key
    
    const contactForm = document.getElementById('contact-form');
    const inputs = contactForm.querySelectorAll('input, textarea');
    
    // Add input event listeners for better UX
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            // Clear any error status when user starts typing
            const formStatus = document.getElementById('form-status');
            if (formStatus && formStatus.classList.contains('error')) {
                hideFormStatus();
            }
        });
        
        input.addEventListener('focus', function() {
            // Clear any previous error status when user focuses
            const formStatus = document.getElementById('form-status');
            if (formStatus && formStatus.classList.contains('error')) {
                hideFormStatus();
            }
        });
    });
    
    // Form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Validate form
        if (validateForm(data)) {
            submitForm(data, this);
        }
    });
}

function validateForm(data) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const errors = [];
    
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Name must be at least 2 characters');
    }
    
    if (!data.email || !emailRegex.test(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!data.subject || data.subject.trim().length < 3) {
        errors.push('Subject must be at least 3 characters');
    }
    
    if (!data.message || data.message.trim().length < 10) {
        errors.push('Message must be at least 10 characters');
    }
    
    if (errors.length > 0) {
        const errorMessage = errors.length === 1 ? 
            `❌ ${errors[0]}` : 
            '❌ Please fix the following:<br>• ' + errors.join('<br>• ');
        showFormStatus(errorMessage, 'error');
        
        // Focus on first invalid field
        const formElements = ['name', 'email', 'subject', 'message'];
        for (let field of formElements) {
            if (!data[field] || (field === 'email' && !emailRegex.test(data[field])) || 
                (field !== 'email' && data[field].trim().length < (field === 'name' ? 2 : field === 'subject' ? 3 : 10))) {
                document.getElementById(field).focus();
                break;
            }
        }
        
        return false;
    }
    
    return true;
}

function submitForm(data, form) {
    const submitButton = document.querySelector('#contact-form button[type="submit"]');
    const formStatus = document.getElementById('form-status');
    const originalText = submitButton.innerHTML;
    
    // Show loading state
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitButton.disabled = true;
    
    // Show loading status
    showFormStatus('📤 Sending your message...', 'loading');
    
    // Try to send via EmailJS first, fallback to mailto
    if (typeof emailjs !== 'undefined') {
        // EmailJS service (requires setup)
        const templateParams = {
            from_name: data.name,
            from_email: data.email,
            subject: data.subject,
            message: data.message,
            to_email: 'swarnalakshmip4@gmail.com'
        };
        
        emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
            .then(function(response) {
                showFormStatus('🎉 Message sent successfully! Thank you for reaching out. I\'ll get back to you within 24 hours.', 'success');
                form.reset();
                
                // Reset button
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
                
                // Hide status after 6 seconds
                setTimeout(() => {
                    hideFormStatus();
                }, 6000);
                
            }, function(error) {
                console.error('EmailJS failed:', error);
                fallbackToMailto(data);
            });
    } else {
        // Fallback to mailto
        fallbackToMailto(data);
    }
    
    function fallbackToMailto(data) {
        // Fallback: Open default email client
        const subject = encodeURIComponent(`Portfolio Contact: ${data.subject}`);
        const body = encodeURIComponent(`
Name: ${data.name}
Email: ${data.email}
Subject: ${data.subject}

Message:
${data.message}

---
Sent from Digital Portfolio Contact Form
        `);
        
        const mailtoLink = `mailto:swarnalakshmip4@gmail.com?subject=${subject}&body=${body}`;
        
        // Try to open email client
        const emailWindow = window.open(mailtoLink, '_blank');
        
        // Show success message
        setTimeout(() => {
            showFormStatus('📧 Email client opened! Your message is ready to send. If the email client didn\'t open, please send your message directly to swarnalakshmip4@gmail.com', 'success');
            
            // Reset form and button
            form.reset();
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            
            // Hide status after 8 seconds
            setTimeout(() => {
                hideFormStatus();
            }, 8000);
        }, 1000);
    }
}

function showFormStatus(message, type) {
    const formStatus = document.getElementById('form-status');
    formStatus.innerHTML = message;
    formStatus.className = `form-status ${type} show`;
}

function hideFormStatus() {
    const formStatus = document.getElementById('form-status');
    formStatus.classList.remove('show');
    setTimeout(() => {
        formStatus.className = 'form-status';
    }, 300);
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class=\"fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}\"></i>
        <span>${message}</span>
        <button class=\"notification-close\">&times;</button>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
    
    // Manual close button
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        notification.remove();
    });
    
    closeButton.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: auto;
    `;
}

// ===== PROJECT MODALS =====
function initializeProjectModals() {
    const modal = document.getElementById('project-modal');
    const modalClose = document.querySelector('.modal-close');
    const projectCards = document.querySelectorAll('.project-card');
    
    // Project data (actual project information from resume)
    const projectData = {
        0: {
            title: 'Web-Based Expense Tracker',
            image: 'assets/images/project1.svg',
            description: 'A comprehensive expense tracking application built with HTML, CSS, and JavaScript. Features include expense categorization, data visualization with charts, monthly/yearly reports, budget tracking, and local storage for data persistence. Users can add, edit, and delete expenses with real-time updates.',
            tech: ['HTML5', 'CSS3', 'JavaScript', 'Chart.js', 'Local Storage', 'Responsive Design'],
            liveUrl: '#',
            githubUrl: 'https://github.com/Swarnalakshmi2223'
        },
        1: {
            title: 'Interactive Quiz Website',
            image: 'assets/images/project2.svg',
            description: 'An engaging quiz application built with JavaScript featuring multiple choice questions, timer functionality, score tracking, and real-time feedback. Includes question randomization, progress tracking, result analysis, and responsive design for optimal user experience across devices.',
            tech: ['HTML5', 'CSS3', 'JavaScript', 'Timer API', 'Local Storage', 'Responsive Design'],
            liveUrl: '#',
            githubUrl: 'https://github.com/Swarnalakshmi2223'
        },
        2: {
            title: 'Interactive Digital Portfolio',
            image: 'assets/images/project3.svg',
            description: 'Modern, responsive portfolio website built with HTML5, CSS3, and JavaScript featuring smooth animations, dark mode toggle, contact form validation, and GSAP animations. Showcases full-stack development skills with interactive elements and professional design.',
            tech: ['HTML5', 'CSS3', 'JavaScript', 'GSAP', 'Responsive Design', 'PWA', 'Git'],
            liveUrl: '#',
            githubUrl: 'https://github.com/Swarnalakshmi2223'
        }
    };
    
    // Add click event to project cards
    projectCards.forEach((card, index) => {
        card.addEventListener('click', function() {
            openProjectModal(projectData[index]);
        });
    });
    
    // Close modal events
    modalClose.addEventListener('click', closeProjectModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeProjectModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeProjectModal();
        }
    });
    
    function openProjectModal(project) {
        document.getElementById('modal-title').textContent = project.title;
        document.getElementById('modal-image').src = project.image;
        document.getElementById('modal-description').textContent = project.description;
        document.getElementById('modal-live').href = project.liveUrl;
        document.getElementById('modal-github').href = project.githubUrl;
        
        // Update tech stack
        const techContainer = document.getElementById('modal-tech');
        techContainer.innerHTML = '';
        project.tech.forEach(tech => {
            const techTag = document.createElement('span');
            techTag.className = 'tech-tag';
            techTag.textContent = tech;
            techContainer.appendChild(techTag);
        });
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    function closeProjectModal() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// ===== RESUME DOWNLOAD =====
function initializeResumeDownload() {
    const resumeButton = document.querySelector('a[download]');
    
    if (resumeButton) {
        resumeButton.addEventListener('click', function(e) {
            const resumePath = this.getAttribute('href');
            
            // Check if file exists
            fetch(resumePath, { method: 'HEAD' })
                .then(response => {
                    if (response.ok) {
                        showNotification('📄 Resume download started!', 'success');
                    } else {
                        throw new Error('File not found');
                    }
                })
                .catch(error => {
                    e.preventDefault();
                    showNotification('📄 Resume file is being prepared. Please contact me directly for the latest version.', 'error');
                    
                    // Fallback: Open email
                    setTimeout(() => {
                        const mailtoLink = 'mailto:swarnalakshmip4@gmail.com?subject=Resume%20Request&body=Hi%20Swarnalakshmi,%0A%0APlease%20send%20me%20your%20latest%20resume.%0A%0AThank%20you!';
                        window.open(mailtoLink, '_blank');
                    }, 2000);
                });
        });
    }
}

// ===== SCROLL INDICATOR =====
function initializeScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                smoothScrollTo(aboutSection.offsetTop - 70);
            }
        });
    }
}

// ===== TYPING EFFECT =====
function initializeTypingEffect() {
    const taglineElement = document.querySelector('.hero-tagline');
    const taglines = [
        'Full-Stack Developer & Software Engineer',
        'Django & React.js Developer',
        'JavaScript & Python Enthusiast',
        'Problem Solver & Tech Innovator'
    ];
    
    let currentTaglineIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;
    
    function typeTagline() {
        const currentTagline = taglines[currentTaglineIndex];
        
        if (isDeleting) {
            taglineElement.textContent = currentTagline.substring(0, currentCharIndex - 1);
            currentCharIndex--;
            typeSpeed = 50;
        } else {
            taglineElement.textContent = currentTagline.substring(0, currentCharIndex + 1);
            currentCharIndex++;
            typeSpeed = 100;
        }
        
        if (!isDeleting && currentCharIndex === currentTagline.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && currentCharIndex === 0) {
            isDeleting = false;
            currentTaglineIndex = (currentTaglineIndex + 1) % taglines.length;
            typeSpeed = 500; // Pause before typing next
        }
        
        setTimeout(typeTagline, typeSpeed);
    }
    
    // Start typing effect after initial animation
    setTimeout(typeTagline, 2000);
}

// ===== PARALLAX EFFECTS =====
function initializeParallaxEffects() {
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroBackground = document.querySelector('.hero-background');
        
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
}

// ===== GSAP ANIMATIONS =====
function initializeGSAPAnimations() {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Hero section animations
    const heroTimeline = gsap.timeline();
    heroTimeline
        .from('.hero-greeting', { duration: 1, y: 50, opacity: 0, delay: 0.5 })
        .from('.hero-name', { duration: 1, y: 50, opacity: 0, delay: 0.2 })
        .from('.hero-tagline', { duration: 1, y: 50, opacity: 0, delay: 0.2 })
        .from('.hero-description', { duration: 1, y: 50, opacity: 0, delay: 0.2 })
        .from('.hero-buttons', { duration: 1, y: 50, opacity: 0, delay: 0.2 })
        .from('.hero-scroll', { duration: 1, y: 30, opacity: 0, delay: 0.3 });
    
    // About section animations
    gsap.fromTo('.about-image', 
        { x: -100, opacity: 0 },
        { 
            x: 0, 
            opacity: 1, 
            duration: 1,
            scrollTrigger: {
                trigger: '.about-image',
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            }
        }
    );
    
    gsap.fromTo('.about-text', 
        { x: 100, opacity: 0 },
        { 
            x: 0, 
            opacity: 1, 
            duration: 1,
            delay: 0.3,
            scrollTrigger: {
                trigger: '.about-text',
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            }
        }
    );
    
    // Skills animation
    gsap.fromTo('.skills-category', 
        { y: 50, opacity: 0 },
        { 
            y: 0, 
            opacity: 1, 
            duration: 0.8,
            stagger: 0.2,
            scrollTrigger: {
                trigger: '.skills-content',
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            }
        }
    );
    
    // Experience & Certifications animation
    gsap.fromTo('.timeline-item', 
        { x: -50, opacity: 0 },
        { 
            x: 0, 
            opacity: 1, 
            duration: 0.8,
            stagger: 0.3,
            scrollTrigger: {
                trigger: '.experience-timeline',
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            }
        }
    );
    
    gsap.fromTo('.cert-card', 
        { y: 50, opacity: 0 },
        { 
            y: 0, 
            opacity: 1, 
            duration: 0.8,
            stagger: 0.2,
            scrollTrigger: {
                trigger: '.cert-cards',
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            }
        }
    );
    
    // Projects animation
    gsap.fromTo('.project-card', 
        { y: 50, opacity: 0 },
        { 
            y: 0, 
            opacity: 1, 
            duration: 0.8,
            stagger: 0.2,
            scrollTrigger: {
                trigger: '.projects-grid',
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            }
        }
    );
    
    // Contact section animation
    gsap.fromTo('.contact-info', 
        { x: -50, opacity: 0 },
        { 
            x: 0, 
            opacity: 1, 
            duration: 1,
            scrollTrigger: {
                trigger: '.contact-content',
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            }
        }
    );
    
    gsap.fromTo('.contact-form', 
        { x: 50, opacity: 0 },
        { 
            x: 0, 
            opacity: 1, 
            duration: 1,
            delay: 0.3,
            scrollTrigger: {
                trigger: '.contact-content',
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            }
        }
    );
}

// ===== UTILITY FUNCTIONS =====
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// ===== PERFORMANCE OPTIMIZATIONS =====
// Optimize scroll events
const optimizedScrollHandler = throttle(function() {
    updateActiveNavLink();
}, 100);

window.addEventListener('scroll', optimizedScrollHandler);

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
});

// ===== ADDITIONAL FEATURES =====

// Lazy loading for images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Copy email to clipboard functionality
function initializeEmailCopy() {
    const emailElements = document.querySelectorAll('[data-email]');
    
    emailElements.forEach(element => {
        element.addEventListener('click', function() {
            const email = this.dataset.email;
            navigator.clipboard.writeText(email).then(() => {
                showNotification('Email copied to clipboard!', 'success');
            });
        });
    });
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    initializeLazyLoading();
    initializeEmailCopy();
});

// ===== EXPORT FOR TESTING =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateForm,
        smoothScrollTo,
        showNotification
    };
}
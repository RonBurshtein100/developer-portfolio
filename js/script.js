// Theme Management
class ThemeManager {
    constructor() {
        this.init();
    }

    init() {
        this.setInitialTheme();
        this.bindEvents();
    }

    setInitialTheme() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = savedTheme || (prefersDark ? 'dark' : 'light');
        this.setTheme(theme);
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        
        // Update navbar background immediately after theme change
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            const isDark = newTheme === 'dark';
            if (window.scrollY > 100) {
                if (isDark) {
                    navbar.style.background = 'rgba(15, 23, 42, 0.98)';
                    navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.4)';
                } else {
                    navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                    navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
                }
            } else {
                if (isDark) {
                    navbar.style.background = 'rgba(15, 23, 42, 0.95)';
                } else {
                    navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                }
            }
        }
    }

    bindEvents() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }
}

// Navigation Management
class NavigationManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.handleScroll();
    }

    bindEvents() {
        // Mobile menu toggle
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            // Close mobile menu when clicking on a link
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
        }

        // Smooth scrolling for navigation links
        const links = document.querySelectorAll('.nav-link[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navMenu && hamburger && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    handleScroll() {
        const navbar = document.querySelector('.navbar');
        
        if (navbar) {
            window.addEventListener('scroll', () => {
                const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                if (window.scrollY > 100) {
                    if (isDark) {
                        navbar.style.background = 'rgba(15, 23, 42, 0.98)';
                        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.4)';
                    } else {
                        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
                    }
                } else {
                    if (isDark) {
                        navbar.style.background = 'rgba(15, 23, 42, 0.95)';
                    } else {
                        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                    }
                    navbar.style.boxShadow = 'none';
                }
            });
        }
    }
}

// Animation Management
class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.observeElements();
        this.addParallaxEffect();
    }

    observeElements() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements for fade-in animation (excluding project cards for static design)
        const animatedElements = document.querySelectorAll('.skill-category, .contact-item');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    addParallaxEffect() {
        // Parallax effect disabled for static design
        // Keeping method for potential future use
    }
}

// Form Management
class FormManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindFormSubmit();
        this.addInputValidation();
    }

    bindFormSubmit() {
        const contactForm = document.querySelector('.contact-form-fields');
        
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit(contactForm);
            });
        }
    }

    async handleFormSubmit(form) {
        const formData = new FormData(form);
        const data = {
            from_name: formData.get('from_name'),
            from_email: formData.get('from_email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        try {
            // Check if EmailJS is available and configured
            if (typeof emailjs !== 'undefined' && typeof CONFIG !== 'undefined') {
                // Use configuration from config.js
                const { publicKey, serviceId, autoReplyTemplateId } = CONFIG.emailjs;
                
                // Check if configuration is available
                if (!publicKey || !serviceId || !autoReplyTemplateId) {
                    throw new Error('EmailJS configuration is incomplete in config.js');
                }
                
                // Initialize EmailJS
                emailjs.init(publicKey);
                
                // Send auto-reply to the form submitter
                console.log('Sending auto-reply with:', { serviceId, autoReplyTemplateId, publicKey });
                
                const templateParams = {
                    to_email: data.from_email, // Send TO the person who submitted the form
                    to_name: data.from_name,   // Their name
                    user_name: data.from_name, // For personalization in template
                    user_email: data.from_email,
                    subject: data.subject,
                    message: data.message,
                    reply_to: CONFIG.personal.email // Your email for replies
                };
                
                console.log('Auto-reply template params being sent:', templateParams);
                
                const response = await emailjs.send(
                    serviceId,
                    autoReplyTemplateId,
                    templateParams
                );
                
                console.log('EmailJS Auto-reply Response:', response);
                
                if (response.status === 200) {
                    this.showNotification('Thank you! A confirmation email has been sent to you. 📧', 'success');
                    form.reset();
                } else {
                    console.log('Failed with status:', response.status);
                    throw new Error(`Failed to send auto-reply: ${response.status}`);
                }
            } else {
                // EmailJS not loaded
                this.showNotification('⚠️ EmailJS not loaded. Please check your internet connection.', 'error');
                console.log('Form data:', data); // For testing
            }
        } catch (error) {
            console.error('Form submission error:', error);
            
            if (error.message.includes('not configured')) {
                this.showNotification('⚙️ Setup needed: Please configure EmailJS credentials in the code. Check console for details.', 'info');
                console.log('\n📧 EmailJS Setup Instructions:');
                console.log('1. Sign up at https://www.emailjs.com');
                console.log('2. Connect your Gmail account');
                console.log('3. Create an email template');
                console.log('4. Replace credentials in js/script.js lines 228-230');
                console.log('\nForm data that would be sent:', data);
            } else if (error.status === 422) {
                // 422 Unprocessable Entity - validation error
                this.showNotification(`❌ EmailJS Validation Error: ${error.text || 'Check template configuration'}`, 'error');
                console.log('422 Error Details:', error);
                console.log('This usually means:');
                console.log('1. Template variables don\'t match form field names');
                console.log('2. Required template fields are missing');
                console.log('3. Email service configuration issue');
            } else if (error.text) {
                // EmailJS specific error
                this.showNotification(`❌ EmailJS Error: ${error.text}`, 'error');
                console.log('EmailJS Error Details:', error);
            } else {
                this.showNotification('❌ Failed to send message. Please try again or contact directly.', 'error');
                console.log('General Error:', error);
            }
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    addInputValidation() {
        const inputs = document.querySelectorAll('.form-group input, .form-group textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateInput(input);
            });

            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    this.validateInput(input);
                }
            });
        });
    }

    validateInput(input) {
        const value = input.value.trim();
        const isValid = this.isInputValid(input, value);
        
        input.classList.toggle('error', !isValid);
        
        // Remove existing error message
        const existingError = input.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        if (!isValid) {
            const errorMessage = this.getErrorMessage(input);
            const errorElement = document.createElement('span');
            errorElement.className = 'error-message';
            errorElement.textContent = errorMessage;
            errorElement.style.color = 'var(--primary-color)';
            errorElement.style.fontSize = '0.875rem';
            errorElement.style.marginTop = '0.5rem';
            errorElement.style.display = 'block';
            input.parentNode.appendChild(errorElement);
        }
    }

    isInputValid(input, value) {
        if (input.hasAttribute('required') && !value) {
            return false;
        }

        if (input.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(value);
        }

        return true;
    }

    getErrorMessage(input) {
        if (input.hasAttribute('required') && !input.value.trim()) {
            return 'This field is required';
        }

        if (input.type === 'email' && input.value.trim()) {
            return 'Please enter a valid email address';
        }

        return 'Please check this field';
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        `;

        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '2rem',
            right: '2rem',
            background: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            zIndex: '9999',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
}

// Utility Functions
class Utils {
    static debounce(func, wait) {
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

    static throttle(func, limit) {
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

    static isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
}

// CI/CD Pipeline Simulation
class PipelineManager {
    constructor() {
        this.stages = [
            'commit', 'build', 'unit-tests', 'package', 
            'e2e-tests', 'publish', 'deploy'
        ];
        this.isRunning = false;
        this.init();
    }

    init() {
        this.resetPipeline();
        this.bindEvents();
    }

    bindEvents() {
        // Enhanced hover effects for stage cards (CSS handles basic hover)
        const stageCards = document.querySelectorAll('.stage-card');
        stageCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                // CSS handles the transform, just ensure no conflicts
                card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            });
            
            card.addEventListener('mouseleave', () => {
                // Let CSS handle the reset
                card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            });
        });
    }

    async simulatePipeline() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        const runBtn = document.querySelector('.run-btn');
        
        // Update button state
        if (runBtn) {
            runBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Running...</span>';
            runBtn.disabled = true;
        }

        // Reset all stages
        this.resetPipeline();

        // Run through each stage
        for (let i = 0; i < this.stages.length; i++) {
            const stage = this.stages[i];
            await this.runStage(stage, i);
        }

        // Reset button
        if (runBtn) {
            runBtn.innerHTML = '<i class="fas fa-play"></i> <span>Run Demo</span>';
            runBtn.disabled = false;
        }
        
        this.isRunning = false;
        
        // Show completion notification
        const formManager = new FormManager();
        formManager.showNotification('Pipeline completed successfully! 🚀', 'success');
    }

    async runStage(stageName, index) {
        const stageElement = document.querySelector(`[data-stage="${stageName}"]`);
        const statusElement = stageElement?.querySelector('.stage-status');
        
        if (!statusElement) return;

        // Set running status
        this.setStageStatus(statusElement, 'running');
        
        // Add running animation to stage card
        const stageCard = stageElement.querySelector('.stage-card');
        if (stageCard) {
            stageCard.style.borderColor = '#3b82f6';
            stageCard.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.3)';
            stageCard.style.transform = 'scale(1.05)';
        }

        // Simulate stage duration (1-3 seconds)
        const duration = Math.random() * 2000 + 1000;
        await this.delay(duration);

        // Random success/failure (95% success rate)
        const isSuccess = Math.random() > 0.05;
        
        if (isSuccess) {
            this.setStageStatus(statusElement, 'success');
            if (stageCard) {
                stageCard.style.borderColor = '#10b981';
                stageCard.style.boxShadow = '0 0 25px rgba(16, 185, 129, 0.4)';
                stageCard.style.transform = 'scale(1.1)';
            }
        } else {
            this.setStageStatus(statusElement, 'failed');
            if (stageCard) {
                stageCard.style.borderColor = '#ef4444';
                stageCard.style.boxShadow = '0 0 25px rgba(239, 68, 68, 0.4)';
                stageCard.style.transform = 'scale(1.05)';
            }
            // Stop pipeline on failure
            throw new Error(`Stage ${stageName} failed`);
        }

        // Reset stage card styling after a short delay
        setTimeout(() => {
            if (stageCard) {
                stageCard.style.borderColor = '';
                stageCard.style.boxShadow = '';
                stageCard.style.transform = '';
            }
        }, 1500);
    }

    setStageStatus(statusElement, status) {
        statusElement.setAttribute('data-status', status);
        
        const iconMap = {
            pending: 'fas fa-clock',
            running: 'fas fa-spinner',
            success: 'fas fa-check-circle',
            failed: 'fas fa-times-circle'
        };
        
        const icon = statusElement.querySelector('i');
        if (icon) {
            icon.className = iconMap[status];
        }
    }

    resetPipeline() {
        this.stages.forEach(stageName => {
            const stageElement = document.querySelector(`[data-stage="${stageName}"]`);
            const statusElement = stageElement?.querySelector('.stage-status');
            
            if (statusElement) {
                this.setStageStatus(statusElement, 'pending');
            }
        });
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Global function for the button onclick
function simulatePipeline() {
    if (window.pipelineManager) {
        window.pipelineManager.simulatePipeline().catch(error => {
            console.log('Pipeline failed:', error.message);
            const formManager = new FormManager();
            formManager.showNotification('Pipeline failed! Check the logs.', 'error');
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all managers
    new ThemeManager();
    new NavigationManager();
    new AnimationManager();
    new FormManager();
    
    // Initialize pipeline manager
    window.pipelineManager = new PipelineManager();

    // Add loading animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);

    // Add keyboard navigation support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close mobile menu if open
            const hamburger = document.querySelector('.hamburger.active');
            const navMenu = document.querySelector('.nav-menu.active');
            
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        }
    });

    // Add performance optimization for animations
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        document.documentElement.style.setProperty('--animation-duration', '0.01ms');
    }

    prefersReducedMotion.addListener((mediaQuery) => {
        if (mediaQuery.matches) {
            document.documentElement.style.setProperty('--animation-duration', '0.01ms');
        } else {
            document.documentElement.style.removeProperty('--animation-duration');
        }
    });

    console.log('🎉 Portfolio loaded successfully!');
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is not visible
        document.documentElement.style.setProperty('--animation-play-state', 'paused');
    } else {
        // Resume animations when page becomes visible
        document.documentElement.style.setProperty('--animation-play-state', 'running');
    }
});

// Add smooth scroll polyfill for older browsers
if (!('scrollBehavior' in document.documentElement.style)) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/cferdinandi/smooth-scroll@15.0.0/dist/smooth-scroll.polyfills.min.js';
    document.head.appendChild(script);
}

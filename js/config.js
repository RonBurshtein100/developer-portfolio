/**
 * Portfolio Configuration
 * Centralized configuration following JavaScript best practices
 */

const CONFIG = {
    // EmailJS Configuration
    emailjs: {
        publicKey: 'MZy8RZyd2xvnZbcoC',
        serviceId: 'service_qqftnl2',
        // Template that sends auto-reply to the form submitter
        autoReplyTemplateId: 'template_vxh1c74'
    },

    // Personal Information
    personal: {
        name: 'Ron Burshtein',
        email: 'ronbur10@gmail.com',
        title: 'DevOps Engineer • AI Enthusiast • Cloud Solutions Architect',
        location: 'Israel',
        description: 'Passionate about building scalable infrastructure and automating deployment pipelines. I specialize in cloud architecture, containerization, and CI/CD while bridging the gap between development and operations.'
    },

    // Social Links
    social: {
        github: 'https://github.com/RonBurshtein100',
        linkedin: 'https://linkedin.com/in/ron-burshtein',
        email: 'ronbur10@gmail.com'
    },

    // Project Information
    projects: {
        faceRecognition: {
            title: 'Face Recognition App',
            github: 'https://github.com/RonBurshtein100/face-recognition',
            category: 'Computer Vision',
            description: 'A real-time facial recognition system using OpenCV and dlib with high accuracy and performance optimization.',
            technologies: ['Python', 'OpenCV', 'dlib', 'NumPy']
        }
    },

    // Contact Form Settings
    contact: {
        responseTime: '24 hours',
        emailService: 'EmailJS',
        supportedFormats: ['text', 'email']
    },

    // Application Settings
    app: {
        name: 'Ron Burshtein Portfolio',
        version: '1.0.0',
        environment: 'production',
        analytics: {
            enabled: false // Set to true if using analytics
        }
    },

    // Theme Configuration
    theme: {
        defaultTheme: 'light',
        animations: {
            enabled: true,
            duration: '0.3s'
        }
    }
};

// Freeze the configuration to prevent modifications
Object.freeze(CONFIG.emailjs);
Object.freeze(CONFIG.personal);
Object.freeze(CONFIG.social);
Object.freeze(CONFIG.projects);
Object.freeze(CONFIG.contact);
Object.freeze(CONFIG.app);
Object.freeze(CONFIG.theme);
Object.freeze(CONFIG);

// Export configuration
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}

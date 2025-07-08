// ========================================
// CONFIGURACIÓN DE SERVICIOS GRATUITOS
// ========================================

// 🔧 CONFIGURACIÓN PRINCIPAL
const CONFIG = {
    // Tu información de contacto
    business: {
        name: "DanySetas",
        phone: "+54 11 1234-5678", // Cambiar por tu número real
        whatsapp: "5491123456789", // Cambiar por tu número de WhatsApp (sin + ni espacios)
        email: "info@danysetas.com", // Cambiar por tu email real
        address: "Av. Corrientes 1234, Buenos Aires, Argentina"
    },
    
    // 📧 EMAILJS (Servicio gratuito de emails)
    // Regístrate en: https://www.emailjs.com/
    emailjs: {
        serviceId: "service_tu_id",      // Reemplazar con tu Service ID
        templateId: "template_tu_id",    // Reemplazar con tu Template ID
        publicKey: "tu_public_key"       // Reemplazar con tu Public Key
    },
    
    // 📝 FORMSPREE (Formularios gratuitos)
    // Regístrate en: https://formspree.io/
    formspree: {
        contactForm: "https://formspree.io/f/tu_form_id", // Reemplazar con tu endpoint
        newsletter: "https://formspree.io/f/tu_newsletter_id" // Reemplazar con tu endpoint
    },
    
    // 💬 WHATSAPP BUSINESS (Gratis)
    whatsapp: {
        enabled: true,
        defaultMessage: "¡Hola! Estoy interesado en una camiseta de DanySetas. ¿Podrías ayudarme?"
    },
    
    // 📊 GOOGLE ANALYTICS (Gratis)
    // Regístrate en: https://analytics.google.com/
    analytics: {
        trackingId: "G-TU_TRACKING_ID" // Reemplazar con tu Tracking ID
    },
    
    // 🎨 CONFIGURACIÓN DE NOTIFICACIONES
    notifications: {
        duration: 3000, // 3 segundos
        position: "top-right"
    }
};

// ========================================
// FUNCIONES AUXILIARES
// ========================================

// Función para generar enlaces de WhatsApp
function generateWhatsAppLink(product = "", message = "") {
    const baseMessage = message || CONFIG.whatsapp.defaultMessage;
    const fullMessage = product ? 
        `${baseMessage}\n\nProducto: ${product}` : 
        baseMessage;
    
    return `https://wa.me/${CONFIG.business.whatsapp}?text=${encodeURIComponent(fullMessage)}`;
}

// Función para validar configuración
function validateConfig() {
    const errors = [];
    
    if (!CONFIG.business.whatsapp || CONFIG.business.whatsapp === "5491123456789") {
        errors.push("⚠️ Configurar número de WhatsApp en config.js");
    }
    
    if (!CONFIG.business.email || CONFIG.business.email === "info@danysetas.com") {
        errors.push("⚠️ Configurar email real en config.js");
    }
    
    if (CONFIG.emailjs.serviceId === "service_tu_id") {
        errors.push("⚠️ Configurar EmailJS en config.js");
    }
    
    if (errors.length > 0) {
        console.warn("🔧 Configuración pendiente:", errors);
    }
    
    return errors.length === 0;
}

// Exportar configuración
window.CONFIG = CONFIG;
window.generateWhatsAppLink = generateWhatsAppLink;
window.validateConfig = validateConfig;
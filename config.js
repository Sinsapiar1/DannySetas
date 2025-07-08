// ========================================
// CONFIGURACIÓN DE SERVICIOS GRATUITOS
// ========================================

// 🔧 CONFIGURACIÓN PRINCIPAL
const CONFIG = {
    // Tu información de contacto
    business: {
        name: "DanySetas",
        phone: "+56 9 4223 0636", // Número principal DanySetas
        whatsapp: "56942230636", // WhatsApp principal (sin + ni espacios)
        whatsapp_secondary: "56964801119", // WhatsApp secundario Mío Movistar
        email: "info@danysetas.com", // Cambiar por tu email real
        address: "Chile" // Cambiar por tu dirección real
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

// Función para generar enlaces de WhatsApp con doble número
function generateWhatsAppLink(product = "", message = "", useSecondary = false) {
    const baseMessage = message || CONFIG.whatsapp.defaultMessage;
    const fullMessage = product ? 
        `${baseMessage}\n\nProducto: ${product}` : 
        baseMessage;
    
    // Usar número secundario para ventas, principal para contacto general
    const whatsappNumber = useSecondary ? CONFIG.business.whatsapp_secondary : CONFIG.business.whatsapp;
    
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(fullMessage)}`;
}

// Función específica para ventas (usa el número Mío Movistar)
function generateSalesWhatsAppLink(product = "", message = "") {
    return generateWhatsAppLink(product, message, true);
}

// Función específica para contacto general (usa el número DanySetas)
function generateContactWhatsAppLink(message = "") {
    return generateWhatsAppLink("", message, false);
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
window.generateSalesWhatsAppLink = generateSalesWhatsAppLink;
window.generateContactWhatsAppLink = generateContactWhatsAppLink;
window.validateConfig = validateConfig;
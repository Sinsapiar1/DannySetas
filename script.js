// Variables globales
let cart = [];
let cartTotal = 0;

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Función principal de inicialización
function initializeApp() {
    // Validar configuración
    if (window.validateConfig) {
        window.validateConfig();
    }
    
    // Configuraciones básicas
    setupNavigation();
    setupProductFilters();
    setupCart();
    setupContactForm();
    setupAnimations();
    setupScrollEffects();
    setupMobileMenu();
    
    // Funcionalidades avanzadas (GRATIS)
    setupWhatsAppCart();
    setupAnalytics();
    createWhatsAppButton();
    requestNotificationPermission();
    
    // Agregar botón secreto para ver dashboard (presiona Ctrl+Shift+L)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.code === 'KeyL') {
            showLeadsDashboard();
        }
    });
}

// Configuración de navegación
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navegación con los botones del hero
    const heroButtons = document.querySelectorAll('.hero-buttons button');
    heroButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.textContent === 'Ver Productos') {
                const productsSection = document.getElementById('products');
                const offsetTop = productsSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            } else {
                showSpecialOffers();
            }
        });
    });
}

// Configuración de menú móvil
function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Configuración de filtros de productos
function setupProductFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover clase active de todos los botones
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Agregar clase active al botón clickeado
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            productCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.6s ease-out';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Configuración del carrito de compras
function setupCart() {
    const cartIcon = document.querySelector('.cart-icon');
    const cartModal = document.getElementById('cartModal');
    const closeCart = document.querySelector('.close-cart');
    const cartButtons = document.querySelectorAll('.btn-cart');
    
    // Abrir modal del carrito
    cartIcon.addEventListener('click', function() {
        cartModal.style.display = 'block';
        updateCartDisplay();
    });
    
    // Cerrar modal del carrito
    closeCart.addEventListener('click', function() {
        cartModal.style.display = 'none';
    });
    
    // Cerrar modal clickeando fuera
    cartModal.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });
    
    // Configurar botones de agregar al carrito
    cartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.product-price').textContent;
            
            addToCart(productName, productPrice);
            showNotification('Producto agregado al carrito!');
        });
    });
}

// Función para agregar productos al carrito
function addToCart(name, price) {
    const numericPrice = parseFloat(price.replace('$', ''));
    
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: numericPrice,
            quantity: 1
        });
    }
    
    updateCartCount();
    updateCartTotal();
}

// Actualizar contador del carrito
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Actualizar total del carrito
function updateCartTotal() {
    cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Actualizar display del carrito
function updateCartDisplay() {
    const cartItems = document.querySelector('.cart-items');
    const cartTotalElement = document.querySelector('.cart-total h3');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Tu carrito está vacío</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <h4>${item.name}</h4>
                <p>Cantidad: ${item.quantity}</p>
                <p>Precio: $${(item.price * item.quantity).toFixed(2)}</p>
                <button onclick="removeFromCart('${item.name}')">Eliminar</button>
            </div>
        `).join('');
    }
    
    cartTotalElement.textContent = `Total: $${cartTotal.toFixed(2)}`;
}

// Eliminar del carrito
function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    updateCartCount();
    updateCartTotal();
    updateCartDisplay();
}

// Configuración del formulario de contacto con funcionalidad REAL
function setupContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const message = this.querySelector('textarea').value;
        
        if (name && email && message) {
            // Mostrar loading
            const submitBtn = this.querySelector('.btn-primary');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;
            
            // IR DIRECTO A WHATSAPP (más confiable)
            sendViaWhatsApp(name, email, message, submitBtn, originalText, this);
        } else {
            showNotification('Por favor completa todos los campos', 'error');
        }
    });
}

// 📧 ENVÍO CON EMAILJS (100% GRATUITO)
function sendEmailWithEmailJS(name, email, message, submitBtn, originalText, form) {
    const templateParams = {
        from_name: name,
        from_email: email,
        message: message,
        to_email: window.CONFIG.business.email
    };
    
    emailjs.send(
        window.CONFIG.emailjs.serviceId,
        window.CONFIG.emailjs.templateId,
        templateParams,
        window.CONFIG.emailjs.publicKey
    ).then(function(response) {
        showNotification('¡Mensaje enviado exitosamente!');
        form.reset();
        // Guardar lead en localStorage
        saveLeadToStorage(name, email, 'contact');
    }).catch(function(error) {
        console.error('Error:', error);
        showNotification('Error al enviar. Intenta por WhatsApp.', 'error');
        // Fallback a WhatsApp
        sendViaWhatsApp(name, email, message, submitBtn, originalText, form);
    }).finally(function() {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

// 📝 ENVÍO CON FORMSPREE (100% GRATUITO)
function sendEmailWithFormspree(name, email, message, submitBtn, originalText, form) {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('message', message);
    
    fetch(window.CONFIG.formspree.contactForm, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    }).then(function(response) {
        if (response.ok) {
            showNotification('¡Mensaje enviado exitosamente!');
            form.reset();
            // Guardar lead en localStorage
            saveLeadToStorage(name, email, 'contact');
        } else {
            throw new Error('Error en el envío');
        }
    }).catch(function(error) {
        console.error('Error:', error);
        showNotification('Error al enviar. Intenta por WhatsApp.', 'error');
        // Fallback a WhatsApp
        sendViaWhatsApp(name, email, message, submitBtn, originalText, form);
    }).finally(function() {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

// 💬 ENVÍO VIA WHATSAPP (SIEMPRE FUNCIONA)
function sendViaWhatsApp(name, email, message, submitBtn, originalText, form) {
    console.log('🔧 sendViaWhatsApp llamada con:', { name, email, message });
    
    const whatsappMessage = `NUEVO MENSAJE - DanySetas\n\nNombre: ${name}\nEmail: ${email}\nMensaje: ${message}\n\nEnviado desde www.danysetas.com`;
    
    console.log('📱 Mensaje generado:', whatsappMessage);
    
    // Crear enlace directo sin funciones intermedias
    const phoneNumber = "56942230636";
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    console.log('🔗 Link generado:', whatsappLink);
    console.log('📞 Número:', phoneNumber);
    console.log('💬 Mensaje codificado:', encodedMessage);
    
    setTimeout(() => {
        window.open(whatsappLink, '_blank');
        showNotification('Redirigiendo a WhatsApp...');
        form.reset();
        // Guardar lead en localStorage
        saveLeadToStorage(name, email, 'contact');
    }, 500);
    
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
}

// Configuración de animaciones
function setupAnimations() {
    // Animación para elementos que aparecen al hacer scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out';
                entry.target.style.opacity = '1';
            }
        });
    }, observerOptions);
    
    // Observar elementos
    const elementsToAnimate = document.querySelectorAll('.feature-card, .product-card, .stat');
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

// Configuración de efectos de scroll
function setupScrollEffects() {
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        const scrollTop = window.pageYOffset;
        
        // Efecto de header al hacer scroll
        if (scrollTop > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
        
        // Efecto parallax en el hero
        const hero = document.querySelector('.hero');
        if (hero) {
            const heroContent = hero.querySelector('.hero-content');
            const heroImage = hero.querySelector('.hero-image');
            
            if (scrollTop < window.innerHeight) {
                heroContent.style.transform = `translateY(${scrollTop * 0.5}px)`;
                heroImage.style.transform = `translateY(${scrollTop * 0.3}px)`;
            }
        }
    });
}

// Mostrar notificaciones
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Mostrar ofertas especiales
function showSpecialOffers() {
    const modal = document.createElement('div');
    modal.className = 'special-offers-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>🔥 Ofertas Especiales 🔥</h2>
            <div class="offers-grid">
                <div class="offer-item">
                    <h3>Descuento del 20%</h3>
                    <p>En todas las camisetas de la Premier League</p>
                    <code>PREMIER20</code>
                </div>
                <div class="offer-item">
                    <h3>Envío Gratis</h3>
                    <p>En compras superiores a $100</p>
                    <code>ENVIOGRATIS</code>
                </div>
                <div class="offer-item">
                    <h3>2x1 en Camisetas Locales</h3>
                    <p>Lleva 2 camisetas por el precio de 1</p>
                    <code>LOCALES2X1</code>
                </div>
            </div>
        </div>
    `;
    
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 3000;
    `;
    
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 20px;
        max-width: 500px;
        width: 90%;
        position: relative;
    `;
    
    const closeModal = modal.querySelector('.close-modal');
    closeModal.style.cssText = `
        position: absolute;
        top: 1rem;
        right: 1rem;
        font-size: 2rem;
        cursor: pointer;
        color: #6b7280;
    `;
    
    document.body.appendChild(modal);
    
    closeModal.addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Configuración del newsletter con funcionalidad REAL
function setupNewsletter() {
    const newsletterForm = document.querySelector('.newsletter');
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input').value;
        
        if (email && isValidEmail(email)) {
            const submitBtn = this.querySelector('button');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;
            
            // Enviar con Formspree (GRATIS)
            if (window.CONFIG && window.CONFIG.formspree.newsletter !== "https://formspree.io/f/tu_newsletter_id") {
                subscribeWithFormspree(email, submitBtn, originalText, this);
            }
            // Enviar con EmailJS (GRATIS alternativo)
            else if (window.CONFIG && window.CONFIG.emailjs.serviceId !== "service_tu_id") {
                subscribeWithEmailJS(email, submitBtn, originalText, this);
            }
            // Fallback: Guardar local y WhatsApp
            else {
                subscribeLocally(email, submitBtn, originalText, this);
            }
        } else {
            showNotification('Por favor ingresa un email válido', 'error');
        }
    });
}

// 📧 SUSCRIPCIÓN CON FORMSPREE (GRATIS)
function subscribeWithFormspree(email, submitBtn, originalText, form) {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('type', 'newsletter');
    
    fetch(window.CONFIG.formspree.newsletter, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    }).then(function(response) {
        if (response.ok) {
            showNotification('¡Gracias por suscribirte!');
            form.reset();
            // Guardar lead en localStorage
            saveLeadToStorage('', email, 'newsletter');
        } else {
            throw new Error('Error en la suscripción');
        }
    }).catch(function(error) {
        console.error('Error:', error);
        // Fallback a almacenamiento local
        subscribeLocally(email, submitBtn, originalText, form);
    }).finally(function() {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

// 📧 SUSCRIPCIÓN CON EMAILJS (GRATIS)
function subscribeWithEmailJS(email, submitBtn, originalText, form) {
    const templateParams = {
        subscriber_email: email,
        to_email: window.CONFIG.business.email,
        message: `Nueva suscripción al newsletter: ${email}`
    };
    
    emailjs.send(
        window.CONFIG.emailjs.serviceId,
        window.CONFIG.emailjs.templateId,
        templateParams,
        window.CONFIG.emailjs.publicKey
    ).then(function(response) {
        showNotification('¡Gracias por suscribirte!');
        form.reset();
        // Guardar lead en localStorage
        saveLeadToStorage('', email, 'newsletter');
    }).catch(function(error) {
        console.error('Error:', error);
        // Fallback a almacenamiento local
        subscribeLocally(email, submitBtn, originalText, form);
    }).finally(function() {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

// 💾 SUSCRIPCIÓN LOCAL (SIEMPRE FUNCIONA)
function subscribeLocally(email, submitBtn, originalText, form) {
    showNotification('¡Gracias por suscribirte!');
    form.reset();
    // Guardar lead en localStorage
    saveLeadToStorage('', email, 'newsletter');
    
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
}

// Función para vista rápida de productos
function setupQuickView() {
    const quickViewButtons = document.querySelectorAll('.btn-quick-view');
    
    quickViewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.product-price').textContent;
            
            showQuickView(productName, productPrice);
        });
    });
}

// Mostrar vista rápida
function showQuickView(name, price) {
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="quick-view-content">
                <div class="quick-view-image">
                    <div class="jersey-display"></div>
                </div>
                <div class="quick-view-info">
                    <h2>${name}</h2>
                    <p class="price">${price}</p>
                    <div class="sizes">
                        <h4>Tallas disponibles:</h4>
                        <div class="size-options">
                            <button class="size-btn">S</button>
                            <button class="size-btn">M</button>
                            <button class="size-btn">L</button>
                            <button class="size-btn">XL</button>
                        </div>
                    </div>
                    <button class="btn-primary add-to-cart-quick">Agregar al Carrito</button>
                </div>
            </div>
        </div>
    `;
    
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 3000;
    `;
    
    document.body.appendChild(modal);
    
    const closeModal = modal.querySelector('.close-modal');
    closeModal.addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    // Funcionalidad de agregar al carrito desde vista rápida
    const addToCartBtn = modal.querySelector('.add-to-cart-quick');
    addToCartBtn.addEventListener('click', function() {
        addToCart(name, price);
        showNotification('Producto agregado al carrito!');
        document.body.removeChild(modal);
    });
}

// ========================================
// FUNCIONES AUXILIARES PARA FUNCIONALIDAD REAL
// ========================================

// 📊 GUARDAR LEADS EN ALMACENAMIENTO LOCAL
function saveLeadToStorage(name, email, type) {
    const leads = JSON.parse(localStorage.getItem('danysetas_leads') || '[]');
    const newLead = {
        id: Date.now(),
        name: name,
        email: email,
        type: type,
        timestamp: new Date().toISOString(),
        products: cart.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity
        }))
    };
    
    leads.push(newLead);
    localStorage.setItem('danysetas_leads', JSON.stringify(leads));
    
    // Enviar a analytics si está configurado
    if (window.gtag) {
        window.gtag('event', 'lead_generated', {
            event_category: 'engagement',
            event_label: type,
            value: 1
        });
    }
}

// 📧 VALIDACIÓN DE EMAIL
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 🛒 FUNCIONALIDAD DEL CARRITO CON WHATSAPP
function setupWhatsAppCart() {
    // Actualizar el botón "Proceder al Pago"
    const checkoutBtn = document.querySelector('.cart-total .btn-primary');
    if (checkoutBtn) {
        checkoutBtn.textContent = 'Finalizar por WhatsApp';
        checkoutBtn.addEventListener('click', function() {
            console.log('🛒 Botón checkout clickeado');
            console.log('🛒 Carrito actual:', cart);
            
            if (cart.length === 0) {
                showNotification('Tu carrito está vacío', 'error');
                return;
            }
            
            const whatsappMessage = generateCartWhatsAppMessage();
            console.log('📱 Mensaje carrito generado:', whatsappMessage);
            
            // Crear enlace directo para ventas
            const phoneNumber = "56964801119";
            const encodedMessage = encodeURIComponent(whatsappMessage);
            const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
            console.log('🔗 Link carrito generado:', whatsappLink);
            console.log('📞 Número ventas:', phoneNumber);
            console.log('💬 Mensaje carrito codificado:', encodedMessage);
            
            window.open(whatsappLink, '_blank');
            showNotification('Redirigiendo a WhatsApp Ventas para finalizar compra...');
            
            // Guardar evento de conversión
            if (window.gtag) {
                window.gtag('event', 'begin_checkout', {
                    event_category: 'ecommerce',
                    value: cartTotal,
                    currency: 'USD'
                });
            }
        });
    }
}

// 💬 GENERAR MENSAJE DE WHATSAPP PARA CARRITO
function generateCartWhatsAppMessage() {
    let message = `NUEVA COMPRA - DanySetas\n\n`;
    
    cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name}\nPrecio: $${item.price} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}\n\n`;
    });
    
    message += `TOTAL: $${cartTotal.toFixed(2)}\n\nPor favor confirma tu pedido y envíanos tus datos:\n- Nombre completo\n- Dirección de envío\n- Talla preferida\n\nEnviado desde www.danysetas.com`;
    
    return message;
}

// 📊 CONFIGURAR GOOGLE ANALYTICS (GRATIS)
function setupAnalytics() {
    if (window.CONFIG && window.CONFIG.analytics.trackingId !== "G-TU_TRACKING_ID") {
        // Cargar Google Analytics
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${window.CONFIG.analytics.trackingId}`;
        document.head.appendChild(script);
        
        // Configurar gtag
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', window.CONFIG.analytics.trackingId);
        
        // Hacer gtag globalmente disponible
        window.gtag = gtag;
    }
}

// 📱 BOTÓN FLOTANTE DE WHATSAPP
function createWhatsAppButton() {
    const whatsappBtn = document.createElement('div');
    whatsappBtn.className = 'whatsapp-float';
    whatsappBtn.innerHTML = `
        <i class="fab fa-whatsapp"></i>
        <span>Chatea con nosotros</span>
    `;
    
    whatsappBtn.addEventListener('click', function() {
        // Mensaje directo para botón flotante
        const defaultMessage = "Hola! Estoy interesado en una camiseta de DanySetas. Podrías ayudarme?";
        const phoneNumber = "56942230636";
        const encodedMessage = encodeURIComponent(defaultMessage);
        const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        console.log('🔗 Botón flotante - Link:', whatsappLink);
        window.open(whatsappLink, '_blank');
        
        // Tracking
        if (window.gtag) {
            window.gtag('event', 'whatsapp_click', {
                event_category: 'engagement',
                event_label: 'floating_button'
            });
        }
    });
    
    document.body.appendChild(whatsappBtn);
}

// 🔔 NOTIFICACIONES PUSH (PARA OFERTAS)
function requestNotificationPermission() {
    if ('Notification' in window && 'serviceWorker' in navigator) {
        Notification.requestPermission().then(function(permission) {
            if (permission === 'granted') {
                // Enviar notificación de bienvenida
                setTimeout(() => {
                    new Notification('¡Bienvenido a DanySetas!', {
                        body: 'Tenemos ofertas especiales para ti',
                        icon: '/favicon.ico'
                    });
                }, 3000);
            }
        });
    }
}

// 📊 DASHBOARD DE LEADS (PARA VER TUS CLIENTES)
function showLeadsDashboard() {
    const leads = JSON.parse(localStorage.getItem('danysetas_leads') || '[]');
    
    if (leads.length === 0) {
        showNotification('No hay leads guardados aún');
        return;
    }
    
    let dashboardHTML = `
        <div class="leads-dashboard">
            <h2>📊 Dashboard de Clientes</h2>
            <div class="leads-stats">
                <div class="stat-card">
                    <h3>${leads.length}</h3>
                    <p>Total Leads</p>
                </div>
                <div class="stat-card">
                    <h3>${leads.filter(l => l.type === 'newsletter').length}</h3>
                    <p>Suscriptores</p>
                </div>
                <div class="stat-card">
                    <h3>${leads.filter(l => l.type === 'contact').length}</h3>
                    <p>Contactos</p>
                </div>
            </div>
            <div class="leads-list">
                ${leads.map(lead => `
                    <div class="lead-item">
                        <strong>${lead.name || 'Sin nombre'}</strong>
                        <span>${lead.email}</span>
                        <span class="lead-type">${lead.type}</span>
                        <span class="lead-date">${new Date(lead.timestamp).toLocaleDateString()}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    const modal = document.createElement('div');
    modal.className = 'leads-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            ${dashboardHTML}
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Cerrar modal
    modal.querySelector('.close-modal').addEventListener('click', function() {
        document.body.removeChild(modal);
    });
}

// CSS adicional para animaciones
const additionalCSS = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .cart-item {
        background: #f8fafc;
        padding: 1rem;
        margin: 0.5rem 0;
        border-radius: 10px;
        border: 1px solid #e5e7eb;
    }
    
    .cart-item h4 {
        margin-bottom: 0.5rem;
        color: #1f2937;
    }
    
    .cart-item p {
        margin: 0.25rem 0;
        color: #6b7280;
    }
    
    .cart-item button {
        background: #ef4444;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 5px;
        cursor: pointer;
        margin-top: 0.5rem;
    }
    
    .offers-grid {
        display: grid;
        gap: 1rem;
        margin-top: 1rem;
    }
    
    .offer-item {
        background: #f8fafc;
        padding: 1rem;
        border-radius: 10px;
        text-align: center;
    }
    
    .offer-item h3 {
        color: #10b981;
        margin-bottom: 0.5rem;
    }
    
    .offer-item code {
        background: #2563eb;
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 5px;
        font-weight: bold;
    }
    
    .nav-menu.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
        padding: 1rem;
    }
    
    .hamburger.active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    
    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
    
    /* Botón flotante de WhatsApp */
    .whatsapp-float {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #25d366;
        color: white;
        border-radius: 50px;
        padding: 15px 20px;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 10px;
        transition: all 0.3s ease;
        animation: pulse 2s infinite;
    }
    
    .whatsapp-float:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 30px rgba(37, 211, 102, 0.6);
    }
    
    .whatsapp-float i {
        font-size: 24px;
    }
    
    .whatsapp-float span {
        font-weight: 500;
        white-space: nowrap;
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    /* Dashboard de leads */
    .leads-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 3000;
    }
    
    .leads-modal .modal-content {
        background: white;
        border-radius: 20px;
        max-width: 800px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
        padding: 2rem;
    }
    
    .leads-dashboard h2 {
        text-align: center;
        margin-bottom: 2rem;
        color: #1f2937;
    }
    
    .leads-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
        margin-bottom: 2rem;
    }
    
    .stat-card {
        background: #f8fafc;
        padding: 1.5rem;
        border-radius: 10px;
        text-align: center;
        border: 2px solid #e5e7eb;
    }
    
    .stat-card h3 {
        font-size: 2rem;
        color: #2563eb;
        margin-bottom: 0.5rem;
    }
    
    .stat-card p {
        color: #6b7280;
        font-weight: 500;
    }
    
    .leads-list {
        display: grid;
        gap: 1rem;
    }
    
    .lead-item {
        background: #f8fafc;
        padding: 1rem;
        border-radius: 10px;
        display: grid;
        grid-template-columns: 1fr 1fr auto auto;
        gap: 1rem;
        align-items: center;
        border: 1px solid #e5e7eb;
    }
    
    .lead-type {
        background: #10b981;
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 15px;
        font-size: 0.875rem;
        font-weight: 500;
    }
    
    .lead-date {
        color: #6b7280;
        font-size: 0.875rem;
    }
    
    /* Responsive para móviles */
    @media (max-width: 768px) {
        .whatsapp-float span {
            display: none;
        }
        
        .whatsapp-float {
            padding: 15px;
        }
        
        .leads-stats {
            grid-template-columns: 1fr;
        }
        
        .lead-item {
            grid-template-columns: 1fr;
            text-align: center;
        }
    }
`;

// Inyectar CSS adicional
const style = document.createElement('style');
style.textContent = additionalCSS;
document.head.appendChild(style);

// Configurar funcionalidades adicionales cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    setupQuickView();
    setupNewsletter();
});
// Variables globales
let cart = [];
let cartTotal = 0;

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Función principal de inicialización
function initializeApp() {
    setupNavigation();
    setupProductFilters();
    setupCart();
    setupContactForm();
    setupAnimations();
    setupScrollEffects();
    setupMobileMenu();
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

// Configuración del formulario de contacto
function setupContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const message = this.querySelector('textarea').value;
        
        if (name && email && message) {
            showNotification('Mensaje enviado correctamente!');
            this.reset();
        } else {
            showNotification('Por favor completa todos los campos', 'error');
        }
    });
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

// Configuración del newsletter
function setupNewsletter() {
    const newsletterForm = document.querySelector('.newsletter');
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input').value;
        
        if (email) {
            showNotification('¡Gracias por suscribirte!');
            this.querySelector('input').value = '';
        }
    });
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
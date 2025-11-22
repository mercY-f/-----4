// JavaScript для страницы корзины
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, что мы на странице корзины
    if (document.querySelector('.cart-page')) {
        initCartPage();
    }
});

function initCartPage() {
    const cartItems = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    const cartSummary = document.getElementById('cartSummary');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    // Проверяем, что все необходимые элементы существуют
    if (!cartItems || !emptyCart || !cartSummary || !checkoutBtn) {
        return;
    }
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Отрисовка корзины
    function renderCart() {
        if (cart.length === 0) {
            emptyCart.style.display = 'block';
            cartSummary.style.display = 'none';
            checkoutBtn.disabled = true;
            cartItems.innerHTML = '';
            cartItems.appendChild(emptyCart);
            return;
        }
        
        emptyCart.style.display = 'none';
        cartSummary.style.display = 'block';
        checkoutBtn.disabled = false;
        
        cartItems.innerHTML = '';
        
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1553521041-d168abd31de3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${item.price} ₽</div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn minus" data-index="${index}">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn plus" data-index="${index}">+</button>
                        <button class="remove-item" data-index="${index}">Удалить</button>
                    </div>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
        
        updateCartSummary();
        addCartEventListeners();
    }
    
    // Обновление итоговой суммы
    function updateCartSummary() {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const delivery = subtotal >= 1000 ? 0 : 200;
        const discount = subtotal >= 1500 ? Math.round(subtotal * 0.2) : 0;
        const total = subtotal + delivery - discount;
        
        document.getElementById('subtotal').textContent = `${subtotal} ₽`;
        document.getElementById('delivery').textContent = `${delivery} ₽`;
        document.getElementById('discount').textContent = `-${discount} ₽`;
        document.getElementById('total').textContent = `${total} ₽`;
    }
    
    // Добавление обработчиков событий для элементов корзины
    function addCartEventListeners() {
        // Кнопки увеличения количества
        document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemIndex = parseInt(this.dataset.index);
                if (cart[itemIndex]) {
                    cart[itemIndex].quantity += 1;
                    saveCart();
                    renderCart();
                    updateCartCount();
                }
            });
        });
        
        // Кнопки уменьшения количества
        document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemIndex = parseInt(this.dataset.index);
                if (cart[itemIndex]) {
                    if (cart[itemIndex].quantity > 1) {
                        cart[itemIndex].quantity -= 1;
                    } else {
                        // Если количество 1, удаляем товар
                        cart.splice(itemIndex, 1);
                    }
                    saveCart();
                    renderCart();
                    updateCartCount();
                }
            });
        });
        
        // Кнопки удаления
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemIndex = parseInt(this.dataset.index);
                cart.splice(itemIndex, 1);
                saveCart();
                renderCart();
                updateCartCount();
            });
        });
    }
    
    // Сохранение корзины в localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    // Обновление счетчика корзины
    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCountElements = document.querySelectorAll('#cartCount');
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
        });
    }
    
    // Обработчик для кнопки оформления заказа
    checkoutBtn.addEventListener('click', function() {
        if (cart.length > 0) {
            window.location.href = 'checkout.html';
        }
    });
    
    // Обработчики для кнопок "В корзину" на рекомендованных товарах
    document.querySelectorAll('.btn-add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const product = {
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                name: productCard.querySelector('h3').textContent,
                price: parseInt(productCard.querySelector('.product-price').textContent),
                image: productCard.querySelector('img').src,
                quantity: 1
            };
            
            addToCart(product);
        });
    });
    
    // Функция добавления в корзину
    function addToCart(product) {
        // Проверяем, есть ли уже такой товар в корзине
        const existingItemIndex = cart.findIndex(item => 
            item.name === product.name && item.price === product.price
        );
        
        if (existingItemIndex !== -1) {
            // Если товар уже есть, увеличиваем количество
            cart[existingItemIndex].quantity += 1;
        } else {
            // Если товара нет, добавляем новый
            cart.push(product);
        }
        
        saveCart();
        renderCart();
        updateCartCount();
        
        showNotification('Товар добавлен в корзину!');
    }
    
    // Показ уведомления
    function showNotification(message) {
        // Удаляем существующие уведомления
        const existingNotifications = document.querySelectorAll('.cart-notification');
        existingNotifications.forEach(notification => notification.remove());
        
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.className = 'cart-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: var(--primary-color);
            color: white;
            padding: 15px 20px;
            border-radius: var(--border-radius);
            z-index: 1000;
            box-shadow: var(--shadow);
        `;
        
        document.body.appendChild(notification);
        
        // Анимация появления
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            notification.style.transition = 'all 0.3s ease';
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 2000);
    }
    
    // Инициализация
    renderCart();
    updateCartCount();
}
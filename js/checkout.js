// JavaScript для страницы оформления заказа
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, что мы на странице оформления заказа
    if (document.querySelector('.checkout-page')) {
        initCheckoutPage();
    }
});

function initCheckoutPage() {
    const checkoutForm = document.getElementById('checkoutForm');
    const orderItems = document.getElementById('orderItems');
    
    // Проверяем, что все необходимые элементы существуют
    if (!checkoutForm || !orderItems) {
        return;
    }
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Отрисовка товаров в заказе
    function renderOrderItems() {
        orderItems.innerHTML = '';
        
        if (cart.length === 0) {
            orderItems.innerHTML = '<p>Корзина пуста</p>';
            return;
        }
        
        cart.forEach(item => {
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            orderItem.innerHTML = `
                <div class="order-item-name">${item.name} <span class="order-item-quantity">x${item.quantity}</span></div>
                <div class="order-item-price">${item.price * item.quantity} ₽</div>
            `;
            orderItems.appendChild(orderItem);
        });
        
        updateOrderTotals();
    }
    
    // Обновление итоговой суммы заказа
    function updateOrderTotals() {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const delivery = subtotal >= 1000 ? 0 : 200;
        const discount = subtotal >= 1500 ? subtotal * 0.2 : 0;
        const total = subtotal + delivery - discount;
        
        document.getElementById('orderSubtotal').textContent = `${subtotal} ₽`;
        document.getElementById('orderDelivery').textContent = `${delivery} ₽`;
        document.getElementById('orderDiscount').textContent = `-${discount} ₽`;
        document.getElementById('orderTotal').textContent = `${total} ₽`;
    }
    
    // Обработчик отправки формы
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (cart.length === 0) {
            alert('Корзина пуста. Добавьте товары перед оформлением заказа.');
            return;
        }
        
        const formData = new FormData(checkoutForm);
        const orderData = Object.fromEntries(formData);
        
        // Создание объекта заказа
        const order = {
            ...orderData,
            items: cart,
            subtotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            delivery: orderData.subtotal >= 1000 ? 0 : 200,
            discount: orderData.subtotal >= 1500 ? orderData.subtotal * 0.2 : 0,
            total: orderData.subtotal + (orderData.subtotal >= 1000 ? 0 : 200) - (orderData.subtotal >= 1500 ? orderData.subtotal * 0.2 : 0),
            orderId: generateOrderId(),
            orderDate: new Date().toISOString()
        };
        
        // здесь был бы запрос к API
        console.log('Заказ оформлен:', order);
        
        // Очистка корзины
        localStorage.removeItem('cart');
        cart = [];
        
        // Показ сообщения об успешном оформлении
        showSuccessMessage(order);
    });
    
    // Генерация ID заказа
    function generateOrderId() {
        return 'SM' + Date.now().toString().substr(-6) + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    }
    
    // Показ сообщения об успешном оформлении
    function showSuccessMessage(order) {
        const successModal = document.createElement('div');
        successModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;
        
        successModal.innerHTML = `
            <div style="background-color: white; padding: 30px; border-radius: var(--border-radius); max-width: 500px; width: 90%; text-align: center;">
                <div style="font-size: 4rem; margin-bottom: 20px;">✅</div>
                <h2 style="margin-bottom: 15px;">Заказ успешно оформлен!</h2>
                <p style="margin-bottom: 10px;">Номер вашего заказа: <strong>${order.orderId}</strong></p>
                <p style="margin-bottom: 20px;">Сумма заказа: <strong>${order.total} ₽</strong></p>
                <p style="margin-bottom: 25px;">Ожидайте звонка от нашего оператора для подтверждения заказа.</p>
                <button id="continueShopping" class="btn-primary">Продолжить покупки</button>
            </div>
        `;
        
        document.body.appendChild(successModal);
        
        document.getElementById('continueShopping').addEventListener('click', function() {
            document.body.removeChild(successModal);
            window.location.href = 'products.html';
        });
    }
    
    // Обновление счетчика корзины
    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById('cartCount').textContent = totalItems;
    }
    
    // Инициализация
    renderOrderItems();
    updateCartCount();
}
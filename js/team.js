// JavaScript для страницы команды
document.addEventListener('DOMContentLoaded', function() {
    initTeamPage();
});

function initTeamPage() {
    // Обновление счетчика корзины
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById('cartCount').textContent = totalItems;
    }
    
    // Инициализация
    updateCartCount();
}
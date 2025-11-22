// JavaScript для страницы "Скоро будет"
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, что мы на странице "Скоро будет"
    if (document.querySelector('.coming-soon-page')) {
        initComingSoonPage();
    }
});

function initComingSoonPage() {
    const daysElement = document.getElementById('cs-days');
    const hoursElement = document.getElementById('cs-hours');
    const minutesElement = document.getElementById('cs-minutes');
    const secondsElement = document.getElementById('cs-seconds');
    
    // Проверяем, что элементы счетчика существуют
    if (!daysElement || !hoursElement || !minutesElement || !secondsElement) {
        return;
    }
    
    // дата запуска 
    const launchDate = new Date();
    launchDate.setDate(launchDate.getDate() + 30);
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = launchDate - now;
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        daysElement.textContent = days.toString().padStart(2, '0');
        hoursElement.textContent = hours.toString().padStart(2, '0');
        minutesElement.textContent = minutes.toString().padStart(2, '0');
        secondsElement.textContent = seconds.toString().padStart(2, '0');
        
        if (distance < 0) {
            clearInterval(countdownInterval);
            document.querySelector('.countdown').innerHTML = '<p>Страница скоро будет доступна!</p>';
        }
    }
    
    // Обновляем счетчик каждую секунду
    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown(); // Первоначальный вызов
    
    // Обновление счетчика корзины
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById('cartCount').textContent = totalItems;
    }
    
    // Инициализация
    updateCartCount();
}
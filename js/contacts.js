// JavaScript для страницы контактов
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, что мы на странице контактов
    if (document.querySelector('.contacts-page')) {
        initContactsPage();
    }
});

function initContactsPage() {
    const contactForm = document.getElementById('contactForm');
    const faqItems = document.querySelectorAll('.faq-item');
    
    // Проверяем, что форма существует
    if (!contactForm) {
        return;
    }
    
    // Обработчик отправки формы
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const contactData = Object.fromEntries(formData);
        
        // здесь был бы запрос к API
        console.log('Форма обратной связи отправлена:', contactData);
        
        // Показ сообщения об успешной отправке
        alert('Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.');
        
        // Очистка формы
        contactForm.reset();
    });
    
    // Обработчики для FAQ
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            item.classList.toggle('active');
        });
    });
    
    // Обновление счетчика корзины
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById('cartCount').textContent = totalItems;
    }
    
    // Инициализация
    updateCartCount();
}
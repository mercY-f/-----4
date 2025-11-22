// Основной JavaScript файл приложения

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация слайдера только если он есть на странице
    if (document.querySelector('.slider')) {
        initSlider();
    }
    
    // Инициализация счетчика только если он есть на странице
    if (document.querySelector('.countdown')) {
        initCountdown();
    }
    
    initCart();
    initFeedbackForm();
    initPWA();
    initMobileMenu();
});

// Слайдер
function initSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    
    // Проверяем, что все элементы слайдера существуют
    if (slides.length === 0 || !prevBtn || !nextBtn) {
        return;
    }
    
    let currentSlide = 0;
    let slideInterval;

    function showSlide(n) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        currentSlide = (n + slides.length) % slides.length;
        
        slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) {
            dots[currentSlide].classList.add('active');
        }
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    function startSlider() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    function stopSlider() {
        clearInterval(slideInterval);
    }

    // Обработчики событий
    nextBtn.addEventListener('click', () => {
        stopSlider();
        nextSlide();
        startSlider();
    });

    prevBtn.addEventListener('click', () => {
        stopSlider();
        prevSlide();
        startSlider();
    });

    // Добавляем обработчики для точек, если они есть
    if (dots.length > 0) {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                stopSlider();
                showSlide(index);
                startSlider();
            });
        });
    }

    // Автопрокрутка
    startSlider();

    // Остановка при наведении
    const slider = document.querySelector('.slider');
    slider.addEventListener('mouseenter', stopSlider);
    slider.addEventListener('mouseleave', startSlider);
}

// Счетчик обратного отсчета
function initCountdown() {
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');

    // Проверяем, что элементы счетчика существуют
    if (!daysElement || !hoursElement || !minutesElement || !secondsElement) {
        return;
    }

    // дата окончания акции 
    const countdownDate = new Date();
    countdownDate.setDate(countdownDate.getDate() + 7);

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = countdownDate - now;

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
            document.querySelector('.countdown-section').innerHTML = '<div class="container"><h2>Акция завершена</h2></div>';
        }
    }

    // Обновляем счетчик каждую секунду
    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown(); // Первоначальный вызов
}

// Корзина
function initCart() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.getElementById('cartCount');
    const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');

    // Проверяем, что элемент счетчика корзины существует
    if (!cartCount) {
        return;
    }

    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }

    function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Проверяем, есть ли уже такой товар в корзине
    const existingItemIndex = cart.findIndex(item => 
        item.name === product.name && item.price === product.price
    );
    
    if (existingItemIndex !== -1) {
        // Если товар уже есть, увеличиваем количество
        cart[existingItemIndex].quantity += 1;
    } else {
        // Если товара нет, добавляем новый
        cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Анимация добавления в корзину
    showAddToCartAnimation();
    }

    function showAddToCartAnimation() {
        const notification = document.createElement('div');
        notification.textContent = 'Товар добавлен в корзину!';
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
            animation: slideInUp 0.5s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.5s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 2000);
    }

    // Обработчики для кнопок "В корзину"
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const product = {
                id: productCard.dataset.id || Math.random().toString(36).substr(2, 9),
                name: productCard.querySelector('h3').textContent,
                price: parseInt(productCard.querySelector('.product-price').textContent),
                image: productCard.querySelector('img').src
            };
            
            addToCart(product);
        });
    });

    // Инициализация счетчика корзины
    updateCartCount();
}

// Форма обратной связи
function initFeedbackForm() {
    const form = document.getElementById('feedbackForm');
    
    // Проверяем, что форма существует
    if (!form) {
        return;
    }
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        console.log('Форма отправлена:', data);
        
        // Показываем уведомление об успешной отправке
        alert('Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.');
        
        form.reset();
    });
}

// PWA функциональность
function initPWA() {
    // Регистрация Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }

    // Предложение установки приложения
    let deferredPrompt;
    const installPrompt = document.getElementById('installPrompt');
    const installBtn = document.getElementById('installBtn');
    const installCancel = document.getElementById('installCancel');

    // Проверяем, что элементы установки существуют
    if (!installPrompt || !installBtn || !installCancel) {
        return;
    }

    window.addEventListener('beforeinstallprompt', (e) => {
        // Предотвращаем автоматическое отображение подсказки
        e.preventDefault();
        // Сохраняем событие для последующего использования
        deferredPrompt = e;
        
        // Показываем нашу кастомную подсказку
        setTimeout(() => {
            installPrompt.style.display = 'block';
            installPrompt.classList.add('fade-in');
        }, 3000);
    });

    installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
            // Показываем встроенную подсказку установки
            deferredPrompt.prompt();
            
            // Ждем, пока пользователь ответит на подсказку
            const { outcome } = await deferredPrompt.userChoice;
            
            if (outcome === 'accepted') {
                console.log('Пользователь принял предложение об установке');
            } else {
                console.log('Пользователь отклонил предложение об установке');
            }
            
            // Очищаем сохраненное событие
            deferredPrompt = null;
            
            // Скрываем нашу подсказку
            installPrompt.style.display = 'none';
        }
    });

    installCancel.addEventListener('click', () => {
        installPrompt.style.display = 'none';
    });
}

// Мобильное меню
function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    // Проверяем, что элементы меню существуют
    if (!navToggle || !navMenu) {
        return;
    }
    
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Анимация гамбургер-меню
        const spans = navToggle.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

// Добавляем CSS для fadeOut анимации
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style);
// JavaScript для страницы продуктов
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, что мы на странице продуктов
    if (document.querySelector('.products-page')) {
        initProductsPage();
    }
});

function initProductsPage() {
    const productsGrid = document.getElementById('productsGrid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const sortSelect = document.getElementById('sort');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const currentPageSpan = document.getElementById('currentPage');
    const totalPagesSpan = document.getElementById('totalPages');
    
    // Проверяем, что все необходимые элементы существуют
    if (!productsGrid || !sortSelect || !prevPageBtn || !nextPageBtn || 
        !currentPageSpan || !totalPagesSpan) {
        return;
    }
    
    let currentCategory = 'all';
    let currentSort = 'popular';
    let currentPage = 1;
    const productsPerPage = 8;
    let allProducts = [];
    
    // Загрузка продуктов
    function loadProducts() {
        // здесь был бы запрос к API
        // Для демонстрации фиктивные данные с локальными изображениями
        allProducts = [
            { 
                id: 1, 
                name: 'Филадельфия', 
                category: 'rolls', 
                price: 450, 
                image: 'images/products/philadelphia.jpg', 
                description: 'Лосось, сливочный сыр, огурец, авокадо', 
                popular: true 
            },
            { 
                id: 2, 
                name: 'Калифорния', 
                category: 'rolls', 
                price: 380, 
                image: 'images/products/california.jpg', 
                description: 'Краб, авокадо, огурец, икра масаго', 
                popular: true 
            },
            { 
                id: 3, 
                name: 'Унаги', 
                category: 'rolls', 
                price: 520, 
                image: 'images/products/unagi.jpg', 
                description: 'Угорь, авокадо, огурец, соус унаги', 
                popular: false 
            },
            { 
                id: 4, 
                name: 'Темпура', 
                category: 'rolls', 
                price: 490, 
                image: 'images/products/tempura.jpg', 
                description: 'Креветка темпура, авокадо, соус спайси', 
                popular: true 
            },
            { 
                id: 5, 
                name: 'Нигири с лососем', 
                category: 'sushi', 
                price: 180, 
                image: 'images/products/nigiri-salmon.jpg', 
                description: 'Рис, лосось, васаби', 
                popular: false 
            },
            { 
                id: 6, 
                name: 'Нигири с угрем', 
                category: 'sushi', 
                price: 220, 
                image: 'images/products/nigiri-eel.jpg', 
                description: 'Рис, угорь, соус унаги', 
                popular: false 
            },
            { 
                id: 7, 
                name: 'Сет "Самый лучший"', 
                category: 'sets', 
                price: 1890, 
                image: 'images/products/set-premium.jpg', 
                description: '12 роллов: Филадельфия, Калифорния, Темпура', 
                popular: true 
            },
            { 
                id: 8, 
                name: 'Сет "Для компании"', 
                category: 'sets', 
                price: 2450, 
                image: 'images/products/set-party.jpg', 
                description: '20 роллов: 4 вида по 5 штук', 
                popular: false 
            },
            { 
                id: 9, 
                name: 'Мисо суп', 
                category: 'soups', 
                price: 220, 
                image: 'images/products/miso-soup.jpg', 
                description: 'Паста мисо, тофу, водоросли вакаме', 
                popular: true 
            },
            { 
                id: 10, 
                name: 'Рамен', 
                category: 'soups', 
                price: 380, 
                image: 'images/products/ramen.jpg', 
                description: 'Лапша, свинина, яйцо, овощи', 
                popular: false 
            },
            { 
                id: 11, 
                name: 'Кока-Кола', 
                category: 'drinks', 
                price: 120, 
                image: 'images/products/cola.jpg', 
                description: '0.5 л', 
                popular: true 
            },
            { 
                id: 12, 
                name: 'Сок апельсиновый', 
                category: 'drinks', 
                price: 150, 
                image: 'images/products/orange-juice.jpg', 
                description: '1 л', 
                popular: false 
            }
        ];
        
        renderProducts();
    }
    
    // Фильтрация продуктов
    function filterProducts() {
        let filteredProducts = allProducts;
        
        // Фильтрация по категории
        if (currentCategory !== 'all') {
            filteredProducts = filteredProducts.filter(product => product.category === currentCategory);
        }
        
        // Сортировка
        switch (currentSort) {
            case 'price-low':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'popular':
            default:
                filteredProducts.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
                break;
        }
        
        return filteredProducts;
    }
    
    // Отрисовка продуктов
    function renderProducts() {
        const filteredProducts = filterProducts();
        const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        const productsToShow = filteredProducts.slice(startIndex, endIndex);
        
        productsGrid.innerHTML = '';
        
        if (productsToShow.length === 0) {
            productsGrid.innerHTML = '<div class="empty-products"><p>Товары не найдены</p></div>';
            return;
        }
        
        productsToShow.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">${product.price} ₽</div>
                    <button class="btn-add-to-cart" data-id="${product.id}">В корзину</button>
                </div>
            `;
            productsGrid.appendChild(productCard);
        });
        
        // Обновление пагинации
        currentPageSpan.textContent = currentPage;
        totalPagesSpan.textContent = totalPages;
        
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages;
        
        // Добавление обработчиков для кнопок "В корзину"
        document.querySelectorAll('.btn-add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.dataset.id);
                const product = allProducts.find(p => p.id === productId);
                
                if (product) {
                    addToCart(product);
                }
            });
        });
    }
    
    // Обработчики событий
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.dataset.category;
            currentPage = 1;
            renderProducts();
        });
    });
    
    sortSelect.addEventListener('change', function() {
        currentSort = this.value;
        renderProducts();
    });
    
    prevPageBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            renderProducts();
        }
    });
    
    nextPageBtn.addEventListener('click', function() {
        const filteredProducts = filterProducts();
        const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
        
        if (currentPage < totalPages) {
            currentPage++;
            renderProducts();
        }
    });
    
    // Функция добавления в корзину
    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ 
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        
        // Показываем уведомление
        showNotification('Товар добавлен в корзину!');
    }
    
    // Обновление счетчика корзины
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            cartCount.textContent = totalItems;
        }
    }
    
    // Показ уведомления
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
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
    
    // Инициализация
    loadProducts();
    updateCartCount();
}
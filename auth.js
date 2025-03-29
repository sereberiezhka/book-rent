// Инициализация Telegram Web App
let tg = window.Telegram.WebApp;
let user = null;

// Функция для инициализации и проверки авторизации
function initAuth() {
    // Если открыто в Telegram WebApp
    if (tg && tg.initData) {
        try {
            // Получаем данные пользователя из Telegram WebApp
            if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
                user = tg.initDataUnsafe.user;
                // Сохраняем ID пользователя в localStorage для дальнейшего использования
                localStorage.setItem('telegramUser', JSON.stringify(user));
                // Показываем основной контент
                showMainContent();
                return;
            }
        } catch (e) {
            console.error("Ошибка при получении данных пользователя из Telegram WebApp:", e);
        }
    }
    
    // Если открыто не в Telegram или не получилось получить данные пользователя
    // Проверяем, есть ли сохраненный пользователь
    const savedUser = localStorage.getItem('telegramUser');
    
    if (savedUser) {
        try {
            user = JSON.parse(savedUser);
            // Показываем основной контент
            showMainContent();
        } catch (e) {
            // Если произошла ошибка, показываем форму авторизации
            showAuthForm();
        }
    } else {
        // Если нет сохраненного пользователя, показываем форму авторизации
        showAuthForm();
    }
}

// Функция для отображения формы авторизации через Telegram
function showAuthForm() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('auth-container').style.display = 'block';
    
    // Инициализация Telegram Login Widget
    const script = document.createElement('script');
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute('data-telegram-login', 'YOUR_BOT_NAME'); // Замените на имя вашего бота
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-radius', '8');
    script.setAttribute('data-auth-url', window.location.href); // Редирект на эту же страницу после авторизации
    script.setAttribute('data-request-access', 'write');
    
    // Очищаем контейнер перед добавлением виджета
    const container = document.getElementById('telegram-login-container');
    container.innerHTML = '';
    container.appendChild(script);
}

// Функция для показа основного контента после авторизации
function showMainContent() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
    
    // Отображаем информацию о пользователе
    const userInfoElement = document.getElementById('user-info');
    if (userInfoElement && user) {
        userInfoElement.textContent = `${user.first_name || ''} ${user.last_name || ''}`;
    }
    
    // Загружаем данные для пользователя
    loadUserData();
}

// Обработка результатов авторизации через Telegram Login Widget
window.onload = function() {
    // Проверяем, есть ли в URL параметры авторизации от Telegram
    const urlParams = new URLSearchParams(window.location.search);
    const telegramId = urlParams.get('id');
    const firstName = urlParams.get('first_name');
    const lastName = urlParams.get('last_name');
    const username = urlParams.get('username');
    const photoUrl = urlParams.get('photo_url');
    const authDate = urlParams.get('auth_date');
    const hash = urlParams.get('hash');
    
    // Если есть параметры авторизации
    if (telegramId && authDate && hash) {
        // Создаем объект пользователя
        user = {
            id: telegramId,
            first_name: firstName || '',
            last_name: lastName || '',
            username: username || '',
            photo_url: photoUrl || ''
        };
        
        // Сохраняем в localStorage
        localStorage.setItem('telegramUser', JSON.stringify(user));
        
        // Очищаем URL от параметров авторизации
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Показываем основной контент
        showMainContent();
    } else {
        // Инициализируем авторизацию
        initAuth();
    }
};

// Функция для выхода из аккаунта
function logout() {
    localStorage.removeItem('telegramUser');
    user = null;
    showAuthForm();
}

// Функция для загрузки данных пользователя
function loadUserData() {
    if (!user) return;
    
    // Здесь будет код для загрузки данных пользователя из базы данных
    // Пока используем заглушку для демонстрации
    
    // Загружаем доступные книги
    loadBooks();
    
    // Загружаем аренды пользователя
    loadUserRentals();
    
    // Загружаем историю аренд
    loadRentalHistory();
    
    // Загружаем информацию об аккаунте и подписке
    loadAccountInfo();
}
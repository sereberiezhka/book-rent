// Переменные для хранения состояния приложения
let currentSection = 'available-books';

// Инициализация приложения при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация навигации
    setupNavigation();
    
    // Инициализация Telegram Mini App
    initTelegramMiniApp();
});

// Функция для инициализации Telegram Mini App
function initTelegramMiniApp() {
    // Проверяем, запущено ли приложение в Telegram Mini App
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        
        // Сообщаем Telegram, что приложение готово
        tg.ready();
        
        // Настраиваем внешний вид приложения в соответствии с темой Telegram
        if (tg.colorScheme === 'dark') {
            document.body.classList.add('dark-theme');
        }
        
        // Устанавливаем основной цвет в соответствии с темой Telegram
        if (tg.themeParams && tg.themeParams.bg_color) {
            document.documentElement.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color);
            document.documentElement.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color);
            document.documentElement.style.setProperty('--tg-theme-hint-color', tg.themeParams.hint_color);
            document.documentElement.style.setProperty('--tg-theme-link-color', tg.themeParams.link_color);
            document.documentElement.style.setProperty('--tg-theme-button-color', tg.themeParams.button_color);
            document.documentElement.style.setProperty('--tg-theme-button-text-color', tg.themeParams.button_text_color);
        }
        
        // Настраиваем кнопку "Назад" для возврата к основному списку книг из других разделов
        tg.BackButton.onClick(function() {
            if (currentSection !== 'available-books') {
                switchSection('available-books');
                tg.BackButton.hide();
            }
        });
    }
}

// Функция для настройки навигации между разделами
function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-button');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            switchSection(section);
        });
    });
}

// Функция для переключения между разделами
function switchSection(sectionId) {
    // Скрываем все разделы
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Показываем выбранный раздел
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }
    
    // Обновляем активную кнопку в навигации
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(button => {
        if (button.getAttribute('data-section') === sectionId) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    // Показываем/скрываем кнопку "Назад" в Telegram Mini App
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        
        if (sectionId !== 'available-books') {
            tg.BackButton.show();
        } else {
            tg.BackButton.hide();
        }
    }
    
    // Обновляем текущий раздел
    currentSection = sectionId;
    
    // Обновляем данные для выбранного раздела
    refreshSectionData(sectionId);
}

// Функция для обновления данных в выбранном разделе
function refreshSectionData(sectionId) {
    switch (sectionId) {
        case 'available-books':
            loadBooks();
            break;
        case 'my-rentals':
            loadUserRentals();
            break;
        case 'rental-history':
            loadRentalHistory();
            break;
        case 'my-account':
            loadAccountInfo();
            break;
    }
}

// Дополнительные стили для поддержки темы Telegram
document.addEventListener('DOMContentLoaded', function() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .dark-theme {
            background-color: #212121;
            color: #ffffff;
        }
        
        .dark-theme .book-card, 
        .dark-theme .rental-card, 
        .dark-theme #account-info, 
        .dark-theme #subscription-info,
        .dark-theme #history-container {
            background-color: #333333;
            color: #ffffff;
        }
        
        .dark-theme .book-age, 
        .dark-theme .book-description, 
        .dark-theme .rental-date, 
        .dark-theme .due-date {
            color: #aaaaaa;
        }
        
        .dark-theme .nav-button {
            background-color: #333333;
            border-color: #555555;
            color: #ffffff;
        }
        
        .dark-theme .nav-button.active {
            background-color: var(--tg-theme-button-color, #3498db);
            color: var(--tg-theme-button-text-color, white);
        }
    `;
    document.head.appendChild(styleElement);
});
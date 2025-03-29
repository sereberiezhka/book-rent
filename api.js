// Моковые данные для демонстрации
// В реальном приложении эти данные будут приходить с сервера

// Книги
const mockBooks = [
    {
        id: 1,
        title: "Приключения Буратино",
        author: "Алексей Толстой",
        age_category: "6-8",
        description: "Знаменитая сказка о деревянном мальчике Буратино",
        cover_url: "https://via.placeholder.com/150x200?text=Буратино",
        status: "available",
        return_date: null
    },
    {
        id: 2,
        title: "Винни-Пух и все-все-все",
        author: "Алан Милн",
        age_category: "3-5",
        description: "Истории о медвежонке Винни-Пухе и его друзьях",
        cover_url: "https://via.placeholder.com/150x200?text=Винни-Пух",
        status: "rented",
        return_date: "2025-04-10"
    },
    {
        id: 3,
        title: "Гарри Поттер и философский камень",
        author: "Дж. К. Роулинг",
        age_category: "9-12",
        description: "Первая книга о юном волшебнике Гарри Поттере",
        cover_url: "https://via.placeholder.com/150x200?text=Гарри+Поттер",
        status: "available",
        return_date: null
    },
    {
        id: 4,
        title: "Колобок",
        author: "Народная сказка",
        age_category: "0-2",
        description: "Русская народная сказка о приключениях Колобка",
        cover_url: "https://via.placeholder.com/150x200?text=Колобок",
        status: "available",
        return_date: null
    },
    {
        id: 5,
        title: "Мойдодыр",
        author: "Корней Чуковский",
        age_category: "3-5",
        description: "Сказка о важности чистоты и гигиены",
        cover_url: "https://via.placeholder.com/150x200?text=Мойдодыр",
        status: "available",
        return_date: null
    },
    {
        id: 6,
        title: "Хроники Нарнии",
        author: "К. С. Льюис",
        age_category: "9-12",
        description: "Фэнтези о волшебной стране Нарния",
        cover_url: "https://via.placeholder.com/150x200?text=Нарния",
        status: "rented",
        return_date: "2025-04-05"
    }
];

// Аренды пользователя
const mockUserRentals = [
    {
        id: 101,
        book_id: 2,
        user_id: "12345", // Предполагаем, что это ID текущего пользователя
        rental_date: "2025-03-27",
        due_date: "2025-04-10",
        returned: false
    }
];

// История аренд
const mockRentalHistory = [
    {
        id: 100,
        book_id: 3,
        user_id: "12345",
        rental_date: "2025-02-15",
        due_date: "2025-03-01",
        returned: true,
        return_date: "2025-02-28"
    }
];

// Информация о пользователе
const mockUserInfo = {
    id: "12345",
    name: "Иван Иванов",
    subscription: {
        active: true,
        plan: "Базовый",
        expires: "2025-05-01",
        max_books: 3
    }
};

// Функция для загрузки доступных книг
function loadBooks() {
    const booksContainer = document.getElementById('books-container');
    if (!booksContainer) return;
    
    booksContainer.innerHTML = '';
    
    // Получаем выбранные фильтры
    const searchTerm = document.getElementById('search-book').value.toLowerCase();
    const ageFilter = document.getElementById('age-filter').value;
    
    // Фильтруем книги
    let filteredBooks = mockBooks;
    
    if (searchTerm) {
        filteredBooks = filteredBooks.filter(book => 
            book.title.toLowerCase().includes(searchTerm) || 
            book.author.toLowerCase().includes(searchTerm)
        );
    }
    
    if (ageFilter) {
        filteredBooks = filteredBooks.filter(book => book.age_category === ageFilter);
    }
    
    // Отображаем книги
    if (filteredBooks.length === 0) {
        booksContainer.innerHTML = '<p class="no-books">Книги не найдены</p>';
        return;
    }
    
    const template = document.getElementById('book-card-template');
    
    filteredBooks.forEach(book => {
        const bookCard = document.importNode(template.content, true);
        
        // Заполняем данные о книге
        bookCard.querySelector('.book-title').textContent = book.title;
        bookCard.querySelector('.book-age').textContent = `Возраст: ${book.age_category}`;
        bookCard.querySelector('.book-description').textContent = book.description;
        bookCard.querySelector('.book-cover img').src = book.cover_url;
        
        // Устанавливаем статус книги
        const statusElement = bookCard.querySelector('.book-status');
        const rentButton = bookCard.querySelector('.rent-button');
        
        if (book.status === 'available') {
            statusElement.textContent = '✅ Доступна';
            statusElement.classList.add('status-available');
            rentButton.disabled = false;
            
            // Добавляем обработчик события для кнопки аренды
            rentButton.onclick = () => rentBook(book.id);
        } else {
            const returnDate = new Date(book.return_date);
            const formattedDate = returnDate.toLocaleDateString('ru-RU');
            
            statusElement.textContent = `❌ В аренде до ${formattedDate}`;
            statusElement.classList.add('status-rented');
            rentButton.disabled = true;
            rentButton.textContent = 'Недоступна';
            rentButton.style.backgroundColor = '#ccc';
            rentButton.style.cursor = 'not-allowed';
        }
        
        booksContainer.appendChild(bookCard);
    });
}

// Функция для загрузки арендованных книг пользователя
function loadUserRentals() {
    const rentalsContainer = document.getElementById('my-rentals-container');
    if (!rentalsContainer) return;
    
    rentalsContainer.innerHTML = '';
    
    // Фильтруем активные аренды пользователя
    const userActiveRentals = mockUserRentals.filter(rental => 
        rental.user_id === user.id && !rental.returned
    );
    
    if (userActiveRentals.length === 0) {
        rentalsContainer.innerHTML = '<p class="no-rentals">У вас пока нет активных аренд</p>';
        return;
    }
    
    const template = document.getElementById('rental-card-template');
    
    userActiveRentals.forEach(rental => {
        const book = mockBooks.find(b => b.id === rental.book_id);
        if (!book) return;
        
        const rentalCard = document.importNode(template.content, true);
        
        // Заполняем данные о книге и аренде
        rentalCard.querySelector('.book-title').textContent = book.title;
        rentalCard.querySelector('.book-cover img').src = book.cover_url;
        
        const rentalDate = new Date(rental.rental_date);
        const dueDate = new Date(rental.due_date);
        
        rentalCard.querySelector('.rental-date').textContent = `Арендовано: ${rentalDate.toLocaleDateString('ru-RU')}`;
        rentalCard.querySelector('.due-date').textContent = `Вернуть до: ${dueDate.toLocaleDateString('ru-RU')}`;
        
        // Добавляем обработчик события для кнопки возврата
        rentalCard.querySelector('.return-button').onclick = () => returnBook(rental.id);
        
        rentalsContainer.appendChild(rentalCard);
    });
}

// Функция для загрузки истории аренд
function loadRentalHistory() {
    const historyContainer = document.getElementById('history-container');
    if (!historyContainer) return;
    
    historyContainer.innerHTML = '';
    
    // Фильтруем историю аренд пользователя
    const userRentalHistory = mockRentalHistory.filter(rental => 
        rental.user_id === user.id && rental.returned
    );
    
    if (userRentalHistory.length === 0) {
        historyContainer.innerHTML = '<p class="no-history">История аренд пуста</p>';
        return;
    }
    
    userRentalHistory.forEach(rental => {
        const book = mockBooks.find(b => b.id === rental.book_id);
        if (!book) return;
        
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const rentalDate = new Date(rental.rental_date);
        const returnDate = new Date(rental.return_date);
        
        historyItem.innerHTML = `
            <h3>${book.title}</h3>
            <p>Арендовано: ${rentalDate.toLocaleDateString('ru-RU')}</p>
            <p>Возвращено: ${returnDate.toLocaleDateString('ru-RU')}</p>
        `;
        
        historyContainer.appendChild(historyItem);
    });
}

// Функция для загрузки информации об аккаунте и подписке
function loadAccountInfo() {
    const accountInfoElement = document.getElementById('account-info');
    const subscriptionInfoElement = document.getElementById('subscription-info');
    
    if (!accountInfoElement || !subscriptionInfoElement) return;
    
    // В реальном приложении здесь будет запрос к серверу
    // Пока используем моковые данные
    const userInfo = mockUserInfo;
    
    // Отображаем информацию об аккаунте
    accountInfoElement.innerHTML = `
        <h3>Личная информация</h3>
        <p>Имя: ${user.first_name} ${user.last_name}</p>
        <p>Telegram ID: ${user.id}</p>
        ${user.username ? `<p>Username: @${user.username}</p>` : ''}
    `;
    
    // Отображаем информацию о подписке
    const subscriptionStatus = userInfo.subscription.active ? 
        '<span style="color: green;">Активна</span>' : 
        '<span style="color: red;">Неактивна</span>';
    
    const expiryDate = new Date(userInfo.subscription.expires);
    
    subscriptionInfoElement.innerHTML = `
        <h3>Подписка</h3>
        <p>Статус: ${subscriptionStatus}</p>
        <p>План: ${userInfo.subscription.plan}</p>
        <p>Действует до: ${expiryDate.toLocaleDateString('ru-RU')}</p>
        <p>Максимум книг: ${userInfo.subscription.max_books}</p>
    `;
}

// Функция для аренды книги
function rentBook(bookId) {
    if (!user) {
        alert('Для аренды книги необходимо авторизоваться');
        return;
    }
    
    // Проверяем, сколько книг уже арендовано пользователем
    const userActiveRentals = mockUserRentals.filter(rental => 
        rental.user_id === user.id && !rental.returned
    );
    
    if (userActiveRentals.length >= mockUserInfo.subscription.max_books) {
        alert(`Вы уже арендовали максимальное количество книг (${mockUserInfo.subscription.max_books})`);
        return;
    }
    
    if (confirm('Вы уверены, что хотите арендовать эту книгу?')) {
        // В реальном приложении здесь будет запрос к серверу
        
        // Обновляем статус книги
        const bookIndex = mockBooks.findIndex(book => book.id === bookId);
        if (bookIndex !== -1) {
            mockBooks[bookIndex].status = 'rented';
            
            // Устанавливаем дату возврата (например, через 14 дней)
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + 14);
            mockBooks[bookIndex].return_date = dueDate.toISOString().split('T')[0];
            
            // Создаем новую аренду
            const newRental = {
                id: Date.now(), // Используем временную метку как ID
                book_id: bookId,
                user_id: user.id,
                rental_date: new Date().toISOString().split('T')[0],
                due_date: dueDate.toISOString().split('T')[0],
                returned: false
            };
            
            mockUserRentals.push(newRental);
            
            // Обновляем списки книг и аренд
            loadBooks();
            loadUserRentals();
            
            alert('Книга успешно арендована!');
        }
    }
}

// Функция для возврата книги
function returnBook(rentalId) {
    if (!user) {
        alert('Для возврата книги необходимо авторизоваться');
        return;
    }
    
    if (confirm('Вы уверены, что хотите вернуть эту книгу?')) {
        // В реальном приложении здесь будет запрос к серверу
        
        // Находим аренду
        const rentalIndex = mockUserRentals.findIndex(rental => rental.id === rentalId);
        if (rentalIndex !== -1) {
            const rental = mockUserRentals[rentalIndex];
            
            // Обновляем статус аренды
            mockUserRentals[rentalIndex].returned = true;
            mockUserRentals[rentalIndex].return_date = new Date().toISOString().split('T')[0];
            
            // Обновляем статус книги
            const bookIndex = mockBooks.findIndex(book => book.id === rental.book_id);
            if (bookIndex !== -1) {
                mockBooks[bookIndex].status = 'available';
                mockBooks[bookIndex].return_date = null;
            }
            
            // Добавляем аренду в историю
            mockRentalHistory.push({
                ...mockUserRentals[rentalIndex]
            });
            
            // Обновляем списки книг и аренд
            loadBooks();
            loadUserRentals();
            loadRentalHistory();
            
            alert('Книга успешно возвращена!');
        }
    }
}

// Функции для фильтрации книг
function setupFilters() {
    const searchInput = document.getElementById('search-book');
    const ageFilter = document.getElementById('age-filter');
    
    if (searchInput) {
        searchInput.addEventListener('input', loadBooks);
    }
    
    if (ageFilter) {
        ageFilter.addEventListener('change', loadBooks);
    }
}

// Инициализация фильтров
document.addEventListener('DOMContentLoaded', setupFilters);
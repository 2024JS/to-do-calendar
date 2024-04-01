// Функция для определения дня недели
function getDayOfWeek(year, month, day) {
    return new Date(year, month, day).getDay();
}

function displayCurrentDate() {
    const currentDate = new Date();

    // Получаем день, месяц и год
    const day = currentDate.getDate();
    const month = currentDate.toLocaleString('en-US', { month: 'long' });
    const year = currentDate.getFullYear();

    // Форматируем время
    const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    const formattedTime = currentDate.toLocaleTimeString('en-US', optionsTime);

    // Соединяем дату и время в одну строку
    const displayDateTime = `${day} ${month} ${year} - ${formattedTime}`;

    // Выводим результат на страницу
    document.querySelector('.toDay').textContent = displayDateTime;
}


// Вызов функции для отображения текущей даты
displayCurrentDate();
setInterval(displayCurrentDate, 1000);


// Добавляем свойство status к объектам quests
class Day {
    constructor(number, dayOfWeek) {
        this.number = number;
        this.dayOfWeek = dayOfWeek;
        this.quests = []; // инициализация свойства quests как пустого массива
    }

    addQuest(questNumber, questTitle, questBody) {
        this.quests.push({ number: questNumber, title: questTitle, body: questBody, status: true });
    }
}

// Генерация календаря для заданного месяца и года
function generateCalendar(year, month) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const calendar = [];
    let nullDivDays = 0;

    // Определение дня недели для 1 числа месяца
    const firstDayOfWeek = getDayOfWeek(year, month, 0);
    console.log(firstDayOfWeek)

    // Добавление пустых дней в начале месяца
    for (let i = 1; i < firstDayOfWeek; i++) {
        calendar.push(null); // Добавляем null вместо объекта Day
        nullDivDays++;
        console.log(nullDivDays)
    }

    // Добавление дней месяца
    for (let i = 1; i <= daysInMonth; i++) {
        const dayOfWeek = getDayOfWeek(year, month, i);
        const day = new Day(i, dayOfWeek);
        calendar.push(day);
    }
    console.log(calendar, nullDivDays)

    return { calendar, nullDivDays };
}


function displayCalendar(calendarData) {
    const calendarContainer = document.getElementById('calendarContainer');
    calendarContainer.innerHTML = ''; // Очистка содержимого

    const calendar = calendarData.calendar;
    const nullDivDays = calendarData.nullDivDays;

    calendar.forEach((day, index) => {
        const dayElement = document.createElement('div');
        dayElement.classList.add('day');

        if (day !== null) {
            const dayNumberElement = document.createElement('span'); // Создаем элемент для отображения номера дня
            dayNumberElement.textContent = day.number; // Устанавливаем текст элемента номера дня
            dayElement.appendChild(dayNumberElement); // Добавляем элемент номера дня к элементу дня

            if (day.number === new Date().getDate()) {
                dayElement.classList.add('today');
            }

            // Проверяем наличие задач с status: true
            const activeQuests = day.quests.filter(quest => quest.status === true);

            // Если есть активные задачи, добавляем элемент для отображения их количества
            if (activeQuests.length > 0) {
                dayElement.classList.add('has-quests'); // Добавление класса для стилизации
                // Создаем элемент для отображения количества задач
                const questsCountElement = document.createElement('span');
                questsCountElement.textContent = `${activeQuests.length}`; // Устанавливаем текст элемента количества задач
                questsCountElement.classList.add('quests-count'); // Добавляем класс для применения стилей
                dayElement.appendChild(questsCountElement); // Добавляем элемент количества задач к элементу дня
            }


            // Учитываем количество пустых дней при вычислении реального индекса
            const realIndex = index - nullDivDays;

            dayElement.addEventListener('click', function() {
                showTasksForSelectedDay(realIndex);
                localStorage.setItem('selectedDayIndex', realIndex);
                // Удаление класса 'lookingNow' у всех дней
                document.querySelectorAll('.day').forEach(day => {
                    day.classList.remove('lookingNow');
                });

                // Добавление класса 'lookingNow' к выбранному дню
                dayElement.classList.add('lookingNow');
            });
        }
        calendarContainer.appendChild(dayElement);
    });  
}


// Обработчик события для кнопки добавления новой задачи
document.getElementById('addQuestBtn').addEventListener('click', function(event) {
    event.preventDefault(); // Предотвращаем стандартное поведение кнопки

    // Получаем данные новой задачи из формы
    const newQuestTitle = document.getElementById('newQuestTitle').value;
    const newQuestBody = document.getElementById('newQuestBody').value;

    // Получаем текущий выбранный день из localStorage
    const selectedDayIndex = parseInt(localStorage.getItem('selectedDayIndex'));

    // Проверяем, выбран ли день
    if (!isNaN(selectedDayIndex)) {
        // Получаем массив календаря из localStorage только один раз перед началом обработки события
        const calendarData = loadCalendar();
        const calendar = calendarData.calendar;

        // Создаем новую задачу
        const newQuest = {
            number: calendar[selectedDayIndex].quests.length + 1,
            title: newQuestTitle,
            body: newQuestBody,
            status: true
        };

        // Добавляем новую задачу к выбранному дню
        calendar[selectedDayIndex].quests.push(newQuest);

        // Обновляем только выбранный день календаря в хранилище
        calendarData.calendar[selectedDayIndex] = calendar[selectedDayIndex];

        // Сохраняем обновленный календарь в localStorage
        localStorage.setItem('calendar', JSON.stringify(calendarData));

        // Обновляем интерфейс календаря
        displayCalendar(calendarData);

        // Отображаем список задач выбранного дня
        showTasksForSelectedDay(selectedDayIndex);
    }

    // Сбрасываем значения формы
    document.getElementById('newQuestTitle').value = '';
    document.getElementById('newQuestBody').value = '';
});






document.getElementById('newTaskBtn').addEventListener('click', function() {
    document.getElementById('addQuest').style.display = 'block';
});

document.getElementById('closeQuestBtn').addEventListener('click', function() {
    document.getElementById('addQuest').style.display = 'none';
});

// Функция для отображения списка задач выбранного дня
function showTasksForSelectedDay(selectedDayIndex) {
    const selectedDay = loadCalendar().calendar[selectedDayIndex];
    const questsList = document.getElementById('questsList');
    questsList.innerHTML = ''; // Очищаем содержимое списка задач

    // Перебираем задачи выбранного дня и добавляем их в список
    selectedDay.quests.forEach((quest, index) => {
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item');

        // Создаем чекбокс и добавляем его в элемент списка задач
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = quest.status; // Устанавливаем состояние чекбокса в соответствии со статусом задачи
        checkbox.addEventListener('change', function() {
            // Обработчик изменения состояния чекбокса для обновления статуса задачи
            quest.status = this.checked;
            // Сохраняем обновленные данные в localStorage
            const calendarData = loadCalendar();
            calendarData.calendar[selectedDayIndex] = selectedDay;
            localStorage.setItem('calendar', JSON.stringify(calendarData))
            displayCalendar(calendarData);
        });

        listItem.appendChild(checkbox);

        // Добавляем текст задачи
        const taskText = document.createElement('span');
        taskText.innerHTML = `<strong>${quest.number}:</strong> ${quest.title} - ${quest.body}`;
        listItem.appendChild(taskText);

        questsList.appendChild(listItem);
    });
}


// Получение текущей даты
const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth();
// Сохранение текущего месяца и года в localStorage
localStorage.setItem('currentYear', currentYear);
localStorage.setItem('currentMonth', currentMonth);

// Генерация и отображение календаря
let calendar;
if (localStorage.getItem('calendar')) {
    calendar = loadCalendar();
} else {
    calendar = generateCalendar(currentYear, currentMonth);
    localStorage.setItem('calendar', JSON.stringify(calendar));
}
// Загрузка календаря
displayCalendar(calendar);

// Функция для загрузки календаря из localStorage
function loadCalendar() {
    const storedCalendar = localStorage.getItem('calendar');
    if (storedCalendar) {
        return JSON.parse(storedCalendar); // Преобразование строки JSON в объект
    } else {
        return generateCalendar(parseInt(localStorage.getItem('currentYear')), parseInt(localStorage.getItem('currentMonth')));
    }
}

// Функция для сохранения статуса задач в localStorage
function saveTaskStatus(day) {
    localStorage.setItem(`tasks_${day.number}`, JSON.stringify(day.quests));
}

// Получаем выбранный день из localStorage
const selectedDayIndex = parseInt(localStorage.getItem('selectedDayIndex'));




const weatherValueElement = document.getElementById('weatherValue');

// URL API для отримання даних про погоду
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=50.45&lon=30.52&appid=174ab0c207cb0008ab325f7fed51ce6c&units=metric';

// Функція для отримання даних про погоду та оновлення значення температури
async function updateWeather() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Извлекаем значение температуры из полученных данных
        const temperature = data.main.temp;

        // Обновляем содержимое элемента на странице с id "weatherValue"
        weatherValueElement.textContent =  "in Kyiv: " + temperature.toFixed(1) + ' °C'; // Округляем температуру до одного знака после запятой и добавляем символ градуса
    } catch (error) {
        console.error('Ошибка получения данных о погоде:', error);
    }
}

updateWeather();


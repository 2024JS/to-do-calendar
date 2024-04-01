import {showTasksForSelectedDay} from './quests.js';
const selectedDayIndex = parseInt(localStorage.getItem('selectedDayIndex'));
const getDayOfWeek = (year, month, day) => new Date(year, month, day).getDay();

const displayCurrentDate = () => {
    const currentDate = new Date();
    const optionsTime = {hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false};
    const formattedTime = currentDate.toLocaleTimeString('en-US', optionsTime);
    const displayDateTime = `${currentDate.getDate()} ${currentDate.toLocaleString('en-US', 
        {month: 'long'})} ${currentDate.getFullYear()} - ${formattedTime}`;
    document.querySelector('.toDay').textContent = displayDateTime;
}

displayCurrentDate();
setInterval(displayCurrentDate, 1000);

class Day {
    constructor(number, dayOfWeek) {
        this.number = number;
        this.dayOfWeek = dayOfWeek;
        this.quests = [];
    }
    addQuest(questNumber, questTitle, questBody) {
        this.quests.push({number: questNumber, title: questTitle, body: questBody, status: true});
    }
}

// Генерація календаря для заданого місяця та року
function generateCalendar(year, month) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const calendar = [];
    let nullDivDays = 0;
    const firstDayOfWeek = getDayOfWeek(year, month, 0); // Визначення дня тижня для 1 числа місяця
    // Додавання порожніх днів на початку місяця
    for (let i = 1; i < firstDayOfWeek; i++) {
        calendar.push(null); // Добавляем null вместо объекта Day
        nullDivDays++;       
    }
    // Додавання днів місяця
    for (let i = 1; i <= daysInMonth; i++) {
        const dayOfWeek = getDayOfWeek(year, month, i);
        const day = new Day(i, dayOfWeek);
        calendar.push(day);
    }
    
    return {calendar, nullDivDays};
}

export function displayCalendar(calendarData) {
    const calendarContainer = document.getElementById('calendarContainer');
    calendarContainer.innerHTML = '';
    const { calendar, nullDivDays } = calendarData;

    calendar.forEach((day, index) => {
        const dayElement = document.createElement('div');
        dayElement.classList.add('day');

        if (day !== null) {
            const dayNumberElement = document.createElement('span'); // Створюємо елемент для відображення номера дня
            dayNumberElement.textContent = day.number; // Встановлюємо текст елемент номера дня
            dayElement.appendChild(dayNumberElement); // Додаємо елемент номера дня до елемента дня

            if (day.number === new Date().getDate()) {
                dayElement.classList.add('today');
            }

            const activeQuests = day.quests.filter(quest => quest.status === true);

            // Якщо є активні завдання, додаємо елемент для відображення їх кількості
            if (activeQuests.length > 0) {
                dayElement.classList.add('has-quests');
                // Створюємо елемент для відображення кількості завдань
                const questsCountElement = document.createElement('span');
                questsCountElement.textContent = `${activeQuests.length}`; // Устанавливаем текст элемента количества задач
                questsCountElement.classList.add('quests-count'); // Добавляем класс для применения стилей
                dayElement.appendChild(questsCountElement); // Добавляем элемент количества задач к элементу дня
            }
            // Враховуємо кількість порожніх днів при обчисленні реального індексу
            const realIndex = index - nullDivDays;

            dayElement.addEventListener('click', function () {
                showTasksForSelectedDay(realIndex);
                localStorage.setItem('selectedDayIndex', realIndex);
                // Видалення класу 'lookingNow' у всіх днів
                document.querySelectorAll('.day').forEach(day => {
                    day.classList.remove('lookingNow');
                });
                dayElement.classList.add('lookingNow');
            });
        }
        calendarContainer.appendChild(dayElement);
    });
}

const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth();

localStorage.setItem('currentYear', currentYear);
localStorage.setItem('currentMonth', currentMonth);

// Функція завантаження календаря з localStorage
export function loadCalendar() {
    const storedCalendar = localStorage.getItem('calendar');
    if (storedCalendar) {
        return JSON.parse(storedCalendar);
    } else {
        return generateCalendar(parseInt(localStorage.getItem('currentYear')), parseInt(localStorage.getItem('currentMonth')));
    }
}
// Генерація та відображення календаря
let calendar;
if (localStorage.getItem('calendar')) {
    calendar = loadCalendar();
} else {
    calendar = generateCalendar(currentYear, currentMonth);
    localStorage.setItem('calendar', JSON.stringify(calendar));
}

displayCalendar(calendar);

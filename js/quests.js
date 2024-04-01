import { loadCalendar, displayCalendar } from './calendar.js';

// Обробник події для кнопки додавання нового завдання
document.getElementById('addQuestBtn').addEventListener('click', function (event) {
    event.preventDefault();
    // Отримуємо дані нового завдання з форми
    const newQuestTitle = document.getElementById('newQuestTitle').value;
    const newQuestBody = document.getElementById('newQuestBody').value;
    // Отримуємо поточний обраний день із localStorage
    const selectedDayIndex = parseInt(localStorage.getItem('selectedDayIndex'));
    // Перевіряємо, чи обраний день
    if (!isNaN(selectedDayIndex)) {
        // Получаем массив календаря из localStorage только один раз перед началом обработки события
        const calendarData = loadCalendar();
        const calendar = calendarData.calendar;
        // Створюємо нове завдання
        const newQuest = {
            number: calendar[selectedDayIndex].quests.length + 1,
            title: newQuestTitle,
            body: newQuestBody,
            status: true
        };

        // Додаємо нове завдання до вибраного дня
        calendar[selectedDayIndex].quests.push(newQuest);
        // Оновлюємо лише вибраний день календаря у сховищі
        calendarData.calendar[selectedDayIndex] = calendar[selectedDayIndex];
        // Зберігаємо оновлений календар у localStorage
        localStorage.setItem('calendar', JSON.stringify(calendarData));
        // Оновлюємо інтерфейс календаря
        displayCalendar(calendarData);
        // Відображаємо список завдань вибраного дня
        showTasksForSelectedDay(selectedDayIndex);
    }
    // Скидаємо значення форми
    document.getElementById('newQuestTitle').value = '';
    document.getElementById('newQuestBody').value = '';
});

document.getElementById('newTaskBtn').addEventListener('click', function () {
    document.getElementById('addQuest').style.display = 'block';
});

document.getElementById('closeQuestBtn').addEventListener('click', function () {
    document.getElementById('addQuest').style.display = 'none';
});

// Функція для відображення списку завдань вибраного дня
export function showTasksForSelectedDay(selectedDayIndex) {
    const selectedDay = loadCalendar().calendar[selectedDayIndex];
    const questsList = document.getElementById('questsList');
    questsList.innerHTML = ''; // Очищаємо вміст списку завдань

    // Перебираємо завдання обраного дня та додаємо їх до списку
    selectedDay.quests.forEach((quest, index) => {
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item');
        // Створюємо чекбокс і додаємо його до елементу списку завдань
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        // Встановлюємо стан чекбоксу відповідно до статусу завдання
        checkbox.checked = quest.status;
        checkbox.addEventListener('change', function () {
            // Обробник зміни стану чекбоксу для оновлення статусу завдання
            quest.status = this.checked;
            // Зберігаємо оновлені дані в localStorage
            const calendarData = loadCalendar();
            calendarData.calendar[selectedDayIndex] = selectedDay;
            localStorage.setItem('calendar', JSON.stringify(calendarData))
            displayCalendar(calendarData);
        });

        listItem.appendChild(checkbox);
        // Додаємо текст завдання
        const taskText = document.createElement('span');
        taskText.innerHTML = `<strong>${quest.number}:</strong> ${quest.title} - ${quest.body}`;
        listItem.appendChild(taskText);

        questsList.appendChild(listItem);
    });
}
 
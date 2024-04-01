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

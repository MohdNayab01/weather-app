const cityInput = document.querySelector('.city-input')
const searchBtn = document.querySelector('.search-btn')
const notFound = document.querySelector('.not-found')
const searchCiy = document.querySelector('.search-city')
const weatherInfo = document.querySelector('.weather-info')

const countryTxt = document.querySelector('.country-text');
const tempTxt = document.querySelector('.temp-text');
const conditionTxt = document.querySelector('.conditon-text');
const humidityTxt = document.querySelector('.Humdity-value-text');
const windspeedTxt = document.querySelector('.Wind-value-text');
const weatherSummaryImg = document.querySelector('.weather-summary-img');
const currentDateTxt = document.querySelector('.current-date-text');
const forecastItemContainer = document.querySelector('.forecast-item-container');





const apikey = 'b64c105cd8bbf5bcfa4b940e30f373df';

searchBtn.addEventListener('click', () => {
    if (cityInput.value.trim() != '') {
        updateWeatherInfo(cityInput.value);
        cityInput.value = '';
        cityInput.blur();
    }
})

cityInput.addEventListener('keydown', (e) => {
    if (e.key == 'Enter' &&
        cityInput.value.trim() != ''
    ) {
        updateWeatherInfo(cityInput.value);
        cityInput.value = '';
        cityInput.blur();
    }

})

async function getFetchData(endPoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apikey}&units=metric`
    const response = await fetch(apiUrl);
    return response.json();
}

function getWeatherIcon(id) {
    if (id <= 232) return 'thunderstorm.svg'
    if (id <= 321) return 'drizzle.svg'
    if (id <= 531) return 'rain.svg'
    if (id <= 622) return 'snow.svg'
    if (id <= 781) return 'atmoshphere.svg'
    if (id <= 800) return 'clear.svg'
    else return 'clouds.svg'
}
function getCurentDate() {
    const currentdate = new Date()
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    }
    return currentdate.toLocaleDateString('en-GB', options);
}

async function updateWeatherInfo(city) {
    const weatherData = await getFetchData('weather', city);
    if (weatherData.cod != 200) {
        showDisplaySection(notFound);
        return
    }

    const {
        name: country,
        main: { temp, humidity },
        weather: [{ id, main }],
        wind: { speed }
    } = weatherData
    console.log(weatherData);

    countryTxt.textContent = country;
    humidityTxt.textContent = humidity + '%'
    windspeedTxt.textContent = speed + 'M/s'
    tempTxt.textContent = Math.floor(temp) + '°C';

    currentDateTxt.textContent = getCurentDate();
    weatherSummaryImg.src = `assets/weather/${getWeatherIcon(id)}`
    conditionTxt.textContent= main
    await updateForecastsInfo(city)
    showDisplaySection(weatherInfo);
}

async function updateForecastsInfo(city) {
    const forecastsData = await getFetchData('forecast', city);
    const timeTaken = '12:00:00'
    const todayDate = new Date().toISOString().split('T')[0]

    forecastItemContainer.innerHTML = ''
    forecastsData.list.forEach(forecastWeather => {
        if (forecastWeather.dt_txt.includes(timeTaken) && !forecastWeather.dt_txt.includes(todayDate)
        ) {
            updateForecastsItems(forecastWeather)
        }
    })

}

function updateForecastsItems(weatherData) {
    const {
        dt_txt: date,
        weather: [{ id }],
        main: { temp }
    } = weatherData
    const datetaken = new Date(date)
    const dateOption = {
        day: '2-digit',
        month: 'short',

    }
    const dateResult = datetaken.toLocaleDateString('en-US', dateOption)
    const forecastItem = `<div class="forecast-item">
                    <h5 class="forecast-item-data regular-text">${dateResult}</h5>
                    <img src="assets/weather/${getWeatherIcon(id)}" alt="" class="forecast-item-img">
                    <h5 class="forecast-item-temp">${Math.floor(temp)}℃ </h5>
                </div>`
    forecastItemContainer.insertAdjacentHTML('beforeend', forecastItem);
}

function showDisplaySection(section) {
    [weatherInfo, searchCiy, notFound]
        .forEach(section => section.style.display = 'none');
    section.style.display = 'flex';
}
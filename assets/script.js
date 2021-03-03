const API_KEY = 'b5cc15167e821f3fea3ca413eaaa5cd2';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather'
const searchCityInputEl = document.getElementById('search-city');
const searchBtnEl = document.getElementById('search-btn');
const cityWeatherEl = document.getElementById('city-weather');

// TODO search form handler to get the city from user form input
const handleSearchForm = function() {

    // Uncomment when element is added to html
    // if (!searchCityInputEl) {
    //     displaySearchMsg('Error: please include the city name!');
    //     return
    // }

    const city = searchCityInputEl.value;
    const cityWeatherApiUrl = WEATHER_API_URL + '?q=' + city + '&units=imperial' + '&appid=' + API_KEY;
    // fetch weather
    fetch(cityWeatherApiUrl)
        .then(function(response) {
            return response.json();
        }).then(function(data) {
            // display city weather details
            displayCityWeather(data);
            // display city 5 day forecast
            console.log(data);
        })
    
}

const displayCityWeather = function(weatherData) {
    const date = moment().format('MM[/]DD[/]YYYY'); 
    const weatherIcon = weatherData.weather[0].icon;
    cityWeatherEl.innerHTML = `
        <h2>${weatherData.name} (${date}) <span><img src="http://openweathermap.org/img/wn/${weatherIcon}.png"></span></h2>
        <p>Temperature: ${weatherData.main.temp} &#176;F</p>
        <p>Humidity: ${weatherData.main.humidity}%</p>
        <p>Wind Speed: ${weatherData.wind.speed} MPH</p>
        `
}

const displayCityForecast = function() {
    // do something
}
     
// TODO search button event listener
searchBtnEl.addEventListener('click', handleSearchForm);

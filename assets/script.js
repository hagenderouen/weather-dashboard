const API_KEY = 'b5cc15167e821f3fea3ca413eaaa5cd2';
const CITY_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather'
const searchCityInputEl = document.getElementById('search-city');
const searchBtnEl = document.getElementById('search-btn');

// TODO search form handler to get the city from user form input
const handleSearchForm = function() {

    // Uncomment when element is added to html
    // if (!searchCityInputEl) {
    //     displaySearchMsg('Error: please include the city name!');
    //     return
    // }

    const city = searchCityInputEl.value;
    const cityWeatherApiUrl = CITY_WEATHER_URL + '?q=' + city + '&appid=' + API_KEY;
    // fetch weather
    fetch(cityWeatherApiUrl)
        .then(function(response) {
            return response.json();
        }).then(function(data) {
            // display city weather details
            // display city 5 day forecast
            console.log(data);
        })
    
}

// TODO display city weather details
const displayCityWeather = function() {
    // do soemthing
}

const displayCityForecast = function() {
    // do something
}
     
// TODO search button event listener
searchBtnEl.addEventListener('click', handleSearchForm);

const API_KEY = 'b5cc15167e821f3fea3ca413eaaa5cd2';
const WEATHER_API = 'https://api.openweathermap.org/data/2.5'
const searchCityInputEl = $('#search-city');
const searchBtnEl = $('#search-btn');
const cityWeatherEl = $('#city-weather');
const forecastEl = $('#forecast');
const searchedCitiesListEl = $('#searchedCities');

// TODO Needs error handling. input is empty? 404?
const handleSearchForm = function(event) {
    let city;

    if (event.target.id === 'search-btn') {
        city = searchCityInputEl.val();
    } else {
        city = $(event.target).text();
    }

    getWeather(city, '/weather', function(data) {
        displayCityWeather(data);
    });

    getWeather(city, '/forecast', function(data) {
        var forecastData = parseForecastData(data);
        console.log(forecastData);
        displayCityForecast(forecastData);
    });

    updateSearchedCities(city);
    displaySearchedCities();
    
    
}
 
// TODO Error handling 
const getWeather = function(city, route, callback) {
    const url = WEATHER_API + route + '?q=' + city + '&units=imperial' + '&appid=' + API_KEY;
    
    fetch(url)
        .then(function(response) {
            return response.json();
        }).then(function(data) {
            console.log(data);
            callback(data);
        });

}

const displayCityWeather = function(weatherData) {
    const date = moment().format('MM[/]DD[/]YYYY'); 
    const weatherIcon = weatherData.weather[0].icon;
    cityWeatherEl.append(`
        <h2>${weatherData.name} (${date}) <span><img src="http://openweathermap.org/img/wn/${weatherIcon}.png"></span></h2>
        <p>Temperature: ${weatherData.main.temp} &#176;F</p>
        <p>Humidity: ${weatherData.main.humidity}%</p>
        <p>Wind Speed: ${weatherData.wind.speed} MPH</p>
        `);
}

// Loops through forecast data, parses and displays it
const displayCityForecast = function(forecastData) {
    
    for (var i = 0; i < forecastData.length; i++) {
        let item = forecastData[i];
        let date = formatWeatherDate(item.dt_txt, 'MM[/]DD[/]YYYY');

        forecastEl.append(`
            <div class="col-auto">
                <div class="card">
                    <div class="card-body">
                        <h3 class="card-title">${date}</h3>
                        <p class="card-text"><span><img src="http://openweathermap.org/img/wn/${item.weather[0].icon}.png"></p>
                        <p class="card-text">Temperature: ${item.main.temp} &#176;F</p>
                        <p class="card-text">Humidity: ${item.main.humidity}%</p>
                    </div>
                </div>
            </div>
            `);
    }
    
}

const getSearchedCities = function() {
    let cities = JSON.parse(localStorage.getItem('searchedCities'));

    if (!cities) {
        cities = [];
    }

    return cities;
}
// TODO check if the city is unique before adding
const updateSearchedCities = function(city) {
    let cities = getSearchedCities();

    if (!cities) {
        cities = [city];
    } else {
        cities.push(city);
    }

    localStorage.setItem('searchedCities', JSON.stringify(cities));
}

const displaySearchedCities = function() {
    cities = getSearchedCities();
    
    for (var i = 0; i < cities.length; i++) {
        searchedCitiesListEl.append(`<li class="list-group-item">${cities[i]}</li>`);
    }
}

// Parses forecast data and returns an array of forecast objects for the next five days
const parseForecastData = function(data) {
    let fiveDayForecast = [];
    let forecastList = data.list;
    let checkDate = moment().add(1, 'days').format('YYYYMMDD');
    
    for (var i = 0; i < forecastList.length; i++) {
        
        let forecastDate = formatWeatherDate(forecastList[i].dt_txt, 'YYYYMMDD');

        if (forecastDate === checkDate) {
            fiveDayForecast.push(forecastList[i]);
            checkDate = moment(checkDate, 'YYYYMMDD').add(1, 'days').format('YYYYMMDD');
        }
    }

    return fiveDayForecast;
    
}

const formatWeatherDate = function(date, format) {
    return moment(date, 'YYYY[-]MM[-]DD').format(format);
}

searchBtnEl.on('click', handleSearchForm);
// TODO needs event target handling
searchedCitiesListEl.on('click', '.list-group-item', handleSearchForm);

displaySearchedCities();

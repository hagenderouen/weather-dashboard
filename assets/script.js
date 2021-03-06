const API_KEY = 'b5cc15167e821f3fea3ca413eaaa5cd2';
const WEATHER_API = 'https://api.openweathermap.org/data/2.5'
const searchCityInputEl = $('#search-city');
const searchBtnEl = $('#search-btn');
const cityWeatherEl = $('#city-weather');
const forecastEl = $('#forecast');
const searchedCitiesListEl = $('#searched-cities');
const searchMsgEl = $('#search-msg');

const handleSearchForm = function(event) {
    searchMsgEl.empty();
    let city;

    // If the search button was clicked or enter key was pressed, set city var to the search input value.
    if (event.target.id === 'search-btn' || event.key === 'Enter') {
        city = searchCityInputEl.val();
        // Clears search input
        searchCityInputEl.val('');

        if (!city) {
            displayErrMsg('Please enter a city.');
            return;
        }
    // If an item in the cities list is clicked, sets the city var to the list item text. 
    } else if ($(event.target).parent('ul').attr('id') === 'searched-cities') {
        city = $(event.target).text();
    } else {
        return;
    }

    getWeather(city, '/weather', function(data) {
        
        getUvi(data.coord, function(uvi) {
            data.uvi = uvi;
            displayCityWeather(data);
            updateSearchedCities(city);
            displaySearchedCities();
        });
        
    });

    getWeather(city, '/forecast', function(data) {
        const forecastData = getFiveDayForecast(data);
        displayCityForecast(forecastData);
    });
    
    
}

const getWeather = function(city, route, callback) {
    const url = WEATHER_API + route + '?q=' + city + '&units=imperial' + '&appid=' + API_KEY;
    
    fetch(url)
        .then(handleErrors)
        .then(response => response.json())
        .then(data => callback(data))
        .catch(error => displayErrMsg(error));

}

const getUvi = function(coord, callback) {
    const url = WEATHER_API + '/onecall?' + 'lat=' + coord.lat + '&' + 'lon=' + coord.lon + '&exclude=hourly,daily' + '&appid=' + API_KEY;
    
    fetch(url)
        .then(handleErrors)
        .then(response => response.json())
        .then(data => callback(data.current.uvi))
        .catch(error => displayErrMsg(error));
}

const displayCityWeather = function(weatherData) {
    cityWeatherEl.empty();
    const date = moment().format('MM[/]DD[/]YYYY'); 
    const weatherIcon = weatherData.weather[0].icon;
    cityWeatherEl.append(`
        <div id="city-weather-border" class="my-1 p-1">
            <h2>${weatherData.name} (${date}) <span><img src="http://openweathermap.org/img/wn/${weatherIcon}.png"></span></h2>
            <p>Temperature: ${weatherData.main.temp} &#176;F</p>
            <p>Humidity: ${weatherData.main.humidity}%</p>
            <p>Wind Speed: ${weatherData.wind.speed} MPH</p>
            <p>UV Index: <span id="uv-index" class="p-2">${weatherData.uvi}</span></p>
        </div>
        `);

    const uviColor = getUvIndexColor(weatherData.uvi);
    // Sets black font color for visibility with the yellow background
    if (uviColor === 'yellow') {
        $('#uv-index').css('color', 'black');
    }

    $('#uv-index').css('background-color', uviColor);
}

const displayCityForecast = function(forecastData) {
    forecastEl.empty();

    forecastEl.append(`<h3>5-Day Forecast:</h3>`);
    
    for (var i = 0; i < forecastData.length; i++) {
        let item = forecastData[i];
        let date = formatWeatherDate(item.dt_txt, 'MM[/]DD[/]YYYY');

        forecastEl.append(`
            <div class="col-auto">
                <div class="card my-1">
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

const updateSearchedCities = function(searchedCity) {
    let cities = getSearchedCities();

    if (!cities) {
        cities = [city];
    } else {

        if (!isCityInSearchList(searchedCity)) {
            cities.push(searchedCity);
        } else {
            return;
        }

    }

    localStorage.setItem('searchedCities', JSON.stringify(cities));
}

const displaySearchedCities = function() {
    searchedCitiesListEl.empty();

    cities = getSearchedCities();

    for (var i = 0; i < cities.length; i++) {
        searchedCitiesListEl.append(`<li class="list-group-item city-item">${cities[i]}</li>`);
    }
    
}

const displayErrMsg = function(msg) {
    searchMsgEl.text(msg);
}

const isCityInSearchList = function(city) {
    let result = false;
    cities = getSearchedCities();

    for (var i = 0; i < cities.length; i++) {
        if (city === cities[i]) {
            result = true;
        }
    }
    
    return result;
}

// Parses forecast data and returns an array of forecast objects for the next five days
const getFiveDayForecast = function(data) {
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

const getUvIndexColor = function(uvi) {

    if (uvi < 3) {
        return 'green';
    } else if (uvi < 6) {
        return 'yellow';
    } else if (uvi < 8) {
        return 'orange';
    } else if (uvi < 11) {
        return 'red';
    } else if (uvi >= 11) {
        return 'purple';
    }

}

$(document).on('keypress', handleSearchForm);
searchBtnEl.on('click', handleSearchForm);
searchedCitiesListEl.on('click', '.list-group-item', handleSearchForm);

displaySearchedCities();

// ************** Utilities **********************************

const formatWeatherDate = function(date, format) {
    return moment(date, 'YYYY[-]MM[-]DD').format(format);
}

const handleErrors = function(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

// ************************************************************

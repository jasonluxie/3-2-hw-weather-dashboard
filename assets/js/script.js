let searchCityName = $("#search-city_name");
let searchCityButton = $("#search-city_btn");
let searchHistory = $("#search-history");
let weatherCurrent = $("#weather-current");
let weatherCurrentCity = $("#weather-current_city");
let weatherCurrentInfo = $("#weather-current_info");
let weatherFuture = $("#weather-future");
let modal = $(".modal");
let latitude;
let longitude;
const currentDate = luxon.DateTime.now();

//To add time to luxon date, use .plus(argument), by default argument is in milliseconds, but accepts object with specification

//API for opencagedata via cityname
//https://api.opencagedata.com/geocode/v1/json?q=PLACENAME&key=1103f44dccd54a9da1a21ae0d6e5939d
// If response.total_results == 0 then text is you must enter a valid location

//API for openweathermap via latitude and logitude
// https://api.openweathermap.org/data/2.5/onecall?lat=50.98&lon=11.33&exclude=minutely,hourly,alerts&appid=bd3eeed040d34d406331ccfe15a926a1
// For weather icons: "http://openweathermap.org/img/wn/{icon-code}@2x.png"

searchCityButton.on("click", showCurrentWeather);

function showCurrentWeather() {
    if (searchCityName.val() == "") {
        return alert("You have to input a city name");
    }
    getCoordinates(searchCityName.val());
}

function showFutureWeather() {}

function getCoordinates(cityname) {
    $.ajax({
        url:
            "https://api.opencagedata.com/geocode/v1/json?q=" +
            cityname +
            "&key=1103f44dccd54a9da1a21ae0d6e5939d",
        method: "GET",
    }).then(function (response) {
        // Modal validation for text name
        // if (response.total_results <= 0) {
        //     modal.addClass('is-active')
        // }
        // console.log(response.total_results)
        latitude = response.results[0].geometry.lat;
        longitude = response.results[0].geometry.lng;
        cityData(latitude, longitude);
    });
}

function cityData(lat, lon) {
    $.ajax({
        url:
            "https://api.openweathermap.org/data/2.5/onecall?lat=" +
            lat +
            "&lon=" +
            lon +
            "&units=imperial&exclude=minutely,hourly,alerts&appid=bd3eeed040d34d406331ccfe15a926a1",
        method: "GET",
    }).then(function (response) {
        console.log(response);
        // console.log(response.current.weather[0].icon)
        let cityName = searchCityName.val();
        searchCityName.val("")
        weatherCurrentCity.html(
            cityName +
                "(" +
                currentDate.toLocaleString() +
                ")" +
                "<img src=http://openweathermap.org/img/wn/" +
                response.current.weather[0].icon +
                "@2x.png>"
        );
        weatherCurrentInfo.html(
            "<li>Temp: " + response.current.temp + " F</li>" +
            "<li>Wind: " + response.current.wind_speed +" MPH</li>" +
            "<li>Humidity: " + response.current.humidity + " %</li>" +
            "<li id=\"uv-index\">UV Index: " + response.current.uvi + "</li>"
        );
    });
}

function saveSearches() {}

// getCoordinates("Houston");
// showCurrentWeather();

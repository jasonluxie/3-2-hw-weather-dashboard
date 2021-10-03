let searchCityName = $("#search-city_name");
let searchCityButton = $("#search-city_btn");
let searchHistory = $("#search-history");
// let weatherCurrent = $("#weather-current");
let weatherCurrentCity = $("#weather-current_city");
let weatherCurrentInfo = $("#weather-current_info");
// let weatherFuture = $("#weather-future");
let weatherFutureTitle = $("#weather-future_header");
let weatherFutureCards = $("#weather-future_cards");
let searchButtonCity = "";
let latitude;
let longitude;
const currentDate = luxon.DateTime.now();

searchCityButton.on("click", showCurrentWeather);
searchHistory.on("click", "button", searchButton);

function showCurrentWeather() {
    if (searchCityName.val() == "") {
        return alert("You have to input a city name");
    }

    getCoordinates(searchCityName.val());
}

function searchButton(event) {
    searchButtonCity = $(event.target).text();
    getCoordinates($(event.target).text());
}

function getCoordinates(cityname) {
    $.ajax({
        url:
            "https://api.opencagedata.com/geocode/v1/json?q=" +
            cityname +
            "&key=1103f44dccd54a9da1a21ae0d6e5939d",
        method: "GET",
    }).then(function (response) {
        if (response.total_results <= 0) {
            return alert("Please enter a valid city name");
        }
        saveSearches(cityname);
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
        //Weather Current Generation
        let cityName = "";
        if (searchCityName.val()) {
            cityName = searchCityName.val();
        } else cityName = searchButtonCity;
        searchCityName.val("");
        weatherCurrentCity.html(
            cityName +
                "(" +
                currentDate.toLocaleString() +
                ")" +
                '<img class="image is-64x64" src=http://openweathermap.org/img/wn/' +
                response.current.weather[0].icon +
                "@2x.png>"
        );
        weatherCurrentInfo.html(
            "<li>Temp: " +
                response.current.temp +
                " F</li>" +
                "<li>Wind: " +
                response.current.wind_speed +
                " MPH</li>" +
                "<li>Humidity: " +
                response.current.humidity +
                " %</li>" +
                "<li>UV Index: " +
                '<span class="uv-index px-2">' +
                response.current.uvi +
                "</span>" +
                "</li>"
        );
        let cardWrapper = document.querySelector("#weather-current_wrapper");
        cardWrapper.classList.add("card-wrapper");
        let uvColor = document.querySelector(".uv-index");
        if (uvColor.textContent <= 2.5) {
            uvColor.classList.add("green");
        } else if (uvColor.textContent <= 5.5 && uvColor.textContent > 2.5) {
            uvColor.classList.add("yellow");
        } else if (uvColor.textContent <= 7.5 && uvColor.textContent > 5.5) {
            uvColor.classList.add("orange");
        } else if (uvColor.textContent <= 10.5 && uvColor.textContent > 7.5) {
            uvColor.classList.add("red");
        } else uvColor.classList.add("purple");
        //5-Day Forcast
        if (weatherFutureTitle.hasClass("is-hidden")) {
            weatherFutureTitle.toggleClass("is-hidden");
        }
        weatherFutureCards.html("");
        for (i = 1; i <= 5; i++) {
            let weatherCard = $(
                '<div class="weather-card column is-narrow mr-3 has-text-info-light has-background-info is-size-5">' +
                    '<h3 class="has-text-weight-semibold">' +
                    currentDate.plus({ days: i }).toLocaleString() +
                    "</h3>" +
                    "<ul>" +
                    '<img class="image is-64x64" src=http://openweathermap.org/img/wn/' +
                    response.daily[i].weather[0].icon +
                    "@2x.png>" +
                    "<li>Temp: " +
                    response.daily[i].temp.day +
                    " F</li>" +
                    "<li>Wind: " +
                    response.daily[i].wind_speed +
                    " MPH</li>" +
                    "<li>Humidity: " +
                    response.daily[i].humidity +
                    " %</li>" +
                    +"</ul></div>"
            );
            weatherFutureCards.append(weatherCard);
        }
    });
}

function saveSearches(cityname) {
    if (searchHistory.children().length >= 8) {
        searchHistory.children().last().remove();
    }
    let searchHistoryButton = $(
        '<button class="button is-light is-medium column is-full search-button mb-2">' +
            cityname +
            "</button>"
    );
    searchHistory.prepend(searchHistoryButton);
    localStorage.setItem("searchHistory", searchHistory.html());
}

function showSearches() {
    let savedSearch = localStorage.getItem("searchHistory");
    if (savedSearch) {
        searchHistory.html(savedSearch);
    }
}

showSearches();

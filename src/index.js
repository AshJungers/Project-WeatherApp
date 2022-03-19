//Date & Time
let now = new Date();

let currentDate = document.querySelector("#currentDate");

let date = now.getDate();
let hour = now.getHours();
if (hour < 10) {
  hour = `0${hour}`;
}
let minutes = now.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}
let year = now.getFullYear();

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let day = days[now.getDay()];
let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

let month = months[now.getMonth()];

currentDate.innerHTML = `${day}, ${month} ${date}, ${year} ${hour}:${minutes}`;

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = '<div class="row justify-content-evenly">';
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `
       <div class="col-sm-2">
         <div class="card">
           <div class="card-body shadow">
             <h5 class="card-title">${formatDay(forecastDay.dt)}</h5>
             
             <hr />
             <img src="http://openweathermap.org/img/wn/${
               forecastDay.weather[0].icon
             }@2x.png" alt="" />

             <p class="card-text">
               <span class="higher-temp">${Math.round(
                 forecastDay.temp.max
               )}°</span> |
               <span class="lower-temp">${Math.round(
                 forecastDay.temp.min
               )}°</span>
             </p>
           </div>
         </div>
       </div>
   `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

//Weather Search / API Integration
function getForecast(coordinates) {
  let apiKey = "9bb74b1dc4de007633995209b021f02e";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&
  units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayWeather(response) {
  let wind = Math.round(response.data.wind.speed);
  let windSpeed = document.querySelector("#wind");
  let humidity = response.data.main.humidity;
  let currentHumidity = document.querySelector("#humidity");
  let description = response.data.weather[0].main;
  let currentDescription = document.querySelector("#description");
  let iconElement = document.querySelector("#weatherPic");

  document.querySelector("#currentCity").innerHTML = response.data.name;
  document.querySelector("#temperature").innerHTML =
    Math.round(celsiusTemperature);
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;

  windSpeed.innerHTML = `Wind: ${wind} mph`;
  currentHumidity.innerHTML = `Humidity: ${humidity}%`;
  currentDescription.innerHTML = description;

  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);

  celsiusTemperature = response.data.main.temp;
}
function searchCity(city) {
  let apiKey = "9bb74b1dc4de007633995209b021f02e";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeather);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#search-text-input").value;
  searchCity(city);
}

function searchLocation(position) {
  let apiKey = "9bb74b1dc4de007633995209b021f02e";
  let positionApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;
  axios.get(positionApiUrl).then(displayWeather);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

document
  .querySelector("#current-location-button")
  .addEventListener("click", getCurrentLocation);

//Fahrenheit and Celsius

function convertToFahrenheit(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

function convertToCelsius(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

let celsiusTemperature = null;

let searchForm = document.querySelector("#searchform");
searchForm.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", convertToFahrenheit);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", convertToCelsius);

searchCity("Denver");

// code used to evenly distribute the rows <div class="row justify-content-evenly" id="forecast">

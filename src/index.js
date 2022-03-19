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

function displayForecast() {
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = '<div class="row justify-content-evenly">';
  let days = ["Sun", "Mon", "Tue", "Wed", "Thur"];
  days.forEach(function (day) {
    forecastHTML =
      forecastHTML +
      `
       <div class="col-sm-2">
         <div class="card">
           <div class="card-body shadow">
             <h5 class="card-title">${day}</h5>
             <hr />
             <img src="images/snow.png" alt="snow" class="snow-icon" />

             <p class="card-text">
               <span class="higher-temp">16°</span> |
               <span class="lower-temp">0°</span>
             </p>
           </div>
         </div>
       </div>
   `;
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

//Weather Search / API Integration
function displayWeather(response) {
  document.querySelector("#currentCity").innerHTML = response.data.name;
  document.querySelector("#temperature").innerHTML =
    Math.round(celsiusTemperature);
  let wind = Math.round(response.data.wind.speed);
  let windSpeed = document.querySelector("#wind");
  windSpeed.innerHTML = `Wind: ${wind} mph`;

  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  let humidity = response.data.main.humidity;
  let currentHumidity = document.querySelector("#humidity");
  currentHumidity.innerHTML = `Humidity: ${humidity}%`;

  let description = response.data.weather[0].main;
  let currentDescription = document.querySelector("#description");
  currentDescription.innerHTML = description;

  let iconElement = document.querySelector("#weatherPic");
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

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
  let positionApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&&units=metric`;
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
displayForecast();

// code used to evenly distribute the rows <div class="row justify-content-evenly" id="forecast">

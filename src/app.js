function getAPIkey() {
  //  if (document.URL.startsWith("https://")) {
  //    apiKey = netlifyconfig.SECRET_API_KEY;
  //  } else {
  apiKey = localconfig.SECRET_API_KEY;
  //  }
  if (apiKey == "") console.warn("No API key discovered");
}

//changes the current info of the submited city

function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (hours < 10) {
    minutes = `0${hours}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tueday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `Last updated: ${day} ${hours}:${minutes}`;
}

// forecast function

function getForecast(coordinates) {
  //console.warn(apiKey);
  if (apiKey == "") getAPIkey();
  let unit = "metric";
  let apiUrlForecast = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.longitude}&lat=${coordinates.latitude}&key=${apiKey}&units=${unit}`;

  axios.get(apiUrlForecast).then(displayForecast);
}

//changes all the data of submitted city

function displayTemp(response) {
  celciusTemperature = response.data.temperature.current;
  document.querySelector("#city").innerHTML = response.data.city;
  document.querySelector("#description").innerHTML =
    response.data.condition.description;
  document.querySelector("#temperature").innerHTML =
    convertTemp(celciusTemperature);

  document.querySelector("#humidity").innerHTML =
    response.data.temperature.humidity;
  document.querySelector("#wind-speed").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#pressure").innerHTML =
    response.data.temperature.pressure;
  document.querySelector("#date").innerHTML = formatDate(
    response.data.time * 1000
  );

  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `https://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );
  iconElement.setAttribute("alt", response.data.condition.description);

  getForecast(response.data.coordinates);
}

// API

function search(city) {
  //console.warn(apiKey);
  if (apiKey == "") getAPIkey();
  let apiEndpoint = "https://api.shecodes.io/weather/v1/current?";
  let unit = "metric";
  let apiUrl = `${apiEndpoint}query=${city}&key=${apiKey}&units=${unit}`;
  axios.get(apiUrl).then(displayTemp);
}

//function that handles the city name in input form

function handleSubmit(event) {
  event.preventDefault();
  document.querySelector("#city-input").value;
  search(document.querySelector("#city-input").value);
}

function handleEmptySubmit() {
  search(document.querySelector("#city").value);
}

//conversion to Fahrenheit

function convertTemp(currentTemp) {
  // if celsius active, return celsius
  if (celciusLink.classList.contains("active")) return Math.round(currentTemp);
  // else return fahrenheit
  return Math.round((currentTemp * 9) / 5 + 32);
}

function displayFahrenheitTemp(event) {
  event.preventDefault();
  celciusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  document.querySelector("#temperature").innerHTML =
    convertTemp(celciusTemperature);
  //update week forecast
  search(document.querySelector("#city").innerHTML);
}

//back to Celcius

function displayCelciusTemp(event) {
  event.preventDefault();
  celciusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  document.querySelector("#temperature").innerHTML =
    convertTemp(celciusTemperature);
  //update week forecast
  search(document.querySelector("#city").innerHTML);
}

//find your location

function handlePosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiEndpoint = "https://api.shecodes.io/weather/v1/current?";
  if (apiKey == "") getAPIkey();
  let unit = "metric";
  let apiUrlLocal = `${apiEndpoint}lon=${longitude}&lat=${latitude}&key=${apiKey}&units=${unit}`;
  axios.get(apiUrlLocal).then(displayTemp);
}

function getYourLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(handlePosition);
}

//global

let locationButton = document.querySelector(".btn-success");
locationButton.addEventListener("click", getYourLocation);

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let celciusLink = document.querySelector("#celcius-link");
celciusLink.addEventListener("click", displayCelciusTemp);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemp);

let celciusTemperature = null;

let apiKey = "";

//display forecast for several days

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row forecast-class">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 7) {
      forecastHTML += `           
              <div class="col-1 forecast-box">
                <div class="weather-forecast-day">${formatDay(
                  forecastDay.time
                )}</div>
                <img
                  src="https://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
                    forecastDay.condition.icon
                  }.png"
                  width="38px"
                  alt=""
                />
                <span class="weather-forecast-temp-max">${Math.round(
                  convertTemp(forecastDay.temperature.maximum)
                )}°</span
                ><span class="weather-forecast-temp-min">${Math.round(
                  convertTemp(forecastDay.temperature.minimum)
                )}°</span>
              </div>            
            `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

//this function on load with random city

search("Brno");

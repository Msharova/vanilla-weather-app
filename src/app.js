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
  return `Last updated on ${day} ${hours}:${minutes}`;
}

function displayTemp(response) {
  document.querySelector("#city").innerHTML = response.data.city;
  document.querySelector("#description").innerHTML =
    response.data.condition.description;
  document.querySelector("#temperature").innerHTML = Math.round(
    response.data.temperature.current
  );
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
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );
  iconElement.setAttribute("alt", response.data.condition.description);
}

// API
function search(city) {
  let apiKey = "70bb37b84aobtb35a69f8896391b01b3";
  let apiEndpoint = "https://api.shecodes.io/weather/v1/current?";
  let unit = "metric";
  let apiUrl = `${apiEndpoint}query=${city}&key=${apiKey}&units=${unit}`;
  axios.get(apiUrl).then(displayTemp);
}

//function that handles the city name in input form

function handleSubmit(event) {
  event.preventDefault();
  console.log(document.querySelector("#city-input").value);
  search(document.querySelector("#city-input").value);
}

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

//this function on load with random city

search("Seattle");

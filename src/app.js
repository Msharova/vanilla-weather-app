//changes the current info of the submited city

function displayTemp(response) {
  console.log(response.data);
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
}

// API

let apiKey = "70bb37b84aobtb35a69f8896391b01b3";
let apiEndpoint = "https://api.shecodes.io/weather/v1/current?";
let city = "Seattle";
let unit = "metric";
let apiUrl = `${apiEndpoint}query=${city}&key=${apiKey}&units=${unit}`;
console.log(apiUrl);
axios.get(apiUrl).then(displayTemp);

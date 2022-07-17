// change background acording to time 
const currenttime= new Date().getHours();
if(currenttime>5&&currenttime<=16){
   document.body.style.backgroundImage = 'url("./img/bg/morning.jpg")';
}
else if(currenttime>16 && currenttime<=19)
{
    document.body.style.backgroundImage = 'url("./img/bg/sunset.jpg")';
}
else{
    document.body.style.backgroundImage = 'url("./img/bg/night.jpg")';
}

const element = (e) => document.querySelector(e);
//get loader div 
const loader = element("#loading");
let skeletons = document.querySelectorAll(".skeleton");

function displayLoading() {
  loader.classList.add("display");
  setTimeout(() => {
    loader.classList.remove("display");
  }, 1500);

  for (const skeleton of skeletons) {
    skeleton.innerHTML = "";
   skeleton.classList.add("skeleton-loader");
  }
}

function hideLoading() {
  loader.classList.remove("display");

  for (const skeleton of skeletons) {
    skeleton.classList.remove("skeleton-loader");
  }
}

function showError(message) {
  const status = document.getElementById("status");
  status.style.opacity = ".7";
  status.innerHTML = `<i class='fa fa-exclamation-circle'></i>   ${message}`;
  setTimeout(() => (status.style.opacity = "0"), 4000);
}


let weather = {
  apiKey: "45e7b161462fc5f8a8d85a7cd65f211b",

  fetchWeather: function (city, lat, lon) {
    displayLoading();

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lat=${lat}&lon=${lon}&appid=${this.apiKey}`)
      .then((response) => response.json())
      .then((data) => this.displayWeather(data))
      .catch((error) => this.handleErrors(error));
  },
//Default
  displayWeather: function (data) {
    const { name } = data;
    const {description } = data.weather[0];
    const { temp, temp_min, temp_max, feels_like, humidity, pressure } = data.main;
    const { speed } = data.wind;
    const { country } = data.sys;

    element("#city").innerText = name;
    element("#temp").innerText = `${Math.floor(temp)}°C`;
    element("#feels-like").innerText = feels_like + " °C";
    element("#country").innerText = country;
    element("#humidity").innerText = humidity + "%";
    element("#wind").innerText = speed + " km/h";
    element("#pressure").innerText = pressure;
    element("#temp-min").innerText = temp_min + "°C";
    element("#temp-max").innerText = temp_max + "°C";
    element("#description").innerText = description;

    hideLoading();
  },

  search: function () {
    this.fetchWeather(element(".search-bar").value);
  },

  getUserLocation: function () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          this.fetchWeather("", latitude, longitude);
        },
        (err) => {
          console.error(err);
          showError("can't get current location");
          this.fetchWeather("Cairo");
        },
        { timeout: 15000 }
      );
    } else {
      showError("Your browser doesn't support geolocation!");
    }
  },

  handleErrors: () => {
    hideLoading();

    element("#country").innerHTML = `<img class="error-symbol" src="./img/error.png">`;
    element("#description").innerText="Please enter a right name of country";
    if (!navigator.onLine) {
      showError("you are offline");
    } else if (element(".search-bar").value == "") {
      showError("search bar is empty");
    } else {
      showError("can't get data");
    }
  },
};

element(".search button").onclick = () => weather.search();

element(".search-bar").onkeyup = (event) => {
  if (event.key === "Enter") weather.search();
};

//get user location
weather.getUserLocation();

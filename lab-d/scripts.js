
//podalem linka ChatPT do strony openweather  poprosilem by wytlumaczyl komendy jak napisac jaks funckje
//na poczatku zle zrozumialem zadanie i pobieralem tylko jeden pomiar na kazdy dzien.
// Poprosilem chatGPT o wygenerowanie, poprawienie kodu na 5 dni co 3 godziny i wytlumaczenie mi go krok po kroku
const API_KEY ="ab3febbd4f6e53d76ed84de61b7a71f7"

const button = document.getElementById("weatherBtn");
const input = document.getElementById("cityInput");

function getWeather() {
  const errorMessage = document.getElementById("errorMessage");
  errorMessage.textContent = "";
  const city = input.value.trim() || "Szczecin";
  if (city === "") {
    alert("Please enter a city name.");
    return;
  }
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=pl`;

  const xhr = new XMLHttpRequest()
  xhr.open("GET", url, true);
  xhr.onload = function(){

    if (xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      // Data i godzina aktualnego pomiaru
      const currentDate = new Date((data.dt + data.timezone) * 1000);

      document.getElementById("currentDate").textContent =
        currentDate.toLocaleString("pl-PL", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "UTC"
        });
      const icon = document.getElementById("weatherIcon");
      icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      icon.alt = data.weather[0].description;
      icon.hidden = false;
      document.getElementById("cityName").textContent = data.name;
      document.getElementById("temperature").textContent = `${Math.round(data.main.temp)}°C`;
      document.getElementById("feelsLike").textContent =`Odczuwalna: ${Math.round(data.main.feels_like)}°C`;
      document.getElementById("description").textContent = `Warunki: ${data.weather[0].description}`;
      document.getElementById("humidity").textContent = `Wilgotność: ${data.main.humidity}%`;
      document.getElementById("windSpeed").textContent = `Prędkość wiatru: ${data.wind.speed} m/s`;
      document.querySelector(".currentWeather").hidden = false;
    }
    if (xhr.status === 200) {

      const data = JSON.parse(xhr.responseText);
      console.log("Odpowiedź API - aktualna pogoda:", data);

    }
    else {
      errorMessage.textContent =
        `Nie udało się pobrać pogody. Kod błędu: ${xhr.status}`;
    }
  };
  xhr.onerror = function() {

    console.log("Błąd połączenia z serwerem");
    errorMessage.textContent = "Błąd połączenia z serwerem.";

  };

  xhr.send();
  const url2 = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=pl`;
  fetch(url2)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Błąd API: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("Odpowiedź API - prognoza na 5 dni:", data);
      const container = document.getElementById("forecastContainer");

      // Usuwamy poprzednie prognozy
      container.replaceChildren();

      // Grupowanie prognoz według dni
      const days = new Map();

      data.list.forEach(forecast => {

        // Czas lokalny miasta na podstawie przesunięcia z API
        const localDate = new Date(
          (forecast.dt + data.city.timezone) * 1000
        );

        const dayKey = localDate.toISOString().slice(0, 10);

        if (!days.has(dayKey)) {
          days.set(dayKey, []);
        }

        days.get(dayKey).push(forecast);
      });

// Tworzenie kolumn z dniami 5 kolumn 5 dni
      Array.from(days.entries()).slice(0, 5).forEach(([dayKey, forecasts]) => {

        const dayColumn = document.createElement("div");
        dayColumn.classList.add("dayColumn");

        // Nagłówek dnia
        const dayDate = new Date(`${dayKey}T12:00:00Z`);

        const dayHeading = document.createElement("h3");
        dayHeading.classList.add("dayHeading");
        //zamiana daty na tekst polski
        dayHeading.textContent = dayDate.toLocaleDateString("pl-PL", {
          weekday: "long",  //cala nazwa tygodnia
          day: "numeric", // numer dnia miesiac
          month: "short",  // skrocona nazwa miesiaca
          timeZone: "UTC" // stefa czasowa UTC
        });

        dayColumn.appendChild(dayHeading);

        // Prognozy co 3 godziny
        forecasts.forEach(forecast => {

          const forecastElement = document.createElement("div");
          forecastElement.classList.add("forecastCard");

          const localDate = new Date(
            (forecast.dt + data.city.timezone) * 1000
          );

          // Godzina
          const hour = document.createElement("p");
          hour.classList.add("forecastHour");

          hour.textContent = localDate.toLocaleTimeString("pl-PL", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "UTC"
          });

          // Ikona
          const icon = document.createElement("img");
          icon.src =
            `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;

          icon.alt = forecast.weather[0].description;

          // Temperatura
          const temperature = document.createElement("p");
          temperature.classList.add("forecastTemperature");

          temperature.textContent =
            `${Math.round(forecast.main.temp)}°C`;

          // Temperatura odczuwalna
          const feelsLike = document.createElement("p");
          feelsLike.classList.add("forecastFeelsLike");

          feelsLike.textContent =
            `Odczuwalna: ${Math.round(forecast.main.feels_like)}°C`;

          // Opis
          const description = document.createElement("p");
          description.classList.add("forecastDescription");

          description.textContent = forecast.weather[0].description;

          forecastElement.append(
            hour,
            icon,
            temperature,
            feelsLike,
            description
          );

          dayColumn.appendChild(forecastElement);
        });

        container.appendChild(dayColumn);
      });

// Pokazujemy prognozę po pobraniu danych
      document.querySelector(".forecastSection").hidden = false;
    })
    .catch(error => {
      errorMessage.textContent = "Błąd pobierania prognozy.";
      console.error("Błąd pobierania prognozy:", error);
    });
}

button.addEventListener("click", getWeather);



// ustawione na start szczecin jako domyślne miasto
getWeather();

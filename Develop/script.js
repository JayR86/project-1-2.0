let weather = {
    apiKey: "debedf3ec770a6134bafe0d07ed54e45",
    fetchWeather: function (city) {
        // Show the loading state
        document.querySelector(".weather").classList.add("loading");

        fetch(
            "https://api.openweathermap.org/data/2.5/weather?q=" +
            city +
            "&units=metric&appid=" +
            this.apiKey
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error("No weather found.");
                }
                return response.json();
            })
            .then((data) => this.displayWeather(data, city))
            .catch(error => {
                // Hide the loading state
                document.querySelector(".weather").classList.remove("loading");
                // Show an error message to the user
                alert("No weather found.");
                console.error(error);
            });
    },
    displayWeather: function (data, city) {
        // Hide the loading state
        document.querySelector(".weather").classList.remove("loading");

        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed } = data.wind;
        document.querySelector(".city").innerText = "Weather in " + name;
        document.querySelector(".icons").src =
            "https://openweathermap.org/img/wn/" + icon + ".png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = temp + "°C";
        document.querySelector(".humidity").innerText =
            "Humidity: " + humidity + "%";
        document.querySelector(".wind").innerText =
            "Wind speed: " + speed + " km/h";
        // add new code
        const lat = data.coord.lat;
        const lon = data.coord.lon;
        map.setView([lat, lon], 13);
    },
    search: function () {
        this.fetchWeather(document.querySelector(".search-bar").value);
    },
};

document.querySelector(".searchButton").addEventListener("click", function () {
    weather.search();
});

document
    .querySelector(".search-bar")
    .addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            weather.search();
        }
    });

var map = L.map("map").setView([38.5816, -121.4944], 11);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// COME BACK TO
let marker, circle, zoomed = false;

navigator.geolocation.watchPosition(function (position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const accuracy = position.coords.accuracy;

    if (marker) {
        map.removeLayer(marker);
        map.removeLayer(circle);
    }

    marker = L.marker([lat, lng]).addTo(map);
    circle = L.circle([lat, lng], { radius: accuracy }).addTo(map);

    if (!zoomed) {
        zoomed = map.fitBounds(circle.getBounds());
    }

    map.setView([lat, lng]);

    map.fitBounds(circle.getBounds());

}, function (error) {
    console.error(error);
    if (error.code === error.PERMISSION_DENIED) {
        alert("Failed to retrieve location. Please enable location services.");
    } else {
        alert("An error occurred while retrieving the location.");
    }
});

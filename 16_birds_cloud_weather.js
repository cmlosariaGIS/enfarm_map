
            ////////// <----- BIRDS, CLOUD, RAIN -----> \\\\\\\\\\

            // Birds 
            var birds = new ol.Overlay.AnimatedCanvas({
                particule: ol.particule.Bird,
                density: .03,
                angle: Math.random() * Math.PI * 8,
                speed: 2
            });
            birds.setVisible(false);
            map.addOverlay(birds);

            // Rain
            var rain = new ol.Overlay.AnimatedCanvas({
                particule: ol.particule.Rain,
                density: 1,
                angle: 2 * Math.PI / 5,
                speed: 5
            });
            rain.setVisible(false);
            map.addOverlay(rain);

            // Clouds 
            var cloud = new ol.Overlay.AnimatedCanvas({
                particule: ol.particule.Cloud,
                density: 4,
                angle: Math.PI / 3,
                speed: 1
            });
            cloud.setVisible(false);
            map.addOverlay(cloud);

            // Raindrop
            var raindrop = new ol.Overlay.AnimatedCanvas({
                particule: ol.particule.RainDrop,
                density: 1,
                speed: 5
            });
            raindrop.setVisible(false);
            map.addOverlay(raindrop);

            // Keep track of the last zoom level
            var lastZoomLevel = -1;

            map.getView().on('change:resolution', function () {
                var zoomLevel = Math.round(map.getView().getZoom());

                // Check if the zoom level has changed
                if (zoomLevel !== lastZoomLevel) {
                    lastZoomLevel = zoomLevel;
                }

                if (zoomLevel >= 15 && zoomLevel <= 17) {
                    // Show birds
                    birds.setVisible(false);
                } else {
                    // Hide birds
                    birds.setVisible(false);
                }

                if (zoomLevel >= 8 && zoomLevel <= 15) {
                    // Show clouds
                    cloud.setVisible(true);
                } else {
                    // Hide clouds
                    cloud.setVisible(false);
                }
            });


            ol.particule.RainDrop = function (context, timestamp) {
                // Update the y position based on timestamp
                this.y = (timestamp % this.lifetime) / this.lifetime * canvas.height;

                // Draw the raindrop at the new position
                context.beginPath();
                context.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
                context.fillStyle = this.color;
                context.fill();
            };






/*
 //FETCH WEATHER DATA FROM METEO
            // Function to create the floating window and display the current temperature
            function showFloatingWindow(content) {
                var floatingWindow = document.createElement("div");
                floatingWindow.className = "floating-window";
                floatingWindow.innerHTML = content;

                // Append the floating window to the map container
                var mapContainer = document.getElementById("map");
                mapContainer.appendChild(floatingWindow);
            }

            function checkWeatherAndShowRaindrops(lon, lat) {
                var zoomLevel = map.getView().getZoom();

                var url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,rain`;

                console.log("Fetching weather data...");

                fetch(url)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log("Response data:");
                        console.log(JSON.stringify(data, null, 2));

                        // Extract current weather data for the current timestamp "2023-07-27T10:00"
                        var currentWeather = data.hourly.time.indexOf("2023-07-27T10:00");
                        if (currentWeather !== -1) {
                            var currentTemperature = data.hourly.temperature_2m[currentWeather];
                            var currentRainfall = data.hourly.rain[currentWeather];

                            console.log("Current Temperature:", currentTemperature, "°C");
                            console.log("Current Rainfall:", currentRainfall, "mm");

                            // Display the current temperature in the floating window
                            var currentTemperatureElement = document.getElementById("current-temperature");
                            currentTemperatureElement.textContent = currentTemperature;

                            // Show/hide rain and raindrop animations based on currentRainfall value
                            if (currentRainfall > 0) {
                                raindrop.setVisible(true);
                                rain.setVisible(true);
                            } else {
                                raindrop.setVisible(false);
                                rain.setVisible(false);
                            }
                        } else {
                            console.log("Weather data for the current timestamp not found.");
                        }
                    })
                    .catch(error => console.error('Error:', error));
            }

            // Initial call to check weather and show raindrops
            checkWeatherAndShowRaindrops(/* provide lon and lat values here 
            );*/



/*//FETCH WEATHER DATA FROM TOMORROW.IO
function checkWeatherAndShowRaindrops(lon, lat) {
    var zoomLevel = map.getView().getZoom();

    var url = `https://api.tomorrow.io/v4/timelines?location=${lat},${lon}&fields=temperature,weatherCode&timesteps=1h&units=metric&apikey=1rPOUhxYRF3TBu1qYkuhHw2Lw89svKL7`;

    console.log("Fetching weather data...");

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Response data:");
            console.log(JSON.stringify(data, null, 2)); // Log the entire response data in a pretty-printed format
            if (data.data.timelines[0].intervals[0].values.weatherCode === 4001 && zoomLevel >= 17) {
                raindrop.setVisible(true);
                rain.setVisible(true);
            } else {
                raindrop.setVisible(false);
                rain.setVisible(false);
            }
        })
        .catch(error => console.error('Error:', error));
}*/


/*//FETCH WEATHER DATA FROM OPEN WEATHER
//function checkWeatherAndShowRaindrops(lon, lat) {
var zoomLevel = map.getView().getZoom();
var url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=2de4099908a27a1c78b19a28dbbf29fc`;

// Log to the console when about to fetch weather
console.log("Fetching weather data...");

// Fetch the weather data from the OpenWeatherMap API
fetch(url)
    .then(response => response.json())
    .then(data => {
        // Check if it's raining and the zoom level is 17 or more
        if (data.weather[0].main === 'Rain' && zoomLevel >= 17) {
            // If it's raining and zoom level is 17 or more, show the raindrop overlay
            raindrop.setVisible(true);
            // Also, display the 'rain' overlay
            rain.setVisible(true);
        } else {
            // If it's not raining or the zoom level is less than 17, hide the raindrop and rain overlays
            raindrop.setVisible(false);
            rain.setVisible(false);
        }
    })
    .catch(error => console.error('Error:', error));
}*/


/*// We will use this to keep track of the scheduled call
var scheduledCall;

map.getView().on('change:center', function () {
    console.log('Center changed');  // Debugging log
    // If there's already a call scheduled, clear it
    if (scheduledCall) {
        clearTimeout(scheduledCall);
    }

    // Schedule a new call for 5 seconds in the future
    scheduledCall = setTimeout(function () {
        console.log('Executing scheduled function');  // Debugging log
        var center = ol.proj.toLonLat(map.getView().getCenter());
        checkWeatherAndShowRaindrops(center[0], center[1]);

        // After the call is made, clear the scheduledCall variable
        scheduledCall = null;
    }, 10000);  // 10000 milliseconds = 5 seconds
});*/

////////// <----- END BIRDS, CLOUD, RAIN -----> \\\\\\\\\\
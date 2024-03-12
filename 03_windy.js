////////// <----- START WINDY MAP FORECAST FUNCTION -----> \\\\\\\\\\
const showMapButton = document.getElementById('windyMapBtn');
const mapContainer = document.getElementById('windyMapContainer');
const buttonText = document.querySelector('#windyMapBtn .windyMapBtn-text');
const iconElement = document.querySelector('#windyMapBtn .windyIcon');

let isMapLoaded = false;
let iframe = null;
let messageElement = null;

showMapButton.addEventListener('click', function () {
    if (mapContainer.style.display === 'none' || mapContainer.style.display === '') {
        if (!isMapLoaded) {
            mapContainer.style.display = 'block';

            const buttonSpan = document.createElement("span");
            buttonSpan.classList.add("material-icons");
            buttonSpan.innerHTML = "cancel";
            buttonSpan.style.color = "#ff4d4d";

            // Remove old text from buttonText
            buttonText.innerText = '';
            // Add new span to buttonText
            buttonText.append(buttonSpan);

            buttonText.style.margin = 'auto';
            iconElement.style.display = 'none';
            showMapButton.style.width = '55px';
            showMapButton.style.padding = '10px';

            const initialLatitude = 16.257222;
            const initialLongitude = 105.512778;
            const initialZoomLevel = 5;

            iframe = document.createElement('iframe');
            iframe.width = '100%';
            iframe.height = '100%';
            iframe.src = `https://embed.windy.com/embed2.html?lat=${initialLatitude}&lon=${initialLongitude}&zoom=${initialZoomLevel}&width=300&height=450&level=surface&overlay=rain&product=ecmwf&menu=&message=true&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=km%2Fh&metricTemp=%C2%B0C&radarRange=-1`;
            //iframe.src = `https://earth.nullschool.net/#current/wind/surface/level/orthographic=-245.08,11.45,1183/loc=107.832,12.362`;
            //iframe.src = "https://www.meteoblue.com/en/weather/maps/widget/ho-chi-minh-city_vietnam_1566083?windAnimation=0&windAnimation=1&gust=0&gust=1&satellite=0&satellite=1&cloudsAndPrecipitation=0&cloudsAndPrecipitation=1&temperature=0&temperature=1&sunshine=0&sunshine=1&extremeForecastIndex=0&extremeForecastIndex=1&geoloc=fixed&tempunit=C&windunit=km%252Fh&lengthunit=metric&zoom=5&autowidth=auto";

            messageElement = document.createElement('div');
            messageElement.textContent = 'Định vị người dùng...'; //Locating user...
            /*messageElement.style.fontWeight = 'bold';*/
            messageElement.style.position = 'absolute';
            messageElement.style.top = '50%';
            messageElement.style.left = '50%';
            messageElement.style.transform = 'translate(-50%, -50%)';
            messageElement.style.fontSize = '13px';
            messageElement.style.fontFamily = "'Be Vietnam Pro', Arial, sans-serif";
            messageElement.style.padding = '6px 6px';
            messageElement.style.backgroundColor = '#fff';
            messageElement.style.borderRadius = '100px';
            messageElement.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
            messageElement.style.color = '#515151';

            mapContainer.innerHTML = '';
            mapContainer.appendChild(iframe);

            setTimeout(() => {
                mapContainer.appendChild(messageElement);
            }, 1000);

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    const zoomLevel = 11;

                    const url = `https://embed.windy.com/embed2.html?lat=${latitude}&lon=${longitude}&zoom=${zoomLevel}&width=300&height=450&level=surface&overlay=rain&product=ecmwf&menu=&message=true&marker=${latitude},${longitude}&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=km%2Fh&metricTemp=%C2%B0C&radarRange=-1`;
                    //const url = `https://earth.nullschool.net/#current/wind/surface/level/orthographic=-245.08,11.45,1183/loc=107.832,12.362`;
                    //const url = `https://www.meteoblue.com/en/weather/maps/widget/ho-chi-minh-city_vietnam_1566083?windAnimation=0&windAnimation=1&gust=0&gust=1&satellite=0&satellite=1&cloudsAndPrecipitation=0&cloudsAndPrecipitation=1&temperature=0&temperature=1&sunshine=0&sunshine=1&extremeForecastIndex=0&extremeForecastIndex=1&geoloc=fixed&tempunit=C&windunit=km%252Fh&lengthunit=metric&zoom=5&autowidth=auto"`;

                    setTimeout(() => {
                        iframe.src = url;
                        messageElement.style.display = 'none';
                    }, 4000);
                },
                (error) => {
                    console.error('Error getting user location:', error);
                }
            );

            isMapLoaded = true;
        } else {
            mapContainer.style.display = 'block';

            const buttonSpan = document.createElement("span");
            buttonSpan.classList.add("material-icons");
            buttonSpan.innerHTML = "cancel";
            buttonSpan.style.color = "#ff4d4d";

            // Remove old text from buttonText
            buttonText.innerText = '';
            // Add new span to buttonText
            buttonText.append(buttonSpan);

            buttonText.style.margin = 'auto';
            iconElement.style.display = 'none';
            showMapButton.style.width = '55px';
            showMapButton.style.padding = '10px';

        }
    } else {
        mapContainer.style.display = 'none';
        buttonText.textContent = '';
        iconElement.style.display = 'inline-block';
        showMapButton.style.width = '';
        showMapButton.style.padding = '';
    }
});

////////// <----- END WINDY MAP FORECAST FUNCTION -----> \\\\\\\\\\
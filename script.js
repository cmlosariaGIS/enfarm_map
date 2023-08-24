
////////// <----- START ENFARM MAP PRODUCT TOUR -----> \\\\\\\\\\

// Check if the tour has already been shown
const tourShown = localStorage.getItem('tourShown');

if (!tourShown) {
    window.addEventListener('DOMContentLoaded', initTour);
}

// Get the tutorial button element
const tutorialBtn = document.getElementById('tutorialBtn');

// Add event listener to the button
tutorialBtn.addEventListener('click', resetProductTour);

function initTour() {
    // Create a new instance of Shepherd
    const tour = new Shepherd.Tour({
        useModalOverlay: true,
        defaultStepOptions: {
            classes: 'shadow-md bg-purple-dark',
            scrollTo: true,
        },
    });

    addStepSearch(tour);
    addStepSketchFarm(tour);
    addStepAddSensor(tour);
    addStepBaseMap(tour);
    addStepMeasureArea(tour);
    addStepMeasureLength(tour);
    addStepAccessWeatherMap(tour);
    addStepReset(tour);
    addStepFindLocation(tour);
    addStepRevisitTutorial(tour);

    // Start the tour
    tour.start();
}

function addStepSearch(tour) {
    addTourStep(tour, 'step-search', '#searchBtn', 'Nhấp vào nút này để tìm kiếm các địa điểm.');
}

function addStepSketchFarm(tour) {
    addTourStep(tour, 'step-sketch-farm', '#sketchFarmBtn', 'Nhấp vào nút này để phác thảo trang trại của bạn.');
}


function addStepAddSensor(tour) {
    addTourStep(tour, 'step-add-sensor', '#addSensorBtn', 'Nhấp vào nút này để thêm/các cảm biến enfarm.');
}

function addStepBaseMap(tour) {
    addTourStep(tour, 'step-basemap', '#basemapBtn', 'Nhấp vào nút này để chuyển đổi bản đồ cơ sở.');
}

function addStepMeasureArea(tour) {
    addTourStep(tour, 'step-measure-area', '#measureAreaBtn', 'Bấm vào nút này để đo diện tích.');
}

function addStepMeasureLength(tour) {
    addTourStep(tour, 'step-measure-length', '#measureLengthBtn', 'Bấm vào nút này để đo chiều dài.');
}

function addStepReset(tour) {
    addTourStep(tour, 'step-reset', '#resetBtn', 'Nhấp vào nút này để đặt lại bản đồ.');
}

function addStepFindLocation(tour) {
    addTourStep(tour, 'step-location', '#locationBtn', 'Nhấp vào nút này để tìm vị trí của bạn.');
}

function addStepAccessWeatherMap(tour) {
    addTourStep(tour, 'step-windyMap', '#windyMapBtn', 'Nhấp vào nút này để truy cập bản đồ thời tiết từ Windy.com.', 'right');
}

function addStepRevisitTutorial(tour) {
    tour.addStep({
        id: 'step-tutorial',
        text: getText('Nhấp vào nút này để xem lại hướng dẫn.'),
        attachTo: { element: '#tutorialBtn', on: 'left' },
        buttons: [
            {
                text: getButtonText('Làm lại'),
                action: () => tour.show('step-search'),
                classes: 'shepherd-button-secondary',
            },
            {
                text: getButtonText('Xong'),
                action: () => {
                    localStorage.setItem('tourShown', true);
                    tour.complete();
                },
            },
        ],
    });
}

function addTourStep(tour, id, element, text, position = 'left') {
    tour.addStep({
        id,
        classes: 'step-border',
        text: getText(text),
        attachTo: { element, on: position },
        buttons: [{ text: getButtonText('Kế tiếp'), action: tour.next }],
    });
}

function getText(text) {
    return `<span style="display: flex; align-items: center; font-size: 40px;"><i class="material-icons" style="font-size: 60px; margin-right: 20px;">info</i>${text}</span>`;
}

function getButtonText(text) {
    return `<span style="font-size: 40px;">${text}</span>`;
}

function resetProductTour() {
    // Clear the tourShown item from localStorage
    localStorage.removeItem('tourShown');

    // Reinitialize the tour
    initTour();
}

////////// <----- END ENFARM MAP PRODUCT TOUR -----> \\\\\\\\\\





///// <----- WINDY MAP FORECAST FUNCTION -----> \\\\\
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
            buttonText.textContent = 'x';
            buttonText.style.margin = 'auto';
            iconElement.style.display = 'none';
            showMapButton.style.width = '60px';
            showMapButton.style.padding = '10px';

            const initialLatitude = 16.257222;
            const initialLongitude = 105.512778;
            const initialZoomLevel = 6;

            iframe = document.createElement('iframe');
            iframe.width = '100%';
            iframe.height = '99%';
            iframe.src = `https://embed.windy.com/embed2.html?lat=${initialLatitude}&lon=${initialLongitude}&zoom=${initialZoomLevel}&width=300&height=450&level=surface&overlay=rain&product=ecmwf&menu=&message=true&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=km%2Fh&metricTemp=%C2%B0C&radarRange=-1`;
            //iframe.src = `https://earth.nullschool.net/#current/wind/surface/level/orthographic=-245.08,11.45,1183/loc=107.832,12.362`;
            //iframe.src = "https://www.meteoblue.com/en/weather/maps/widget/ho-chi-minh-city_vietnam_1566083?windAnimation=0&windAnimation=1&gust=0&gust=1&satellite=0&satellite=1&cloudsAndPrecipitation=0&cloudsAndPrecipitation=1&temperature=0&temperature=1&sunshine=0&sunshine=1&extremeForecastIndex=0&extremeForecastIndex=1&geoloc=fixed&tempunit=C&windunit=km%252Fh&lengthunit=metric&zoom=5&autowidth=auto";



            messageElement = document.createElement('div');
            messageElement.textContent = 'Định vị người dùng...'; //Locating user...
            messageElement.style.fontWeight = 'bold';
            messageElement.style.position = 'absolute';
            messageElement.style.top = '50%';
            messageElement.style.left = '50%';
            messageElement.style.transform = 'translate(-50%, -50%)';
            messageElement.style.fontSize = '30px';
            messageElement.style.fontFamily = "'Be Vietnam Pro', Arial, sans-serif";
            messageElement.style.padding = '10px 20px';
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
            buttonText.textContent = 'x';
            buttonText.style.margin = 'auto';
            iconElement.style.display = 'none';
            showMapButton.style.width = '60px';
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



///// <----- SEARCH PLACE BUTTON FUNCTION -----> \\\\\
const searchBtn = document.getElementById("searchBtn");
const searchBar = document.getElementById("searchBar");
const searchInput = document.getElementById("searchInput");
const searchKeywordBtn = document.getElementById("searchKeywordBtn");
const floatingMessage = document.getElementById("floatingMessage");
const suggestionsContainer = document.getElementById("suggestionsContainer");
const searchIcon = document.getElementById("searchButton").querySelector(".material-icons");

let historicalPlaces = [];

searchBtn.addEventListener("click", handleSearchClick);
document.addEventListener("click", handleDocumentClick);
searchInput.addEventListener("input", toggleSearchIcon);
searchInput.addEventListener("click", displayHistoricalPlacesOnClick);
searchIcon.addEventListener("click", handleSearchIconClick);


//const searchInput = document.getElementById("searchInput");
const placeholderTexts = [
    "  Tra Cứu..",
    "  Tra Cứu Cho Một Mốc",
    "  Tra Cứu Cho Một Huyện",
    "  Tra Cứu Cho Một Xã",
    "  Tra Cứu.."
];
let placeholderIndex = 0;
let placeholderTimeout;

function showNextPlaceholder() {
    const placeholder = placeholderTexts[placeholderIndex];
    let i = 0;

    const typingInterval = setInterval(() => {
        if (i < placeholder.length) {
            searchInput.setAttribute("placeholder", placeholder.substring(0, i + 1));
            i++;
        } else {
            clearInterval(typingInterval);
            if (placeholderIndex < placeholderTexts.length - 1) {
                placeholderIndex++;
                placeholderTimeout = setTimeout(showNextPlaceholder, 1000);
            }
        }
    }, 15);
}

// Add event listener to start the transition when the search input is focused
searchInput.addEventListener("focus", () => {
    // Start the placeholder transition if it hasn't been started yet
    if (!placeholderTimeout) {
        showNextPlaceholder();
    }
});

// Add event listener to stop the transition when the search input is blurred
searchInput.addEventListener("blur", () => {
    clearTimeout(placeholderTimeout);
    placeholderTimeout = null;
    searchInput.setAttribute("placeholder", "");
});


function toggleSearchIcon() {
    if (searchInput.value.length > 0) {
        searchIcon.textContent = "cancel";
    } else {
        searchIcon.textContent = "search";
    }
}

function handleSearchIconClick() {
    if (searchIcon.textContent === "cancel") {
        searchInput.value = "";
        toggleSearchIcon();
        clearPlaceSuggestions();
        displayHistoricalPlaces();
    }
}

function handleSearchClick(event) {
    event.stopPropagation();
    searchBtn.style.display = "none";
    searchBar.style.display = "flex";
    //searchKeywordBtn.style.display = "none";
    searchInput.focus();

    // Clear the search input and suggestions
    searchInput.value = "";
    clearPlaceSuggestions();

    displayHistoricalPlaces();


    // Post a message to the React Native app
    //const message = { actionType: 'Search', event: 'click' };
    //window.ReactNativeWebView.postMessage(JSON.stringify(message));

    try {
        const message = { actionType: 'Search', event: 'click' };
        
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify(message));
        }
    } catch (error) {
        // Handle the error (or do nothing to prevent logging)

    }
}


function displayHistoricalPlacesOnClick() {
    if (searchInput.value.trim().length === 0) {
        searchInput.value = "";
        displayHistoricalPlaces();
    }
}

function handleDocumentClick(event) {
    if (
        !searchBar.contains(event.target) &&
        event.target !== searchBtn &&
        event.target !== searchKeywordBtn &&
        event.target !== floatingMessage
    ) {
        searchBtn.style.display = "block";
        searchBar.style.display = "none";
        searchInput.value = "";
        suggestionsContainer.style.display = "none";
    }
}

function clearPlaceSuggestions() {
    suggestionsContainer.innerHTML = '';
}

searchBar.style.display = "none";


let markerLayer;

function createMarker(coordinates) {
    if (markerLayer) {
        map.removeLayer(markerLayer);
    }

    const marker = new ol.Feature({
        geometry: new ol.geom.Point(coordinates),
    });

    const markerStyle = new ol.style.Style({
        image: new ol.style.Circle({
            radius: 22,
            fill: new ol.style.Fill({
                color: "#ff6666",
            }),
            stroke: new ol.style.Stroke({
                color: "rgba(255, 255, 255, 0.8)",
                width: 12,
            }),
            shadow: new ol.style.Circle({
                radius: 18,
                fill: new ol.style.Fill({
                    color: "rgba(0, 0, 0, 0.5)", // Set the shadow color and transparency
                }),
            }),
        }),
    });

    marker.setStyle(markerStyle);

    markerLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: [marker],
        }),
    });

    map.addLayer(markerLayer);



    // Define the addressParts variable outside the fetchPlaceName function
    let addressParts = [];

    // Fetch place name using coordinates from OSM Nominatim
    fetchPlaceName(coordinates)
        .then((placeName) => {
            // Create label overlay
            const label = new ol.Overlay({
                position: coordinates,
                element: document.createElement("div"),
                offset: [0, -45],
                positioning: "bottom-center",
            });

            const labelElement = label.getElement();

            // Create the pill-shaped background container
            const pillContainer = document.createElement("div");
            pillContainer.style.display = "flex";
            pillContainer.style.alignItems = "center";
            pillContainer.style.justifyContent = "space-between";
            pillContainer.style.background = "#ffffff";
            pillContainer.style.padding = "10px 40px";
            pillContainer.style.borderRadius = "100px";
            pillContainer.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.15)";

            // Create the place name element
            const placeNameElement = document.createElement("span");
            placeNameElement.textContent = placeName;
            placeNameElement.style.fontSize = "35px";
            placeNameElement.style.fontFamily = "Be Vietnam Pro', Arial, sans-serif";
            placeNameElement.style.color = "#515151";
            placeNameElement.style.textShadow = "2px 2px 4px rgba(255, 255, 255, 0.5)";
            placeNameElement.style.letterSpacing = "1px";

            // Create the chevron_right icon element
            const chevronIcon = document.createElement("i");
            chevronIcon.classList.add("material-icons");
            chevronIcon.textContent = "expand_circle_down";
            chevronIcon.style.fontSize = "50px";
            chevronIcon.style.color = "#515151";
            chevronIcon.style.marginLeft = "15px";

            // Add hover effect to the chevron icon
            chevronIcon.style.cursor = "pointer";

            // Append the place name element and chevron icon to the pill container
            pillContainer.appendChild(placeNameElement);
            pillContainer.appendChild(chevronIcon);

            // Set the pill container as the label element
            labelElement.appendChild(pillContainer);

            // Check that pillContainer is not null before adding an event listener
            if (pillContainer) {
                // Add transition effect to the pillContainer
                pillContainer.style.transition = "all 0.3s ease-in-out";

                pillContainer.addEventListener("click", event => {
                    if (event.target.classList.contains('material-icons')) {
                        const addressDetails = addressParts.slice(1).join(", ");

                        // Add hover effect and transition to the chevron icon
                        const chevronIcon = pillContainer.querySelector("i.material-icons");
                        if (chevronIcon) {
                            chevronIcon.style.transition = "transform 0.3s ease-in-out"; // Add transition effect to the chevron icon

                            chevronIcon.addEventListener("mouseenter", () => {
                                chevronIcon.style.color = "#999999";
                            });

                            chevronIcon.addEventListener("mouseleave", () => {
                                chevronIcon.style.color = "#515151";
                            });
                        }

                        if (pillContainer.getAttribute('data-expanded') === 'true') {
                            pillContainer.innerHTML = `
<span style="font-size: 35px; font-family: 'Be Vietnam Pro', Arial, sans-serif; color: #515151; text-align: center; display: flex; align-items: center;">
<span>${placeName}</span>
<button style="font-size: 50px; color: inherit; background-color: transparent; border: none; cursor: pointer; display: flex; align-items: center; margin-left: 10px;">
<i class="material-icons" style="transform: rotate(0deg); font-size: inherit; transition: transform 0.3s ease-in-out;">expand_circle_down</i>
</button>
</span>`;

                            pillContainer.style.width = "initial";
                            pillContainer.style.padding = "10px 40px";
                            pillContainer.style.borderRadius = "100px";
                            pillContainer.setAttribute('data-expanded', 'false');

                        } else if (addressParts.length > 0) {
                            pillContainer.innerHTML = `
<span style="font-size: 35px; font-family: 'Be Vietnam Pro', Arial, sans-serif; color: #515151; text-align: center;">
<strong>${placeName}</strong>, ${addressDetails}
<button style="font-size: 50px; color: inherit; background-color: transparent; border: none; cursor: pointer; display: flex; align-items: center; margin-left: 430px;">
<i class="material-icons" style="transform: rotate(180deg); font-size: inherit; transition: transform 0.3s ease-in-out;">expand_circle_down</i>
</button>
</span>`;

                            pillContainer.style.width = "500px";
                            pillContainer.style.padding = "30px 30px";
                            pillContainer.style.borderRadius = "20px";
                            pillContainer.setAttribute('data-expanded', 'true');
                        }
                    }
                });
            }

            // Set the pill container as the label element
            labelElement.appendChild(pillContainer);

            // Add the label overlay to the map
            map.addOverlay(label);
        })
        .catch((error) => {
            console.error("Failed to fetch place name:", error);
        });


    // Function to fetch place name from OSM Nominatim
    async function fetchPlaceName(coordinates) {
        const [lon, lat] = ol.proj.toLonLat(coordinates);
        const baseUrl = "https://nominatim.openstreetmap.org/reverse";
        const format = "json";
        const url = `${baseUrl}?lon=${lon}&lat=${lat}&format=${format}&zoom=18&addressdetails=1`;

        try {
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                addressParts = data.display_name.split(",");
                const placeName = addressParts[0]?.trim() || "";
                return placeName;
            } else {
                console.error("Failed to fetch place name:", response.status, response.statusText);
                return "";
            }
        } catch (error) {
            console.error("Failed to fetch place name:", error);
            return "";
        }
    }

}


// Function to fetch place suggestions from OSM-Nominatim
async function fetchPlaceSuggestions(searchText) {
    const baseUrl = "https://nominatim.openstreetmap.org/search";
    const format = "json";
    const limit = 25;
    const url = `${baseUrl}?q=${encodeURIComponent(searchText)}&format=${format}&limit=${limit}&countrycodes=VN`;

    try {
        const loadingIcon = document.getElementById("loadingIcon");
        const searchButton = document.getElementById("searchButton");

        loadingIcon.style.visibility = "visible"; // Show the loading icon
        loadingIcon.classList.add("spin"); // Add the spin class
        searchButton.style.visibility = "hidden"; // Hide the search icon

        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            const filteredSuggestions = data.filter(
                (place) =>
                    !historicalPlaces.some(
                        (historicalPlace) =>
                            historicalPlace.display_name === place.display_name
                    )
            );

            // Process the suggestions...

            return filteredSuggestions.map((place) => ({
                display_name: place.display_name,
                lat: place.lat,
                lon: place.lon,
            }));
        } else {
            console.error(
                "Failed to fetch place suggestions:",
                response.status,
                response.statusText
            );
            return [];
        }
    } catch (error) {
        console.error("Failed to fetch place suggestions:", error);
        return [];
    } finally {
        const loadingIcon = document.getElementById("loadingIcon");
        const searchButton = document.getElementById("searchButton");

        // Delay the visibility of the search button for 2 seconds (2000 milliseconds)
        setTimeout(() => {
            loadingIcon.classList.remove("spin"); // Remove the spin class
            loadingIcon.style.visibility = "hidden"; // Hide the loading icon
            searchButton.style.visibility = "visible"; // Show the search icon
        }, 3000);
    }
}


// Function to display place suggestions below the search bar
function displayPlaceSuggestions(suggestions) {
    suggestionsContainer.innerHTML = "";

    // Combine historical places with fetched suggestions
    const allSuggestions = [...suggestions, ...historicalPlaces];

    allSuggestions.forEach((suggestion, index) => {
        const suggestionItem = document.createElement("div");
        suggestionItem.classList.add("suggestionItem");
        suggestionItem.style.paddingTop = "20px";
        suggestionItem.style.paddingBottom = "20px";

        const gpsIcon = document.createElement("i");
        gpsIcon.classList.add("material-icons", "gpsIcon");

        // Use "history" icon for historical places
        if (historicalPlaces.includes(suggestion)) {
            gpsIcon.textContent = "history";
            gpsIcon.style.fontSize = "60px"
        } else {
            gpsIcon.textContent = "north_east";
            gpsIcon.style.fontSize = "60px"
        }

        const suggestionText = document.createElement("span");
        suggestionText.textContent = suggestion.display_name;
        suggestionText.classList.add("suggestionText");
        suggestionText.style.color = "#515151";
        suggestionText.style.fontFamily = "Be Vietnam Pro', Arial, sans-serif";

        suggestionItem.addEventListener("click", () => {
            handleSuggestionClick(suggestion);
        });

        suggestionItem.appendChild(gpsIcon);
        suggestionItem.appendChild(suggestionText);
        suggestionsContainer.appendChild(suggestionItem);

        // Add a horizontal line after displaying suggestions
        if (index === suggestions.length - 1) {
            const separatorContainer = document.createElement("div");
            separatorContainer.style.paddingTop = "50px";
            separatorContainer.style.paddingBottom = "50px";

            const separatorLine = document.createElement("hr");
            separatorLine.style.width = "50%";
            separatorLine.style.margin = "0 auto";
            separatorContainer.appendChild(separatorLine);

            suggestionsContainer.appendChild(separatorContainer);

            // Add the text below the line
            const historicalPlacesText = document.createElement("div");
            historicalPlacesText.textContent = "Địa điểm đã tìm kiếm trước đây";
            historicalPlacesText.style.fontSize = "40px";
            historicalPlacesText.style.color = "#515151";
            historicalPlacesText.style.marginLeft = "20px";
            historicalPlacesText.style.fontFamily = "Be Vietnam Pro', Arial, sans-serif";
            suggestionsContainer.appendChild(historicalPlacesText);
        }
    });

    suggestionsContainer.style.display = "block";
}

// Attach event listener to the search input
searchInput.addEventListener("input", handleSearchInput);

let searchTimeout;

// Attach event listener to the search input
searchInput.addEventListener("input", handleSearchInputWithDelay);

function handleSearchInputWithDelay() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(handleSearchInput, 1000); // Adjust the delay duration as needed (in milliseconds)
}


// Function to handle search input
function handleSearchInput() {
    const searchText = searchInput.value.trim();

    if (searchText.length > 0) {
        fetchPlaceSuggestions(searchText)
            .then((suggestions) => {
                displayPlaceSuggestions(suggestions);
            })
            .catch((error) => {
                console.error("Failed to fetch place suggestions:", error);
            });

        const historicalPlacesContainer = document.getElementById("historicalPlacesContainer");

        // Wrap the code inside a DOM ready event listener
        document.addEventListener("DOMContentLoaded", function () {
            // Retrieve the historicalPlacesContainer element
            const historicalPlacesContainer = document.getElementById("historicalPlacesContainer");

            // Check if the historicalPlacesContainer element exists
            if (historicalPlacesContainer) {
                // Handle the search input
                handleSearchInput();
            }

            // Function to handle the search input
            function handleSearchInput() {
                // Retrieve the search input element
                const searchInput = document.getElementById("searchInput");
                // Retrieve the suggestions container element
                const suggestionsContainer = document.getElementById("suggestionsContainer");

                // Check if the search input is empty
                if (searchInput.value.trim() !== "") {
                    // Show suggestions and hide historical places list
                    suggestionsContainer.style.display = "block";
                    historicalPlacesContainer.style.display = "none";
                } else {
                    // If the search input is empty, hide historical places and suggestions container
                    suggestionsContainer.style.display = "none";
                    historicalPlacesContainer.style.display = "none";
                }
            }
        });
    }
}
// Attach event listener to the search input
searchInput.addEventListener("input", handleSearchInput);

function handleSuggestionClick(suggestion) {
    const latitude = parseFloat(suggestion.lat);
    const longitude = parseFloat(suggestion.lon);
    const center = ol.proj.fromLonLat([longitude, latitude]);

    // Smoothly animate the zoom and centering
    map.getView().animate({
        center: center,
        zoom: 21,
        duration: 1000, // Adjust the duration as needed
        easing: ol.easing.easeOut // Use a suitable easing function for smooth animation
    });

    const coordinates = ol.proj.fromLonLat([longitude, latitude]);
    createMarker(coordinates);

    // Post a message to the React Native app
    const message = {
        actionType: 'Search',
        event: 'select',
        locationText: suggestion.display_name,
        latitude: latitude,
        longitude: longitude
    };
    
    if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify(message));
    }

    // Log the address and lon/lat to the console
    const address = suggestion.display_name;
    const lon = suggestion.lon;
    const lat = suggestion.lat;
    console.log('Selected Place:');
    console.log('Address:', address);
    console.log('Lon/Lat:', lon, lat);

    // Check if the selected place already exists in historicalPlaces
    const existingPlaceIndex = historicalPlaces.findIndex(
        (place) => place.display_name === suggestion.display_name
    );

    if (existingPlaceIndex === -1) {
        // Add the selected place to the historicalPlaces array
        historicalPlaces.push(suggestion);

        // Save the historicalPlaces in local storage
        localStorage.setItem("historicalPlaces", JSON.stringify(historicalPlaces));
    } else {
        // If the place already exists, move it to the end of the array
        const existingPlace = historicalPlaces.splice(existingPlaceIndex, 1);
        historicalPlaces.push(existingPlace[0]);
    }

    // Display historical places
    displayHistoricalPlaces();

    // Clear the search input
    searchInput.value = "";
    suggestionsContainer.style.display = "none";
}


function displayHistoricalPlaces() {
    suggestionsContainer.innerHTML = "";

    if (historicalPlaces.length > 0 && searchInput.value.trim() === "") {
        const sortedPlaces = [...historicalPlaces].reverse();
        const recentPlaces = sortedPlaces.slice(0, 8);

        recentPlaces.forEach((place) => {
            const suggestionItem = document.createElement("div");
            suggestionItem.classList.add("suggestionItem");
            suggestionItem.style.paddingTop = "20px";
            suggestionItem.style.paddingBottom = "20px";

            const gpsIcon = document.createElement("i");
            gpsIcon.classList.add("material-icons", "gpsIcon");
            gpsIcon.textContent = "history";
            gpsIcon.style.fontSize = "60px"; //adjust history icon size

            const suggestionText = document.createElement("span");
            suggestionText.textContent = place.display_name;
            suggestionText.classList.add("suggestionText");
            suggestionText.style.color = "#515151";

            const deleteButton = document.createElement("button");
            deleteButton.classList.add("deleteButton");
            deleteButton.innerHTML = '<i class="material-icons" style="font-size: 50px;">close</i>';

            deleteButton.addEventListener("click", (event) => {
                event.stopPropagation();
                deleteHistoricalPlace(place);
            });

            suggestionItem.addEventListener("click", () => {
                handleSuggestionClick(place);
            });

            deleteButton.addEventListener("click", (event) => {
                event.stopPropagation();
                deleteHistoricalPlace(place);
            });

            suggestionItem.appendChild(gpsIcon);
            suggestionItem.appendChild(suggestionText);
            suggestionItem.appendChild(deleteButton);

            suggestionsContainer.appendChild(suggestionItem);
        });

        // Function to delete individual historical place
        function deleteHistoricalPlace(place) {
            // Find the index of the place in the historicalPlaces array
            const index = historicalPlaces.findIndex((p) => p.display_name === place.display_name);

            if (index !== -1) {
                // Remove the place from the historicalPlaces array
                historicalPlaces.splice(index, 1);

                // Save the updated historicalPlaces in local storage
                localStorage.setItem("historicalPlaces", JSON.stringify(historicalPlaces));

                // Re-display the historical places
                displayHistoricalPlaces();
            }
        }

        // Create the Clear all search history button
        const clearAllButton = document.createElement("button");
        clearAllButton.id = "clearAllBtn";
        clearAllButton.innerHTML = `
<div style="display: flex; align-items: center; justify-content: center; width: 840px; margin: 0 auto; padding-bottom: 30px; padding-top: 30px; font-family: 'Be Vietnam Pro', Arial, sans-serif;">
<i class="material-icons" style="font-size: 40px; margin-right: 20px;">delete</i>
<span style="font-size: 45px; color: #515151;">Xóa tất cả tìm kiếm</span> 
</div>`;



        clearAllButton.addEventListener("click", clearAllHistory);
        suggestionsContainer.appendChild(clearAllButton);

    } else {
        const noResultsText = document.createElement("div");
        noResultsText.style.display = "flex";
        noResultsText.style.alignItems = "center";
        noResultsText.style.fontSize = "40px";
        noResultsText.style.marginLeft = "40px";
        noResultsText.style.color = "#515151";

        const historyIcon = document.createElement("i");
        historyIcon.classList.add("material-icons");
        historyIcon.textContent = "history";
        historyIcon.style.fontSize = "60px";
        historyIcon.style.marginRight = "40px"; // Increased separation

        const text = document.createElement("span");
        text.textContent = "Không có địa điểm nào được tìm kiếm trước đó";

        noResultsText.appendChild(historyIcon);
        noResultsText.appendChild(text);
        suggestionsContainer.appendChild(noResultsText);

    }

    suggestionsContainer.style.display = "block";
}

// Function to clear all historical places
function clearAllHistory() {
    historicalPlaces = [];
    localStorage.removeItem("historicalPlaces");
    displayHistoricalPlaces();
}

// Retrieve historical places from local storage
const savedHistoricalPlaces = localStorage.getItem("historicalPlaces");
if (savedHistoricalPlaces) {
    historicalPlaces = JSON.parse(savedHistoricalPlaces);
}

// Attach event listener to the search input
searchInput.addEventListener("input", handleSearchInput);




///// <----- BASEMAP SWITCHER BUTTON FUNCTION -----> \\\\\

function cycleBasemap() {
    const basemapSelector = document.getElementById("basemapSelector");

    if (basemapSelector.style.display === "block") {
        // If basemapSelector is already displayed, dismiss it
        basemapSelector.style.transform = "translateX(-50%) translateY(100%)";
        setTimeout(() => {
            basemapSelector.style.display = "none";
        }, 300);
    } else {
        // If basemapSelector is not displayed, call it
        basemapSelector.style.display = "block";

        // Move the basemapSelector up slightly to avoid scrolling
        basemapSelector.style.transform = "translateX(-50%) translateY(-10px)";

        // Trigger the animation by setting the transform property to 0
        setTimeout(() => {
            basemapSelector.style.transform = "translateX(-50%) translateY(0)";
        }, 0);
    }
}

// Basemap Selection
const mapElement = document.getElementById("map");

// Layers


const satelliteLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url: 'https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY21sb3NhcmlhIiwiYSI6ImNsZGJ4cHp2ajAwMGszb3FmeXpxYmVpMHkifQ.3wsPFc9FkszxcH27eEq2dw',
        tileSize: 512,
        maxZoom: 22,
        attribution: '© <a href="https://www.mapbox.com">Mapbox</a>',
        crossOrigin: 'anonymous'
    }),
    visible: false // set visibility to false initially
});

const streetLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url: "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attributions: '© <a href="https://www.openstreetmap.org">OpenStreetMap</a> contributors',
        maxZoom: 19,
    }),
    visible: true // set visibility to true initially for default basemap
});

// Add a new layer for the GEBCO WMS
const gebcoLayer = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: 'https://www.gebco.net/data_and_products/gebco_web_services/web_map_service/mapserv?',
        params: {
            'LAYERS': 'GEBCO_LATEST',
            'VERSION': '1.3.0',
            'FORMAT': 'image/png'
        }
    }),
    visible: false // set visibility to false initially
});

const carbonLayer = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: "https://maps.isric.org/mapserv?map=/map/ocs.map&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&BBOX=-19948500.0,-6147449.0951699,19688885.757062882,8361000.0&CRS=EPSG:152160&WIDTH=1426&HEIGHT=895&LAYERS=ocs_0-30cm_mean&STYLES=&FORMAT=application/openlayers",
    }),
    visible: false // set visibility to false initially
});

const phLayer = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: "https://maps.isric.org/mapserv?map=/map/phh2o.map",
        params: { 'LAYERS': 'phh2o_0-5cm_mean' },
        projection: "EPSG:152160"
    }),
    visible: false
});

const nitrogenLayer = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: "https://maps.isric.org/mapserv?map=/map/nitrogen.map",
        params: { 'LAYERS': 'nitrogen_0-5cm_mean' },
        projection: "EPSG:152160"
    }),
    visible: false
});


// Initialize the map
const map = new ol.Map({
    target: mapElement,
    layers: [satelliteLayer, streetLayer, gebcoLayer, carbonLayer, phLayer, nitrogenLayer],
    view: new ol.View({
        center: ol.proj.fromLonLat([106.6297, 10.8231]),
        zoom: 15,
        //rotation: Math.PI / 4, // Rotate the map 45 degrees (in radians)
    }),
    controls: [],
});



let currentBasemap = 1;
const basemaps = [streetLayer, satelliteLayer, gebcoLayer, carbonLayer, phLayer, nitrogenLayer];

function selectBasemap(index) {
    if (!basemaps[index].getVisible()) {
        basemaps.forEach((layer, i) => {
            layer.setVisible(i === index);
        });

        currentBasemap = index;

        // Update the basemap title in the floating container
        const basemapTitleElement = document.querySelector(".basemapfloatingTitle");
        const basemapTitles = [
            "Đường phố",
            "Vệ tinh",
            "Địa Hình",
            "Tín chỉ Các bon",
            "Bản đồ pH",
            "Bản đồ Ni tơ",
        ];
        const basemapTitleText = basemapTitles[index];
        basemapTitleElement.innerHTML = `
<i class="material-icons" style="font-size: 40px; padding-right: 10px; color: #515151;">layers</i>
<span class="basemapTitle" style="display: inline-block;">${basemapTitleText}</span>
`;

        const logoElement = document.querySelector(".logo");
        const logoImage =
            basemaps[currentBasemap] === satelliteLayer
                ? "https://i.ibb.co/J3YP1x4/enfarm-4.png"
                : "https://i.ibb.co/LCK5s6V/en-Farm-logo-6-2x.png";
        logoElement.src = logoImage;

        // Show the basemap title container when selecting another basemap
        basemapTitleElement.style.display = "flex";

        // Clear the existing timeout and set a new one to hide the title container after 5 seconds
        if (basemapTitleElement.timerId) {
            clearTimeout(basemapTitleElement.timerId);
        }
        basemapTitleElement.timerId = setTimeout(() => {
            basemapTitleElement.style.display = "none";
        }, 5000);
    }

    const basemapImages = document.querySelectorAll(".image-container > div");
    basemapImages.forEach((image, i) => {
        const circle = image.querySelector(".selected-basemap-circle");
        image.classList.toggle("selected", i === index);
        circle.style.display = i === index ? "block" : "none";
    });

    const basemapSelector = document.getElementById("basemapSelector");
    basemapSelector.style.transform = "translateX(-50%) translateY(0)";

    setTimeout(() => {
        basemapSelector.style.display = "none";
    }, 500);
}

// Set the initial basemap title in the floating container to the default basemap "Đường phố"
const defaultBasemapIndex = 0;
selectBasemap(defaultBasemapIndex);

// Hide the basemap title container after 2 seconds from map load
document.addEventListener("DOMContentLoaded", () => {
    const basemapTitleElement = document.querySelector(".basemapfloatingTitle");
    basemapTitleElement.timerId = setTimeout(() => {
        basemapTitleElement.style.display = "none";
    }, 2000);
});

// Set the initial basemap title on DOMContentLoaded
window.addEventListener("DOMContentLoaded", function () {
    const basemapTitleElement = document.querySelector(".basemapTitle");
    basemapTitleElement.textContent = "Đường phố";
});

// Add event listeners to basemap images to trigger selectBasemap function
const basemapImages = document.querySelectorAll(".image-container > div");
basemapImages.forEach((image, index) => {
    image.addEventListener("click", () => {
        selectBasemap(index);
    });
});

const defaultBasemapImage = basemapImages[0];
const defaultBasemapCircle = defaultBasemapImage.querySelector(".selected-basemap-circle");
defaultBasemapCircle.style.display = "block";

window.addEventListener("DOMContentLoaded", function () {
    const basemapSelector = document.getElementById("basemapSelector");
    basemapSelector.style.display = "none";
});

function closeBasemapSelector() {
    const basemapSelector = document.getElementById("basemapSelector");
    basemapSelector.style.transform = "translateX(-50%) translateY(100%)";
    setTimeout(() => {
        basemapSelector.style.display = "none";
    }, 300);
}


// Function to switching ISRIC legends based on ISRIC basemaps
// Function to handle layer visibility change and display legend elements
function handleLayerVisibilityChange(layer, legendClass, closeLegendClass, closeLegendIconClass) {
    const legendElement = document.querySelector(legendClass);
    const closeLegendElement = document.querySelector(closeLegendClass);
    const closeLegendIconElement = document.querySelector(closeLegendIconClass);

    return function () {
        if (layer.getVisible()) {
            legendElement.style.display = 'block';
            closeLegendElement.style.display = 'block';
            closeLegendIconElement.style.display = 'block';
        } else {
            legendElement.style.display = 'none';
            closeLegendElement.style.display = 'none';
            closeLegendIconElement.style.display = 'none';
        }
    };
}

// When carbonLayer basemap is called
carbonLayer.on('change:visible', handleLayerVisibilityChange(carbonLayer, '.carbonLegend', '.closecarbonLegend', '.closecarbonLegend i'));

// When phLayer basemap is called
phLayer.on('change:visible', handleLayerVisibilityChange(phLayer, '.phLegend', '.closepHLegend', '.closepHLegend i'));

// When nitrogenLayer basemap is called
nitrogenLayer.on('change:visible', handleLayerVisibilityChange(nitrogenLayer, '.nitrogenLegend', '.closenitrogenLegend', '.closenitrogenLegend i'));




///// Basemap Attribution \\\\\
function closeAttribution(attributionClass) {
    var attribution = document.querySelector(attributionClass);
    attribution.style.display = 'none';
}

function openAttribution(attributionClass) {
    var attribution = document.querySelector(attributionClass);
    attribution.style.display = 'block';
}

function stopBasemapSwitch(event) {
    event.stopPropagation();
}

const infoIcons = document.querySelectorAll(".info-icon, .osminfo-icon, .mapboxinfo-icon, .gebcoinfo-icon");
infoIcons.forEach((infoIcon) => {
    let attributionClass;
    if (infoIcon.classList.contains("info-icon")) {
        attributionClass = ".isric-attribution";
    } else if (infoIcon.classList.contains("osminfo-icon")) {
        attributionClass = ".osm-attribution";
    } else if (infoIcon.classList.contains("mapboxinfo-icon")) {
        attributionClass = ".mapbox-attribution";
    } else if (infoIcon.classList.contains("gebcoinfo-icon")) {
        attributionClass = ".gebco-attribution";
    }
    infoIcon.addEventListener("click", () => openAttribution(attributionClass));
    infoIcon.addEventListener("click", stopBasemapSwitch);
});


// Dismiss the Terrain Legend
const terrainLegend = document.getElementById("terrainlegend");
const closeTerrainLegend = document.querySelector(".closeterrainLegend");

// Function to dismiss the terrainlegend
const dismissTerrainLegend = () => {
    terrainLegend.style.display = "none";
};

// Function to show the terrainlegend
const showTerrainLegend = () => {
    terrainLegend.style.display = "block";
};

// Add click event listener to the closeTerrainLegend
closeTerrainLegend.addEventListener("click", dismissTerrainLegend);

// Listen for change in basemap visibility
gebcoLayer.on("change:visible", () => {
    if (gebcoLayer.getVisible()) {
        showTerrainLegend();
    } else {
        dismissTerrainLegend();
    }
});

//Display ISRIC Maps Legend
function addCloseEventListener(elementId, targetId) {
    document.querySelector(elementId).addEventListener('click', function () {
        document.getElementById(targetId).style.display = 'none';
    });
}

addCloseEventListener('.closecarbonLegend', 'carbonlegend');
addCloseEventListener('.closepHLegend', 'pHlegend');
addCloseEventListener('.closenitrogenLegend', 'nitrogenlegend');


//Basemap Legend background changes to transparent when user scrolls
function changeBackgroundColorOnScroll() {
    // Get the legend containers
    const carbonLegend = document.querySelector('.carbonLegend');
    const nitrogenLegend = document.querySelector('.nitrogenLegend');
    const phLegend = document.querySelector('.phLegend');

    // Add scroll event listener to each legend container
    carbonLegend.addEventListener('scroll', handleScroll);
    nitrogenLegend.addEventListener('scroll', handleScroll);
    phLegend.addEventListener('scroll', handleScroll);

    // Function to handle scroll event
    function handleScroll(event) {
        // Change the background color based on scroll position
        if (event.target.scrollTop > 0) {
            event.target.style.backgroundColor = 'transparent';
        } else {
            event.target.style.backgroundColor = '#ffffff';
        }
    }
}

// Call the function to activate the scroll behavior
changeBackgroundColorOnScroll();





///// <----- MEASURE AREA BUTTON FUNCTION -----> \\\\\

let drawArea;
let measureAreaSource;
let measureAreaTooltipElement;
let measureAreaTooltip;
let sketchArea;
let lineTooltips = [];
let floatingMessageAreaTimeoutId;



function startMeasurementArea() {
    // Get a reference to the floating title
    const measureAreaFloatingTitle = document.querySelector('.measuringAreafloatingTitle');
    const measureAreaBtn = document.getElementById("measureAreaBtn");
    const measureAreaBtnIcon = measureAreaBtn.querySelector("i");
    const isActive = measureAreaBtn.classList.contains("active");

    // Buttons to hide
    const buttonsToHide = [
        "searchBar", "searchBtn", "basemapBtn", "measureLengthBtn",
        "sketchFarmBtn", "addSensorBtn", "tutorialBtn", "windyMapBtn",
        "resetBtn", "locationBtn"
    ];

    if (isActive) {
        // Disable measuring area
        measureAreaBtn.classList.remove("active");
        map.removeInteraction(drawArea);
        map.removeOverlay(measureAreaTooltip);
        measureAreaTooltipElement = null;
        measureAreaSource.clear();
        clearLineTooltips(); // Clear length tooltips

        // Change the icon back to the "square_foot" icon
        measureAreaBtnIcon.textContent = "square_foot";
        // Reset the background color to white
        measureAreaBtn.style.backgroundColor = "#ffffff";
        // Change the icon color to black
        measureAreaBtnIcon.style.color = "#515151";

        // Clear timeout and hide the floating message immediately
        clearTimeout(floatingMessageAreaTimeoutId);
        const floatingMessage = document.getElementById("floatingMessageArea");
        if (floatingMessage && floatingMessage.parentNode) {
            floatingMessage.parentNode.removeChild(floatingMessage);
        }

        // Hide the finish drawing button
        const finishMeasuringArea = document.getElementById("finishMeasuringArea");
        if (finishMeasuringArea) {
            finishMeasuringArea.classList.add("hidden");
        }

        // Show the hidden buttons
        buttonsToHide.forEach((btnId) => {
            const btn = document.getElementById(btnId);
            if (btn) btn.style.display = "block";
        });

        // Hide the floating title
        measureAreaFloatingTitle.style.display = "none";
    } else {
        // Enable measuring area
        measureAreaBtn.classList.add("active");
        measureAreaSource = new ol.source.Vector();
        map.addLayer(
            new ol.layer.Vector({
                source: measureAreaSource,
                style: new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: "rgba(247, 200, 21, 0.8)", // 80% transparent fill
                    }),
                    stroke: new ol.style.Stroke({
                        color: "#F7C815",
                        width: 10,
                    }),
                    image: new ol.style.Circle({
                        radius: 7,
                        fill: new ol.style.Fill({
                            color: "#F7C815",
                        }),
                    }),
                }),
            })
        );
        createMeasureAreaTooltip();
        addAreaInteraction();

        // Change the icon to the "close" icon
        measureAreaBtnIcon.textContent = "close";
        // Change the background color to dark red
        measureAreaBtn.style.backgroundColor = "#FF6666";
        // Change the icon color to white
        measureAreaBtnIcon.style.color = "#ffffff";

        // Add floating message
        const floatingMessage = document.createElement("div");
        floatingMessage.className = "floating-message";
        floatingMessage.id = "floatingMessageArea";
        const infoIcon = document.createElement("i");
        infoIcon.className = "material-icons";
        infoIcon.textContent = "touch_app";
        infoIcon.style.fontSize = "100px";
        floatingMessage.appendChild(infoIcon);
        floatingMessage.innerHTML += "  Chạm vào màn hình để bắt đầu đo"; // "Tap the screen to start measuring"
        map.getViewport().appendChild(floatingMessage);

        // Remove floating message after 05 seconds
        floatingMessageAreaTimeoutId = setTimeout(function () {
            map.getViewport().removeChild(floatingMessage);
        }, 3000);

        // Hide the specified buttons
        buttonsToHide.forEach((btnId) => {
            const btn = document.getElementById(btnId);
            if (btn) btn.style.display = "none";
        });

        // Show the floating title
        measureAreaFloatingTitle.style.display = "flex";
    }

    // Show the hidden buttons when the drawing is finished
    const finishMeasuringArea = document.getElementById("finishMeasuringArea");
    if (finishMeasuringArea) {
        finishMeasuringArea.addEventListener("click", () => {
            buttonsToHide.forEach((btnId) => {
                const btn = document.getElementById(btnId);
                if (btn) btn.style.display = "block";
            });

            // Hide the floating title
            measureAreaFloatingTitle.style.display = "none";
        });
    }
}


let drawAreaStartListener;
let drawAreaEndListener;

function addAreaInteraction() {
    drawArea = new ol.interaction.Draw({
        source: measureAreaSource,
        type: "Polygon",
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: "rgba(255, 255, 255, 0.2)",
            }),
            stroke: new ol.style.Stroke({
                color: "#F7C815",
                width: 10,
            }),
            image: new ol.style.Circle({
                radius: 18,
                fill: new ol.style.Fill({
                    color: "#F7C815",
                }),
                stroke: new ol.style.Stroke({
                    color: "#ffffff",
                    width: 9,
                }),
            }),
        }),
    });
    map.addInteraction(drawArea);

    // Declare a variable to count how many points have been clicked
    let clickCount = 0;

    drawAreaStartListener = drawArea.on("drawstart", function (evt) {
        const feature = evt.feature;
        sketchArea = feature;
        createHelpAreaTooltip();
        map.on("pointermove", pointerMoveHandler);

        // Reset click count
        clickCount = 0;

        // Add a vertex listener to count clicks
        feature.getGeometry().on("change", function (event) {
            clickCount++;

            // Check if the user has clicked 3 times
            if (clickCount === 3) {
                // Show the finish button
                const finishMeasuringArea = document.getElementById("finishMeasuringArea");
                if (finishMeasuringArea) {
                    finishMeasuringArea.classList.remove("hidden");
                }
            }
        });
    });

    document.getElementById('finishMeasuringArea').addEventListener('click', function () {
        drawArea.finishDrawing();
    });

    drawAreaEndListener = drawArea.on("drawend", function (evt) {
        const feature = evt.feature;
        measureAreaSource.removeFeature(sketchArea);
        sketchArea = null;
        measureAreaTooltipElement.className = "ol-tooltip ol-tooltip-static";
        measureAreaTooltip.setOffset([0, -7]);

        const geom = feature.getGeometry();
        const extent = geom.getExtent();
        const center = ol.extent.getCenter(extent);
        const area = getArea(geom);

        let measurement;
        let measurementUnit;

        if (area > 1000) {
            measurement = (area / 10000).toFixed(2); // Convert to hectares (ha)
            measurementUnit = "ha";
        } else {
            measurement = area.toFixed(2);
            measurementUnit = "m²";
        }

        measureAreaTooltipElement.innerHTML = `<div style="display: flex; align-items: center;"><i class="material-icons" style="margin-right: 10px;"></i><span>Khu vực:</span><strong style="margin-left: 10px;">${measurement}${measurementUnit}</strong></div>`;


        // Hide the finish button
        const finishMeasuringArea = document.getElementById("finishMeasuringArea");
        if (finishMeasuringArea) {
            finishMeasuringArea.classList.add("hidden");
        }

        // Add a white background to the measurement size label
        measureAreaTooltipElement.style.backgroundColor = "#ffffff";
        measureAreaTooltipElement.style.padding = "10px 20px";
        measureAreaTooltipElement.style.borderRadius = "50px";
        measureAreaTooltipElement.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.4)";
        measureAreaTooltipElement.style.color = "#515151";
        measureAreaTooltipElement.style.fontFamily = "Segoe UI";
        measureAreaTooltipElement.style.fontSize = "35px";

        // Position the measurement tooltip element in the middle of the map
        measureAreaTooltip.setPosition(center);

        // Create tooltips for each edge of the polygon
        const coordinates = geom.getCoordinates()[0];
        const numEdges = coordinates.length;
        clearLineTooltips();
        for (let i = 0; i < numEdges - 1; i++) {
            const start = coordinates[i];
            const end = coordinates[i + 1];
            const midpoint = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2];
            const length = ol.sphere.getLength(new ol.geom.LineString([start, end]));

            const lineTooltip = createLineTooltip(length, midpoint, start, end);
            lineTooltips.push(lineTooltip);
            map.addOverlay(lineTooltip);
        }

        map.removeInteraction(drawArea);
        map.un("pointermove", pointerMoveHandler);
    });

    drawAreaStartListener = drawArea.on("drawstart", function (evt) {
        const feature = evt.feature;
        sketchArea = feature;
        createHelpAreaTooltip();
        map.on("pointermove", pointerMoveHandler);
    });
}

let helpMeasureAreaTooltipElement;
let helpMeasureAreaTooltip;

function createHelpAreaTooltip() {
    if (helpMeasureAreaTooltipElement) {
        helpMeasureAreaTooltipElement.parentNode.removeChild(helpMeasureAreaTooltipElement);
    }
    helpMeasureAreaTooltipElement = document.createElement("div");
    helpMeasureAreaTooltipElement.className = "ol-tooltip hidden";
    helpMeasureAreaTooltip = new ol.Overlay({
        element: helpMeasureAreaTooltipElement,
        offset: [15, 0],
        positioning: "center-left",
    });
    map.addOverlay(helpMeasureAreaTooltip);
}

function createMeasureAreaTooltip() {
    if (measureAreaTooltipElement) {
        measureAreaTooltipElement.parentNode.removeChild(measureAreaTooltipElement);
    }
    measureAreaTooltipElement = document.createElement("div");
    measureAreaTooltipElement.className = "ol-tooltip ol-tooltip-measure";
    measureAreaTooltip = new ol.Overlay({
        element: measureAreaTooltipElement,
        offset: [100, 0],
        positioning: "bottom-center",
    });
    map.addOverlay(measureAreaTooltip);
}

const continuePolygonMsg = "Click to continue drawing the polygon";

function pointerMoveHandler(evt) {
    if (evt.dragging) {
        return;
    }
    let helpMsg = "Click to continue drawing the polygon";
    if (sketchArea) {
        const geom = sketchArea.getGeometry();
        if (geom instanceof ol.geom.Polygon) {
            helpMsg = continuePolygonMsg;
        }
    }
}

function getArea(polygon) {
    const area = polygon.getArea();
    return area;
}

function createLineTooltip(length, midpoint, start, end) {
    const lineTooltipElement = document.createElement("div");
    lineTooltipElement.className = "ol-tooltip ol-tooltip-line";

    let measurement;
    let measurementUnit;

    if (length > 1000) {
        measurement = (length / 1000).toFixed(2); // Convert to kilometers
        measurementUnit = "km";
    } else {
        measurement = length.toFixed(2);
        measurementUnit = "m";
    }

    lineTooltipElement.innerHTML = `Chiều dài: ${measurement}${measurementUnit}`;

    // Add a white background to the line tooltip
    lineTooltipElement.style.backgroundColor = "#ffffff";
    lineTooltipElement.style.padding = "10px 20px";
    lineTooltipElement.style.borderRadius = "40px";
    lineTooltipElement.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.4)";

    // Change the font color to Segoe UI (#515151) and set the font size to 12px
    lineTooltipElement.style.color = "#515151";
    lineTooltipElement.style.fontFamily = "Segoe UI";
    lineTooltipElement.style.fontSize = "28px";

    const lineTooltip = new ol.Overlay({
        element: lineTooltipElement,
        offset: [0, 0],
        position: midpoint,
        positioning: "center-center",
    });

    lineTooltipElement.addEventListener("mouseover", function () {
        lineTooltip.setPosition(midpoint);
    });

    lineTooltipElement.addEventListener("mouseout", function () {
        lineTooltip.setPosition(midpoint);
    });

    lineTooltipElement.addEventListener("click", function () {
        const lineCoordinates = [start, end];
        const lineString = new ol.geom.LineString(lineCoordinates);
        const lineFeature = new ol.Feature(lineString);
        measureAreaSource.addFeature(lineFeature);
        lineTooltips.push(createLineTooltip(length, midpoint, start, end));
        map.addOverlay(lineTooltips[lineTooltips.length - 1]);
    });

    return lineTooltip;
}

function clearLineTooltips() {
    lineTooltips.forEach(function (tooltip) {
        map.removeOverlay(tooltip);
    });
    lineTooltips = [];
}

// Function to clear length tooltips
function clearLengthTooltips() {
    clearLineTooltips();
}


// Handle clicks on the measureLengthBtn and sketchFarmBtn buttons
document.getElementById("measureLengthBtn").addEventListener("click", deactivateMeasurementArea);
document.getElementById("sketchFarmBtn").addEventListener("click", deactivateMeasurementArea);
document.getElementById("addSensorBtn").addEventListener("click", deactivateMeasurementArea);

function deactivateMeasurementArea() {
    const measureAreaBtn = document.getElementById("measureAreaBtn");
    if (measureAreaBtn.classList.contains("active")) {
        // Set measureAreaBtn to inactive state
        measureAreaBtn.classList.remove("active");

        // Change the icon back to the "square_foot" icon
        const measureAreaBtnIcon = measureAreaBtn.querySelector("i");
        measureAreaBtnIcon.textContent = "square_foot";

        // Reset the background color to white
        measureAreaBtn.style.backgroundColor = "#ffffff";

        // Change the icon color to black
        measureAreaBtnIcon.style.color = "#515151";

        // Remove interactions
        if (drawArea) {
            map.removeInteraction(drawArea);
            drawArea = null;
        }

        // Remove listeners
        if (drawAreaStartListener) {
            ol.Observable.unByKey(drawAreaStartListener);
            drawAreaStartListener = null;
        }
        if (drawAreaEndListener) {
            ol.Observable.unByKey(drawAreaEndListener);
            drawAreaEndListener = null;
        }

        // Clear timeout and hide the floating message immediately
        clearTimeout(floatingMessageAreaTimeoutId);
        const floatingMessage = document.getElementById("floatingMessageArea");
        if (floatingMessage && floatingMessage.parentNode) {
            floatingMessage.parentNode.removeChild(floatingMessage);
        }

        // Hide the finish drawing button
        const finishMeasuringArea = document.getElementById("finishMeasuringArea");
        if (finishMeasuringArea) {
            finishMeasuringArea.classList.add("hidden");
        }

        // Note: We are not clearing the source or removing the overlay, so the drawn polygons and tooltips should remain visible.
    }
}




///// <----- MEASURE LENGTH BUTTON FUNCTION -----> \\\\\

let drawLength;
let measureLengthSource;
let measureLengthTooltipElement;
let measureLengthTooltip;
let sketchLength;
let floatingMessageTimeoutId;

function startMeasurementLength() {
    const measureLengthBtn = document.getElementById("measureLengthBtn");
    const measureLengthBtnIcon = measureLengthBtn.querySelector("i");
    const floatingTitle = document.querySelector(".measuringLengthfloatingTitle");

    function toggleButtonVisibility(isActive) {
        const buttonsToHide = [
            "searchBar",
            "searchBtn",
            "basemapBtn",
            "measureAreaBtn",
            "sketchFarmBtn",
            "addSensorBtn",
            "tutorialBtn",
            "windyMapBtn",
            "locationBtn",
            "resetBtn",
        ];
        const displayValue = isActive ? "none" : "block";
        buttonsToHide.forEach((btnId) => {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.style.display = displayValue;
            } else {
                console.warn(`Button with ID "${btnId}" not found.`);
            }
        });
    }

    if (measureLengthBtn.classList.contains("active")) {
        measureLengthBtn.classList.remove("active");
        map.removeInteraction(drawLength);
        map.removeOverlay(measureLengthTooltip);
        measureLengthTooltipElement = null;
        measureLengthSource.clear();

        measureLengthBtnIcon.textContent = "straighten";
        measureLengthBtn.style.backgroundColor = "#ffffff";
        measureLengthBtnIcon.style.color = "#515151";

        const finishMeasuringLength = document.getElementById("finishMeasuringLength");
        if (finishMeasuringLength) {
            finishMeasuringLength.classList.add("hidden");
        }

        clearTimeout(floatingMessageTimeoutId);
        const floatingMessage = document.getElementById("floatingMessage");
        if (floatingMessage && floatingMessage.parentNode) {
            floatingMessage.parentNode.removeChild(floatingMessage);
        }

        if (floatingTitle) {
            floatingTitle.style.display = 'none';
        }

        toggleButtonVisibility(false);
    } else {
        measureLengthBtn.classList.add("active");
        measureLengthSource = new ol.source.Vector();
        map.addLayer(
            new ol.layer.Vector({
                source: measureLengthSource,
                style: new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: "#386c34",
                        width: 8,
                    }),
                }),
            })
        );
        createMeasureLengthTooltip();
        addLengthInteraction();

        measureLengthBtnIcon.textContent = "close";
        measureLengthBtn.style.backgroundColor = "#FF6666";
        measureLengthBtnIcon.style.color = "#ffffff";

        const floatingMessage = document.createElement("div");
        floatingMessage.className = "floating-message";
        floatingMessage.id = "floatingMessage";
        const infoIcon = document.createElement("i");
        infoIcon.className = "material-icons";
        infoIcon.textContent = "touch_app";
        infoIcon.style.fontSize = "100px";
        floatingMessage.appendChild(infoIcon);
        floatingMessage.innerHTML += "  Chạm vào màn hình để bắt đầu đo";
        map.getViewport().appendChild(floatingMessage);

        setTimeout(function () {
            if (floatingMessage.parentNode === map.getViewport()) {
                map.getViewport().removeChild(floatingMessage);
            }
        }, 3000);

        if (floatingTitle) {
            floatingTitle.style.display = 'flex';
        }

        toggleButtonVisibility(true);
    }
}

let drawLengthStartListener;
let drawLengthEndListener;

function addLengthInteraction() {
    drawLength = new ol.interaction.Draw({
        source: measureLengthSource,
        type: "LineString",
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: "#386c34",
                width: 8,
            }),
            image: new ol.style.Circle({
                radius: 18,
                fill: new ol.style.Fill({
                    color: "#386c34",
                }),
                stroke: new ol.style.Stroke({
                    color: "#ffffff",
                    width: 9,
                }),
            }),
        }),
    });
    map.addInteraction(drawLength);

    // Declare a variable to count how many points have been clicked
    let clickCount = 0;

    drawLength.on("drawstart", function (evt) {
        const feature = evt.feature;
        sketchLength = feature;

        // Reset click count
        clickCount = 0;

        // Add a vertex listener to count clicks
        feature.getGeometry().on("change", function (event) {
            clickCount++;

            // Check if the user has clicked 2 times
            if (clickCount === 2) {
                // Show the finish button
                const finishMeasuringLength = document.getElementById("finishMeasuringLength");
                if (finishMeasuringLength) {
                    finishMeasuringLength.classList.remove("hidden");
                }
            }
        });
    });

    // Add event listener to the finish button
    document.getElementById("finishMeasuringLength").addEventListener("click", function () {
        drawLength.finishDrawing();

        // Hide the floating title
        const measuringLengthFloatingTitle = document.querySelector('.measuringLengthfloatingTitle');
        if (measuringLengthFloatingTitle) {
            measuringLengthFloatingTitle.style.display = "none";
        }
    });


    drawLengthEndListener = drawLength.on("drawend", function (evt) {
        const feature = evt.feature;
        measureLengthSource.removeFeature(sketchLength);
        sketchLength = null;
        measureLengthTooltipElement.className = "ol-tooltip ol-tooltip-static";
        measureLengthTooltip.setOffset([0, -7]);

        const geom = feature.getGeometry();
        const length = getLength(geom);

        let measurement = length.toFixed(2);
        let measurementUnit = "m";

        if (length > 1000) {
            measurement = (length / 1000).toFixed(2); // Convert to kilometers
            measurementUnit = "km";
        }

        measureLengthTooltipElement.innerHTML = `Độ dài: <strong>${measurement}</strong>${measurementUnit}`;

        // Add a white background to the measurement size label
        measureLengthTooltipElement.style.backgroundColor = "#ffffff";
        measureLengthTooltipElement.style.padding = "10px 30px";
        measureLengthTooltipElement.style.borderRadius = "40px";
        measureLengthTooltipElement.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.4)";

        // Change the font color to Segoe UI (#515151) and set the font size to 35px
        measureLengthTooltipElement.style.color = "#515151";
        measureLengthTooltipElement.style.fontFamily = "Segoe UI";
        measureLengthTooltipElement.style.fontSize = "35px";

        // Position the measurement tooltip element in the middle of the map
        measureLengthTooltip.setPosition(geom.getLastCoordinate());

        map.removeInteraction(drawLength);
        map.un("pointermove", pointerMoveHandler);

        // Hide the finish button
        const finishMeasuringLength = document.getElementById("finishMeasuringLength");
        if (finishMeasuringLength) {
            finishMeasuringLength.classList.add("hidden");
        }
    });
}

let helpMeasureLengthTooltipElement;
let helpMeasureLengthTooltip;

function createHelpLengthTooltip() {
    if (helpMeasureLengthTooltipElement) {
        helpMeasureLengthTooltipElement.parentNode.removeChild(helpMeasureLengthTooltipElement);
    }
    helpMeasureLengthTooltipElement = document.createElement("div");
    helpMeasureLengthTooltipElement.className = "ol-tooltip hidden";
    helpMeasureLengthTooltip = new ol.Overlay({
        element: helpMeasureLengthTooltipElement,
        offset: [15, 0],
        positioning: "center-left",
    });
    map.addOverlay(helpMeasureLengthTooltip);
}

function createMeasureLengthTooltip() {
    if (measureLengthTooltipElement) {
        measureLengthTooltipElement.parentNode.removeChild(measureLengthTooltipElement);
    }
    measureLengthTooltipElement = document.createElement("div");
    measureLengthTooltipElement.className = "ol-tooltip ol-tooltip-measure";
    measureLengthTooltip = new ol.Overlay({
        element: measureLengthTooltipElement,
        offset: [0, -15],
        positioning: "bottom-center",
    });
    map.addOverlay(measureLengthTooltip);
}

function getLength(line) {
    const length = line.getLength();
    return length;
}

function deactivateMeasurementLength() {
    const measureLengthBtn = document.getElementById("measureLengthBtn");
    if (measureLengthBtn.classList.contains("active")) {
        // Set measureLengthBtn to inactive state
        measureLengthBtn.classList.remove("active");

        // Change the icon back to the "straighten" icon
        const measureLengthBtnIcon = measureLengthBtn.querySelector("i");
        measureLengthBtnIcon.textContent = "straighten";

        // Reset the background color to white
        measureLengthBtn.style.backgroundColor = "#ffffff";

        // Change the icon color to black
        measureLengthBtnIcon.style.color = "#515151";

        // Remove interactions
        if (drawLength) {
            map.removeInteraction(drawLength);
            drawLength = null;
        }

        // Remove listeners
        if (drawLengthStartListener) {
            ol.Observable.unByKey(drawLengthStartListener);
            drawLengthStartListener = null;
        }
        if (drawLengthEndListener) {
            ol.Observable.unByKey(drawLengthEndListener);
            drawLengthEndListener = null;
        }

        // Clear timeout and hide the floating message immediately
        clearTimeout(floatingMessageTimeoutId);
        const floatingMessage = document.getElementById("floatingMessage");
        if (floatingMessage && floatingMessage.parentNode) {
            floatingMessage.parentNode.removeChild(floatingMessage);
        }

        // Show the hidden buttons
        const buttonsToHide = [
            "searchBar",
            "searchBtn",
            "basemapBtn",
            "measureAreaBtn",
            "sketchFarmBtn",
            "addSensorBtn",
            "tutorialBtn",
            "windyMapBtn",
            "resetBtn",
            "locationBtn",
        ];
        buttonsToHide.forEach((btnId) => {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.style.display = "block";
            }
        });

        // Show the finish button
        const finishMeasuringLength = document.getElementById("finishMeasuringLength");
        if (finishMeasuringLength) {
            finishMeasuringLength.classList.add("hidden");
        }
    }
}

document.getElementById("measureAreaBtn").addEventListener("click", deactivateMeasurementLength);
document.getElementById("sketchFarmBtn").addEventListener("click", deactivateMeasurementLength);
document.getElementById("addSensorBtn").addEventListener("click", deactivateMeasurementLength);


// Add event listener to the finish button
document.getElementById("finishMeasuringLength").addEventListener("click", function () {
    drawLength.finishDrawing();
    // Show the hidden buttons after finishing the sketch
    const buttonsToHide = [
        "searchBar",
        "searchBtn",
        "basemapBtn",
        "measureAreaBtn",
        "sketchFarmBtn",
        "addSensorBtn",
        "tutorialBtn",
        "windyMapBtn",
        "resetBtn",
        "locationBtn",
    ];
    buttonsToHide.forEach((btnId) => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.style.display = "block";
        }
    });
});







///// <----- SKETCH FARM BUTTON FUNCTION -----> \\\\\

async function fetchPlaceName(lon, lat) {
    const baseUrl = "https://nominatim.openstreetmap.org/reverse";
    const format = "json";
    const url = `${baseUrl}?lon=${lon}&lat=${lat}&format=${format}&zoom=18&addressdetails=1`;

    let cities = await fetch('https://vn-public-apis.fpo.vn/districts/getAll?limit=-1')
        .then(response => response.json())
        .then(data => {
            let allCities = data.data.data;
            let citiesWithThanhPho = [];
            allCities.forEach(city => {
                let pathWithTypeParts = city.path_with_type.split(', ');
                if (pathWithTypeParts[1].includes('Thành phố')) {
                    let cityName = pathWithTypeParts[1].replace('Thành phố ', '');
                    if (!citiesWithThanhPho.includes(cityName)) {
                        citiesWithThanhPho.push(cityName);
                    }
                }
                if (city.name_with_type.includes('Thành phố') && !citiesWithThanhPho.includes(city.name)) {
                    citiesWithThanhPho.push(city.name);
                }
            });

            console.log('Fetched Cities:', citiesWithThanhPho);

            return citiesWithThanhPho;
        })
        .catch((error) => console.error('Error:', error));

    let provinces = await fetch('https://vn-public-apis.fpo.vn/provinces/getAll?limit=-1')
        .then(response => response.json())
        .then(data => {
            let allProvinces = data.data.data;
            let provinceNames = allProvinces.map(province => province.name);

            console.log('Fetched Provinces:', provinceNames);

            return provinceNames;
        })
        .catch((error) => console.error('Error:', error));

    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            let placeName = data.display_name || "";

            const parts = placeName.split(', ');
            let firstPart = parts.shift(); // Get the first part before the comma (place name)

            let streetAddress = '';
            let village = '';
            let commune = '';
            let ward = '';
            let district = '';
            let city = '';
            let province = '';
            let postcode = '';
            let country = '';

            // Check the first part for keywords
            if (firstPart.includes("Chợ Rẫy") || firstPart.includes("Chung cư") || firstPart.includes("Chung Cư") || firstPart.includes("Tòa nhà") || firstPart.includes("Tower") || firstPart.includes("Building") || firstPart.includes("Complex") || firstPart.includes("Hospital") || firstPart.includes("Hotel") || firstPart.includes("Store")) {
                firstPart = firstPart; // Assign to place name
            } else if (firstPart.includes("District") || firstPart.includes("Huyện") || firstPart.includes("Quận")) {
                district = firstPart;
                firstPart = '';
            } else if (firstPart.includes("Ward") || firstPart.includes("ward") || firstPart.includes("Phường")) {
                ward = firstPart;
                firstPart = '';
            } else if (firstPart.includes("Xã") || firstPart.includes("Commune")) {
                commune = firstPart;
                firstPart = '';
            } else {
                streetAddress = firstPart;
            }

            // Process the rest of the parts
            parts.forEach((part, index) => {
                if (part.includes("District") || part.includes("Huyện") || part.includes("Quận")) {
                    district = part;
                } else if (part.includes("Ward") || part.includes("ward") || part.includes("Phường")) {
                    ward = part;
                } else if (part.includes("Xã") || part.includes("Commune")) {
                    commune = part;
                } else if (/\d/.test(part) && !/\d{4,5}/.test(part)) {
                    streetAddress += ' ' + part;
                } else if (/\d{4,5}/.test(part)) {
                    postcode = part;
                } else if (/\D/.test(part)) {
                    // Check for street address keywords
                    if (part.includes("Đường") || part.includes("Quốc lộ") || part.includes("Tỉnh lộ") || part.includes("Hẻm") || part.includes("Ngõ") // Add "Ngõ" here
                        || part.includes("Phố") || part.includes("Đại lộ") || part.includes("Xóm") || part.includes("Thôn") || part.includes("Road")
                        || part.includes("Rd.") || part.includes("Avenue") || part.includes("Ave.") || part.includes("Street") || part.includes("street")
                        || part.includes("Highway") || part.includes("highway") || part.includes("Lane") || part.includes("lane") || part.includes("Boulevard") || part.includes("Blvd.")) {
                        streetAddress += ' ' + part;
                    } else {
                        for (let i = 0; i < cities.length; i++) {
                            if (part.includes(cities[i])) {
                                city = cities[i];
                                break;
                            }
                        }

                        for (let j = 0; j < provinces.length; j++) {
                            if (part.includes(provinces[j])) {
                                province = part;
                                break;
                            }
                        }
                    }
                }

                if (part === "Vietnam") {
                    country = part;
                }
            });

            console.log('Place Name:', firstPart);
            console.log('Street Address:', streetAddress.trim());
            console.log('Village:', village);
            console.log('Commune:', commune);
            console.log('Ward:', ward);
            console.log('District:', district);
            console.log('City:', city);
            console.log('Province:', province);
            console.log('Postcode:', postcode);
            console.log('Country:', country);
            return { placeName, firstPart, streetAddress: streetAddress.trim(), village, commune, ward, district, city, province, postcode, country };
        } else {
            console.error(
                "Failed to fetch place name:",
                response.status,
                response.statusText
            );
            return "";
        }
    } catch (error) {
        console.error("Failed to fetch place name:", error);
        return "";
    }
}



let isSketchActive = false;
let draw;
let polygonExists = false;
let vectorSource = new ol.source.Vector();
let tooltipOverlay;
let tooltipOverlays = [];
let timeoutId = null;
let sketchFarmBtnIcon;

let buttonsToHideSketchFarmActive = [
    "searchBar", "searchBtn", "basemapBtn", "measureAreaBtn",
    "measureLengthBtn", "addSensorBtn", "tutorialBtn", "windyMapBtn", "resetBtn",
    "locationBtn"
];

function showButtonsSketchFarmInactive() {
    for (let button of buttonsToHideSketchFarmActive) {
        let btn = document.getElementById(button);
        if (btn) {
            btn.style.display = '';
        }
    }
}

async function startSketchFarm() {
    // Get a reference to the sketchingFarmfloatingTitle
    const sketchingFarmFloatingTitle = document.querySelector('.sketchingFarmfloatingTitle');

    // Hide all buttons
    for (let button of buttonsToHideSketchFarmActive) {
        let btn = document.getElementById(button);
        if (btn) {
            btn.style.display = 'none';
        }
    }

    const sketchFarmBtn = document.getElementById("sketchFarmBtn");
    sketchFarmBtnIcon = sketchFarmBtn.querySelector("i");
    const finishDrawingButton = document.querySelector('.finish-drawing');
    const undoSketchbtn = document.querySelector('.undoSketchBtn');
    const dialog = document.getElementById('dialog');

    if (isSketchActive) {
        if (timeoutId) {
            clearTimeout(timeoutId);
            const existingFloatingMessage = document.querySelector('.floating-message');
            if (existingFloatingMessage) {
                map.getViewport().removeChild(existingFloatingMessage);
            }
            timeoutId = null;
        }

        if (polygonExists) {
            dialog.classList.remove('hidden');

            document.getElementById("deleteYes").addEventListener("click", function () {
                map.removeInteraction(draw);
                isSketchActive = false;
                polygonExists = false;
                vectorSource.clear();
                for (const overlay of tooltipOverlays) {
                    map.removeOverlay(overlay);
                }
                sketchFarmBtn.style.backgroundColor = "white";
                sketchFarmBtnIcon.textContent = "create";
                sketchFarmBtnIcon.style.color = "#515151";
                finishDrawingButton.classList.add("hidden");
                dialog.classList.add("hidden");
                console.clear();

                // Hide the undoSketchBtn button when the deleteYes button is clicked
                undoSketchbtn.style.display = "none";

                // Remove stored polygon from local storage
                localStorage.removeItem("enfarm_polygon_coordinates");

                // Show the hidden buttons
                showButtonsSketchFarmInactive();

                // Hide sketchingFarmfloatingTitle when sketching is inactive
                if (sketchingFarmFloatingTitle) {
                    sketchingFarmFloatingTitle.style.display = 'none';
                }
            });

            document.getElementById('deleteNo').addEventListener('click', function () {
                dialog.classList.add('hidden');
            });
        } else {
            map.removeInteraction(draw);
            isSketchActive = false;
            sketchFarmBtn.style.backgroundColor = "white";
            sketchFarmBtnIcon.textContent = "create";
            sketchFarmBtnIcon.style.color = "#515151";
            finishDrawingButton.classList.add('hidden');
            //undoSketchBtn.style.display = "none";

            // Hide sketchingFarmfloatingTitle when sketching is inactive
            if (sketchingFarmFloatingTitle) {
                sketchingFarmFloatingTitle.style.display = 'none';
            }
        }
        return;
    }

    // Show sketchingFarmfloatingTitle when sketching is active
    if (sketchingFarmFloatingTitle) {
        sketchingFarmFloatingTitle.style.display = 'flex';
    }

    const floatingMessage = document.createElement("div");
    floatingMessage.className = "floating-message";
    const infoIcon = document.createElement("i");
    infoIcon.className = "material-icons";
    infoIcon.textContent = "touch_app";
    infoIcon.style.fontSize = "100px";
    floatingMessage.appendChild(infoIcon);
    floatingMessage.innerHTML +=
        "   Chạm vào màn hình để bắt đầu vẽ trang trại"; // "Tap the screen to start drawing farm"
    map.getViewport().appendChild(floatingMessage);

    timeoutId = setTimeout(function () {
        map.getViewport().removeChild(floatingMessage);
    }, 3000);



    ///CREATE FARM POLYGON WITH SQUARE, RECTANGULAR and TRIANGULAR GRID
    let extent;
    let squareGridCountElement = document.getElementById('squareGridCount');
    let rectangularGridCountElement = document.getElementById('rectangularGridCount');
    let triangularGridCountElement = document.getElementById('triangularGridCount');


    const squareGridX = new ol.layer.Vector({
        source: new ol.source.Vector(),
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'white',
                width: 6
            })
        })
    });

    const squareGridY = new ol.layer.Vector({
        source: new ol.source.Vector(),
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'white',
                width: 6
            })
        })
    });

    const rectangularGridX = new ol.layer.Vector({
        source: new ol.source.Vector(),
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'white',
                width: 6
            })
        })
    });

    const rectangularGridY = new ol.layer.Vector({
        source: new ol.source.Vector(),
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'white',
                width: 6
            })
        })
    });

    // Create triangularGrid layer
    const triangularGrid = new ol.layer.Vector({
        source: new ol.source.Vector(),
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'white',
                width: 6
            })
        })
    });

    // Define a style function for the intersection points
    function intersectionPointStyle(feature) {
        const zoom = map.getView().getZoom();
        const isZoom19AndAbove = zoom >= 21;

        if (isZoom19AndAbove) {
            // Show the trees only at zoom level 21 and above
            return new ol.style.Style({
                image: new ol.style.Icon({
                    src: 'https://i.ibb.co/hDYvzYs/icons8-tree-64.png',
                    scale: 1,
                }),
                stroke: new ol.style.Stroke({
                    color: 'white',
                    width: 1,
                }),
                fill: new ol.style.Fill({
                    color: 'green',
                }),
            });
        } else {
            // Return null style (no tree icon) for zoom levels below 21
            return null;
        }
    }

    // Use the style function when creating the intersection point layers
    const squareGridIntersectionPoints = new ol.layer.Vector({
        source: new ol.source.Vector(),
        style: intersectionPointStyle
    });

    const rectangularGridIntersectionPoints = new ol.layer.Vector({
        source: new ol.source.Vector(),
        style: intersectionPointStyle
    });

    const triangularGridIntersectionPoints = new ol.layer.Vector({
        source: new ol.source.Vector(),
        style: intersectionPointStyle
    });


    map.addLayer(squareGridX);
    map.addLayer(squareGridY);
    map.addLayer(rectangularGridX);
    map.addLayer(rectangularGridY);
    map.addLayer(triangularGrid);

    map.addLayer(squareGridIntersectionPoints);
    map.addLayer(rectangularGridIntersectionPoints);
    map.addLayer(triangularGridIntersectionPoints);


    // Initially, hide the rectangularGrid.
    rectangularGridX.setVisible(false);
    rectangularGridY.setVisible(false);
    triangularGrid.setVisible(false);
    rectangularGridIntersectionPoints.setVisible(false);
    triangularGridIntersectionPoints.setVisible(false);

    // Grid Pattern Type Options
    var button1 = document.querySelector('.gridTypeOptionBtn1');
    var button2 = document.querySelector('.gridTypeOptionBtn2');
    var button3 = document.querySelector('.gridTypeOptionBtn3');

    // Hide the elements initially
    document.getElementById('rectangularGridTreeCountContainer').style.display = 'none';
    document.getElementById('rectangularGridYCountContainer').style.display = 'none';
    document.getElementById('rectangularGridXCountContainer').style.display = 'none';

    document.getElementById('triangularGridTreeCountContainer').style.display = 'none';
    document.getElementById('triangularGridYCountContainer').style.display = 'none';
    document.getElementById('triangularGridXCountContainer').style.display = 'none';
    document.getElementById('triangularGridZCountContainer').style.display = 'none';



    // Add event listeners to the buttons
    button1.addEventListener('click', function () {
        // When gridTypeOptionBtn1 is clicked, show the squareGrid and hide the rectangularGrid.
        squareGridX.setVisible(true);
        squareGridY.setVisible(true);
        rectangularGridX.setVisible(false);
        rectangularGridY.setVisible(false);
        triangularGrid.setVisible(false);
        squareGridIntersectionPoints.setVisible(true);
        rectangularGridIntersectionPoints.setVisible(false);
        triangularGridIntersectionPoints.setVisible(false);

        document.getElementById('squareGridTreeCountContainer').style.display = 'block';
        document.getElementById('squareGridYCountContainer').style.display = 'block';
        document.getElementById('squareGridXCountContainer').style.display = 'block';

        // Hide elements when button1 is clicked
        document.getElementById('rectangularGridTreeCountContainer').style.display = 'none';
        document.getElementById('rectangularGridYCountContainer').style.display = 'none';
        document.getElementById('rectangularGridXCountContainer').style.display = 'none';

        document.getElementById('triangularGridTreeCountContainer').style.display = 'none';
        document.getElementById('triangularGridYCountContainer').style.display = 'none';
        document.getElementById('triangularGridXCountContainer').style.display = 'none';
        document.getElementById('triangularGridZCountContainer').style.display = 'none';

    });

    button2.addEventListener('click', function () {
        // When gridTypeOptionBtn2 is clicked, show the rectangularGrid and hide the squareGrid.
        squareGridX.setVisible(false);
        squareGridY.setVisible(false);
        rectangularGridX.setVisible(true);
        rectangularGridY.setVisible(true);
        triangularGrid.setVisible(false);
        squareGridIntersectionPoints.setVisible(false);
        rectangularGridIntersectionPoints.setVisible(true);
        triangularGridIntersectionPoints.setVisible(false);

        squareGridTreeCountContainer.style.display = "none";
        rectangularGridTreeCountContainer.style.display = "block";
        triangularGridTreeCountContainer.style.display = "none";

        // Show the elements when button2 is clicked
        document.getElementById('rectangularGridTreeCountContainer').style.display = 'block';
        document.getElementById('rectangularGridYCountContainer').style.display = 'block';
        document.getElementById('rectangularGridXCountContainer').style.display = 'block';

        // Hide elements when button2 is clicked
        document.getElementById('squareGridTreeCountContainer').style.display = 'none';
        document.getElementById('squareGridYCountContainer').style.display = 'none';
        document.getElementById('squareGridXCountContainer').style.display = 'none';

        document.getElementById('triangularGridTreeCountContainer').style.display = 'none';
        document.getElementById('triangularGridYCountContainer').style.display = 'none';
        document.getElementById('triangularGridXCountContainer').style.display = 'none';
        document.getElementById('triangularGridZCountContainer').style.display = 'none';

    });

    button3.addEventListener('click', function () {
        // When gridTypeOptionBtn3 is clicked, show the triangularGrid and hide the squareGrid and rectangularGrid.
        squareGridX.setVisible(false);
        squareGridY.setVisible(false);
        rectangularGridX.setVisible(false);
        rectangularGridY.setVisible(false);
        triangularGrid.setVisible(true);
        squareGridIntersectionPoints.setVisible(false);
        rectangularGridIntersectionPoints.setVisible(false);
        triangularGridIntersectionPoints.setVisible(true);

        /*h2Element.innerText = "Triangular Grid Estimated Coffee Tree Count";*/
        squareGridTreeCountContainer.style.display = "none";
        rectangularGridTreeCountContainer.style.display = "none";
        triangularGridTreeCountContainer.style.display = "block";

        // Show the elements when button3 is clicked

        document.getElementById('triangularGridTreeCountContainer').style.display = 'block';
        document.getElementById('triangularGridYCountContainer').style.display = 'block';
        document.getElementById('triangularGridXCountContainer').style.display = 'block';
        document.getElementById('triangularGridZCountContainer').style.display = 'block';

        // Hide elements when button2 is clicked
        document.getElementById('rectangularGridTreeCountContainer').style.display = 'none';
        document.getElementById('rectangularGridYCountContainer').style.display = 'none';
        document.getElementById('rectangularGridXCountContainer').style.display = 'none';

        document.getElementById('squareGridTreeCountContainer').style.display = 'none';
        document.getElementById('squareGridYCountContainer').style.display = 'none';
        document.getElementById('squareGridXCountContainer').style.display = 'none';

    });


    const farmVectorLayer = new ol.layer.Vector({
        source: vectorSource,
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: "rgba(56, 108, 52, 0.5)"
            })
        })
    });

    map.addLayer(farmVectorLayer);

    draw = new ol.interaction.Draw({
        source: vectorSource,
        type: "Polygon",
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: "rgba(255, 255, 255, 0.1)",
            }),
            stroke: new ol.style.Stroke({
                color: "#386c34",
                width: 10,
            }),
            image: new ol.style.Circle({
                radius: 18,
                fill: new ol.style.Fill({
                    color: "#386c34",
                }),
                stroke: new ol.style.Stroke({
                    color: "#ffffff",
                    width: 9,
                }),
            }),
        }),
    });

    map.addInteraction(draw);
    isSketchActive = true;

    let squareGridXCount = 0;
    let squareGridYCount = 0;
    let rectangularGridXCount = 0;
    let rectangularGridYCount = 0;
    let triangularGridXCount = 0;
    let triangularGridYCount = 0;
    let triangularGridZCount = 0;


    let drawnPolygonGeoJSON;

    let customAngle = null; // To store the custom angle
    let drawendEvent;

    function calculateAngleFromLongestEdge(coordinates) {
        let longestEdgeLength = 0;
        let longestEdge = [];

        for (let i = 0; i < coordinates.length - 1; i++) {
            const start = coordinates[i];
            const end = coordinates[i + 1];

            const length = Math.sqrt(Math.pow(end[0] - start[0], 2) + Math.pow(end[1] - start[1], 2));

            if (length > longestEdgeLength) {
                longestEdgeLength = length;
                longestEdge = [start, end];
            }
        }

        return Math.atan2(longestEdge[1][1] - longestEdge[0][1], longestEdge[1][0] - longestEdge[0][0]);
    }

    draw.on('drawend', function (evt) {
        // Store the event object in the drawendEvent variable
        drawendEvent = evt;

        let angle = customAngle || calculateAngleFromLongestEdge(evt.feature.getGeometry().getCoordinates()[0]);
        if (customAngle !== null) {
            angle = customAngle;
        } else {
            const polygonCoords = evt.feature.getGeometry().getCoordinates()[0];
            let longestEdgeLength = 0;
            let longestEdge = [];

            for (let i = 0; i < polygonCoords.length - 1; i++) {
                const start = polygonCoords[i];
                const end = polygonCoords[i + 1];

                const length = Math.sqrt(Math.pow(end[0] - start[0], 2) + Math.pow(end[1] - start[1], 2));

                if (length > longestEdgeLength) {
                    longestEdgeLength = length;
                    longestEdge = [start, end];
                }
            }

            angle = Math.atan2(longestEdge[1][1] - longestEdge[0][1], longestEdge[1][0] - longestEdge[0][0]);
        }

        generateGrids(evt, angle); // Pass evt and angle to generateGrids
    });


    function generateGrids(evt, angle) {
        const extent = evt.feature.getGeometry().getExtent();

        const center = [0.5 * (extent[0] + extent[2]), 0.5 * (extent[1] + extent[3])];

        const extentDiagonalLength = Math.sqrt(Math.pow(extent[2] - extent[0], 2) + Math.pow(extent[3] - extent[1], 2));

        const numCells = Math.ceil(extentDiagonalLength / 3) + 2;

        const squareXCoords = [];
        for (let x = 0; x <= numCells; x++) {
            squareXCoords.push(rotatePoint([extent[0] + (x * 3), extent[1] - extentDiagonalLength], center, angle));
            squareXCoords.push(rotatePoint([extent[0] + (x * 3), extent[1] + extentDiagonalLength], center, angle));
        }

        const squareYCoords = [];
        for (let y = 0; y <= numCells; y++) {
            squareYCoords.push(rotatePoint([extent[0] - extentDiagonalLength, extent[1] + (y * 3)], center, angle));
            squareYCoords.push(rotatePoint([extent[0] + extentDiagonalLength, extent[1] + (y * 3)], center, angle));
        }

        const rectangularXCoords = [];
        for (let x = 0; x <= numCells; x++) {
            rectangularXCoords.push(rotatePoint([extent[0] + (x * 3), extent[1] - extentDiagonalLength - 2.5], center, angle));
            rectangularXCoords.push(rotatePoint([extent[0] + (x * 3), extent[1] + extentDiagonalLength - 2.5], center, angle));
        }

        const rectangularYCoords = [];
        for (let y = 0; y <= numCells; y++) {
            rectangularYCoords.push(rotatePoint([extent[0] - extentDiagonalLength, extent[1] + (y * 2.5) - 2.5], center, angle));
            rectangularYCoords.push(rotatePoint([extent[0] + extentDiagonalLength, extent[1] + (y * 2.5) - 2.5], center, angle));
        }

        // Buffer the polygon extent by 200 meters
        const bufferedExtent = ol.extent.buffer(extent, 200);

        // Triangular grid
        const triangularGridCoords = [];
        const halfHeight = Math.sqrt(3) / 2 * 3;
        const extentWidth = bufferedExtent[2] - bufferedExtent[0];
        const extentHeight = bufferedExtent[3] - bufferedExtent[1];
        const rowCount = Math.ceil((2 * extentHeight) / halfHeight);
        const colCount = Math.ceil((2 * extentWidth) / 3);
        for (let row = 0; row < rowCount; row++) {
            for (let col = 0; col < colCount; col++) {
                let x = bufferedExtent[0] + col * 3;
                let y = bufferedExtent[1] + row * halfHeight;
                if (row % 2 === 0) {
                    // ▽
                    triangularGridCoords.push([
                        rotatePoint([x, y], center, angle),
                        rotatePoint([x + 1.5, y + halfHeight], center, angle),
                        rotatePoint([x + 3, y], center, angle),
                        rotatePoint([x, y], center, angle),
                    ]);
                    triangularGridCoords.push([
                        rotatePoint([x + 1.5, y + halfHeight], center, angle),
                        rotatePoint([x + 3, y], center, angle),
                        rotatePoint([x + 4.5, y + halfHeight], center, angle),
                        rotatePoint([x + 1.5, y + halfHeight], center, angle)
                    ]);
                } else {
                    // △
                    triangularGridCoords.push([
                        rotatePoint([x + 1.5, y], center, angle),
                        rotatePoint([x + 3, y + halfHeight], center, angle),
                        rotatePoint([x, y + halfHeight], center, angle),
                        rotatePoint([x + 1.5, y], center, angle),
                    ]);
                    triangularGridCoords.push([
                        rotatePoint([x + 3, y + halfHeight], center, angle),
                        rotatePoint([x + 4.5, y], center, angle),
                        rotatePoint([x + 6, y + halfHeight], center, angle),
                        rotatePoint([x + 3, y + halfHeight], center, angle),
                    ]);
                }
            }
        }


        //Counting the Triangular Grid XYZ

        let triangularGridLines = new Set();

        triangularGridCoords.forEach(triangle => {
            triangle.forEach((point, index) => {
                let nextPoint = triangle[(index + 1) % 4]; // get the next point, wrapping around to the first point if necessary

                // represent the line as a string of its sorted endpoints
                let line = JSON.stringify([point, nextPoint].sort());

                // add the line to the set
                triangularGridLines.add(line);
            });
        });

        // initialize the counts
        // Count the X, Y, and Z lines based on the structure of the triangular grid
        let triangularGridXCount = colCount;
        let triangularGridYCount = rowCount;
        let triangularGridZCount = Math.max(rowCount, colCount);


        var geometry3857 = evt.feature.getGeometry().getCoordinates()[0];
        var geometry4326 = geometry3857.map(coord => ol.proj.transform(coord, 'EPSG:3857', 'EPSG:4326'));
        drawnPolygonGeoJSON = turf.polygon([geometry4326]);

        addAndTrimLineFeatures(squareGridX, squareXCoords, drawnPolygonGeoJSON, 'squareGridX');
        addAndTrimLineFeatures(squareGridY, squareYCoords, drawnPolygonGeoJSON, 'squareGridY');
        addAndTrimLineFeatures(rectangularGridX, rectangularXCoords, drawnPolygonGeoJSON, 'rectangularGridX');
        addAndTrimLineFeatures(rectangularGridY, rectangularYCoords, drawnPolygonGeoJSON, 'rectangularGridY');
        addAndTrimPolygonFeatures(triangularGrid, triangularGridCoords, drawnPolygonGeoJSON);



        // Calculate the number of coffee trees for square grids
        const numberOfCoffeeTreesForSquareGrid = squareGridXCount * squareGridYCount;

        // Calculate the number of coffee trees for rectangular grids
        const numberOfCoffeeTreesForRectangularGrid = rectangularGridXCount * rectangularGridYCount;

        //squareGridCountElement.textContent = numberOfCoffeeTreesForSquareGrid;
        //rectangularGridCountElement.textContent = numberOfCoffeeTreesForRectangularGrid;


        document.getElementById('squareGridXCount').innerText = squareGridXCount; // needed to show in the info card
        //console.log(`◇ Square grid X lines inside polygon: ${squareGridXCount}`);

        document.getElementById('squareGridYCount').innerText = squareGridYCount;
        //console.log(`◇ Square grid Y lines inside polygon: ${squareGridYCount}`);

        document.getElementById('rectangularGridYCount').innerText = rectangularGridYCount;
        //console.log(`▭ Rectangular grid Y lines inside polygon: ${rectangularGridYCount}`);

        document.getElementById('rectangularGridXCount').innerText = rectangularGridXCount;
        //console.log(`▭ Rectangular grid X lines inside polygon: ${rectangularGridXCount}`);

        document.getElementById('triangularGridXCount').innerText = triangularGridXCount;
        //console.log(`△ Triangular grid X lines inside polygon: ${triangularGridXCount}`);

        document.getElementById('triangularGridYCount').innerText = triangularGridYCount;
        //console.log(`△ Triangular grid Y lines inside polygon: ${triangularGridYCount}`);

        document.getElementById('triangularGridZCount').innerText = triangularGridZCount;
        //console.log(`△ Triangular grid Z lines inside polygon: ${triangularGridZCount}`);


        function storeGridFeatures(squareGridX, squareGridY, rectangularGridX, rectangularGridY, triangularGrid) {
            const format = new ol.format.GeoJSON();

            const squareGridXFeaturesGeoJSON = squareGridX.getSource().getFeatures().map(feature => format.writeFeatureObject(feature));
            const squareGridYFeaturesGeoJSON = squareGridY.getSource().getFeatures().map(feature => format.writeFeatureObject(feature));

            const rectangularGridXFeaturesGeoJSON = rectangularGridX.getSource().getFeatures().map(feature => format.writeFeatureObject(feature));
            const rectangularGridYFeaturesGeoJSON = rectangularGridY.getSource().getFeatures().map(feature => format.writeFeatureObject(feature));

            const triangularGridFeaturesGeoJSON = triangularGrid.getSource().getFeatures().map(feature => format.writeFeatureObject(feature));

            //localStorage.setItem('squareGridX', JSON.stringify(squareGridXFeaturesGeoJSON));
            //localStorage.setItem('squareGridY', JSON.stringify(squareGridYFeaturesGeoJSON));
            //localStorage.setItem('rectangularGridX', JSON.stringify(rectangularGridXFeaturesGeoJSON));
            //localStorage.setItem('rectangularGridY', JSON.stringify(rectangularGridYFeaturesGeoJSON));
            //localStorage.setItem('triangularGrid', JSON.stringify(triangularGridFeaturesGeoJSON));

            // Calculate intersection points for square grid
            calculateIntersectionPoints([squareGridX, squareGridY], squareGridIntersectionPoints);

            // Calculate intersection points for rectangular grid
            calculateIntersectionPoints([rectangularGridX, rectangularGridY], rectangularGridIntersectionPoints);

            // Calculate intersection points for triangular grid
            calculateIntersectionPoints([triangularGrid], triangularGridIntersectionPoints);

        }

        storeGridFeatures(squareGridX, squareGridY, rectangularGridX, rectangularGridY, triangularGrid);


        function storeGridIntersectionPoints(squareGridIntersectionPoints, rectangularGridIntersectionPoints, triangularGridIntersectionPoints) {
            const format = new ol.format.GeoJSON();

            // Convert and store intersection points for square grid
            const squareGridIntersectionPointsGeoJSON = squareGridIntersectionPoints.getSource().getFeatures().map(feature => format.writeFeatureObject(feature));
            localStorage.setItem('squareGridIntersectionPoints', JSON.stringify(squareGridIntersectionPointsGeoJSON));

            // Convert and store intersection points for rectangular grid
            const rectangularGridIntersectionPointsGeoJSON = rectangularGridIntersectionPoints.getSource().getFeatures().map(feature => format.writeFeatureObject(feature));
            localStorage.setItem('rectangularGridIntersectionPoints', JSON.stringify(rectangularGridIntersectionPointsGeoJSON));

            // Convert and store intersection points for triangular grid
            const triangularGridIntersectionPointsGeoJSON = triangularGridIntersectionPoints.getSource().getFeatures().map(feature => format.writeFeatureObject(feature));
            localStorage.setItem('triangularGridIntersectionPoints', JSON.stringify(triangularGridIntersectionPointsGeoJSON));
        }

        storeGridIntersectionPoints(squareGridIntersectionPoints, rectangularGridIntersectionPoints, triangularGridIntersectionPoints);



        // Calculate intersection points for given layers and store them in the given intersectionPointsLayer
        function calculateIntersectionPoints(layers, intersectionPointsLayer) {
            for (let i = 0; i < layers.length; i++) {
                const features1 = layers[i].getSource().getFeatures();
                for (let j = i + 1; j < layers.length; j++) {
                    const features2 = layers[j].getSource().getFeatures();
                    features1.forEach(feature1 => {
                        const geom1 = feature1.getGeometry();
                        features2.forEach(feature2 => {
                            const geom2 = feature2.getGeometry();
                            const coords1 = geom1.getCoordinates();
                            const coords2 = geom2.getCoordinates();
                            for (let k = 0; k < coords1.length - 1; k++) {
                                for (let l = 0; l < coords2.length - 1; l++) {
                                    const line1 = turf.lineString([coords1[k], coords1[k + 1]]);
                                    const line2 = turf.lineString([coords2[l], coords2[l + 1]]);
                                    const intersect = turf.lineIntersect(line1, line2);
                                    if (intersect.features.length > 0) {
                                        const point = intersect.features[0].geometry.coordinates;
                                        intersectionPointsLayer.getSource().addFeature(new ol.Feature(new ol.geom.Point(point)));
                                    }
                                }
                            }
                        });
                    });
                }
            }
        }



        // Use setTimeout to delay the execution of countIntersectionPoints
        setTimeout(countIntersectionPoints, 5000); // wait 5000 milliseconds (1 second) before executing countIntersectionPoints

        // Call the function to count intersection points after they have been calculated
        countIntersectionPoints();
    };

    function rotatePoint(point, center, angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const nx = (cos * (point[0] - center[0])) - (sin * (point[1] - center[1])) + center[0];
        const ny = (sin * (point[0] - center[0])) + (cos * (point[1] - center[1])) + center[1];
        return [nx, ny];
    }

    //For squareGrid and rectangulaGrid
    function addAndTrimLineFeatures(layer, coords, polygon, gridType) {
        const source = layer.getSource();

        for (let i = 0, len = coords.length; i < len; i += 2) {
            const start = coords[i];
            const end = coords[i + 1];
            const geometry = new ol.geom.LineString([start, end]);

            var geometry3857 = geometry.getCoordinates();
            var geometry4326 = geometry3857.map(coord => ol.proj.transform(coord, 'EPSG:3857', 'EPSG:4326'));
            var geojson = turf.lineString(geometry4326);

            var splitted = turf.lineSplit(geojson, polygon);

            splitted.features.forEach(function (lineSegment) {
                if (turf.booleanPointInPolygon(turf.centerOfMass(lineSegment), polygon)) {
                    var lineSegment3857 = new ol.geom.LineString(lineSegment.geometry.coordinates.map(coord => ol.proj.transform(coord, 'EPSG:4326', 'EPSG:3857')));

                    source.addFeature(new ol.Feature(lineSegment3857));

                    switch (gridType) {
                        case 'squareGridX':
                            squareGridXCount++;
                            break;
                        case 'squareGridY':
                            squareGridYCount++;
                            break;
                        case 'rectangularGridX':
                            rectangularGridXCount++;
                            break;
                        case 'rectangularGridY':
                            rectangularGridYCount++;
                            break;
                    }
                }
            });
        }
    }


    function addAndTrimPolygonFeatures(layer, coords, polygon) {
        const source = layer.getSource();

        // Shrink the polygon slightly
        var shrunkPolygon = turf.transformScale(polygon, 0.999);

        coords.forEach(triangleCoords => {
            const geometry = new ol.geom.Polygon([triangleCoords]);

            var geometry3857 = geometry.getCoordinates()[0];
            var geometry4326 = geometry3857.map(coord => ol.proj.transform(coord, 'EPSG:3857', 'EPSG:4326'));
            var geojson = turf.polygon([geometry4326]);

            var intersected = turf.intersect(geojson, polygon);

            if (intersected) {
                var intersected3857 = new ol.geom.Polygon(intersected.geometry.coordinates.map(ring => ring.map(coord => ol.proj.transform(coord, 'EPSG:4326', 'EPSG:3857'))));

                source.addFeature(new ol.Feature(intersected3857));

                // Add the vertices of the intersected triangle to the intersection points layer
                intersected3857.getCoordinates()[0].slice(0, -1).forEach(vertex => {
                    // Convert the vertex to EPSG:4326
                    var vertex4326 = ol.proj.transform(vertex, 'EPSG:3857', 'EPSG:4326');

                    // Create a turf point from the vertex
                    var point = turf.point(vertex4326);

                    // Check if the point is inside the shrunk polygon
                    if (turf.booleanPointInPolygon(point, shrunkPolygon)) {
                        triangularGridIntersectionPoints.getSource().addFeature(new ol.Feature(new ol.geom.Point(vertex)));
                    }
                });
            }
        });
    }

    function countIntersectionPoints() {
        const squareGridIntersectionPointCount = countPointsInsidePolygon(squareGridIntersectionPoints, drawnPolygonGeoJSON);
        const rectangularGridIntersectionPointCount = countPointsInsidePolygon(rectangularGridIntersectionPoints, drawnPolygonGeoJSON);
        const triangularGridIntersectionPointCount = countPointsInsidePolygon(triangularGridIntersectionPoints, drawnPolygonGeoJSON);

        //console.log(`Estimated Coffee Tree Count: ${squareGridIntersectionPointCount}`);
        squareGridCountElement.innerText = `${squareGridIntersectionPointCount}`;

        //console.log(`Estimated Coffee Tree Count: ${rectangularGridIntersectionPointCount}`);
        rectangularGridCountElement.innerText = `${rectangularGridIntersectionPointCount}`;

        //console.log(`Estimated Coffee Tree Count: ${triangularGridIntersectionPointCount}`);
        triangularGridCountElement.innerText = `${triangularGridIntersectionPointCount}`;

    }

    function countPointsInsidePolygon(layer, polygon) {
        const features = layer.getSource().getFeatures();
        let count = 0;

        // Create a set to store unique points
        let uniquePoints = new Set();

        for (let i = 0; i < features.length; i++) {
            const feature = features[i];
            const point3857 = feature.getGeometry().getCoordinates();
            const point4326 = ol.proj.transform(point3857, 'EPSG:3857', 'EPSG:4326');
            const point = turf.point(point4326);

            // Convert the point to a string and add it to the set
            const pointString = JSON.stringify(point);
            uniquePoints.add(pointString);
        }

        // Iterate over the unique points and count the ones that are inside the polygon
        uniquePoints.forEach(pointString => {
            const point = JSON.parse(pointString);

            // Increase the count if the point is inside the polygon
            if (turf.booleanPointInPolygon(point, polygon)) {
                count++;
            }
        });

        return count;
    }

    // Function to clear existing grid and point layers and sources
    function clearExistingLayersAndSources() {
        // Clear squareGridX layer and source
        squareGridX.getSource().clear();
        // Clear squareGridY layer and source
        squareGridY.getSource().clear();
        // Clear rectangularGridX layer and source
        rectangularGridX.getSource().clear();
        // Clear rectangularGridY layer and source
        rectangularGridY.getSource().clear();
        // Clear triangularGrid layer and source
        triangularGrid.getSource().clear();

        // Clear intersection point layers and sources
        squareGridIntersectionPoints.getSource().clear();
        rectangularGridIntersectionPoints.getSource().clear();
        triangularGridIntersectionPoints.getSource().clear();
    }

    // Function to remove existing grid layers
    function removeGridLayers() {
        map.removeLayer(squareGridX);
        map.removeLayer(squareGridY);
        map.removeLayer(rectangularGridX);
        map.removeLayer(rectangularGridY);
        map.removeLayer(triangularGrid);
    }


    //GRID TYPE/PATTERN PROPERTIES

    // Function to hide gridPropertiesContainer with slide-up animation
    function hideGridPropertiesContainer() {
        const gridPropertiesContainer = document.getElementById('gridPropertiesContainer');
        gridPropertiesContainer.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
        gridPropertiesContainer.style.transform = 'translateX(-50%) translateY(-100%)'; // Slide the container up
        gridPropertiesContainer.style.opacity = '0'; // Fade out the container

        setTimeout(() => {
            gridPropertiesContainer.style.display = 'none';
            gridPropertiesContainer.style.transition = ''; // Reset transition
            gridPropertiesContainer.style.transform = ''; // Reset transform
            gridPropertiesContainer.style.opacity = ''; // Reset opacity
        }, 300); // Delay should be equal to transition duration
    }

    // Function to determine grid type and intersection type
    function determineGridType(button) {
        const gridTypes = ['squareGrid', 'rectangularGrid', 'triangularGrid'];
        const intersectionTypes = [
            'squareGridIntersectionPoints',
            'rectangularGridIntersectionPoints',
            'triangularGridIntersectionPoints'
        ];

        for (let i = 0; i < gridTypes.length; i++) {
            if (button.classList.contains(`gridTypeOptionBtn${i + 1}`)) {
                return { gridType: gridTypes[i], gridIntersectionType: intersectionTypes[i] };
            }
        }

        return { gridType: '', gridIntersectionType: '' };
    }

    finishDrawingButton.addEventListener('click', function () {
        if (draw) {
            draw.finishDrawing();
            map.removeInteraction(draw);
            isSketchActive = false;

            sketchFarmBtn.style.backgroundColor = "white";
            sketchFarmBtnIcon.textContent = "create";
            sketchFarmBtnIcon.style.color = "#515151";
            undoSketchBtn.style.display = "none";

            // Show all buttons again after drawing is finished
            showButtonsSkecthFarmInactive();

            finishDrawingButton.classList.add('hidden');

            // Show the clear all drawing button
            showButton('clearAllDrawingBtn');

            // After drawing is finished and the "finishDrawingButton" is clicked, show the floating container
            showAddFarmSuccess();

            // Hide the floating title
            const sketchingFarmFloatingTitle = document.querySelector('.sketchingFarmfloatingTitle');
            if (sketchingFarmFloatingTitle) {
                sketchingFarmFloatingTitle.style.display = "none";
            }

            // Add a delay before showing the gridPropertiesContainer
            //setTimeout(showGridPropertiesContainer, 2500); // 2500 milliseconds = 2.5 seconds

            // Get the gridPatternInformation element
            const gridPatternInformation = document.querySelector('#gridPatternInformation');

            // Set the display property to flex to show the element
            gridPatternInformation.style.display = 'flex';
        }
    });

    // close-button on grid pattern type properties
    //document.querySelector('.closeGridPropertiesContainer').addEventListener('click', function () {
    // Hide gridPropertiesContainer with slide-up animation
    //  hideGridPropertiesContainer();
    //});


    // Variable to keep track of the last selected grid type
    var lastSelectedGridType = '';
    var lastSelectedGridIntersectionType = '';

    // Grid Type Options and Grid Intersection Options
    var buttons1 = document.querySelectorAll('.gridTypeOptionBtn1'); // squareGrid
    var buttons2 = document.querySelectorAll('.gridTypeOptionBtn2'); // rectangularGrid
    var buttons3 = document.querySelectorAll('.gridTypeOptionBtn3'); // triangularGrid

    [...buttons1, ...buttons2, ...buttons3].forEach(function (button) {
        button.addEventListener('click', function () {
            // Determine the type of grid that was clicked
            const { gridType, gridIntersectionType } = determineGridType(this);

            if (lastSelectedGridType) {
                //console.log(`Previous grid type: ${lastSelectedGridType}`);
            }
            console.log(`Current grid type: ${gridType} selected!`);

            if (lastSelectedGridIntersectionType) {
                //console.log(`Previous grid intersection type: ${lastSelectedGridIntersectionType}`);
            }
            console.log(`Current grid intersection type: ${gridIntersectionType} selected!`);

            // Update the last selected grid type and grid intersection type
            lastSelectedGridType = gridType;
            lastSelectedGridIntersectionType = gridIntersectionType;

            // Update button classes
            [...buttons1, ...buttons2, ...buttons3].forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
        });
    });




    //APPLYING A CUSTOM GRID ORIENTATION ANGLE 

    let lastAppliedCustomAngle = 0;

    // Attach the "Apply" button click event listener
    document.getElementById('apply-button').addEventListener('click', function () {
        const inputAngle = document.getElementById('rotate-input').value;
        if (inputAngle !== "") {
            const customAngleDegrees = parseFloat(inputAngle);
            const customAngleRadians = customAngleDegrees * (Math.PI / 180); // Convert degree to radian

            console.log("Last applied custom angle in degrees: " + customAngleDegrees);
            localStorage.setItem('lastAppliedCustomAngle', customAngleDegrees); // Save the angle


            if (drawendEvent) {
                clearExistingLayersAndSources();
                generateGrids(drawendEvent, customAngleRadians); // Use radians for grid generation
            } else {
                // Handle the case where drawendEvent is not defined
                console.error("drawendEvent is not defined.");
            }
        }
    });

    // Define the storeSelectedIntersectionPoints function
    function storeSelectedIntersectionPoints() {
        const format = new ol.format.GeoJSON();

        // Clear existing intersection points data from local storage
        localStorage.removeItem('squareGridIntersectionPoints');
        localStorage.removeItem('rectangularGridIntersectionPoints');
        localStorage.removeItem('triangularGridIntersectionPoints');

        // Determine which intersection points to store based on the last selected grid intersection type
        let intersectionPointsToStore = [];
        let intersectionPointsGeoJSON = [];

        switch (lastSelectedGridIntersectionType) {
            case 'squareGridIntersectionPoints':
                intersectionPointsToStore = squareGridIntersectionPoints;
                intersectionPointsGeoJSON = intersectionPointsToStore.getSource().getFeatures().map(feature => format.writeFeatureObject(feature));
                localStorage.setItem('squareGridIntersectionPoints', JSON.stringify(intersectionPointsGeoJSON));
                break;

            case 'rectangularGridIntersectionPoints':
                intersectionPointsToStore = rectangularGridIntersectionPoints;
                intersectionPointsGeoJSON = intersectionPointsToStore.getSource().getFeatures().map(feature => format.writeFeatureObject(feature));
                localStorage.setItem('rectangularGridIntersectionPoints', JSON.stringify(intersectionPointsGeoJSON));
                break;

            case 'triangularGridIntersectionPoints':
                intersectionPointsToStore = triangularGridIntersectionPoints;
                intersectionPointsGeoJSON = intersectionPointsToStore.getSource().getFeatures().map(feature => format.writeFeatureObject(feature));
                localStorage.setItem('triangularGridIntersectionPoints', JSON.stringify(intersectionPointsGeoJSON));
                break;
        }
    }

    // Define the storeSelectedGridFeatures function
    function storeSelectedGridFeatures(squareGridX, squareGridY, rectangularGridX, rectangularGridY, triangularGrid) {
        const format = new ol.format.GeoJSON();

        // Clear existing grid data from local storage
        localStorage.removeItem('squareGridX');
        localStorage.removeItem('squareGridY');
        localStorage.removeItem('rectangularGridX');
        localStorage.removeItem('rectangularGridY');
        localStorage.removeItem('triangularGrid');

        // Determine which grid to store based on the last selected grid type
        switch (lastSelectedGridType) {
            case 'squareGrid':
                const squareGridXFeaturesGeoJSON = squareGridX.getSource().getFeatures().map(feature => format.writeFeatureObject(feature));
                const squareGridYFeaturesGeoJSON = squareGridY.getSource().getFeatures().map(feature => format.writeFeatureObject(feature));
                localStorage.setItem('squareGridX', JSON.stringify(squareGridXFeaturesGeoJSON));
                localStorage.setItem('squareGridY', JSON.stringify(squareGridYFeaturesGeoJSON));
                break;

            case 'rectangularGrid':
                const rectangularGridXFeaturesGeoJSON = rectangularGridX.getSource().getFeatures().map(feature => format.writeFeatureObject(feature));
                const rectangularGridYFeaturesGeoJSON = rectangularGridY.getSource().getFeatures().map(feature => format.writeFeatureObject(feature));
                localStorage.setItem('rectangularGridX', JSON.stringify(rectangularGridXFeaturesGeoJSON));
                localStorage.setItem('rectangularGridY', JSON.stringify(rectangularGridYFeaturesGeoJSON));
                break;

            case 'triangularGrid':
                const triangularGridFeaturesGeoJSON = triangularGrid.getSource().getFeatures().map(feature => format.writeFeatureObject(feature));
                localStorage.setItem('triangularGrid', JSON.stringify(triangularGridFeaturesGeoJSON));
                break;
        }
    }

    // Event listener for the save-button
    document.getElementById('save-button').addEventListener('click', function () {
        storeSelectedGridFeatures(squareGridX, squareGridY, rectangularGridX, rectangularGridY, triangularGrid);
        storeSelectedIntersectionPoints();
        console.log("Last saved custom angle in degrees: " + localStorage.getItem('lastAppliedCustomAngle'));


        // Get intersection and grid counts based on the last selected grid type
        let intersectionCount = 0;
        let gridXCount = 0;
        let gridYCount = 0;
        let gridZCount = 0;

        switch (lastSelectedGridType) {
            case 'squareGrid':
                intersectionCount = squareGridCountElement.innerText;
                gridXCount = document.getElementById('squareGridXCount').innerText;
                gridYCount = document.getElementById('squareGridYCount').innerText;
                break;

            case 'rectangularGrid':
                intersectionCount = rectangularGridCountElement.innerText;
                gridXCount = document.getElementById('rectangularGridXCount').innerText;
                gridYCount = document.getElementById('rectangularGridYCount').innerText;
                break;

            case 'triangularGrid':
                intersectionCount = triangularGridCountElement.innerText;
                gridXCount = document.getElementById('triangularGridXCount').innerText;
                gridYCount = document.getElementById('triangularGridYCount').innerText;
                gridZCount = document.getElementById('triangularGridZCount').innerText;
                break;
        }

        // Log the counts
        console.log(`Intersection count: ${intersectionCount}`);
        console.log(`GridX count: ${gridXCount}`);
        console.log(`GridY count: ${gridYCount}`);
        if (lastSelectedGridType === 'triangularGrid') {
            console.log(`GridZ count: ${gridZCount}`);
        }

        // Save the counts to local storage
        localStorage.setItem('lastSelectedIntersectionCount', intersectionCount);
        localStorage.setItem('lastSelectedGridXCount', gridXCount);
        localStorage.setItem('lastSelectedGridYCount', gridYCount);
        if (lastSelectedGridType === 'triangularGrid') {
            localStorage.setItem('lastSelectedGridZCount', gridZCount);


        }


        // Save the last selected grid type and intersection type to local storage
        localStorage.setItem('lastSelectedGridType', lastSelectedGridType);
        localStorage.setItem('lastSelectedGridIntersectionType', lastSelectedGridIntersectionType);

        // Hide the gridPropertiesContainer with slide-up animation
        hideGridPropertiesContainer();
        
        // Send event to react native app
        if (window.ReactNativeWebView) {
            const message = { actionType: 'Save', event: 'click' };
            window.ReactNativeWebView.postMessage(JSON.stringify(message));
        }

        // Show the floating container with slide-up animation
        showAddFarmSuccess();



        // Log visible div classes
        const visibleDivClasses = [];
        const divElements = document.querySelectorAll('.countContainer');
        divElements.forEach(div => {
            if (div.style.display !== 'none') {
                visibleDivClasses.push(div.id);
            }
        });

        // Store visible div classes in localStorage
        localStorage.setItem('visibleDivClasses', JSON.stringify(visibleDivClasses));

        console.log("Visible div classes:", visibleDivClasses);
    });


    //Undo Sketch Function
    // Get a reference to the undoSketchBtn button
    const undoSketchBtn = document.getElementById("undoSketchBtn");

    // Hide the undoSketchBtn button initially
    undoSketchBtn.style.display = "none";

    // Add an event listener to the drawstart event of the draw interaction
    draw.on("drawstart", function (event) {
        // Show the undoSketchBtn button when the user starts drawing a polygon
        undoSketchBtn.style.display = "block";
    });

    // Function to undo the last sketch vertex
    function undoSketchInteraction() {
        draw.removeLastPoint();
    }

    undoSketchBtn.addEventListener("click", undoSketchInteraction);


    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const size = 10;
    const spacing = 8;
    canvas.width = size;
    canvas.height = size;
    context.strokeStyle = "rgba(56, 108, 52, 0.5)";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(size, size);
    context.stroke();

    const pattern = context.createPattern(canvas, "repeat");

    farmVectorLayer.setStyle(
        new ol.style.Style({
            fill: new ol.style.Fill({
                color: pattern,
            }),
            stroke: new ol.style.Stroke({
                color: "#386c34",
                width: 10,
            }),
        })
    );

    sketchFarmBtn.style.backgroundColor = "#FF6666";
    sketchFarmBtnIcon.textContent = "delete_forever";
    sketchFarmBtnIcon.style.color = "white";

    draw.on("drawstart", function (event) {
        polygonExists = true;
        event.feature.getGeometry().on("change", function (geomEvent) {
            const coordinates = geomEvent.target.getCoordinates()[0];
            if (coordinates.length >= 5) {
                finishDrawingButton.classList.remove('hidden');

            }
        });
    });

    draw.on("drawend", async function (event) {
        const polygonGeometry = event.feature.getGeometry();
        const centroid = ol.extent.getCenter(polygonGeometry.getExtent());
        const farmCenterLon = centroid[0];
        const farmCenterLat = centroid[1];

        const pointFeature = new ol.Feature({
            geometry: new ol.geom.Point(centroid),
        });

        pointFeature.setStyle(
            new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 16,
                    fill: new ol.style.Fill({
                        color: '#386c34',
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'white',
                        width: 8,
                    }),
                }),
            })
        );

        map.removeInteraction(draw);
        isSketchActive = false;

        sketchFarmBtn.style.backgroundColor = "white";
        sketchFarmBtnIcon.textContent = "create";
        sketchFarmBtnIcon.style.color = "#515151";

        vectorSource.addFeature(pointFeature);

        const centerPointCoordinates = ol.proj.transform([farmCenterLon, farmCenterLat], 'EPSG:3857', 'EPSG:4326');
        console.log('Center Point Lon:', centerPointCoordinates[0]);
        console.log('Center Point Lat:', centerPointCoordinates[1]);

        const polygonCoordinates = polygonGeometry.getCoordinates()[0];
        console.log('Polygon Coordinates:');
        const polygonPoints = [];
        polygonCoordinates.forEach((coordinate, index) => {
            const lonLat = ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326');
            polygonPoints.push({ lon: lonLat[0], lat: lonLat[1] });
            console.log(`Corner Point ${index + 1}: Lon ${lonLat[0]}, Lat ${lonLat[1]}`);
        });

        const segments = [];
        const segmentLengths = [];
        for (let i = 0; i < polygonCoordinates.length - 1; i++) {
            const startPoint = polygonCoordinates[i];
            const endPoint = polygonCoordinates[i + 1];
            const segment = new ol.geom.LineString([startPoint, endPoint]);
            segments.push(segment);
            const length = ol.sphere.getLength(segment);
            segmentLengths.push(length.toFixed(2));
        }

        console.log('Segment Lengths (m):');
        segmentLengths.forEach((length, index) => {
            console.log(`Segment ${index + 1}: ${length} meters`);
        });

        const area = ol.sphere.getArea(polygonGeometry);
        let areaHectares = null;
        if (area > 10000) {
            areaHectares = (area / 10000).toFixed(2);
        }
        console.log('Polygon Area:');
        console.log(`Area (m²): ${area.toFixed(2)} square meters`);
        if (areaHectares) {
            console.log(`Area (ha): ${areaHectares} hectares`);
        }

        const { placeName: address, firstPart, streetAddress, village, commune, ward, district, city, province, postcode, country } = await fetchPlaceName(centerPointCoordinates[0], centerPointCoordinates[1]);
        console.log("Address:", address);

        const tooltipElement = document.createElement('div');
        tooltipElement.style.cssText = `
position: absolute;
background-color: #ffffff;
border: 1px solid #ccc;
border-radius: 1000px;
padding: 20px 30px;
font-family: 'Be Vietnam Pro', Arial, sans-serif;
font-size: 30px;
font-weight: bold;
color: #000000;
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
display: flex;
align-items: center;
justify-content: center;
min-width: 120px;
height: 30px;
`;

        const areaInHectares = area > 10000 ? (area / 10000).toFixed(2) + ' ha' : area.toFixed(2) + ' m²';
        tooltipElement.innerHTML = `<span style="white-space: nowrap; display: flex; align-items: center; color: #515151;"><i class="fa-solid fa-seedling" style="font-size: 40px; margin-right: 10px;"></i>${areaInHectares}</span>`;

        tooltipOverlay = new ol.Overlay({
            element: tooltipElement,
            offset: [0, -100],
            positioning: 'bottom-center',
        });

        tooltipOverlay.setPosition(centroid);

        map.addOverlay(tooltipOverlay);
        tooltipOverlays.push(tooltipOverlay);

        //Get Elevation Values from Map Box Elevation
        async function getElevationFromMapbox(centerPointCoordinates) {
            const accessToken = 'pk.eyJ1IjoiY21sb3NhcmlhIiwiYSI6ImNsZGJ4cHp2ajAwMGszb3FmeXpxYmVpMHkifQ.3wsPFc9FkszxcH27eEq2dw';

            let centerElevation;

            try {
                const centerPointLon = centerPointCoordinates[0];
                const centerPointLat = centerPointCoordinates[1];
                const centerUrl = `https://api.mapbox.com/v4/mapbox.mapbox-terrain-v2/tilequery/${centerPointLon},${centerPointLat}.json?layers=contour&access_token=${accessToken}`;
                const centerResponse = await fetch(centerUrl);
                if (centerResponse.ok) {
                    const centerData = await centerResponse.json();
                    if (centerData.features && centerData.features.length > 0) {
                        centerElevation = centerData.features[0].properties.ele; // Update the assignment statement
                        console.log("Elevation (meters):", centerElevation);
                    } else {
                        console.error("No elevation data found for the center point.");
                    }
                } else {
                    console.error("Failed to fetch elevation data for the center point:", centerResponse.status, centerResponse.statusText);
                }
            } catch (error) {
                console.error("Failed to fetch elevation data for the center point:", error);
            }


            // Log the information
            const loggedInfo = {
                placeName: firstPart,
                streetAddress: streetAddress.trim(),
                village: village,
                commune: commune,
                ward: ward,
                district: district,
                city: city,
                province: province,
                postcode: postcode,
                country: country
            };

            // Address and Long Lat sent as separated messages
            // Send data to React Native App
            try {
                // Construct the data object with relevant information
                const dataToPost = {
                    centerPoint: {
                        lon: centerPointCoordinates[0],
                        lat: centerPointCoordinates[1],
                        elevation: centerElevation
                    },
                    polygonCoordinates: polygonPoints,
                    segmentLengths: segmentLengths,
                    area: {
                        squareMeters: area.toFixed(2),
                        hectares: areaHectares
                    },
                    address: loggedInfo,
                };

                // Create a React message to indicate the drawing has finished
                const reactMessage = {
                    actionType: 'Drawing',
                    event: 'completed',
                    data: dataToPost,
                };

                // Send address separately
                const addressMessage = {
                    type: 'addressInfo',
                    data: loggedInfo
                };

                // Send center point longitude and latitude separately
                const centerPointMessage = {
                    type: 'centerPointInfo',
                    data: {
                        lon: centerPointCoordinates[0],
                        lat: centerPointCoordinates[1]
                    }
                };
                
                // Send event to react native app
                if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify(reactMessage));
                }
            } catch (error) {
                console.error(error);
                // Handle the error (or do nothing to prevent logging)
            }
        }


        // Store polygon coordinates in local storage
        const storedPolygon = {
            centerPoint: {
                lon: centerPointCoordinates[0],
                lat: centerPointCoordinates[1],
            },
            polygonPoints: polygonPoints,
            segmentLengths: segmentLengths,
            area: {
                squareMeters: area.toFixed(2),
                hectares: areaHectares
            },
            address: address
        };
        
        await getElevationFromMapbox(centerPointCoordinates);
        
        localStorage.setItem('enfarm_polygon_coordinates', JSON.stringify(storedPolygon));
    });
}

const sketchFarmBtn = document.getElementById("sketchFarmBtn");
sketchFarmBtn.addEventListener("click", function () {
    startSketchFarm();
});

const finishDrawingButton = document.querySelector('.finish-drawing');


// Function to show all the hidden buttons
function showButtonsSkecthFarmInactive() {
    for (let button of buttonsToHideSketchFarmActive) {
        let btn = document.getElementById(button);
        if (btn) {
            btn.style.display = '';
        }
    }
}

// Function to show the floating container and trigger the slide-up animation
function showAddFarmSuccess() {
    const addFarmSuccess = document.getElementById("addFarmSuccess");
    addFarmSuccess.style.display = "block"; // Set the container to be visible
    addFarmSuccess.classList.add("slide-up"); // Add the slide-up animation class

    // Hide the container after 2 seconds
    setTimeout(() => {
        hideAddFarmSuccess();
    }, 2000);
}

// Function to hide the floating container and trigger the slide-down animation
function hideAddFarmSuccess() {
    const addFarmSuccess = document.getElementById("addFarmSuccess");
    addFarmSuccess.classList.remove("slide-up"); // Remove the slide-up animation class
    addFarmSuccess.classList.add("slide-down"); // Add the slide-down animation class

    // Hide the container after the animation duration (1000ms)
    setTimeout(() => {
        addFarmSuccess.style.display = "none";
        addFarmSuccess.classList.remove("slide-down"); // Remove the slide-down animation class
    }, 1000);
}

function showButton(id) {
    var btn = document.getElementById(id);
    if (btn) {
        btn.style.display = "block"; // or whatever your default display style is
    } else {
        console.log("No button found with id: " + id);
    }
}


finishDrawingButton.addEventListener('click', function () {
    if (draw) {
        draw.finishDrawing();
        map.removeInteraction(draw);
        isSketchActive = false;

        sketchFarmBtn.style.backgroundColor = "white";
        sketchFarmBtnIcon.textContent = "create";
        sketchFarmBtnIcon.style.color = "#515151";
        undoSketchBtn.style.display = "none";

        // Show all buttons again after drawing is finished
        showButtonsSkecthFarmInactive();

        finishDrawingButton.classList.add('hidden');

        // Show the clear all drawing button
        showButton('clearAllDrawingBtn');

        // After drawing is finished and the "finishDrawingButton" is clicked, show the floating container
        showAddFarmSuccess();

        // Hide the floating title
        const sketchingFarmFloatingTitle = document.querySelector('.sketchingFarmfloatingTitle');
        if (sketchingFarmFloatingTitle) {
            sketchingFarmFloatingTitle.style.display = "none";
        }

        // Add a delay of 2 seconds before showing the gridPropertiesContainer
        setTimeout(function () {
            const gridPropertiesContainer = document.getElementById('gridPropertiesContainer');

            // Apply the slide-down transition animation with fade-in effect
            gridPropertiesContainer.style.transition = 'transform 0.3s cubic-bezier(0.36, 0.66, 0.04, 1.0), opacity 0.3s cubic-bezier(0.36, 0.66, 0.04, 1.0), top 0.3s cubic-bezier(0.36, 0.66, 0.04, 1.0)';
            gridPropertiesContainer.style.transform = 'translateX(-50%) translateY(0)'; // Slide the container down
            gridPropertiesContainer.style.opacity = '1'; // Fade in the container
            gridPropertiesContainer.style.top = '0'; // Show the container at the top
            gridPropertiesContainer.style.display = 'block';
        }, 2500); // 2500 milliseconds = 2.5 seconds

        // Get the gridPatternInformation element
        const gridPatternInformation = document.querySelector('#gridPatternInformation');

        // Set the display property to flex to show the element
        gridPatternInformation.style.display = 'flex';
    }
});

function deactivateSketchFarm() {
    const sketchFarmBtn = document.getElementById("sketchFarmBtn");
    if (isSketchActive) {
        sketchFarmBtn.style.backgroundColor = "white";
        const sketchFarmBtnIcon = sketchFarmBtn.querySelector("i");
        sketchFarmBtnIcon.textContent = "create";
        sketchFarmBtnIcon.style.color = "#515151";

        if (draw) {
            map.removeInteraction(draw);
            draw = null;
        }

        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }

        isSketchActive = false;

        // Show all buttons again when deactivated
        showButtonsSkecthFarmInactive();
    }
}

document.getElementById("measureAreaBtn").addEventListener("click", deactivateSketchFarm);
document.getElementById("measureLengthBtn").addEventListener("click", deactivateSketchFarm);
document.getElementById("addSensorBtn").addEventListener("click", deactivateSketchFarm);

// Add event listener to sketchFarmBtn to show buttons when it's clicked to deactivate the function
document.getElementById("sketchFarmBtn").addEventListener("click", function () {
    if (!isSketchActive) {
        showButtonsSkecthFarmInactive();
    }
    
    // Send event to react native app
    if (window.ReactNativeWebView) {
        const message = { actionType: 'Drawing', event: isSketchActive ? 'click' : 'unclick' };
        window.ReactNativeWebView.postMessage(JSON.stringify(message));
    }
});

// Call this function to hide the floating container on map load
hideAddFarmSuccess();

// Load the Lottie animation when the document is ready
document.addEventListener("DOMContentLoaded", function () {
    // Replace "LRglt3SwZv.json" with the URL of your Lottie animation JSON file
    const animationURL = "https://lottie.host/52133049-24ce-4236-a7c1-0f11d4b03ace/LRglt3SwZv.json";
    const animationContainer = document.getElementById("farmsuccessAnimationCheck");
    const animation = lottie.loadAnimation({
        container: animationContainer,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: animationURL,
    });
});




let farmVectorLayer;
// Function to retrieve stored FARM POLYGON from local storage
function getStoredPolygon() {
    const storedPolygonString = localStorage.getItem('enfarm_polygon_coordinates');
    if (storedPolygonString) {
        const storedPolygon = JSON.parse(storedPolygonString);
        const polygonPoints = storedPolygon.polygonPoints.map(point => ol.proj.transform([point.lon, point.lat], 'EPSG:4326', 'EPSG:3857'));

        const polygonFeature = new ol.Feature({
            geometry: new ol.geom.Polygon([polygonPoints]),
        });

        const farmCenter = ol.proj.transform([storedPolygon.centerPoint.lon, storedPolygon.centerPoint.lat], 'EPSG:4326', 'EPSG:3857');

        const farmCenterFeature = new ol.Feature({
            geometry: new ol.geom.Point(farmCenter),
        });

        farmVectorLayer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: [polygonFeature, farmCenterFeature],
            }),
            style: [
                new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: 'rgba(56, 108, 52, 0.1)',
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#386c34',
                        width: 10,
                    }),
                }),
                new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 16,
                        fill: new ol.style.Fill({
                            color: '#386c34',
                        }),
                        stroke: new ol.style.Stroke({
                            color: 'white',
                            width: 8,
                        }),
                    }),
                    geometry: farmCenterFeature.getGeometry(),
                }),
            ],
        });

        vectorSource.addFeatures([polygonFeature, farmCenterFeature]); // Add both features to the vector source

        map.addLayer(farmVectorLayer);

        // Retrieve and display the farm's center point
        const farmCenterLon = storedPolygon.centerPoint.lon;
        const farmCenterLat = storedPolygon.centerPoint.lat;
        //console.log('Farm Center Lon:', farmCenterLon);
        //console.log('Farm Center Lat:', farmCenterLat);

        const centroid = ol.extent.getCenter(polygonFeature.getGeometry().getExtent());

        const tooltipElement = document.createElement('div');
        tooltipElement.style.cssText = `
position: absolute;
background-color: #ffffff;
border: 1px solid #ccc;
border-radius: 1000px;
padding: 20px 30px;
font-family: 'Be Vietnam Pro', Arial, sans-serif;
font-size: 30px;
font-weight: bold;
color: #000000;
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
display: flex;
align-items: center;
justify-content: center;
min-width: 120px;
height: 30px;
`;

        const area = Number(storedPolygon.area.squareMeters); // Convert area to a number
        const areaDisplay = area >= 10000 ? (area / 10000).toFixed(2) + 'ha' : area.toFixed(2) + ' m²';

        tooltipElement.innerHTML = `<span style="white-space: nowrap; display: flex; align-items: center; color: #515151;"><i class="fas fa-seedling" style="font-size: 40px; margin-right: 10px;"></i>${areaDisplay}</span>`;

        const tooltipOverlay = new ol.Overlay({
            element: tooltipElement,
            offset: [0, -100],
            positioning: 'bottom-center',
        });

        tooltipOverlay.setPosition(centroid);

        map.addOverlay(tooltipOverlay);
        tooltipOverlays.push(tooltipOverlay);
    }
}


// Function to retrieve SQUARE grid features from local storage
function retrieveSquareGridFeatures() {
    const format = new ol.format.GeoJSON();

    const squareGridXFeaturesGeoJSONString = localStorage.getItem('squareGridX');
    const squareGridYFeaturesGeoJSONString = localStorage.getItem('squareGridY');

    if (squareGridXFeaturesGeoJSONString && squareGridYFeaturesGeoJSONString) {
        const squareGridXFeaturesGeoJSON = JSON.parse(squareGridXFeaturesGeoJSONString);
        const squareGridYFeaturesGeoJSON = JSON.parse(squareGridYFeaturesGeoJSONString);

        const squareGridXFeatures = squareGridXFeaturesGeoJSON.map(feature => format.readFeature(feature));
        const squareGridYFeatures = squareGridYFeaturesGeoJSON.map(feature => format.readFeature(feature));

        const squareGridX = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: squareGridXFeatures
            }),
            style: new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'white',
                    width: 4
                })
            }),
            minZoom: 19
        });

        const squareGridY = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: squareGridYFeatures
            }),
            style: new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'white',
                    width: 4
                })
            }),
            minZoom: 19
        });

        map.addLayer(squareGridX);
        map.addLayer(squareGridY);

    } else {
        //console.log('Either squareGridX or squareGridY features not found in local storage.');
    }
}


// Call the function to retrieve and display the stored square grid
retrieveSquareGridFeatures();

// Call the function to retrieve and display the stored polygon
getStoredPolygon();



// Function to retrieve RECTANGULAR grid features from local storage
function retrieveRectangularGridFeatures() {
    const format = new ol.format.GeoJSON();

    const rectangularGridXFeaturesGeoJSONString = localStorage.getItem('rectangularGridX');
    const rectangularGridYFeaturesGeoJSONString = localStorage.getItem('rectangularGridY');

    if (rectangularGridXFeaturesGeoJSONString && rectangularGridYFeaturesGeoJSONString) {
        const rectangularGridXFeaturesGeoJSON = JSON.parse(rectangularGridXFeaturesGeoJSONString);
        const rectangularGridYFeaturesGeoJSON = JSON.parse(rectangularGridYFeaturesGeoJSONString);

        const rectangularGridXFeatures = rectangularGridXFeaturesGeoJSON.map(feature => format.readFeature(feature));
        const rectangularGridYFeatures = rectangularGridYFeaturesGeoJSON.map(feature => format.readFeature(feature));

        const rectangularGridX = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: rectangularGridXFeatures
            }),
            style: new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'white',
                    width: 4
                })
            }),
            minZoom: 19
        });

        const rectangularGridY = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: rectangularGridYFeatures
            }),
            style: new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'white',
                    width: 4
                })
            }),
            minZoom: 19
        });

        map.addLayer(rectangularGridX);
        map.addLayer(rectangularGridY);

    } else {
        //console.log('Either rectangularGridX or rectangularGridY features not found in local storage.');
    }
}


// Call the function to retrieve and display the stored rectangular grid
retrieveRectangularGridFeatures();

// Call the function to retrieve and display the stored polygon
getStoredPolygon();



// Function to retrieve TRIANGULAR grid features from local storage
function retrieveTriangularGridFeatures() {
    const format = new ol.format.GeoJSON();

    const triangularGridFeaturesGeoJSONString = localStorage.getItem('triangularGrid');

    if (triangularGridFeaturesGeoJSONString) {
        const triangularGridFeaturesGeoJSON = JSON.parse(triangularGridFeaturesGeoJSONString);

        const triangularGridFeatures = triangularGridFeaturesGeoJSON.map(feature => format.readFeature(feature));

        const triangularGrid = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: triangularGridFeatures
            }),
            style: new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'white',
                    width: 4
                })
            }),
            minZoom: 19
        });

        map.addLayer(triangularGrid);

    } else {
        //console.log('Triangular grid features not found in local storage.');
    }
}

// Call the function to retrieve and display the stored triangular grid
retrieveTriangularGridFeatures();

// Call the function to retrieve and display the stored polygon
getStoredPolygon();





//Function to retrieve Square Intersection Points
function retrieveSquareGridIntersectionPoints() {
    const format = new ol.format.GeoJSON();
    const intersectionPointsGeoJSONString = localStorage.getItem('squareGridIntersectionPoints');

    if (intersectionPointsGeoJSONString) {
        const intersectionPointsGeoJSON = JSON.parse(intersectionPointsGeoJSONString);
        const intersectionPointsFeatures = intersectionPointsGeoJSON.map(feature => format.readFeature(feature));

        const squareGridIntersectionPoints = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: intersectionPointsFeatures
            }),
            style: (feature) => {
                const zoom = map.getView().getZoom();
                const isZoom21AndAbove = zoom > 22;

                if (isZoom21AndAbove) {
                    return new ol.style.Style({
                        image: new ol.style.Icon({
                            src: 'https://i.ibb.co/hDYvzYs/icons8-tree-64.png',
                            scale: .75,
                        }),
                        stroke: new ol.style.Stroke({
                            color: 'white',
                            width: 1,
                        }),
                        fill: new ol.style.Fill({
                            color: 'green',
                        }),
                    });
                } else {
                    // Return null style for zoom levels below 21
                    return null;
                }
            }
        });

        map.addLayer(squareGridIntersectionPoints);
    } else {
        //console.log('Square grid intersection points not found in local storage.');
    }
}


retrieveSquareGridIntersectionPoints();


//Function to retrieve Rectangular Intersection Points
function retrieveRectangularGridIntersectionPoints() {
    const format = new ol.format.GeoJSON();
    const intersectionPointsGeoJSONString = localStorage.getItem('rectangularGridIntersectionPoints');

    if (intersectionPointsGeoJSONString) {
        const intersectionPointsGeoJSON = JSON.parse(intersectionPointsGeoJSONString);
        const intersectionPointsFeatures = intersectionPointsGeoJSON.map(feature => format.readFeature(feature));

        const rectangularGridIntersectionPoints = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: intersectionPointsFeatures
            }),
            style: (feature) => {
                const zoom = map.getView().getZoom();
                const isZoom21AndAbove = zoom > 22;

                if (isZoom21AndAbove) {
                    return new ol.style.Style({
                        image: new ol.style.Icon({
                            src: 'https://i.ibb.co/hDYvzYs/icons8-tree-64.png',
                            scale: .75,
                        }),
                        stroke: new ol.style.Stroke({
                            color: 'white',
                            width: 1,
                        }),
                        fill: new ol.style.Fill({
                            color: 'green',
                        }),
                    });
                } else {
                    return null; // Hide for zoom levels below 21
                }
            }
        });

        map.addLayer(rectangularGridIntersectionPoints);
    } else {
        //console.log('Rectangular grid intersection points not found in local storage.');
    }
}

retrieveRectangularGridIntersectionPoints();


//Function to retreieve Triangular Intersection Points
function retrieveTriangularGridIntersectionPoints() {
    const format = new ol.format.GeoJSON();
    const intersectionPointsGeoJSONString = localStorage.getItem('triangularGridIntersectionPoints');

    if (intersectionPointsGeoJSONString) {
        const intersectionPointsGeoJSON = JSON.parse(intersectionPointsGeoJSONString);
        const intersectionPointsFeatures = intersectionPointsGeoJSON.map(feature => format.readFeature(feature));

        const triangularGridIntersectionPoints = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: intersectionPointsFeatures
            }),
            style: (feature) => {
                const zoom = map.getView().getZoom();
                const isZoom21AndAbove = zoom > 22;

                if (isZoom21AndAbove) {
                    return new ol.style.Style({
                        image: new ol.style.Icon({
                            src: 'https://i.ibb.co/hDYvzYs/icons8-tree-64.png',
                            scale: .75,
                        }),
                        stroke: new ol.style.Stroke({
                            color: 'white',
                            width: .5,
                        }),
                        fill: new ol.style.Fill({
                            color: 'green',
                        }),
                    });
                } else {
                    return null; // Hide for zoom levels below 21
                }
            }
        });

        map.addLayer(triangularGridIntersectionPoints);
    } else {
        //console.log('Triangular grid intersection points not found in local storage.');
    }
}
retrieveTriangularGridIntersectionPoints();












/*function displayIntersectionPoints(points, color) {
    const format = new ol.format.GeoJSON();

    const features = points.map(point => format.readFeature(point));

    const vectorLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: features
        }),
        style: new ol.style.Style({
            image: new ol.style.Circle({
                radius: 10,
                fill: new ol.style.Fill({
                    color: color
                }),
                stroke: new ol.style.Stroke({
                    color: 'white',
                    width: 2
                })
            })
        })
    });

    map.addLayer(vectorLayer);
}



function retrieveIntersectionPoints() {
    const squareGridIntersectionPointsString = localStorage.getItem('squareGridIntersectionPoints');
    const rectangularGridIntersectionPointsString = localStorage.getItem('rectangularGridIntersectionPoints');
    const triangularGridIntersectionPointsString = localStorage.getItem('triangularGridIntersectionPoints');

    if (squareGridIntersectionPointsString) {
        const squareGridIntersectionPoints = JSON.parse(squareGridIntersectionPointsString);
        // Display squareGridIntersectionPoints using black style
        displayIntersectionPoints(squareGridIntersectionPoints, 'black');
    } else {
        console.log('Square grid intersection points not found in local storage.');
    }

    if (rectangularGridIntersectionPointsString) {
        const rectangularGridIntersectionPoints = JSON.parse(rectangularGridIntersectionPointsString);
        // Display rectangularGridIntersectionPoints using black style
        displayIntersectionPoints(rectangularGridIntersectionPoints, 'black');
    } else {
        console.log('Rectangular grid intersection points not found in local storage.');
    }

    if (triangularGridIntersectionPointsString) {
        const triangularGridIntersectionPoints = JSON.parse(triangularGridIntersectionPointsString);
        // Display triangularGridIntersectionPoints using black style
        displayIntersectionPoints(triangularGridIntersectionPoints, 'black');
    } else {
        console.log('Triangular grid intersection points not found in local storage.');
    }
}

// Call the function to retrieve and display the stored intersection points
retrieveIntersectionPoints();*/














// Define and initialize centerPointCoordinates
let centerPointCoordinates = [];

// Define and initialize segmentLengths
let segmentLengths = [];

// Define and initialize area
let area;

// Define and initialize areaHectares
let areaHectares;

let address


// Update the finishDrawingButton click event to store the polygon in local storage
finishDrawingButton.onclick = function () {
    if (draw) {
        draw.finishDrawing();
        finishDrawingButton.classList.add('hidden');
        map.removeInteraction(draw);
        isSketchActive = false;
        sketchFarmBtn.style.backgroundColor = 'white';
        sketchFarmBtnIcon.textContent = 'create';
        sketchFarmBtnIcon.style.color = '#515151';
        undoSketchBtn.style.display = "none";

        // Store polygon coordinates in local storage
        const polygonGeometry = vectorSource.getFeatures()[0].getGeometry();
        const polygonCoordinates = polygonGeometry.getCoordinates();

        // Ensure polygonCoordinates is an array
        const polygonCoordinatesArray = Array.isArray(polygonCoordinates)
            ? polygonCoordinates
            : polygonCoordinates[0];

        const polygonPoints = polygonCoordinatesArray.map(coordinate => {
            const lonLat = ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326');
            return { lon: lonLat[0], lat: lonLat[1] };
        });

        const storedPolygon = {
            centerPoint: {
                lon: centerPointCoordinates[0],
                lat: centerPointCoordinates[1],
            },
            polygonPoints: polygonPoints,
            segmentLengths: segmentLengths,
            area: {
                squareMeters: area ? area.toFixed(2) : undefined, // Use the defined area variable
                hectares: areaHectares,
            },
            address: address,
        };
        localStorage.setItem('enfarm_polygon_coordinates', JSON.stringify(storedPolygon));
    }
};

// Remove the stored polygon from local storage when the page loads
window.addEventListener('load', function () {
    if (!localStorage.getItem('enfarm_polygon_coordinates')) {
        if (farmVectorLayer) { // Add a check before removing the farmVectorLayer
            map.removeLayer(farmVectorLayer);
            farmVectorLayer = null;
        }
        for (const overlay of tooltipOverlays) {
            map.removeOverlay(overlay);
        }
        tooltipOverlays = [];
    }
});



///// <----- ADD ENFARM SENSORS BUTTON -----> \\\\\

// Button IDs to hide when `startAddSensor` function is active
const buttonsToHide = [
    "searchBar",
    "searchBtn",
    "basemapBtn",
    "measureAreaBtn",
    "measureLengthBtn",
    "sketchFarmBtn",
    "tutorialBtn",
    "windyMapBtn",
    "resetBtn",
    "locationBtn",
];

function hideButtons() {
    buttonsToHide.forEach((buttonId) => {
        const buttonElement = document.getElementById(buttonId);
        if (buttonElement) {
            buttonElement.style.display = "none";
        }
    });
}

function showButtons() {
    buttonsToHide.forEach((buttonId) => {
        const buttonElement = document.getElementById(buttonId);
        if (buttonElement) {
            buttonElement.style.display = "block";
        }
    });
}

let sensorDrawCount = 0;
let sensorPointStyle = new ol.style.Style({
    image: new ol.style.Icon({
        src: 'https://i.ibb.co/gWyRjHP/icons8-pin-96-xxhdpi.png',
        anchor: [0.5, 1],
        scale: 0.75,
        rotateWithView: true,
    }),
});

let startAddSensorActive = false;
let sensorDrawInteraction;
let sensorVectorLayer;
let isSensorPointAdded = false;

function startAddSensor() {
    let addSensorBtnIcon = document.querySelector(".addSensorBtn i");
    let addSensorBtn = document.querySelector(".addSensorBtn");

    // Get a reference to the floating title
    const addSensorsFloatingTitle = document.querySelector('.addSensorsfloatingTitle');

    // Show the floating title
    if (addSensorsFloatingTitle) {
        addSensorsFloatingTitle.style.display = "block";
    }

    addSensorBtnIcon.textContent = "delete_forever";
    addSensorBtn.style.backgroundColor = "#FF6666";
    addSensorBtnIcon.style.color = "white";

    const floatingMessage = document.createElement("div");
    floatingMessage.className = "floating-message";
    floatingMessage.id = "floatingMessageArea";
    const infoIcon = document.createElement("i");
    infoIcon.className = "material-icons";
    infoIcon.textContent = "touch_app";
    infoIcon.style.fontSize = "100px";
    floatingMessage.appendChild(infoIcon);
    floatingMessage.innerHTML += "  Nhấn vào màn hình để thêm/các cảm biến enfarm"; // "Tap the screen to add enfarm sensor/s"
    map.getViewport().appendChild(floatingMessage);

    const floatingMessageAreaTimeoutId = setTimeout(function () {
        if (floatingMessage.parentNode === map.getViewport()) {
            map.getViewport().removeChild(floatingMessage);
        }
    }, 5000);

    const source = new ol.source.Vector();

    sensorVectorLayer = new ol.layer.Vector({
        source: source,
        style: sensorPointStyle,
    });

    map.addLayer(sensorVectorLayer);




    sensorDrawInteraction = new ol.interaction.Draw({
        source: source,
        type: 'Point',
    });

    map.addInteraction(sensorDrawInteraction);

    startAddSensorActive = true;

    sensorDrawInteraction.on('drawstart', function () {
        sensorDrawCount = 0;
    });

    sensorDrawInteraction.on('drawend', function (event) {
        const feature = event.feature;
        const source = sensorVectorLayer.getSource();
        const features = source.getFeatures();

        if (features.length === 0) {
            isSensorPointAdded = true;
            const undoSensorBtn = document.getElementById("undoSensorBtn");
            undoSensorBtn.style.display = "block";
        }

        if (features.length === 0) {
            const finishAddingSensor = document.getElementById("finishAddingSensor");
            finishAddingSensor.classList.remove("hidden");
        }
    });

    const undoSensorBtn = document.getElementById("undoSensorBtn");
    undoSensorBtn.style.display = "none";

    // Hide the buttons when the function is active
    hideButtons();
}

function deletePoints() {
    if (sensorVectorLayer) {
        const source = sensorVectorLayer.getSource();
        source.clear();
    }
}

function storePointsInLocalStorage(points) {
    localStorage.setItem('enfarm_sensor_coordinates', JSON.stringify(points));
}

function retrievePointsFromLocalStorage() {
    const pointsString = localStorage.getItem('enfarm_sensor_coordinates');
    if (pointsString) {
        return JSON.parse(pointsString);
    } else {
        return [];
    }
}

function disableAddSensor() {
    map.removeInteraction(sensorDrawInteraction);

    let addSensorBtnIcon = document.querySelector(".addSensorBtn i");
    let addSensorBtn = document.querySelector(".addSensorBtn");

    addSensorBtnIcon.textContent = "sensors";
    addSensorBtn.style.backgroundColor = "";
    addSensorBtnIcon.style.color = "";

    let floatingMessage = document.getElementById("floatingMessageArea");
    if (floatingMessage && floatingMessage.parentNode === map.getViewport()) {
        map.getViewport().removeChild(floatingMessage);
    }

    startAddSensorActive = false;

    const finishButton = document.getElementById("finishAddingSensor");
    finishButton.classList.add("hidden");

    const sensorVectorLayers = map.getLayers().getArray();
    const hasPoints = sensorVectorLayers.some(
        (layer) =>
            layer instanceof ol.layer.Vector &&
            layer.getSource().getFeatures().length > 0
    );

    // Send data to React Native App
    if (hasPoints) {
        try {
            const message = { enfarm_sensor_coordinates: retrievePointsFromLocalStorage() };
            
            if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify(message));
            }
        } catch (error) {
            // Handle the error (or do nothing to prevent logging)
        }
    }

    const storedPoints = retrievePointsFromLocalStorage();
    if (storedPoints.length === 0) {
        localStorage.removeItem('enfarm_sensor_coordinates');
    }

    const undoSensorBtn = document.getElementById("undoSensorBtn");
    undoSensorBtn.style.display = "none";

    // Show the buttons when the function is deactivated
    showButtons();

    // Get a reference to the floating title
    const addSensorsfloatingTitle = document.querySelector('.addSensorsfloatingTitle');

    // Hide the floating title
    if (addSensorsfloatingTitle) {
        addSensorsfloatingTitle.style.display = "none";
    }
}


function undoLastSensor() {
    if (sensorVectorLayer) {
        const source = sensorVectorLayer.getSource();
        const features = source.getFeatures();
        const lastFeature = features[features.length - 1];

        if (lastFeature) {
            source.removeFeature(lastFeature);
            // You can also perform any additional logic here, such as updating localStorage
        }

        const remainingFeatures = source.getFeatures();
        if (remainingFeatures.length === 0) {
            const undoSensorBtn = document.getElementById("undoSensorBtn");
            undoSensorBtn.style.display = "none";
            isSensorPointAdded = false;
        }
    }
}

const addSensorBtn = document.querySelector(".addSensorBtn");
const addSensorBtnIcon = addSensorBtn.querySelector("i");

addSensorBtn.addEventListener("click", function () {
    if (startAddSensorActive) {
        deletePoints();
        disableAddSensor();
    } else {
        startAddSensor();
    }
});



// Function to show the floating container and trigger the slide-up animation
function showAddSensorSuccess() {
    const addSensorSuccess = document.getElementById("addSensorSuccess");
    addSensorSuccess.style.display = "block"; // Set the container to be visible
    addSensorSuccess.classList.add("slide-up"); // Add the slide-up animation class

    // Hide the container after 2 seconds
    setTimeout(() => {
        hideAddSensorSuccess();
    }, 2000);
}

// Function to hide the floating container and trigger the slide-down animation
function hideAddSensorSuccess() {
    const addSensorSuccess = document.getElementById("addSensorSuccess");
    addSensorSuccess.classList.remove("slide-up"); // Remove the slide-up animation class
    addSensorSuccess.classList.add("slide-down"); // Add the slide-down animation class

    // Hide the container after the animation duration (1000ms)
    setTimeout(() => {
        addSensorSuccess.style.display = "none";
        addSensorSuccess.classList.remove("slide-down"); // Remove the slide-down animation class
    }, 1000);
}

function showButton(id) {
    var btn = document.getElementById(id);
    if (btn) {
        btn.style.display = "block"; // or whatever your default display style is
    } else {
        console.log("No button found with id: " + id);
    }
}

const finishButton = document.getElementById("finishAddingSensor");
finishButton.addEventListener("click", function () {
    if (isSensorPointAdded) {
        if (sensorVectorLayer) {
            const source = sensorVectorLayer.getSource();
            const features = source.getFeatures();

            const enfarm_sensor_coordinates = [];

            features.forEach(function (feature) {
                const geometry = feature.getGeometry();
                const coordinate = geometry.getCoordinates();
                const transformedCoordinate = ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326');
                const enfarm_sensor_lat = transformedCoordinate[1];
                const enfarm_sensor_lon = transformedCoordinate[0];

                enfarm_sensor_coordinates.push({ enfarm_sensor_lat, enfarm_sensor_lon });
            });

            console.log("enfarm_sensor_coordinates:", enfarm_sensor_coordinates);

            storePointsInLocalStorage(enfarm_sensor_coordinates);

            disableAddSensor();

            // After processing is finished and the "finishButton" is clicked, show the floating container
            showAddSensorSuccess();

            // Hide the floating title
            const addSensorsFloatingTitle = document.querySelector('.addSensorsfloatingTitle');
            if (addSensorsFloatingTitle) {
                addSensorsFloatingTitle.style.display = "none";
            }
        }
    }

    // Show the clear all drawing button
    showButton('clearAllDrawingBtn');
});

function deactivateAddSensor() {
    if (startAddSensorActive) {
        deletePoints();
        disableAddSensor();
    }
}

document.getElementById("measureAreaBtn").addEventListener("click", deactivateAddSensor);
document.getElementById("measureLengthBtn").addEventListener("click", deactivateAddSensor);
document.getElementById("sketchFarmBtn").addEventListener("click", deactivateAddSensor);

// Call this function to hide the floating container on map load
hideAddSensorSuccess();

// Load the Lottie animation when the document is ready
document.addEventListener("DOMContentLoaded", function () {
    const animationURL = "https://lottie.host/52133049-24ce-4236-a7c1-0f11d4b03ace/LRglt3SwZv.json";
    const animationContainer = document.getElementById("sensorsuccessAnimationCheck");
    const animation = lottie.loadAnimation({
        container: animationContainer,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: animationURL,
    });
});

// Retrieve points from local storage when the page loads
window.addEventListener('load', function () {
    // Define the layer only if it does not exist
    if (!sensorVectorLayer) {
        const source = new ol.source.Vector();
        sensorVectorLayer = new ol.layer.Vector({
            source: source,
            style: sensorPointStyle,
        });
        map.addLayer(sensorVectorLayer);
    }

    const storedPoints = retrievePointsFromLocalStorage();
    if (storedPoints.length > 0) {
        storedPoints.forEach(function (point) {
            const coordinate = ol.proj.transform([point.enfarm_sensor_lon, point.enfarm_sensor_lat], 'EPSG:4326', 'EPSG:3857');
            const feature = new ol.Feature({
                geometry: new ol.geom.Point(coordinate),
            });
            sensorVectorLayer.getSource().addFeature(feature);
        });
    }

    const undoSensorBtn = document.getElementById("undoSensorBtn");
    undoSensorBtn.style.display = "none";
});

undoSensorBtn.addEventListener("click", undoLastSensor);




////////// <----- CLEAR ALL DRAWINGS BUTTON FUNCTION (FARM SKETCH AND SENSORS) -----> \\\\\\\\\\

let gridX;
let gridY;

function clearAllDrawings() {
    // Show the dialog box
    const dialog = document.getElementById("dialog");
    dialog.classList.remove("hidden");

    // Handle the button clicks
    const deleteYesBtn = document.getElementById("deleteYes");
    const deleteNoBtn = document.getElementById("deleteNo");

    deleteYesBtn.addEventListener("click", function () {
        // Remove stored polygon from local storage
        localStorage.removeItem("enfarm_polygon_coordinates");

        // Clear vector source and remove all features
        vectorSource.clear();

        // Remove farmVectorLayer from the map
        if (farmVectorLayer) {
            map.removeLayer(farmVectorLayer);
            farmVectorLayer = null;
        }

        // Remove tooltip overlays from the map
        for (const overlay of tooltipOverlays) {
            map.removeOverlay(overlay);
        }
        tooltipOverlays = [];

        // Remove stored sensor points from local storage
        localStorage.removeItem("enfarm_sensor_coordinates");

        for (let i = 0; i < 5; i++) {
            // Remove all vector layers from the map in the first sweep
            map.getLayers().forEach(layer => {
                if (layer instanceof ol.layer.Vector) {
                    map.removeLayer(layer);
                }
            });
        }

        // Dismiss the gridPatternInformation element
        const gridPatternInformation = document.getElementById("gridPatternInformation");
        gridPatternInformation.style.display = "none";

        // Dismiss the gridPropertiesContainer element
        //gridPropertiesContainer.style.display = "none"; 

        gridPropertiesContainer.classList.remove('visible');



        // Get the last selected grid type from local storage before removing it
        const lastSelectedGridType = localStorage.getItem('lastSelectedGridType');


        // Remove stored gridX and gridY points from local storage
        localStorage.removeItem("squareGridX");
        localStorage.removeItem("squareGridY");

        // Remove stored gridX and gridY points from local storage
        localStorage.removeItem("rectangularGridX");
        localStorage.removeItem("rectangularGridY");

        // Remove stored triangularGrid from local storage
        localStorage.removeItem("triangularGrid");

        localStorage.removeItem("triangularGridIntersectionPoints");
        localStorage.removeItem("squareGridIntersectionPoints");
        localStorage.removeItem("rectangularGridIntersectionPoints");


        // Remove last selected intersection count, gridX count, gridY count, grid type, and intersection type
        localStorage.removeItem('lastSelectedIntersectionCount');
        localStorage.removeItem('lastSelectedGridXCount');
        localStorage.removeItem('lastSelectedGridYCount');
        localStorage.removeItem('lastSelectedGridType');
        localStorage.removeItem('lastSelectedGridIntersectionType');

        // If the last selected grid type was triangularGrid, remove the GridZ count
        if (lastSelectedGridType === 'triangularGrid') {
            localStorage.removeItem('lastSelectedGridZCount');
        }

        // Hide the gridInfoPill element
        const gridInfoPill = document.getElementById("gridInfoPill");
        gridInfoPill.style.display = "none"; // Set display to "none" to hide the element

        // Hide the dialog box
        dialog.classList.add("hidden");

        // Update the visibility of clearAllDrawingBtn
        updateClearButtonVisibility();

        // Clear console log
        console.clear();
    });

    deleteNoBtn.addEventListener("click", function () {
        // Hide the dialog box
        dialog.classList.add("hidden");
    });
}

function updateClearButtonVisibility() {
    const clearAllDrawingBtn = document.getElementById("clearAllDrawingBtn");
    const storedPolygons = localStorage.getItem("enfarm_polygon_coordinates");
    const storedPoints = localStorage.getItem("enfarm_sensor_coordinates");

    if (storedPolygons || storedPoints) {
        clearAllDrawingBtn.style.display = "block";
    } else {
        clearAllDrawingBtn.style.display = "none";
    }
}

// Attach the event listener to the clearAllDrawingBtn button
const clearAllDrawingBtn = document.getElementById("clearAllDrawingBtn");
clearAllDrawingBtn.addEventListener("click", clearAllDrawings);

// Call the updateClearButtonVisibility function initially and whenever you add or remove polygons or points
// For example, after adding a polygon or point:
updateClearButtonVisibility();

// Inside the deletePoints function:
function deletePoints() {
    if (sensorVectorLayer) {
        const source = sensorVectorLayer.getSource();
        source.clear();
        updateClearButtonVisibility(); // Update button visibility after clearing the points
    }
}

// Inside the clearAllDrawings function, after clearing all drawings:
updateClearButtonVisibility(); // Update button visibility after clearing all drawings

// Check if there are stored polygons when the page loads
window.addEventListener("load", function () {
    const storedPolygons = localStorage.getItem("enfarm_polygon_coordinates");
    if (storedPolygons) {
        updateClearButtonVisibility();
    }
});

// Load the Lottie animation when the document is ready
document.addEventListener("DOMContentLoaded", function () {
    const animationURL = "https://lottie.host/2d84733d-de2c-4e15-9280-a0c02ef6ae0d/ZDmGcxs6ND.json";
    const animationContainer = document.getElementById("deleteAnimationContainer");
    const animation = lottie.loadAnimation({
        container: animationContainer,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: animationURL,
    });

    // Play the animation once when needed
    function playAnimationOnce() {
        animation.play();
    }

    // After 1 second, set loop to false to play the animation only once
    setTimeout(function () {
        animation.loop = true;
    }, 3000);
});




////////// <----- NORTH ARROW BUTTON FUNCTION -----> \\\\\\\\\\

// Function to update the rotation of the north arrow based on the map's rotation
function updateNorthArrowRotation() {
    const rotation = map.getView().getRotation();

    // Check if the rotation is not equal to 0
    if (rotation !== 0) {
        northArrow.style.display = "block";
    } else {
        northArrow.style.display = "none";
    }

    northArrow.style.transform = `rotate(${rotation}rad)`;
}

// Event listener for map view rotation change
map.getView().on("change:rotation", updateNorthArrowRotation);

// Initial rotation update
updateNorthArrowRotation();

// Function to reset map rotation to 0 degrees with smooth animation
function resetMapRotation() {
    const view = map.getView();
    view.animate({
        rotation: 0,
        duration: 1000, // Animation duration in milliseconds
        easing: ol.easing.easeOut // Easing function for smooth animation
    });

    // Hide the north arrow after reset
    northArrow.style.display = "none";
}

// Event listener for the north arrow click
northArrow.addEventListener('click', resetMapRotation);




////////// <----- PAN TO DRAWNN POLYGON or USER LOCATION if no DRAWN POLYGON FUNCTION -----> \\\\\\\\\\

function panToDrawnPolygon() {
    // Check if there is a drawn polygon
    const storedPolygonString = localStorage.getItem("enfarm_polygon_coordinates");
    if (storedPolygonString) {
        const storedPolygon = JSON.parse(storedPolygonString);
        const polygonPoints = storedPolygon.polygonPoints.map((point) =>
            ol.proj.transform([point.lon, point.lat], "EPSG:4326", "EPSG:3857")
        );
        const polygonFeature = new ol.Feature({
            geometry: new ol.geom.Polygon([polygonPoints]),
        });
        const polygonExtent = polygonFeature.getGeometry().getExtent();
        const padding = [275, 275, 275, 275]; // Adjust the padding values as per your preference
        map.getView().fit(polygonExtent, { padding: padding });
    } else {
        // If no polygon is drawn, pan to the user location
        panToUserLocation();
    }
}

// Call the panToDrawnPolygon function when the map opens
map.once("postrender", panToDrawnPolygon);

// Function to pan to the user location
function panToUserLocation() {
    // Function to create the user location marker
    function createUserLocationMarker() {
        const markerElement = document.createElement("div");
        markerElement.className = "user-marker";

        const markerOverlay = new ol.Overlay({
            element: markerElement,
            positioning: "center-center",
            stopEvent: false,
        });

        map.addOverlay(markerOverlay);

        return markerOverlay;
    }

    // Function to update the user location marker position
    function updateUserLocationMarker(markerOverlay, position) {
        const { latitude, longitude } = position.coords;
        const userLocation = ol.proj.fromLonLat([longitude, latitude]);

        markerOverlay.setPosition(userLocation);
    }

    // Function to handle errors when geolocation is not available or permission denied
    function handleGeolocationError(error) {
        console.error("Error getting user's location:", error);
    }

    // Check if geolocation is supported by the browser
    if ("geolocation" in navigator) {
        const markerOverlay = createUserLocationMarker();

        // Get the user's current location
        navigator.geolocation.getCurrentPosition(
            (position) => {
                updateUserLocationMarker(markerOverlay, position);
                map.getView().animate({ center: markerOverlay.getPosition(), zoom: 19 });
            },
            handleGeolocationError
        );
    } else {
        console.log("Geolocation is not supported by your browser.");
    }
}



////////// <----- USER LOCATION BUTTON -----> \\\\\\\\\\

const userLocationLayer = new ol.layer.Vector({
    source: new ol.source.Vector(),
    style: new ol.style.Style({
        image: new ol.style.Circle({
            radius: 18,
            fill: new ol.style.Fill({
                color: '#007bff',
            }),
            stroke: new ol.style.Stroke({
                color: 'white',
                width: 8,
            }),
        }),
    }),
    name: 'User Location',
});

function createUserLocationMarker() {
    const markerElement = document.createElement("div");
    markerElement.className = "user-marker";

    const markerOverlay = new ol.Overlay({
        element: markerElement,
        positioning: "center-center",
        stopEvent: false,
    });

    map.addOverlay(markerOverlay);

    return markerOverlay;
}

function startGlowing() {
    const markerElement = document.querySelector('.user-marker');
    markerElement.classList.add('glowing');
}

// Call the functions to create the user location marker and start the glowing effect
const markerOverlay = createUserLocationMarker();
startGlowing();

async function getUserLocation() {
    if ("geolocation" in navigator) {
        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });

            const { latitude, longitude } = position.coords;
            console.log("Current user location coordinates (latitude, longitude):", latitude, longitude);

            // Convert latitude and longitude to EPSG:4326
            const userLocation = [longitude, latitude];

            // Remove existing user location feature if it exists
            userLocationLayer.getSource().clear();

            // Create a new user location feature
            const userLocationFeature = new ol.Feature({
                geometry: new ol.geom.Point(userLocation).transform('EPSG:4326', 'EPSG:3857'),
            });

            // Add the feature to the user location layer
            userLocationLayer.getSource().addFeature(userLocationFeature);

            // Add or update the user location layer on the map
            const existingUserLocationLayer = map.getLayers().getArray().find(layer => layer.get('name') === 'User Location');
            if (existingUserLocationLayer) {
                map.removeLayer(existingUserLocationLayer);
            }
            map.addLayer(userLocationLayer);

            // Pan and zoom to the user location smoothly
            map.getView().animate({
                center: ol.proj.fromLonLat(userLocation),
                zoom: 19,
                duration: 1000, // Adjust the duration as needed for the animation speed
            });

            // Fetch address information from OSM Nominatim
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
            const data = await response.json();

            // Extract the address components
            const address = data.display_name;
            console.log("User location address:", address);
        } catch (error) {
            console.error("Error getting user location:", error);
        }
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
}


// Get the location button element
const locationButton = document.querySelector('.locationBtn');

// Add an event listener to the location button to handle clicks
locationButton.addEventListener('click', function () {
    // Get the icon element inside the location button
    const locationButtonIcon = locationButton.querySelector('i');

    // Call the getUserLocation() function to get the user location and pan the map
    getUserLocation();
    // Restart the animation
    locationButtonIcon.style.animation = 'none';
    setTimeout(() => (locationButtonIcon.style.animation = ''), 10);
});

// Function to check if the user location is visible on the current map view
function isUserLocationVisible() {
    const mapView = map.getView();
    const userLocationFeature = userLocationLayer.getSource().getFeatures()[0];
    if (userLocationFeature) {
        const userLocationExtent = userLocationFeature.getGeometry().getExtent();
        return ol.extent.containsExtent(mapView.calculateExtent(), userLocationExtent);
    }
    return false;
}

// Add an event listener to the location button to handle clicks
locationButton.addEventListener('click', function () {
    // Get the icon element inside the location button
    const locationButtonIcon = locationButton.querySelector('i');

    // Call the getUserLocation() function to get the user location and pan the map
    getUserLocation();

    // Restart the animation
    locationButtonIcon.style.animation = 'none';
    setTimeout(() => (locationButtonIcon.style.animation = ''), 10);
});

// Function to show or hide the location button based on user location visibility
function updateLocationButtonVisibility() {
    locationButton.style.display = isUserLocationVisible() ? 'none' : 'block';
}

// Initially check the user location visibility when the map is loaded
updateLocationButtonVisibility();

// Add an event listener to the map to handle changes in view
map.on('moveend', updateLocationButtonVisibility);



////////// <----- RESET BUTTON FUNCTION -----> \\\\\\\\\\

// Get the reset button element
const resetButton = document.getElementById("resetBtn");

// Create a function to reset the webpage
function resetWebpage() {
    location.reload();
}

// Add event listener to the reset button
resetButton.addEventListener("click", resetWebpage);



////////// <----- SCALE BAR -----> \\\\\\\\\\

var scale_line = new ol.control.ScaleLine({
    units: 'metric',
    bar: false,
    steps: 6,
    text: true,
    minWidth: 240,
    fontSize: 40,
    target: 'scale_bar',
});
map.addControl(scale_line);


/*
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
                density: 2,
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
                    birds.setVisible(true);
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
            };*/






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



//////////// <----- START FUNCTION: RETRIEVE STORED VALUES AND SHOW ON GRID INFO PILL ON RELOAD -----> \\\\\\\\\\
window.addEventListener('load', function () {
    // Delay the execution by 2 seconds
    setTimeout(function () {
        // Retrieve the saved counts and grid type
        const lastSelectedGridType = localStorage.getItem('lastSelectedGridType');
        const lastSelectedIntersectionCount = localStorage.getItem('lastSelectedIntersectionCount');
        const lastSelectedGridXCount = localStorage.getItem('lastSelectedGridXCount');
        const lastSelectedGridYCount = localStorage.getItem('lastSelectedGridYCount');
        const lastSelectedGridZCount = localStorage.getItem('lastSelectedGridZCount');

        // Check if the values are present in the storage
        if (lastSelectedGridType && lastSelectedIntersectionCount && lastSelectedGridXCount && lastSelectedGridYCount) {
            // Log the counts to the console
            console.log(`Intersection count: ${lastSelectedIntersectionCount}`);
            console.log(`GridX count: ${lastSelectedGridXCount}`);
            console.log(`GridY count: ${lastSelectedGridYCount}`);
            console.log(`GridZ count: ${lastSelectedGridZCount}`);

            // Update the HTML elements with the retrieved counts
            document.getElementById('intersectionCount').textContent = lastSelectedIntersectionCount;
            document.getElementById('gridXCount').textContent = lastSelectedGridXCount;
            document.getElementById('gridYCount').textContent = lastSelectedGridYCount;

            // Remove the hidden class from the main container
            document.getElementById('gridInfoPill').classList.remove('hidden');

            // If the grid type is not triangularGrid, hide the pillZCount
            if (lastSelectedGridType !== 'triangularGrid') {
                document.getElementById('pillZCount').style.display = 'none';
            } else {
                // Check if lastSelectedGridZCount is not null before showing
                if (lastSelectedGridZCount !== null) {
                    document.getElementById('pillZCount').classList.remove('hidden');
                    document.getElementById('gridZCount').textContent = lastSelectedGridZCount;
                }
            }
        }
    }, 2000); // Delay time in milliseconds (2000ms = 2 seconds)
});

//////////// <----- END FUNCTION: RETRIEVE STORED VALUES AND SHOW ON GRID INFO PILL ON RELOAD -----> \\\\\\\\\\

//////////// <----- START FUNCTION TO HIDE THE GRID INFO PILL WHEN THE FARM POLYGON IS OUT OF SIGHT -----> \\\\\\\\\\
// Variable to track if the counting effect has been initiated
let countingEffectInitiated = false;

// Function to check if the farm vector layer is visible in the current view
function isFarmVectorLayerVisible() {
    if (!farmVectorLayer) {
        return false;
    }
    const viewExtent = map.getView().calculateExtent(map.getSize());
    const features = farmVectorLayer.getSource().getFeatures();
    let isVisible = false;
    features.forEach((feature) => {
        const featureExtent = feature.getGeometry().getExtent();
        if (ol.extent.intersects(viewExtent, featureExtent)) {
            isVisible = true;
        }
    });
    return isVisible;
}

// Function to update the visibility of the grid info pill based on the farm vector layer visibility
function updateGridInfoPillVisibility() {
    if (isFarmVectorLayerVisible()) {
        // Delay showing the element by 2 seconds
        setTimeout(function () {
            document.getElementById('gridInfoPill').style.display = 'flex'; // Show the element

            // If the counting effect hasn't been initiated, start it
            if (!countingEffectInitiated) {
                // Start the fast counting effects for each value
                const intersectionCount = parseInt(localStorage.getItem('lastSelectedIntersectionCount')) || 0;
                startFastCountingEffect('intersectionCount', intersectionCount);

                const gridXCountValue = parseInt(localStorage.getItem('lastSelectedGridXCount')) || 0;
                startFastCountingEffect('gridXCount', gridXCountValue);

                const gridYCountValue = parseInt(localStorage.getItem('lastSelectedGridYCount')) || 0;
                startFastCountingEffect('gridYCount', gridYCountValue);

                // If you have GridZ count:
                const gridZCountValue = parseInt(localStorage.getItem('lastSelectedGridZCount')) || 0;
                if (gridZCountValue) {
                    startFastCountingEffect('triangularGridZCount', gridZCountValue);
                }

                // Mark the counting effect as initiated
                countingEffectInitiated = true;
            }
        }, 2000); // 2-second delay
    } else {
        document.getElementById('gridInfoPill').style.display = 'none'; // Hide the element
    }
}

// Function to create a counting effect
function startFastCountingEffect(targetElementId, finalValue) {
    const targetElement = document.getElementById(targetElementId);
    let currentValue = 0;
    const increment = Math.ceil(finalValue / 25); // Divide into 50 increments
    const interval = setInterval(function () {
        currentValue += increment;
        targetElement.textContent = currentValue;
        if (currentValue >= finalValue) {
            clearInterval(interval);
            targetElement.textContent = finalValue; // Ensure final value is accurate
        }
    }, 50); // Delay between increments (50 milliseconds)
}

// Check if the required information is present in local storage
const intersectionCount = localStorage.getItem('lastSelectedIntersectionCount');
if (intersectionCount) {
    // Attach the listener to the view change event
    map.getView().on('change', updateGridInfoPillVisibility);

    // Call the function once to set the initial visibility
    updateGridInfoPillVisibility();

    // Call the function again after a short delay to ensure visibility on mobile browsers
    setTimeout(updateGridInfoPillVisibility, 500); // 0.5-second delay
}
//////////// <----- END FUNCTION TO HIDE THE GRID INFO PILL WHEN THE FARM POLYGON IS OUT OF SIGHT -----> \\\\\\\\\\









// Move the JavaScript code inside the window.onload function
window.onload = function () {
    // Get a reference to the floating titles
    const measureAreaFloatingTitle = document.querySelector('.measuringAreafloatingTitle');
    const measureLengthFloatingTitle = document.querySelector('.measuringLengthfloatingTitle');
    const sketchingFarmFloatingTitle = document.querySelector('.sketchingFarmfloatingTitle');
    const addSensorsFloatingTitle = document.querySelector('.addSensorsfloatingTitle');
}

// For Listening to react native app data
window.addEventListener("message", message => {
    try {
        const jsonData = JSON.parse(message.data);
        if (jsonData) {
            const { actionType, event, data } = jsonData;
            if (actionType === 'Search') {
                if (event === 'close') {
                    searchBtn.style.display = "block";
                    searchBar.style.display = "none";
                    searchInput.value = "";
                    suggestionsContainer.style.display = "none";
                }
                if (event === 'relocate') {
                    searchBtn.style.display = "block";
                    searchBar.style.display = "none";
                    searchInput.value = "";
                    suggestionsContainer.style.display = "none";
                    const latitude = data.lat;
                    const longitude = data.lon;
                    const center = ol.proj.fromLonLat([longitude, latitude]);
                
                    // Smoothly animate the zoom and centering
                    map.getView().animate({
                        center: center,
                        zoom: 21,
                        duration: 1000, // Adjust the duration as needed
                        easing: ol.easing.easeOut // Use a suitable easing function for smooth animation
                    });
                
                    const coordinates = ol.proj.fromLonLat([longitude, latitude]);
                    createMarker(coordinates);
                }
            }
            if (actionType === 'Drawing') {
                if (event === 'click') {
                    startSketchFarm();
                }
            }
        }
    } catch (e) {
        console.log(e);
    }
});


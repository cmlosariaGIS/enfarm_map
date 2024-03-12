////////// <----- USER LOCATION BUTTON -----> \\\\\\\\\\

const userLocationLayer = new ol.layer.Vector({
    source: new ol.source.Vector(),
    style: new ol.style.Style({
        image: new ol.style.Circle({
            radius: 9,
            fill: new ol.style.Fill({
                color: '#007bff',
            }),
            stroke: new ol.style.Stroke({
                color: 'white',
                width: 4,
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
                zoom: 17,
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



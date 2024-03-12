////////// <----- PAN TO DRAWN POLYGON or USER LOCATION if no DRAWN POLYGON FUNCTION -----> \\\\\\\\\\

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
                map.getView().animate({ center: markerOverlay.getPosition(), zoom: 17 });
            },
            handleGeolocationError
        );
    } else {
        console.log("Geolocation is not supported by your browser.");
    }
}
//////////// <----- START FUNCTION TO CHANGE MAP PERSPECTIVE -----> \\\\\\\\\\\\\\\

// Define the span element with inline styles and content
const spanElement = document.createElement('span');
spanElement.style.whiteSpace = 'nowrap';
spanElement.style.display = 'flex';
spanElement.style.alignItems = 'center';
spanElement.style.color = '#515151';
spanElement.innerHTML = '<i class="fas fa-seedling" style="font-size: 20px; margin-right: 10px;" aria-hidden="true"></i>7044.67 m²';

// Function to add the span element as an overlay to the map
function addSpanOverlayToMap(map) {
    const spanOverlay = new ol.Overlay({
        element: spanElement,
        positioning: 'bottom-center',
        stopEvent: false
    });
    map.addOverlay(spanOverlay);
}

// Hide the slider on map load
document.addEventListener("DOMContentLoaded", function () {
    const angleSlider = document.getElementById("angle");
    angleSlider.style.display = 'none'; // Set to none instead of opacity=0 for better control
});

// Show the slider when perspectiveBtn is clicked
let isSliderVisible = false; // Track slider visibility state

document.getElementById("perspectiveBtn").addEventListener("click", function () {
    const angleSlider = document.getElementById("angle");
    const btnElement = document.getElementById("perspectiveBtn");
    const btnIcon = document.querySelector("#perspectiveBtn i.material-icons");

    // Array of button IDs to hide
    const buttonsToHide = [
        "searchBar",
        "searchBtn",
        "material-icons",
        "basemapBtn",
        "measureAreaBtn",
        "measureLengthBtn",
        "sketchFarmBtn",
        "addSensorBtn",
        "tutorialBtn",
        "windyMapBtn",
        "resetBtn",
        "locationBtn",
        "elevProfileBtn"
    ];

    if (!isSliderVisible) {
        angleSlider.style.display = ''; // Reset display property to default value
        angleSlider.style.transition = "opacity 0.5s ease-in-out";
        btnElement.classList.add('active');
        btnIcon.classList.add('active');
        isSliderVisible = true;

        // Hide buttons
        buttonsToHide.forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.style.display = 'none';
            }
        });

        // Save drawn features before changing to PerspectiveMap
        const savedFeatures = saveMapFeatures(map);

        // Toggle map mode
        toggleMapMode();

        // Restore saved features on PerspectiveMap
        restoreMapFeatures(map, savedFeatures);

        // Log that map switched to ol.PerspectiveMap
        console.log("Switched to ol.PerspectiveMap");
    } else {
        angleSlider.style.display = 'none';
        btnElement.classList.remove('active');
        btnIcon.classList.remove('active');
        isSliderVisible = false;

        // Show buttons again
        buttonsToHide.forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.style.display = ''; // Reset display property to default value
            }
        });

        // Save drawn features before changing back to ol.Map
        const savedFeatures = saveMapFeatures(map);

        // Toggle map mode
        toggleMapMode();

        // Restore saved features on ol.Map
        restoreMapFeatures(map, savedFeatures);

        // Log that map switched to ol.Map
        console.log("Switched to ol.Map");
    }
});


// Function to toggle between ol.Map and ol.PerspectiveMap
function toggleMapMode() {
    if (isSliderVisible) {
        // Change map to PerspectiveMap
        map.dispose(); // Dispose the current map instance
        map = new ol.PerspectiveMap({
            target: 'map',
            layers: [satelliteLayer, streetLayer, gebcoLayer, carbonLayer, phLayer, nitrogenLayer],
            view: new ol.View({
                center: map.getView().getCenter(),
                zoom: map.getView().getZoom(),
            }),
            controls: [new ol.control.ScaleLine()], // Add scale bar control
            preserveDrawingBuffer: true // Preserve the drawing buffer for labels and centroids
        });

        // Reattach map click event listener
        attachMapClickListener();
    } else {
        // Change map back to ol.Map
        map.dispose(); // Dispose the current map instance
        map = new ol.Map({
            target: 'map',
            view: new ol.View({
                zoom: map.getView().getZoom(),
                center: map.getView().getCenter()
            }),
            layers: [satelliteLayer, streetLayer, gebcoLayer, carbonLayer, phLayer, nitrogenLayer],
            controls: [new ol.control.ScaleLine()], // Add scale bar control
            preserveDrawingBuffer: true // Preserve the drawing buffer for labels and centroids
        });

        // Reattach map click event listener
        attachMapClickListener();
    }
}


// Function to save map features before switching maps
function saveMapFeatures(map) {
    return map.getLayers().getArray().filter(layer => layer instanceof ol.layer.Vector);
}

// Function to restore saved features on the new map instance
function restoreMapFeatures(map, savedFeatures) {
    savedFeatures.forEach(layer => {
        map.addLayer(layer);
    });
}

// Function to attach map click event listener
function attachMapClickListener() {
    // Remove existing click event listener
    map.un('click', handleMapClick);

    // Add click event listener
    map.on('click', handleMapClick);
}

// Function to handle map click event
function handleMapClick(event) {
    // Only start counting clicks when drawing is activated
    if (isDrawingActivated) {
        // Increment click counter
        clickCounter++;

        // If the click counter reaches 2, show the button
        if (clickCounter === 2) {
            document.getElementById('finishdrawLineElevProfile').style.display = 'block';
        }
    }
}

//////////// <----- END FUNCTION TO CHANGE MAP PERSPECTIVE -----> \\\\\\\\\\\\\\\
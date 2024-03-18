// Initialize vector source and layer for drawn polygons 
var source = new ol.source.Vector();

// Define a variable to store the point's coordinates
var storedPointCoordinates;

// Keep track of the added area size labels
var areaSizeLabels = {};


// Define the style for the polygons
var polygonStyle = new ol.style.Style({
    fill: new ol.style.Fill({
        color: 'rgba(33,105,104, 0.5)' // Fill color (green with 50% opacity)
    }),
    stroke: new ol.style.Stroke({
        color: 'rgba(33,105,104, 0.5)', // Outline color (green)
        width: 5 // Outline width (5 pixels)
    })
});

// Initialize/display vector layer with the defined style
var vectorLayer = new ol.layer.Vector({
    source: source,
    style: polygonStyle // Apply the style to the layer
});
map.addLayer(vectorLayer);

// Function to load area size labels from local storage and display them on map load
function loadAreaLabels() {
    // Retrieve stored labels from local storage
    var storedLabels = JSON.parse(localStorage.getItem('storedAreaLabels')) || {};
    // Iterate over stored labels and create overlay for each
    Object.keys(storedLabels).forEach(function (coordinatesStr) {
        var coordinates = JSON.parse(coordinatesStr);
        var label = storedLabels[coordinatesStr];
        var areaSizeLabel = new ol.Overlay({
            element: createLabelElement(label), // Create label element
            offset: [90, -40], // Offset to position the label
            positioning: 'top-right', // Position the label to the top right of the feature
            insertFirst: false // Ensure that the label is not inserted as the first child
        });
        areaSizeLabel.setPosition(coordinates);
        map.addOverlay(areaSizeLabel);
    });
}

// Call the function to load and display area size labels on map load
loadAreaLabels();

/////////////// Function to retrieve drawn polygons and points on map load \\\\\\\\\\\\\\\\\\\\
// Function to save/load drawn polygons to/from local storage
function savePolygons(polygons) {
    localStorage.setItem('drawnPolygons', JSON.stringify(polygons));
}

function loadPolygons() {
    return JSON.parse(localStorage.getItem('drawnPolygons') || '[]');
}

// Load drawn polygons when the page is loaded
loadPolygons().forEach(coords => source.addFeature(new ol.Feature({ geometry: new ol.geom.Polygon(coords) })));

// Pan to the drawn polygon if it exists
if (source.getFeatures().length > 0) {
    map.getView().fit(source.getExtent(), { padding: [100, 100, 100, 100] });
} else {
    panToUserLocation();
}

// Function to save/load stored points to/from local storage
function savePoints(points) {
    localStorage.setItem('storedPointCoordinates', JSON.stringify(points));
}

function loadPoints() {
    return JSON.parse(localStorage.getItem('storedPointCoordinates') || '[]');
}

// Load stored points when the page is loaded
loadPoints().forEach(coordinates => {
    var pointFeature = new ol.Feature({ geometry: new ol.geom.Point(coordinates) });
    var pointSource = new ol.source.Vector({ features: [pointFeature] });
    var pointLayer = new ol.layer.Vector({
        source: pointSource,
        name: 'storedPointLayer' // Set a unique name for the layer
    });
    map.addLayer(pointLayer);
});





////////////////////// FUNCTION TO ACTIVATE OR DEACTIVATE DRAWING FARMS POLYGON \\\\\\\\\\\\\\\\\\\\\\\\\
// Initialize a boolean variable to track the draw interaction state
let drawActive = false;
let clickHandlerActive = false; // Flag to determine whether to handle the click event
let clickListener; // Variable to store the click event listener

// Store the original HTML content and background color of the button
const originalButton = document.getElementById('sketchFarmBtn');
const originalButtonContent = originalButton.innerHTML;
const originalButtonBackgroundColor = originalButton.style.backgroundColor;


// Define pointSource outside the event listener so it's accessible to other functions
var pointSource = new ol.source.Vector();

// Initialize an array to store the coordinates of vertices
var drawnVertices = [];

// Keep track of the drawing interaction
let drawInteraction;

// Function to undo the last sketch vertex
function undoSketchInteraction() {
    if (drawInteraction) {
        drawInteraction.removeLastPoint();
    }
}


originalButton.addEventListener('click', function () {
    // Toggle the draw interaction state
    drawActive = !drawActive;

    // Toggle the glowing effect class
    //originalButton.classList.toggle('glowing', drawActive);

    // Hide specified buttons when the drawing function is active
    const buttonsToHide = ["searchBar", "searchBtn", "basemapBtn", "measureAreaBtn", "measureLengthBtn", "addSensorBtn", "tutorialBtn", "windyMapBtn", "resetBtn", "perspectiveBtn", "elevProfileBtn"];
    buttonsToHide.forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if (button) {
            button.style.display = drawActive ? 'none' : 'block';
        }
    });

    // Display the element when the drawing function is active
    const sketchingFarmFloatingTitle = document.querySelector('.sketchingFarmfloatingTitle');
    if (sketchingFarmFloatingTitle) {
        sketchingFarmFloatingTitle.style.display = drawActive ? 'block' : 'none';
    }

    // Show sketchingFarmfloatingTitle when sketching is active
    if (drawActive) {
        const floatingMessage = document.createElement("div");
        floatingMessage.className = "floating-message";
        const infoIcon = document.createElement("i");
        infoIcon.className = "material-icons";
        infoIcon.textContent = "touch_app";
        infoIcon.style.fontSize = "50px";
        floatingMessage.appendChild(infoIcon);
        floatingMessage.innerHTML +=
            "Chạm vào bản đồ để bắt đầu vẽ trang trại"; // "Tap on the map to start drawing the farm"
        map.getViewport().appendChild(floatingMessage);

        timeoutId = setTimeout(function () {
            map.getViewport().removeChild(floatingMessage);
        }, 3000);

    } else {
        // Remove the floating message when not drawing
        const floatingMessage = document.querySelector(".floating-message");
        if (floatingMessage) {
            map.getViewport().removeChild(floatingMessage);
        }
    }

    if (drawActive) {
        // Activate the draw interaction
        drawInteraction = new ol.interaction.Draw({ source: source, type: 'Polygon' });
        map.addInteraction(drawInteraction);
        var verticesCount = 0;

        // Add a click event listener to the map
        clickHandlerActive = true; // Enable click event handling
        clickListener = map.on('click', function (event) {
            // Show the undo button always when the user is actively drawing polygons
            document.getElementById('undoSketchBtn').style.display = 'block';

            if (clickHandlerActive && ++verticesCount >= 3)
                document.getElementById('finishDrawingButton').classList.remove('hidden');
        });

        // Initialize a vector layer for displaying point features
        var pointLayer = new ol.layer.Vector({
            source: pointSource,
            name: 'storedPointLayer' // Set a unique name for the layer
        });
        map.addLayer(pointLayer);

        // Add a drawend event listener to the draw interaction
        drawInteraction.on('drawend', function (event) {
            // Extract the coordinates of the drawn polygon
            var polygonCoordinates = event.feature.getGeometry().getCoordinates()[0].slice(0, -1); //To exclude the last coordinate clicked when logging the drawn polygon vertices

            // Calculate the area of the drawn polygon
            var areaSquareMeters = calculatePolygonArea(polygonCoordinates);
            var areaHectares = areaSquareMeters / 10000; // Convert square meters to hectares

            // Log the coordinates of the drawn polygon vertices and its area to the console
            console.log('Drawn Polygon Vertices:', polygonCoordinates);
            console.log('Area (Square Meters):', areaSquareMeters);
            console.log('Area (Hectares):', areaHectares);

            // Calculate the centroid (middle point) of the polygon
            var centroid = calculateCentroid(polygonCoordinates);

            // Log the centroid to the console
            console.log('Centroid:', centroid);

            // Store the centroid coordinates
            savePointCoordinates(centroid);

            // Create a point feature for the centroid
            var pointFeature = new ol.Feature({
                geometry: new ol.geom.Point(centroid)
            });

            // Add the area size label to the point feature
            addAreaLabelToFeature(pointFeature, areaSquareMeters, areaHectares);

            // Add the point feature to the point source
            pointSource.addFeature(pointFeature);
        });

        // Change the button content to "delete_forever" icon
        originalButton.innerHTML = '<i class="material-icons" style="color: white;">close</i>';
    } else {
        // Hide the undo button
        document.getElementById('undoSketchBtn').style.display = 'none';

        // Deactivate the draw interaction
        map.removeInteraction(drawInteraction);

        // Disable click event handling
        clickHandlerActive = false;

        // Remove the click event listener from the map
        if (clickListener) {
            ol.Observable.unByKey(clickListener);
            clickListener = null;
        }

        // Revert the button content back to its original state
        originalButton.innerHTML = originalButtonContent;
    }

    // Revert the button color back to its original state
    originalButton.style.backgroundColor = drawActive ? '#FF6666' : originalButtonBackgroundColor;
});

// Event listener for the undo button click
document.getElementById('undoSketchBtn').addEventListener('click', undoSketchInteraction);








////////////////////// Function to add the area size label to the point feature \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// Function to add the area size label to the point feature
function addAreaLabelToFeature(feature, areaSquareMeters, areaHectares) {
    // Calculate area size
    var areaSize = areaSquareMeters < 1000 ? areaSquareMeters.toFixed(2) + ' sqm' : areaHectares.toFixed(2) + ' ha';
    var treeRange = estimateTreeRange(areaHectares);
    //var additionalText = "Approximate robusta coffee trees for this plot is " + treeRange[0] + " to " + treeRange[1];
    var additionalText = "Approximate arabica coffee trees for this plot is " + treeRange[0] + " to " + treeRange[1];


    // Create area size label overlay
    var areaSizeLabel = new ol.Overlay({
        id: JSON.stringify(feature.getGeometry().getCoordinates()), // Unique identifier for the overlay
        element: createLabelElement(areaSize, additionalText), // Create label element
        offset: [90, -40], // Offset to position the label
        positioning: 'top-right', // Position the label to the top right of the feature
        insertFirst: false // Ensure that the label is not inserted as the first child
    });

    // Set label position
    areaSizeLabel.setPosition(feature.getGeometry().getCoordinates());

    // Add area size label overlay to the map
    map.addOverlay(areaSizeLabel);

    // Save reference to the area size label overlay
    areaSizeLabels[areaSizeLabel.getId()] = areaSizeLabel;

    // Save area size label and tree range to local storage
    saveAreaLabel(areaSize, feature.getGeometry().getCoordinates(), treeRange);
}

/*
// Function to estimate the range of Robusta Coffee Trees for a given area
function estimateTreeRange(areaHectares) {
    // Calculate the minimum and maximum number of trees based on the area
    var minTrees = Math.round(areaHectares * 625);
    var maxTrees = Math.round(areaHectares * 1667);
    return [minTrees, maxTrees];
}*/

// Function to estimate the range of Robusta Coffee Trees for a given area
function estimateTreeRange(areaHectares) {
    // Calculate the minimum and maximum number of trees based on the area
    var minTrees = Math.round(areaHectares * 3000);
    var maxTrees = Math.round(areaHectares * 5000);
    return [minTrees, maxTrees];
}

// Function to save area size label and tree range to local storage
function saveAreaLabel(label, coordinates, treeRange) {
    // Retrieve existing stored labels or initialize an empty object
    var storedLabels = JSON.parse(localStorage.getItem('storedAreaLabels')) || {};
    // Convert coordinates to string for use as object key
    var coordinatesKey = JSON.stringify(coordinates);
    // Add the label with coordinates and tree range to the object
    storedLabels[coordinatesKey] = { label: label, treeRange: treeRange };
    // Save the updated object to local storage
    localStorage.setItem('storedAreaLabels', JSON.stringify(storedLabels));
}

// Function to create label element with additional text that can be expanded
function createLabelElement(areaSize, additionalText) {
    // Create container div
    var containerDiv = document.createElement('div');
    containerDiv.style.backgroundColor = 'white';
    containerDiv.style.padding = '6px';
    containerDiv.style.borderRadius = '20px';
    containerDiv.style.border = '1px solid #ccc';
    containerDiv.style.fontSize = '12px';
    containerDiv.style.fontFamily = 'Be Vietnam Pro'; // Set font family to 'Be Vietnam Pro'
    containerDiv.style.display = 'flex';
    containerDiv.style.alignItems = 'center';
    containerDiv.style.flexDirection = 'row'; // Change flex direction to stack content vertically
    containerDiv.style.cursor = 'pointer'; // Change cursor to pointer to indicate it's clickable

    // Create icon span
    var iconSpan = document.createElement('span');
    iconSpan.className = 'material-symbols-outlined';
    iconSpan.textContent = 'psychiatry';
    iconSpan.style.marginRight = '3px'; // Add some margin between the icon and the text
    iconSpan.style.color = '#515151';

    // Create label content span
    var labelContent = document.createElement('span');
    labelContent.textContent = areaSize;
    labelContent.style.color = '#515151';

    // Append icon and label content to the container
    containerDiv.appendChild(iconSpan);
    containerDiv.appendChild(labelContent);

    // Create additional text span
    var additionalTextDiv = document.createElement('div');
    additionalTextDiv.textContent = additionalText;
    additionalTextDiv.style.display = 'none'; // Initially hide the additional text
    additionalTextDiv.style.paddingTop = '5px';
    additionalTextDiv.style.padding = '6px'; // Add padding to the expanded text
    additionalTextDiv.style.fontSize = '10px';
    additionalTextDiv.style.color = '#666';
    additionalTextDiv.style.fontFamily = 'Be Vietnam Pro'; // Set font family to 'Be Vietnam Pro'
    additionalTextDiv.style.transition = 'max-height 0.3s ease-in-out'; // Add smooth transition effect
    additionalTextDiv.style.backgroundColor = 'white'; // Set background color to opaque white

    // Append additional text to the container
    containerDiv.appendChild(additionalTextDiv);

    // Add event listener to toggle expansion on click
    containerDiv.addEventListener('click', function () {
        // Toggle the display of additional text only
        additionalTextDiv.style.display = additionalTextDiv.style.display === 'none' ? 'block' : 'none';
        // Toggle the display of icon and area size
        iconSpan.style.display = iconSpan.style.display === 'none' ? 'inline-block' : 'none';
        labelContent.style.display = labelContent.style.display === 'none' ? 'inline-block' : 'none';
    });

    return containerDiv;
}

// Function to load area size labels from local storage and display them on map load
function loadAreaLabels() {
    // Retrieve stored labels from local storage
    var storedLabels = JSON.parse(localStorage.getItem('storedAreaLabels')) || {};
    // Iterate over stored labels and create overlay for each
    Object.keys(storedLabels).forEach(function (coordinatesStr) {
        var coordinates = JSON.parse(coordinatesStr);
        var labelInfo = storedLabels[coordinatesStr];
        var label = labelInfo.label;
        var treeRange = labelInfo.treeRange;
        // Fetch additional text from wherever it's stored (e.g., database or another local storage item)
        var additionalText = "Approximate robusta coffee trees for this plot is " + treeRange[0] + " to " + treeRange[1]; // Example additional text
        var additionalText = "Approximate arabica coffee trees for this plot is " + treeRange[0] + " to " + treeRange[1]; // Example additional text
        var areaSizeLabel = new ol.Overlay({
            element: createLabelElement(label, additionalText), // Create label element with additional text
            offset: [90, -40], // Offset to position the label
            positioning: 'top-right', // Position the label to the top right of the feature
            insertFirst: false // Ensure that the label is not inserted as the first child
        });
        areaSizeLabel.setPosition(coordinates);
        map.addOverlay(areaSizeLabel);
    });
}

// Call the function to load and display area size labels on map load
loadAreaLabels();

// Function to calculate the area of a polygon
function calculatePolygonArea(coordinates) {
    var polygon = new ol.geom.Polygon([coordinates]);
    var area = polygon.getArea(); // Area in square meters
    return area;
}

// Function to calculate the centroid of a polygon
function calculateCentroid(coordinates) {
    var len = coordinates.length;
    var x = 0;
    var y = 0;

    for (var i = 0; i < len; i++) {
        x += coordinates[i][0];
        y += coordinates[i][1];
    }

    x /= len;
    y /= len;

    return [x, y];
}







// Function to save the point's coordinates to the browser's storage
function savePointCoordinates(coordinates) {
    // Retrieve existing stored points or initialize an empty array
    var storedPoints = JSON.parse(localStorage.getItem('storedPointCoordinates')) || [];
    // Add the new coordinates to the array
    storedPoints.push(coordinates);
    // Save the updated array to the local storage
    localStorage.setItem('storedPointCoordinates', JSON.stringify(storedPoints));
}


// Event listener for the finish drawing button click
document.getElementById('finishDrawingButton').addEventListener('click', function () {
    if (drawInteraction) {
        // Finish drawing the polygon
        drawInteraction.finishDrawing();

        // Hide the finish drawing button
        document.getElementById('finishDrawingButton').classList.add('hidden');

        // Reset the vertices count
        verticesCount = 0;

        // Save the drawn polygons
        savePolygons(source.getFeatures().filter(feature => feature.getGeometry() instanceof ol.geom.Polygon)
            .map(feature => feature.getGeometry().getCoordinates()));

        // Show the undo button
        document.getElementById('undoSketchBtn').style.display = 'block';

        // Show the clear all drawings button
        document.getElementById('clearAllDrawingBtn').style.display = 'block';
    }
});



document.getElementById('finishDrawingButton').addEventListener('click', function () {
    drawInteraction.finishDrawing();
    document.getElementById('finishDrawingButton').classList.add('hidden');
    verticesCount = 0;
    savePolygons(source.getFeatures().filter(feature => feature.getGeometry() instanceof ol.geom.Polygon)
        .map(feature => feature.getGeometry().getCoordinates()));
});




////////////////////// Function to show the delete confirmation dialog \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

// Function to show the delete confirmation dialog
function toggleDeleteConfirmation(show) {
    document.getElementById('dialog').classList.toggle('hidden', !show);
}

// Function to toggle the visibility of the clear all drawings button
function toggleClearAllButtonVisibility() {
    const clearAllButton = document.getElementById('clearAllDrawingBtn');
    clearAllButton.style.display = source.getFeatures().length > 0 ? 'block' : 'none';
}


// Function to load and add stored points to the map
function loadAndAddPoints() {
    pointSource.clear(); // Clear existing points
    loadPoints().forEach(coordinates => {
        var pointFeature = new ol.Feature({ geometry: new ol.geom.Point(coordinates) });
        pointSource.addFeature(pointFeature); // Add the point feature to the point source
    });
}


// Event listener for the clear all drawings button click
document.getElementById('clearAllDrawingBtn').addEventListener('click', function () {
    // Show the delete confirmation dialog
    toggleDeleteConfirmation(true);
});


// Event listener for the delete confirmation "Đúng" (Yes) button click
document.getElementById('deleteYes').addEventListener('click', function () {
    // Clear the vector source
    source.clear();

    // Ensure that map and map.getLayers() are defined
    var layers = map.getLayers();
    if (layers) {
        layers.forEach(layer => {
            if (layer && layer.get('name') === 'storedPointLayer') {
                map.removeLayer(layer);
            }
        });
    } else {
        console.error("Map layers are undefined or not accessible.");
    }

    // Save the cleared polygons (empty array) to local storage
    savePolygons([]);

    // Clear the stored point coordinates from local storage
    clearStoredPoints();

    // Clear the stored area labels from local storage and map
    clearStoredAreaLabels();

    // Hide the delete confirmation dialog
    toggleDeleteConfirmation(false);

    // Toggle the visibility of the clear all drawings button
    toggleClearAllButtonVisibility();

    // Load and add points again after clearing all drawings
    loadAndAddPoints();

    // Function to reredner the map
    reRenderMap();
});



// Function to clear stored area labels from the map
function clearStoredAreaLabels() {
    // Retrieve stored labels from local storage
    var storedLabels = JSON.parse(localStorage.getItem('storedAreaLabels')) || {};
    
    // Iterate over stored labels and remove overlay from the map
    Object.keys(storedLabels).forEach(function (coordinatesStr) {
        var coordinates = JSON.parse(coordinatesStr);
        var overlayId = JSON.stringify(coordinates);
        var areaSizeLabel = areaSizeLabels[overlayId];
        if (areaSizeLabel) {
            map.removeOverlay(areaSizeLabel); // Remove the overlay from the map
            delete areaSizeLabels[overlayId]; // Remove reference from the areaSizeLabels object
        }
    });

    // Clear the stored area labels from local storage
    localStorage.removeItem('storedAreaLabels');
}



// Function to re-render the map and clear any remaining labels, points with a message
function reRenderMap() {
    // Display a message indicating clearing of drawings
    console.log('Clearing drawings...');

    // Capture the current extent of the map
    var currentExtent = map.getView().calculateExtent(map.getSize());

    // Clear all overlays, layers, and stored data
    map.getOverlays().clear();
    source.clear();
    areaSizeLabels = {};
    localStorage.removeItem('storedAreaLabels');
    localStorage.removeItem('storedPointCoordinates');

    // Reload the map with the initial setup
    // Add the vector layer with the defined style
    var vectorLayer = new ol.layer.Vector({
        source: source,
        style: polygonStyle
    });
    map.addLayer(vectorLayer);

    // Load and display area size labels on the map
    loadAreaLabels();

    // Load and add stored points to the map
    loadAndAddPoints();

    // Set the view back to the captured extent for a seamless transition
    map.getView().fit(currentExtent, { duration: 10 }); // Adjust duration as needed for smooth transition

    // Clear all stored points from the map and local storage
    clearStoredPoints();
}


// Function to clear stored points from the map and local storage
function clearStoredPoints() {
    localStorage.removeItem('storedPointCoordinates');
    // Remove all features from the point source
    pointSource.clear();
    // Ensure that map and map.getLayers() are defined
    var layers = map.getLayers();
    if (layers) {
        layers.forEach(layer => {
            if (layer && layer.get('name') === 'storedPointLayer') {
                map.removeLayer(layer);
            }
        });
    } else {
        console.error("Map layers are undefined or not accessible.");
    }
}

// Event listener for the delete confirmation "Không" (No) button click
document.getElementById('deleteNo').addEventListener('click', function () {
    // Hide the delete confirmation dialog
    toggleDeleteConfirmation(false);
});

// Function to add a polygon to the map
function addPolygon(coords) {
    source.addFeature(new ol.Feature({ geometry: new ol.geom.Polygon(coords) }));
    // After adding the polygon, toggle the visibility of the clear all drawings button
    toggleClearAllButtonVisibility();
}

// Event listener for the finish drawing button click
document.getElementById('finishDrawingButton').addEventListener('click', function () {
    // Hide the undo button
    document.getElementById('undoSketchBtn').style.display = 'none';
    // Show the clear all drawings button
    document.getElementById('clearAllDrawingBtn').style.display = 'block';
});

// Call the function to toggle the visibility of the clear all drawings button initially
toggleClearAllButtonVisibility();








///////////////////////// Function to pan to the user's location \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
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

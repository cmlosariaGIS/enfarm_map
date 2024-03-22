///// Showing and hiding Start, Pause and Stop buttons \\\\\
document.addEventListener('DOMContentLoaded', function () {
    var startBtn = document.getElementById('gpsDrawFarmStartBtn');
    var pauseBtn = document.getElementById('gpsDrawFarmPauseBtn');
    var stopBtn = document.getElementById('gpsDrawFarmStopBtn');
    var farmBtn = document.getElementById('gpsDrawFarmBtn');
    var saveBtn = document.getElementById('gpsDrawFarmSaveDrawBtn');
    var discardBtn = document.getElementById('gpsDrawFarmDiscardDrawBtn');

    // Hide buttons on map load
    startBtn.style.display = 'none';
    stopBtn.style.display = 'none';
    pauseBtn.style.display = 'none';
    saveBtn.style.display = 'none';
    discardBtn.style.display = 'none';

    function toggleButtons() {
        var showButtons = (startBtn.style.display === 'none');
        startBtn.style.display = showButtons ? 'block' : 'none';
        stopBtn.style.display = showButtons ? 'none' : 'none';

        if (pauseBtn.style.display === 'block') {
            pauseBtn.style.display = 'none';
        }
    }

    farmBtn.addEventListener('click', toggleButtons);
    startBtn.addEventListener('click', function () {
        startBtn.style.display = 'none';
        stopBtn.style.display = 'block';
        pauseBtn.style.display = 'block';
    });
    pauseBtn.addEventListener('click', function () {
        pauseBtn.style.display = 'none';
        startBtn.style.display = 'block';
    });
    stopBtn.addEventListener('click', function () {
        startBtn.style.display = 'block';
        pauseBtn.style.display = 'none';
        saveBtn.style.display = 'block';
        discardBtn.style.display = 'block';
    });

    saveBtn.addEventListener('click', function () {
        startBtn.style.display = 'none';
        pauseBtn.style.display = 'none';
        stopBtn.style.display = 'none';
        saveBtn.style.display = 'none';
        discardBtn.style.display = 'none';
    });

    discardBtn.addEventListener('click', function () {
        startBtn.style.display = 'none';
        pauseBtn.style.display = 'none';
        stopBtn.style.display = 'none';
        saveBtn.style.display = 'none';
        discardBtn.style.display = 'none';
    });
});


// Define the Polygon style 
var styleFunction = function (feature) {
    return new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(33,105,104, 0.5)' // Fill color (green with 50% opacity)
        }),
        stroke: new ol.style.Stroke({
            color: 'rgba(33,105,104, 0.5)', // Outline color (green)
            width: 5
        })
    });
};

// New coffee farm vector layer 
var vector = new ol.layer.Vector({
    name: 'coffeeFarm',
    source: new ol.source.Vector(),
    style: styleFunction
});

// Add the vector layer to the map
map.addLayer(vector);




// Pan to the drawn polygon if it exists, otherwise pan to user location
if (vector.getSource().getFeatures().length > 0) {
    map.getView().fit(vector.getSource().getExtent(), { padding: [100, 100, 100, 100] });
} else {
    // If no drawn polygon exists, pan to user location
    panToUserLocation();
}





// Draw interaction
var draw = new ol.interaction.GeolocationDraw({
    source: vector.getSource(),
    zoom: 18,
    minAccuracy: 10, //10000
    tolerance: 3,
});

map.addInteraction(draw);

// Hard code the drawing type to "Polygon"
draw.set("type", "Polygon"); //other values: "Point" and "LineString"

// Hard code followTrack to true
draw.setFollowTrack(true); //other values: false, auto, position, visible

draw.on("tracking", function (e) {
    $("#accuracy").width((e.geolocation.getAccuracy()));
    $("#heading").val(e.geolocation.getHeading());
    $("#z").val(e.geolocation.getAltitude());
});

draw.on('follow', function (e) {
    if (e.following) $(".follow").hide();
    else $(".follow").show();
});

// Handle drawing
draw.on("drawstart", function (e) {
});

draw.on("drawend", function (e) {
    $(".follow").hide();
});

/////// Save the GPS Drawing \\\\\\\
// Define the gpsDrawSave function
function gpsDrawSave() {
    try {
        // Get the features from the vector source
        var features = vector.getSource().getFeatures();
        // Convert features to GeoJSON format
        var geojsonFormat = new ol.format.GeoJSON();
        var geojson = geojsonFormat.writeFeaturesObject(features);
        // Save GeoJSON string to localStorage
        localStorage.setItem('savedDrawing', JSON.stringify(geojson));
    } catch (error) {
        console.error('Error saving drawing:', error);
    }
}

//////// Retrieve the saved GPS Drawing \\\\\\\

// Define the gpsDrawLoad function
function gpsDrawLoad() {
    try {
        // Retrieve the saved GeoJSON string from localStorage
        const savedGeoJSONString = localStorage.getItem('savedDrawing');
        if (savedGeoJSONString) {
            // Parse the GeoJSON string into features
            const geojsonFormat = new ol.format.GeoJSON();
            const features = geojsonFormat.readFeatures(JSON.parse(savedGeoJSONString));
            // Clear existing features and add the loaded features
            vector.getSource().clear();
            vector.getSource().addFeatures(features);
        }
    } catch (error) {
        console.error('Error loading drawing:', error);
    }
}

// Call the gpsDrawLoad function when the map loads
window.addEventListener('load', gpsDrawLoad);


////// Discard the GPS Drawing \\\\\\\
// Define the gpsDrawDiscard function
function gpsDrawDiscard() {
    // Clear the vector source to discard the drawing
    vector.getSource().clear();
}

// Register an event listener for the "Discard" button
document.getElementById('gpsDrawFarmDiscardDrawBtn').addEventListener('click', gpsDrawDiscard);



///////////// Function to Highlight Selected Farm Polygon \\\\\\\\\\\\\\\\
// Define style for highlighted polygons with sky blue outline
var highlightedPolygonStyle = new ol.style.Style({
    fill: new ol.style.Fill({
        color: 'rgba(33,105,104, 0.5)' // Fill color (green with 50% opacity)
    }),
    stroke: new ol.style.Stroke({
        color: '#00b4d8', // Outline color (sky blue)
        width: 5 // Outline width (5 pixels)
    })
});

// Initialize select interaction
var selectInteraction = new ol.interaction.Select({
    layers: [vector], // Set the layer to perform selection on
});

// Add the select interaction to the map
map.addInteraction(selectInteraction);

// Define a function to apply highlight style to selected feature
function highlightSelectedFeature(event) {
    var selectedFeatures = event.selected; // Get selected features
    var deselectedFeatures = event.deselected; // Get deselected features

    // Apply highlight style to selected features
    selectedFeatures.forEach(function(feature) {
        feature.setStyle(highlightedPolygonStyle);
    });

    // Reset style for deselected features
    deselectedFeatures.forEach(function(feature) {
        feature.setStyle(styleFunction); // Use original style
    });
}

// Register an event listener for the 'select' event of the select interaction
selectInteraction.on('select', highlightSelectedFeature);



// Event listener for when a feature is selected or deselected
selectInteraction.on('select', function (event) {
    var selectedFeatures = event.selected; // Get the selected features

    // Remove any existing delete buttons
    var existingDeleteButtons = document.querySelectorAll('.delete-button');
    existingDeleteButtons.forEach(function (button) {
        button.remove();
    });

    // Loop through all stored point features and reset their styles
    var storedPointLayers = map.getLayers().getArray().filter(layer => layer.get('name') === 'storedPointLayer');
    storedPointLayers.forEach(function (layer) {
        layer.getSource().getFeatures().forEach(function (pointFeature) {
            pointFeature.setStyle(null);
        });
    });

    // Loop through selected features
    selectedFeatures.forEach(function (feature) {
        feature.setStyle(highlightedPolygonStyle); // Apply highlighted style

        // Highlight stored points on top of the selected polygon
        storedPointLayers.forEach(function (layer) {
            layer.getSource().getFeatures().forEach(function (pointFeature) {
                if (feature.getGeometry().intersectsCoordinate(pointFeature.getGeometry().getCoordinates())) {
                    // Highlight stored point
                    pointFeature.setStyle(highlightedPointStyle);
                }
            });
        });

        // Create the delete button
        var deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.innerHTML = '<i class="material-icons">delete</i>';
        deleteButton.style.position = 'absolute';
        deleteButton.style.bottom = '30%';
        deleteButton.style.left = '50%';
        deleteButton.style.transform = 'translateX(-50%)';
        deleteButton.style.backgroundColor = '#ff4d4d';
        deleteButton.style.border = 'none';
        deleteButton.style.borderRadius = '50%';
        deleteButton.style.padding = '10px';
        deleteButton.style.display = 'flex';
        deleteButton.style.alignItems = 'center';
        deleteButton.style.justifyContent = 'center';
        deleteButton.style.cursor = 'pointer';
        deleteButton.style.color = 'white';
        deleteButton.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
        deleteButton.style.transition = 'background-color 0.3s';

        // Append the delete button to the map container
        map.getViewport().appendChild(deleteButton);

        // Event listener for delete button click
        deleteButton.addEventListener('click', function () {
            // Remove the feature from the vector layer
            vector.getSource().removeFeature(feature);

            // Remove the corresponding entry from browser storage
            removePolygonFromStorage(feature);

            // Remove the delete button
            deleteButton.remove();
        });
    });

    // Hide delete button if no polygon is selected
    if (selectedFeatures.length === 0) {
        var existingDeleteButtons = document.querySelectorAll('.delete-button');
        existingDeleteButtons.forEach(function (button) {
            button.remove();
        });
    }
});

// Function to remove polygon's array entry from browser storage
function removePolygonFromStorage(feature) {
    try {
        // Get the features from the vector source
        var features = vector.getSource().getFeatures();
        // Convert features to GeoJSON format
        var geojsonFormat = new ol.format.GeoJSON();
        var geojson = geojsonFormat.writeFeaturesObject(features);
        // Remove the polygon's array entry from the GeoJSON object
        var filteredGeojsonFeatures = geojson.features.filter(function (geojsonFeature) {
            return !ol.extent.containsCoordinate(feature.getGeometry().getExtent(), geojsonFeature.geometry.coordinates);
        });
        geojson.features = filteredGeojsonFeatures;
        // Save updated GeoJSON string to localStorage
        localStorage.setItem('savedDrawing', JSON.stringify(geojson));
    } catch (error) {
        console.error('Error removing polygon from storage:', error);
    }
}









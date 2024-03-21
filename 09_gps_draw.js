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


// Draw interaction
var draw = new ol.interaction.GeolocationDraw({
    source: vector.getSource(),
    zoom: 18,
    minAccuracy: 10, //10000
    tolerance: 1,
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

// Register an event listener for the "Save" button
document.getElementById('gpsDrawFarmSaveDrawBtn').addEventListener('click', function () {
    alert("Save button clicked!"); // Check if this alert is displayed
    gpsDrawSave(); // Call the save function
});


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






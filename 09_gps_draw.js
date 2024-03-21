///// Showing and hiding Start, Pause and Stop buttons \\\\\

document.addEventListener('DOMContentLoaded', function () {
    var startBtn = document.getElementById('gpsDrawFarmStartBtn');
    var pauseBtn = document.getElementById('gpsDrawFarmPauseBtn');
    var stopBtn = document.getElementById('gpsDrawFarmStopBtn');
    var farmBtn = document.getElementById('gpsDrawFarmBtn');

    // Hide buttons on map load
    startBtn.style.display = 'none';
    stopBtn.style.display = 'none';
    pauseBtn.style.display = 'none'; 

    function toggleButtons() {
        var showButtons = (startBtn.style.display === 'none');
        startBtn.style.display = showButtons ? 'block' : 'none';
        stopBtn.style.display = showButtons ? 'block' : 'none';

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
    });
});


// Define the Polygon style 
var styleFunction = function(feature) {
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

// New vector layer 
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
    minAccuracy: 1000, //10000
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
    // Get the features from the vector source
    var features = vector.getSource().getFeatures();
    // Convert features to GeoJSON format
    var geojsonFormat = new ol.format.GeoJSON();
    var geojson = geojsonFormat.writeFeaturesObject(features);
    // Save GeoJSON string to localStorage
    localStorage.setItem('savedDrawing', JSON.stringify(geojson));
}

// Register an event listener for the "Save" button
document.getElementById('gpsDrawFarmSaveDrawBtn').addEventListener('click', gpsDrawSave);




////// Discard the GPS Drawing \\\\\\\
// Define the gpsDrawDiscard function
function gpsDrawDiscard() {
    // Clear the vector source to discard the drawing
    vector.getSource().clear();
}

// Register an event listener for the "Discard" button
document.getElementById('gpsDrawFarmDiscardDrawBtn').addEventListener('click', gpsDrawDiscard);


/////// Retrieve the saved GPS Drawing \\\\\\\
// Function to load the saved drawing from local storage
function loadSavedDrawing() {
    var savedDrawing = localStorage.getItem('savedDrawing');
    if (savedDrawing) {
        var geojsonFormat = new ol.format.GeoJSON();
        var features = geojsonFormat.readFeatures(savedDrawing, {
            featureProjection: 'EPSG:3857', // Assuming your map uses EPSG:3857 projection
            style: styleFunction // Apply the same style function to the loaded features
        });
        vector.getSource().addFeatures(features);
    }
}

// Call the function to load the saved drawing when the DOM content is loaded
document.addEventListener('DOMContentLoaded', loadSavedDrawing);




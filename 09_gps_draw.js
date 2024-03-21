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



// Define the style function
var styleFunction = function(feature) {
    return new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(33,105,104, 0.5)' // Fill color (green with 50% opacity)
        }),
        stroke: new ol.style.Stroke({
            color: 'rgba(33,105,104, 0.5)', // Outline color (green)
            width: 5 // Outline width (5 pixels)
        })
    });
};

// New vector layer with the specified style function
var vector = new ol.layer.Vector({
    name: 'coffeFarm',
    source: new ol.source.Vector(),
    style: styleFunction // Set the style function for the layer
});

// Add the vector layer to the map
map.addLayer(vector);


// Draw interaction
var draw = new ol.interaction.GeolocationDraw({
    source: vector.getSource(),
    zoom: 18,
    minAccuracy: 1000 //10000
});

map.addInteraction(draw);

// Hard code the drawing type to "Polygon"
draw.set("type", "Polygon"); //other values: "Point" and "LineString"

// Hard code followTrack to true
draw.setFollowTrack(true); //other values: false, auto, position, visible


draw.on("tracking", function (e) {
    $("#accuracy").width((e.geolocation.getAccuracy()));
    //gauge.val(e.geolocation.getAccuracy());
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

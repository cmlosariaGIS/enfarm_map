document.addEventListener('DOMContentLoaded', function () {
    // Hide buttons on map load
    var buttons = document.querySelectorAll('#gpsDrawFarmStartBtn, #gpsDrawFarmPauseBtn, #gpsDrawFarmStopBtn');
    buttons.forEach(function (button) {
        button.style.display = 'none';
    });

    // Function to handle the click event on the first button
    document.getElementById('gpsDrawFarmBtn').addEventListener('click', function () {
        // Toggle visibility of other buttons
        buttons.forEach(function (button) {
            button.style.display = (button.style.display === 'none') ? 'block' : 'none';
        });
    });
});

// New vector layer
var vector = new ol.layer.Vector({
    name: 'Vecteur',
    source: new ol.source.Vector()
});
map.addLayer(vector);

// Draw interaction
var draw = new ol.interaction.GeolocationDraw({
    source: vector.getSource(),
    zoom: 20,
    minAccuracy: 10000
});
map.addInteraction(draw);

// Hard code the drawing type to "Polygon"
draw.set("type", "Polygon");

// Hard code followTrack to true
draw.setFollowTrack(true);

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

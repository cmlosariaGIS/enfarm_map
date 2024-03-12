////////// <----- START ADD ENFARM SENSORS BUTTON -----> \\\\\\\\\\

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
    //"locationBtn",
    "perspectiveBtn",
    //"angle",
    "elevProfileBtn",
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
        src: 'https://i.ibb.co/gWyRjHP/icons8-pin-96-xxhdpi.png', //Enfarm Sensor Icon
        anchor: [0.5, 1],
        scale: 0.4,
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
    infoIcon.style.fontSize = "50px";
    floatingMessage.appendChild(infoIcon);
    floatingMessage.innerHTML += "Chạm vào bản đồ để thêm/các cảm biến trang trại"; // "Tap the map to add the enfarm sensor/s"
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
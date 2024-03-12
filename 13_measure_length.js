///// <----- MEASURE LENGTH BUTTON FUNCTION -----> \\\\\

let drawLength;
let measureLengthSource;
let measureLengthTooltipElement;
let measureLengthTooltip;
let sketchLength;
let floatingMessageTimeoutId;

function startMeasurementLength() {
    const measureLengthBtn = document.getElementById("measureLengthBtn");
    const measureLengthBtnIcon = measureLengthBtn.querySelector("i");
    const floatingTitle = document.querySelector(".measuringLengthfloatingTitle");

    function toggleButtonVisibility(isActive) {
        const buttonsToHide = [
            "searchBar",
            "searchBtn",
            "searchButton",
            "basemapBtn",
            "measureAreaBtn",
            "sketchFarmBtn",
            "addSensorBtn",
            "tutorialBtn",
            "windyMapBtn",
            //"locationBtn",
            "resetBtn",
            "perspectiveBtn",
            "elevProfileBtn",
        ];
        const displayValue = isActive ? "none" : "block";
        buttonsToHide.forEach((btnId) => {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.style.display = displayValue;
            } else {
                console.warn(`Button with ID "${btnId}" not found.`);
            }
        });
    }

    if (measureLengthBtn.classList.contains("active")) {
        measureLengthBtn.classList.remove("active");
        map.removeInteraction(drawLength);
        map.removeOverlay(measureLengthTooltip);
        measureLengthTooltipElement = null;
        measureLengthSource.clear();

        measureLengthBtnIcon.textContent = "straighten";
        measureLengthBtn.style.backgroundColor = "#ffffff";
        measureLengthBtnIcon.style.color = "#515151";

        const finishMeasuringLength = document.getElementById("finishMeasuringLength");
        if (finishMeasuringLength) {
            finishMeasuringLength.classList.add("hidden");
        }

        clearTimeout(floatingMessageTimeoutId);
        const floatingMessage = document.getElementById("floatingMessage");
        if (floatingMessage && floatingMessage.parentNode) {
            floatingMessage.parentNode.removeChild(floatingMessage);
        }

        if (floatingTitle) {
            floatingTitle.style.display = 'none';
        }

        toggleButtonVisibility(false);
    } else {
        measureLengthBtn.classList.add("active");
        measureLengthSource = new ol.source.Vector();
        map.addLayer(
            new ol.layer.Vector({
                source: measureLengthSource,
                style: new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: "#386c34",
                        width: 8,
                    }),
                }),
            })
        );
        createMeasureLengthTooltip();
        addLengthInteraction();

        measureLengthBtnIcon.textContent = "close";
        measureLengthBtn.style.backgroundColor = "#FF6666";
        measureLengthBtnIcon.style.color = "#ffffff";

        const floatingMessage = document.createElement("div");
        floatingMessage.className = "floating-message";
        floatingMessage.id = "floatingMessage";
        const infoIcon = document.createElement("i");
        infoIcon.className = "material-icons";
        infoIcon.textContent = "touch_app";
        infoIcon.style.fontSize = "50px";
        floatingMessage.appendChild(infoIcon);
        floatingMessage.innerHTML += "Nhấn vào bản đồ để bắt đầu đo diện tích"; //Tap the map to start measuring area
        map.getViewport().appendChild(floatingMessage);

        setTimeout(function () {
            if (floatingMessage.parentNode === map.getViewport()) {
                map.getViewport().removeChild(floatingMessage);
            }
        }, 3000);

        if (floatingTitle) {
            floatingTitle.style.display = 'flex';
        }

        toggleButtonVisibility(true);
    }
}

let drawLengthStartListener;
let drawLengthEndListener;

function addLengthInteraction() {
    drawLength = new ol.interaction.Draw({
        source: measureLengthSource,
        type: "LineString",
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: "#386c34",
                width: 8,
            }),
            image: new ol.style.Circle({
                radius: 18,
                fill: new ol.style.Fill({
                    color: "#386c34",
                }),
                stroke: new ol.style.Stroke({
                    color: "#ffffff",
                    width: 9,
                }),
            }),
        }),
    });
    map.addInteraction(drawLength);

    // Declare a variable to count how many points have been clicked
    let clickCount = 0;

    drawLength.on("drawstart", function (evt) {
        const feature = evt.feature;
        sketchLength = feature;

        // Reset click count
        clickCount = 0;

        // Add a vertex listener to count clicks
        feature.getGeometry().on("change", function (event) {
            clickCount++;

            // Check if the user has clicked 2 times
            if (clickCount === 2) {
                // Show the finish button
                const finishMeasuringLength = document.getElementById("finishMeasuringLength");
                if (finishMeasuringLength) {
                    finishMeasuringLength.classList.remove("hidden");
                }
            }
        });
    });

    // Add event listener to the finish button
    document.getElementById("finishMeasuringLength").addEventListener("click", function () {
        drawLength.finishDrawing();

        // Hide the floating title
        const measuringLengthFloatingTitle = document.querySelector('.measuringLengthfloatingTitle');
        if (measuringLengthFloatingTitle) {
            measuringLengthFloatingTitle.style.display = "none";
        }
    });


    drawLengthEndListener = drawLength.on("drawend", function (evt) {
        const feature = evt.feature;
        measureLengthSource.removeFeature(sketchLength);
        sketchLength = null;
        measureLengthTooltipElement.className = "ol-tooltip ol-tooltip-static";
        measureLengthTooltip.setOffset([0, -7]);

        const geom = feature.getGeometry();
        const length = getLength(geom);

        let measurement = length.toFixed(2);
        let measurementUnit = "m";

        if (length > 1000) {
            measurement = (length / 1000).toFixed(2); // Convert to kilometers
            measurementUnit = "km";
        }

        measureLengthTooltipElement.innerHTML = `<div style="display: flex; align-items: center;"><i class="material-icons" style="margin-right: 0px;">straighten</i><strong style="margin-left: 3px;">${measurement}${measurementUnit}</strong></div>`;
        //Độ dài: 

        // Add a white background to the measurement size label
        measureLengthTooltipElement.style.backgroundColor = "#ffffff";
        measureLengthTooltipElement.style.padding = "10px 15px";
        measureLengthTooltipElement.style.borderRadius = "40px";
        measureLengthTooltipElement.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.4)";

        // Change the font color to Segoe UI (#515151) and set the font size to 35px
        measureLengthTooltipElement.style.color = "#515151";
        measureLengthTooltipElement.style.fontFamily = "Segoe UI";
        measureLengthTooltipElement.style.fontSize = "15px";

        // Position the measurement tooltip element in the middle of the map
        measureLengthTooltip.setPosition(geom.getLastCoordinate());

        map.removeInteraction(drawLength);
        map.un("pointermove", pointerMoveHandler);

        // Hide the finish button
        const finishMeasuringLength = document.getElementById("finishMeasuringLength");
        if (finishMeasuringLength) {
            finishMeasuringLength.classList.add("hidden");
        }
    });
}

let helpMeasureLengthTooltipElement;
let helpMeasureLengthTooltip;

function createHelpLengthTooltip() {
    if (helpMeasureLengthTooltipElement) {
        helpMeasureLengthTooltipElement.parentNode.removeChild(helpMeasureLengthTooltipElement);
    }
    helpMeasureLengthTooltipElement = document.createElement("div");
    helpMeasureLengthTooltipElement.className = "ol-tooltip hidden";
    helpMeasureLengthTooltip = new ol.Overlay({
        element: helpMeasureLengthTooltipElement,
        offset: [15, 0],
        positioning: "center-left",
    });
    map.addOverlay(helpMeasureLengthTooltip);
}

function createMeasureLengthTooltip() {
    if (measureLengthTooltipElement) {
        measureLengthTooltipElement.parentNode.removeChild(measureLengthTooltipElement);
    }
    measureLengthTooltipElement = document.createElement("div");
    measureLengthTooltipElement.className = "ol-tooltip ol-tooltip-measure";
    measureLengthTooltip = new ol.Overlay({
        element: measureLengthTooltipElement,
        offset: [0, -15],
        positioning: "bottom-center",
    });
    map.addOverlay(measureLengthTooltip);
}

function getLength(line) {
    const length = line.getLength();
    return length;
}

function deactivateMeasurementLength() {
    const measureLengthBtn = document.getElementById("measureLengthBtn");
    if (measureLengthBtn.classList.contains("active")) {
        // Set measureLengthBtn to inactive state
        measureLengthBtn.classList.remove("active");

        // Change the icon back to the "straighten" icon
        const measureLengthBtnIcon = measureLengthBtn.querySelector("i");
        measureLengthBtnIcon.textContent = "straighten";

        // Reset the background color to white
        measureLengthBtn.style.backgroundColor = "#ffffff";

        // Change the icon color to black
        measureLengthBtnIcon.style.color = "#515151";

        // Remove interactions
        if (drawLength) {
            map.removeInteraction(drawLength);
            drawLength = null;
        }

        // Remove listeners
        if (drawLengthStartListener) {
            ol.Observable.unByKey(drawLengthStartListener);
            drawLengthStartListener = null;
        }
        if (drawLengthEndListener) {
            ol.Observable.unByKey(drawLengthEndListener);
            drawLengthEndListener = null;
        }

        // Clear timeout and hide the floating message immediately
        clearTimeout(floatingMessageTimeoutId);
        const floatingMessage = document.getElementById("floatingMessage");
        if (floatingMessage && floatingMessage.parentNode) {
            floatingMessage.parentNode.removeChild(floatingMessage);
        }

        // Show the hidden buttons
        const buttonsToHide = [
            "searchBar",
            "searchBtn",
            "basemapBtn",
            "measureAreaBtn",
            "sketchFarmBtn",
            "addSensorBtn",
            "tutorialBtn",
            "windyMapBtn",
            "resetBtn",
            "locationBtn",
            "perspectiveBtn",
            "elevProfileBtn"
        ];
        buttonsToHide.forEach((btnId) => {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.style.display = "block";
            }
        });

        // Show the finish button
        const finishMeasuringLength = document.getElementById("finishMeasuringLength");
        if (finishMeasuringLength) {
            finishMeasuringLength.classList.add("hidden");
        }
    }
}

document.getElementById("measureAreaBtn").addEventListener("click", deactivateMeasurementLength);
document.getElementById("sketchFarmBtn").addEventListener("click", deactivateMeasurementLength);
document.getElementById("addSensorBtn").addEventListener("click", deactivateMeasurementLength);


// Add event listener to the finish button
document.getElementById("finishMeasuringLength").addEventListener("click", function () {
    drawLength.finishDrawing();
    // Show the hidden buttons after finishing the sketch
    const buttonsToHide = [
        "searchBar",
        "searchBtn",
        "basemapBtn",
        "measureAreaBtn",
        "sketchFarmBtn",
        "addSensorBtn",
        "tutorialBtn",
        "windyMapBtn",
        "resetBtn",
        "locationBtn",
        "perspectiveBtn",
        "elevProfileBtn",
    ];
    buttonsToHide.forEach((btnId) => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.style.display = "block";
        }
    });
});
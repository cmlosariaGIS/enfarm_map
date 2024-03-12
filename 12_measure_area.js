///// <----- MEASURE AREA BUTTON FUNCTION -----> \\\\\

let drawArea;
let measureAreaSource;
let measureAreaTooltipElement;
let measureAreaTooltip;
let sketchArea;
let lineTooltips = [];
let floatingMessageAreaTimeoutId;



function startMeasurementArea() {
    // Get a reference to the floating title
    const measureAreaFloatingTitle = document.querySelector('.measuringAreafloatingTitle');
    const measureAreaBtn = document.getElementById("measureAreaBtn");
    const measureAreaBtnIcon = measureAreaBtn.querySelector("i");
    const isActive = measureAreaBtn.classList.contains("active");

    // Buttons to hide
    const buttonsToHide = [
        "searchBar", 
        "searchBtn", 
        "basemapBtn", 
        "measureLengthBtn",
        "sketchFarmBtn", 
        "addSensorBtn", 
        "tutorialBtn", 
        "windyMapBtn",
        "resetBtn", 
        //"locationBtn", 
        "perspectiveBtn", 
        "elevProfileBtn"
    ];

    if (isActive) {
        // Disable measuring area
        measureAreaBtn.classList.remove("active");
        map.removeInteraction(drawArea);
        map.removeOverlay(measureAreaTooltip);
        measureAreaTooltipElement = null;
        measureAreaSource.clear();
        clearLineTooltips(); // Clear length tooltips

        // Change the icon back to the "square_foot" icon
        measureAreaBtnIcon.textContent = "square_foot";
        // Reset the background color to white
        measureAreaBtn.style.backgroundColor = "#ffffff";
        // Change the icon color to black
        measureAreaBtnIcon.style.color = "#515151";

        // Clear timeout and hide the floating message immediately
        clearTimeout(floatingMessageAreaTimeoutId);
        const floatingMessage = document.getElementById("floatingMessageArea");
        if (floatingMessage && floatingMessage.parentNode) {
            floatingMessage.parentNode.removeChild(floatingMessage);
        }

        // Hide the finish drawing button
        const finishMeasuringArea = document.getElementById("finishMeasuringArea");
        if (finishMeasuringArea) {
            finishMeasuringArea.classList.add("hidden");
        }

        // Show the hidden buttons
        buttonsToHide.forEach((btnId) => {
            const btn = document.getElementById(btnId);
            if (btn) btn.style.display = "block";
        });

        // Hide the floating title
        measureAreaFloatingTitle.style.display = "none";
    } else {
        // Enable measuring area
        measureAreaBtn.classList.add("active");
        measureAreaSource = new ol.source.Vector();
        map.addLayer(
            new ol.layer.Vector({
                source: measureAreaSource,
                style: new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: "rgba(247, 200, 21, 0.8)", // 80% transparent fill
                    }),
                    stroke: new ol.style.Stroke({
                        color: "#F7C815",
                        width: 10,
                    }),
                    image: new ol.style.Circle({
                        radius: 7,
                        fill: new ol.style.Fill({
                            color: "#F7C815",
                        }),
                    }),
                }),
            })
        );
        createMeasureAreaTooltip();
        addAreaInteraction();

        // Change the icon to the "close" icon
        measureAreaBtnIcon.textContent = "close";
        // Change the background color to dark red
        measureAreaBtn.style.backgroundColor = "#FF6666";
        // Change the icon color to white
        measureAreaBtnIcon.style.color = "#ffffff";

        // Add floating message
        const floatingMessage = document.createElement("div");
        floatingMessage.className = "floating-message";
        floatingMessage.id = "floatingMessageArea";
        const infoIcon = document.createElement("i");
        infoIcon.className = "material-icons";
        infoIcon.textContent = "touch_app";
        infoIcon.style.fontSize = "50px";
        floatingMessage.appendChild(infoIcon);
        floatingMessage.innerHTML += "  Chạm vào màn hình để bắt đầu đo"; // "Tap the screen to start measuring"
        map.getViewport().appendChild(floatingMessage);

        // Remove floating message after 05 seconds
        floatingMessageAreaTimeoutId = setTimeout(function () {
            map.getViewport().removeChild(floatingMessage);
        }, 3000);

        // Hide the specified buttons
        buttonsToHide.forEach((btnId) => {
            const btn = document.getElementById(btnId);
            if (btn) btn.style.display = "none";
        });

        // Show the floating title
        measureAreaFloatingTitle.style.display = "flex";
    }

    // Show the hidden buttons when the drawing is finished
    const finishMeasuringArea = document.getElementById("finishMeasuringArea");
    if (finishMeasuringArea) {
        finishMeasuringArea.addEventListener("click", () => {
            buttonsToHide.forEach((btnId) => {
                const btn = document.getElementById(btnId);
                if (btn) btn.style.display = "block";
            });

            // Hide the floating title
            measureAreaFloatingTitle.style.display = "none";
        });
    }
}


let drawAreaStartListener;
let drawAreaEndListener;

function addAreaInteraction() {
    drawArea = new ol.interaction.Draw({
        source: measureAreaSource,
        type: "Polygon",
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: "rgba(255, 255, 255, 0.2)",
            }),
            stroke: new ol.style.Stroke({
                color: "#F7C815",
                width: 10,
            }),
            image: new ol.style.Circle({
                radius: 18,
                fill: new ol.style.Fill({
                    color: "#F7C815",
                }),
                stroke: new ol.style.Stroke({
                    color: "#ffffff",
                    width: 9,
                }),
            }),
        }),
    });
    map.addInteraction(drawArea);

    // Declare a variable to count how many points have been clicked
    let clickCount = 0;

    drawAreaStartListener = drawArea.on("drawstart", function (evt) {
        const feature = evt.feature;
        sketchArea = feature;
        createHelpAreaTooltip();
        map.on("pointermove", pointerMoveHandler);

        // Reset click count
        clickCount = 0;

        // Add a vertex listener to count clicks
        feature.getGeometry().on("change", function (event) {
            clickCount++;

            // Check if the user has clicked 3 times
            if (clickCount === 3) {
                // Show the finish button
                const finishMeasuringArea = document.getElementById("finishMeasuringArea");
                if (finishMeasuringArea) {
                    finishMeasuringArea.classList.remove("hidden");
                }
            }
        });
    });

    document.getElementById('finishMeasuringArea').addEventListener('click', function () {
        drawArea.finishDrawing();
    });

    drawAreaEndListener = drawArea.on("drawend", function (evt) {
        const feature = evt.feature;
        measureAreaSource.removeFeature(sketchArea);
        sketchArea = null;
        measureAreaTooltipElement.className = "ol-tooltip ol-tooltip-static";
        measureAreaTooltip.setOffset([0, -7]);

        const geom = feature.getGeometry();
        const extent = geom.getExtent();
        const center = ol.extent.getCenter(extent);
        const area = getArea(geom);

        let measurement;
        let measurementUnit;

        if (area > 1000) {
            measurement = (area / 10000).toFixed(2); // Convert to hectares (ha)
            measurementUnit = "ha";
        } else {
            measurement = area.toFixed(2);
            measurementUnit = "m²";
        }

        measureAreaTooltipElement.innerHTML = `<div style="display: flex; align-items: center;"><i class="material-icons" style="margin-right: 0px;">square_foot</i><span></span><strong style="margin-left: 0px;">${measurement}${measurementUnit}</strong></div>`; //Khu vực:



        // Hide the finish button
        const finishMeasuringArea = document.getElementById("finishMeasuringArea");
        if (finishMeasuringArea) {
            finishMeasuringArea.classList.add("hidden");
        }

        // Add a white background to the measurement size label
        measureAreaTooltipElement.style.backgroundColor = "#ffffff";
        measureAreaTooltipElement.style.padding = "10px 15px";
        measureAreaTooltipElement.style.borderRadius = "25px";
        measureAreaTooltipElement.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.4)";
        measureAreaTooltipElement.style.color = "#515151";
        measureAreaTooltipElement.style.fontFamily = "Segoe UI";
        measureAreaTooltipElement.style.fontSize = "15px";

        // Position the measurement tooltip element in the middle of the map
        measureAreaTooltip.setPosition(center);

        // Create tooltips for each edge of the polygon
        const coordinates = geom.getCoordinates()[0];
        const numEdges = coordinates.length;
        clearLineTooltips();
        for (let i = 0; i < numEdges - 1; i++) {
            const start = coordinates[i];
            const end = coordinates[i + 1];
            const midpoint = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2];
            const length = ol.sphere.getLength(new ol.geom.LineString([start, end]));

            const lineTooltip = createLineTooltip(length, midpoint, start, end);
            lineTooltips.push(lineTooltip);
            map.addOverlay(lineTooltip);
        }

        map.removeInteraction(drawArea);
        map.un("pointermove", pointerMoveHandler);
    });

    drawAreaStartListener = drawArea.on("drawstart", function (evt) {
        const feature = evt.feature;
        sketchArea = feature;
        createHelpAreaTooltip();
        map.on("pointermove", pointerMoveHandler);
    });
}

let helpMeasureAreaTooltipElement;
let helpMeasureAreaTooltip;

function createHelpAreaTooltip() {
    if (helpMeasureAreaTooltipElement) {
        helpMeasureAreaTooltipElement.parentNode.removeChild(helpMeasureAreaTooltipElement);
    }
    helpMeasureAreaTooltipElement = document.createElement("div");
    helpMeasureAreaTooltipElement.className = "ol-tooltip hidden";
    helpMeasureAreaTooltip = new ol.Overlay({
        element: helpMeasureAreaTooltipElement,
        offset: [15, 0],
        positioning: "center-left",
    });
    map.addOverlay(helpMeasureAreaTooltip);
}

function createMeasureAreaTooltip() {
    if (measureAreaTooltipElement) {
        measureAreaTooltipElement.parentNode.removeChild(measureAreaTooltipElement);
    }
    measureAreaTooltipElement = document.createElement("div");
    measureAreaTooltipElement.className = "ol-tooltip ol-tooltip-measure";
    measureAreaTooltip = new ol.Overlay({
        element: measureAreaTooltipElement,
        offset: [100, 0],
        positioning: "bottom-center",
    });
    map.addOverlay(measureAreaTooltip);
}

const continuePolygonMsg = "Click to continue drawing the polygon";

function pointerMoveHandler(evt) {
    if (evt.dragging) {
        return;
    }
    let helpMsg = "Click to continue drawing the polygon";
    if (sketchArea) {
        const geom = sketchArea.getGeometry();
        if (geom instanceof ol.geom.Polygon) {
            helpMsg = continuePolygonMsg;
        }
    }
}

function getArea(polygon) {
    const area = polygon.getArea();
    return area;
}

function createLineTooltip(length, midpoint, start, end) {
    const lineTooltipElement = document.createElement("div");
    lineTooltipElement.className = "ol-tooltip ol-tooltip-line";

    let measurement;
    let measurementUnit;

    if (length > 1000) {
        measurement = (length / 1000).toFixed(2); // Convert to kilometers
        measurementUnit = "km";
    } else {
        measurement = length.toFixed(2);
        measurementUnit = "m";
    }

    lineTooltipElement.innerHTML = `${measurement}${measurementUnit}`; //Chiều dài: 

    // Add a white background to the line tooltip
    lineTooltipElement.style.backgroundColor = "#ffffff";
    lineTooltipElement.style.padding = "10px 20px";
    lineTooltipElement.style.borderRadius = "40px";
    lineTooltipElement.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.4)";

    // Change the font color to Segoe UI (#515151) and set the font size to 12px
    lineTooltipElement.style.color = "#515151";
    lineTooltipElement.style.fontFamily = "Segoe UI";
    lineTooltipElement.style.fontSize = "14px";

    const lineTooltip = new ol.Overlay({
        element: lineTooltipElement,
        offset: [0, 0],
        position: midpoint,
        positioning: "center-center",
    });

    lineTooltipElement.addEventListener("mouseover", function () {
        lineTooltip.setPosition(midpoint);
    });

    lineTooltipElement.addEventListener("mouseout", function () {
        lineTooltip.setPosition(midpoint);
    });

    lineTooltipElement.addEventListener("click", function () {
        const lineCoordinates = [start, end];
        const lineString = new ol.geom.LineString(lineCoordinates);
        const lineFeature = new ol.Feature(lineString);
        measureAreaSource.addFeature(lineFeature);
        lineTooltips.push(createLineTooltip(length, midpoint, start, end));
        map.addOverlay(lineTooltips[lineTooltips.length - 1]);
    });

    return lineTooltip;
}

function clearLineTooltips() {
    lineTooltips.forEach(function (tooltip) {
        map.removeOverlay(tooltip);
    });
    lineTooltips = [];
}

// Function to clear length tooltips
function clearLengthTooltips() {
    clearLineTooltips();
}


// Handle clicks on the measureLengthBtn and sketchFarmBtn buttons
document.getElementById("measureLengthBtn").addEventListener("click", deactivateMeasurementArea);
document.getElementById("sketchFarmBtn").addEventListener("click", deactivateMeasurementArea);
document.getElementById("addSensorBtn").addEventListener("click", deactivateMeasurementArea);

function deactivateMeasurementArea() {
    const measureAreaBtn = document.getElementById("measureAreaBtn");
    if (measureAreaBtn.classList.contains("active")) {
        // Set measureAreaBtn to inactive state
        measureAreaBtn.classList.remove("active");

        // Change the icon back to the "square_foot" icon
        const measureAreaBtnIcon = measureAreaBtn.querySelector("i");
        measureAreaBtnIcon.textContent = "square_foot";

        // Reset the background color to white
        measureAreaBtn.style.backgroundColor = "#ffffff";

        // Change the icon color to black
        measureAreaBtnIcon.style.color = "#515151";

        // Remove interactions
        if (drawArea) {
            map.removeInteraction(drawArea);
            drawArea = null;
        }

        // Remove listeners
        if (drawAreaStartListener) {
            ol.Observable.unByKey(drawAreaStartListener);
            drawAreaStartListener = null;
        }
        if (drawAreaEndListener) {
            ol.Observable.unByKey(drawAreaEndListener);
            drawAreaEndListener = null;
        }

        // Clear timeout and hide the floating message immediately
        clearTimeout(floatingMessageAreaTimeoutId);
        const floatingMessage = document.getElementById("floatingMessageArea");
        if (floatingMessage && floatingMessage.parentNode) {
            floatingMessage.parentNode.removeChild(floatingMessage);
        }

        // Hide the finish drawing button
        const finishMeasuringArea = document.getElementById("finishMeasuringArea");
        if (finishMeasuringArea) {
            finishMeasuringArea.classList.add("hidden");
        }

        // Note: We are not clearing the source or removing the overlay, so the drawn polygons and tooltips should remain visible.
    }
}
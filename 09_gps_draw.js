
// Keep track of the added area size labels
var gpsAreaSizeLabels = {};


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

    // Flag to track if drawing process has started
    var drawingStarted = false;
    var startTime; // Variable to store the start time

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

        // Set drawingStarted flag to true when the user starts drawing
        drawingStarted = true;
        // Record the start time
        startTime = new Date().getTime();
    });

    stopBtn.addEventListener('click', function () {
        // Check if stop button is pressed within 5 seconds of pressing start button
        var timeoutDuration = 5000; // 5 seconds
        var now = new Date().getTime();
        if (drawingStarted && (now - startTime) < timeoutDuration) {
            startBtn.style.display = 'none';
            pauseBtn.style.display = 'none';
            stopBtn.style.display = 'none';
            saveBtn.style.display = 'none';
            discardBtn.style.display = 'none';

            // Clear the temporary center coordinates array
            tempCenterCoordinates = [];
            // Remove the last drawn feature if exists
            if (lastDrawnFeature) {
                vector.getSource().removeFeature(lastDrawnFeature);
                lastDrawnFeature = null;
            }
        } else {
            startBtn.style.display = 'none';
            pauseBtn.style.display = 'block';
            stopBtn.style.display = 'block';

            // Check if any features have been drawn
            var features = vector.getSource().getFeatures();
            if (features.length > 0) {
                // Show save and discard buttons if features have been drawn
                saveBtn.style.display = 'block';
                discardBtn.style.display = 'block';

                // Highlight the latest drawn polygon
                var latestDrawnPolygon = features[features.length - 1];
                latestDrawnPolygon.setStyle(highlightedPolygonStyle);
            } else {
                // Hide save and discard buttons if no features have been drawn
                saveBtn.style.display = 'none';
                discardBtn.style.display = 'none';
            }
        }
    });


// Event listeners for "Save" button
function handleSaveButtonClick() {
    // Call the function to save center coordinates
    saveCenterCoordinates();
    // Call the function to save the drawn polygons
    gpsDrawSave();

    // Remove the highlight on the farm polygon when the saveBtn is clicked
    var features = vector.getSource().getFeatures();
    var latestDrawnPolygon = features[features.length - 1];
    latestDrawnPolygon.setStyle(styleFunction); // Reset style to original

    // Add area label to the saved polygon
    var areaSquareMeters = calculatePolygonArea(latestDrawnPolygon.getGeometry().getCoordinates()[0]);
    var areaHectares = areaSquareMeters / 10000;
    var labelCoordinates = latestDrawnPolygon.getGeometry().getInteriorPoint().getCoordinates();
    var treeRange = estimateTreeRange(areaHectares);
    var areaSize = areaSquareMeters < 1000 ? areaSquareMeters.toFixed(2) + ' sqm' : areaHectares.toFixed(2) + ' ha'; // Define areaSize here
    addAreaLabelToFeature(latestDrawnPolygon, areaSquareMeters, areaHectares, areaSize); // Pass areaSize to addAreaLabelToFeature function

    // Save area label and tree range to local storage
    saveAreaLabel(areaSize, labelCoordinates, treeRange);

    // Hide buttons after save
    startBtn.style.display = 'none';
    pauseBtn.style.display = 'none';
    stopBtn.style.display = 'none';
    saveBtn.style.display = 'none';
    discardBtn.style.display = 'none';
}

// Register event listeners for both "Save" button and saveBtn
document.getElementById('gpsDrawFarmSaveDrawBtn').addEventListener('click', handleSaveButtonClick);
saveBtn.addEventListener('click', handleSaveButtonClick);
ner('click', handleSaveButtonClick);
saveBtn.addEventListener('click', handleSaveButtonClick);












    discardBtn.addEventListener('click', function () {
        startBtn.style.display = 'none';
        pauseBtn.style.display = 'none';
        stopBtn.style.display = 'none';
        saveBtn.style.display = 'none';
        discardBtn.style.display = 'none';

        // Remove the last drawn feature if exists
        if (lastDrawnFeature) {
            vector.getSource().removeFeature(lastDrawnFeature);
            lastDrawnFeature = null;
        }

        // Clear the temporary center coordinates array
        tempCenterCoordinates = [];
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


// Initialize a vector layer for displaying point features
var coffeeFarmCentroid = new ol.layer.Vector({
    source: new ol.source.Vector(), // Creating a new source for the point layer
    name: 'coffeeFarmCentroid' // Renaming the layer
});
map.addLayer(coffeeFarmCentroid);



// Call the gpsDrawLoad function when the map loads
window.addEventListener('load', function () {
    gpsDrawLoad();

    // Pan to the drawn polygon if it exists, otherwise pan to user location
    if (vector.getSource().getFeatures().length > 0) {
        map.getView().fit(vector.getSource().getExtent(), { padding: [100, 100, 100, 100] });
    } else {
        // If no drawn polygon exists, pan to user location
        panToUserLocation();
    }
});




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
draw.on("drawend", function (e) {
    $(".follow").hide();

    // Log center coordinates after saving
    logCenterCoordinates();
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
        localStorage.setItem('gpsDrawnPolygons', JSON.stringify(geojson));

        // Log center coordinates after saving
        logCenterCoordinates();

        // Reset the map view to reflect changes
        var extent = vector.getSource().getExtent();
        map.getView().fit(extent, { padding: [200, 200, 200, 200] });

    } catch (error) {
        console.error('Error saving drawing:', error);
    }
}



// Array to temporarily store center coordinates
var tempCenterCoordinates = [];

// Function to log center coordinates
function logCenterCoordinates() {
    try {
        // Get the features from the vector source
        var features = vector.getSource().getFeatures();
        // Iterate through features and log center coordinates
        features.forEach(function (feature) {
            var geometry = feature.getGeometry();
            var center = ol.extent.getCenter(geometry.getExtent());
            console.log("Center coordinates:", center);
            tempCenterCoordinates.push(center); // Store in temporary array
            createPointFeature(center); // Create a point feature for each center coordinate
        });
    } catch (error) {
        console.error('Error logging center coordinates:', error);
    }
}

// Function to save center coordinates to storage
function saveCenterCoordinates() {
    try {
        // Get the existing center points or initialize an empty array
        var existingCenterPoints = JSON.parse(localStorage.getItem('gpsDrawnPolygonsCenterPoint')) || [];
        // Iterate through temporary center coordinates and save them
        tempCenterCoordinates.forEach(function (coordinates) {
            // Check if the coordinates already exist in the array
            var isDuplicate = existingCenterPoints.some(function (point) {
                return point[0] === coordinates[0] && point[1] === coordinates[1];
            });
            // Add the new center point to the array if it's not a duplicate
            if (!isDuplicate) {
                existingCenterPoints.push(coordinates);
            }
        });
        // Save the updated array to storage
        localStorage.setItem('gpsDrawnPolygonsCenterPoint', JSON.stringify(existingCenterPoints));
        // Clear the temporary array
        tempCenterCoordinates = [];
    } catch (error) {
        console.error('Error saving center coordinates:', error);
    }
}



// Function to create a point feature for each center coordinate
function createPointFeature(coordinates) {
    // Create a point feature for the centroid
    var pointFeature = new ol.Feature({
        geometry: new ol.geom.Point(coordinates)
    });

    // Add the point feature to the coffeeFarmCentroid layer source
    coffeeFarmCentroid.getSource().addFeature(pointFeature);
}


//////// Retrieve the saved GPS Drawing and Centerpoint \\\\\\\
// Define the gpsDrawLoad function
function gpsDrawLoad() {
    try {
        // Retrieve the saved GeoJSON string for polygons from localStorage
        const savedPolygonsGeoJSONString = localStorage.getItem('gpsDrawnPolygons');
        if (savedPolygonsGeoJSONString) {
            // Parse the GeoJSON string into features
            const geojsonFormat = new ol.format.GeoJSON();
            const polygonFeatures = geojsonFormat.readFeatures(JSON.parse(savedPolygonsGeoJSONString));
            // Clear existing polygon features and add the loaded features
            vector.getSource().clear();
            vector.getSource().addFeatures(polygonFeatures);
        }

        // Retrieve the saved GeoJSON string for center points from localStorage
        const savedCenterPointsGeoJSONString = localStorage.getItem('gpsDrawnPolygonsCenterPoint');
        if (savedCenterPointsGeoJSONString) {
            // Parse the GeoJSON string into features
            const centerPointsGeoJSON = JSON.parse(savedCenterPointsGeoJSONString);
            const centerPoints = centerPointsGeoJSON.map(function (point) {
                return new ol.Feature({
                    geometry: new ol.geom.Point(point)
                });
            });

            // Add the loaded center point features to the coffeeFarmCentroid layer source
            coffeeFarmCentroid.getSource().clear();
            coffeeFarmCentroid.getSource().addFeatures(centerPoints);
        }
    } catch (error) {
        console.error('Error loading drawing:', error);
    }
}

// Call the gpsDrawLoad function when the map loads
window.addEventListener('load', gpsDrawLoad);



// Define a variable to store the last drawn feature
var lastDrawnFeature = null;


// Funtion to discard GPS drawn polygon
// Define the gpsDrawDiscard function
function gpsDrawDiscard() {
    try {
        if (lastDrawnFeature) {
            // Remove the last drawn feature from the vector source
            vector.getSource().removeFeature(lastDrawnFeature);

            // Remove the corresponding point feature from the coffeeFarmCentroid layer
            coffeeFarmCentroid.getSource().getFeatures().forEach(function (pointFeature) {
                if (pointFeature.getGeometry().getCoordinates()[0] === lastDrawnFeature.getGeometry().getCoordinates()[0] &&
                    pointFeature.getGeometry().getCoordinates()[1] === lastDrawnFeature.getGeometry().getCoordinates()[1]) {
                    coffeeFarmCentroid.getSource().removeFeature(pointFeature);
                }
            });

            // Reset the last drawn feature variable
            lastDrawnFeature = null;

            // Refresh the map view
            map.getView().setCenter(map.getView().getCenter());
        }
    } catch (error) {
        console.error('Error discarding drawing:', error);
    }
}

// Event listener for when a feature is added by drawing
vector.getSource().on('addfeature', function (event) {
    // Update the last drawn feature when a new feature is added
    lastDrawnFeature = event.feature;
});




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
    selectedFeatures.forEach(function (feature) {
        feature.setStyle(highlightedPolygonStyle);
    });

    // Reset style for deselected features
    deselectedFeatures.forEach(function (feature) {
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

            // Remove the corresponding point feature from the coffeeFarmCentroid layer
            coffeeFarmCentroid.getSource().getFeatures().forEach(function (pointFeature) {
                if (pointFeature.getGeometry().getCoordinates()[0] === feature.getGeometry().getCoordinates()[0] &&
                    pointFeature.getGeometry().getCoordinates()[1] === feature.getGeometry().getCoordinates()[1]) {
                    coffeeFarmCentroid.getSource().removeFeature(pointFeature);
                }
            });

            // Remove the corresponding entry from browser storage
            removePolygonFromStorage(feature);

            // Refresh the map view
            map.getView().setCenter(map.getView().getCenter());
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



// Function to remove a polygon feature and its corresponding point feature from storage and map
function removePolygonFromStorage(feature) {
    try {
        // Remove the polygon feature from the vector layer source
        vector.getSource().removeFeature(feature);

        // Get the extent of the polygon feature
        var extent = feature.getGeometry().getExtent();

        // Remove the corresponding point feature from the coffeeFarmCentroid layer source
        var pointFeatures = coffeeFarmCentroid.getSource().getFeatures();
        pointFeatures.forEach(function (pointFeature) {
            if (ol.extent.containsCoordinate(extent, pointFeature.getGeometry().getCoordinates())) {
                coffeeFarmCentroid.getSource().removeFeature(pointFeature);
            }
        });

        // Remove the polygon's array entry from the GeoJSON object
        var geojsonString = localStorage.getItem('gpsDrawnPolygons');
        if (geojsonString) {
            var geojson = JSON.parse(geojsonString);
            geojson.features = geojson.features.filter(function (geojsonFeature) {
                // Check if the feature's coordinates match with the current polygon's coordinates
                return JSON.stringify(geojsonFeature.geometry.coordinates) !== JSON.stringify(feature.getGeometry().getCoordinates());
            });
            // Save updated GeoJSON string to localStorage
            localStorage.setItem('gpsDrawnPolygons', JSON.stringify(geojson));
        }

        // Remove the corresponding centroid point from the gpsDrawnPolygonsCenterPoint array
        var centerPointsString = localStorage.getItem('gpsDrawnPolygonsCenterPoint');
        if (centerPointsString) {
            var centerPoints = JSON.parse(centerPointsString);
            var centroid = ol.extent.getCenter(extent);
            var updatedCenterPoints = centerPoints.filter(function (point) {
                return !(point[0] === centroid[0] && point[1] === centroid[1]);
            });
            // Save updated center points array to localStorage
            localStorage.setItem('gpsDrawnPolygonsCenterPoint', JSON.stringify(updatedCenterPoints));
        }

        // Remove the corresponding centroid point from the coffeeFarmCentroid layer source
        var centroidFeatures = coffeeFarmCentroid.getSource().getFeatures();
        var centroidToRemove = centroidFeatures.find(function (centroidFeature) {
            return centroidFeature.getGeometry().getCoordinates()[0] === centroid[0] && centroidFeature.getGeometry().getCoordinates()[1] === centroid[1];
        });
        if (centroidToRemove) {
            coffeeFarmCentroid.getSource().removeFeature(centroidToRemove);
        }

    } catch (error) {
        console.error('Error removing polygon from storage:', error);
    }
}


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


// Function to add the area size label to the polygon feature
function addAreaLabelToFeature(feature, areaSquareMeters, areaHectares) {
    var areaSize = areaSquareMeters < 1000 ? areaSquareMeters.toFixed(2) + ' sqm' : areaHectares.toFixed(2) + ' ha';
    var treeRange = estimateTreeRange(areaHectares);

    // Create area size label overlay
    var areaSizeLabel = new ol.Overlay({
        id: JSON.stringify(feature.getGeometry().getCoordinates()), // Unique identifier for the overlay
        element: createLabelElement(areaSize, treeRange), // Create label element
        offset: [90, -40], // Offset to position the label
        positioning: 'top-right', // Position the label to the top right of the feature
        insertFirst: false // Ensure that the label is not inserted as the first child
    });

    // Set label position
    areaSizeLabel.setPosition(feature.getGeometry().getInteriorPoint().getCoordinates());

    // Add area size label overlay to the map
    map.addOverlay(areaSizeLabel);

    // Save reference to the area size label overlay
    gpsAreaSizeLabels[areaSizeLabel.getId()] = areaSizeLabel;
}



// Function to estimate the range of Arabica Coffee Trees for a given area
// Based on Helena Coffee's article (https://www.helenacoffee.vn/arabica-coffee-varieties/)
function estimateTreeRange(areaHectares) {
    var minTrees = Math.round(areaHectares * 3000);
    var maxTrees = Math.round(areaHectares * 5000);
    return [minTrees, maxTrees];
}



// Function to create label element with additional text that can be expanded
function createLabelElement(areaSize, treeRange) {
    var containerDiv = document.createElement('div');
    containerDiv.style.backgroundColor = 'white';
    containerDiv.style.padding = '6px';
    containerDiv.style.borderRadius = '20px';
    containerDiv.style.border = '1px solid #ccc';
    containerDiv.style.fontSize = '12px';
    containerDiv.style.fontFamily = 'Be Vietnam Pro';
    containerDiv.style.display = 'flex';
    containerDiv.style.alignItems = 'center';
    containerDiv.style.cursor = 'pointer'; // Change cursor to pointer to indicate it's clickable

    // Create icon span
    var iconSpan = document.createElement('span');
    iconSpan.className = 'material-symbols-outlined'; // Adjust the class name according to your icon library
    iconSpan.textContent = 'psychiatry'; // Adjust the icon content accordingly
    iconSpan.style.marginRight = '3px'; // Add some margin between the icon and the text
    iconSpan.style.color = '#515151';
    containerDiv.appendChild(iconSpan); // Append the icon before the label content

    var labelContent = document.createElement('span');
    labelContent.textContent = areaSize;
    labelContent.style.color = '#515151';

    containerDiv.appendChild(labelContent);

    containerDiv.addEventListener('click', function () {
        var additionalTextDiv = containerDiv.querySelector('.additional-text');
        if (additionalTextDiv.style.display === 'none') {
            additionalTextDiv.style.display = 'block';
        } else {
            additionalTextDiv.style.display = 'none';
        }
    });

    var additionalTextDiv = document.createElement('div');
    additionalTextDiv.classList.add('additional-text');
    additionalTextDiv.style.paddingTop = '5px';
    additionalTextDiv.style.padding = '6px';
    additionalTextDiv.style.fontSize = '10px';
    additionalTextDiv.style.color = '#666';
    additionalTextDiv.style.fontFamily = 'Be Vietnam Pro';
    additionalTextDiv.style.transition = 'max-height 0.3s ease-in-out';
    additionalTextDiv.style.backgroundColor = 'white';
    additionalTextDiv.style.display = 'none';

    var boldTreeRangeStart = document.createElement('b');
    boldTreeRangeStart.textContent = treeRange[0];

    var boldTreeRangeEnd = document.createElement('b');
    boldTreeRangeEnd.textContent = treeRange[1];

    var normalText1 = document.createElement('span');
    normalText1.textContent = "Approximate Arabica Coffee Trees for this plot is ";
    normalText1.style.fontWeight = 'normal';

    var normalText2 = document.createElement('span');
    normalText2.textContent = " to ";
    normalText2.style.fontWeight = 'normal';

    additionalTextDiv.appendChild(normalText1);
    additionalTextDiv.appendChild(boldTreeRangeStart);
    additionalTextDiv.appendChild(normalText2);
    additionalTextDiv.appendChild(boldTreeRangeEnd);

    containerDiv.appendChild(additionalTextDiv);

    return containerDiv;
}



// Function to save area size label and tree range to local storage
function saveAreaLabel(label, coordinates, treeRange) {
    // Retrieve existing stored labels or initialize an empty object
    var storedLabels = JSON.parse(localStorage.getItem('gpsDrawnPolygonsLabel')) || {};
    // Convert coordinates to string for use as object key
    var coordinatesKey = JSON.stringify(coordinates);
    // Add the label with coordinates and tree range to the object
    storedLabels[coordinatesKey] = { label: label, treeRange: treeRange };
    // Save the updated object to local storage
    localStorage.setItem('gpsDrawnPolygonsLabel', JSON.stringify(storedLabels));
}









///////////////////////// Function to pan to the user's location \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// Define the panToUserLocation function
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

// Call the function to pan to the user's location
panToUserLocation();


//test4







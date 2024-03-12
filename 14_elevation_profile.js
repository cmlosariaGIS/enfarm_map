////////// <----- FUNCTION TO GENERATE ELEVATION PROFILE -----> \\\\\\\\\\

// Hide the button on map load
document.getElementById('finishdrawLineElevProfile').style.display = 'none';

// Add a vector layer for drawing interactions
var drawLineElevProfile;
var isElevationProfileActive = false;
var clickCounter = 0;
var isDrawingActivated = false; // Variable to track if drawing is activated
var lengthContainer;

// Function to dismiss the length container
function dismissLengthContainer() {
    if (lengthContainer) {
        lengthContainer.style.display = 'none';
    }
}

// Function to open elevation container
function openElevationContainer() {
    var elevationContainer = document.getElementById('elevation-container');
    elevationContainer.classList.add('open');

    // Show animation container and hide chart canvas
    document.getElementById('animation-container').style.display = 'block';
    document.getElementById('chart').style.display = 'none';

    // Load Lottie animation
    var animationURL = "https://lottie.host/27210ff8-9561-4728-8db6-456664cba28d/yl19AQRU5T.json";
    var animationContainer = document.getElementById('animation-container');
    var animation = lottie.loadAnimation({
        container: animationContainer,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: animationURL
    });
}

// Function to dismiss the length container
function dismissLengthContainer() {
    if (lengthContainer) {
        lengthContainer.style.display = 'none';
    }
}


// Event listener to close the elevation container when the x close icon is clicked
document.getElementById('close-elevation-container').addEventListener('click', function () {
    var elevationContainer = document.getElementById('elevation-container');
    elevationContainer.classList.remove('open');
});

//Functions to show and hide the Elevation Profile Disclaimer Message
document.addEventListener('DOMContentLoaded', function () {
    // Get a reference to the info button
    const infoBtn = document.getElementById('info-ElevProfile-disclaimer-btn');

    // Get a reference to the elevation disclaimer element
    const elevationDisclaimer = document.getElementById('elevationToolDisclaimer');

    // Add event listener to the info button
    infoBtn.addEventListener('click', function () {
        // Show the elevation disclaimer element
        elevationDisclaimer.style.display = 'block';
    });

    // Get a reference to the close button
    const closeBtn = document.querySelector('.close-ElevProfile-disclaimer-btn');

    // Add event listener to the close button
    closeBtn.addEventListener('click', function () {
        // Hide the elevation disclaimer element
        elevationDisclaimer.style.display = 'none';
    });
});


// Handle draw end event when the finish button is clicked
document.getElementById('finishdrawLineElevProfile').addEventListener('click', function () {
    var draw = map.getInteractions().getArray().find(interaction => interaction instanceof ol.interaction.Draw);
    if (draw) {
        draw.finishDrawing();
    }

    // Get the extent of the drawn line
    if (drawLineElevProfile) {
        var extent = drawLineElevProfile.getSource().getExtent();

        // Get the height of the map and the elevation container
        var mapHeight = map.getSize()[1];
        var elevationContainerHeight = document.getElementById('elevation-container').offsetHeight;

        // Calculate the top margin to ensure the drawn line is in the top half of the screen
        var topMargin = 100; // Adjust this value to push it further towards the top

        // Calculate the center of the extent
        var center = ol.extent.getCenter(extent);

        // Adjust the center to move the extent to the top half of the screen
        center[1] -= (elevationContainerHeight + topMargin + 30) * map.getView().getResolution(); // Adjusted by adding 30

        // Set the new center and zoom to ensure the drawn line is visible
        map.getView().setCenter(center);
        //map.getView().fit(extent, { duration: 5000, easing: ol.easing.easeOut }); // Use easeOut easing function for smooth animation

        // Zoom in by adjusting the zoom level
        var currentZoom = map.getView().getZoom();
        map.getView().setZoom(currentZoom + 0.25); // Adjust the value as needed to zoom in

        // Show the elevation container
        var elevationContainer = document.getElementById('elevation-container');
        elevationContainer.classList.add('open');
    }

    // Hide or remove the button after it's clicked
    var button = document.getElementById('finishdrawLineElevProfile');
    button.style.display = 'none'; // Hide the button
    // Or you can remove the button from the DOM entirely:
    // button.parentNode.removeChild(button);
});


// Event listener for the map click event
map.on('click', function (event) {

    // Only start counting clicks when drawing is activated
    if (isDrawingActivated) {
        // Increment click counter
        clickCounter++;

        // If the click counter reaches 2, show the button
        if (clickCounter === 2) {
            document.getElementById('finishdrawLineElevProfile').style.display = 'block';
        }
    }
});

// Function to reset the click counter and hide the finishdrawLineElevProfile button
function resetClickCounter() {
    clickCounter = 0;
    document.getElementById('finishdrawLineElevProfile').style.display = 'none';
}


//Function to start adding points and line and fetch elevation data
// Event listener for the elevation profile button
document.getElementById('elevProfileBtn').addEventListener('click', function () {
    if (!isElevationProfileActive) {

        // Hide specified elements
        hideElements();

        // Event listener for the map click event (elevation point)
        map.on('click', function (event) {
            // Check if elevation profile is active
            if (isElevationProfileActive) {
                // Get the coordinate of the clicked point
                var clickedCoord = event.coordinate;

                // Convert coordinate from EPSG:3857 to EPSG:4326
                var lonLatCoord = ol.proj.transform(clickedCoord, 'EPSG:3857', 'EPSG:4326');

                // Fetch elevation data from Mapbox API
                var [lon, lat] = ol.proj.toLonLat(clickedCoord);
                var url = `https://api.mapbox.com/v4/mapbox.mapbox-terrain-v2/tilequery/${lon},${lat}.json?layers=contour&limit=50&access_token=pk.eyJ1IjoiY21sb3NhcmlhIiwiYSI6ImNsZGJ4cHp2ajAwMGszb3FmeXpxYmVpMHkifQ.3wsPFc9FkszxcH27eEq2dw`;

                //Fetches an array of elevation values from the API and get the max value
                fetch(url)
                    .then(response => response.json())
                    .then(data => {
                        // Extract elevation values from response
                        var elevations = data.features.map(feature => feature.properties.ele);

                        // Find the maximum elevation
                        var maxElevation = Math.max(...elevations);

                        // Log elevation value to console
                        console.log('Maximum Elevation:', maxElevation);
                        console.log('Clicked Coordinates:', lonLatCoord); // Logging clicked coordinates

                        // Create a point feature
                        var pointFeature = new ol.Feature({
                            geometry: new ol.geom.Point(clickedCoord)
                        });

                        // Create a circle style for the point
                        var circleStyle = new ol.style.Style({
                            image: new ol.style.Circle({
                                radius: 5,
                                fill: new ol.style.Fill({ color: '#ffcc33' }), // Set circle fill color
                                stroke: new ol.style.Stroke({ color: '#ffcc55', width: 10 }) // Set circle stroke
                            })
                        });

                        // Create a text style for the label
                        var textStyle = new ol.style.Text({
                            text: maxElevation + 'm',
                            fill: new ol.style.Fill({ color: '#fff' }), // Set text fill color to white
                            font: 'bold 12px Arial', // Apply bold font
                            backgroundFill: new ol.style.Fill({ color: 'rgba(0, 0, 0, 0.6)' }), // Add background pill
                            padding: [2, 4, 2, 4], // Add padding inside the pill
                            offsetX: 10, // Adjust the label's position relative to the point (move right)
                            offsetY: -10, // Adjust the label's position relative to the point (move up)
                            textAlign: 'left', // Align text to left
                            textBaseline: 'bottom' // Align text to bottom
                        });

                        // Apply the styles to the point feature
                        pointFeature.setStyle([circleStyle, new ol.style.Style({ text: textStyle })]);

                        // Add the point feature to the vector layer
                        drawLineElevProfile.getSource().addFeature(pointFeature);
                    })
                    .catch(error => {
                        console.error('Error fetching elevation data:', error);
                    });
            }
        });

        //Add floating message
        const floatingMessage = document.createElement("div");
        floatingMessage.className = "floating-message";
        floatingMessage.id = "floatingMessageArea";
        const infoIcon = document.createElement("i");
        infoIcon.className = "material-icons";
        infoIcon.textContent = "touch_app";
        infoIcon.style.fontSize = "50px";
        floatingMessage.appendChild(infoIcon);
        floatingMessage.innerHTML += "Nhấn vào bản đồ để vẽ một đường thẳng"; // "Tap the map to draw a straight line"
        map.getViewport().appendChild(floatingMessage);

        const floatingMessageAreaTimeoutId = setTimeout(function () {
            if (floatingMessage.parentNode === map.getViewport()) {
                map.getViewport().removeChild(floatingMessage);
            }
        }, 5000);


        // Function to hide specified elements
        function hideElements() {
            var elementsToHide = [
                "searchBar",
                "searchBtn",
                "material-icons",
                "basemapBtn",
                "measureAreaBtn",
                "measureLengthBtn",
                "sketchFarmBtn",
                "addSensorBtn",
                "tutorialBtn",
                "windyMapBtn",
                "resetBtn",
                //"locationBtn",
                "perspectiveBtn"
            ];

            elementsToHide.forEach(function (elementId) {
                var element = document.getElementById(elementId);
                if (element) {
                    element.style.display = 'none'; // Hide the element
                }
            });
        }

        // Enable draw elevation measure line interaction
        drawLineElevProfile = new ol.layer.Vector({
            source: new ol.source.Vector(),
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new ol.style.Stroke({
                    color: '#ffcc33',
                    width: 4
                }),
                image: new ol.style.Circle({
                    radius: 7,
                    fill: new ol.style.Fill({
                        color: '#ffcc33'
                    })
                })
            })
        });
        map.addLayer(drawLineElevProfile);

        // Add a draw interaction
        var draw = new ol.interaction.Draw({
            source: drawLineElevProfile.getSource(),
            type: 'LineString'
        });
        map.addInteraction(draw);

        // Create a vector layer to display the drawn line
        var drawnLineLayer = new ol.layer.Vector({
            source: new ol.source.Vector()
        });
        map.addLayer(drawnLineLayer);

        // Variable to store the drawn feature
        var drawnFeature;

        // Display floating title
        document.querySelector('.generateElevationProfilefloatingTitle').style.display = 'block';


        // Event listener for drawing start event
        draw.on('drawstart', function (event) {
            // Get the drawn feature
            drawnFeature = event.feature;


            //////////Start Mesasure Length Elevation Profile function\\\\\\\\\\
            // Create or update the elevProfileMeasureLength pill display container
            var lengthContainer = document.getElementById('elevProfileMeasureLength-container');
            if (!lengthContainer) {
                lengthContainer = document.createElement('div');
                lengthContainer.id = 'elevProfileMeasureLength-container';
                lengthContainer.style.position = 'absolute';
                lengthContainer.style.top = '-50px'; // Start from above the viewport
                lengthContainer.style.left = '50%';
                lengthContainer.style.transform = 'translateX(-50%)'; // Center horizontally
                lengthContainer.style.padding = '8px';
                lengthContainer.style.background = '#fff';
                lengthContainer.style.border = '1px solid #ccc';
                lengthContainer.style.borderRadius = '40px';
                lengthContainer.style.fontSize = '14px';
                lengthContainer.style.boxShadow = '0px 2px 4px rgba(0, 0, 0, 0.1)';
                document.body.appendChild(lengthContainer);

                // Apply slide-from-top animation
                lengthContainer.style.animation = 'slideFromTop 0.5s forwards';
            }

            // Function to update the length dynamically
            function updateLength() {
                // Calculate the length of the drawn line
                var drawnGeometry = drawnFeature.getGeometry();
                var length = ol.sphere.getLength(drawnGeometry, { projection: 'EPSG:3857' });

                // Convert to kilometers if length exceeds 1000 meters
                var lengthText = '';
                if (length > 1000) {
                    lengthText = (length / 1000).toFixed(2) + ' km';
                } else {
                    lengthText = length.toFixed(2) + ' m';
                }

                // Use the "straighten" icon as content
                lengthContainer.innerHTML = '<span class="material-icons-outlined" style="display: inline-block; vertical-align: middle; margin-right: 5px;">straighten</span>' + lengthText;
            }

            // Call the updateLength function initially and whenever the draw interaction changes
            draw.on('drawstart', updateLength);
            draw.on('drawend', updateLength);

            // Add CSS animation keyframes for slide-from-top effect
            var style = document.createElement('style');
            style.innerHTML = `
@keyframes slideFromTop {
from {
    top: -50px; /* Start position above the viewport */
    opacity: 0; /* Start invisible */
}
to {
    top: 50px; /* End position */
    opacity: 1; /* Fade in */
}
}
`;
            document.head.appendChild(style);

            // Update length dynamically based on mouse move or touch move or map click
            function updateLength() {
                // Calculate the length of the drawn line
                var drawnGeometry = drawnFeature.getGeometry();
                var length = ol.sphere.getLength(drawnGeometry, { projection: 'EPSG:3857' });

                // Convert to kilometers if length exceeds 1000 meters
                var lengthText = '';
                if (length > 1000) {
                    lengthText = (length / 1000).toFixed(2) + ' km';
                } else {
                    lengthText = length.toFixed(2) + ' m';
                }

                // Use the "straighten" icon as content
                lengthContainer.innerHTML = '<span class="material-icons-outlined" style="display: inline-block; vertical-align: middle; margin-right: 5px;">straighten</span>' + lengthText;
            }

            // Update length on mouse move (dynamically)
            map.on('pointermove', updateLength);

            // Update length on touch move (dynamically)
            map.on('touchmove', updateLength);

            // Update length on map click (dynamically)
            map.on('click', updateLength);

            // Event listener for drawing end event
            draw.on('drawend', function (event) {
                // Remove the dynamic length update listeners
                map.un('pointermove', updateLength);
                map.un('touchmove', updateLength);
                map.un('click', updateLength);
            });

        });

        ///////////////////End Mesasure Length Elevation Profile function\\\\\\\\\\\\\\\\\\\\\\\\\\

        // Event listener to handle drawing completion
        draw.on('drawend', function (event) {
            var lineString = event.feature.getGeometry();
            displayElevationProfile(lineString);
            openElevationContainer(); // Automatically open the elevation container when drawing is complete
        });

        // Set length container if not already set
        if (!lengthContainer) {
            lengthContainer = document.getElementById('elevProfileMeasureLength-container');
        }

        // Show length container
        if (lengthContainer) {
            lengthContainer.style.display = 'block';
        }

        // Change button icon to 'close'
        var btnIcon = document.getElementById('elevProfileBtn').querySelector('i.material-symbols-outlined');
        btnIcon.textContent = 'close';

        // Mark elevation profile button as active
        document.getElementById('elevProfileBtn').classList.add('active');
        isElevationProfileActive = true;

        // Set drawing activation flag to true
        isDrawingActivated = true;

        // Reset the click counter
        clickCounter = 0;

        // Hide or remove the button after it's clicked
        document.getElementById('finishdrawLineElevProfile').style.display = 'none';

    } else {
        // Disable draw interaction
        map.removeLayer(drawLineElevProfile);
        drawLineElevProfile = null;

        // Remove draw interaction
        map.getInteractions().forEach(function (interaction) {
            if (interaction instanceof ol.interaction.Draw) {
                map.removeInteraction(interaction);
            }
        });

        // Hide the chart container
        document.getElementById('chart').style.display = 'none';

        // Hide the elements related to min and max elevation text display
        document.getElementById('min-elevation').style.display = 'none';
        document.getElementById('max-elevation').style.display = 'none';

        // Show the previously hidden elements
        showElements(); // Add this line

        // Dismiss the elevation container
        var elevationContainer = document.getElementById('elevation-container');
        elevationContainer.classList.remove('open');

        // Hide floating title
        document.querySelector('.generateElevationProfilefloatingTitle').style.display = 'none';

        // Dismiss the length container
        dismissLengthContainer();

        function dismissLengthContainer() {
            var lengthContainer = document.getElementById('elevProfileMeasureLength-container');
            if (lengthContainer) {
                lengthContainer.style.display = 'none';
                lengthContainer.innerHTML = ''; // Clear the content of the container
                lengthContainer.remove(); // Remove the container from the DOM
            }
        }

        // Reset the click counter
        clickCounter = 0;

        // Display the finishdrawLineElevProfile button
        document.getElementById('finishdrawLineElevProfile').style.display = 'none';

        // Change button icon back to 'elevation'
        var btnIcon = document.getElementById('elevProfileBtn').querySelector('i.material-symbols-outlined');
        btnIcon.textContent = 'elevation';

        // Mark elevation profile button as inactive
        document.getElementById('elevProfileBtn').classList.remove('active');
        isElevationProfileActive = false;

        // Set drawing activation flag to false when deactivating elevation profile
        isDrawingActivated = false;

        // Clear timeout and hide the floating message immediately
        clearTimeout(floatingMessageAreaTimeoutId);
        const floatingMessage = document.getElementById("floatingMessageArea");
        if (floatingMessage && floatingMessage.parentNode) {
            floatingMessage.parentNode.removeChild(floatingMessage);
        }

        // Show hidden buttons when function is inactive
        showElements();
    }

});

// Define the showElements function
function showElements() {
    var elementsToShow = [
        "searchBar",
        "searchBtn",
        "material-icons",
        "basemapBtn",
        "measureAreaBtn",
        "measureLengthBtn",
        "sketchFarmBtn",
        "addSensorBtn",
        "tutorialBtn",
        "windyMapBtn",
        "resetBtn",
        "locationBtn",
        "perspectiveBtn"
    ];

    elementsToShow.forEach(function (elementId) {
        var element = document.getElementById(elementId);
        if (element) {
            element.style.display = ''; // Restore default display property
        }
    });
}

////////////Function to calculate distance between two points using Haversine formula\\\\\\\\\\
function calculateDistance(lat1, lon1, lat2, lon2) {
    const earthRadius = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c * 1000; // Convert to meters

    return distance;
}

////////////Function to fetch elevation values from MapBox\\\\\\\\\\\\\\
async function fetchElevationData(coordinates) {
    const elevationData = [];
    let totalDistance = 0; // Initialize total distance

    try {
        for (let i = 0; i < coordinates.length - 1; i++) {
            const startCoord = ol.proj.transform(coordinates[i], 'EPSG:3857', 'EPSG:4326');
            const endCoord = ol.proj.transform(coordinates[i + 1], 'EPSG:3857', 'EPSG:4326');

            const numPoints = 30; // Interpolate 30 points between each pair of coordinates to get more detailed elevation data

            for (let j = 0; j <= numPoints; j++) {
                const lon = startCoord[0] + (endCoord[0] - startCoord[0]) * (j / numPoints);
                const lat = startCoord[1] + (endCoord[1] - startCoord[1]) * (j / numPoints);

                const url = `https://api.mapbox.com/v4/mapbox.mapbox-terrain-v2/tilequery/${lon},${lat}.json?layers=contour&limit=50&access_token=pk.eyJ1IjoiY21sb3NhcmlhIiwiYSI6ImNsZGJ4cHp2ajAwMGszb3FmeXpxYmVpMHkifQ.3wsPFc9FkszxcH27eEq2dw`;
                const response = await fetch(url);


                //Fetches an array of elevation values from the API and get the max value
                if (response.ok) {
                    const data = await response.json();
                    if (data.features && data.features.length > 0) {
                        let maxElevation = -Infinity; // Initialize max elevation

                        for (let feature of data.features) {
                            maxElevation = Math.max(maxElevation, feature.properties.ele);
                        }

                        // Calculate distance from the first point
                        if (i > 0 || j > 0) {
                            const firstCoord = ol.proj.transform(coordinates[0], 'EPSG:3857', 'EPSG:4326');
                            totalDistance = calculateDistance(firstCoord[1], firstCoord[0], lat, lon);
                        }

                        elevationData.push({ x: totalDistance, y: lat, maxElevation, label: null });

                        // Log elevation value for debugging
                        console.log(`Max Elevation at (${lon}, ${lat}): ${maxElevation}, Distance: ${totalDistance}`);
                    } else {
                        console.error("No elevation data found for point:", lon, lat);
                        elevationData.push({ x: totalDistance, y: lat, maxElevation: null, label: null });
                    }
                } else {
                    console.error("Failed to fetch elevation data:", response.status, response.statusText);
                    elevationData.push({ x: totalDistance, y: lat, maxElevation: null, label: null });
                }
            }
        }
    } catch (error) {
        console.error("Failed to fetch elevation data:", error);
    }

    return elevationData;
}

////////////Function to display elevation values and distance on a line chart\\\\\\\\\\\\\\
async function displayElevationProfile(lineString) {
    var coordinates = lineString.getCoordinates();
    var elevationData = await fetchElevationData(coordinates);

    // Get the existing chart instance
    var existingChart = Chart.getChart('chart');

    // Destroy the existing chart if it exists
    if (existingChart) {
        existingChart.destroy();
    }

    var chartCanvas = document.getElementById('chart').getContext('2d');

    var minElevation = Math.min(...elevationData.map(data => data.maxElevation).filter(value => value !== null));
    var maxElevation = Math.max(...elevationData.map(data => data.maxElevation).filter(value => value !== null));

    var elevationChart = new Chart(chartCanvas, {
        type: 'line',
        data: {
            labels: elevationData.map(data => {
                let distance = data.x;
                return distance < 1000 ? `${distance.toFixed(2)}m` : `${(distance / 1000).toFixed(2)}km`;
            }), // Use distance values as labels and convert to km if distance > 1000
            datasets: [{
                label: 'height',
                data: elevationData.map(data => data.maxElevation),
                borderColor: '#ffcc33',
                backgroundColor: 'rgba(255, 204, 51, 0.8)', // Add transparency to the background color
                borderWidth: 2,
                fill: 'start' // Fill the area below the line
            }]
        },
        options: {
            scales: {
                y: {
                    scaleLabel: {
                        display: true,
                        labelString: `Max Elevation (m) - Min: ${minElevation.toFixed(2)}m, Max: ${maxElevation.toFixed(2)}m`,
                        fontSize: 16 // Increase font size for y-axis label
                    },
                    ticks: {
                        fontSize: 16, // Increase font size for y-axis ticks
                        callback: function (value, index, values) {
                            return value + 'm'; // Add 'm' after the numbers
                        },
                        suggestedMin: minElevation, // Set suggested minimum based on minimum elevation value
                        suggestedMax: maxElevation // Set suggested maximum based on maximum elevation value
                    }
                },
                x: {
                    scaleLabel: {
                        display: true,
                        labelString: 'Distance(m)',
                        fontSize: 16 // Increase font size for x-axis label
                    },
                    ticks: {
                        fontSize: 16 // Increase font size for x-axis ticks
                    }
                }
            },
            elements: {
                line: {
                    tension: 0.5 // Adjust tension for smoother curve (0 to 1)
                }
            },
            plugins: {
                legend: {
                    display: false // Hide the legend
                }
            }
        }
    });

    // Display min and max elevation values
    document.getElementById('min-elevation').textContent = `Lowest: ${minElevation.toFixed(2)}m`;
    document.getElementById('max-elevation').textContent = `Highest: ${maxElevation.toFixed(2)}m`;

    // Hide lottie animation loading container and show chart canvas, min and max elevation values
    document.getElementById('animation-container').style.display = 'none';
    document.getElementById('chart').style.display = 'block';
    document.getElementById('min-elevation').style.display = 'block';
    document.getElementById('max-elevation').style.display = 'block';
}


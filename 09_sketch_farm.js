///// <----- SKETCH FARM BUTTON FUNCTION -----> \\\\\

async function fetchPlaceName(lon, lat) {
    const baseUrl = "https://nominatim.openstreetmap.org/reverse";
    const format = "json";
    const url = `${baseUrl}?lon=${lon}&lat=${lat}&format=${format}&zoom=18&addressdetails=1`;

    let cities = await fetch('https://vn-public-apis.fpo.vn/districts/getAll?limit=-1')
        .then(response => response.json())
        .then(data => {
            let allCities = data.data.data;
            let citiesWithThanhPho = [];
            allCities.forEach(city => {
                let pathWithTypeParts = city.path_with_type.split(', ');
                if (pathWithTypeParts[1].includes('Thành phố')) {
                    let cityName = pathWithTypeParts[1].replace('Thành phố ', '');
                    if (!citiesWithThanhPho.includes(cityName)) {
                        citiesWithThanhPho.push(cityName);
                    }
                }
                if (city.name_with_type.includes('Thành phố') && !citiesWithThanhPho.includes(city.name)) {
                    citiesWithThanhPho.push(city.name);
                }
            });

            console.log('Fetched Cities:', citiesWithThanhPho);

            return citiesWithThanhPho;
        })
        .catch((error) => console.error('Error:', error));

    let provinces = await fetch('https://vn-public-apis.fpo.vn/provinces/getAll?limit=-1')
        .then(response => response.json())
        .then(data => {
            let allProvinces = data.data.data;
            let provinceNames = allProvinces.map(province => province.name);

            console.log('Fetched Provinces:', provinceNames);

            return provinceNames;
        })
        .catch((error) => console.error('Error:', error));

    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            let placeName = data.display_name || "";

            const parts = placeName.split(', ');
            let firstPart = parts.shift(); // Get the first part before the comma (place name)

            let streetAddress = '';
            let village = '';
            let commune = '';
            let ward = '';
            let district = '';
            let city = '';
            let province = '';
            let postcode = '';
            let country = '';

            // Check the first part for keywords
            if (firstPart.includes("Chợ Rẫy") || firstPart.includes("Chung cư") || firstPart.includes("Chung Cư") || firstPart.includes("Tòa nhà") || firstPart.includes("Tower") || firstPart.includes("Building") || firstPart.includes("Complex") || firstPart.includes("Hospital") || firstPart.includes("Hotel") || firstPart.includes("Store")) {
                firstPart = firstPart; // Assign to place name
            } else if (firstPart.includes("District") || firstPart.includes("Huyện") || firstPart.includes("Quận")) {
                district = firstPart;
                firstPart = '';
            } else if (firstPart.includes("Ward") || firstPart.includes("ward") || firstPart.includes("Phường")) {
                ward = firstPart;
                firstPart = '';
            } else if (firstPart.includes("Xã") || firstPart.includes("Commune")) {
                commune = firstPart;
                firstPart = '';
            } else {
                streetAddress = firstPart;
            }

            // Process the rest of the parts
            parts.forEach((part, index) => {
                if (part.includes("District") || part.includes("Huyện") || part.includes("Quận")) {
                    district = part;
                } else if (part.includes("Ward") || part.includes("ward") || part.includes("Phường")) {
                    ward = part;
                } else if (part.includes("Xã") || part.includes("Commune")) {
                    commune = part;
                } else if (/\d/.test(part) && !/\d{4,5}/.test(part)) {
                    streetAddress += ' ' + part;
                } else if (/\d{4,5}/.test(part)) {
                    postcode = part;
                } else if (/\D/.test(part)) {
                    // Check for street address keywords
                    if (part.includes("Đường") || part.includes("Quốc lộ") || part.includes("Tỉnh lộ") || part.includes("Hẻm") || part.includes("Ngõ") // Add "Ngõ" here
                        || part.includes("Phố") || part.includes("Đại lộ") || part.includes("Xóm") || part.includes("Thôn") || part.includes("Road")
                        || part.includes("Rd.") || part.includes("Avenue") || part.includes("Ave.") || part.includes("Street") || part.includes("street")
                        || part.includes("Highway") || part.includes("highway") || part.includes("Lane") || part.includes("lane") || part.includes("Boulevard") || part.includes("Blvd.")) {
                        streetAddress += ' ' + part;
                    } else {
                        for (let i = 0; i < cities.length; i++) {
                            if (part.includes(cities[i])) {
                                city = cities[i];
                                break;
                            }
                        }

                        for (let j = 0; j < provinces.length; j++) {
                            if (part.includes(provinces[j])) {
                                province = part;
                                break;
                            }
                        }
                    }
                }

                if (part === "Vietnam") {
                    country = part;
                }
            });

            console.log('Place Name:', firstPart);
            console.log('Street Address:', streetAddress.trim());
            console.log('Village:', village);
            console.log('Commune:', commune);
            console.log('Ward:', ward);
            console.log('District:', district);
            console.log('City:', city);
            console.log('Province:', province);
            console.log('Postcode:', postcode);
            console.log('Country:', country);
            return { placeName, firstPart, streetAddress: streetAddress.trim(), village, commune, ward, district, city, province, postcode, country };
        } else {
            console.error(
                "Failed to fetch place name:",
                response.status,
                response.statusText
            );
            return "";
        }
    } catch (error) {
        console.error("Failed to fetch place name:", error);
        return "";
    }
}



let isSketchActive = false;
let draw;
let polygonExists = false;
let vectorSource = new ol.source.Vector();
let tooltipOverlay;
let tooltipOverlays = [];
let timeoutId = null;
let sketchFarmBtnIcon;

let buttonsToHideSketchFarmActive = [
    "searchBar", 
    "searchBtn", 
    "basemapBtn", 
    "measureAreaBtn",
    "measureLengthBtn", 
    "addSensorBtn", 
    "tutorialBtn", 
    "windyMapBtn", 
    "resetBtn",
    //"locationBtn", 
    "perspectiveBtn", 
    //"angle", 
    "elevProfileBtn",
];

function showButtonsSketchFarmInactive() {
    for (let button of buttonsToHideSketchFarmActive) {
        let btn = document.getElementById(button);
        if (btn) {
            btn.style.display = '';
        }
    }
}

async function startSketchFarm() {
    // Get a reference to the sketchingFarmfloatingTitle
    const sketchingFarmFloatingTitle = document.querySelector('.sketchingFarmfloatingTitle');

    // Hide all buttons
    for (let button of buttonsToHideSketchFarmActive) {
        let btn = document.getElementById(button);
        if (btn) {
            btn.style.display = 'none';
        }
    }

    const sketchFarmBtn = document.getElementById("sketchFarmBtn");
    sketchFarmBtnIcon = sketchFarmBtn.querySelector("i");
    const finishDrawingButton = document.querySelector('.finish-drawing');
    const undoSketchbtn = document.querySelector('.undoSketchBtn');
    const dialog = document.getElementById('dialog');

    if (isSketchActive) {
        if (timeoutId) {
            clearTimeout(timeoutId);
            const existingFloatingMessage = document.querySelector('.floating-message');
            if (existingFloatingMessage) {
                map.getViewport().removeChild(existingFloatingMessage);
            }
            timeoutId = null;
        }

        if (polygonExists) {
            dialog.classList.remove('hidden');

            document.getElementById("deleteYes").addEventListener("click", function () {
                map.removeInteraction(draw);
                isSketchActive = false;
                polygonExists = false;
                vectorSource.clear();
                for (const overlay of tooltipOverlays) {
                    map.removeOverlay(overlay);
                }
                sketchFarmBtn.style.backgroundColor = "white";
                sketchFarmBtnIcon.textContent = "create";
                sketchFarmBtnIcon.style.color = "#515151";
                finishDrawingButton.classList.add("hidden");
                dialog.classList.add("hidden");
                console.clear();

                // Hide the undoSketchBtn button when the deleteYes button is clicked
                undoSketchbtn.style.display = "none";

                // Remove stored polygon from local storage
                localStorage.removeItem("enfarm_polygon_coordinates");

                // Show the hidden buttons
                showButtonsSketchFarmInactive();

                // Hide sketchingFarmfloatingTitle when sketching is inactive
                if (sketchingFarmFloatingTitle) {
                    sketchingFarmFloatingTitle.style.display = 'none';
                }
            });

            document.getElementById('deleteNo').addEventListener('click', function () {
                dialog.classList.add('hidden');
            });
        } else {
            map.removeInteraction(draw);
            isSketchActive = false;
            sketchFarmBtn.style.backgroundColor = "white";
            sketchFarmBtnIcon.textContent = "create";
            sketchFarmBtnIcon.style.color = "#515151";
            finishDrawingButton.classList.add('hidden');
            //undoSketchBtn.style.display = "none";

            // Hide sketchingFarmfloatingTitle when sketching is inactive
            if (sketchingFarmFloatingTitle) {
                sketchingFarmFloatingTitle.style.display = 'none';
            }
        }
        return;
    }

    // Show sketchingFarmfloatingTitle when sketching is active
    if (sketchingFarmFloatingTitle) {
        sketchingFarmFloatingTitle.style.display = 'flex';
    }

    const floatingMessage = document.createElement("div");
    floatingMessage.className = "floating-message";
    const infoIcon = document.createElement("i");
    infoIcon.className = "material-icons";
    infoIcon.textContent = "touch_app";
    infoIcon.style.fontSize = "50px";
    floatingMessage.appendChild(infoIcon);
    floatingMessage.innerHTML +=
        "Chạm vào bản đồ để bắt đầu vẽ trang trại"; // "Tap on the map to start drawing the farm"
    map.getViewport().appendChild(floatingMessage);

    timeoutId = setTimeout(function () {
        map.getViewport().removeChild(floatingMessage);
    }, 3000);



    ///CREATE FARM POLYGON WITH SQUARE, RECTANGULAR and TRIANGULAR GRID
    let extent;
    let squareGridCountElement = document.getElementById('squareGridCount');
    let rectangularGridCountElement = document.getElementById('rectangularGridCount');
    let triangularGridCountElement = document.getElementById('triangularGridCount');


    const squareGridX = new ol.layer.Vector({
        source: new ol.source.Vector(),
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'white',
                width: 6
            })
        })
    });

    const squareGridY = new ol.layer.Vector({
        source: new ol.source.Vector(),
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'white',
                width: 6
            })
        })
    });

    const rectangularGridX = new ol.layer.Vector({
        source: new ol.source.Vector(),
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'white',
                width: 6
            })
        })
    });

    const rectangularGridY = new ol.layer.Vector({
        source: new ol.source.Vector(),
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'white',
                width: 6
            })
        })
    });

    // Create triangularGrid layer
    const triangularGrid = new ol.layer.Vector({
        source: new ol.source.Vector(),
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'white',
                width: 6
            })
        })
    });

    // Define a style function for the intersection points
    function intersectionPointStyle(feature) {
        const zoom = map.getView().getZoom();
        const isZoom19AndAbove = zoom >= 21;

        if (isZoom19AndAbove) {
            // Show the trees only at zoom level 21 and above
            return new ol.style.Style({
                image: new ol.style.Icon({
                    src: 'https://i.ibb.co/hDYvzYs/icons8-tree-64.png',
                    scale: 0.5,
                }),
                stroke: new ol.style.Stroke({
                    color: 'white',
                    width: 1,
                }),
                fill: new ol.style.Fill({
                    color: 'green',
                }),
            });
        } else {
            // Return null style (no tree icon) for zoom levels below 21
            return null;
        }
    }

    // Use the style function when creating the intersection point layers
    const squareGridIntersectionPoints = new ol.layer.Vector({
        source: new ol.source.Vector(),
        style: intersectionPointStyle
    });

    const rectangularGridIntersectionPoints = new ol.layer.Vector({
        source: new ol.source.Vector(),
        style: intersectionPointStyle
    });

    const triangularGridIntersectionPoints = new ol.layer.Vector({
        source: new ol.source.Vector(),
        style: intersectionPointStyle
    });


    map.addLayer(squareGridX);
    map.addLayer(squareGridY);
    map.addLayer(rectangularGridX);
    map.addLayer(rectangularGridY);
    map.addLayer(triangularGrid);

    map.addLayer(squareGridIntersectionPoints);
    map.addLayer(rectangularGridIntersectionPoints);
    map.addLayer(triangularGridIntersectionPoints);


    // Initially, hide the rectangularGrid.
    rectangularGridX.setVisible(false);
    rectangularGridY.setVisible(false);
    triangularGrid.setVisible(false);
    rectangularGridIntersectionPoints.setVisible(false);
    triangularGridIntersectionPoints.setVisible(false);

    // Grid Pattern Type Options
    var button1 = document.querySelector('.gridTypeOptionBtn1');
    var button2 = document.querySelector('.gridTypeOptionBtn2');
    var button3 = document.querySelector('.gridTypeOptionBtn3');

    // Hide the elements initially
    document.getElementById('rectangularGridTreeCountContainer').style.display = 'none';
    document.getElementById('rectangularGridYCountContainer').style.display = 'none';
    document.getElementById('rectangularGridXCountContainer').style.display = 'none';

    document.getElementById('triangularGridTreeCountContainer').style.display = 'none';
    document.getElementById('triangularGridYCountContainer').style.display = 'none';
    document.getElementById('triangularGridXCountContainer').style.display = 'none';
    document.getElementById('triangularGridZCountContainer').style.display = 'none';



    // Add event listeners to the buttons
    button1.addEventListener('click', function () {
        // When gridTypeOptionBtn1 is clicked, show the squareGrid and hide the rectangularGrid.
        squareGridX.setVisible(true);
        squareGridY.setVisible(true);
        rectangularGridX.setVisible(false);
        rectangularGridY.setVisible(false);
        triangularGrid.setVisible(false);
        squareGridIntersectionPoints.setVisible(true);
        rectangularGridIntersectionPoints.setVisible(false);
        triangularGridIntersectionPoints.setVisible(false);

        document.getElementById('squareGridTreeCountContainer').style.display = 'block';
        document.getElementById('squareGridYCountContainer').style.display = 'block';
        document.getElementById('squareGridXCountContainer').style.display = 'block';

        // Hide elements when button1 is clicked
        document.getElementById('rectangularGridTreeCountContainer').style.display = 'none';
        document.getElementById('rectangularGridYCountContainer').style.display = 'none';
        document.getElementById('rectangularGridXCountContainer').style.display = 'none';

        document.getElementById('triangularGridTreeCountContainer').style.display = 'none';
        document.getElementById('triangularGridYCountContainer').style.display = 'none';
        document.getElementById('triangularGridXCountContainer').style.display = 'none';
        document.getElementById('triangularGridZCountContainer').style.display = 'none';

    });

    button2.addEventListener('click', function () {
        // When gridTypeOptionBtn2 is clicked, show the rectangularGrid and hide the squareGrid.
        squareGridX.setVisible(false);
        squareGridY.setVisible(false);
        rectangularGridX.setVisible(true);
        rectangularGridY.setVisible(true);
        triangularGrid.setVisible(false);
        squareGridIntersectionPoints.setVisible(false);
        rectangularGridIntersectionPoints.setVisible(true);
        triangularGridIntersectionPoints.setVisible(false);

        squareGridTreeCountContainer.style.display = "none";
        rectangularGridTreeCountContainer.style.display = "block";
        triangularGridTreeCountContainer.style.display = "none";

        // Show the elements when button2 is clicked
        document.getElementById('rectangularGridTreeCountContainer').style.display = 'block';
        document.getElementById('rectangularGridYCountContainer').style.display = 'block';
        document.getElementById('rectangularGridXCountContainer').style.display = 'block';

        // Hide elements when button2 is clicked
        document.getElementById('squareGridTreeCountContainer').style.display = 'none';
        document.getElementById('squareGridYCountContainer').style.display = 'none';
        document.getElementById('squareGridXCountContainer').style.display = 'none';

        document.getElementById('triangularGridTreeCountContainer').style.display = 'none';
        document.getElementById('triangularGridYCountContainer').style.display = 'none';
        document.getElementById('triangularGridXCountContainer').style.display = 'none';
        document.getElementById('triangularGridZCountContainer').style.display = 'none';

    });

    button3.addEventListener('click', function () {
        // When gridTypeOptionBtn3 is clicked, show the triangularGrid and hide the squareGrid and rectangularGrid.
        squareGridX.setVisible(false);
        squareGridY.setVisible(false);
        rectangularGridX.setVisible(false);
        rectangularGridY.setVisible(false);
        triangularGrid.setVisible(true);
        squareGridIntersectionPoints.setVisible(false);
        rectangularGridIntersectionPoints.setVisible(false);
        triangularGridIntersectionPoints.setVisible(true);

        /*h2Element.innerText = "Triangular Grid Estimated Coffee Tree Count";*/
        squareGridTreeCountContainer.style.display = "none";
        rectangularGridTreeCountContainer.style.display = "none";
        triangularGridTreeCountContainer.style.display = "block";

        // Show the elements when button3 is clicked

        document.getElementById('triangularGridTreeCountContainer').style.display = 'block';
        document.getElementById('triangularGridYCountContainer').style.display = 'block';
        document.getElementById('triangularGridXCountContainer').style.display = 'block';
        document.getElementById('triangularGridZCountContainer').style.display = 'block';

        // Hide elements when button2 is clicked
        document.getElementById('rectangularGridTreeCountContainer').style.display = 'none';
        document.getElementById('rectangularGridYCountContainer').style.display = 'none';
        document.getElementById('rectangularGridXCountContainer').style.display = 'none';

        document.getElementById('squareGridTreeCountContainer').style.display = 'none';
        document.getElementById('squareGridYCountContainer').style.display = 'none';
        document.getElementById('squareGridXCountContainer').style.display = 'none';

    });

    //SKETCH FARM PROPERTIES
    const farmVectorLayer = new ol.layer.Vector({
        source: vectorSource,
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: "rgba(56, 108, 52, 0.5)"
            })
        })
    });

    map.addLayer(farmVectorLayer);

    draw = new ol.interaction.Draw({
        source: vectorSource,
        type: "Polygon",
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: "rgba(255, 255, 255, 0.1)",
            }),
            stroke: new ol.style.Stroke({
                color: "#386c34",
                width: 5,
            }),
            image: new ol.style.Circle({
                radius: 10,
                fill: new ol.style.Fill({
                    color: "#386c34",
                }),
                stroke: new ol.style.Stroke({
                    color: "#ffffff",
                    width: 4,
                }),
            }),
        }),
    });

    map.addInteraction(draw);
    isSketchActive = true;

    let squareGridXCount = 0;
    let squareGridYCount = 0;
    let rectangularGridXCount = 0;
    let rectangularGridYCount = 0;
    let triangularGridXCount = 0;
    let triangularGridYCount = 0;
    let triangularGridZCount = 0;


    let drawnPolygonGeoJSON;

    let customAngle = null; // To store the custom angle
    let drawendEvent;

    function calculateAngleFromLongestEdge(coordinates) {
        let longestEdgeLength = 0;
        let longestEdge = [];

        for (let i = 0; i < coordinates.length - 1; i++) {
            const start = coordinates[i];
            const end = coordinates[i + 1];

            const length = Math.sqrt(Math.pow(end[0] - start[0], 2) + Math.pow(end[1] - start[1], 2));

            if (length > longestEdgeLength) {
                longestEdgeLength = length;
                longestEdge = [start, end];
            }
        }

        return Math.atan2(longestEdge[1][1] - longestEdge[0][1], longestEdge[1][0] - longestEdge[0][0]);
    }

    draw.on('drawend', function (evt) {
        // Store the event object in the drawendEvent variable
        drawendEvent = evt;

        let angle = customAngle || calculateAngleFromLongestEdge(evt.feature.getGeometry().getCoordinates()[0]);
        if (customAngle !== null) {
            angle = customAngle;
        } else {
            const polygonCoords = evt.feature.getGeometry().getCoordinates()[0];
            let longestEdgeLength = 0;
            let longestEdge = [];

            for (let i = 0; i < polygonCoords.length - 1; i++) {
                const start = polygonCoords[i];
                const end = polygonCoords[i + 1];

                const length = Math.sqrt(Math.pow(end[0] - start[0], 2) + Math.pow(end[1] - start[1], 2));

                if (length > longestEdgeLength) {
                    longestEdgeLength = length;
                    longestEdge = [start, end];
                }
            }

            angle = Math.atan2(longestEdge[1][1] - longestEdge[0][1], longestEdge[1][0] - longestEdge[0][0]);
        }

        generateGrids(evt, angle); // Pass evt and angle to generateGrids
    });


    function generateGrids(evt, angle) {
        const extent = evt.feature.getGeometry().getExtent();

        const center = [0.5 * (extent[0] + extent[2]), 0.5 * (extent[1] + extent[3])];

        const extentDiagonalLength = Math.sqrt(Math.pow(extent[2] - extent[0], 2) + Math.pow(extent[3] - extent[1], 2));

        const numCells = Math.ceil(extentDiagonalLength / 3) + 2;

        const squareXCoords = [];
        for (let x = 0; x <= numCells; x++) {
            squareXCoords.push(rotatePoint([extent[0] + (x * 3), extent[1] - extentDiagonalLength], center, angle));
            squareXCoords.push(rotatePoint([extent[0] + (x * 3), extent[1] + extentDiagonalLength], center, angle));
        }

        const squareYCoords = [];
        for (let y = 0; y <= numCells; y++) {
            squareYCoords.push(rotatePoint([extent[0] - extentDiagonalLength, extent[1] + (y * 3)], center, angle));
            squareYCoords.push(rotatePoint([extent[0] + extentDiagonalLength, extent[1] + (y * 3)], center, angle));
        }

        const rectangularXCoords = [];
        for (let x = 0; x <= numCells; x++) {
            rectangularXCoords.push(rotatePoint([extent[0] + (x * 3), extent[1] - extentDiagonalLength - 2.5], center, angle));
            rectangularXCoords.push(rotatePoint([extent[0] + (x * 3), extent[1] + extentDiagonalLength - 2.5], center, angle));
        }

        const rectangularYCoords = [];
        for (let y = 0; y <= numCells; y++) {
            rectangularYCoords.push(rotatePoint([extent[0] - extentDiagonalLength, extent[1] + (y * 2.5) - 2.5], center, angle));
            rectangularYCoords.push(rotatePoint([extent[0] + extentDiagonalLength, extent[1] + (y * 2.5) - 2.5], center, angle));
        }

        // Buffer the polygon extent by 200 meters
        const bufferedExtent = ol.extent.buffer(extent, 200);

        // Triangular grid
        const triangularGridCoords = [];
        const halfHeight = Math.sqrt(3) / 2 * 3;
        const extentWidth = bufferedExtent[2] - bufferedExtent[0];
        const extentHeight = bufferedExtent[3] - bufferedExtent[1];
        const rowCount = Math.ceil((2 * extentHeight) / halfHeight);
        const colCount = Math.ceil((2 * extentWidth) / 3);
        for (let row = 0; row < rowCount; row++) {
            for (let col = 0; col < colCount; col++) {
                let x = bufferedExtent[0] + col * 3;
                let y = bufferedExtent[1] + row * halfHeight;
                if (row % 2 === 0) {
                    // ▽
                    triangularGridCoords.push([
                        rotatePoint([x, y], center, angle),
                        rotatePoint([x + 1.5, y + halfHeight], center, angle),
                        rotatePoint([x + 3, y], center, angle),
                        rotatePoint([x, y], center, angle),
                    ]);
                    triangularGridCoords.push([
                        rotatePoint([x + 1.5, y + halfHeight], center, angle),
                        rotatePoint([x + 3, y], center, angle),
                        rotatePoint([x + 4.5, y + halfHeight], center, angle),
                        rotatePoint([x + 1.5, y + halfHeight], center, angle)
                    ]);
                } else {
                    // △
                    triangularGridCoords.push([
                        rotatePoint([x + 1.5, y], center, angle),
                        rotatePoint([x + 3, y + halfHeight], center, angle),
                        rotatePoint([x, y + halfHeight], center, angle),
                        rotatePoint([x + 1.5, y], center, angle),
                    ]);
                    triangularGridCoords.push([
                        rotatePoint([x + 3, y + halfHeight], center, angle),
                        rotatePoint([x + 4.5, y], center, angle),
                        rotatePoint([x + 6, y + halfHeight], center, angle),
                        rotatePoint([x + 3, y + halfHeight], center, angle),
                    ]);
                }
            }
        }


        //Counting the Triangular Grid XYZ

        let triangularGridLines = new Set();

        triangularGridCoords.forEach(triangle => {
            triangle.forEach((point, index) => {
                let nextPoint = triangle[(index + 1) % 4]; // get the next point, wrapping around to the first point if necessary

                // represent the line as a string of its sorted endpoints
                let line = JSON.stringify([point, nextPoint].sort());

                // add the line to the set
                triangularGridLines.add(line);
            });
        });

        // initialize the counts
        // Count the X, Y, and Z lines based on the structure of the triangular grid
        let triangularGridXCount = colCount;
        let triangularGridYCount = rowCount;
        let triangularGridZCount = Math.max(rowCount, colCount);


        var geometry3857 = evt.feature.getGeometry().getCoordinates()[0];
        var geometry4326 = geometry3857.map(coord => ol.proj.transform(coord, 'EPSG:3857', 'EPSG:4326'));
        drawnPolygonGeoJSON = turf.polygon([geometry4326]);

        addAndTrimLineFeatures(squareGridX, squareXCoords, drawnPolygonGeoJSON, 'squareGridX');
        addAndTrimLineFeatures(squareGridY, squareYCoords, drawnPolygonGeoJSON, 'squareGridY');
        addAndTrimLineFeatures(rectangularGridX, rectangularXCoords, drawnPolygonGeoJSON, 'rectangularGridX');
        addAndTrimLineFeatures(rectangularGridY, rectangularYCoords, drawnPolygonGeoJSON, 'rectangularGridY');
        addAndTrimPolygonFeatures(triangularGrid, triangularGridCoords, drawnPolygonGeoJSON);



        // Calculate the number of coffee trees for square grids
        const numberOfCoffeeTreesForSquareGrid = squareGridXCount * squareGridYCount;

        // Calculate the number of coffee trees for rectangular grids
        const numberOfCoffeeTreesForRectangularGrid = rectangularGridXCount * rectangularGridYCount;

        //squareGridCountElement.textContent = numberOfCoffeeTreesForSquareGrid;
        //rectangularGridCountElement.textContent = numberOfCoffeeTreesForRectangularGrid;


        document.getElementById('squareGridXCount').innerText = squareGridXCount; // needed to show in the info card
        //console.log(`◇ Square grid X lines inside polygon: ${squareGridXCount}`);

        document.getElementById('squareGridYCount').innerText = squareGridYCount;
        //console.log(`◇ Square grid Y lines inside polygon: ${squareGridYCount}`);

        document.getElementById('rectangularGridYCount').innerText = rectangularGridYCount;
        //console.log(`▭ Rectangular grid Y lines inside polygon: ${rectangularGridYCount}`);

        document.getElementById('rectangularGridXCount').innerText = rectangularGridXCount;
        //console.log(`▭ Rectangular grid X lines inside polygon: ${rectangularGridXCount}`);

        document.getElementById('triangularGridXCount').innerText = triangularGridXCount;
        //console.log(`△ Triangular grid X lines inside polygon: ${triangularGridXCount}`);

        document.getElementById('triangularGridYCount').innerText = triangularGridYCount;
        //console.log(`△ Triangular grid Y lines inside polygon: ${triangularGridYCount}`);

        document.getElementById('triangularGridZCount').innerText = triangularGridZCount;
        //console.log(`△ Triangular grid Z lines inside polygon: ${triangularGridZCount}`);


        function storeGridFeatures(squareGridX, squareGridY, rectangularGridX, rectangularGridY, triangularGrid) {
            const format = new ol.format.GeoJSON();

            const squareGridXFeaturesGeoJSON = squareGridX.getSource().getFeatures().map(feature => format.writeFeatureObject(feature));
            const squareGridYFeaturesGeoJSON = squareGridY.getSource().getFeatures().map(feature => format.writeFeatureObject(feature));

            const rectangularGridXFeaturesGeoJSON = rectangularGridX.getSource().getFeatures().map(feature => format.writeFeatureObject(feature));
            const rectangularGridYFeaturesGeoJSON = rectangularGridY.getSource().getFeatures().map(feature => format.writeFeatureObject(feature));

            const triangularGridFeaturesGeoJSON = triangularGrid.getSource().getFeatures().map(feature => format.writeFeatureObject(feature));

            //localStorage.setItem('squareGridX', JSON.stringify(squareGridXFeaturesGeoJSON));
            //localStorage.setItem('squareGridY', JSON.stringify(squareGridYFeaturesGeoJSON));
            //localStorage.setItem('rectangularGridX', JSON.stringify(rectangularGridXFeaturesGeoJSON));
            //localStorage.setItem('rectangularGridY', JSON.stringify(rectangularGridYFeaturesGeoJSON));
            //localStorage.setItem('triangularGrid', JSON.stringify(triangularGridFeaturesGeoJSON));

            // Calculate intersection points for square grid
            calculateIntersectionPoints([squareGridX, squareGridY], squareGridIntersectionPoints);

            // Calculate intersection points for rectangular grid
            calculateIntersectionPoints([rectangularGridX, rectangularGridY], rectangularGridIntersectionPoints);

            // Calculate intersection points for triangular grid
            calculateIntersectionPoints([triangularGrid], triangularGridIntersectionPoints);

        }

        storeGridFeatures(squareGridX, squareGridY, rectangularGridX, rectangularGridY, triangularGrid);


        function storeGridIntersectionPoints(squareGridIntersectionPoints, rectangularGridIntersectionPoints, triangularGridIntersectionPoints) {
            const format = new ol.format.GeoJSON();

            // Convert and store intersection points for square grid
            const squareGridIntersectionPointsGeoJSON = squareGridIntersectionPoints.getSource().getFeatures().map(feature => format.writeFeatureObject(feature));
            localStorage.setItem('squareGridIntersectionPoints', JSON.stringify(squareGridIntersectionPointsGeoJSON));

            // Convert and store intersection points for rectangular grid
            const rectangularGridIntersectionPointsGeoJSON = rectangularGridIntersectionPoints.getSource().getFeatures().map(feature => format.writeFeatureObject(feature));
            localStorage.setItem('rectangularGridIntersectionPoints', JSON.stringify(rectangularGridIntersectionPointsGeoJSON));

            // Convert and store intersection points for triangular grid
            const triangularGridIntersectionPointsGeoJSON = triangularGridIntersectionPoints.getSource().getFeatures().map(feature => format.writeFeatureObject(feature));
            localStorage.setItem('triangularGridIntersectionPoints', JSON.stringify(triangularGridIntersectionPointsGeoJSON));
        }

        storeGridIntersectionPoints(squareGridIntersectionPoints, rectangularGridIntersectionPoints, triangularGridIntersectionPoints);



        // Calculate intersection points for given layers and store them in the given intersectionPointsLayer
        function calculateIntersectionPoints(layers, intersectionPointsLayer) {
            for (let i = 0; i < layers.length; i++) {
                const features1 = layers[i].getSource().getFeatures();
                for (let j = i + 1; j < layers.length; j++) {
                    const features2 = layers[j].getSource().getFeatures();
                    features1.forEach(feature1 => {
                        const geom1 = feature1.getGeometry();
                        features2.forEach(feature2 => {
                            const geom2 = feature2.getGeometry();
                            const coords1 = geom1.getCoordinates();
                            const coords2 = geom2.getCoordinates();
                            for (let k = 0; k < coords1.length - 1; k++) {
                                for (let l = 0; l < coords2.length - 1; l++) {
                                    const line1 = turf.lineString([coords1[k], coords1[k + 1]]);
                                    const line2 = turf.lineString([coords2[l], coords2[l + 1]]);
                                    const intersect = turf.lineIntersect(line1, line2);
                                    if (intersect.features.length > 0) {
                                        const point = intersect.features[0].geometry.coordinates;
                                        intersectionPointsLayer.getSource().addFeature(new ol.Feature(new ol.geom.Point(point)));
                                    }
                                }
                            }
                        });
                    });
                }
            }
        }



        // Use setTimeout to delay the execution of countIntersectionPoints
        setTimeout(countIntersectionPoints, 5000); // wait 5000 milliseconds (1 second) before executing countIntersectionPoints

        // Call the function to count intersection points after they have been calculated
        countIntersectionPoints();
    };

    function rotatePoint(point, center, angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const nx = (cos * (point[0] - center[0])) - (sin * (point[1] - center[1])) + center[0];
        const ny = (sin * (point[0] - center[0])) + (cos * (point[1] - center[1])) + center[1];
        return [nx, ny];
    }

    //For squareGrid and rectangulaGrid
    function addAndTrimLineFeatures(layer, coords, polygon, gridType) {
        const source = layer.getSource();

        for (let i = 0, len = coords.length; i < len; i += 2) {
            const start = coords[i];
            const end = coords[i + 1];
            const geometry = new ol.geom.LineString([start, end]);

            var geometry3857 = geometry.getCoordinates();
            var geometry4326 = geometry3857.map(coord => ol.proj.transform(coord, 'EPSG:3857', 'EPSG:4326'));
            var geojson = turf.lineString(geometry4326);

            var splitted = turf.lineSplit(geojson, polygon);

            splitted.features.forEach(function (lineSegment) {
                if (turf.booleanPointInPolygon(turf.centerOfMass(lineSegment), polygon)) {
                    var lineSegment3857 = new ol.geom.LineString(lineSegment.geometry.coordinates.map(coord => ol.proj.transform(coord, 'EPSG:4326', 'EPSG:3857')));

                    source.addFeature(new ol.Feature(lineSegment3857));

                    switch (gridType) {
                        case 'squareGridX':
                            squareGridXCount++;
                            break;
                        case 'squareGridY':
                            squareGridYCount++;
                            break;
                        case 'rectangularGridX':
                            rectangularGridXCount++;
                            break;
                        case 'rectangularGridY':
                            rectangularGridYCount++;
                            break;
                    }
                }
            });
        }
    }


    function addAndTrimPolygonFeatures(layer, coords, polygon) {
        const source = layer.getSource();

        // Shrink the polygon slightly
        var shrunkPolygon = turf.transformScale(polygon, 0.999);

        coords.forEach(triangleCoords => {
            const geometry = new ol.geom.Polygon([triangleCoords]);

            var geometry3857 = geometry.getCoordinates()[0];
            var geometry4326 = geometry3857.map(coord => ol.proj.transform(coord, 'EPSG:3857', 'EPSG:4326'));
            var geojson = turf.polygon([geometry4326]);

            var intersected = turf.intersect(geojson, polygon);

            if (intersected) {
                var intersected3857 = new ol.geom.Polygon(intersected.geometry.coordinates.map(ring => ring.map(coord => ol.proj.transform(coord, 'EPSG:4326', 'EPSG:3857'))));

                source.addFeature(new ol.Feature(intersected3857));

                // Add the vertices of the intersected triangle to the intersection points layer
                intersected3857.getCoordinates()[0].slice(0, -1).forEach(vertex => {
                    // Convert the vertex to EPSG:4326
                    var vertex4326 = ol.proj.transform(vertex, 'EPSG:3857', 'EPSG:4326');

                    // Create a turf point from the vertex
                    var point = turf.point(vertex4326);

                    // Check if the point is inside the shrunk polygon
                    if (turf.booleanPointInPolygon(point, shrunkPolygon)) {
                        triangularGridIntersectionPoints.getSource().addFeature(new ol.Feature(new ol.geom.Point(vertex)));
                    }
                });
            }
        });
    }

    function countIntersectionPoints() {
        const squareGridIntersectionPointCount = countPointsInsidePolygon(squareGridIntersectionPoints, drawnPolygonGeoJSON);
        const rectangularGridIntersectionPointCount = countPointsInsidePolygon(rectangularGridIntersectionPoints, drawnPolygonGeoJSON);
        const triangularGridIntersectionPointCount = countPointsInsidePolygon(triangularGridIntersectionPoints, drawnPolygonGeoJSON);

        //console.log(`Estimated Coffee Tree Count: ${squareGridIntersectionPointCount}`);
        squareGridCountElement.innerText = `${squareGridIntersectionPointCount}`;

        //console.log(`Estimated Coffee Tree Count: ${rectangularGridIntersectionPointCount}`);
        rectangularGridCountElement.innerText = `${rectangularGridIntersectionPointCount}`;

        //console.log(`Estimated Coffee Tree Count: ${triangularGridIntersectionPointCount}`);
        triangularGridCountElement.innerText = `${triangularGridIntersectionPointCount}`;

    }

    function countPointsInsidePolygon(layer, polygon) {
        const features = layer.getSource().getFeatures();
        let count = 0;

        // Create a set to store unique points
        let uniquePoints = new Set();

        for (let i = 0; i < features.length; i++) {
            const feature = features[i];
            const point3857 = feature.getGeometry().getCoordinates();
            const point4326 = ol.proj.transform(point3857, 'EPSG:3857', 'EPSG:4326');
            const point = turf.point(point4326);

            // Convert the point to a string and add it to the set
            const pointString = JSON.stringify(point);
            uniquePoints.add(pointString);
        }

        // Iterate over the unique points and count the ones that are inside the polygon
        uniquePoints.forEach(pointString => {
            const point = JSON.parse(pointString);

            // Increase the count if the point is inside the polygon
            if (turf.booleanPointInPolygon(point, polygon)) {
                count++;
            }
        });

        return count;
    }

    // Function to clear existing grid and point layers and sources
    function clearExistingLayersAndSources() {
        // Clear squareGridX layer and source
        squareGridX.getSource().clear();
        // Clear squareGridY layer and source
        squareGridY.getSource().clear();
        // Clear rectangularGridX layer and source
        rectangularGridX.getSource().clear();
        // Clear rectangularGridY layer and source
        rectangularGridY.getSource().clear();
        // Clear triangularGrid layer and source
        triangularGrid.getSource().clear();

        // Clear intersection point layers and sources
        squareGridIntersectionPoints.getSource().clear();
        rectangularGridIntersectionPoints.getSource().clear();
        triangularGridIntersectionPoints.getSource().clear();
    }

    // Function to remove existing grid layers
    function removeGridLayers() {
        map.removeLayer(squareGridX);
        map.removeLayer(squareGridY);
        map.removeLayer(rectangularGridX);
        map.removeLayer(rectangularGridY);
        map.removeLayer(triangularGrid);
    }


    //GRID TYPE/PATTERN PROPERTIES

    // Function to hide gridPropertiesContainer with slide-up animation
    function hideGridPropertiesContainer() {
        const gridPropertiesContainer = document.getElementById('gridPropertiesContainer');
        gridPropertiesContainer.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
        gridPropertiesContainer.style.transform = 'translateX(-50%) translateY(-100%)'; // Slide the container up
        gridPropertiesContainer.style.opacity = '0'; // Fade out the container

        setTimeout(() => {
            gridPropertiesContainer.style.display = 'none';
            gridPropertiesContainer.style.transition = ''; // Reset transition
            gridPropertiesContainer.style.transform = ''; // Reset transform
            gridPropertiesContainer.style.opacity = ''; // Reset opacity
        }, 300); // Delay should be equal to transition duration
    }

    // Function to determine grid type and intersection type
    function determineGridType(button) {
        const gridTypes = ['squareGrid', 'rectangularGrid', 'triangularGrid'];
        const intersectionTypes = [
            'squareGridIntersectionPoints',
            'rectangularGridIntersectionPoints',
            'triangularGridIntersectionPoints'
        ];

        for (let i = 0; i < gridTypes.length; i++) {
            if (button.classList.contains(`gridTypeOptionBtn${i + 1}`)) {
                return { gridType: gridTypes[i], gridIntersectionType: intersectionTypes[i] };
            }
        }

        return { gridType: '', gridIntersectionType: '' };
    }

    finishDrawingButton.addEventListener('click', function () {
        if (draw) {
            draw.finishDrawing();
            map.removeInteraction(draw);
            isSketchActive = false;

            sketchFarmBtn.style.backgroundColor = "white";
            sketchFarmBtnIcon.textContent = "create";
            sketchFarmBtnIcon.style.color = "#515151";
            undoSketchBtn.style.display = "none";

            // Show all buttons again after drawing is finished
            showButtonsSkecthFarmInactive();

            finishDrawingButton.classList.add('hidden');

            // Show the clear all drawing button
            showButton('clearAllDrawingBtn');

            // After drawing is finished and the "finishDrawingButton" is clicked, show the floating container
            showAddFarmSuccess();

            // Hide the floating title
            const sketchingFarmFloatingTitle = document.querySelector('.sketchingFarmfloatingTitle');
            if (sketchingFarmFloatingTitle) {
                sketchingFarmFloatingTitle.style.display = "none";
            }

            // Add a delay before showing the gridPropertiesContainer
            //setTimeout(showGridPropertiesContainer, 2500); // 2500 milliseconds = 2.5 seconds

            // Get the gridPatternInformation element
            const gridPatternInformation = document.querySelector('#gridPatternInformation');

            // Set the display property to flex to show the element
            gridPatternInformation.style.display = 'flex';
        }
    });

    // close-button on grid pattern type properties
    //document.querySelector('.closeGridPropertiesContainer').addEventListener('click', function () {
    // Hide gridPropertiesContainer with slide-up animation
    //  hideGridPropertiesContainer();
    //});


    // Variable to keep track of the last selected grid type
    var lastSelectedGridType = '';
    var lastSelectedGridIntersectionType = '';

    // Grid Type Options and Grid Intersection Options
    var buttons1 = document.querySelectorAll('.gridTypeOptionBtn1'); // squareGrid
    var buttons2 = document.querySelectorAll('.gridTypeOptionBtn2'); // rectangularGrid
    var buttons3 = document.querySelectorAll('.gridTypeOptionBtn3'); // triangularGrid

    [...buttons1, ...buttons2, ...buttons3].forEach(function (button) {
        button.addEventListener('click', function () {
            // Determine the type of grid that was clicked
            const { gridType, gridIntersectionType } = determineGridType(this);

            if (lastSelectedGridType) {
                //console.log(`Previous grid type: ${lastSelectedGridType}`);
            }
            console.log(`Current grid type: ${gridType} selected!`);

            if (lastSelectedGridIntersectionType) {
                //console.log(`Previous grid intersection type: ${lastSelectedGridIntersectionType}`);
            }
            console.log(`Current grid intersection type: ${gridIntersectionType} selected!`);

            // Update the last selected grid type and grid intersection type
            lastSelectedGridType = gridType;
            lastSelectedGridIntersectionType = gridIntersectionType;

            // Update button classes
            [...buttons1, ...buttons2, ...buttons3].forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
        });
    });




    //APPLYING A CUSTOM GRID ORIENTATION ANGLE 

    let lastAppliedCustomAngle = 0;

    // Attach the "Apply" button click event listener
    document.getElementById('apply-button').addEventListener('click', function () {
        const inputAngle = document.getElementById('rotate-input').value;
        if (inputAngle !== "") {
            const customAngleDegrees = parseFloat(inputAngle);
            const customAngleRadians = customAngleDegrees * (Math.PI / 180); // Convert degree to radian

            console.log("Last applied custom angle in degrees: " + customAngleDegrees);
            localStorage.setItem('lastAppliedCustomAngle', customAngleDegrees); // Save the angle


            if (drawendEvent) {
                clearExistingLayersAndSources();
                generateGrids(drawendEvent, customAngleRadians); // Use radians for grid generation
            } else {
                // Handle the case where drawendEvent is not defined
                console.error("drawendEvent is not defined.");
            }
        }
    });

    // Define the storeSelectedIntersectionPoints function
    function storeSelectedIntersectionPoints() {
        const format = new ol.format.GeoJSON();

        // Clear existing intersection points data from local storage
        localStorage.removeItem('squareGridIntersectionPoints');
        localStorage.removeItem('rectangularGridIntersectionPoints');
        localStorage.removeItem('triangularGridIntersectionPoints');

        // Determine which intersection points to store based on the last selected grid intersection type
        let intersectionPointsToStore = [];
        let intersectionPointsGeoJSON = [];

        switch (lastSelectedGridIntersectionType) {
            case 'squareGridIntersectionPoints':
                intersectionPointsToStore = squareGridIntersectionPoints;
                intersectionPointsGeoJSON = intersectionPointsToStore.getSource().getFeatures().map(feature => format.writeFeatureObject(feature));
                localStorage.setItem('squareGridIntersectionPoints', JSON.stringify(intersectionPointsGeoJSON));
                break;

            case 'rectangularGridIntersectionPoints':
                intersectionPointsToStore = rectangularGridIntersectionPoints;
                intersectionPointsGeoJSON = intersectionPointsToStore.getSource().getFeatures().map(feature => format.writeFeatureObject(feature));
                localStorage.setItem('rectangularGridIntersectionPoints', JSON.stringify(intersectionPointsGeoJSON));
                break;

            case 'triangularGridIntersectionPoints':
                intersectionPointsToStore = triangularGridIntersectionPoints;
                intersectionPointsGeoJSON = intersectionPointsToStore.getSource().getFeatures().map(feature => format.writeFeatureObject(feature));
                localStorage.setItem('triangularGridIntersectionPoints', JSON.stringify(intersectionPointsGeoJSON));
                break;
        }
    }

    // Define the storeSelectedGridFeatures function
    function storeSelectedGridFeatures(squareGridX, squareGridY, rectangularGridX, rectangularGridY, triangularGrid) {
        const format = new ol.format.GeoJSON();

        // Clear existing grid data from local storage
        localStorage.removeItem('squareGridX');
        localStorage.removeItem('squareGridY');
        localStorage.removeItem('rectangularGridX');
        localStorage.removeItem('rectangularGridY');
        localStorage.removeItem('triangularGrid');

        // Determine which grid to store based on the last selected grid type
        switch (lastSelectedGridType) {
            case 'squareGrid':
                const squareGridXFeaturesGeoJSON = squareGridX.getSource().getFeatures().map(feature => format.writeFeatureObject(feature));
                const squareGridYFeaturesGeoJSON = squareGridY.getSource().getFeatures().map(feature => format.writeFeatureObject(feature));
                localStorage.setItem('squareGridX', JSON.stringify(squareGridXFeaturesGeoJSON));
                localStorage.setItem('squareGridY', JSON.stringify(squareGridYFeaturesGeoJSON));
                break;

            case 'rectangularGrid':
                const rectangularGridXFeaturesGeoJSON = rectangularGridX.getSource().getFeatures().map(feature => format.writeFeatureObject(feature));
                const rectangularGridYFeaturesGeoJSON = rectangularGridY.getSource().getFeatures().map(feature => format.writeFeatureObject(feature));
                localStorage.setItem('rectangularGridX', JSON.stringify(rectangularGridXFeaturesGeoJSON));
                localStorage.setItem('rectangularGridY', JSON.stringify(rectangularGridYFeaturesGeoJSON));
                break;

            case 'triangularGrid':
                const triangularGridFeaturesGeoJSON = triangularGrid.getSource().getFeatures().map(feature => format.writeFeatureObject(feature));
                localStorage.setItem('triangularGrid', JSON.stringify(triangularGridFeaturesGeoJSON));
                break;
        }
    }




    // Disable save-button by default until the user selects a grid type
    const saveButton = document.getElementById('save-button');
    saveButton.disabled = true; // Make it disabled
    saveButton.style.opacity = '0.5'; // Gray it out

    // Function to enable save-button
    function enableSaveButton() {
        saveButton.disabled = false;
        saveButton.style.opacity = '1'; // Restore opacity
    }

    // Event listeners for grid type buttons
    document.querySelectorAll('.gridTypeOptionBtn1, .gridTypeOptionBtn2, .gridTypeOptionBtn3').forEach(btn => {
        btn.addEventListener('click', enableSaveButton);
    });


    // Event listener for the save-button
    document.getElementById('save-button').addEventListener('click', function () {
        storeSelectedGridFeatures(squareGridX, squareGridY, rectangularGridX, rectangularGridY, triangularGrid);
        storeSelectedIntersectionPoints();
        console.log("Last saved custom angle in degrees: " + localStorage.getItem('lastAppliedCustomAngle'));


        // Get intersection and grid counts based on the last selected grid type
        let intersectionCount = 0;
        let gridXCount = 0;
        let gridYCount = 0;
        let gridZCount = 0;

        switch (lastSelectedGridType) {
            case 'squareGrid':
                intersectionCount = squareGridCountElement.innerText;
                gridXCount = document.getElementById('squareGridXCount').innerText;
                gridYCount = document.getElementById('squareGridYCount').innerText;
                break;

            case 'rectangularGrid':
                intersectionCount = rectangularGridCountElement.innerText;
                gridXCount = document.getElementById('rectangularGridXCount').innerText;
                gridYCount = document.getElementById('rectangularGridYCount').innerText;
                break;

            case 'triangularGrid':
                intersectionCount = triangularGridCountElement.innerText;
                gridXCount = document.getElementById('triangularGridXCount').innerText;
                gridYCount = document.getElementById('triangularGridYCount').innerText;
                gridZCount = document.getElementById('triangularGridZCount').innerText;
                break;
        }

        // Log the counts
        console.log(`Intersection count: ${intersectionCount}`);
        console.log(`GridX count: ${gridXCount}`);
        console.log(`GridY count: ${gridYCount}`);
        if (lastSelectedGridType === 'triangularGrid') {
            console.log(`GridZ count: ${gridZCount}`);
        }

        // Save the counts to local storage
        localStorage.setItem('lastSelectedIntersectionCount', intersectionCount);
        localStorage.setItem('lastSelectedGridXCount', gridXCount);
        localStorage.setItem('lastSelectedGridYCount', gridYCount);
        if (lastSelectedGridType === 'triangularGrid') {
            localStorage.setItem('lastSelectedGridZCount', gridZCount);


        }


        // Save the last selected grid type and intersection type to local storage
        localStorage.setItem('lastSelectedGridType', lastSelectedGridType);
        localStorage.setItem('lastSelectedGridIntersectionType', lastSelectedGridIntersectionType);

        // Hide the gridPropertiesContainer with slide-up animation
        hideGridPropertiesContainer();

        // Show the floating container with slide-up animation
        showAddFarmSuccess();



        // Log visible div classes
        const visibleDivClasses = [];
        const divElements = document.querySelectorAll('.countContainer');
        divElements.forEach(div => {
            if (div.style.display !== 'none') {
                visibleDivClasses.push(div.id);
            }
        });

        // Store visible div classes in localStorage
        localStorage.setItem('visibleDivClasses', JSON.stringify(visibleDivClasses));

        console.log("Visible div classes:", visibleDivClasses);

        // Send event to react native app
        const message = { actionType: 'Save', event: 'click' };
        if (window.ReactNativeWebVie) {
            window.ReactNativeWebView.postMessage(JSON.stringify(message));
        }
    });


    //Undo Sketch Function
    // Get a reference to the undoSketchBtn button
    const undoSketchBtn = document.getElementById("undoSketchBtn");

    // Hide the undoSketchBtn button initially
    undoSketchBtn.style.display = "none";

    // Add an event listener to the drawstart event of the draw interaction
    draw.on("drawstart", function (event) {
        // Show the undoSketchBtn button when the user starts drawing a polygon
        undoSketchBtn.style.display = "block";
    });

    // Function to undo the last sketch vertex
    function undoSketchInteraction() {
        draw.removeLastPoint();
    }

    undoSketchBtn.addEventListener("click", undoSketchInteraction);


    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const size = 10;
    const spacing = 8;
    canvas.width = size;
    canvas.height = size;
    context.strokeStyle = "rgba(56, 108, 52, 0.5)";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(size, size);
    context.stroke();

    const pattern = context.createPattern(canvas, "repeat");

    farmVectorLayer.setStyle(
        new ol.style.Style({
            fill: new ol.style.Fill({
                color: pattern,
            }),
            stroke: new ol.style.Stroke({
                color: "#386c34",
                width: 10,
            }),
        })
    );

    sketchFarmBtn.style.backgroundColor = "#FF6666";
    sketchFarmBtnIcon.textContent = "delete_forever";
    sketchFarmBtnIcon.style.color = "white";

    draw.on("drawstart", function (event) {
        polygonExists = true;
        event.feature.getGeometry().on("change", function (geomEvent) {
            const coordinates = geomEvent.target.getCoordinates()[0];
            if (coordinates.length >= 5) {
                finishDrawingButton.classList.remove('hidden');

            }
        });
    });

    draw.on("drawend", async function (event) {
        const polygonGeometry = event.feature.getGeometry();
        const centroid = ol.extent.getCenter(polygonGeometry.getExtent());
        const farmCenterLon = centroid[0];
        const farmCenterLat = centroid[1];

        const pointFeature = new ol.Feature({
            geometry: new ol.geom.Point(centroid),
        });

        pointFeature.setStyle(
            new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 8,
                    fill: new ol.style.Fill({
                        color: '#386c34',
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'white',
                        width: 4,
                    }),
                }),
            })
        );

        map.removeInteraction(draw);
        isSketchActive = false;

        sketchFarmBtn.style.backgroundColor = "white";
        sketchFarmBtnIcon.textContent = "create";
        sketchFarmBtnIcon.style.color = "#515151";

        vectorSource.addFeature(pointFeature);

        const centerPointCoordinates = ol.proj.transform([farmCenterLon, farmCenterLat], 'EPSG:3857', 'EPSG:4326');
        console.log('Center Point Lon:', centerPointCoordinates[0]);
        console.log('Center Point Lat:', centerPointCoordinates[1]);

        const polygonCoordinates = polygonGeometry.getCoordinates()[0];
        console.log('Polygon Coordinates:');
        const polygonPoints = [];
        polygonCoordinates.forEach((coordinate, index) => {
            const lonLat = ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326');
            polygonPoints.push({ lon: lonLat[0], lat: lonLat[1] });
            console.log(`Corner Point ${index + 1}: Lon ${lonLat[0]}, Lat ${lonLat[1]}`);
        });

        const segments = [];
        const segmentLengths = [];
        for (let i = 0; i < polygonCoordinates.length - 1; i++) {
            const startPoint = polygonCoordinates[i];
            const endPoint = polygonCoordinates[i + 1];
            const segment = new ol.geom.LineString([startPoint, endPoint]);
            segments.push(segment);
            const length = ol.sphere.getLength(segment);
            segmentLengths.push(length.toFixed(2));
        }

        console.log('Segment Lengths (m):');
        segmentLengths.forEach((length, index) => {
            console.log(`Segment ${index + 1}: ${length} meters`);
        });

        const area = ol.sphere.getArea(polygonGeometry);
        let areaHectares = null;
        if (area > 10000) {
            areaHectares = (area / 10000).toFixed(2);
        }
        console.log('Polygon Area:');
        console.log(`Area (m²): ${area.toFixed(2)} square meters`);
        if (areaHectares) {
            console.log(`Area (ha): ${areaHectares} hectares`);
        }

        const { placeName: address, firstPart, streetAddress, village, commune, ward, district, city, province, postcode, country } = await fetchPlaceName(centerPointCoordinates[0], centerPointCoordinates[1]);
        console.log("Address:", address);

        const tooltipElement = document.createElement('div');
        tooltipElement.id = 'tooltip-overlay'; // Assigning an ID to the tooltip element
        tooltipElement.style.cssText = `
        position: absolute;
        background-color: #ffffff;
        border: 1px solid #ccc;
        border-radius: 1000px;
        padding: 10px 10px;
        font-family: 'Be Vietnam Pro', Arial, sans-serif;
        font-size: 15px;
        font-weight: bold;
        color: #000000;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 90px;
        height: 20px;
        `;

        const areaInHectares = area > 10000 ? (area / 10000).toFixed(2) + ' ha' : area.toFixed(2) + ' m²';
        tooltipElement.innerHTML = `<span style="white-space: nowrap; display: flex; align-items: center; color: #515151;"><i class="fa-solid fa-seedling" style="font-size: 20px; margin-right: 10px;"></i>${areaInHectares}</span>`;

        tooltipOverlay = new ol.Overlay({
            element: tooltipElement,
            offset: [0, -65],
            positioning: 'bottom-center',
        });

        tooltipOverlay.setPosition(centroid);

        map.addOverlay(tooltipOverlay);
        tooltipOverlays.push(tooltipOverlay);

        //Get Elevation Values from Map Box Elevation
        async function getElevationFromMapbox(centerPointCoordinates) {
            const accessToken = 'pk.eyJ1IjoiY21sb3NhcmlhIiwiYSI6ImNsZGJ4cHp2ajAwMGszb3FmeXpxYmVpMHkifQ.3wsPFc9FkszxcH27eEq2dw';

            let centerElevation;

            try {
                const centerPointLon = centerPointCoordinates[0];
                const centerPointLat = centerPointCoordinates[1];
                const centerUrl = `https://api.mapbox.com/v4/mapbox.mapbox-terrain-v2/tilequery/${centerPointLon},${centerPointLat}.json?layers=contour&access_token=${accessToken}`;
                const centerResponse = await fetch(centerUrl);
                if (centerResponse.ok) {
                    const centerData = await centerResponse.json();
                    if (centerData.features && centerData.features.length > 0) {
                        centerElevation = centerData.features[0].properties.ele; // Update the assignment statement
                        console.log("Elevation (meters):", centerElevation);
                    } else {
                        console.error("No elevation data found for the center point.");
                    }
                } else {
                    console.error("Failed to fetch elevation data for the center point:", centerResponse.status, centerResponse.statusText);
                }
            } catch (error) {
                console.error("Failed to fetch elevation data for the center point:", error);
            }


            // Log the information
            const loggedInfo = {
                placeName: firstPart,
                streetAddress: streetAddress.trim(),
                village: village,
                commune: commune,
                ward: ward,
                district: district,
                city: city,
                province: province,
                postcode: postcode,
                country: country
            };

            // Address and Long Lat sent as separated messages
            // Send data to React Native App
            try {
                // Construct the data object with relevant information
                const dataToPost = {
                    centerPoint: {
                        lon: centerPointCoordinates[0],
                        lat: centerPointCoordinates[1],
                        elevation: centerElevation
                    },
                    polygonCoordinates: polygonPoints,
                    segmentLengths: segmentLengths,
                    area: {
                        squareMeters: area.toFixed(2),
                        hectares: areaHectares
                    },
                    address: loggedInfo,
                };

                // Create a React message to indicate the drawing has finished
                const reactMessage = {
                    actionType: 'Drawing',
                    event: 'completed',
                    data: JSON.stringify(dataToPost),
                };

                // Send address separately
                const addressMessage = {
                    type: 'addressInfo',
                    data: loggedInfo
                };

                // Send center point longitude and latitude separately
                const centerPointMessage = {
                    type: 'centerPointInfo',
                    data: {
                        lon: centerPointCoordinates[0],
                        lat: centerPointCoordinates[1]
                    }
                };

                // Send event to react native app
                if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify(reactMessage));
                }
            } catch (error) {
                console.error(error);
                // Handle the error (or do nothing to prevent logging)
            }
        }


        // Store polygon coordinates in local storage
        const storedPolygon = {
            centerPoint: {
                lon: centerPointCoordinates[0],
                lat: centerPointCoordinates[1],
            },
            polygonPoints: polygonPoints,
            segmentLengths: segmentLengths,
            area: {
                squareMeters: area.toFixed(2),
                hectares: areaHectares
            },
            address: address
        };

        localStorage.setItem('enfarm_polygon_coordinates', JSON.stringify(storedPolygon));
    });
}

const sketchFarmBtn = document.getElementById("sketchFarmBtn");
sketchFarmBtn.addEventListener("click", function () {
    startSketchFarm();
});

const finishDrawingButton = document.querySelector('.finish-drawing');


// Function to show all the hidden buttons
function showButtonsSkecthFarmInactive() {
    for (let button of buttonsToHideSketchFarmActive) {
        let btn = document.getElementById(button);
        if (btn) {
            btn.style.display = '';
        }
    }
}

// Function to show the floating container and trigger the slide-up animation
function showAddFarmSuccess() {
    const addFarmSuccess = document.getElementById("addFarmSuccess");
    addFarmSuccess.style.display = "block"; // Set the container to be visible
    addFarmSuccess.classList.add("slide-up"); // Add the slide-up animation class

    // Hide the container after 2 seconds
    setTimeout(() => {
        hideAddFarmSuccess();
    }, 2000);
}

// Function to hide the floating container and trigger the slide-down animation
function hideAddFarmSuccess() {
    const addFarmSuccess = document.getElementById("addFarmSuccess");
    addFarmSuccess.classList.remove("slide-up"); // Remove the slide-up animation class
    addFarmSuccess.classList.add("slide-down"); // Add the slide-down animation class

    // Hide the container after the animation duration (1000ms)
    setTimeout(() => {
        addFarmSuccess.style.display = "none";
        addFarmSuccess.classList.remove("slide-down"); // Remove the slide-down animation class
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


finishDrawingButton.addEventListener('click', function () {
    if (draw) {
        draw.finishDrawing();
        map.removeInteraction(draw);
        isSketchActive = false;

        sketchFarmBtn.style.backgroundColor = "white";
        sketchFarmBtnIcon.textContent = "create";
        sketchFarmBtnIcon.style.color = "#515151";
        undoSketchBtn.style.display = "none";

        // Show all buttons again after drawing is finished
        showButtonsSkecthFarmInactive();

        finishDrawingButton.classList.add('hidden');

        // Show the clear all drawing button
        showButton('clearAllDrawingBtn');

        // After drawing is finished and the "finishDrawingButton" is clicked, show the floating container
        showAddFarmSuccess();

        // Hide the floating title
        const sketchingFarmFloatingTitle = document.querySelector('.sketchingFarmfloatingTitle');
        if (sketchingFarmFloatingTitle) {
            sketchingFarmFloatingTitle.style.display = "none";
        }

        // Add a delay of 2 seconds before showing the gridPropertiesContainer
        setTimeout(function () {
            const gridPropertiesContainer = document.getElementById('gridPropertiesContainer');

            // Apply the slide-down transition animation with fade-in effect
            gridPropertiesContainer.style.transition = 'transform 0.3s cubic-bezier(0.36, 0.66, 0.04, 1.0), opacity 0.3s cubic-bezier(0.36, 0.66, 0.04, 1.0), top 0.3s cubic-bezier(0.36, 0.66, 0.04, 1.0)';
            gridPropertiesContainer.style.transform = 'translateX(-50%) translateY(0)'; // Slide the container down
            gridPropertiesContainer.style.opacity = '1'; // Fade in the container
            gridPropertiesContainer.style.top = '0'; // Show the container at the top
            gridPropertiesContainer.style.display = 'block';
        }, 2500); // 2500 milliseconds = 2.5 seconds

        // Get the gridPatternInformation element
        const gridPatternInformation = document.querySelector('#gridPatternInformation');

        // Set the display property to flex to show the element
        gridPatternInformation.style.display = 'flex';
    }
});

function deactivateSketchFarm() {
    const sketchFarmBtn = document.getElementById("sketchFarmBtn");
    if (isSketchActive) {
        sketchFarmBtn.style.backgroundColor = "white";
        const sketchFarmBtnIcon = sketchFarmBtn.querySelector("i");
        sketchFarmBtnIcon.textContent = "create";
        sketchFarmBtnIcon.style.color = "#515151";

        if (draw) {
            map.removeInteraction(draw);
            draw = null;
        }

        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }

        isSketchActive = false;

        // Show all buttons again when deactivated
        showButtonsSkecthFarmInactive();
    }
}

document.getElementById("measureAreaBtn").addEventListener("click", deactivateSketchFarm);
document.getElementById("measureLengthBtn").addEventListener("click", deactivateSketchFarm);
document.getElementById("addSensorBtn").addEventListener("click", deactivateSketchFarm);

// Add event listener to sketchFarmBtn to show buttons when it's clicked to deactivate the function
document.getElementById("sketchFarmBtn").addEventListener("click", function () {
    if (!isSketchActive) {
        showButtonsSkecthFarmInactive();
    }

    // Send event to react native app
    if (window.ReactNativeWebView) {
        const message = { actionType: 'Drawing', event: isSketchActive ? 'click' : 'unclick' };
        window.ReactNativeWebView.postMessage(JSON.stringify(message));
    }
});

// Call this function to hide the floating container on map load
hideAddFarmSuccess();

// Load the Lottie animation when the document is ready
document.addEventListener("DOMContentLoaded", function () {
    // Replace "LRglt3SwZv.json" with the URL of your Lottie animation JSON file
    const animationURL = "https://lottie.host/52133049-24ce-4236-a7c1-0f11d4b03ace/LRglt3SwZv.json";
    const animationContainer = document.getElementById("farmsuccessAnimationCheck");
    const animation = lottie.loadAnimation({
        container: animationContainer,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: animationURL,
    });
});


let farmVectorLayer;
// Function to retrieve stored FARM POLYGON from local storage
function getStoredPolygon() {
    const storedPolygonString = localStorage.getItem('enfarm_polygon_coordinates');
    if (storedPolygonString) {
        const storedPolygon = JSON.parse(storedPolygonString);
        const polygonPoints = storedPolygon.polygonPoints.map(point => ol.proj.transform([point.lon, point.lat], 'EPSG:4326', 'EPSG:3857'));

        const polygonFeature = new ol.Feature({
            geometry: new ol.geom.Polygon([polygonPoints]),
        });

        const farmCenter = ol.proj.transform([storedPolygon.centerPoint.lon, storedPolygon.centerPoint.lat], 'EPSG:4326', 'EPSG:3857');

        const farmCenterFeature = new ol.Feature({
            geometry: new ol.geom.Point(farmCenter),
        });

        farmVectorLayer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: [polygonFeature, farmCenterFeature],
            }),
            style: [
                new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: 'rgba(56, 108, 52, 0.1)',
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#386c34',
                        width: 5,
                    }),
                }),
                new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 8,
                        fill: new ol.style.Fill({
                            color: '#386c34',
                        }),
                        stroke: new ol.style.Stroke({
                            color: 'white',
                            width: 4,
                        }),
                    }),
                    geometry: farmCenterFeature.getGeometry(),
                }),
            ],
        });

        vectorSource.addFeatures([polygonFeature, farmCenterFeature]); // Add both features to the vector source

        map.addLayer(farmVectorLayer);


        // Retrieve and display the farm's center point
        const farmCenterLon = storedPolygon.centerPoint.lon;
        const farmCenterLat = storedPolygon.centerPoint.lat;
        //console.log('Farm Center Lon:', farmCenterLon);
        //console.log('Farm Center Lat:', farmCenterLat);

        const centroid = ol.extent.getCenter(polygonFeature.getGeometry().getExtent());

        const tooltipElement = document.createElement('div');
        tooltipElement.style.cssText = `
        position: absolute;
        background-color: #ffffff;
        border: 1px solid #ccc;
        border-radius: 1000px;
        padding: 10px 10px;
        font-family: 'Be Vietnam Pro', Arial, sans-serif;
        font-size: 15px;
        font-weight: bold;
        color: #000000;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 90px;
        height: 20px;
        `;

        const area = Number(storedPolygon.area.squareMeters); // Convert area to a number
        const areaDisplay = area >= 10000 ? (area / 10000).toFixed(2) + 'ha' : area.toFixed(2) + ' m²';

        tooltipElement.innerHTML = `<span style="white-space: nowrap; display: flex; align-items: center; color: #515151;"><i class="fas fa-seedling" style="font-size: 20px; margin-right: 10px;"></i>${areaDisplay}</span>`;

        const tooltipOverlay = new ol.Overlay({
            element: tooltipElement,
            offset: [0, -55], //farm size label offset
            positioning: 'bottom-center',
        });

        tooltipOverlay.setPosition(centroid);

        map.addOverlay(tooltipOverlay);
        tooltipOverlays.push(tooltipOverlay);
    }
}

// Function to retrieve SQUARE grid features from local storage
function retrieveSquareGridFeatures() {
    const format = new ol.format.GeoJSON();

    const squareGridXFeaturesGeoJSONString = localStorage.getItem('squareGridX');
    const squareGridYFeaturesGeoJSONString = localStorage.getItem('squareGridY');

    if (squareGridXFeaturesGeoJSONString && squareGridYFeaturesGeoJSONString) {
        const squareGridXFeaturesGeoJSON = JSON.parse(squareGridXFeaturesGeoJSONString);
        const squareGridYFeaturesGeoJSON = JSON.parse(squareGridYFeaturesGeoJSONString);

        const squareGridXFeatures = squareGridXFeaturesGeoJSON.map(feature => format.readFeature(feature));
        const squareGridYFeatures = squareGridYFeaturesGeoJSON.map(feature => format.readFeature(feature));

        const squareGridX = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: squareGridXFeatures
            }),
            style: new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'white',
                    width: 4
                })
            }),
            minZoom: 19
        });

        const squareGridY = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: squareGridYFeatures
            }),
            style: new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'white',
                    width: 4
                })
            }),
            minZoom: 19
        });

        map.addLayer(squareGridX);
        map.addLayer(squareGridY);

    } else {
        //console.log('Either squareGridX or squareGridY features not found in local storage.');
    }
}

// Call the function to retrieve and display the stored square grid
retrieveSquareGridFeatures();

// Call the function to retrieve and display the stored polygon
getStoredPolygon();

// Function to retrieve RECTANGULAR grid features from local storage
function retrieveRectangularGridFeatures() {
    const format = new ol.format.GeoJSON();

    const rectangularGridXFeaturesGeoJSONString = localStorage.getItem('rectangularGridX');
    const rectangularGridYFeaturesGeoJSONString = localStorage.getItem('rectangularGridY');

    if (rectangularGridXFeaturesGeoJSONString && rectangularGridYFeaturesGeoJSONString) {
        const rectangularGridXFeaturesGeoJSON = JSON.parse(rectangularGridXFeaturesGeoJSONString);
        const rectangularGridYFeaturesGeoJSON = JSON.parse(rectangularGridYFeaturesGeoJSONString);

        const rectangularGridXFeatures = rectangularGridXFeaturesGeoJSON.map(feature => format.readFeature(feature));
        const rectangularGridYFeatures = rectangularGridYFeaturesGeoJSON.map(feature => format.readFeature(feature));

        const rectangularGridX = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: rectangularGridXFeatures
            }),
            style: new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'white',
                    width: 4
                })
            }),
            minZoom: 19
        });

        const rectangularGridY = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: rectangularGridYFeatures
            }),
            style: new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'white',
                    width: 4
                })
            }),
            minZoom: 19
        });

        map.addLayer(rectangularGridX);
        map.addLayer(rectangularGridY);

    } else {
        //console.log('Either rectangularGridX or rectangularGridY features not found in local storage.');
    }
}

// Call the function to retrieve and display the stored rectangular grid
retrieveRectangularGridFeatures();

// Call the function to retrieve and display the stored polygon
getStoredPolygon();


// Function to retrieve TRIANGULAR grid features from local storage
function retrieveTriangularGridFeatures() {
    const format = new ol.format.GeoJSON();

    const triangularGridFeaturesGeoJSONString = localStorage.getItem('triangularGrid');

    if (triangularGridFeaturesGeoJSONString) {
        const triangularGridFeaturesGeoJSON = JSON.parse(triangularGridFeaturesGeoJSONString);

        const triangularGridFeatures = triangularGridFeaturesGeoJSON.map(feature => format.readFeature(feature));

        const triangularGrid = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: triangularGridFeatures
            }),
            style: new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'white',
                    width: 4
                })
            }),
            minZoom: 19
        });

        map.addLayer(triangularGrid);

    } else {
        //console.log('Triangular grid features not found in local storage.');
    }
}

// Call the function to retrieve and display the stored triangular grid
retrieveTriangularGridFeatures();

// Call the function to retrieve and display the stored polygon
getStoredPolygon();


//Function to retrieve Square Intersection Points
function retrieveSquareGridIntersectionPoints() {
    const format = new ol.format.GeoJSON();
    const intersectionPointsGeoJSONString = localStorage.getItem('squareGridIntersectionPoints');

    if (intersectionPointsGeoJSONString) {
        const intersectionPointsGeoJSON = JSON.parse(intersectionPointsGeoJSONString);
        const intersectionPointsFeatures = intersectionPointsGeoJSON.map(feature => format.readFeature(feature));

        const squareGridIntersectionPoints = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: intersectionPointsFeatures
            }),
            style: (feature) => {
                const zoom = map.getView().getZoom();
                const isZoom21AndAbove = zoom > 22;

                if (isZoom21AndAbove) {
                    return new ol.style.Style({
                        image: new ol.style.Icon({
                            src: 'https://i.ibb.co/hDYvzYs/icons8-tree-64.png',
                            scale: .5,
                        }),
                        stroke: new ol.style.Stroke({
                            color: 'white',
                            width: 1,
                        }),
                        fill: new ol.style.Fill({
                            color: 'green',
                        }),
                    });
                } else {
                    // Return null style for zoom levels below 21
                    return null;
                }
            }
        });

        map.addLayer(squareGridIntersectionPoints);
    } else {
        //console.log('Square grid intersection points not found in local storage.');
    }
}

retrieveSquareGridIntersectionPoints();

//Function to retrieve Rectangular Intersection Points
function retrieveRectangularGridIntersectionPoints() {
    const format = new ol.format.GeoJSON();
    const intersectionPointsGeoJSONString = localStorage.getItem('rectangularGridIntersectionPoints');

    if (intersectionPointsGeoJSONString) {
        const intersectionPointsGeoJSON = JSON.parse(intersectionPointsGeoJSONString);
        const intersectionPointsFeatures = intersectionPointsGeoJSON.map(feature => format.readFeature(feature));

        const rectangularGridIntersectionPoints = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: intersectionPointsFeatures
            }),
            style: (feature) => {
                const zoom = map.getView().getZoom();
                const isZoom21AndAbove = zoom > 22;

                if (isZoom21AndAbove) {
                    return new ol.style.Style({
                        image: new ol.style.Icon({
                            src: 'https://i.ibb.co/hDYvzYs/icons8-tree-64.png',
                            scale: .5,
                        }),
                        stroke: new ol.style.Stroke({
                            color: 'white',
                            width: 1,
                        }),
                        fill: new ol.style.Fill({
                            color: 'green',
                        }),
                    });
                } else {
                    return null; // Hide for zoom levels below 21
                }
            }
        });

        map.addLayer(rectangularGridIntersectionPoints);
    } else {
        //console.log('Rectangular grid intersection points not found in local storage.');
    }
}

retrieveRectangularGridIntersectionPoints();


//Function to retreieve Triangular Intersection Points
function retrieveTriangularGridIntersectionPoints() {
    const format = new ol.format.GeoJSON();
    const intersectionPointsGeoJSONString = localStorage.getItem('triangularGridIntersectionPoints');

    if (intersectionPointsGeoJSONString) {
        const intersectionPointsGeoJSON = JSON.parse(intersectionPointsGeoJSONString);
        const intersectionPointsFeatures = intersectionPointsGeoJSON.map(feature => format.readFeature(feature));

        const triangularGridIntersectionPoints = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: intersectionPointsFeatures
            }),
            style: (feature) => {
                const zoom = map.getView().getZoom();
                const isZoom21AndAbove = zoom > 22;

                if (isZoom21AndAbove) {
                    return new ol.style.Style({
                        image: new ol.style.Icon({
                            src: 'https://i.ibb.co/hDYvzYs/icons8-tree-64.png',
                            scale: .5,
                        }),
                        stroke: new ol.style.Stroke({
                            color: 'white',
                            width: .5,
                        }),
                        fill: new ol.style.Fill({
                            color: 'green',
                        }),
                    });
                } else {
                    return null; // Hide for zoom levels below 21
                }
            }
        });

        map.addLayer(triangularGridIntersectionPoints);
    } else {
        //console.log('Triangular grid intersection points not found in local storage.');
    }
}
retrieveTriangularGridIntersectionPoints();


/*function displayIntersectionPoints(points, color) {
    const format = new ol.format.GeoJSON();

    const features = points.map(point => format.readFeature(point));

    const vectorLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: features
        }),
        style: new ol.style.Style({
            image: new ol.style.Circle({
                radius: 10,
                fill: new ol.style.Fill({
                    color: color
                }),
                stroke: new ol.style.Stroke({
                    color: 'white',
                    width: 2
                })
            })
        })
    });

    map.addLayer(vectorLayer);
}

function retrieveIntersectionPoints() {
    const squareGridIntersectionPointsString = localStorage.getItem('squareGridIntersectionPoints');
    const rectangularGridIntersectionPointsString = localStorage.getItem('rectangularGridIntersectionPoints');
    const triangularGridIntersectionPointsString = localStorage.getItem('triangularGridIntersectionPoints');

    if (squareGridIntersectionPointsString) {
        const squareGridIntersectionPoints = JSON.parse(squareGridIntersectionPointsString);
        // Display squareGridIntersectionPoints using black style
        displayIntersectionPoints(squareGridIntersectionPoints, 'black');
    } else {
        console.log('Square grid intersection points not found in local storage.');
    }

    if (rectangularGridIntersectionPointsString) {
        const rectangularGridIntersectionPoints = JSON.parse(rectangularGridIntersectionPointsString);
        // Display rectangularGridIntersectionPoints using black style
        displayIntersectionPoints(rectangularGridIntersectionPoints, 'black');
    } else {
        console.log('Rectangular grid intersection points not found in local storage.');
    }

    if (triangularGridIntersectionPointsString) {
        const triangularGridIntersectionPoints = JSON.parse(triangularGridIntersectionPointsString);
        // Display triangularGridIntersectionPoints using black style
        displayIntersectionPoints(triangularGridIntersectionPoints, 'black');
    } else {
        console.log('Triangular grid intersection points not found in local storage.');
    }
}

// Call the function to retrieve and display the stored intersection points
retrieveIntersectionPoints();*/



// Define and initialize centerPointCoordinates
let centerPointCoordinates = [];

// Define and initialize segmentLengths
let segmentLengths = [];

// Define and initialize area
let area;

// Define and initialize areaHectares
let areaHectares;

let address


// Update the finishDrawingButton click event to store the polygon in local storage
finishDrawingButton.onclick = function () {
    if (draw) {
        draw.finishDrawing();
        finishDrawingButton.classList.add('hidden');
        map.removeInteraction(draw);
        isSketchActive = false;
        sketchFarmBtn.style.backgroundColor = 'white';
        sketchFarmBtnIcon.textContent = 'create';
        sketchFarmBtnIcon.style.color = '#515151';
        undoSketchBtn.style.display = "none";

        // Store polygon coordinates in local storage
        const polygonGeometry = vectorSource.getFeatures()[0].getGeometry();
        const polygonCoordinates = polygonGeometry.getCoordinates();

        // Ensure polygonCoordinates is an array
        const polygonCoordinatesArray = Array.isArray(polygonCoordinates)
            ? polygonCoordinates
            : polygonCoordinates[0];

        const polygonPoints = polygonCoordinatesArray.map(coordinate => {
            const lonLat = ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326');
            return { lon: lonLat[0], lat: lonLat[1] };
        });

        const storedPolygon = {
            centerPoint: {
                lon: centerPointCoordinates[0],
                lat: centerPointCoordinates[1],
            },
            polygonPoints: polygonPoints,
            segmentLengths: segmentLengths,
            area: {
                squareMeters: area ? area.toFixed(2) : undefined, // Use the defined area variable
                hectares: areaHectares,
            },
            address: address,
        };
        localStorage.setItem('enfarm_polygon_coordinates', JSON.stringify(storedPolygon));
    }
};

// Remove the stored polygon from local storage when the page loads
window.addEventListener('load', function () {
    if (!localStorage.getItem('enfarm_polygon_coordinates')) {
        if (farmVectorLayer) { // Add a check before removing the farmVectorLayer
            map.removeLayer(farmVectorLayer);
            farmVectorLayer = null;
        }
        for (const overlay of tooltipOverlays) {
            map.removeOverlay(overlay);
        }
        tooltipOverlays = [];
    }
});


////////// <----- CLEAR ALL DRAWINGS BUTTON FUNCTION (FARM SKETCH AND SENSORS) -----> \\\\\\\\\\

let gridX;
let gridY;

function clearAllDrawings() {
    // Show the dialog box
    const dialog = document.getElementById("dialog");
    dialog.classList.remove("hidden");

    // Handle the button clicks
    const deleteYesBtn = document.getElementById("deleteYes");
    const deleteNoBtn = document.getElementById("deleteNo");

    deleteYesBtn.addEventListener("click", function () {
        // Remove stored polygon from local storage
        localStorage.removeItem("enfarm_polygon_coordinates");

        // Clear vector source and remove all features
        vectorSource.clear();

        // Remove farmVectorLayer from the map
        if (farmVectorLayer) {
            map.removeLayer(farmVectorLayer);
            farmVectorLayer = null;
        }

        // Remove tooltip overlays from the map
        for (const overlay of tooltipOverlays) {
            map.removeOverlay(overlay);
        }
        tooltipOverlays = [];

        // Remove stored sensor points from local storage
        localStorage.removeItem("enfarm_sensor_coordinates");

        for (let i = 0; i < 5; i++) {
            // Remove all vector layers from the map in the first sweep
            map.getLayers().forEach(layer => {
                if (layer instanceof ol.layer.Vector) {
                    map.removeLayer(layer);
                }
            });
        }

        // Dismiss the gridPatternInformation element
        const gridPatternInformation = document.getElementById("gridPatternInformation");
        gridPatternInformation.style.display = "none";

        // Dismiss the gridPropertiesContainer element
        //gridPropertiesContainer.style.display = "none"; 

        gridPropertiesContainer.classList.remove('visible');



        // Get the last selected grid type from local storage before removing it
        const lastSelectedGridType = localStorage.getItem('lastSelectedGridType');


        // Remove stored gridX and gridY points from local storage
        localStorage.removeItem("squareGridX");
        localStorage.removeItem("squareGridY");

        // Remove stored gridX and gridY points from local storage
        localStorage.removeItem("rectangularGridX");
        localStorage.removeItem("rectangularGridY");

        // Remove stored triangularGrid from local storage
        localStorage.removeItem("triangularGrid");

        localStorage.removeItem("triangularGridIntersectionPoints");
        localStorage.removeItem("squareGridIntersectionPoints");
        localStorage.removeItem("rectangularGridIntersectionPoints");


        // Remove last selected intersection count, gridX count, gridY count, grid type, and intersection type
        localStorage.removeItem('lastSelectedIntersectionCount');
        localStorage.removeItem('lastSelectedGridXCount');
        localStorage.removeItem('lastSelectedGridYCount');
        localStorage.removeItem('lastSelectedGridType');
        localStorage.removeItem('lastSelectedGridIntersectionType');

        // If the last selected grid type was triangularGrid, remove the GridZ count
        if (lastSelectedGridType === 'triangularGrid') {
            localStorage.removeItem('lastSelectedGridZCount');
        }

        // Hide the gridInfoPill element
        const gridInfoPill = document.getElementById("gridInfoPill");
        gridInfoPill.style.display = "none"; // Set display to "none" to hide the element

        // Hide the dialog box
        dialog.classList.add("hidden");

        // Update the visibility of clearAllDrawingBtn
        updateClearButtonVisibility();

        // Clear console log
        console.clear();
    });

    deleteNoBtn.addEventListener("click", function () {
        // Hide the dialog box
        dialog.classList.add("hidden");
    });
}

function updateClearButtonVisibility() {
    const clearAllDrawingBtn = document.getElementById("clearAllDrawingBtn");
    const storedPolygons = localStorage.getItem("enfarm_polygon_coordinates");
    const storedPoints = localStorage.getItem("enfarm_sensor_coordinates");

    if (storedPolygons || storedPoints) {
        clearAllDrawingBtn.style.display = "block";
    } else {
        clearAllDrawingBtn.style.display = "none";
    }
}

// Attach the event listener to the clearAllDrawingBtn button
const clearAllDrawingBtn = document.getElementById("clearAllDrawingBtn");
clearAllDrawingBtn.addEventListener("click", clearAllDrawings);

// Call the updateClearButtonVisibility function initially and whenever you add or remove polygons or points
// For example, after adding a polygon or point:
updateClearButtonVisibility();

// Inside the deletePoints function:
function deletePoints() {
    if (sensorVectorLayer) {
        const source = sensorVectorLayer.getSource();
        source.clear();
        updateClearButtonVisibility(); // Update button visibility after clearing the points
    }
}

// Inside the clearAllDrawings function, after clearing all drawings:
updateClearButtonVisibility(); // Update button visibility after clearing all drawings

// Check if there are stored polygons when the page loads
window.addEventListener("load", function () {
    const storedPolygons = localStorage.getItem("enfarm_polygon_coordinates");
    if (storedPolygons) {
        updateClearButtonVisibility();
    }
});

// Load the Lottie animation when the document is ready
document.addEventListener("DOMContentLoaded", function () {
    const animationURL = "https://lottie.host/2d84733d-de2c-4e15-9280-a0c02ef6ae0d/ZDmGcxs6ND.json";
    const animationContainer = document.getElementById("deleteAnimationContainer");
    const animation = lottie.loadAnimation({
        container: animationContainer,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: animationURL,
    });

    // Play the animation once when needed
    function playAnimationOnce() {
        animation.play();
    }

    // After 1 second, set loop to false to play the animation only once
    setTimeout(function () {
        animation.loop = true;
    }, 3000);
});


//////////// <----- START FUNCTION: RETRIEVE STORED VALUES AND SHOW ON GRID INFO PILL ON RELOAD -----> \\\\\\\\\\
window.addEventListener('load', function () {
    // Delay the execution by 2 seconds
    setTimeout(function () {
        // Retrieve the saved counts and grid type
        const lastSelectedGridType = localStorage.getItem('lastSelectedGridType');
        const lastSelectedIntersectionCount = localStorage.getItem('lastSelectedIntersectionCount');
        const lastSelectedGridXCount = localStorage.getItem('lastSelectedGridXCount');
        const lastSelectedGridYCount = localStorage.getItem('lastSelectedGridYCount');
        const lastSelectedGridZCount = localStorage.getItem('lastSelectedGridZCount');

        // Check if the values are present in the storage
        if (lastSelectedGridType && lastSelectedIntersectionCount && lastSelectedGridXCount && lastSelectedGridYCount) {
            // Log the counts to the console
            console.log(`Intersection count: ${lastSelectedIntersectionCount}`);
            console.log(`GridX count: ${lastSelectedGridXCount}`);
            console.log(`GridY count: ${lastSelectedGridYCount}`);
            console.log(`GridZ count: ${lastSelectedGridZCount}`);

            // Update the HTML elements with the retrieved counts
            document.getElementById('intersectionCount').textContent = lastSelectedIntersectionCount;
            document.getElementById('gridXCount').textContent = lastSelectedGridXCount;
            document.getElementById('gridYCount').textContent = lastSelectedGridYCount;

            // Remove the hidden class from the main container
            document.getElementById('gridInfoPill').classList.remove('hidden');

            // If the grid type is not triangularGrid, hide the pillZCount
            if (lastSelectedGridType !== 'triangularGrid') {
                document.getElementById('pillZCount').style.display = 'none';
            } else {
                // Check if lastSelectedGridZCount is not null before showing
                if (lastSelectedGridZCount !== null) {
                    document.getElementById('pillZCount').classList.remove('hidden');
                    document.getElementById('gridZCount').textContent = lastSelectedGridZCount;
                }
            }
        }
    }, 2000); // Delay time in milliseconds (2000ms = 2 seconds)
});

//////////// <----- END FUNCTION: RETRIEVE STORED VALUES AND SHOW ON GRID INFO PILL ON RELOAD -----> \\\\\\\\\\

//////////// <----- START FUNCTION TO HIDE THE GRID INFO PILL WHEN THE FARM POLYGON IS OUT OF SIGHT -----> \\\\\\\\\\
// Variable to track if the counting effect has been initiated
let countingEffectInitiated = false;

// Function to check if the farm vector layer is visible in the current view
function isFarmVectorLayerVisible() {
    if (!farmVectorLayer) {
        return false;
    }
    const viewExtent = map.getView().calculateExtent(map.getSize());
    const features = farmVectorLayer.getSource().getFeatures();
    let isVisible = false;
    features.forEach((feature) => {
        const featureExtent = feature.getGeometry().getExtent();
        if (ol.extent.intersects(viewExtent, featureExtent)) {
            isVisible = true;
        }
    });
    return isVisible;
}

// Function to update the visibility of the grid info pill based on the farm vector layer visibility
function updateGridInfoPillVisibility() {
    if (isFarmVectorLayerVisible()) {
        // Delay showing the element by 2 seconds
        setTimeout(function () {
            document.getElementById('gridInfoPill').style.display = 'flex'; // Show the element

            // If the counting effect hasn't been initiated, start it
            if (!countingEffectInitiated) {
                // Start the fast counting effects for each value
                const intersectionCount = parseInt(localStorage.getItem('lastSelectedIntersectionCount')) || 0;
                startFastCountingEffect('intersectionCount', intersectionCount);

                const gridXCountValue = parseInt(localStorage.getItem('lastSelectedGridXCount')) || 0;
                startFastCountingEffect('gridXCount', gridXCountValue);

                const gridYCountValue = parseInt(localStorage.getItem('lastSelectedGridYCount')) || 0;
                startFastCountingEffect('gridYCount', gridYCountValue);

                // If you have GridZ count:
                const gridZCountValue = parseInt(localStorage.getItem('lastSelectedGridZCount')) || 0;
                if (gridZCountValue) {
                    startFastCountingEffect('triangularGridZCount', gridZCountValue);
                }

                // Mark the counting effect as initiated
                countingEffectInitiated = true;
            }
        }, 2000); // 2-second delay
    } else {
        document.getElementById('gridInfoPill').style.display = 'none'; // Hide the element
    }
}

// Function to create a counting effect
function startFastCountingEffect(targetElementId, finalValue) {
    const targetElement = document.getElementById(targetElementId);
    let currentValue = 0;
    const increment = Math.ceil(finalValue / 25); // Divide into 50 increments
    const interval = setInterval(function () {
        currentValue += increment;
        targetElement.textContent = currentValue;
        if (currentValue >= finalValue) {
            clearInterval(interval);
            targetElement.textContent = finalValue; // Ensure final value is accurate
        }
    }, 50); // Delay between increments (50 milliseconds)
}

// Check if the required information is present in local storage
const intersectionCount = localStorage.getItem('lastSelectedIntersectionCount');
if (intersectionCount) {
    // Attach the listener to the view change event
    map.getView().on('change', updateGridInfoPillVisibility);

    // Call the function once to set the initial visibility
    updateGridInfoPillVisibility();

    // Call the function again after a short delay to ensure visibility on mobile browsers
    setTimeout(updateGridInfoPillVisibility, 500); // 0.5-second delay
}
//////////// <----- END FUNCTION TO HIDE THE GRID INFO PILL WHEN THE FARM POLYGON IS OUT OF SIGHT -----> \\\\\\\\\\



///<!-- More Info button for Grid Containers Properties --->

function toggleMoreInfoWindow() {
    var moreInfoWindow = document.getElementById("moreInfoGridPropertiesWindow");
    if (moreInfoWindow.style.display === "none" || moreInfoWindow.style.display === "") {
        moreInfoWindow.style.display = "block";
    } else {
        moreInfoWindow.style.display = "none";
    }
}

//Dismiss Window Button
function hideGrid() {
    var grid = document.getElementById("moreInfoGridPropertiesWindow");
    grid.style.display = "none";
}


// Move the JavaScript code inside the window.onload function
window.onload = function () {
    // Get a reference to the floating titles
    const measureAreaFloatingTitle = document.querySelector('.measuringAreafloatingTitle');
    const measureLengthFloatingTitle = document.querySelector('.measuringLengthfloatingTitle');
    const sketchingFarmFloatingTitle = document.querySelector('.sketchingFarmfloatingTitle');
    const addSensorsFloatingTitle = document.querySelector('.addSensorsfloatingTitle');
}

// For Listening to react native app data
window.addEventListener("message", message => {
    try {
        const jsonData = JSON.parse(message.data);
        if (jsonData) {
            const { actionType, event } = jsonData;
            if (actionType === 'Search') {
                if (event === 'close') {
                    searchBtn.style.display = "block";
                    searchBar.style.display = "none";
                    searchInput.value = "";
                    suggestionsContainer.style.display = "none";
                }
            }
            if (actionType === 'Drawing') {
                if (event === 'click') {
                    isSketchActive = true;
                    startSketchFarm();
                }
            }
        }
    } catch (e) {
        console.log(e);
    }
});



////////// <----- BASEMAP SWITCHER BUTTON FUNCTION -----> \\\\\\\\\\

function cycleBasemap() {
    const basemapSelector = document.getElementById("basemapSelector");

    if (basemapSelector.style.display === "block") {
        // If basemapSelector is already displayed, dismiss it
        basemapSelector.style.transform = "translateX(-50%) translateY(100%)";
        setTimeout(() => {
            basemapSelector.style.display = "none";
        }, 300);
    } else {
        // If basemapSelector is not displayed, call it
        basemapSelector.style.display = "block";

        // Move the basemapSelector up slightly to avoid scrolling
        basemapSelector.style.transform = "translateX(-50%) translateY(-10px)";

        // Trigger the animation by setting the transform property to 0
        setTimeout(() => {
            basemapSelector.style.transform = "translateX(-50%) translateY(0)";
        }, 0);
    }
}

// Basemap Selection
const mapElement = document.getElementById("map");

// Basemap Layers
/*MapBox Imagery Basemap*/
const satelliteLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url: 'https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY21sb3NhcmlhIiwiYSI6ImNsZGJ4cHp2ajAwMGszb3FmeXpxYmVpMHkifQ.3wsPFc9FkszxcH27eEq2dw',
        tileSize: 512,
        maxZoom: 22,
        attribution: '© <a href="https://www.mapbox.com">Mapbox</a>',
        crossOrigin: 'anonymous'
    }),
    visible: false // set visibility to false initially
});

/*OSM Default Basemap
const streetLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url: "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attributions: '© <a href="https://www.openstreetmap.org">OpenStreetMap</a> contributors',
        maxZoom: 19,
    }),
    visible: false // set visibility to true initially for default basemap
});*/


/*MapTiler Terrain*/
const streetLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
        //url: "https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}@2x.png?key=ygYhKJ5CVp94V87ZZ49x",
        url: "https://api.maptiler.com/maps/topo-v2/256/{z}/{x}/{y}@2x.png?key=ygYhKJ5CVp94V87ZZ49x",
        //url: "https://api.maptiler.com/maps/outdoor-v2/256/{z}/{x}/{y}@2x.png?key=ygYhKJ5CVp94V87ZZ49x",
        attributions: '© <a href="https://www.maptiler.com">MapTiler</a> contributors',
        maxZoom: 19,
    }),
    visible: true // set visibility to true initially for the new basemap
});


/*MapTiler Street
/*const streetLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url: "https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=fbV6AyWrR3xmdPjUVtzn",
        attributions: '© <a href="https://www.maptiler.com/">MapTiler</a> | © <a href="https://www.openstreetmap.org">OpenStreetMap</a> contributors',
        maxZoom: 19,
    }),
    visible: true // set visibility to true initially for default basemap
});*/


// Add a new layer for the GEBCO WMS
const gebcoLayer = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: 'https://www.gebco.net/data_and_products/gebco_web_services/web_map_service/mapserv?',
        params: {
            'LAYERS': 'GEBCO_LATEST',
            'VERSION': '1.3.0',
            'FORMAT': 'image/png'
        }
    }),
    visible: false // set visibility to false initially
});

const carbonLayer = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: "https://maps.isric.org/mapserv?map=/map/ocs.map&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&BBOX=-19948500.0,-6147449.0951699,19688885.757062882,8361000.0&CRS=EPSG:152160&WIDTH=1426&HEIGHT=895&LAYERS=ocs_0-30cm_mean&STYLES=&FORMAT=application/openlayers",
    }),
    visible: false // set visibility to false initially
});

const phLayer = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: "https://maps.isric.org/mapserv?map=/map/phh2o.map",
        params: { 'LAYERS': 'phh2o_0-5cm_mean' },
        projection: "EPSG:152160"
    }),
    visible: false
});

const nitrogenLayer = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: "https://maps.isric.org/mapserv?map=/map/nitrogen.map",
        params: { 'LAYERS': 'nitrogen_0-5cm_mean' },
        projection: "EPSG:152160"
    }),
    visible: false
});


/*// Initialize the map
const map = new ol.PerspectiveMap({
    target: mapElement,
    layers: [satelliteLayer, streetLayer, gebcoLayer, carbonLayer, phLayer, nitrogenLayer],
    view: new ol.View({
        center: ol.proj.fromLonLat([108.03769776610962, 12.670282155975897]), // Center of Buon Ma Thuot
        zoom: 17,
        //rotation: Math.PI / 4, // Rotate the map 45 degrees (in radians)
    }),
    controls: [],
});*/



// Define map as a let variable to allow reassignment
let map = new ol.Map({
    target: 'map',
    view: new ol.View({
        zoom: 17,
        center: ol.proj.fromLonLat([108.03769776610962, 12.670282155975897]),
        //rotation: Math.PI / 4, // Rotate the map 45 degrees (in radians)
    }),
    layers: [satelliteLayer, streetLayer, gebcoLayer, carbonLayer, phLayer, nitrogenLayer],
    controls: [],

});

map.on('change:perspective', function (e) {
    if (!e.animating) $('#angle').val(e.angle);
})


let currentBasemap = 1;
const basemaps = [streetLayer, satelliteLayer, gebcoLayer, carbonLayer, phLayer, nitrogenLayer];

function selectBasemap(index) {
    if (!basemaps[index].getVisible()) {
        basemaps.forEach((layer, i) => {
            layer.setVisible(i === index);
        });

        currentBasemap = index;

        // Update the basemap title in the floating container
        const basemapTitleElement = document.querySelector(".basemapfloatingTitle");
        const basemapTitles = [
            "Đường phố", //street
            "Vệ tinh", //imagery
            "Địa Hình", //elevation
            "Tín chỉ Các bon", //carbon
            "Bản đồ pH",//pH
            "Bản đồ Ni tơ", //nitro
        ];
        const basemapTitleText = basemapTitles[index];

        let iconURL;
        switch (index) {
            case 0:
                iconURL = "https://i.ibb.co/F4dSJw6/bm-street-circle.png";
                break;
            case 1:
                iconURL = "https://i.ibb.co/VqnqvQq/bm-imagery-circle.png";
                break;
            case 2:
                iconURL = "https://i.ibb.co/TWX3D3k/bm-elev-circle.png"; //elevation
                break;
            case 3:
                iconURL = "https://i.ibb.co/YRVWZsC/bm-carbon-circle.png";
                break;
            case 4:
                iconURL = "https://i.ibb.co/QbvJ9F2/bm-ph-circle.png";
                break;
            case 5:
                iconURL = "https://i.ibb.co/RcNw7KX/bm-nitrogen-circle.png";
                break;
            default:
                // Default icon URL if index is out of bounds
                iconURL = "default_icon_url.png";
        }

        basemapTitleElement.innerHTML = `
<img src="${iconURL}" style="width: 20px; height: 20px; padding-right: 10px;">
<span class="basemapTitle" style="display: inline-block;">${basemapTitleText}</span>
`;

        const logoElement = document.querySelector(".enfarmLogo");
        const logoImage =
            basemaps[currentBasemap] === satelliteLayer
                ? "https://i.ibb.co/J3YP1x4/enfarm-4.png"
                : "https://i.ibb.co/LCK5s6V/en-Farm-logo-6-2x.png";
        logoElement.src = logoImage;

        // Show the basemap title container when selecting another basemap
        basemapTitleElement.style.display = "flex";

        // Clear the existing timeout and set a new one to hide the title container after 5 seconds
        if (basemapTitleElement.timerId) {
            clearTimeout(basemapTitleElement.timerId);
        }
        basemapTitleElement.timerId = setTimeout(() => {
            basemapTitleElement.style.display = "none";
        }, 5000);
    }

    const basemapImages = document.querySelectorAll(".image-container > div");
    basemapImages.forEach((image, i) => {
        const circle = image.querySelector(".selected-basemap-circle");
        image.classList.toggle("selected", i === index);
        circle.style.display = i === index ? "block" : "none";
    });

    const basemapSelector = document.getElementById("basemapSelector");
    basemapSelector.style.transform = "translateX(-50%) translateY(0)";

    setTimeout(() => {
        basemapSelector.style.display = "none";
    }, 500);
}

// Set the initial basemap title in the floating container to the default basemap "Đường phố"
const defaultBasemapIndex = 0;
selectBasemap(defaultBasemapIndex);

// Hide the basemap title container after 2 seconds from map load
document.addEventListener("DOMContentLoaded", () => {
    const basemapTitleElement = document.querySelector(".basemapfloatingTitle");
    basemapTitleElement.timerId = setTimeout(() => {
        basemapTitleElement.style.display = "none";
    }, 2000);
});

// Set the initial basemap title on DOMContentLoaded
window.addEventListener("DOMContentLoaded", function () {
    const basemapTitleElement = document.querySelector(".basemapTitle");
    basemapTitleElement.textContent = "Đường phố";
});

// Add event listeners to basemap images to trigger selectBasemap function
const basemapImages = document.querySelectorAll(".image-container > div");
basemapImages.forEach((image, index) => {
    image.addEventListener("click", () => {
        selectBasemap(index);
    });
});

const defaultBasemapImage = basemapImages[0];
const defaultBasemapCircle = defaultBasemapImage.querySelector(".selected-basemap-circle");
defaultBasemapCircle.style.display = "block";

window.addEventListener("DOMContentLoaded", function () {
    const basemapSelector = document.getElementById("basemapSelector");
    basemapSelector.style.display = "none";
});

function closeBasemapSelector() {
    const basemapSelector = document.getElementById("basemapSelector");
    basemapSelector.style.transform = "translateX(-50%) translateY(100%)";
    setTimeout(() => {
        basemapSelector.style.display = "none";
    }, 300);
}


// Function to switching ISRIC legends based on ISRIC basemaps
// Function to handle layer visibility change and display legend elements
function handleLayerVisibilityChange(layer, legendClass, closeLegendClass, closeLegendIconClass) {
    const legendElement = document.querySelector(legendClass);
    const closeLegendElement = document.querySelector(closeLegendClass);
    const closeLegendIconElement = document.querySelector(closeLegendIconClass);

    return function () {
        if (layer.getVisible()) {
            legendElement.style.display = 'block';
            closeLegendElement.style.display = 'block';
            closeLegendIconElement.style.display = 'block';
        } else {
            legendElement.style.display = 'none';
            closeLegendElement.style.display = 'none';
            closeLegendIconElement.style.display = 'none';
        }
    };
}

// When carbonLayer basemap is called
carbonLayer.on('change:visible', handleLayerVisibilityChange(carbonLayer, '.carbonLegend', '.closecarbonLegend', '.closecarbonLegend i'));

// When phLayer basemap is called
phLayer.on('change:visible', handleLayerVisibilityChange(phLayer, '.phLegend', '.closepHLegend', '.closepHLegend i'));

// When nitrogenLayer basemap is called
nitrogenLayer.on('change:visible', handleLayerVisibilityChange(nitrogenLayer, '.nitrogenLegend', '.closenitrogenLegend', '.closenitrogenLegend i'));




///// Basemap Attribution \\\\\
function closeAttribution(attributionClass) {
    var attribution = document.querySelector(attributionClass);
    attribution.style.display = 'none';
}

function openAttribution(attributionClass) {
    var attribution = document.querySelector(attributionClass);
    attribution.style.display = 'block';
}

function stopBasemapSwitch(event) {
    event.stopPropagation();
}

const infoIcons = document.querySelectorAll(".info-icon, .osminfo-icon, .mapboxinfo-icon, .gebcoinfo-icon");
infoIcons.forEach((infoIcon) => {
    let attributionClass;
    if (infoIcon.classList.contains("info-icon")) {
        attributionClass = ".isric-attribution";
    } else if (infoIcon.classList.contains("osminfo-icon")) {
        attributionClass = ".osm-attribution";
    } else if (infoIcon.classList.contains("mapboxinfo-icon")) {
        attributionClass = ".mapbox-attribution";
    } else if (infoIcon.classList.contains("gebcoinfo-icon")) {
        attributionClass = ".gebco-attribution";
    }
    infoIcon.addEventListener("click", () => openAttribution(attributionClass));
    infoIcon.addEventListener("click", stopBasemapSwitch);
});


// Dismiss the Terrain Legend
const terrainLegend = document.getElementById("terrainlegend");
const closeTerrainLegend = document.querySelector(".closeterrainLegend");

// Function to dismiss the terrainlegend
const dismissTerrainLegend = () => {
    terrainLegend.style.display = "none";
};

// Function to show the terrainlegend
const showTerrainLegend = () => {
    terrainLegend.style.display = "block";
};

// Add click event listener to the closeTerrainLegend
closeTerrainLegend.addEventListener("click", dismissTerrainLegend);

// Listen for change in basemap visibility
gebcoLayer.on("change:visible", () => {
    if (gebcoLayer.getVisible()) {
        showTerrainLegend();
    } else {
        dismissTerrainLegend();
    }
});

//Display ISRIC Maps Legend
function addCloseEventListener(elementId, targetId) {
    document.querySelector(elementId).addEventListener('click', function () {
        document.getElementById(targetId).style.display = 'none';
    });
}

addCloseEventListener('.closecarbonLegend', 'carbonlegend');
addCloseEventListener('.closepHLegend', 'pHlegend');
addCloseEventListener('.closenitrogenLegend', 'nitrogenlegend');


//Basemap Legend background changes to transparent when user scrolls
function changeBackgroundColorOnScroll() {
    // Get the legend containers
    const carbonLegend = document.querySelector('.carbonLegend');
    const nitrogenLegend = document.querySelector('.nitrogenLegend');
    const phLegend = document.querySelector('.phLegend');

    // Add scroll event listener to each legend container
    carbonLegend.addEventListener('scroll', handleScroll);
    nitrogenLegend.addEventListener('scroll', handleScroll);
    phLegend.addEventListener('scroll', handleScroll);

    // Function to handle scroll event
    function handleScroll(event) {
        // Change the background color based on scroll position
        if (event.target.scrollTop > 0) {
            event.target.style.backgroundColor = 'transparent';
        } else {
            event.target.style.backgroundColor = '#ffffff';
        }
    }
}

// Call the function to activate the scroll behavior
changeBackgroundColorOnScroll();
















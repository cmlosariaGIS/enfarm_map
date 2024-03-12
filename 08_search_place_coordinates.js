////////// <----- SEARCH PLACE BUTTON FUNCTION -----> \\\\\\\\\\

const searchBtn = document.getElementById("searchBtn");
const searchBar = document.getElementById("searchBar");
const searchInput = document.getElementById("searchInput");
const searchKeywordBtn = document.getElementById("searchKeywordBtn");
const floatingMessage = document.getElementById("floatingMessage");
const suggestionsContainer = document.getElementById("suggestionsContainer");
const searchIcon = document.getElementById("searchButton").querySelector(".material-icons");

let historicalPlaces = [];

searchBtn.addEventListener("click", handleSearchClick);
document.addEventListener("click", handleDocumentClick);
searchInput.addEventListener("input", toggleSearchIcon);
searchInput.addEventListener("click", displayHistoricalPlacesOnClick);
searchIcon.addEventListener("click", handleSearchIconClick);


//const searchInput = document.getElementById("searchInput");
const placeholderTexts = [
    "  Tìm kiếm...",
    "  Tìm kiếm cột mốc",
    "  Tìm kiếm địa chỉ",
    "  Tìm kiếm theo tọa độ",
    "  Tìm kiếm..."
];

let placeholderIndex = 0;
let placeholderTimeout;

function showNextPlaceholder() {
    const placeholder = placeholderTexts[placeholderIndex];
    let i = 0;

    const typingInterval = setInterval(() => {
        if (i < placeholder.length) {
            searchInput.setAttribute("placeholder", placeholder.substring(0, i + 1));
            i++;
        } else {
            clearInterval(typingInterval);
            if (placeholderIndex < placeholderTexts.length - 1) {
                placeholderIndex++;
                placeholderTimeout = setTimeout(showNextPlaceholder, 1000);
            }
        }
    }, 15);
}

// Add event listener to start the transition when the search input is focused
searchInput.addEventListener("focus", () => {
    // Start the placeholder transition if it hasn't been started yet
    if (!placeholderTimeout) {
        showNextPlaceholder();
    }
});

// Add event listener to stop the transition when the search input is blurred
searchInput.addEventListener("blur", () => {
    clearTimeout(placeholderTimeout);
    placeholderTimeout = null;
    searchInput.setAttribute("placeholder", "");
});


function toggleSearchIcon() {
    if (searchInput.value.length > 0) {
        searchIcon.textContent = "cancel";
    } else {
        searchIcon.textContent = "search";
    }
}

function handleSearchIconClick() {
    if (searchIcon.textContent === "cancel") {
        searchInput.value = "";
        toggleSearchIcon();
        clearPlaceSuggestions();
        displayHistoricalPlaces();
    }
}

function handleSearchClick(event) {
    event.stopPropagation();
    searchBtn.style.display = "none";
    searchBar.style.display = "flex";
    //searchKeywordBtn.style.display = "none";
    searchInput.focus();

    // Clear the search input and suggestions
    searchInput.value = "";
    clearPlaceSuggestions();

    displayHistoricalPlaces();


    // Post a message to the React Native app
    //const message = { actionType: 'Search', event: 'click' };
    //window.ReactNativeWebView.postMessage(JSON.stringify(message));

    try {
        const message = { actionType: 'Search', event: 'click' };

        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify(message));
        }
    } catch (error) {
        // Handle the error (or do nothing to prevent logging)

    }
}


function displayHistoricalPlacesOnClick() {
    if (searchInput.value.trim().length === 0) {
        searchInput.value = "";
        displayHistoricalPlaces();
    }
}

function handleDocumentClick(event) {
    if (
        !searchBar.contains(event.target) &&
        event.target !== searchBtn &&
        event.target !== searchKeywordBtn &&
        event.target !== floatingMessage
    ) {
        searchBtn.style.display = "block";
        searchBar.style.display = "none";
        searchInput.value = "";
        suggestionsContainer.style.display = "none";
    }
}

function clearPlaceSuggestions() {
    suggestionsContainer.innerHTML = '';
}

searchBar.style.display = "none";


let markerLayer;

function createMarker(coordinates) {
    if (markerLayer) {
        map.removeLayer(markerLayer);
    }

    const marker = new ol.Feature({
        geometry: new ol.geom.Point(coordinates),
    });

    const markerStyle = new ol.style.Style({
        image: new ol.style.Circle({
            radius: 8,
            fill: new ol.style.Fill({
                color: "#ff6666",
            }),
            stroke: new ol.style.Stroke({
                color: "rgba(255, 255, 255, 0.8)",
                width: 5,
            }),
            shadow: new ol.style.Circle({
                radius: 9,
                fill: new ol.style.Fill({
                    color: "rgba(0, 0, 0, 0.5)", // Set the shadow color and transparency
                }),
            }),
        }),
    });

    marker.setStyle(markerStyle);

    markerLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: [marker],
        }),
    });

    map.addLayer(markerLayer);



    // Define the addressParts variable outside the fetchPlaceName function
    let addressParts = [];

    // Fetch place name using coordinates from OSM Nominatim
    fetchPlaceName(coordinates)
        .then((placeName) => {
            // Create label overlay
            const label = new ol.Overlay({
                position: coordinates,
                element: document.createElement("div"),
                offset: [0, -20],
                positioning: "bottom-center",
            });

            const labelElement = label.getElement();

            // Create the pill-shaped background container
            const pillContainer = document.createElement("div");
            pillContainer.style.display = "flex";
            pillContainer.style.alignItems = "center";
            pillContainer.style.justifyContent = "space-between";
            pillContainer.style.background = "#ffffff";
            pillContainer.style.padding = "10px 20px";
            pillContainer.style.borderRadius = "100px";
            pillContainer.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.15)";

            // Create the place name element
            const placeNameElement = document.createElement("span");
            placeNameElement.textContent = placeName;
            placeNameElement.style.fontSize = "16px";
            placeNameElement.style.fontFamily = "Be Vietnam Pro', Arial, sans-serif";
            placeNameElement.style.color = "#515151";
            placeNameElement.style.textShadow = "2px 2px 4px rgba(255, 255, 255, 0.5)";
            placeNameElement.style.letterSpacing = "0px";

            // Create the chevron_right icon element
            const chevronIcon = document.createElement("i");
            chevronIcon.classList.add("material-icons");
            chevronIcon.textContent = "expand_circle_down";
            chevronIcon.style.fontSize = "20px";
            chevronIcon.style.color = "#515151";
            chevronIcon.style.marginLeft = "10px";

            // Add a rotation transform
            chevronIcon.style.transform = "rotate(180deg)";


            // Add hover effect to the chevron icon
            chevronIcon.style.cursor = "pointer";

            // Append the place name element and chevron icon to the pill container
            pillContainer.appendChild(placeNameElement);
            pillContainer.appendChild(chevronIcon);

            // Set the pill container as the label element
            labelElement.appendChild(pillContainer);

            // Check that pillContainer is not null before adding an event listener
            if (pillContainer) {
                // Add transition effect to the pillContainer
                pillContainer.style.transition = "all 0.3s ease-in-out";

                pillContainer.addEventListener("click", event => {
                    if (event.target.classList.contains('material-icons')) {
                        const addressDetails = addressParts.slice(1).join(", ");

                        // Add hover effect and transition to the chevron icon
                        const chevronIcon = pillContainer.querySelector("i.material-icons");
                        if (chevronIcon) {
                            chevronIcon.style.transition = "transform 0.3s ease-in-out"; // Add transition effect to the chevron icon

                            chevronIcon.addEventListener("mouseenter", () => {
                                chevronIcon.style.color = "#999999";
                            });

                            chevronIcon.addEventListener("mouseleave", () => {
                                chevronIcon.style.color = "#515151";
                            });
                        }

                        if (pillContainer.getAttribute('data-expanded') === 'true') {
                            pillContainer.innerHTML = `
<span style="font-size: 16px; font-family: 'Be Vietnam Pro', Arial, sans-serif; color: #515151; text-align: center; display: flex; align-items: center;">
<span>${placeName}</span>
<button style="font-size: 20px; color: inherit; background-color: transparent; border: none; cursor: pointer; display: flex; align-items: center; margin-left: 0px;">
<i class="material-icons" style="transform: rotate(180deg); font-size: inherit; transition: transform 0.3s ease-in-out;">expand_circle_down</i>
</button>
</span>`;

                            pillContainer.style.width = "initial";
                            pillContainer.style.padding = "10px 10px";
                            pillContainer.style.borderRadius = "100px";
                            pillContainer.setAttribute('data-expanded', 'false');

                        } else if (addressParts.length > 0) {
                            pillContainer.innerHTML = `
<span style="font-size: 16px; font-family: 'Be Vietnam Pro', Arial, sans-serif; color: #515151; text-align: center;">
<strong>${placeName}</strong>, ${addressDetails}
<button style="font-size: 20px; color: inherit; background-color: transparent; border: none; cursor: pointer; display: flex; align-items: center; margin-left: 180px;">
<i class="material-icons" style="transform: rotate(0deg); font-size: inherit; transition: transform 0.3s ease-in-out;">expand_circle_down</i>
</button>
</span>`;

                            pillContainer.style.width = "220px";
                            pillContainer.style.padding = "10px 10px";
                            pillContainer.style.borderRadius = "20px";
                            pillContainer.setAttribute('data-expanded', 'true');
                        }
                    }
                });
            }

            // Set the pill container as the label element
            labelElement.appendChild(pillContainer);

            // Add the label overlay to the map
            map.addOverlay(label);
        })
        .catch((error) => {
            console.error("Failed to fetch place name:", error);
        });


    // Function to fetch place name from OSM Nominatim
    async function fetchPlaceName(coordinates) {
        const [lon, lat] = ol.proj.toLonLat(coordinates);
        const baseUrl = "https://nominatim.openstreetmap.org/reverse";
        const format = "json";
        const url = `${baseUrl}?lon=${lon}&lat=${lat}&format=${format}&zoom=18&addressdetails=1`;

        try {
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                addressParts = data.display_name.split(",");
                const placeName = addressParts[0]?.trim() || "";
                return placeName;
            } else {
                console.error("Failed to fetch place name:", response.status, response.statusText);
                return "";
            }
        } catch (error) {
            console.error("Failed to fetch place name:", error);
            return "";
        }
    }

}


// Function to fetch place suggestions from OSM-Nominatim
async function fetchPlaceSuggestions(searchText) {
    const baseUrl = "https://nominatim.openstreetmap.org/search";
    const format = "json";
    const limit = 25;
    const url = `${baseUrl}?q=${encodeURIComponent(searchText)}&format=${format}&limit=${limit}&countrycodes=VN`;

    try {
        const loadingIcon = document.getElementById("loadingIcon");
        const searchButton = document.getElementById("searchButton");

        loadingIcon.style.visibility = "visible"; // Show the loading icon
        loadingIcon.classList.add("spin"); // Add the spin class
        searchButton.style.visibility = "hidden"; // Hide the search icon

        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            const filteredSuggestions = data.filter(
                (place) =>
                    !historicalPlaces.some(
                        (historicalPlace) =>
                            historicalPlace.display_name === place.display_name
                    )
            );

            // Process the suggestions...

            return filteredSuggestions.map((place) => ({
                display_name: place.display_name,
                lat: place.lat,
                lon: place.lon,
            }));
        } else {
            console.error(
                "Failed to fetch place suggestions:",
                response.status,
                response.statusText
            );
            return [];
        }
    } catch (error) {
        console.error("Failed to fetch place suggestions:", error);
        return [];
    } finally {
        const loadingIcon = document.getElementById("loadingIcon");
        const searchButton = document.getElementById("searchButton");

        // Delay the visibility of the search button for 2 seconds (2000 milliseconds)
        setTimeout(() => {
            loadingIcon.classList.remove("spin"); // Remove the spin class
            loadingIcon.style.visibility = "hidden"; // Hide the loading icon
            searchButton.style.visibility = "visible"; // Show the search icon
        }, 3000);
    }
}


// Function to display place suggestions below the search bar
function displayPlaceSuggestions(suggestions) {
    suggestionsContainer.innerHTML = "";

    // Combine historical places with fetched suggestions
    const allSuggestions = [...suggestions, ...historicalPlaces];

    allSuggestions.forEach((suggestion, index) => {
        const suggestionItem = document.createElement("div");
        suggestionItem.classList.add("suggestionItem");
        suggestionItem.style.paddingTop = "10px"; /*search suggestion  item spacing*/
        suggestionItem.style.paddingBottom = "10px"; /*search suggestion  item spacing*/

        const gpsIcon = document.createElement("i");
        gpsIcon.classList.add("material-icons", "gpsIcon");

        // Use "history" icon for historical places
        if (historicalPlaces.includes(suggestion)) {
            gpsIcon.textContent = "history";
            gpsIcon.style.fontSize = "30px"
        } else {
            gpsIcon.textContent = "north_east"; //Search results arrow
            gpsIcon.style.fontSize = "30px"
        }

        const suggestionText = document.createElement("span");
        suggestionText.textContent = suggestion.display_name;
        suggestionText.classList.add("suggestionText");
        suggestionText.style.color = "#515151";
        suggestionText.style.fontFamily = "Be Vietnam Pro', Arial, sans-serif";

        suggestionItem.addEventListener("click", () => {
            handleSuggestionClick(suggestion);
        });

        suggestionItem.appendChild(gpsIcon);
        suggestionItem.appendChild(suggestionText);
        suggestionsContainer.appendChild(suggestionItem);

        // Add a horizontal line after displaying suggestions (divider)
        if (index === suggestions.length - 1) {
            const separatorContainer = document.createElement("div");
            separatorContainer.style.paddingTop = "10px";
            separatorContainer.style.paddingBottom = "10px";

            const separatorLine = document.createElement("hr");
            separatorLine.style.width = "50%";
            separatorLine.style.margin = "0 auto";
            separatorContainer.appendChild(separatorLine);

            suggestionsContainer.appendChild(separatorContainer);

            // Add the text below the line
            const historicalPlacesText = document.createElement("div");
            historicalPlacesText.textContent = "Lịch sử tìm kiếm"; //Previously searched locations (Search History)
            historicalPlacesText.style.fontSize = "16px";
            historicalPlacesText.style.color = "#515151";
            historicalPlacesText.style.marginLeft = "20px";
            historicalPlacesText.style.fontFamily = "Be Vietnam Pro', Arial, sans-serif";
            suggestionsContainer.appendChild(historicalPlacesText);
        }
    });

    suggestionsContainer.style.display = "block";
}

// Attach event listener to the search input
searchInput.addEventListener("input", handleSearchInput);

let searchTimeout;

// Attach event listener to the search input
searchInput.addEventListener("input", handleSearchInputWithDelay);

function handleSearchInputWithDelay() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(handleSearchInput, 1000); // Adjust the delay duration as needed (in milliseconds)
}


// Function to handle search input
function handleSearchInput() {
    const searchText = searchInput.value.trim();

    if (searchText.length > 0) {
        fetchPlaceSuggestions(searchText)
            .then((suggestions) => {
                displayPlaceSuggestions(suggestions);
            })
            .catch((error) => {
                console.error("Failed to fetch place suggestions:", error);
            });

        const historicalPlacesContainer = document.getElementById("historicalPlacesContainer");

        // Wrap the code inside a DOM ready event listener
        document.addEventListener("DOMContentLoaded", function () {
            // Retrieve the historicalPlacesContainer element
            const historicalPlacesContainer = document.getElementById("historicalPlacesContainer");

            // Check if the historicalPlacesContainer element exists
            if (historicalPlacesContainer) {
                // Handle the search input
                handleSearchInput();
            }

            // Function to handle the search input
            function handleSearchInput() {
                // Retrieve the search input element
                const searchInput = document.getElementById("searchInput");
                // Retrieve the suggestions container element
                const suggestionsContainer = document.getElementById("suggestionsContainer");

                // Check if the search input is empty
                if (searchInput.value.trim() !== "") {
                    // Show suggestions and hide historical places list
                    suggestionsContainer.style.display = "block";
                    historicalPlacesContainer.style.display = "none";
                } else {
                    // If the search input is empty, hide historical places and suggestions container
                    suggestionsContainer.style.display = "none";
                    historicalPlacesContainer.style.display = "none";
                }
            }
        });
    }
}
// Attach event listener to the search input
searchInput.addEventListener("input", handleSearchInput);

function handleSuggestionClick(suggestion) {
    const latitude = parseFloat(suggestion.lat);
    const longitude = parseFloat(suggestion.lon);
    const center = ol.proj.fromLonLat([longitude, latitude]);

    // Smoothly animate the zoom and centering
    map.getView().animate({
        center: center,
        zoom: 17,
        duration: 1000, // Adjust the duration as needed
        easing: ol.easing.easeOut // Use a suitable easing function for smooth animation
    });

    const coordinates = ol.proj.fromLonLat([longitude, latitude]);
    createMarker(coordinates);

    // Post a message to the React Native app
    const message = {
        actionType: 'Search',
        event: 'select',
        locationText: suggestion.display_name,
        latitude: latitude,
        longitude: longitude
    };

    if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify(message));
    }

    // Log the address and lon/lat to the console
    const address = suggestion.display_name;
    const lon = suggestion.lon;
    const lat = suggestion.lat;
    console.log('Selected Place:');
    console.log('Address:', address);
    console.log('Lon/Lat:', lon, lat);

    // Check if the selected place already exists in historicalPlaces
    const existingPlaceIndex = historicalPlaces.findIndex(
        (place) => place.display_name === suggestion.display_name
    );

    if (existingPlaceIndex === -1) {
        // Add the selected place to the historicalPlaces array
        historicalPlaces.push(suggestion);

        // Save the historicalPlaces in local storage
        localStorage.setItem("historicalPlaces", JSON.stringify(historicalPlaces));
    } else {
        // If the place already exists, move it to the end of the array
        const existingPlace = historicalPlaces.splice(existingPlaceIndex, 1);
        historicalPlaces.push(existingPlace[0]);
    }

    // Display historical places
    displayHistoricalPlaces();

    // Clear the search input
    searchInput.value = "";
    suggestionsContainer.style.display = "none";
}


function displayHistoricalPlaces() {
    suggestionsContainer.innerHTML = "";

    if (historicalPlaces.length > 0 && searchInput.value.trim() === "") {
        const sortedPlaces = [...historicalPlaces].reverse();
        const recentPlaces = sortedPlaces.slice(0, 8);

        recentPlaces.forEach((place) => {
            const suggestionItem = document.createElement("div");
            suggestionItem.classList.add("suggestionItem");
            suggestionItem.style.paddingTop = "15px";
            suggestionItem.style.paddingBottom = "0px";

            const gpsIcon = document.createElement("i");
            gpsIcon.classList.add("material-icons", "gpsIcon");
            gpsIcon.textContent = "history";
            gpsIcon.style.fontSize = "30px"; //adjust history icon size

            const suggestionText = document.createElement("span");
            suggestionText.textContent = place.display_name;
            suggestionText.classList.add("suggestionText");
            suggestionText.style.color = "#515151";

            const deleteButton = document.createElement("button");
            deleteButton.classList.add("deleteButton");
            deleteButton.innerHTML = '<i class="material-icons" style="font-size: 30px;">close</i>'; //X button to clear the search

            deleteButton.addEventListener("click", (event) => {
                event.stopPropagation();
                deleteHistoricalPlace(place);
            });

            suggestionItem.addEventListener("click", () => {
                handleSuggestionClick(place);
            });

            deleteButton.addEventListener("click", (event) => {
                event.stopPropagation();
                deleteHistoricalPlace(place);
            });

            suggestionItem.appendChild(gpsIcon);
            suggestionItem.appendChild(suggestionText);
            suggestionItem.appendChild(deleteButton);

            suggestionsContainer.appendChild(suggestionItem);
        });

        // Function to delete individual historical place
        function deleteHistoricalPlace(place) {
            // Find the index of the place in the historicalPlaces array
            const index = historicalPlaces.findIndex((p) => p.display_name === place.display_name);

            if (index !== -1) {
                // Remove the place from the historicalPlaces array
                historicalPlaces.splice(index, 1);

                // Save the updated historicalPlaces in local storage
                localStorage.setItem("historicalPlaces", JSON.stringify(historicalPlaces));

                // Re-display the historical places
                displayHistoricalPlaces();
            }
        }

        // Create the Clear all search history button (Clear Search History)
        const clearAllButton = document.createElement("button");
        clearAllButton.id = "clearAllBtn";
        clearAllButton.innerHTML = `
<div style="display: flex; align-items: center; justify-content: center; width: 320px; margin: 0 auto; padding-bottom: 20px; padding-top: 20px; font-family: 'Be Vietnam Pro', Arial, sans-serif;">
<i class="material-icons" style="font-size: 22px; margin-right: 10px; color:  #ff4d4d;">delete</i>
<span style="font-size: 16px; color: #515151;">Xóa tất cả tìm kiếm</span> 
</div>`;



        clearAllButton.addEventListener("click", clearAllHistory);
        suggestionsContainer.appendChild(clearAllButton);

    } else {
        const noResultsText = document.createElement("div");
        noResultsText.style.display = "flex";
        noResultsText.style.alignItems = "center";
        noResultsText.style.fontSize = "18px";
        noResultsText.style.marginLeft = "20px";
        noResultsText.style.color = "#515151";

        const historyIcon = document.createElement("i");
        historyIcon.classList.add("material-icons");
        historyIcon.textContent = "history";
        historyIcon.style.fontSize = "28px";
        historyIcon.style.marginRight = "10px"; // Increased separation

        const text = document.createElement("span");
        text.textContent = "Không có địa điểm nào được tìm kiếm trước đó";

        noResultsText.appendChild(historyIcon);
        noResultsText.appendChild(text);
        suggestionsContainer.appendChild(noResultsText);

    }

    suggestionsContainer.style.display = "block";
}

// Function to clear all historical places
function clearAllHistory() {
    historicalPlaces = [];
    localStorage.removeItem("historicalPlaces");
    displayHistoricalPlaces();
}

// Retrieve historical places from local storage
const savedHistoricalPlaces = localStorage.getItem("historicalPlaces");
if (savedHistoricalPlaces) {
    historicalPlaces = JSON.parse(savedHistoricalPlaces);
}

// Attach event listener to the search input
searchInput.addEventListener("input", handleSearchInput);


////////////////////// Function to handle searching by place name or coordinates \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
function handleSearch() {
    const searchText = searchInput.value.trim();

    // Check if the input matches the coordinates format (e.g., "longitude,latitude")
    const coordinatesPattern = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/;
    if (coordinatesPattern.test(searchText)) {
        // If the input matches the coordinates format, split the input into longitude and latitude
        const [longitude, latitude] = searchText.split(',').map(coord => parseFloat(coord));
        if (!isNaN(longitude) && !isNaN(latitude)) {
            // If both longitude and latitude are valid numbers, search by coordinates
            fetchPlaceByCoordinates([longitude, latitude])
                .then((place) => {
                    if (place) {
                        console.log("Place found:", place);
                        // Display the place information
                    } else {
                        console.log("No place found at the provided coordinates.");
                    }
                })
                .catch((error) => {
                    console.error("Failed to fetch place information:", error);
                });
            return; // Exit the function to avoid searching by place name
        }
    }


    // If the input is not coordinates or invalid coordinates, search by place name
    fetchPlaceByName(searchText)
        .then((place) => {
            if (place) {
                console.log("Place found:", place);
                // Display the place information
            } else {
                console.log("No place found with the provided name.");
            }
        })
        .catch((error) => {
            console.error("Failed to fetch place information:", error);
        });
}

// Function to fetch place information by place name
async function fetchPlaceByName(placeName) {
    const baseUrl = "https://nominatim.openstreetmap.org/search";
    const format = "json";
    const limit = 1; // Limit to one result
    const url = `${baseUrl}?q=${encodeURIComponent(placeName)}&format=${format}&limit=${limit}&countrycodes=VN`;

    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            if (data.length > 0) {
                return data[0].display_name;
            } else {
                return null; // No place found
            }
        } else {
            console.error("Failed to fetch place information:", response.status, response.statusText);
            return null;
        }
    } catch (error) {
        console.error("Failed to fetch place information:", error);
        return null;
    }
}

// Attach event listener to the search input for searching by place name or coordinates
searchInput.addEventListener("input", handleSearch);
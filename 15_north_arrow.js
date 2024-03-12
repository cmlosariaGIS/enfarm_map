////////// <----- NORTH ARROW BUTTON FUNCTION -----> \\\\\\\\\\

// Function to update the rotation of the north arrow based on the map's rotation
function updateNorthArrowRotation() {
    const rotation = map.getView().getRotation();

    // Check if the rotation is not equal to 0
    if (rotation !== 0) {
        northArrow.style.display = "block";
    } else {
        northArrow.style.display = "none";
    }

    northArrow.style.transform = `rotate(${rotation}rad)`;
}

// Event listener for map view rotation change
map.getView().on("change:rotation", updateNorthArrowRotation);

// Initial rotation update
updateNorthArrowRotation();

// Function to reset map rotation to 0 degrees with smooth animation
function resetMapRotation() {
    const view = map.getView();
    view.animate({
        rotation: 0,
        duration: 1000, // Animation duration in milliseconds
        easing: ol.easing.easeOut // Easing function for smooth animation
    });

    // Hide the north arrow after reset
    northArrow.style.display = "none";
}

// Event listener for the north arrow click
northArrow.addEventListener('click', resetMapRotation);
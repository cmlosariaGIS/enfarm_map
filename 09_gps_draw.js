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
            deleteSelectedItems(feature, deleteButton);
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

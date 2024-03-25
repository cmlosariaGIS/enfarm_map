// Function to handle long press
function handleLongPress(event) {
    var coordinate = map.getEventCoordinate(event);
    var wgs84Coordinate = ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326');
    var coordinatesLabel = document.getElementById('coordinates');
    if (coordinatesLabel) {
      coordinatesLabel.innerHTML = wgs84Coordinate[1].toFixed(6) + ', ' + wgs84Coordinate[0].toFixed(6);
      document.getElementById('longPressCoordinatesBanner').style.display = 'block';
      var gpsIcon = document.getElementById('gps-icon');
      if (gpsIcon) {
        gpsIcon.style.left = (event.clientX - 16) + 'px'; // Adjust the icon position
        gpsIcon.style.top = (event.clientY - 28) + 'px'; // Adjust the icon position
        gpsIcon.style.display = 'block'; // Show the GPS icon
      }
    }
  }
  
  // Function to copy coordinates to clipboard
  function copyCoordinates() {
    var coordinatesText = document.getElementById('coordinates').textContent;
    navigator.clipboard.writeText(coordinatesText)
    .then(function() {
      alert('Coordinates copied to clipboard');
    })
    .catch(function(error) {
      alert('Unable to copy coordinates: ' + error);
    });
  }

  // Function to dismiss the banner
  function dismissBanner() {
    document.getElementById('longPressCoordinatesBanner').style.display = 'none';
    document.getElementById('gps-icon').style.display = 'none'; // Hide the GPS icon
  }

  // Variables to keep track of long press
  var longPressTimer;
  var longPressDelay = 600; // milliseconds

  // Event listeners for touchstart and mousedown events to detect long press
  map.getViewport().addEventListener('mousedown', function(event) {
    longPressTimer = setTimeout(function() {
      handleLongPress(event);
    }, longPressDelay);
  });

  map.getViewport().addEventListener('touchstart', function(event) {
    longPressTimer = setTimeout(function() {
      handleLongPress(event);
    }, longPressDelay);
  });

  // Clear the timer when touch or mouse event ends
  map.getViewport().addEventListener('mouseup', function() {
    clearTimeout(longPressTimer);
  });

  map.getViewport().addEventListener('touchend', function() {
    clearTimeout(longPressTimer);
  });

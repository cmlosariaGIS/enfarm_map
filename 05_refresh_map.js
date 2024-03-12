////////// <----- RESET BUTTON FUNCTION -----> \\\\\\\\\\

// Get the reset button element
const resetButton = document.getElementById("resetBtn");

// Create a function to reset the webpage
function resetWebpage() {
    location.reload();
}

// Add event listener to the reset button
resetButton.addEventListener("click", resetWebpage);
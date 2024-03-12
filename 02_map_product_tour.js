////////// <----- START ENFARM MAP PRODUCT TOUR -----> \\\\\\\\\\

// Check if the tour has already been shown
const tourShown = localStorage.getItem('tourShown');

if (!tourShown) {
    window.addEventListener('DOMContentLoaded', initTour);
}

// Get the tutorial button element
const tutorialBtn = document.getElementById('tutorialBtn');

// Add event listener to the button
tutorialBtn.addEventListener('click', resetProductTour);

function initTour() {
    // Create a new instance of Shepherd
    const tour = new Shepherd.Tour({
        useModalOverlay: true,
        defaultStepOptions: {
            classes: 'shadow-md bg-purple-dark',
            scrollTo: true,
        },
    });

    //Re-arrange order to re-arrange tutorial instruction sequence
    addStepSearch(tour);
    addStepSketchFarm(tour);
    addStepAddSensor(tour);
    addStepBaseMap(tour);
    addStepMeasureArea(tour);
    addStepMeasureLength(tour);
    addElevationProfile(tour);
    addperspectiveControl(tour);
    addStepReset(tour);
    addStepFindLocation(tour);
    addStepAccessWeatherMap(tour);
    addStepRevisitTutorial(tour);

    // Start the tour
    tour.start();
}

function addStepSearch(tour) {
    addTourStep(tour, 'step-search', '#searchBtn', 'Nhấp vào nút này để tìm kiếm các địa điểm.');
}

function addStepSketchFarm(tour) {
    addTourStep(tour, 'step-sketch-farm', '#sketchFarmBtn', 'Nhấp vào nút này để phác thảo trang trại của bạn.');
}

function addStepAddSensor(tour) {
    addTourStep(tour, 'step-add-sensor', '#addSensorBtn', 'Nhấp vào nút này để thêm/các cảm biến enfarm.');
}

function addStepBaseMap(tour) {
    addTourStep(tour, 'step-basemap', '#basemapBtn', 'Nhấp vào nút này để chuyển đổi bản đồ cơ sở.');
}

function addStepMeasureArea(tour) {
    addTourStep(tour, 'step-measure-area', '#measureAreaBtn', 'Bấm vào nút này để đo diện tích.');
}

function addStepMeasureLength(tour) {
    addTourStep(tour, 'step-measure-length', '#measureLengthBtn', 'Bấm vào nút này để đo chiều dài.');
}

function addElevationProfile(tour) {
    addTourStep(tour, 'step-elevation-profile', '#elevProfileBtn', 'Tạo hồ sơ độ cao'); //Create Elevation Profile
}

function addperspectiveControl(tour) {
    addTourStep(tour, 'step-pespective-control', '#perspectiveBtn', 'Thay đổi góc nhìn bản đồ'); //Change map perspective
}

function addStepReset(tour) {
    addTourStep(tour, 'step-reset', '#resetBtn', 'Nhấp vào nút này để đặt lại bản đồ.');
}

function addStepFindLocation(tour) {
    addTourStep(tour, 'step-location', '#locationBtn', 'Nhấp vào nút này để tìm vị trí của bạn.');
}

function addStepAccessWeatherMap(tour) {
    addTourStep(tour, 'step-windyMap', '#windyMapBtn', 'Nhấp vào nút này để truy cập bản đồ thời tiết từ Windy.com.');
}

function addStepRevisitTutorial(tour) {
    tour.addStep({
        id: 'step-tutorial',
        text: getText('Nhấp vào nút này để xem lại hướng dẫn.'),
        attachTo: { element: '#tutorialBtn', on: 'left' },
        buttons: [
            {
                text: getButtonText('⟲ Làm lại'), //Restart tour button
                action: () => tour.show('step-search'),
                classes: 'shepherd-button-secondary',
            },
            {
                text: getButtonText('✔ Xong'), //Finish tour button
                action: () => {
                    localStorage.setItem('tourShown', true);
                    tour.complete();
                },
            },
        ],
    });
}

function addTourStep(tour, id, element, text, position = 'left') {
    tour.addStep({
        id,
        classes: 'step-border',
        text: getText(text),
        attachTo: { element, on: position },
        buttons: [{ text: getButtonText('Kế tiếp ➜'), action: tour.next }], //Next button
    });
}

function addTourStepWithDone(id, element, text, position = 'left') {
    // Create a new instance of Shepherd
    const tour = new Shepherd.Tour({
        useModalOverlay: true,
        defaultStepOptions: {
            classes: 'shadow-md bg-purple-dark',
            scrollTo: true,
        },
    });
    tour.addStep({
        id,
        classes: 'step-border',
        text: getText(text),
        attachTo: { element, on: position },
        buttons: [{ text: getButtonText('OK'), action: tour.complete }],
    });
    tour.start();
}

function getText(text) {
    return `<span style="display: flex; align-items: center; font-size: 20px;"><i class="material-icons" style="font-size: 30px; margin-right: 15px;">menu_book</i>${text}</span>`;
}

function getButtonText(text) {
    return `<span style="font-size: 20px;">${text}</span>`;
}

function resetProductTour() {
    // Clear the tourShown item from localStorage
    localStorage.removeItem('tourShown');

    // Reinitialize the tour
    initTour();
}

////////// <----- END ENFARM MAP PRODUCT TOUR -----> \\\\\\\\\\
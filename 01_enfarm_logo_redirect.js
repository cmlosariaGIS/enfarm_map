////////// <----- START ENFARM LOGO URL REDIRECT -----> \\\\\\\\\\

document.getElementById('logoDiv').addEventListener('click', function () {
    //var confirmation = confirm("Do you want to open the browser and navigate to https://enfarm.com/?");
    var confirmation = confirm("Bạn có muốn mở trình duyệt và điều hướng đến https://enfarm.com/?");
    if (confirmation) {
        window.open('https://enfarm.com/', '_blank');
    }
});

////////// <----- END ENFARM LOGO URL REDIRECT -----> \\\\\\\\\\
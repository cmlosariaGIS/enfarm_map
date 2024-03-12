
////////// <----- SCALE BAR -----> \\\\\\\\\\

var scale_line = new ol.control.ScaleLine({
    units: 'metric',
    bar: false,
    steps: 6,
    text: true,
    minWidth: 100,  //adjust scale bar length
    fontSize: 25,
    target: 'scale_bar',
});
map.addControl(scale_line);
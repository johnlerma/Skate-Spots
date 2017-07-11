var spots = ko.observableArray([]);
$.getJSON("js/skatespots.json", function(data) {
    for (i = 0; i < data.length; i++) {
        spots.push(data[i]);
    }
});
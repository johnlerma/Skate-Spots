var spots = ko.observableArray([]);
var fetchLocations = function() {
    $.getJSON("js/skatespots.json", function(data) {
            for (i = 0; i < data.length; i++) {
                spots.push(data[i]);
            }
            initMap();
        })
        .error(function() {
            alert("Something went wrong. Try again.");
        });
};
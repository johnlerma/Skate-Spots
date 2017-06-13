
var spots = ko.observableArray([{
        title: 'Wallenberg 4 Step',
        name: 'bbbbbb',
        url: 'http://www.url.com',
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        type: 'stairs',
        numid: '0',
        location: {
            lat: 37.7802,
            lng: -122.446864
        }
    },
    {
        title: 'Clipper Hubba',
        name: 'ccccc',
        url: 'http://www.url.com',
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        type: 'ledges',
        numid: '1',
        location: {
            lat: 37.749408,
            lng: -122.43222
        }
    },
    {
        title: 'Sega Circle Ledges',
        url: 'http://www.url.com',
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        type: 'skatepark',
        numid: '2',
        location: {
            lat: 37.769155,
            lng: -122.405325
        }
    },
    {
        title: 'Pier 7 Stair Set',
        url: 'http://www.url.com',
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        type: 'ledges',
        numid: '3',
        location: {
            lat: 37.798694,
            lng: -122.396752
        }
    },
    {
        title: 'Fort Miley Pyramids',
        url: 'http://www.url.com',
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        type: 'bank',
        numid: '4',
        location: {
            lat: 37.783255,
            lng: -122.508833
        }
    }
]);

var ViewModel = function() {
    var self = this;
    this.displayMessage = ko.observable(true);
    this.spotList = ko.observableArray([]);
    this.typeToShow = ko.observable("all");
    this.displayAdvancedOptions = ko.observable(false);

    this.listToShow = ko.pureComputed(function() {
        // Represents a filtered list of skatespots
        // i.e., only those matching the "typeToShow" condition
        var desiredType = this.typeToShow();
        if (desiredType == "all") return spots();
        return ko.utils.arrayFilter(spots(), function(spot) {
            return spot.type == desiredType;
        });
    }, this);
        
    this.itemClick = function(location){
        google.maps.event.trigger(markers[this.numid], 'click');
    };

    // Animation callbacks for the  list
    this.showlistElement = function(elem) {
        if (elem.nodeType === 1) $(elem).hide().slideDown()
    };
    this.hidelistElement = function(elem) {
        if (elem.nodeType === 1) $(elem).slideUp(function() {
            $(elem).remove();
        });
    };

};

ko.bindingHandlers.fadeVisible = {
    init: function(element, valueAccessor) {
        // Initially set the element to be instantly visible/hidden depending on the value
        var value = valueAccessor();
        $(element).toggle(ko.unwrap(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
    },
    update: function(element, valueAccessor) {
        // Whenever the value subsequently changes, slowly fade the element in or out
        var value = valueAccessor();
        ko.unwrap(value) ? $(element).fadeIn() : $(element).fadeOut();
    }
};


// Function to initialize the map within the map div
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 37.7749,
            lng: -122.4194
        },
        zoom: 14,
        styles: styles
    });
    // Create a single latLng literal object.
    //var wallenberg = {lat: 37.7802, lng: -122.446864};
    var largeInfowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();

    for (var i = 0; i < spots().length; i++) {
        var position = spots()[i].location;
        var title = spots()[i].title;
        var numid = spots()[i].numid;
        var icon = spots()[i].icon;
        var id = spots()[i].id
        var that = this;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            icon: icon,
            numid: numid,
            animation: google.maps.Animation.DROP,
            id: id
        });
        // Push the marker to our array of markers.
        markers.push(marker);


        // Create an onclick event to open an infowindow at each marker.
        marker.addListener('click', function() {
            var inthisfunc = this;
            populateInfoWindow(this, largeInfowindow);
            this.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                inthisfunc.setAnimation(null);
            }, 750);

        });
        bounds.extend(markers[i].position);
    };
    // Creates click event that opens the info window from the link on the left panel
//    $('.marker-link').on('click', function() {
//        google.maps.event.trigger(markers[$(this).data('markerid')], 'click');
//
//    });

    // fits the marker area into the browser window
    map.fitBounds(bounds);

    function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
            infowindow.setContent('');
            infowindow.marker = marker;
            // Make sure the marker property is cleared if the infowindow is closed.
            var infoWindowClosed = false;

            console.log(infoWindowClosed);
            // infowindow listens for a closed click
            infowindow.addListener('closeclick', function() {

                // infowindow.setMarker = null;
                // infoWindowClosed = true;
                // console.log(infoWindowClosed);
            });
            if (infoWindowClosed) {
                infowindow.open(map, marker);
                infoWindowClosed = false;
            };
            var streetViewService = new google.maps.StreetViewService();
            var radius = 50;
            // In case the status is OK, which means the pano was found, compute the
            // position of the streetview image, then calculate the heading, then get a
            // panorama from that and set the options
            function getStreetView(data, status) {
                if (status == google.maps.StreetViewStatus.OK) {
                    var nearStreetViewLocation = data.location.latLng;
                    var heading = google.maps.geometry.spherical.computeHeading(
                        nearStreetViewLocation, marker.position);
                    var infoContent = '<div>' + marker.title + '</div><div id="pano"></div>';
                    infowindow.setContent(infoContent);
                    var panoramaOptions = {
                        position: nearStreetViewLocation,
                        pov: {
                            heading: heading,
                            pitch: 30
                        }
                    };
                    var panorama = new google.maps.StreetViewPanorama(
                        document.getElementById('pano'), panoramaOptions);
                } else {
                    infowindow.setContent('<div>' + marker.title + '</div>' +
                        '<div>No Street View Found</div>');
                }
            }
            // Use streetview service to get the closest streetview image within
            // 50 meters of the markers position
            streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
            console.log(marker.position + "dis");
            // Open the infowindow on the correct marker.
            infowindow.open(map, marker);
        }
    }
}

ko.applyBindings(new ViewModel());
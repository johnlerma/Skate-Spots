var marker;
var markers = [];
var infowindow;
var infowindowOpen = false;
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


var Country = function(name, population) {
    this.countryName = name;
    this.countryPopulation = population;
};

var ViewModel = function() {

    var self = this;
    var selectedCountry = ko.observable();
    this.displayMessage = ko.observable(true);
    //this.spotList = ko.observableArray([]);
    //this was first filter
    //this.typeToShow = ko.observable("all");
    this.selectedType = ko.observable("all");
    this.displayAdvancedOptions = ko.observable(false);

    this.listToShow = ko.pureComputed(function() {
        console.log(infowindowOpen);
        console.log(this.selectedType());
        if (infowindowOpen === true && this.selectedType() !== largeInfowindow.marker.type) {
            largeInfowindow.close();
        }
        //infowindow.setMarker = null;
        //turns on all the markers as default before filtering them
        for (var k = 0; k < markers.length; k++) {
            markers[k].setVisible(true);
        }
        // Represents a filtered list of skatespots
        // i.e., only those matching the "typeToShow" condition
        var desiredType = this.selectedType();

        if (desiredType == "all") {
            return spots();
        } else {
            for (var i = 0; i < spots().length; i++) {
                if (spots()[i].type !== desiredType) {
                    // what is this for?
                    console.log("what is this for");
                }
            }

            return ko.utils.arrayFilter(spots(), function(spot) {
                if (spot.type !== desiredType) {
                    for (var i = 0; i < spots().length; i++) {
                        if (markers[i].type !== desiredType) {
                            markers[i].setVisible(false);
                        }
                    }

                }

                return spot.type == desiredType;

            });
        }
    }, this);

    this.spotType = ko.observableArray(['all', 'stairs', 'ledges', 'bank']);
    // knockout controls the click function of the list
    this.itemClick = function(location) {
        //  var $flickrfooter2 = $('.infowndwimg');
        $('.infowndwimg').remove();
        google.maps.event.trigger(markers[this.numid], 'click');

    };

    // Animation callbacks for the  list
    this.showlistElement = function(elem) {
        if (elem.nodeType === 1) $(elem).hide().slideDown();
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
    largeInfowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();

    for (var i = 0; i < spots().length; i++) {
        var position = spots()[i].location;
        var title = spots()[i].title;
        var numid = spots()[i].numid;
        var icon = spots()[i].icon;
        var type = spots()[i].type;
        var lat = spots()[i].location.lat;
        var lng = spots()[i].location.lng;
        var that = this;
        // Create a marker per location, and put into markers array.
        marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            icon: icon,
            numid: numid,
            type: type,
            animation: google.maps.Animation.DROP,
            lat: lat,
            lng: lng
        });

        // Push the marker to our array of markers.
        markers.push(marker);

        // Create an onclick event to open an infowindow at each marker.
        marker.addListener('click', function() {
            var inthisfunc = this;
            infowindowOpen = true;

            //populate the info with and make the marker bounce
            populateInfoWindow(this, largeInfowindow);
            this.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                inthisfunc.setAnimation(null);
            }, 750);

        });
        bounds.extend(markers[i].position);
    };

    // fits the marker area into the browser window
    map.fitBounds(bounds);

    //populate info window with 
    function populateInfoWindow(marker, infowindow) {

        //FLickr API call
        function getFlickrImage() {
            console.log("location: " + marker.lng);
            var flickrURL = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=a47f036c23ed9b5f526a4c21a14658f0';
            flickrURL += $.param({
                'method': 'flickr.photos.search',
                'api_key': 'a47f036c23ed9b5f526a4c21a14658f0',
                'tags': 'skateboarding, skateboard, skate, skateboards',
                'per_page': 10,
                'lat': marker.lat,
                'lon': marker.lng,
                'radius': .25,
                'radius_units': 'mi',
                'privacy_filter': 1,
                'format': 'json',
                'nojsoncallback': 1
            });
            console.log("getflickrimage: " + flickrURL);
            //add the returned photos to the footer
            $.getJSON(flickrURL, function(data) {


                for (var j = 0; j < data.photos.photo.length; j++) {
                    console.log("flick j: " + j);
                    var photofeed = data.photos.photo[j];
                    var $flickrfooter2 = $('#flickrfooter');
                    $flickrfooter2.append('<img class="infowndwimg" src="https://farm' + photofeed.farm + '.staticflickr.com/' + photofeed.server + '/' + photofeed.id + '_' + photofeed.secret + '_n.jpg">');
                }
                var detail = data.photos.photo[0];
                var $flickrfooter = $('#flickrfooter');
                $flickrfooter.append('<img class="infowndwimg" src="https://farm' + detail.farm + '.staticflickr.com/' + detail.server + '/' + detail.id + '_' + detail.secret + '_n.jpg">');
            }).fail(function() {
                $flickrfooter.append('<p style="text-align: center;">Sorry! The photo</p><p style="text-align: center;">could not be loaded</p>');
            });
        }


        getFlickrImage();


        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
            infowindow.setContent('');
            infowindow.marker = marker;
            // Make sure the marker property is cleared if the infowindow is closed.
            //var infoWindowClosed = false;

            //console.log(initMap.largeInfowindow);
            // infowindow listens for a closed click
            infowindow.addListener('closeclick', function() {
                console.log("close infowindow");
                var $flickrfooter2 = $('.infowndwimg');
                $flickrfooter2.remove();
                infowindowOpen = false;
                console.log("i closeclicked");
            });

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

            // Open the infowindow on the correct marker.

        }
        infowindow.open(map, marker);
    }
}

ko.applyBindings(new ViewModel());



function googleError(e) {
    alert("Google Maps cannot be loaded at this time");
    console.log(e);
}
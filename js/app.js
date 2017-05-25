var spots = [{
        title: 'Wallenberg 4 Step',
        url: 'http://www.url.com',
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        location: {
            lat: 37.7802,
            lng: -122.446864
        }
    },
    {
        title: 'Clipper Hubba',
        url: 'http://www.url.com',
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        location: {
            lat: 37.749408,
            lng: -122.43222
        }
    },
    {
        title: 'Sega Circle Ledges',
        url: 'http://www.url.com',
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        location: {
            lat: 37.769155,
            lng: -122.405325
        }
    },
    {
        title: 'Pier 7 Stair Set',
        url: 'http://www.url.com',
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        location: {
            lat: 37.798694,
            lng: -122.396752
        }
    },
    {
        title: 'Fort Miley Pyramids',
        url: 'http://www.url.com',
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        location: {
            lat: 37.783255,
            lng: -122.508833
        }
    }
];

var Spot = function(data) {
    var self = this;
    this.title = ko.observable(data.title);
    this.location = ko.observable(data.location);
};

var ViewModel = function() {
    var self = this;
    this.spotList = ko.observableArray([]);
    spots.forEach(function(spotItem) {
        self.spotList.push(new Spot(spotItem));
    });
};

var locations = ko.observableArray([{
        title: 'Wallenberg 4 Step',
        location: {
            lat: 37.7802,
            lng: -122.446864
        }
    },
    {
        title: 'Clipper Hubba',
        location: {
            lat: 37.749408,
            lng: -122.43222
        }
    },
    {
        title: 'Sega Circle Ledges',
        location: {
            lat: 37.769155,
            lng: -122.405325
        }
    },
    {
        title: 'Pier 7 Stair Set',
        location: {
            lat: 37.798694,
            lng: -122.396752
        }
    },
    {
        title: 'Fort Miley Pyramids',
        location: {
            lat: 37.783255,
            lng: -122.508833
        }
    },
]);


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


    for (var i = 0; i < spots.length; i++) {
        var position = spots[i].location;
        var title = spots[i].title;
        var icon = spots[i].icon;
        var that = this;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            icon: icon,
            animation: google.maps.Animation.DROP,
            id: i
        });
        // Push the marker to our array of markers.
        markers.push(marker);

        // creates links on the left panel
        $('#markers').append('<a class="marker-link" data-markerid="' + i + '" href="#">' + locations()[i].title + '</a><br><br>');

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
    $('.marker-link').on('click', function() {
        google.maps.event.trigger(markers[$(this).data('markerid')], 'click');
    });
    
    // fits the marker area into the browser window
    map.fitBounds(bounds);

    function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
            infowindow.setContent('');
            infowindow.marker = marker;
            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick', function() {
                infowindow.setMarker = null;
            });
            var streetViewService = new google.maps.StreetViewService();
            var radius = 50;
               // In case the status is OK, which means the pano was found, compute the
          // position of the streetview image, then calculate the heading, then get a
          // panorama from that and set the options
          function getStreetView(data, status) {
            if (status == google.maps.StreetViewStatus.OK) {
              var nearStreetViewLocation = data.location.latLng;
                console.log(nearStreetViewLocation + " this var");
              var heading = google.maps.geometry.spherical.computeHeading(
                nearStreetViewLocation, marker.position);
                infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
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
//var createMap = initMap();

ko.applyBindings(new ViewModel());
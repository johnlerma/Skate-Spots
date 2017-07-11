var marker;
var markers = [];
var infowindow;
var infowindowOpen = false;
var footerOpen = false;
var footerclosebtn = false;
var drawerinit = true;

var ViewModel = function() {
    var self = this;
    this.displayMessage = ko.observable(true);
    this.selectedType = ko.observable("ALL");
    this.displayAdvancedOptions = ko.observable(false);
    this.shouldShowCloseBtn = ko.observable(false);
    this.shouldShowCaretBtn = ko.observable(false);
    this.footerimages = ko.observable(false);
    this.moveUp = ko.observable();
    this.moveUpFix = ko.observable(false);
    this.nearbyTitle = ko.observable("Where is your session today?");
    this.flickrImgArray = ko.observableArray();
    this.footerwrapFix = ko.observable();
    this.footerwrap = ko.observable();
    this.unclickable = ko.observable();
    this.unclickable(true);
    this.footerwrapFix('footerwrapFix');

    // footer open/close button
    footerControlFunction = function(){
                if (footerOpen === false) {
            self.moveUpFix(true);
            self.shouldShowCloseBtn(true);
            self.shouldShowCaretBtn(false);
            footerOpen = true;
        } else {
            self.moveUpFix(false);
            self.shouldShowCloseBtn(false);
            self.shouldShowCaretBtn(true);
            footerOpen = false;
            footerclosebtn = true;
        }
    };
 
    //hamburger menu start
    function toggleSidebar() {
        $(".button").toggleClass("active");
        $(".maincontainer").toggleClass("maincontainer-move");
    }

    $(".button").on("click tap", function() {
        toggleSidebar();
    });

    ////the drop down filter////
    this.listToShow = ko.pureComputed(function() {
        if (infowindowOpen === true && this.selectedType() !== largeInfowindow.marker.type) {
            largeInfowindow.close();
        }
        //turns on all the markers as default before filtering them
        for (var k = 0; k < markers.length; k++) {
            markers[k].setVisible(true);
        }

        var desiredType = this.selectedType();
        if (desiredType == "ALL") {
            return spots();
        } else {
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

    this.spotType = ko.observableArray(['ALL', 'STAIRS', 'HANDRAIL', 'BANK', 'SKATEPARK']);
    // knockout controls the click function of the list
    this.itemClick = function(location) {
        if (drawerinit === true) {
            self.unclickable(false);
        }
        if (footerOpen === true) {
            self.shouldShowCloseBtn(true);
            self.shouldShowCaretBtn(false);

        } else {
            self.shouldShowCloseBtn(false);
            self.shouldShowCaretBtn(true);
        }

        self.footerimages(false);
        google.maps.event.trigger(markers[this.numid], 'click');
        self.nearbyTitle("Photos near this location: " + this.title);
    };

    // Animation for the list
    this.showlistElement = function(elem) {
        if (elem.nodeType === 1) $(elem).hide().slideDown();
    };

    this.hidelistElement = function(elem) {
        if (elem.nodeType === 1) $(elem).slideUp(function() {
            $(elem).remove();
        });
    };

};

//fade some elements
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
    var self = this;
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 37.7749,
            lng: -122.4194
        },
        zoom: 10,
        styles: styles,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DEFAULT,
            position: google.maps.ControlPosition.TOP_RIGHT,

        },
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_TOP
        },
        streetViewControlOptions: {
            position: google.maps.ControlPosition.RIGHT_TOP
        }

    });

    // Create a single latLng literal object.
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
        
        //add a click listener to the marker
        marker.addListener('click', markerclick);
       
        bounds.extend(markers[i].position);
    }
    
    // 
    function markerclick(){
        var that = this;
         if (drawerinit === true) {
            vm.unclickable(false);
        }
        infowindowOpen = true;
        populateInfoWindow(this, largeInfowindow);
        vm.flickrImgArray.removeAll();
        this.setAnimation(google.maps.Animation.BOUNCE);
        if (footerclosebtn === false){
        vm.moveUpFix(true);
        }
        vm.nearbyTitle("Photos near this location: " + this.title);
         setTimeout(function() {
                that.setAnimation(null);
            }, 750);
    }


    // fits the marker area into the browser window
    map.fitBounds(bounds);

    //populate info window with 
    function populateInfoWindow(marker, infowindow) {

        //FLickr API call
        function getFlickrImage() {
            var flickrURL = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=a47f036c23ed9b5f526a4c21a14658f0';
            flickrURL += $.param({
                'method': 'flickr.photos.search',
                'api_key': 'a47f036c23ed9b5f526a4c21a14658f0',
                'tags': 'skateboarding, skateboard, skate, skateboards',
                'per_page': 10,
                'lat': marker.lat,
                'lon': marker.lng,
                'radius': 0.25,
                'radius_units': 'mi',
                'privacy_filter': 1,
                'format': 'json',
                'nojsoncallback': 1
            });
            
            //add the returned photos to the footer
            $.getJSON(flickrURL, function(data) {
                for (var j = 0; j < data.photos.photo.length; j++) {
                    var photofeed = data.photos.photo[j];
                    var flickrimgs = ('https://farm' + photofeed.farm + '.staticflickr.com/' + photofeed.server + '/' + photofeed.id + '_' + photofeed.secret + '_n.jpg');
                    vm.flickrImgArray.push( flickrimgs);
                }

            }).fail(function() {
             // change close button here
                vm.moveUpFix(false);
               alert("Flickr feed is unavailable.");
            });

            //when marker clicked on, check to see if footer is open and do stuff
            if (footerclosebtn === false) {
                vm.moveUpFix(true);
                footerOpen = true;
                vm.shouldShowCloseBtn(true);
                vm.shouldShowCaretBtn(false);
            }

        }

        getFlickrImage();
        
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
            infowindow.setContent('');
            infowindow.marker = marker;

            // infowindow listens for a closed click
            infowindow.addListener('closeclick', function() {
                infowindowOpen = false;
                footerOpen = false;
            });

            var streetViewService = new google.maps.StreetViewService();
            var radius = 50;
            // compute the position of the streetview image
//            function getStreetView(data, status) {
            var getStreetView = function(data, status) {
                if (status == google.maps.StreetViewStatus.OK) {
                    var nearStreetViewLocation = data.location.latLng;
                    var heading = google.maps.geometry.spherical.computeHeading(nearStreetViewLocation, marker.position);
                    var infoContent = '<div class="panoTitle">' + marker.title + '</div><div id="pano"></div>';
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
                    infowindow.setContent('<div class="panoTitle">' + marker.title + '</div>' +
                        '<div>No Street View Found</div>');
                }
            };
            // Use streetview service to get the closest streetview image within
            // 50 meters of the markers position
            streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
        }
        // Open the infowindow on the correct marker.
        infowindow.open(map, marker);
    }
}

//ko.applyBindings(new ViewModel());
var vm = new ViewModel();
ko.applyBindings(vm);

mapError = () => {
  // Error handling
    alert("Sorry Google Maps is not available. Please check back at a later time.");
};

function googleError(e) {
    alert("Google Maps cannot be loaded at this time");
    console.log(e);
}
var marker;
var markers = [];
var infowindow;
var infowindowOpen = false;
var footerOpen = false
var footerclosebtn = false;
var spots = ko.observableArray([{
        title: 'Wallenberg 4 Step',
        name: 'bbbbbb',
        url: 'http://www.url.com',
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        type: 'STAIRS',
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
        type: 'LEDGES',
        numid: '1',
        location: {
            lat: 37.749408,
            lng: -122.43222
        }
    },
    {
        title: 'SOMA Skatepark',
        url: 'http://www.url.com',
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        type: 'SKATEPARK',
        numid: '2',
        location: {
            lat: 37.770092,
            lng: -122.421468
        }
    },
    {
        title: 'Pier 7 Stair Set',
        url: 'http://www.url.com',
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        type: 'STAIRS',
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
        type: 'BANK',
        numid: '4',
        location: {
            lat: 37.783255,
            lng: -122.508833
        }
    }
]);

//function hideCaretshowClose(){
//            $(".caret").hide();
//            $(".close").show();
//            footerOpen = true;
//    };

var ViewModel = function() {
////hamburger menu start////

        function toggleSidebar() {
            $(".button").toggleClass("active");
            $(".maincontainer").toggleClass("maincontainer-move")
//            $(".list").toggleClass("move-to-left");
//            $(".sidebar-item").toggleClass("active");
            console.log("togglesidebar")
            //$(".mainFooterContainer").toggleClass("footerwrapbig");
            
        }

        $(".button").on("click tap", function() {
            toggleSidebar();
            console.log("toggle");
        });

        $(document).keyup(function(e) {
            if (e.keyCode === 27) {
                toggleSidebar();
            }
        });
    
    /////// hamburger end////
    
    var self = this;
    //var selectedCountry = ko.observable();
    //this.footerOpen = ko.observable(false);
    this.displayMessage = ko.observable(true);
    this.selectedType = ko.observable("ALL");
    this.displayAdvancedOptions = ko.observable(false);
    this.shouldShowCloseBtn = ko.observable(false);
    this.shouldShowCaretBtn = ko.observable(false);
    this.footerimages = ko.observable(false);
    this.moveUp = ko.observable();
    this.moveUpFix = ko.observable();
    this.nearbyTitle = ko.observable("Where is your session today?");
    this.footerwrapFix = ko.observable();
    this.footerwrap = ko.observable();

    
   
   // self.footerwrap2('footerwrap');
    //self.footerwrap(true);
   self.footerwrapFix('footerwrapFix');
    
     //// footer close button

//    $(".close").on("click tap", function() {
//            //$(".footerwrap").removeClass("flickr-move-up ");
//            self.moveUp(false);
//            console.log("wtf")
//            self.moveUpFix(false);
//            self.footerwrap('');
//            self.footerwrapFix('footerwrapFix');
//            
//           
//            self.shouldShowCloseBtn(false);
//            self.shouldShowCaretBtn(true);
//            
//           // $(this).hide();
//            //$(".caret").show();
//            footerOpen = false;
//            footerclosebtn = true;
//        });
//    
//    //// footer close button
//    
//    $(".caret").on("click tap", function() {
//            //$(".footerwrap").addClass("flickr-move-up ");
////            $(this).hide();
////            $(".close").show();
//           
//            self.moveUp(false);
//            self.moveUpFix(true);
//            self.shouldShowCloseBtn(true);
//            self.shouldShowCaretBtn(false);
//            footerOpen = true;
//        });
    
    ///the whole footer header bar will open and close the fox not just the close button
    
    $(".footercontrols").on("click tap", function(){
        
            if (footerOpen == false){
                self.moveUpFix(true);
                self.shouldShowCloseBtn(true);
                self.shouldShowCaretBtn(false);
                footerOpen = true;
            }
            else {
                self.moveUpFix(false);
                self.shouldShowCloseBtn(false);
                self.shouldShowCaretBtn(true);
                footerOpen = false;
                footerclosebtn = true;
            }
    });
    
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
//            for (var i = 0; i < spots().length; i++) {
//                if (spots()[i].type !== desiredType) {
//                    // what is this for?
//                    console.log("what is this for");
//                }
//            }

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

    this.spotType = ko.observableArray(['ALL', 'STAIRS', 'LEDGES', 'BANK', 'SKATEPARK']);
    // knockout controls the click function of the list
    this.itemClick = function(location) {



//        if (footerclosebtn == true){
//            console.log("what am i doing here?");
//        }
//        else {
            self.moveUp(true);
            console.log("else bla bla")
            self.shouldShowCloseBtn(true);
            self.shouldShowCaretBtn(false);       
//        }
        self.footerimages(false);
        $('.infowndwimg').remove();
        google.maps.event.trigger(markers[this.numid], 'click');
        self.nearbyTitle("Photos near this location: " + this.title);


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
/// fixes the problem with multiple css bindings
ko.bindingHandlers['css2'] = ko.bindingHandlers.css;
ko.bindingHandlers['css3'] = ko.bindingHandlers.css;
ko.bindingHandlers['css4'] = ko.bindingHandlers.css;

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
    console.log("initMap start: footerOpen window open?" + footerOpen)
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 37.7749,
            lng: -122.4194
        },
        zoom: 10,
        styles: styles,
        mapTypeControlOptions: {
                  style: google.maps.MapTypeControlStyle.DEFAULT,
                  position:google.maps.ControlPosition.TOP_RIGHT,
                  
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
        //var that = this;
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
            footerOpen = true;
            //populate the info window,make the marker bounce, reset flickr footer
            populateInfoWindow(this, largeInfowindow);
            
             $('.infowndwimg').remove();
            this.setAnimation(google.maps.Animation.BOUNCE);
            vm.nearbyTitle("Photos near this location: " + this.title);
            setTimeout(function() {
                inthisfunc.setAnimation(null);
            }, 750);

        });
        bounds.extend(markers[i].position);
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
            console.log("getflickrimage: " + flickrURL);
            //add the returned photos to the footer
            $.getJSON(flickrURL, function(data) {


                for (var j = 0; j < data.photos.photo.length; j++) {
                    var photofeed = data.photos.photo[j];
                    //var $flickrfooter2 = $('#flickrfooter');
                    $('.flickrfooter').append('<img class="infowndwimg" src="https://farm' + photofeed.farm + '.staticflickr.com/' + photofeed.server + '/' + photofeed.id + '_' + photofeed.secret + '_n.jpg">');
                }
                var detail = data.photos.photo[0];
                //var $flickrfooter = $('#flickrfooter');
                $('.flickrfooter').append('<img class="infowndwimg" src="https://farm' + detail.farm + '.staticflickr.com/' + detail.server + '/' + detail.id + '_' + detail.secret + '_n.jpg">');
            }).fail(function() {
                $flickrfooter.append('<p style="text-align: center;">Sorry! The photo</p><p style="text-align: center;">could not be loaded</p>');
            });
            console.log("footerOpen: " + footerOpen);
            
            //when marker clicked on, check to see if footer is open and do stuff
           if (footerclosebtn == false){
                console.log("333433");
                vm.moveUpFix(true);
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
                //var $flickrfooter2 = $('.infowndwimg');
                //$('.infowndwimg').remove();
                infowindowOpen = false;
                footerOpen = false;
            });

            var streetViewService = new google.maps.StreetViewService();
            var radius = 50;
            // In case the status is OK, which means the pano was found, compute the
            // position of the streetview image, then calculate the heading, then get a
            // panorama from that and set the options
            function getStreetView(data, status) {
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
            }
            // Use streetview service to get the closest streetview image within
            // 50 meters of the markers position
            streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);

            // Open the infowindow on the correct marker.

        }
        infowindow.open(map, marker);
    }
}

//ko.applyBindings(new ViewModel());
var vm = new ViewModel();
ko.applyBindings(vm);



function googleError(e) {
    alert("Google Maps cannot be loaded at this time");
    console.log(e);
}
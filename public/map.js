var Map = function(element, center, zoom) {
    this.googleMap = new google.maps.Map(element, {center: center, zoom: zoom});
    this.markers = [];
    this.infowindows = [];
    this.addMarker = function(latLong, text) {
        // var goldStar = {
        //     path: 'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',
        //     fillColor: 'yellow',
        //     fillOpacity: 0.8,
        //     scale: 0.05,
        //     strokeColor: 'gold',
        //     strokeWeight: 1
        // };
        var icon = {
          url: "hand.png",
          size: new google.maps.Size(30, 30),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(10, 20),
          scaledSize: new google.maps.Size(25, 25)
        };
        var marker = new google.maps.Marker({
            position: latLong,
            map: this.googleMap,
            draggable: true,
            icon: icon,
            // icon: {path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW, scale:5},
            // icon: "https://maps.google.com/mapfiles/kml/shapes/schools_maps.png",
            // icon: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
            animation: google.maps.Animation.DROP,
            title: text
        });

        // marker.addListener('mouseover', function() {
        //     if (this.getAnimation() === null) {
        //         this.setAnimation(google.maps.Animation.BOUNCE);
        //     }
        // });
        // marker.addListener('mouseout', function(e) {
        //     this.setAnimation(null);
        // }); // < --- works just annoying after a while

        this.markers.push(marker);
        return marker;
    };
    this.addMe = function() {
        navigator.geolocation.getCurrentPosition(function(res) {
            // var m = this.addMarker({lat: res.coords.latitude, lng: res.coords.longitude}, null);
            // var i = this.addInfoWindow("This is you!");
            // i.open(this.googleMap, m);
            this.addInfoMarker({lat: res.coords.latitude, lng: res.coords.longitude}, "Look it's You!");

        }.bind(this));
    };
    this.addInfoWindow = function(text) {
        var infowindow = new google.maps.InfoWindow({
            content: text
        });
        this.infowindows.push(infowindow);
        return infowindow;
    };

    this.addInfoMarker = function(latLng, text) {
        var marker = this.addMarker(latLng, text);
        var infoWindow = this.addInfoWindow(text);
        marker.addListener('click', function() {

            infoWindow.open(this.googleMap, marker);
        }.bind(this));

        infoWindow.addListener('closeclick', function() {
            console.log("ASdasd");
            console.log(infoWindow.getPosition());
            infoWindow.open(this.googleMap, marker);
        }.bind(this));
    };

    this.bindClick = function() {
        google.maps.event.addListener(this.googleMap, 'click', function(e) {
            console.log("I got clicked");
            console.log("lat:", e.latLng.lat());
            console.log("lng:", e.latLng.lng());
            this.addMarker({lat: e.latLng.lat(), lng: e.latLng.lng()});
        }.bind(this));
    };
};

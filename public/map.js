var Map = function(element, center, zoom) {
    this.googleMap = new google.maps.Map(element, {center: center, zoom: zoom});
    this.geocoder = new google.maps.Geocoder();
    this.markers = [];
    this.infowindows = [];
    this.addMarker = function(latLong, text) {
        var marker = new google.maps.Marker({
            position: latLong,
            map: this.googleMap,
            draggable: true,
            // icon: icon,
            animation: google.maps.Animation.DROP,
            title: text
        });
        this.markers.push(marker);
        return marker;
    };
    this.addInfoWindow = function(text) {
        var infowindow = new google.maps.InfoWindow({
            content: text
        });
        this.infowindows.push(infowindow);
        return infowindow;
    };
    this.addInfoMarker = function(latLng, infoText, text) {
        var marker = this.addMarker(latLng, text);
        var infoWindow = this.addInfoWindow(infoText);
        marker.addListener('click', function() {
            for (var i = 0; i < this.infowindows.length; i++) {
                this.infowindows[i].close();
            }
            infoWindow.open(marker.map, marker);
        }.bind(this));
    };

    this.findMe = function(getInfo) {
        navigator.geolocation.getCurrentPosition(function(res) {
            this.clearMarkers();
            this.getCountryLocation({lat: res.coords.latitude, lng: res.coords.longitude}, getInfo);
            // this.addInfoMarker({lat: res.coords.latitude, lng: res.coords.longitude}, "Look it's You!");
        }.bind(this));
    };

    this.centerMap = function(latlng) {
        this.googleMap.panTo(latlng);
    };

    this.clearMarkers = function() {
        for (var i = 0; i < this.markers.length; i++) {
            this.markers[i].setMap(null);
        }
        this.markers = [];
    };

    this.getCountryLocation = function(location, genInfo, name) {
        // var geocoder = new google.maps.Geocoder();
        // var location = {lat: 5, lng: 5};
        this.geocoder.geocode( { 'location': location}, function(results, status) {
            this.geocodeDisplay(results, status, genInfo, name);
        }.bind(this));
    };

    this.getRegionLocation = function(region) {
        // var geocoder = new google.maps.Geocoder();
        // var location = {lat: 5, lng: 5};
        this.geocoder.geocode( { 'address': region}, function(results, status) {
            this.geocodeDisplay(results, status);
        }.bind(this));
    };
    this.geocodeDisplay = function(results, status, genInfo, name) {
        if (status == google.maps.GeocoderStatus.OK) {
            var res = results[results.length - 1];

            this.centerMap(res.geometry.location);
            // this.centerMap({lat: latlng[0], lng: latlng[1]});
            this.googleMap.fitBounds(res.geometry.viewport);
            // console.log(results[0].geometry.viewport);
            // this.addInfoMarker({lat: latlng[0], lng: latlng[1]}, infoText, name+" - According to RESTCountries");
            if (genInfo) {
                if (name) {
                    this.addInfoMarker(results[0].geometry.location, genInfo, name);
                } else {
                    this.addInfoMarker(results[0].geometry.location, genInfo(res.address_components[0].short_name), res.address_components[0].long_name);
                }
            }

        }
    }.bind(this);

    this.zoomTo = function(name, latlng, infoText) {
        this.getCountryLocation({lat: latlng[0], lng: latlng[1]}, infoText, name);
    };


    this.bindClick = function(genInfo) {
        google.maps.event.addListener(this.googleMap, 'click', function(e) {
            this.clearMarkers();
            this.getCountryLocation({lat: e.latLng.lat(), lng: e.latLng.lng()}, genInfo);
        }.bind(this));
    };
};

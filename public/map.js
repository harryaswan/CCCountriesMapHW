var Map = function(element, center, zoom) {
    this.googleMap = new google.maps.Map(element, {center: center, zoom: zoom});
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

    this.findMe = function() {
        navigator.geolocation.getCurrentPosition(function(res) {
            this.addInfoMarker({lat: res.coords.latitude, lng: res.coords.longitude}, "Look it's You!");
        }.bind(this));
    };

    this.centerMap = function(latlng) {
        this.googleMap.panTo(latlng);
    };

    this.getCountryLocation = function(location, genInfo) {
        var geocoder = new google.maps.Geocoder();
        // var location = {lat: 5, lng: 5};
        geocoder.geocode( { 'location': location}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var res = results[results.length - 1];
                console.log(res);

                this.centerMap(res.geometry.location);
            //     this.centerMap({lat: latlng[0], lng: latlng[1]});
                this.googleMap.fitBounds(res.geometry.viewport);
            //     // console.log(results[0].geometry.viewport);
            //     this.addInfoMarker({lat: latlng[0], lng: latlng[1]}, infoText, name+" - According to RESTCountries");
                this.addInfoMarker(results[0].geometry.location, genInfo(res.address_components.short_name), name+" - According to Google");
            }
        }.bind(this));
    };

    this.zoomTo = function(name, latlng, infoText) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode( { 'address': name}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                // this.centerMap(results[0].geometry.location);
                this.centerMap({lat: latlng[0], lng: latlng[1]});
                this.googleMap.fitBounds(results[0].geometry.viewport);
                // console.log(results[0].geometry.viewport);
                this.addInfoMarker({lat: latlng[0], lng: latlng[1]}, infoText, name+" - According to RESTCountries");
                this.addInfoMarker(results[0].geometry.location, infoText, name+" - According to Google");
            }
        }.bind(this));
    };


    this.bindClick = function(genInfo) {
        google.maps.event.addListener(this.googleMap, 'click', function(e) {
            console.log("I got clicked");
            console.log("lat:", e.latLng.lat());
            console.log("lng:", e.latLng.lng());
            this.getCountryLocation({lat: e.latLng.lat(), lng: e.latLng.lng()}, genInfo);
        }.bind(this));
    };

    // this.bindClick();
};

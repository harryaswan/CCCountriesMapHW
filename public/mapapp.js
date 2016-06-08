var init = function() {
    var mapContainer = document.getElementById('map');
    var map = new Map(mapContainer, {lat: 4.9469690, lng: 2.2020220}, 12);
    // var m1 = map.addMarker({lat: 55.9469690, lng: -3.2020220}, "A");
    // var m2 = map.addMarker({lat: 55.9469680, lng: -3.2030210}, "B");

    map.addMe();

    map.bindClick();

    var locator = new GeoLocator(map);
    locator.setMapCenter();

};


var GeoLocator = function(map) {
    this.map = map;
    this.setMapCenter = function() {
        navigator.geolocation.getCurrentPosition(function(res) {
            this.map.googleMap.setZoom(17);
            this.map.googleMap.panTo({lat: res.coords.latitude, lng: res.coords.longitude});
        }.bind(this));
    };
};


window.onload = init;

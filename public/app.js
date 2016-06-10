
var CountryApp = function() {
    this.countryData = null;
    this.map = null;

    this.start = function() {
        this.map = new Map(document.getElementById('map'), {lat: 4.9469690, lng: 2.2020220}, 5);

        var data = localStorage.getItem('data');
        if (data) {
            this.countryData = JSON.parse(data);
            this.populateRegion(this.countryData);
            this.createSelect(this.countryData);
        } else {
            this.grabData();
        }

        var item = localStorage.getItem('lastCountry');
        if (item) {
            this.viewCountry(this.grabCountry(item), true);
        }

        this.map.bindClick(this.generateInfoWindowText);

        document.getElementById('find_me').onclick = function() {
            this.map.findMe(this.generateInfoWindowText);
        }.bind(this);

    };

    this.generateInfoWindowText = function(code) {
        var country = this.grabCountry(code);
        var sCountry = document.createElement('span');

        var img = document.createElement('img');

        // img.setAttribute("class", "flag flag-" + country.alpha2Code.toLowerCase());

        img.setAttribute('src', "http://www.geonames.org/flags/x/"+country.alpha2Code.toLowerCase()+".gif");
        // img.style.height = "20px";
        img.style.display = "block";
        img.style.width = "30px";
        img.style.margin = "auto";
        var countryName = this.getCountyProperty(country, 'name');
        countryName.style.textAlign = "center";

        sCountry.appendChild(countryName);
        sCountry.appendChild(img);
        sCountry.appendChild(this.getCountyProperty(country, 'population', "Population:", true));
        sCountry.appendChild(this.getCountyProperty(country, 'capital', "Capital:", true));

        return sCountry;
    }.bind(this);

    this.createSelect = function(data) {
        var parent = document.getElementById('select-country');
        var selectElement = document.createElement('select');
        selectElement.setAttribute('name', 'country_select');
        selectElement.setAttribute('id', 'country_select');
        selectElement.onchange = function(e, data) {
            var me = e.target;
            this.viewCountry(this.grabCountry(me.value), true);
        }.bind(this);
        var lastCountry = localStorage.getItem('lastCountry');
        for (var i = 0; i < data.length; i++) {
            var tmpOption = document.createElement('option');

            tmpOption.setAttribute('value', data[i].alpha3Code);
            // tmpOption.setAttribute('value', i);
            tmpOption.innerText = data[i].name;
            if (data[i].alpha3Code === lastCountry) {
                tmpOption.selected = true;
            }
            selectElement.appendChild(tmpOption);
        }
        parent.replaceChild(selectElement, document.getElementById('country_select'));
    };

    this.getCountyProperty = function(country, property, prepend, bold) {
        var p = document.createElement('p');
        if (prepend) {

            if (bold) {
                var b = document.createElement('b');
                b.innerText = country[property];
                p.innerText = prepend + " ";
                p.appendChild(b);
            } else {
                p.innerText = prepend + " " + country[property];
            }

        } else {
            p.innerText = country[property];
        }

        return p;
    };

    this.viewCountry = function(country, showBorders) {
        var parent = document.getElementById('country-list');
        var oldSpan = document.getElementById('country-list').getElementsByTagName('span')[0];
        var sCountry = this.generateInfoWindowText(country.alpha2Code);

        if (showBorders) {
            localStorage.setItem('lastCountry', country.alpha3Code);
        }

        this.map.zoomTo(country.name, country.latlng, sCountry);

    };

    this.grabCountry = function(id) {
        if (Number.parseInt(id)) {
            return this.countryData[id];
        } else {
            for (var i = 0; i < this.countryData.length; i++) {
                if (this.countryData[i].alpha3Code === id || this.countryData[i].alpha2Code === id) {
                    return this.countryData[i];
                }
            }
        }
        return null;
    };

    this.grabCountryRegions = function(region, sub) {
        var countries = [];
        for (var i = 0; i < this.countryData.length; i++) {
            if (sub) {
                if (this.countryData[i].subregion === region) {
                    countries.push(this.countryData[i]);
                }
            } else {
                if (this.countryData[i].region === region) {
                    countries.push(this.countryData[i]);
                } else if (region === "") {
                    countries.push(this.countryData[i]);
                }
            }

        }
        this.createSelect(countries);
    };

    this.grabSubRegions = function(region) {
        var regions = [];
        for (var i = 0; i < this.countryData.length; i++) {
            if (this.countryData[i].region === region) {
                if(regions.indexOf(this.countryData[i].subregion) < 0) {
                    regions.push(this.countryData[i].subregion);
                }
            }
        }
        return regions;
    };

    this.populateRegion = function() {
        var regions = [];
        for (var i = 0; i < this.countryData.length; i++) {
            if (regions.indexOf(this.countryData[i].region) < 0) {
                regions.push(this.countryData[i].region);
            }
        }
        regions.sort();
        var parent = document.getElementById('select-country');
        var htmlElement = document.getElementById('region_select');
        var regionSelect = document.createElement('select');
        regionSelect.setAttribute('id', 'region_select');

        regionSelect.onchange = function(e) {
            var me = e.target;
            this.populateSubRegion(me.value);
            this.grabCountryRegions(me.value, false);
            this.map.getRegionLocation(me.value);
        }.bind(this);

        for (i = 0; i < regions.length; i++) {
            var tmpOption = document.createElement('option');
            tmpOption.setAttribute('value', regions[i]);
            if (regions[i] === "") {
                tmpOption.innerText = "All Regions";
            } else {
                tmpOption.innerText = regions[i];
            }

            regionSelect.appendChild(tmpOption);
        }

        parent.replaceChild(regionSelect, htmlElement);
    };

    this.populateSubRegion = function(region) {
        var parent = document.getElementById('select-country');
        var htmlElement = document.getElementById('subregion_select');
        var subRegionSelect = document.createElement('select');
        subRegionSelect.setAttribute('id', 'subregion_select');

        subRegionSelect.onchange = function(e) {
            var me = e.target;
            this.grabCountryRegions(me.value, true);
            // this.map.getRegionLocation(me.value);
        }.bind(this);

        var subregions = this.grabSubRegions(region);

        for (i = 0; i < subregions.length; i++) {
            var tmpOption = document.createElement('option');
            tmpOption.setAttribute('value', subregions[i]);
            if (subregions[i] === "") {
                tmpOption.innerText = "All Subregions";
            } else {
                tmpOption.innerText = subregions[i];
            }

            subRegionSelect.appendChild(tmpOption);
        }

        parent.replaceChild(subRegionSelect, htmlElement);

    };
    this.grabData = function(cbs) {
        var url = "https://restcountries.eu/rest/v1";
        var request = new XMLHttpRequest();
        request.open("GET", url);
        request.onload = function() {
            if (request.status === 200) {
                var jsonString = request.responseText;
                localStorage.setItem('data', jsonString);
                this.countryData = JSON.parse(jsonString);
                this.populateRegion(this.countryData);
                this.createSelect(this.countryData);
                // if (arguments.length > 0) {
                //     for (var i = 0; i < cbs.length; i++) {
                //         var f = cbs[i];
                //         f(countryData);
                //     }
                // }
            }
        }.bind(this);
        request.send(null);
    };

};

var main = function() {
    var ca = new CountryApp();
    ca.start();
};

window.onload = main;

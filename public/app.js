var countryData = null;

var main = function() {
    var data = localStorage.getItem('data');
    if (data) {
        countryData = JSON.parse(data);
        populateRegion(countryData);
        createSelect(countryData);
    } else {
        grabData([populateRegion , createSelect]);
    }
    var item = localStorage.getItem('lastCountry');
    if (item) {
        viewCountry(grabCountry(item), true);
    }


};

var createSelect = function(data) {
    var parent = document.getElementById('select-country');
    var selectElement = document.createElement('select');
    selectElement.setAttribute('name', 'country_select');
    selectElement.setAttribute('id', 'country_select');
    selectElement.onchange = function(e, data) {
        var me = e.target;
        viewCountry(grabCountry(me.value), true);
    };
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

var viewCountry = function(country, showBorders) {
    var parent= document.getElementById('country-list');
    var liCountry = document.createElement('li');
    var ulCountry = document.createElement('ul');
    var liName = document.createElement('li');
    var bName = document.createElement('b');
    var liPop = document.createElement('li');
    var liCap = document.createElement('li');
    if (showBorders) {
        localStorage.setItem('lastCountry', country.alpha3Code);
    }
    bName.innerText = country.name;
    liName.appendChild(bName);
    liPop.innerText = country.population;
    liCap.innerText = country.capital;
    ulCountry.appendChild(liName);
    ulCountry.appendChild(liPop);
    ulCountry.appendChild(liCap);
    liCountry.appendChild(ulCountry);
    if (showBorders) {
        while (parent.lastChild) {
            parent.removeChild(parent.lastChild);
        }
    }
    parent.appendChild(liCountry);
    if (showBorders) {
        if (country.borders.length) {
            var tmp1 = document.createElement('li');
            var tmp2 = document.createElement('b');
            tmp2.innerText = "Borders with:";
            tmp1.appendChild(tmp2);
            parent.appendChild(tmp1);
            for (i = 0; i < country.borders.length; i++) {
                viewCountry(grabCountry(country.borders[i]), false);
            }
        }
    }
};

var grabCountry = function(id) {
    if (Number.parseInt(id)) {
        return countryData[id];
    } else {
        for (var i = 0; i < countryData.length; i++) {
            if (countryData[i].alpha3Code === id) {
                return countryData[i];
            }
        }
    }
    return null;
};

var grabCountryRegions = function(region, sub) {
    var countries = [];
    for (var i = 0; i < countryData.length; i++) {
        if (sub) {
            if (countryData[i].subregion === region) {
                countries.push(countryData[i]);
            }
        } else {
            if (countryData[i].region === region) {
                countries.push(countryData[i]);
            } else if (region === "") {
                countries.push(countryData[i]);
            }
        }

    }
    createSelect(countries);
};

var grabSubRegions = function(region) {
    var regions = [];
    for (var i = 0; i < countryData.length; i++) {
        if (countryData[i].region === region) {
            if(regions.indexOf(countryData[i].subregion) < 0) {
                regions.push(countryData[i].subregion);
            }
        }
    }
    return regions;
};

var populateRegion = function() {
    var regions = [];
    for (var i = 0; i < countryData.length; i++) {
        if (regions.indexOf(countryData[i].region) < 0) {
            regions.push(countryData[i].region);
        }
    }
    regions.sort();
    var parent = document.getElementById('select-country');
    var htmlElement = document.getElementById('region_select');
    var regionSelect = document.createElement('select');
    regionSelect.setAttribute('id', 'region_select');

    regionSelect.onchange = function(e) {
        var me = e.target;
        populateSubRegion(me.value);
        grabCountryRegions(me.value, false);
    };

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


    // parent.replaceChild(populateSubRegion(), parent.firstChild);

    parent.replaceChild(regionSelect, htmlElement);
};

var populateSubRegion = function(region) {
    var parent = document.getElementById('select-country');
    var htmlElement = document.getElementById('subregion_select');
    var subRegionSelect = document.createElement('select');
    subRegionSelect.setAttribute('id', 'subregion_select');

    subRegionSelect.onchange = function(e) {
        var me = e.target;
        grabCountryRegions(me.value, true);
    };

    var subregions = grabSubRegions(region);

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

var grabData = function(cbs) {
    var url = "https://restcountries.eu/rest/v1";
    var request = new XMLHttpRequest();
    request.open("GET", url);
    request.onload = function() {
        if (request.status === 200) {
            var jsonString = request.responseText;
            localStorage.setItem('data', jsonString);
            countryData = JSON.parse(jsonString);
            if (arguments.length > 0) {
                for (var i = 0; i < cbs.length; i++) {
                    var f = cbs[i];
                    f(countryData);
                }
            }
        }
    };
    request.send(null);
};

window.onload = main;

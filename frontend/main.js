window.onload = function (){ //Assign elements and global variables
  var zip = document.querySelector('#zip'),
      zipSubmit = document.querySelector('#zip-submit'),
      breweryList = document.querySelector('#brewery-list'),
      breweryInfo = document.querySelector('#brewery-info'),
      beerList = document.querySelector('#beer-list')
      listPage = document.querySelectorAll('.list-page'),
      breweryPage = document.querySelectorAll('.brewery-page'),
      currentData = "", // Most recent selected location data
      currentBrewery = "", // Most recent selected brewery data
      lat = "",
      lng = "";

  var url = 'http://localhost:3000';

  zipSubmit.addEventListener('click', function(ev){ // Zipcode submission
    ev.preventDefault();
    breweryList.innerHTML = "";
    var data = {zip: zip.value};
    $.ajax({
      url: url + "/locations",
      method: 'POST',
      data: data,
      dataType: 'json'
    }).done(function(response) {
      console.log( "response:", response);
      if (response.currentPage){
      pageCtrl('list', response.data);
      }
    });
  }); //End zipcode submission

  function initMap(lat, lng){ //Map is created
    var bounds = new google.maps.LatLngBounds();
    var myLatlng = new google.maps.LatLng(lat, lng);
    var mapOptions = {
      zoom: 14,
      center: myLatlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map"),
        mapOptions);
    for (var i = currentData.length-1; i >= 0; i--){ // Written with data passed to changing global variable.
      var position = new google.maps.LatLng(currentData[i].latitude, currentData[i].longitude);
      bounds.extend(position);
      var marker = new google.maps.Marker({
        position: position,
        map: map,
        title: currentData[i].brewery.name
      })
    };
    map.fitBounds(bounds);
  }; // End of initMap


  function pageCtrl(what, data) {
    if (what === "list") { // Render brewery list after zip search
      for (var i = 0; i < data.length; i++) {
        currentData = data;
        var breweryEntry = document.createElement('div');
        breweryListener(breweryEntry, i);
        breweryEntry.id = "brewery-entry";
        var breweryName = document.createElement('h3');
        var name = document.createTextNode(i + 1 + ". " + data[i].brewery.name);
        breweryName.appendChild(name);
        breweryEntry.appendChild(breweryName);
        breweryName.id = "brewery-name";
        var breweryType = document.createElement('p');
        var type = document.createTextNode(data[i].locationTypeDisplay);
        breweryType.appendChild(type);
        breweryEntry.appendChild(breweryType);
        breweryType.id = "brewery-type";
        var breweryWeb = document.createElement('a');
        breweryWeb.href = data[i].brewery.website;
        breweryWeb.innerHTML = data[i].brewery.website;
        breweryEntry.appendChild(breweryWeb);
        breweryWeb.id = "brewery-web";
        var breweryAdd = document.createElement('p');
        var address = document.createTextNode(data[i].streetAddress);
        breweryAdd.appendChild(address);
        breweryEntry.appendChild(breweryAdd);
        breweryAdd.id = "brewery-address";
        breweryList.appendChild(breweryEntry);
      }
      show(what);
    }
    if (what === "list") { // Inital center point for map until bounds function takes over
      lat = data[1].latitude;
      lng = data[1].longitude;
      initMap(lat,lng);
    }
    if (what === "brewery") { // Render brewery information after entry click
      breweryInfo.innerHTML = '';
      beerList.innerHTML = '';
      var breweryName = document.createElement('h2');
      var name = document.createTextNode(data[0].data.name);
      breweryName.appendChild(name);
      breweryInfo.appendChild(breweryName);
      breweryName.id = "brewery-info-name";
      var breweryEst = document.createElement('p');
      var est = document.createTextNode("Established: " + data[0].data.established);
      breweryEst.appendChild(est);
      breweryInfo.appendChild(breweryEst);
      breweryEst.id = "brewery-info-est";
      var breweryWeb = document.createElement('a');
      breweryWeb.href = data[0].data.website;
      breweryWeb.innerHTML = data[0].data.website;
      breweryInfo.appendChild(breweryWeb);
      breweryWeb.id = "brewery-info-web";
      var breweryDesc = document.createElement('p');
      var desc = document.createTextNode("Description: " + data[0].data.description);
      breweryDesc.appendChild(desc);
      breweryInfo.appendChild(breweryDesc);
      breweryDesc.id = "brewery-info-desc";
      //if (data[1].data.length < 10) {
        for (var i = 0; i < data[1].data.length; i++) { //Print list of beers
          var short = data[1].data[i];
          var beerEntry = document.createElement('div');
          beerEntry.id = "beer-entry";
          var beerName = document.createElement('h4');
          var nameBeer = document.createTextNode("Name: " + short.name);
          beerName.appendChild(nameBeer);
          beerEntry.appendChild(beerName);
          if (short.style) {
            var beerStyle = document.createElement('p');
            var style = document.createTextNode("Style: " + short.style.name)
            beerStyle.appendChild(style);
            beerEntry.appendChild(beerStyle);
            beerStyle.id = "beer-style";
          }
          if (short.available) {
            var beerAvail = document.createElement('p');
            var avail = document.createTextNode("Availability: " + short.available.name);
            beerAvail.appendChild(avail);
            beerEntry.appendChild(beerAvail);
            beerAvail.id = "available"
          }
          if (short.abv) {
            var beerAbv = document.createElement('p')
            var abv = document.createTextNode("ABV: " + short.abv);
            beerAbv.appendChild(abv);
            beerEntry.appendChild(beerAbv);
            beerAbv.id = "abv";
          }
          var add = document.createElement('button');
          add.innerHTML = "Pin to CheckList"
          beerEntry.appendChild(add);
          beerList.appendChild(beerEntry);
        }
      //}
      show(what);
    }

  };// End of pageCtrl

  function breweryListener(element, num){ // Add listeners breweries and post for brewery specifics
    element.addEventListener('click', function(ev){
      ev.preventDefault();
      var getId = currentData[num].breweryId;
      $.ajax({
        url: url + "/brewery",
        method: 'POST',
        data: {breweryId: getId},
        dataType: 'json'
      }).done(function(response) {
        console.log("response1:", response);
        currentBrewery = response;
        if (response[0].message === "Request Successful"){
          pageCtrl("brewery", currentBrewery);
        }
      });
    });
  };

  function show(dis) {
    if (dis === "brewery") {
      for (var i = 0; i < listPage.length; i++){ // Two for loops to show Brewery Page
        listPage[i].style.display = "none";
      }
      breweryPage[0].style.display = "block";
      breweryPage[1].style.display = "flex"
    }
    if (dis === "list") {
      for (var i = 0; i < listPage.length; i++){ // Two for loops to show Brewery Page
        listPage[i].style.display = "block";
      }
      for (var i = 0; i < breweryPage.length; i++){
        breweryPage[i].style.display = "none";
      }
    }
  }
}; // End window.onload

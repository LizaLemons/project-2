window.onload = function (){ //Assign HTML elements
  var zip = document.querySelector('#zip'),
      zipSubmit = document.querySelector('#zip-submit'),
      breweryList = document.querySelector('#brewery-list'),
      newData = '',
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
      pageCtrl('submit', response.data);
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
    for (var i = newData.length-1; i >= 0; i--){ // Written with data passed to changing global variable.
      var position = new google.maps.LatLng(newData[i].latitude, newData[i].longitude);
      bounds.extend(position);
      var marker = new google.maps.Marker({
        position: position,
        map: map,
        title: newData[i].brewery.name
      })
    };
    map.fitBounds(bounds);
  };


  function pageCtrl(what, data) {
    if (what === "submit") { // Render brewery list after zip search
      for (var i = data.length-1; i >= 0; i--){
        newData = data;
        var breweryEntry = document.createElement('div');
        breweryListener(breweryEntry);
        breweryEntry.id = "brewery-entry";
        var breweryName = document.createElement('h3');
        var name = document.createTextNode((data.length - i) + ". " + data[i].brewery.name);
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
    }
    if (what === "submit") {
      lat = data[1].latitude;
      lng = data[1].longitude;
      initMap(lat,lng);
    }
    // if (what === "found") {
    //   geolocation implementation
    // }
  }

  function breweryListener(element){ // Add listeners breweries and post for brewery specifics


  }

}; // End window.onload

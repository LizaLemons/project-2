window.onload = function (){ //Assign elements and global variables
  var checkList = document.querySelector('#checklist'),
      checkButton = document.querySelector('#checklist-button'),
      zip = document.querySelector('#zip'),
      zipSubmit = document.querySelector('#zip-submit'),
      breweryList = document.querySelector('#brewery-list'),
      breweryInfo = document.querySelector('#brewery-info'),
      beerList = document.querySelector('#beer-list')
      listPage = document.querySelectorAll('.list-page'),
      breweryPage = document.querySelectorAll('.brewery-page'),
      currentData = "", // Most recent selected location data
      currentBrewery = "", // Most recent selected brewery data
      currentChecklist = "",
      progress = document.querySelector('.progress'),
      lat = "",
      lng = "";

  progress.style.display = 'none'; //progress bar, API is slow sometimes
  // var url = 'http://localhost:3000';
  var url = 'https://mighty-refuge-57413.herokuapp.com'

  $(checkButton).click(function() { //Hide or show checklist, change button text to match
    $(checkList).slideToggle("slow", function() {
      if (checkButton.innerText === "Show Checklist") {
        checkButton.innerText = "Hide Checklist"
      } else if (checkButton.innerText === "Hide Checklist") {
        checkButton.innerText = "Show Checklist"
      }
    });
  });

  checkButton.addEventListener('click', function(){ // Get list of added beers
    progress.style.display = 'block'
    $.ajax({
      url: url + '/beers',
      dataType: 'json'
    }).done(function(response){
      console.log("response: ", response);
      currentChecklist = response;
      if (response) {
        fillChecklist();
      }
    });
  })

  zipSubmit.addEventListener('click', function(ev){ // Zipcode submission
    ev.preventDefault();
    progress.style.display = 'block';
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
      progress.style.display = 'none';
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
      // var infowindow = new google.maps.InfoWindow({
      //   content: currentData[i].brewery.name
      // }); ---Tried to make identifier on map
      var marker = new google.maps.Marker({
        position: position,
        map: map
      })
      // marker.addListener('click', function() {
      //   infowindow.open(map, marker);
      // });
    };
    map.fitBounds(bounds);
  }; // End of initMap


  function pageCtrl(what, data) {
    if (what === "list") { // Render brewery list after zip search
      for (var i = 0; i < data.length; i++) {
        currentData = data;
        var breweryEntry = document.createElement('div');
        breweryEntry.classList.add("z-depth-2");
        breweryListener(breweryEntry, i);
        breweryEntry.id = "brewery-entry";
        var breweryName = document.createElement('h4');
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
        if (data[i].brewery.images) {
          breweryEntry.style.backgroundImage = "linear-gradient(rgba(161,201,200, 0.8), rgba(161,201,200, 0.8)), " + "url("+data[i].brewery.images.large+")";
        } else {
          breweryEntry.style.background = "rgba(161,201,200, 0.8)"
        }
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
      breweryInfo.classList.add("z-depth-2");
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
      if (data[0].data.images) {
        breweryInfo.style.backgroundImage = "linear-gradient(rgba(161,201,200, 0.8), rgba(161,201,200, 0.8)), " + "url("+data[0].data.images.squareLarge+")";
      }
      for (var i = 0; i < data[1].data.length; i++) { //Print list of beers
        var short = data[1].data[i];
        var beerEntry = document.createElement('div');
        beerEntry.id = "beer-entry";
        var beerName = document.createElement('h5');
        var nameBeer = document.createTextNode(short.name);
        beerName.id = "beer-name";
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
        if (short.labels) {
          beerEntry.style.backgroundImage = "linear-gradient(rgba(161,201,200, 0.8), rgba(161,201,200, 0.8)), " + "url("+short.labels.large+")";
        }
        var add = document.createElement('button');
        add.innerHTML = "Pin to Checklist"
        add.id = "add-button"
        beerEntry.appendChild(add);
        beerList.appendChild(beerEntry);
        beerEntry.classList.add("z-depth-1")
        pinListener(data[0].data.name, add, short);
      }
      progress.style.display = 'none';
      show(what);
    }

  };// End of pageCtrl

  function breweryListener(element, num){ // Add listeners breweries and post for brewery specifics
    progress.style.display = 'block';
    element.addEventListener('click', function(ev){
      progress.style.display = 'block'
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

  function pinListener(brewery, element, beer) { //Pin to checklist listener
    element.addEventListener('click', function(){
      var data = {
        beerId: beer.id,
        name: beer.name,
        brewery: brewery,
        style: beer.style.name
      }
      $.ajax({
        url: url + '/beers/new',
        method: 'POST',
        data: data,
        dataType: 'json'
      }).done(function(response) {
        console.log( "response: ", response );
      });
      console.log(data);
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
  }// End show

  function fillChecklist (){ //Populate checklist from currentChecklist
    var checklistBeers = document.querySelector('#checklist-beers');
    checklistBeers.innerHTML = '';
    for (var i = 0; i < currentChecklist.length; i++){
      var beerEntry = document.createElement('div');
      beerEntry.id = "checklist-entry"
      var beerName = document.createElement('h4');
      beerName.id = "beer-name";
      var name = document.createTextNode(currentChecklist[i].name);
      beerName.appendChild(name);
      beerEntry.appendChild(beerName);
      var brewName = document.createElement('p');
      var brewery = document.createTextNode(currentChecklist[i].brewery);
      brewName.id = "check-brew-name";
      brewName.appendChild(brewery);
      beerEntry.appendChild(brewName);
      var beerStyle = document.createElement('p');
      var style = document.createTextNode(currentChecklist[i].style);
      beerStyle.id = "beer-style";
      beerStyle.appendChild(style);
      beerEntry.appendChild(beerStyle);
      var deleteBeer = document.createElement('button');
      deleteBeer.innerHTML = "Tried it!";
      deleteBeer.id = "delete-button";
      beerEntry.appendChild(deleteBeer);
      checklistBeers.appendChild(beerEntry);
      delListener(deleteBeer, currentChecklist[i].beerId);
      progress.style.display = 'none';
    }
  } //End fillChecklist

  function delListener(button, id) { //remove beer ie "I tried it!"
    button.addEventListener('click', function(){
      var data = {
        beerId: id,
      };
      $.ajax({
        url: url + '/beers/delete',
        dataType: 'json',
        data: data,
        method: 'delete'
      }).done(function(response){
          button.innerHTML = "Yumm";
          button.style.color = "white";
          button.style.background = "red";
          console.log(data + " has been deleted.");
          console.log(response);
      }); // end ajax
    }); // end delete button
  }

}; // End window.onload

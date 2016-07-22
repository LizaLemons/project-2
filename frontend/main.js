window.onload = function (){ //Assign HTML elements
  var zip = document.querySelector('#zip'),
      zipSubmit = document.querySelector('#zip-submit'),
      breweryList = document.querySelector('#brewery-list');

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
      pageCtrl('brewery-list', response.data);
    }
    });
  }); //End zipcode submission

  function pageCtrl(what, data) {
    if (what === "brewery-list") { // Render list after zip search
      for (var i = 0; i < data.length; i++){
        var breweryEntry = document.createElement('div');
        breweryEntry.id = "brewery-entry";
        var breweryName = document.createElement('h3');
        var name = document.createTextNode(data[i].brewery.name);
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
  };

}; // End window.onload

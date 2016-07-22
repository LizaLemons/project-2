var express = require('express'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    mongodb = require('mongodb'),
    request = require('request'),
    PORT = 3000,
    app = express(),
    BREWERYDB_KEY = process.env.BREWERYDB_KEY,
    breweryInfo = [];

app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));

app.get('/', function(req, res){
  response.json({"description":"You will succeed in your search for beer.."});
});
app.post('/locations', function(req,res){ //Receive location info and send list
  var url = "http://api.brewerydb.com/v2/locations";
  var paramQuery = "?postalCode=";
  var input = req.body.zip;
  var apiKey = "&key=" + BREWERYDB_KEY;
  var fullQuery = url + paramQuery + input + apiKey;
  request({
    url: fullQuery,
    method: 'GET',
    callback: function(error, response, body) {
      res.send(body);
    }
  })
});

app.post('/brewery', function(req,res){ //Receive selected brewery
  breweryInfo = [];
  var url = "http://api.brewerydb.com/v2/brewery/";
  var input = req.body.breweryId;
  var apiKey = "?key=" + BREWERYDB_KEY;
  var fullQuery = url + input + apiKey;
  request({
    url: fullQuery,
    method: 'GET',
    callback: function(error, response, body) {
      breweryInfo.push(JSON.parse(body));
    }
  })
  request({
    url: url + input + "/beers" + apiKey,
    method: 'GET',
    callback: function(error, response, body) {
      breweryInfo.push(JSON.parse(body));
      res.send(breweryInfo);
    }
  })
});

app.listen(3000, function(){
  console.log('listening on 3000...')
});

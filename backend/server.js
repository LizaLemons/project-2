var express = require('express'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    mongodb = require('mongodb'),
    request = require('request'),
    app = express(),
    BREWERYDB_KEY = process.env.BREWERYDB_KEY,
    PORT = 3000,
    breweryInfo = [];

app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));

var MongoClient = mongodb.MongoClient;
var mongoUrl = 'mongodb://localhost:27017/beer_checklist';

app.get('/beers', function(request, response){
  MongoClient.connect(mongoUrl, function (err, db) {
    var beersCollection = db.collection('beers');
    if (err) {
      console.log('Cannot connect to mongoDB. ERROR:', err);
    } else {
      beersCollection.find().toArray(function (err, result) {
        if (err) {
          console.log("ERROR!", err);
          response.json("error");
        } else if (result.length) {
          console.log('Found:', result);
          response.json(result);
        } else { //
          console.log('No document(s) found with defined "find" criteria');
          response.json("No beers found");
        }
        db.close(function() {
          console.log( "DB Closed");
        });
      }); // end find
    }
  }); //End MongoDB connection
}); //End checklist GET

app.post('/beers/new', function(request, response){
  console.log("request.body", request.body);
  MongoClient.connect(mongoUrl, function (err, db) {
    var beersCollection = db.collection('beers');
    if (err) {
      console.log('Cannot connect to mongoDB. ERROR:', err);
    } else {
      console.log('Connection established to', mongoUrl);
      console.log('Adding a beer');
      var newBeer = request.body;
      var id = request.body.beerId
      beersCollection.update({beerId: id}, {$setOnInsert: newBeer}, {upsert: true}, function (err, result) {
        if (err) {
          console.log(err);
          response.json("error");
        } else {
          console.log('Inserted.');
          console.log('Result: ', result);
          console.log("---result end---");
          response.json(result);
        }
        db.close(function() {
          console.log( "DB closed");
        });
      }); // Insert ended
    }
  }); // End MongoDB connection
}); // End adding new beer


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
      if (error) {
        console.log("ERROR!", error);
        response.json("error");
      } else if (response) {
          res.send(body);
      }
    }
  }); //End request
}); //End POST

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

app.listen(PORT, function(){
  console.log('listening on ' + PORT + '...')
});

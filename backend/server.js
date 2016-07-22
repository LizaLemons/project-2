var express = require('express'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    mongodb = require('mongodb'),
    request = require('request'),
    PORT = 3000,
    app = express()
    BREWERYDB_KEY = process.env.BREWERYDB_KEY;

app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));

app.get('/', function(req, res){
  response.json({"description":"You will succeed in your search for beer.."});
});
app.post('/locations', function(req,res){
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

app.listen(3000, function(){
  console.log('listening on 3000...')
});

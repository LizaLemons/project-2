#Brewery Locator#

###Overview:###
This web app was inspired by an endless requirement to travel for my previous job and having a love for beer. Eventually it became an event for me to look up local breweries near my job site and visit them when the job or day was finished. Most served awesome food and the tab was on the company, wooo!  Either way, this app is actually something I might have used.

###Workings/Tech:###
This uses the BreweryDB API (wow, what an amazing, organized information set) and Google Maps API. Of course node.js, mongodb are used. The more outside tech is mild use of jQuery outside of ajax and Materialize for CSS. I was glad I got as far as I did, but I feel it was juuuust a bit outside what I could actually do at my skill level.  It's currently very face value of what I envisioned and it needs more conditionals (ie. if "something" isn't there do "this" instead).

###Unsolved Problems/Future Additions:###
Like mentioned above, more conditionals are needed to make a more seamless and functional app.  Unfortunately, I didn't use Google Maps as much as I wanted. I left the marker context to the end of the project and realized I didn't have enough time to really figure it out. For the checklist, eventually I'd like more of a "favorites" functionality as well a description when you hover over a beer prior to adding it. I played with the code to incorporate a hover for description, but I couldn't get it to work quickly enough to implement it.  In the end, it was a frantic mess to try and make it "presentable". I'm colorblind and making it visually stimulating with colors is hard for me but Materialize eased things a little.

#MVP Checklist#

###User Input###
+ Zip
+ Geolocation
+ Click location/brewery
+ Click beers on listed & favorites (append to checklist)

###Visual###
+ Show list of breweries in given area.
+ Show brewery details and beers on click
+ Show map of available locations
+ Favorites and checklist

###Functionality###
+ Several pages with interactive buttons/maps
+ Using two APIs: BeweryDB and Google Maps
+ Interactive favorites and checklist, adding and removing (MongoDB)

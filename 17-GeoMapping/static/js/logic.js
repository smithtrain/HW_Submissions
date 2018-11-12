// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  console.log(data.features)
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>Magintude " + feature.properties.mag +"</h3><p>Location: " + feature.properties.place + "</p>Datetime: " + new Date(feature.properties.time) + "</p>");
  }

  function onEachQuakeLayer(feature) {
    return new L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
      fillOpacity: 0.50,
      color: chooseColor(feature.properties.mag),
      fillColor: chooseColor(feature.properties.mag),
      radius:  feature.properties.mag * 4,
      weight: 1
    });
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: onEachQuakeLayer
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Light layer
  var lightmap = L.tileLayer("https://www.mapbox.com/styles/v9/mapbox/light-v9//tiles/256/{z}/{x}/{y}?" +
      "access_token={accessToken}",
      {
        accessToken: API_KEY
      }
  );

  // Outdoors layer
  var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
      accessToken: API_KEY
      
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Satellite layer
  var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    //"Grayscale": lightmap,
    "Outdoors": outdoors,
    "Satellite": satellite,
    "Dark Map": darkmap,
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [darkmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // Adds Legend
  let legend = L.control({position: 'bottomleft'});
  legend.onAdd = function(map) {
    let div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 1, 2, 3, 4, 5],
      labels = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];

    for (let i = 0; i < grades.length; i++) {
      div.innerHTML += '<i style="background:' + chooseColor(grades[i] + 1) + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
  };
  legend.addTo(myMap);
}

// chooseColor function:
// Returns color for each grade parameter using ternary expressions
function chooseColor(magnitude) {
  return magnitude > 5 ? "red":
        magnitude > 4 ? "orange":
        magnitude > 3 ? "gold":
        magnitude > 2 ? "yellow":
        magnitude > 1 ? "yellowgreen":
        "greenyellow"; // <= 1 default
}
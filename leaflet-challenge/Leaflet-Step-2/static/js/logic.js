// Store our API endpoint inside queryUrl
var queryUrl="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Define arrays to hold created earthquake and tec markers
var tecMarkers = [];
var earthquakeMarkers = [];

d3.json(queryUrl, function(data){
  console.log(earthquakeMarkers)
  data.features.forEach(function(record){
    earthquakeMarkers.push(L.circle([record.geometry.coordinates[1], record.geometry.coordinates[0]], {
      color:"black",
      fillColor: chooseColor(record.geometry.coordinates[2]),
      fillOpacity: 0.75,
      weight: 0.5,
      radius:(record.properties.mag)*10000
    }).bindPopup("Place: " + record.properties.place + "<hr>Earthquake Magnitude: " +
    record.properties.mag + "<br>Depth: "+record.geometry.coordinates[2]));
  })
})
function chooseColor(depth) {
  if (depth<=10){
    return "#FEB24C"
  }
  else if (depth<=30){
    return "#FD8D3C"
  }
  else if (depth<=50){
    return "#FC4E2A"
  }
  else if (depth<=70){
    return "#E31A1C"
  }
  else if (depth<=90){
    return "#BD0026"
  }
  else if (depth>90){
    return "#800026"
  }
}

// Define streetmap and darkmap layers
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "light-v10",
    accessToken: API_KEY
})
var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
})
var outdoormap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/outdoors-v11",
    accessToken: API_KEY
})

// Create two separate layer groups: one for cities and one for states
var tectonicPlates = L.layerGroup(tecMarkers);
var earthquakes = L.layerGroup(earthquakeMarkers);

// Create a baseMaps object
var baseMaps = {
  "Light": lightmap,
  "Satellite": satellitemap,
  "Outdoors": outdoormap
};

// Create an overlay object
var overlayMaps = {
  "Tectonic Plates": tectonicPlates,
  "Earthquakes": earthquakes
};

// Define a map object
var myMap = L.map("map", {
  center: [40.7608, -111.8910],
  zoom: 5,
  layers: [lightmap, earthquakes]
});


// Pass our map layers into our layer control
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);

  // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function(myMap) {
    var div = L.DomUtil.create("div", "info legend");
    var limits = marker.options.limits;
    var colors = marker.options.colors;
    var labels = [];

    // Add min & max
    var legendInfo = "<h1>Median Income</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  }

  // Adding legend to the map
  legend.addTo(myMap);

// Define streetmap and darkmap layers
var lightmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox/light-v10',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: API_KEY
});
var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/satellite-v9",
  accessToken: API_KEY
});
var outdoormap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/outdoors-v11",
  accessToken: API_KEY
});

// Define a map object
var myMap = L.map("map", {
  center: [40.7608, -111.8910],
  zoom: 5,
  layers: [lightmap, outdoormap, satellitemap]
});

//lightmap.addTo(myMap)

// Create a baseMaps object
var baseMaps = {
  "Light": lightmap,
  "Satellite": satellitemap,
  "Outdoors": outdoormap
};

// Store our 2 APIs endpoint inside queryUrl and tecUrl
var queryUrl="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var tecUrl="https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

// Define arrays to hold created earthquake and tec markers
// var tecMarkers = [];
// var earthquakeMarkers = [];

var tecMarkers = new L.LayerGroup();
var earthquakeMarkers = new L.LayerGroup();

// Create an overlay object
var overlayMaps = {
  "Tectonic Plates": tecMarkers,
  "Earthquakes": earthquakeMarkers
};

// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);

// console.log(tecMarkers)



d3.json(queryUrl, function(data){

  function getStyle (feature) {
    return {
      fillColor: chooseColor(feature.geometry.coordinates[2]),
      radius: (feature.properties.mag)*3,
      color:"red",
      weight: 0.5,
      fillOpacity: 0.75
    } 
  }

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
  }

  L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng)
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup ("Place: " + feature.properties.place + "<hr>Earthquake Magnitude: " +
      feature.properties.mag + "<br>Depth: "+feature.geometry.coordinates[2])
    },
    style: getStyle
 
}).addTo(earthquakeMarkers)

earthquakeMarkers.addTo(myMap)
console.log(earthquakeMarkers)



//tectonic plates
d3.json(tecUrl, function(tecdata){
  //console.log(tecdata)
  L.geoJson(tecdata, {
    color:"yellow",
    weight: 3
  }).addTo(tecMarkers)

  tecMarkers.addTo(myMap)
})


//add legend to map
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [-10, 10, 30, 50, 70, 90],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
          '<i style="background:' + chooseColor(grades[i] + 1) + '"></i> ' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap)

});
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
var tecMarkers = [];
var earthquakeMarkers = [];

d3.json(tecUrl, function(tecdata){
  //console.log(tecdata)
  tecdata.features.forEach(function(feature){
    tecMarkers.push(L.polygon(feature.geometry.coordinates, {
      color: "yellow"
    }))
  })
})
console.log(tecMarkers)

d3.json(queryUrl, function(data){
  //console.log(earthquakeMarkers)
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
console.log(earthquakeMarkers)

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

// Create two separate layer groups: one for cities and one for states
var tectonicPlates = L.layerGroup(tecMarkers);
var earthquakes = L.layerGroup(earthquakeMarkers);



// Create an overlay object
var overlayMaps = {
  "Tectonic Plates": tectonicPlates,
  "Earthquakes": earthquakes
};

// Define a map object
var myMap = L.map("map", {
  center: [40.7608, -111.8910],
  zoom: 5,
  layers: [lightmap, earthquakes, tectonicPlates]
});


// Pass our map layers into our layer control
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);

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

legend.addTo(myMap);
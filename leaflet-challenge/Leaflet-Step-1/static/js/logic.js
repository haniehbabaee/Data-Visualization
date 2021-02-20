var myMap = L.map("map", {
  center: [40.7608, -111.8910],
  zoom: 5
});

// Define streetmap and darkmap layers
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "light-v10",
    accessToken: API_KEY
}).addTo(myMap);

// Store our API endpoint inside queryUrl
var queryUrl="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(queryUrl, function(data){
  console.log(data)
  data.features.forEach(function(record){
    L.circle([record.geometry.coordinates[1], record.geometry.coordinates[0]], {
      color:"black",
      fillColor: chooseColor(record.geometry.coordinates[2]),
      fillOpacity: 0.75,
      weight: 0.5,
      radius:(record.properties.mag)*10000
    }).bindPopup("Place: " + record.properties.place + "<hr>Earthquake Magnitude: " +
    record.properties.mag + "<br>Depth: "+record.geometry.coordinates[2]).addTo(myMap);;
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
}

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

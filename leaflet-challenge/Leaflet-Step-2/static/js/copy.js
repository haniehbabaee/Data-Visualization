d3.json(geoData, function(data) {
  console.log(data)
  data.features.forEach(function (response) {
    L.circle([response.geometry.coordinates[1], response.geometry.coordinates[0]], {
      color: "black",
      fillColor: colorDepth(response.geometry.coordinates[2]),
      fillOpacity: 0.8,
      weight: 0.5,
      radius: (response.properties.mag)*20000
    }).bindPopup(`${response.properties.place}`).addTo(myMap)
  })
})
function colorDepth(depth) {
  if (depth <=10) {
    return "#66ff33"
  }
  else if (depth > 10 && depth <= 30) {
    return "#d5ff80"
  }
  else if (depth > 30 && depth <= 50) {
    return "#ffe680"
  }
  else if (depth > 50 && depth <= 70) {
    return "#ffb366"
  }
  else if (depth > 70 && depth <= 90) {
    return "#ff704d"
  }
  else {
    return "#b32400"
  }
}
var legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend");
  div.innerHTML += "<h4>Depth Legend</h4>";
  div.innerHTML += '<i style="background: #66ff33"></i><span>-10 - 10</span><br>';
  return div;
};
legend.addTo(myMap)

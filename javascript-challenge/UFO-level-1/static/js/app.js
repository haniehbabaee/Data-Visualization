var tableData = data;
var tbody = d3.select("tbody");

tableData.forEach(function(record) {
    var row = tbody.append("tr");
    Object.entries(record).forEach(function([key, value]){
        var cell =row.append("td");
        cell.text(value);
    });
});
var tableData = data;
var tbody = d3.select("tbody");


tableData.forEach(function(record) {
    var row = tbody.append("tr");
    Object.entries(record).forEach(function([key, value]){
        var cell =row.append("td");
        cell.text(value);
    });
});

var button = d3.select("#filter-btn");
var form = d3.select(".form-group");

button.on("click", runEnter);
form.on("submit", runEnter);

function runEnter() {
    d3.event.preventDefault();
    
    var inputValue = d3.select("#datetime").property("value");
   
    var filteredData = tableData.filter(record => record.datetime ===inputValue);
    //console.log(filteredData);
    tbody.html(" ");
    
    filteredData.forEach((dataRow) => {
        var row = tbody.append("tr");
        Object.entries(dataRow).forEach(function([key,value]){
            var cell=row.append("td")
            cell.text(value)
        })
    });



    // Object.entries(filteredData).forEach(function([key, value]){
    //     console.log(value);
    //     var cell =row.append("td");
    //     cell.text(value);
    // });
};
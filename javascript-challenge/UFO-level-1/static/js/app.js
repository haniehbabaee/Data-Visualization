// Assign the data from `data.js` to a descriptive variable
var tableData = data;

//select the body
var tbody = d3.select("tbody");

//load the initial data
tableData.forEach(function(record) {
    var row = tbody.append("tr");
    Object.entries(record).forEach(function([key, value]){
        var cell =row.append("td");
        cell.text(value);
    });
});
// Select the form and button
var button = d3.select("#filter-btn");
var form = d3.select(".form-group");

// Create event handlers
button.on("click", runEnter);
form.on("submit", runEnter);

// Complete the event handler function for the form
function runEnter() {
    d3.event.preventDefault();
    
    var inputValue = d3.select("#datetime").property("value");
   
    var filteredData = tableData.filter(record => record.datetime ===inputValue);
    
    tbody.html(" ");
    
    filteredData.forEach((dataRow) => {
        var row = tbody.append("tr");
        Object.entries(dataRow).forEach(function([key,value]){
            var cell = row.append("td")
            cell.text(value)
        })
    });
};
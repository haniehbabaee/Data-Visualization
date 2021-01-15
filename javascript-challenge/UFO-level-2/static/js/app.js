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
// Select the form
var form = d3.selectAll(".form-control");

// Create event handlers
form.on('change',runEnter)

// Complete the event handler function for the form
function runEnter() {
    // Prevent the page from refreshing
    d3.event.preventDefault();
   
    //select the input ID
    var inputID = d3.select(this).attr('id')
    console.log(inputID)

    //select input value
    var inputValue = d3.select(this).property('value')
    console.log(inputValue)
  
    if (inputID ==="datetime"){
        var filteredData = tableData.filter(record => record.datetime ===inputValue);
    }
    else if (inputID ==="city"){
        var filteredData = tableData.filter(record => record.city ===inputValue);
    }
    else if (inputID ==="state"){
        var filteredData = tableData.filter(record => record.state ===inputValue);
        
    }
    else if (inputID ==="country"){
        var filteredData = tableData.filter(record => record.country ===inputValue);
    }
    else {
        var filteredData = tableData.filter(record => record.shape ===inputValue);
    }
    // remove any data from the list 
    tbody.html(" ");

    //clear the search field
    d3.select(this).property('value', "");
    
    //append filtered data to the row of the table
    filteredData.forEach((dataRow) => {
        var row = tbody.append("tr");
        Object.entries(dataRow).forEach(function([key,value]){
            var cell = row.append("td")
            cell.text(value)
        })
    });
    
};
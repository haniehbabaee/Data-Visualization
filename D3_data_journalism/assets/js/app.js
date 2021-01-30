     
// svg params
var svgWidth = 960;
var svgHeight = 500;
// margins
var margin = {
    top: 20,
    right: 40,
    bottom: 120,
    left: 100
};
// chart area minus margins
var chartHeight = svgHeight - margin.top - margin.bottom;
var chartWidth = svgWidth - margin.right - margin.left;
        
// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("div").select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
// Import Data
d3.csv("assets/data/data.csv").then(function(censusData) {
    //Parse Data/Cast as numbers
    censusData.forEach(element => {
        element.poverty = + element.poverty;
        element.healthcare = + element.healthcare;
        element.obesity = + element.obesity;
        element.smokes = + element.smokes;
        element.age = + element.age;
        element.income = + element.income;
     });
    console.log(censusData)
    //Create scale functions
    var xLinearScale = d3.scaleLinear()
        .domain([8.5, d3.max(censusData, d => d.poverty)+2])
        .range([0, chartWidth]);
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(censusData, d => d.healthcare)+2])
        .range([chartHeight, 0]);
    //Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //Append Axes to the chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    //Create Circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "10")
        .attr("class", "stateCircle")
        .attr("opacity", "0.5");

    //create state labels on circles 
    var circleLabels = chartGroup.selectAll(null).data(censusData).enter().append("text");

    circleLabels
        .attr("x", function(d) {
            return xLinearScale(d.poverty);
        })
        .attr("y", function(d) {
            return yLinearScale(d.healthcare);
        })
        .text(function(d) {
            return d.abbr;
        })
        .attr("class", "stateText")
               
    //Initialize tool tip
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function(d) {
            return (`${d.state}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`);
        });

    //Create tooltip in the chart
    chartGroup.call(toolTip);

    //Create event listeners to display and hide the tooltip
    circlesGroup.on("mouseover", function(data) {
            toolTip.show(data, this);
        })
        // onmouseout event
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });

    // Create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .attr("class", "aText axisText")
        .text("Lacks Healthcare (%)");

    chartGroup.append("text")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top + 30})`)
        .attr("class", "aText axisText")
        .text("In Poverty (%)");

}).catch(function(error) {
    console.log(error);})
    
    
    
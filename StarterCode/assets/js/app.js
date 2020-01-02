// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data

d3.csv("assets/data/data.csv")
    .then (function(journalismdata) {
    console.log(journalismdata);

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    journalismdata.forEach(function(data) {
      data.healthcare = +data.healthcare;
      data.poverty = +data.poverty;
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(journalismdata, d => d.poverty)-1, d3.max(journalismdata, d => d.poverty)+1])
      .range([0, width]);
    
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(journalismdata, d => d.healthcare)-1, d3.max(journalismdata, d => d.healthcare)+1])
      .range([height, 0]);
    
    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
      

    chartGroup.append("g")
      .call(leftAxis);
      
    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(journalismdata)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "blue")
    .attr("opacity", ".5")
    ;
    
    
    // Make labels for circle
    chartGroup.selectAll(".label")
    .data(journalismdata)
    .enter()
    .append("text")
    .attr("class", "label")
    .text(d => d.abbr)
    .attr("font-size",10)//font size
    .attr("dx", d => xLinearScale(d.poverty))
    .attr("dy", d => yLinearScale(d.healthcare))
    .attr("text-anchor","middle")
    .attr("fill", "white");

    



    

    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([10, -10])
      .style("background",'#000000')
      .style("color",'#FFFFFF')
      .style("padding", '4px')
      .style("border-radius", '2px')
      .html(function(d) {
       

        return (`${d.state} <br>Poverty : ${d.poverty}<br>Health Care: ${d.healthcare}`);
      });

//     // Step 7: Create tooltip in the chart
//     // ==============================
       chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .style("font-size", "20px")
      .style("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 20)
      .attr("x", 0 - (height/2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare(%)");
      
    chartGroup.append("text")
      .style("font-size", "20px")
      .style("text-anchor", "middle")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("In Poverty(%)");
   });

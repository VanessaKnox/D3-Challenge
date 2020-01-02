var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3.select("#scatter")
            .append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("assets/js/data.csv")
    .then(function(healthData) {

        healthData.forEach(function(d) {
            d.poverty = +d.poverty;
            d.healthcare = +d.healthcare;
        });

        console.log(healthData);

        // Configure axes
        var xMin = d3.min(healthData, function(d) {
            return d.poverty;
        });

        var xMax = d3.max(healthData, function(d) {
            return d.poverty;
        });

        var yMin = d3.min(healthData, function(d) {
            return d.healthcare;
        });

        var yMax = d3.max(healthData, function(d) {
            return d.healthcare;
        });

        console.log(xMin);
        console.log(xMax);
        console.log(yMin);
        console.log(yMax);

        var labelArea = 30

        var xLinearScale = d3.scaleLinear().domain([(xMin - .5), xMax + 2]).range([0, width]);
        var yLinearScale = d3.scaleLinear().domain([(yMin - 1), yMax + 2]).range([height, 0]);

        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        // Append axes
        chartGroup.append("g")
                  .attr("transform", `translate(0, ${height})`)
                  .call(bottomAxis);

        chartGroup.append("g").call(leftAxis);

        // Circles
        chartGroup.selectAll("circle")
                  .data(healthData)
                  .enter()
                  .append("circle")
                  .attr("cx", function(data) {
                      return xLinearScale(data.poverty)
                  })
                  .attr("cy", function(data) {
                      return yLinearScale(data.healthcare)
                  })
                  .attr("r", "15")
                  .attr("fill", "mediumturquoise")
                  .attr("opacity", .7);

        // Abbreviations in Circles
        chartGroup.append("text")
            .style("text-anchor", "middle")
            .style("font-size", "12px")
            .selectAll("tspan")
            .data(healthData)
            .enter()
            .append("tspan")
            .attr("x", function(data) {
                return xLinearScale(data.poverty - 0);
                })
            .attr("y", function(data) {
                return yLinearScale(data.healthcare - 0.2);
                })
            .text(function(data) {
                return data.abbr
                });

        // Axis Labels
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0-margin.left + 40)
            .attr("x", 0 - height/1.5)
            .attr("dy","1em")
            .attr("class", "axis-text")
            .text("Lacks Healthcare (%)");

        chartGroup.append("text")
            .attr("transform", "translate(" + width / 2.25 + " ," + (height + margin.top + 30) + ")")
            .attr("class", "axis-text")
            .text("In Poverty (%)");
        })
        
    .catch(function(error){
        })
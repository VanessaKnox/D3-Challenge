// Set height and width of SVG
var svgWidth = 960;
var svgHeight = 500;

// Set margin values
var margin = {
  top: 20,
  right: 40,
  bottom: 100,
  left: 100
};

// Set inner height and width
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Append a second SVG group to use for labels
var chartGroup2 = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(fileData, chosenXAxis) {

  // get extents and ranges
  var xExtent = d3.extent(fileData, function(d) { return d[chosenXAxis]; });
  var xRange = xExtent[1] - xExtent[0];

  // set domain to be extent +- 10%
  var xLinearScale = d3.scaleLinear()
      .domain([xExtent[0] - (xRange * .1), xExtent[1] + (xRange * .1)])
      .range([0, width]);

  return xLinearScale;

}

// function used for updating y-scale var upon click on axis label
function yScale(fileData, chosenYAxis) {

  // get extents and ranges
  var yExtent = d3.extent(fileData, function(d) { return d[chosenYAxis]; });
  var yRange = yExtent[1] - yExtent[0];

  // set domain to be extent +- 10%
  var yLinearScale = d3.scaleLinear()
      .domain([yExtent[0] - (yRange * .1), yExtent[1] + (yRange * .1)])
      .range([height, 0]);

  return yLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderXAxis(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderYAxis(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// function used for updating circles group x axis with a transition to
// new circles
function renderCirclesX(circlesGroup, newXScale, chosenXAxis) {

  // 1000ms x-axis transition to new positions
  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

// function used for updating circles group y axis with a transition to
// new circles
function renderCirclesY(circlesGroup, newYScale, chosenYAxis) {

  // 750ms y-axis transition to new positions
  circlesGroup.transition()
    .duration(750)
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

// function used for updating text group with a transition to
// new x axis location
function renderTextX(textGroup, newXScale, chosenXAxis) {

  // 1000ms x-axis transition to new positions
  textGroup.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis]));

  return textGroup;
}

// function used for updating text group with a transition to
// new y axis location
function renderTextY(textGroup, newYScale, chosenYAxis) {

  // 750ms y-axis transition to new positions
  textGroup.transition()
    .duration(750)
    .attr("y", d => newYScale(d[chosenYAxis]));

  return textGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  // Based on chosen x-axis, set label and symbols if needed (percent or dollar sign)
  if (chosenXAxis === "poverty") {
    var xLabel = "Poverty: ";
    var xPct = "%";
    var dollar = "";
  }
  else if (chosenXAxis === "age") {
    var xLabel = "Median Age: ";
    var xPct = "";
    var dollar = "";
  }
  else {
    var xLabel = "Median Income: ";
    var xPct = "";
    var dollar = "$";
  }

  // Based on chosen y-axis, set label
  if (chosenYAxis === "smokes") {
    var yLabel = "Smokes: ";
  }
  else if (chosenYAxis === "obesity") {
    var yLabel = "Obesity: ";
  }
  else {
    var yLabel = "Lacks Healthcare: ";
  }

  // Set variable for tooltip with proper formatting
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .direction("w")
    .html(function(d) {
      return (`<strong>${d.state}</strong><br>
              ${xLabel} ${dollar}${d[chosenXAxis]}${xPct}<br>
              ${yLabel} ${d[chosenYAxis]}%`);
    });

  circlesGroup.call(toolTip);

  // On mouseover, display tooltip, decrease circle opacity, and change border color
  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data, this);
    d3.select(this)
      .attr("r",14)
      .attr("opacity",".8")
      .attr("stroke","#4f8da7")
      .attr("stroke-width","2");
  })
    // On mouseout, hide tooltip, reset circle opacity and border color
    .on("mouseout", function(data) {
      toolTip.hide(data);
      d3.select(this)
        .attr("r", 15)
        .attr("opacity","1")
        .attr("stroke","#e3e3e3")
        .attr("stroke-width","1");
    });

  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("/assets/data/data.csv")
.then(function(fileData) {

  // Parse data and cast values as numbers
  fileData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.income = +data.income;
    data.healthcare = +data.healthcare;
    data.obesity = +data.obesity;
    data.smokes = +data.smokes;
  });

  // Create x scale function
  var xLinearScale = xScale(fileData, chosenXAxis);

  // Create y scale function
  var yLinearScale = yScale(fileData, chosenYAxis);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // Append y axis
  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);

  // Append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(fileData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 15)
    .attr("class", "stateCircle")
    .attr("stroke-width", "1")
    .attr("stroke","#e3e3e3");

  // Append state abbreviations
  var textGroup = chartGroup2.selectAll("text")
    .data(fileData)
    .enter()
    .append("text")
    .text(d => d.abbr)
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d[chosenYAxis]))
    .attr("dy","4")
    .attr("class", "stateText")
    .attr("font-size","10");

  // Create group for 3 x-axis labels
  var xLabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);  // May need to adjust ////////////////////////////

  // Add x label for Poverty
  var povertyLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

  // Add x label for Median Age
  var ageLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");
  
  // Add x label for Median Household Income
  var incomeLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (Median)");

  // Create group for 3 y-axis labels
  var yLabelsGroup = chartGroup.append("g")
    .attr("transform", "rotate(-90)")

  // Add y label for Obesity
  var obesityLabel = yLabelsGroup.append("text")
    .attr("y", -70)
    .attr("x", -(height/2))
    .attr("value", "obesity") // value to grab for event listener
    .classed("inactive", true)
    .text("Obese (%)");

  // Add y label for Smokes
  var smokesLabel = yLabelsGroup.append("text")
    .attr("y", -50)
    .attr("x", -(height / 2))
    .attr("value", "smokes") // value to grab for event listener
    .classed("inactive", true)
    .text("Smokes (%)");
  
  // Add y label for Lacks Healthcare
  var healthcareLabel = yLabelsGroup.append("text")
    .attr("y", -30)
    .attr("x", -(height / 2))
    .attr("value", "healthcare") // value to grab for event listener
    .classed("active", true)
    .text("Lacks Healthcare (%)");

  // Update the circlesGroup tooltip with the chosen x and y axes
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

  // x axis labels event listener
  xLabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // Update x scale for new data
        xLinearScale = xScale(fileData, chosenXAxis);

        // Update x axis with transition
        xAxis = renderXAxis(xLinearScale, xAxis);

        // Update circles with new x values
        circlesGroup = renderCirclesX(circlesGroup, xLinearScale, chosenXAxis);

        // Update text labels (state abbreviations) with new x values
        textGroup = renderTextX(textGroup, xLinearScale, chosenXAxis);

        // Update tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // Change classes to change bold text
        if (chosenXAxis === "age") {
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenXAxis === "poverty") {
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });

  // y axis labels event listener
  yLabelsGroup.selectAll("text")
  .on("click", function() {
    // Get value of selection
    var value = d3.select(this).attr("value");
    if (value !== chosenYAxis) {

      // Replace chosenYAxis with value
      chosenYAxis = value;

      // Update y scale for new data
      yLinearScale = yScale(fileData, chosenYAxis);

      // Update y axis with transition
      yAxis = renderYAxis(yLinearScale, yAxis);

      // Update circles with new y values
      circlesGroup = renderCirclesY(circlesGroup, yLinearScale, chosenYAxis);

      // Update text labels (state abbreviations) with new y values
      textGroup = renderTextY(textGroup, yLinearScale, chosenYAxis);

      // Update tooltips with new info
      circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

      // Change classes to change bold text
      if (chosenYAxis === "obesity") {
        obesityLabel
          .classed("active", true)
          .classed("inactive", false);
        smokesLabel
          .classed("active", false)
          .classed("inactive", true);
        healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else if (chosenYAxis === "smokes") {
        obesityLabel
          .classed("active", false)
          .classed("inactive", true);
        smokesLabel
          .classed("active", true)
          .classed("inactive", false);
        healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else {
        obesityLabel
          .classed("active", false)
          .classed("inactive", true);
        smokesLabel
          .classed("active", false)
          .classed("inactive", true);
        healthcareLabel
          .classed("active", true)
          .classed("inactive", false);
      }
    }
  });
});
var svgWidth = 900;
var svgHeight = 620;

//set borders in svg
var margin = {
    top: 20,
    right: 40,
    bottom: 200,
    left: 100
};

//calculate height and width
var width = svgWidth - margin.right - margin.left;
var height = svgHeight - margin.top - margin.bottom;

//append a div classed to the scatter element
var chart = d3.select("#scatter").append("div").classed("chart", true);

//append an svg element to the appropriate height and width
var svg = chart.append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

//initialized Parameters
var healthXAxis = "poverty";
var healthYAxis = "healthcare";

//function used for updating x-scale var upon clicking on axis label
function xScale(healthData, healthXAxis) {
    //create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d[healthXAxis]) * 0.8,
            d3.max(healthData, d => d[healthXAxis]) * 1.2])
        .range([0, width]);

    return xLinearScale;
}

//function used for updating y-scale var upon clicking on axis label
function yScale(healthData, healthYAxis) {
    //create scales
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d[healthYAxis]) * 0.8,
            d3.max(healthData, d => d[healthYAxis]) * 1.2])
        .range([height, 0]);

    return yLinearScale;
}

//function used for updating xAxis var upon click on axis label
function renderAxesX(healthnewXScale, xAxis) {
    var bottomAxis = d3.axisBottom(healthnewXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}

//function used for updating yAxis var upon click on axis label
function renderAxesY(healthnewYScale, yAxis) {
    var leftAxis = d3.axisLeft(healthnewYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
}

//function used for updating circles group with a transition to healthnew circles
//for change in x axis or y axis
function renderCircles(circlesGroup, healthnewXScale, healthXAxis, healthnewYScale, healthYAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", data => healthnewXScale(data[healthXAxis]))
        .attr("cy", data => healthnewYScale(data[healthYAxis]));

    return circlesGroup;
}

//function used for updating state labels with a transition to healthnew 
function renderText(textGroup, healthnewXScale, healthXAxis, healthnewYScale, healthYAxis) {

    textGroup.transition()
        .duration(1000)
        .attr("x", d => healthnewXScale(d[healthXAxis]))
        .attr("y", d => healthnewYScale(d[healthYAxis]));

    return textGroup;
}
//function to stylize x-axis values for tooltips
function styleX(value, healthXAxis) {

    //stylize based on variable health
    //poverty percentage
    if (healthXAxis === 'poverty') {
        return `${value}%`;
    }
    //household income in dollars
    else if (healthXAxis === 'income') {
        return `$${value}`;
    }
    //age (number)
    else {
        return `${value}`;
    }
}

// function used for updating circles group with healthnew tooltip
function updateToolTip(healthXAxis, healthYAxis, circlesGroup) {

    //select x label
    //poverty percentage
    if (healthXAxis === 'poverty') {
        var xLabel = "Poverty:";
    }
    //household income in dollars
    else if (healthXAxis === 'income') {
        var xLabel = "Median Income:";
    }
    //age (number)
    else {
        var xLabel = "Age:";
    }

    //select y label
    //percentage lacking healthcare
    if (healthYAxis === 'healthcare') {
        var yLabel = "No Healthcare:"
    }
    //percentage obese
    else if (healthYAxis === 'obesity') {
        var yLabel = "Obesity:"
    }
    //smoking percentage
    else {
        var yLabel = "Smokers:"
    }

    //create tooltip
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-8, 0])
        .html(function(d) {
            return (`${d.state}<br>${xLabel} ${styleX(d[healthXAxis], healthXAxis)}<br>${yLabel} ${d[healthYAxis]}%`);
        });

    circlesGroup.call(toolTip);

    //add events
    circlesGroup.on("mouseover", toolTip.show)
    .on("mouseout", toolTip.hide);

    return circlesGroup;
}

//retrieve csv data and execute everything below
d3.csv("/data/data.csv", function(err, healthData) {
    if (err) throw err;

    console.log(healthData);

    //parse data
    healthData.forEach(function(data) {
        data.obesity = +data.obesity;
        data.income = +data.income;
        data.smokes = +data.smokes;
        data.age = +data.age;
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
    });

    //create first linear scales
    var xLinearScale = xScale(healthData, healthXAxis);
    var yLinearScale = yScale(healthData, healthYAxis);

    //create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    //append y axis
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);

    //append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .classed("stateCircle", true)
        .attr("cx", d => xLinearScale(d[healthXAxis]))
        .attr("cy", d => yLinearScale(d[healthYAxis]))
        .attr("r", 12)
        .attr("opacity", ".5");

    //append initial text
    var textGroup = chartGroup.selectAll(".stateText")
        .data(healthData)
        .enter()
        .append("text")
        .classed("stateText", true)
        .attr("x", d => xLinearScale(d[healthXAxis]))
        .attr("y", d => yLinearScale(d[healthYAxis]))
        .attr("dy", 3)
        .attr("font-size", "10px")
        .text(function(d){return d.abbr});

    //create group for 3 x-axis labels
    var xLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20 + margin.top})`);

    var povertyLabel = xLabelsGroup.append("text")
        .classed("aText", true)
        .classed("active", true)
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty")
        .text("In Poverty (%)");

    var ageLabel = xLabelsGroup.append("text")
        .classed("aText", true)
        .classed("inactive", true)
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age")
        .text("Age (Median)")

    var incomeLabel = xLabelsGroup.append("text")
        .classed("aText", true)
        .classed("inactive", true)
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income")
        .text("Household Income (Median)")

    //create group for 3 y-axis labels
    var yLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${0 - margin.left/4}, ${(height/2)})`);

    var healthcareLabel = yLabelsGroup.append("text")
        .classed("aText", true)
        .classed("active", true)
        .attr("x", 0)
        .attr("y", 0 - 20)
        .attr("dy", "1em")
        .attr("transform", "rotate(-90)")
        .attr("value", "healthcare")
        .text("Lacks Healthcare (%)");

    var smokesLabel = yLabelsGroup.append("text")
        .classed("aText", true)
        .classed("inactive", true)
        .attr("x", 0)
        .attr("y", 0 - 40)
        .attr("dy", "1em")
        .attr("transform", "rotate(-90)")
        .attr("value", "smokes")
        .text("Smokes (%)");

    var obesityLabel = yLabelsGroup.append("text")
        .classed("aText", true)
        .classed("inactive", true)
        .attr("x", 0)
        .attr("y", 0 - 60)
        .attr("dy", "1em")
        .attr("transform", "rotate(-90)")
        .attr("value", "obesity")
        .text("Obese (%)");

    //updateToolTip function with data
    var circlesGroup = updateToolTip(healthXAxis, healthYAxis, circlesGroup);

    //x axis labels event listener
    xLabelsGroup.selectAll("text")
        .on("click", function() {
            //get value of selection
            var value = d3.select(this).attr("value");

            //check if value is same as current axis
            if (value != healthXAxis) {

                //replace healthXAxis with value
                healthXAxis = value;

                //update x scale for healthnew data
                xLinearScale = xScale(healthData, healthXAxis);

                //update x axis with transition
                xAxis = renderAxesX(xLinearScale, xAxis);

                //update circles with healthnew x values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, healthXAxis, yLinearScale, healthYAxis);

                //update text with healthnew x values
                textGroup = renderText(textGroup, xLinearScale, healthXAxis, yLinearScale, healthYAxis);

                //update tooltips with healthnew info
                circlesGroup = updateToolTip(healthXAxis, healthYAxis, circlesGroup);

                //change classes to change bold text
                if (healthXAxis === "poverty") {
                    povertyLabel.classed("active", true).classed("inactive", false);
                    ageLabel.classed("active", false).classed("inactive", true);
                    incomeLabel.classed("active", false).classed("inactive", true);
                }
                else if (healthXAxis === "age") {
                    povertyLabel.classed("active", false).classed("inactive", true);
                    ageLabel.classed("active", true).classed("inactive", false);
                    incomeLabel.classed("active", false).classed("inactive", true);
                }
                else {
                    povertyLabel.classed("active", false).classed("inactive", true);
                    ageLabel.classed("active", false).classed("inactive", true);
                    incomeLabel.classed("active", true).classed("inactive", false);
                }
            }
        });

    //y axis labels event listener
    yLabelsGroup.selectAll("text")
    .on("click", function() {
        //get value of selection
        var value = d3.select(this).attr("value");

        //check if value is same as current axis
        if (value != healthYAxis) {

            //replace healthYAxis with value
            healthYAxis = value;

            //update y scale for healthnew data
            yLinearScale = yScale(healthData, healthYAxis);

            //update x axis with transition
            yAxis = renderAxesY(yLinearScale, yAxis);

            //update circles with healthnew y values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, healthXAxis, yLinearScale, healthYAxis);

            //update text with healthnew y values
            textGroup = renderText(textGroup, xLinearScale, healthXAxis, yLinearScale, healthYAxis)

            //update tooltips with healthnew info
            circlesGroup = updateToolTip(healthXAxis, healthYAxis, circlesGroup);

            //change classes to change bold text
            if (healthYAxis === "obesity") {
                obesityLabel.classed("active", true).classed("inactive", false);
                smokesLabel.classed("active", false).classed("inactive", true);
                healthcareLabel.classed("active", false).classed("inactive", true);
            }
            else if (healthYAxis === "smokes") {
                obesityLabel.classed("active", false).classed("inactive", true);
                smokesLabel.classed("active", true).classed("inactive", false);
                healthcareLabel.classed("active", false).classed("inactive", true);
            }
            else {
                obesityLabel.classed("active", false).classed("inactive", true);
                smokesLabel.classed("active", false).classed("inactive", true);
                healthcareLabel.classed("active", true).classed("inactive", false);
            }
        }
    });
    


    
});
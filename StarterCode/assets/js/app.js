var svgWidth = 760;
var svgHeight = 500;
    var margin = {top: 20,right: 40,bottom: 100,left: 120};
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

//Establish a 'svg wrapper', top hold our chart append an 'svg group'
var svg = d3.select(".chart")
	.append("svg")
	.attr("width", svgWidth)
	.attr("height", svgHeight)
	.append("g")

//Shift latter on 'left margins' & 'top margins'
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var chart = svg.append("g");

//Create 'tooltips' by appending a 'div' to the body & assing it a class
d3.select(".chart")
	.append("div")
	.attr("class", "tooltip")
	.style("opacity", 0);
d3.csv("/assets/data/data.csv").then(function(data) {
{
	// if (error) throw error;
            data.forEach(function(data) 
            {
				data.poverty = +data.poverty;
				data.lacksHealthcare = +data.lacksHealthcare;
                
                //Chart #2
				data.age = +data.age
				data.smokes = +data.smokes
                
                //Chart #3
				data.householdIncome = +data.householdIncome
				data.obese = +data.obese
            
            });
            console.log(data)
       
            //Build 'Scale Functions'
			var yLinearScale = d3.scaleLinear().range([height, 0]);
			var xLinearScale = d3.scaleLinear().range([0, width]);

			//Build 'Axis Functions'
			var bottomAxis = d3.axisBottom(xLinearScale);
			var leftAxis = d3.axisLeft(yLinearScale);

			//Store the 'Min' & 'Max' values 'data,csv'
			var xMin;
			var xMax;
			var yMax;
			var yMin;
            function findMinAndMax(dataColumnX) 
            {
                xMin = d3.min(data, function(data) 
                {
					return +data[dataColumnX] * 0.75;
                });
                
                xMax = d3.max(data, function(data) 
                {
					return +data[dataColumnX] * 1.1;
				});
                yMax = d3.max(data, function(data) 
                {
					return +data.lacksHealthcare * 1.5;
				});
                yMin = d3.min(corrdata, function(data)
                {
					return +data.lacksHealthcare * 0.3;
				});
            }
            
            var currentAxisLabelX = "In Poverty (%)";
			var currentAxisLabelY = "Lacks Healthcare (%)";

			//Call 'findMinAndMax()' with 'Poverty' as Default
			findMinAndMax(currentAxisLabelX);
            findMinAndMax(currentAxisLabelY);
            
			// Scale the domain
			xLinearScale.domain([xMin,xMax]);
			yLinearScale.domain([yMin,yMax]);

			var toolTip = d3.tip()
					.attr("class", "tooltip")
					.offset([80, -60])
                    .html(function(data) 
                    
                    {
	                    //Marking Data pts
                        var state = data.state;
                        var xinfo
                        var yinfo
                        var xdata = +data[currentAxisLabelX];
                        var ydata = +data[currentAxisLabelY];

                        //Data Fields of Chart #1
                        var Poverty = +data.poverty;
                        var lacksHealthcare = +data.lacksHealthcare;

                        //Data Fields of Chart #2
                        var age = +data.age
                        var smokes = +data.smokes

                        //Data Fields of Chart #3
                        var householdIncome = +householdIncome
                        var obese = +data.obese

                        //Assigne 'tooltip' to the active 'X-Axis'
                        if (currentAxisLabelX === "In Poverty (%)") 
                        {
                            xinfo = "Poverty: " + poverty;
                        }
                        else if  (currentAxisLabelX === "Age (median)") 
                        {
                             xinfo = "Age (median): " + age
                        }
                        else 
                        { 
                             xinfo = "Household Income (median): " + householdIncome;    
                        }
                        
						//Return ('state' + 'xinfo' + 'xdata'). 'Tooltip' to the current active Y-AXIS 
                        if (currentAxisLabelY === 'Lacks Healthcare (%)') 
                        {
							yinfo = "Lack Healthcare (%): " + lacksHealthcare
						}
                        else if(currentAxisLabelY === 'Smokes (%)')
                        {

							yinfo = "Smokes (%):" + smokes
						}
                        else
                        {
							yinfo = "Obese (%): " + obese
						}
							console.log(state,":",xinfo, yinfo)
						return state + "<hr>" + xinfo + "<br>" + yinfo;
					});

			chart.call(toolTip);
			chart.selectAll("circle")
						.data(data)
						.enter().append("circle")
                        .attr("cx", function(data, index) 
                        {
							return xLinearScale(+data[currentAxisLabelX]);
						})
                        .attr("cy", function(data, index) 
                        {
							return yLinearScale(+data[currentAxisLabelY]);
						})
						.attr("r", "18")
						.attr("fill", "teal")
						.attr("opacity", 0.5)
							
							//Hover 'on mouseover' to publish on the 'screen'
                            .on("mouseover", function(data) 
                            {
								toolTip.show(data);
							})

							//Hover off 'on mouseout' to disappear
                            .on("mouseout", function(data, index) 
                            {
								toolTip.hide(data);
							});

			var text = chart.selectAll("text")
						.data(data)
						.enter()
						.append("text")
						.attr("class", "labels")
                        .attr("x", function(data, index) 
                        {
							return xLinearScale(+data[currentAxisLabelX]-0.01);
                        })
                        .attr("y", function(data, index) 
                        {
                            return yLinearScale(+data[currentAxisLabelY]-0.3);    
						})
                        .text(function(data)
                        {
							return data.abbr;
						})

		//Display 'x-axis' & append an 'svg group' for x-axis
			chart.append("g")
				.attr("transform", `translate(0, ${height})`)
				.attr("class", "x-axis")
				.call(bottomAxis);

		//Display 'y-axis' & append a group for the 'y-axis'
			chart.append("g")
				.call(leftAxis);

		//Append 'y-axis' label for active 'y-axis'
			chart.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", 0 - margin.left + 10)
				.attr("x", 0 - (height/1.5))
				.attr("dy", "1em")
				.attr("class", "yaxisText yactive")
				.attr("data-axis-name", "Lacks Healthcare (%)")
				.text("Lacks Healthcare (%)");

		//Append 'y-label' for second 'y-axis'
		 	chart.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", 0 - margin.left + 30)
				.attr("x", 0 - (height / 1.65))
				.attr("dy", "1em")
				.attr("class", "yaxisText yinactive")
				.attr("data-axis-name", "Smokes (%)")
				.text("Smokes (%)");

		//Append 'y-label' for third 'y-axis'
		 	chart.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", 0 - margin.left + 50)
				.attr("x", 0 - (height / 1.75))
				.attr("dy", "1em")
				.attr("class", "yaxisText yinactive")
				.attr("data-axis-name", "Obese (%)")
                .text("Obese (%)");
                
		//Append x'-axis' labels for Default Active 'x-axis'
			chart.append("text")
				.attr("transform", "translate(" + (width / 3) + " ," + (height + margin.top + 20) + ")")
				.attr("class", "xaxisText xactive")
				.attr("data-axis-name", "Poverty (%)")
				.text("Poverty (%)");

		//Append 'x-axis' labels for second 'x-axis'
			chart.append("text")
				.attr("transform", "translate(" + width / 2.85 + " ," + (height + margin.top + 40) + ")")
				.attr("class", "xaxisText xinactive")
				.attr("data-axis-name", "Age (median)")
				.text("age (median");

		//Append 'x-axis' labels for third 'x-axis'
			chart.append("text")
				.attr("transform","translate(" + width / 2.75 + " ," + (height + margin.top + 60) + ")")
				.attr("class", "xaxisText xinactive")
				.attr("data-axis-name", "Household Income (median)")
				.text("Household Income (median");

			//Adjust & Update the status of the 'x-axis's' from inactive to active when clicked
			//Therefater, Adjust & Update the status of all active axes to inactive otherwise
            function xlabelChange(clickedAxis) 
            {
				d3.selectAll(".xaxisText")
					.filter(".xactive")
					.classed("xactive", false)	
					.classed("xinactive", true);
				clickedAxis.classed("xinactive", false).classed("xactive", true);

			}
            d3.selectAll(".xaxisText").on("click", function() 
            {
				var clickedSelection = d3.select(this);
				var isClickedSelectionInactive = clickedSelection.classed("xinactive");
				var clickedAxis = clickedSelection.attr("data-axis-name");

                if (isClickedSelectionInactive) 
                {      
					currentAxisLabelX = clickedAxis;
					findMinAndMax(currentAxisLabelX);
                    xLinearScale.domain([xMin, xMax]);
                    
					//Establish a transition effect for the 'x-axis'
					svg.select(".x-axis")
						.transition()
						.ease(d3.easeElastic)
						.duration(1800)
						.call(bottomAxis);
				}
                    d3.selectAll("circle").each(function() 
                    {
						d3.select(this)
							.transition()
                            .attr("cx", function(data) 
                            {
								return xLinearScale(+data[currentAxisLabelX]);
							})
							.duration(1500);
					});
                    d3.selectAll(".labels").each(function() 
                    {
						d3.select(this)
							.transition()
                            .attr("x", function(data) 
                            {
								return xLinearScale(+data[currentAxisLabelX]);
							})
							.duration(1500);
                    });
                    
					//Adjust & Update Status on the Screen
					xlabelChange(clickedSelection);
			});

            function ylabelChange(clickedAxis) 
            {
				d3.selectAll(".yaxisText")
					.filter(".yactive")
					.classed("yactive", false)
					.classed("yinactive", true);
                clickedAxis.classed("yinactive", false).classed("yactive", true);
                
			}
            d3.selectAll(".yaxisText").on("click", function() 
            {
				var clickedSelection = d3.select(this);
				var isClickedSelectionInactive = clickedSelection.classed("yinactive");
				var clickedAxis = clickedSelection.attr("data-axis-name");
				console.log("current y-axis: ", clickedAxis);

                if (isClickedSelectionInactive) 
                {
					currentAxisLabelY = clickedAxis;
					findMinAndMax(currentAxisLabelY);
					yLinearScale.domain([yMin, yMax]);
					svg.select(".y-axis")
						.transition()
						.ease(d3.easeElastic)
						.duration(1500)
						.call(bottomAxis);
				}
            d3.selectAll("circle").each(function() 
            {
				d3.select(this)
					.transition()
                    .attr("cy", function(data)
                    {
						return yLinearScale(+data[currentAxisLabelY]);
					})
					.duration(1500);
			});

            d3.selectAll(".labels").each(function() 
            {
				d3.select(this)
					.transition()
                    .attr("y", function(data)
                    {
						return yLinearScale(+data[currentAxisLabelY]);
					})
					.duration(1500);
            });
            
			ylabelChange(clickedSelection);
	});

}
});

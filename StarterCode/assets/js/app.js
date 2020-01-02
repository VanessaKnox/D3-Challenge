var svgWidth = 960;
var svgHeight = 700;

var margin = {top: 20, right: 40, bottom: 60, left: 100};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the 
//    latter by left and top margins.
var svg = d3
  .select('.chart')
  .append('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var chart = svg.append('g');

d3.csv('data/data.csv', function(err, inputData) {
  if (err) throw err;

  console.log(inputData);
  inputData.forEach(function(data) {
    data.povertyRate = +data.povertyRate;
    data.excellentHealth = +data.excellentHealth;
    data.povertyRate = data.povertyRate * 100;
    data.excellentHealth = +data.excellentHealth * 100;
  });

  // Create scale functions
  var yLinearScale = d3.scaleLinear().range([height, 0]);

  var xLinearScale = d3.scaleLinear().range([0, width]);

  // Create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Scale the domain
  xLinearScale.domain([
    d3.min(inputData, function(data) {
      return (+data.povertyRate - 2);
    }),
    d3.max(inputData, function(data) {
      return (+data.povertyRate + 2);
    }),
  ]);
  yLinearScale.domain([
    d3.min(inputData, function(data) {
      return (+data.excellentHealth - 2);
    }),
    d3.max(inputData, function(data) {
      return +data.excellentHealth * 1.2;
    }),
  ]);

  var node = svg.selectAll('g')
                .data(inputData)
                .enter()
                .append('g');
  
  node.append('circle')
    .attr ('class', 'dot')
    .attr ('cx', function(data, index) {
        return xLinearScale(data.povertyRate);
    })
    .attr ('cy', function(data, index) {
        return yLinearScale(data.excellentHealth);
    })
    .attr('fill', 'lightblue')
    .attr('opacity', 0.9)
    .attr('r', '12')
  
  node.append('text')
    .attr('x', function(data,index) {
        return xLinearScale(data.povertyRate);
    })
    .attr('y', function(data, index) {
        return yLinearScale(data.excellentHealth);
    })
    .attr('dx', '-.70em')
    .attr('dy', '.35em')
    .attr('font-size', '11px')
    .attr('font-family', 'sans-serif')
    .attr('fill', 'white')
    .text(function(data, index) {return data.stateAbrv;});

  chart
    .append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(bottomAxis);

  chart.append('g').call(leftAxis);

  // Append x- and y-axis labels
  chart
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0 - margin.left + 40)
    .attr('x', 0 - height / 2)
    .attr('dy', '1em')
    .attr('class', 'axisText')
    .text('In Excellent Health (%)');

  chart
    .append('text')
    .attr(
      'transform',
      'translate(' + width / 2 + ' ,' + (height + margin.top + 30) + ')',
    )
    .attr('class', 'axisText')
    .text('In poverty (%)');
});
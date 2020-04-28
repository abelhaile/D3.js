// LEVERAGED  D3 DAY 3 ACTIVITY 12 SOLUTIONS
// SVG wrapper dimensions are determined by the current width
// and height of the browser window.
var svgWidth = 900;
var svgHeight = 700;

var margin = {
  top: 40,
  right: 40,
  bottom: 50,
  left: 40
};
var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .attr("class", "chart");

 // Append an SVG group
var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
//var chosenXAxis = "smokers";

// Retrieve data from the CSV file and execute everything below

d3.csv("assets/data/data.csv").then(function(govdata) {

  var toolTip = d3
  .tip()
  .attr("class", "d3-tip")
  .offset([40, -60])
  .html(function(d) {

    var theState = "<div>" + d.state + "</div>";

    return theState;
  });
// Call the toolTip function.
svg.call(toolTip);
// parse data

govdata.forEach(function(data) {
  data.poverty = +data.poverty;
  //data.age = +data.age;
  data.healthcare = +data.healthcare;
  //data.smokes = +data.smokes;
 // data.abbr = data.abbr;
});

 // xLinearScale function above csv import
 var xLinearScale = d3.scaleLinear()
 .domain([8, d3.max(govdata, d => d.poverty)])
 .range([0, width]);

 // Create y scale function
 var yLinearScale = d3.scaleLinear()
   .domain([3, d3.max(govdata, d => d.healthcare)])
   .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale).ticks(7);
  var leftAxis = d3.axisLeft(yLinearScale).ticks(10);

  // append x axis
  chartGroup.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(bottomAxis);

chartGroup.append("g")
  .call(leftAxis);


var theCircles = chartGroup.selectAll("g theCircles").data(govdata).enter()

  // append initial circles
  theCircles
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 21)
    .attr("fill", "pink")
    .attr("opacity", ".9")
    .on("mouseover", function(d) {
     toolTip.show(d, this);
      d3.select(this).style("stroke", "#323232");
    })
    .on("mouseout", function(d) {
      toolTip.hide(d);
      // Remove highlight
      d3.select(this).style("stroke", "#e3e3e3");
    });

    theCircles
    .append("text")
    .style("fill", "blue")
    .attr('x',d => xLinearScale(d.poverty))
    .attr('y',d => yLinearScale(d.healthcare))
    .attr("dy", ".40em") 
    .attr("text-anchor", "middle")
    .text(d => d.abbr)
    .attr("class", "stateText")
    .on("mouseover", function(d) {
      // Show the tooltip
      toolTip.show(d);
      // Highlight the state circle's border
      d3.select("." + d.abbr).style("stroke", "#323232");
    })
    .on("mouseout", function(d) {
      // Remove tooltip
      toolTip.hide(d);
      // Remove highlight
      d3.select("." + d.abbr).style("stroke", "#e3e3e3");
    });

  
  // Create axes labels
chartGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - 47)
  .attr("x", 0 -300)
  .attr("dy", "1em")
  .attr("class", "axisText")
  .text("poverty");

  chartGroup.append("text")

  .attr("transform", `translate(${width / 2}, ${height + margin.top - 5})`)
      .attr("class", "axisText")
      .text("Healthcare");
  });

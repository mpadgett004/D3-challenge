var svgWidth = 960;
var svgHeight = 660;

var chartMargin = {
    top: 40,
    right: 40,
    bottom: 40,
    left: 40
};

var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);




d3.csv("assets/data/data.csv").then(function(info) {
    console.log(info);

    // info.forEach(data => {
    info.forEach(function(data) {
        data.poverty = +data.poverty;
        data.povertyMoe = +data.povertyMoe;
        data.age = +data.age;
        data.ageMoe = +data.ageMoe;
        data.income = + data.income;
        data.incomeMoe = +data.incomeMoe;
        data.healthcareLow = +data.healthcareLow;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
    });

    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(info, x => x.poverty)-1, d3.max(info, x => x.poverty)])
        .range([0, chartWidth]);

    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(info, x => x.healthcareLow)-1, d3.max(info, x => x.healthcareLow)])
        .range([chartHeight, 0]);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);


    var circlesGroup = chartGroup.selectAll("circle")
        .data(info)
        .enter()
        .append("circle")
        .attr("cx", x => xLinearScale(x.poverty))
        .attr("cy", x => yLinearScale(x.healthcareLow))
        .attr("r", "10")
        .attr("fill", "lightblue")
        .attr("opacity", "0.8");

    var abbrGroup = chartGroup.selectAll("label")
        .data(info)
        .enter()
        .append("text")
        .text(x => x.abbr)
        .attr("font-size", 9)
        .attr("font-weight", "bold")
        .attr("fill", "white")
        .attr("x", x => xLinearScale(x.poverty)-7)
        .attr("y", x => yLinearScale(x.healthcareLow)+4);

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
          return (`${x.abbr}<br>In Poverty: ${x.poverty}%<br>No Healthcare: ${x.healthcareLow}%`);
        });

    chartGroup.call(toolTip);

    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - chartMargin.left + 40)
      .attr("x", 0 - (chartHeight / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + chartMargin.top - 50})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");
  
});
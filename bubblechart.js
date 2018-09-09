(function bubblechart() {
  var margin = {
      top: 70,
      right: 15,
      bottom: 70,
      left: 140
    },
    width = 650 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  var x = d3.scaleLinear()
    .range([0, width])
    .domain([0, 1000]);
  var y = d3.scaleLinear()
    .range([height, 0])
    .domain([0, 1000]);

  var graphtitle = "State-wise Death to Incident Ratio in the 2010s",
    xtitle = "Events"
    ytitle = "Deaths";

  var svg = d3.select("#bubble").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

  var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var tooltip = svg.append("g")
    .attr("class", 'tooltip')
    .style("display", "none")

  tooltip.append("text")
    .attr("x", 15)
    .attr("dy", "1.2em")

  d3.csv("bubble.csv", function(error, data) {
    if (error) throw error;

    data.forEach(function(d) {
      d.Events = +d.Events;
      d.Deaths = +d.Deaths;
      d.Ratio = +d.Ratio;
    });

    console.log(data);


    // Draw the line for events
    var bubble = g.selectAll('circle')
      .data(data).enter()
      .append('circle')
      .attr('cx', function(d) {
        return x(d.Events);
      })
      .attr('cy', function(d) {
        return y(d.Deaths);
      })
      .attr('r', function(d) {
        return d.Ratio * 20;
      })
      .attr('fill', '#e41a1c')
      .attr('opacity', "0.5")
      .attr('stroke', '#e41a1c')

    // Add labels
    var labels = g.selectAll(".text")
      .data(data)
      .enter()
      .append('text')
      .text(function(d) {
        if (d.Ratio > 0.5 && d.Events > 100) {
          return d.State;
        }
      })
      .attr("fill", "#fff")
      .style("font-size", "10px")
      .attr('x', function(d) {
        return x(d.Events);
      })
      .attr('y', function(d) {
        return y(d.Deaths);
      })

    //Bubble Conditions for dissappearing
    bubble.on("mouseover", function() {
        tooltip.style("display", null);
      })
      .on("mouseout", function() {
        tooltip.style("display", "none");
        labels.style("display", null)
      })
      .on("mousemove", function(d, i) {
        var xPos = d3.mouse(this)[0] + 55;
        var yPos = d3.mouse(this)[1] + 20;
        tooltip.select("text").text(d.State + ": " + d.Ratio);
        tooltip.select("text").attr("transform", "translate(" + xPos + "," + yPos + ")")
        labels.style("display", "none");
      });


  });
  // Draw axis
  g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("class", "axis")
    .call(d3.axisBottom(x).tickSize(-height));

  g.append("g")
    .call(d3.axisLeft(y).tickSize(-width))
    .attr("class", "axis");

  //Draw Title
  svg.append("g")
    .append('text')
    .attr('fill', '#fff')
    .attr('class', 'bartitle')
    .text("State-wise Death to Incident Ratio in the 2010s")
    .attr("transform", "translate(110, 20)")

  svg.append("g")
    .append('text')
    .attr('class', 'subtitle')
    .text("Attacks in Chattisgarh resulted in one death for every incident on average")
    .attr("transform", "translate(110, 42)")

  svg.append("g")
    .append("text")
    .text("Incidents")
    .attr("class", "axistitle")
    .attr("transform", "translate(365,465)")

  svg.append("g")
    .append("text")
    .text("Deaths")
    .attr("class", "axistitle")
    .attr("transform", "translate(105,270) rotate(-90)")

  svg.append("g")
    .append("text")
    .text("*Hover over/Tap the bubble to see the Death to Incident Ratio")
    .attr("class", "chartdisclaimer")
    .attr("transform", "translate(120, 490)")
})();

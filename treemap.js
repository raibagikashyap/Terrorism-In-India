(function treemapint() {

  var margin = {
    top: 60,
    bottom: 70,
    right: 0,
    left: 40
  };

  var width = 700 - margin.left - margin.right;
  var height = 520 - margin.top - margin.bottom;
  var format = d3.format(",d");
  var graphtitle = "Different Types of Terrorism Across India Since 2010"

  var color_scale = d3.scaleOrdinal()
    .range(["#e41a1c", "#377eb8", "#4daf4a", "#ff7f00", "#984ea3"]);

  var svg = d3.selectAll("#treemap")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var treemap = d3.treemap()
    .size([width, height])
    .padding(1)
    .round(true);

  d3.csv("treemap.csv", function(error, data) {
    if (error) throw error;

    data.forEach(function(d) {
      d.Terrorist_Events = +d.Terrorist_Events
    })

    var nest = d3.nest()
      .key(function(d) {
        return d.Type;
      })
      .key(function(d) {
        return d.Organization;
      })
      .rollup(function(d) {
        return d3.sum(d, function(e) {
          return e.Terrorist_Events;
        })
      })
      .entries(data);

    var nodes = d3.hierarchy({
        values: nest
      }, function(d) {
        return d.values;
      })
      .sum(function(d) {
        return d.value;
      });

    var tree = treemap(nodes);

    console.log(tree.leaves());

    var node = g.selectAll(".node")
      .data(tree.leaves())
      .enter()
      .append("rect")
      .attr("class", "node")
      .style("fill", function(d) {
        return color_scale(d.parent.data.key);
      })
      .style("x", function(d) {
        return d.x0 + "px";
      })
      .style("y", function(d) {
        return d.y0 + "px";
      })
      .style("width", function(d) {
        return d.x1 - d.x0 + "px";
      })
      .style("height", function(d) {
        return d.y1 - d.y0 + "px";
      })
      .on("mouseover", function() {
        tooltip.style("display", null);
      })
      .on("mouseout", function() {
        tooltip.style("display", "none");
      })
      .on("mousemove", function(d, i) {
        var xPos = d3.mouse(this)[0];
        var yPos = d3.mouse(this)[1] + 20;
        console.log(xPos);
        if (xPos > 400) {
          xPos = d3.mouse(this)[0] - 200
        } else {
          xPos = d3.mouse(this)[1] + 100
        }
        tooltip.attr("transform", "translate(" + xPos + "," + yPos + ")");
        console.log(i);
        console.log(d);
        tooltip.select("text").text(d.data.key + ": " + d.data.value)
      });

    node.append("text")
      .text(function(d) {
        return d.data.key;
      })
      .attr("x", function(d) {
        return d.x0 + "px";
      })
      .attr("y", function(d) {
        return d.y0 + "px";
      })
      .attr("fill", "#fff");

    var tooltip = svg.append("g")
      .attr("class", "tooltip")
      .style("display", "none")

    tooltip.append("text")
      .attr("x", 15)
      .attr("dy", "1.2em");


  });

  svg.selectAll(".title")
    .data(graphtitle)
    .enter()
    .append("text")
    .attr("fill", "#fff")
    .attr("class", "bartitle")
    .text(graphtitle)
    .attr("transform", "translate(40, 20)")

  svg.append("text")
    .text("Left Wing Extremism is the biggest threat to the national security")
    .attr("class", "subtitle")
    .attr("transform", "translate(40,45)")

  svg.append("text")
    .text("*Tap/Hover over a area to know the organization name and the number of terroist attacks it was responsible for")
    .attr("class", "chartdisclaimer")
    .attr("transform", "translate(40,490)")

    svg.append("text")
      .text("Note: There are 2,127 terrorist attacks for which the organization responsible is uknown. They have not been included in this tree map")
      .attr("class", "chartdisclaimer")
      .attr("transform", "translate(40,510)")

  var legend = svg.selectAll(".legend")
    .data(["LWE", "Nationalist", "Islamic", "Hindu", "Sikh"])
    .enter()
    .append("g")
    .attr("transform", function(d, i) {
      return "translate(" + (i * 80 + 200) + "," + (height + 70) + ")";
    });

  legend.append("rect") // make a matching color rect
    .attr("width", 10)
    .attr("height", 10)
    .attr("fill", function(d, i) {
      return color_scale(i);
    });

  legend.append("text") // add the text
    .text(function(d, i) {
      return d;
    })
    .style("font-size", 12)
    .attr("y", 10)
    .attr("x", 11)
    .attr("fill", "#fff");

})();

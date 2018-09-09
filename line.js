(function mainfigure() {

  var margin = {
      top: 75,
      right: 55,
      bottom: 55,
      left: 140
    },
    width = 650 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

  var x = d3.scaleTime()
    .range([0, width]);
  var y = d3.scaleLinear()
    .range([height, 0]);

  var graphtitle = "Year-Wise Terrorist Incidents in India"

  var parseTime = d3.timeParse("%Y");

  var line = d3.line()
    .x(function(d) {
      return x(d.Year);
    })
    .y(function(d) {
      return y(d.Terrorist_Events);
    })
    .curve(d3.curveMonotoneX);

  var svg = d3.select("#line-graph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

  var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.csv("line.csv", function(error, data) {
    if (error) throw error;

    data.forEach(function(d) {
      d.Year = parseTime(d.Year);
      d.Terrorist_Events = +d.Terrorist_Events;
    });

    x.domain(d3.extent(data, function(d) {
      return d.Year;
    }));
    y.domain([0, d3.max(data, function(d) {
      return d.Terrorist_Events;
    })])

    g.append("path")
      .data([data])
      .attr("class", "line")
      .style("stroke", "#e41a1c")
      .attr("stroke-width", 1.5)
      .attr("d", line);

    g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .attr("class", "axis")
      .call(d3.axisBottom(x));

    g.append("g")
      .call(d3.axisLeft(y))
      .attr("class", "axis");

    // console.log([data]);
    var focus = g.append("g")
      .attr("class", "focus")
      .style("display", "none");

    focus.append("circle")
      .attr("r", 7.5);

    focus.append("text")
      .attr("x", 15)
      .attr("dy", ".31em");

    focus.append("line")
      .attr("class", "x-hover-line hover-line")
      .attr("y1", 0)
      .attr("y2", height);

    focus.append("line")
      .attr("class", "y-hover-line hover-line")
      .attr("x1", width)
      .attr("x2", width);

    svg.append("rect")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .on("mouseover", function() {
        focus.style("display", null);
      })
      .on("mouseout", function() {
        focus.style("display", "none");
      })
      .on("mousemove", mousemove);

    var bisectDate = d3.bisector(function(d) {
      return d.Year;
    }).left;

    function mousemove() {

      var x0 = x.invert(d3.mouse(this)[0]),
        i = bisectDate(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i],
        d = x0 - d0.Year > d1.Year - x0 ? d1 : d0;
      focus.attr("transform", "translate(" + x(d.Year) + "," + y(d.Terrorist_Events) + ")");
      focus.select("text")
        .text(d.Terrorist_Events)
        .attr("fill", "#fff")
        .attr("class", "tooltip")
        .attr("font-size", "12px");
      focus.select(".x-hover-line").attr("y2", height - y(d.Terrorist_Events));
      focus.select(".y-hover-line").attr("x2", width + width);
    }

  });

  svg.selectAll(".title")
    .data(graphtitle)
    .enter()
    .append('text')
    .attr('fill', '#fff')
    .attr('class', 'bartitle')
    .text(graphtitle)
    .attr("transform", "translate(105, 20)")

  svg.append("g")
    .append("text")
    .text("India has witnessed more than 800 terrorist incidents every year since 2014")
    .attr("class", "axistitle")
    .attr("transform", "translate(105,45)")

  svg.append("g")
    .append("text")
    .text("Year")
    .attr("class", "axistitle")
    .attr("transform", "translate(380,430)")

  svg.append("g")
    .append("text")
    .text("Incidents")
    .attr("class", "axistitle")
    .attr("transform", "translate(100,260) rotate(-90)")

  svg.append('g')
    .append('text')
    .text("*Hover/Tap over the chart to see the values")
    .attr("class", "chartdisclaimer")
    .attr("transform", "translate(140,445)")


})();

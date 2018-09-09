(function barlines() {

  var margin = {
      top: 70,
      right: 65,
      bottom: 80,
      left: 135
    },
    width = 700 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

  var x = d3.scaleTime()
    .range([0, width]);
  var y = d3.scaleLinear()
    .range([height, 0]);
  var x2 = d3.scaleBand()
    .range([0, width])
    .paddingInner(0.1);
  var y2 = d3.scaleLinear()
    .range([height, 0])

  var color_scale = d3.scaleOrdinal()
    .range(["#e41a1c", "#377eb8", "#4daf4a"]);

  var parseTime = d3.timeParse("%Y");

  var svg = d3.select("#combo-graph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

  var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // var tooltip = d3.select('#tooltip');
  // var tooltipLine = chart.append('line');

  d3.csv("barline.csv", function(error, data) {
    if (error) throw error;

    data.forEach(function(d) {
      d.Year = parseTime(d.Year);
      d.Events = +d.Events;
      d.Deaths = +d.Deaths;
      d.Ratio = +d.Ratio;
    });

    x.domain(d3.extent(data, function(d) {
      return d.Year;
    }));
    y.domain([0, d3.max(data, function(d) {
      return d.Deaths;
    })]);
    y2.domain([0, d3.max(data, function(d) {
      return d.Ratio;
    })])

    // Draw the line for the Ratio

    ratio_data = [];

    for (var i = 0; i < data.length; i++) {
      ratio_data.push([data[i].Year, data[i].Ratio]);
    }

    var line_ratio = d3.line()
      .x(function(d) {
        return x(d[0]);
      })
      .y(function(d) {
        return y2(d[1]);
      })
      .curve(d3.curveMonotoneX);

    g.append("path")
      .data([ratio_data])
      .attr("class", "line")
      .attr("fill", "none")
      .style("stroke", "#4daf4a")
      .style("stroke-dasharray", ("3,3"))
      .attr("stroke-width", 1.5)
      .attr("d", line_ratio);

    // Draw the line for events
    events_data = [];

    for (var i = 0; i < data.length; i++) {
      events_data.push([data[i].Year, data[i].Events]);
    }

    var line_events = d3.line()
      .x(function(d) {
        return x(d[0]);
      })
      .y(function(d) {
        return y(d[1]);
      })
      .curve(d3.curveMonotoneX);

    g.append("path")
      .data([events_data])
      .attr("class", "line")
      .attr("fill", "none")
      .style("stroke", "#e41a1c")
      .attr("stroke-width", 1.5)
      .attr("d", line_events);

    // Draw the line for deaths

    deaths_data = [];

    for (var i = 0; i < data.length; i++) {
      deaths_data.push([data[i].Year, data[i].Deaths]);
    }

    var line_deaths = d3.line()
      .x(function(d) {
        return x(d[0]);
      })
      .y(function(d) {
        return y(d[1]);
      })
      .curve(d3.curveMonotoneX);

    g.append("path")
      .data([deaths_data])
      .attr("class", "line")
      .attr("fill", "none")
      .style("stroke", "#377eb8")
      .attr("stroke-width", 1.5)
      .attr("d", line_deaths);

    // Draw axis
    g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .attr("class", "axis")
      .call(d3.axisBottom(x));

    g.append("g")
      .call(d3.axisLeft(y))
      .attr("class", "axis");

    g.append("g")
      .call(d3.axisRight(y2))
      .attr("class", "axis")
      .attr("transform", "translate(" + width + ",0)");


    //**********************************************
    // Add a tooltip
    // ########################### Focus 1 ###########################
    var focus = g.append("g")
      .attr("class", "focus")
      .style("display", "none");

    focus.append("circle")
      .attr("r", 7.5)
      .attr("stroke", "#fff")
      .attr("stroke-width", "1px");

    focus.append("text")
      .attr("x", 15)
      .attr("dy", ".31em");

    // ########################### Focus 2 ###########################
    var focus2 = g.append("g")
      .attr("class", "focus2")
      .style("display", "none");

    focus2.append("circle")
      .attr("r", 7.5);

    focus2.append("text")
      .attr("x", 15)
      .attr("dy", ".31em");

    // ########################### Focus 2 ###########################
    var focus3 = g.append("g")
      .attr("class", "focus3")
      .style("display", "none");

    focus3.append("circle")
      .attr("r", 7.5);

    focus3.append("text")
      .attr("x", 15)
      .attr("dy", ".31em");

    // ########################### Line ###########################
    var vline = g.append("g")
      .attr("class", "vline")
      .style("display", "none")

    vline.append("line")
      .attr("class", "vline")
      .attr("y1", 0)
      .attr("y2", height)

    // ########################### Rect ###########################

    svg.append("rect")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .on("mouseover", function() {
        focus.style("display", null);
        focus2.style("display", null);
        focus3.style("display", null);
        vline.style("display", null);
      })
      .on("mouseout", function() {
        focus.style("display", "none");
        focus2.style("display", "none");
        focus3.style("display", "none");
        vline.style("display", "none");
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

      focus.attr("transform", "translate(" + x(d.Year) + "," + y(d.Events) + ")");

      focus.select("text")
        .text(d.Events)
        .attr("fill", "#fff")
        .attr("class", "tooltip")
        .attr("font-size", "12px");

      focus2.attr("transform", "translate(" + x(d.Year) + "," + y(d.Deaths) + ")");

      focus2.select("text")
        .text(d.Deaths)
        .attr("fill", "#fff")
        .attr("class", "tooltip")
        .attr("font-size", "12px");

      focus3.attr("transform", "translate(" + x(d.Year) + "," + y2(d.Ratio) + ")");

      focus3.select("text")
        .text(d.Ratio)
        .attr("fill", "#fff")
        .attr("class", "tooltip")
        .attr("font-size", "12px");

      vline.select(".vline").attr("x1", x(d.Year));
      vline.select(".vline").attr("x2", x(d.Year));
    }

  });
  // Add a legend
  var legend = svg.selectAll(".legend")
    .data(["Events", "Deaths", "Ratio"])
    .enter()
    .append("g")
    .attr("transform", function(d, i) {
      return "translate(" + (i * 110 + 255) + "," + (margin.top + height + 44) + ")";
    })
    .attr("class", "legend");

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

  svg.append("g")
    .append('text')
    .text("Deaths per Terrorist Incidents in India")
    .attr('class', 'bartitle')
    .attr("transform", "translate(95, 20)")

  svg.append("g")
    .append('text')
    .text("The 2010s saw a distinctive drop in the number of deaths per incident")
    .attr('class', 'subtitle')
    .attr("transform", "translate(95, 45)")

  svg.append("g")
    .append("text")
    .text("Year")
    .attr("class", "axistitle")
    .attr("transform", "translate(375,405)")

  svg.append("g")
    .append("text")
    .text("Ratio")
    .attr("class", "axistitle")
    .attr("transform", "translate(670,200) rotate(90)")

  svg.append("g")
    .append("text")
    .text("Incidents | Deaths")
    .attr("class", "axistitle")
    .attr("transform", "translate(90,270) rotate(-90)")

  svg.append("g")
    .append("text")
    .text("*Slide over the graph for exact numbers")
    .attr("class", "chartdisclaimer")
    .attr("transform", "translate(135,445)")
})();

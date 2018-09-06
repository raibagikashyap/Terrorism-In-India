(function gender() {

  var margin = {
      top: 80,
      bottom: 50,
      left: 180,
      right: 40
    },
    width = 700 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom

  var svg = d3.select('#bar-graph')
    .append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)

  var g = svg.append("g")
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  var graphtitle = "Country-wise Terrorist Incidents in 2017";

  var x = d3.scaleLinear()
    .range([0, width])
    //.domain([1, 22130]);

  var y = d3.scaleBand()
    .range([0, height])
    .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
    .paddingInner(0.1);

    var x_axis = d3.axisBottom(x)
      .tickFormat(function(d) {
        return d;
      })


    var tooltip = svg.append("g")
      .attr("class", 'tooltip')
      .style("display", "none")


    tooltip.append("text")
      .attr("x", 15)
      .attr("dy", "1.2em")


  d3.csv('bar.csv', function(error, data) {
    if (error) throw error;

    data.forEach(function(d) {
      d.Terrorist_Events = +d.Terrorist_Events
    })

    var countries = [];
    var terr_events = [];

    for (var i = 0; i < data.length; i++) {
      countries.push(data[i].Country);
    }
    for (var i = 0; i < data.length; i++) {
      terr_events.push(data[i].Terrorist_Events);
    }

    x.domain([1, d3.max(data, function(d) {
      return d.Terrorist_Events;
    })])

    console.log(terr_events);

    g.selectAll(".bar")
      .data(terr_events)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr("height", y.bandwidth()-5)
      .attr("width", function(d, i) { return x(d) + 'px'; })
      .attr("y", function(d, i) { return y(i); })
      .attr("fill", "#e41a1c")
      .on("mouseover", function(){
        tooltip.style("display", null);
      })
      .on("mouseout", function(){
        tooltip.style("display", "none");
      })
      .on("mousemove", function(d, i){
        var xPos = d3.mouse(this)[0] + 100;
        var yPos = d3.mouse(this)[1] + 70;
        console.log(d);
        tooltip.select("text").attr("transform", "translate(" + xPos + "," + yPos + ")");
        tooltip.select("text").text(d);
      });

    svg.selectAll(".text")
      .data(countries)
      .enter()
      .append('text')
      .text(function(d) { return d; })
      .attr("class", "axistitle")
      .attr("y", function(d, i){ return y(i) + 97.5; })
      .attr("x", 95)

    svg.selectAll(".title")
      .data(graphtitle)
      .enter()
      .append('text')
      .attr('fill','#fff')
      .attr('class', 'bartitle')
      .text(graphtitle)
      .attr("transform", "translate(95,25)")

    svg.append("g")
      .append("text")
      .text("India has consistently been the top ten for the past 30 years")
      .attr("class", "subtitle")
      .attr("transform", "translate(95,50)")

    svg.append('g')
      .append('text')
      .text("*Hover/Tap over the bar to see the value")
      .attr("class", "chartdisclaimer")
      .attr("transform", "translate(95,500)")

    svg.append("g")
      .attr("transform", "translate(" +margin.left+ "," + (height + 90) + ")")
      .call(x_axis)
      .attr("class", "axis");

  })

})();

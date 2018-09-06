(function heatmap() {

  var width = 800;
  var height = 650;

  var margin = {
    top: 50,
    bottom: 100,
    left: 50,
    right: 20
  };

  var color = d3.scaleOrdinal()
    .range(["#e41a1c", "#377eb8", "#4daf4a", "#ff7f00", "#984ea3"]);

  var svg = d3.select('#heatmap').append('svg')
    .attr('width', width)
    .attr('height', height);

  var g = svg.append('g');

  width = width - margin.left - margin.right;
  height = height - margin.top - margin.bottom;

  var projection = d3.geoMercator();

  var geoPath = d3.geoPath()
    .projection(projection);

  d3.json('india-states.json', function(error, topology) {

    projection
      .scale(1)
      .translate([0, 0]);

    var b = geoPath.bounds(topojson.feature(topology, topology.objects.polygons)),
      s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
      t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

    projection
      .scale(s)
      .translate(t);

    g.selectAll('path')
      .data(topojson.feature(topology, topology.objects.polygons).features)
      .enter()
      .append('path')
      .attr('fill', '#141311')
      .attr('opacity', 0.3)
      .attr('stroke', 'white')
      .attr("stroke-width", 2)
      .attr('d', geoPath)
      .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
  });

  d3.csv('heatmap.csv', function(error, data) {
    if (error) throw error;

    data.forEach(function(d) {
      d.latitude = +d.latitude;
      d.longitude = +d.longitude;
    })

    var terr_events = [];
    for (var i = 0; i < data.length; i++) {
      terr_events.push([data[i].longitude, data[i].latitude, data[i].Type])
    }

    g.selectAll('circle')
      .data(terr_events).enter()
      .append('circle')
      .attr('cx', function(d) {
        return projection(d)[0];
      })
      .attr('cy', function(d) {
        return projection(d)[1];
      })
      .attr('r', '2.5px')
      .attr('fill', function(d) {
        if (d[2] == 'Left Wing Extremism') {
          return '#e41a1c'
        } else if (d[2] == 'Nationalist/Sub-nationalist Movement') {
          return '#377eb8'
        } else if (d[2] == 'Religious Inspired: Islamic') {
          return '#4daf4a'
        } else if (d[2] == 'Religious Inspired: Hindu') {
          return '#ff7f00'
        } else if (d[2] == 'Religious Inspired: Sikh') {
          return "#984ea3"
        };
      })
      .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
      .attr('stroke', 'black');
  });

  svg.append('g')
    .append('text')
    .text('Different Types of Terrorism Across India Since 2010')
    .attr('class', 'bartitle')
    .attr('transform', 'translate(50, 30)');

  svg.append('g')
    .append('text')
    .text('The LWEs are mostly active in the central and the eastern parts of India')
    .attr('class', 'subtitle')
    .attr('transform', 'translate(50, 55)');

  svg.append('g')
    .append('text')
    .text('Note: There are 2,127 terrorist attacks for which the organization responsible is uknown and 3 left-wing extremism attacks for which the location is unknown.')
    .attr('class', 'chartdisclaimer')
    .attr('transform', 'translate(50, 580)');

  svg.append('g')
    .append('text')
    .text('They have not been included in this heat map.')
    .attr('class', 'chartdisclaimer')
    .attr('transform', 'translate(50, 600)');

  svg.append('g')
    .append('text')
    .text('The attacks have been included since 2010, hence Telengana which seperated from Andhra Pradesh in 2014, as of today, has not been shown as a seperate state.')
    .attr('class', 'chartdisclaimer')
    .attr('transform', 'translate(50, 622)');

  svg.append('g')
    .append("text")
    .text("1 Dot = 1 Terrorist Incident")
    .attr('class', 'axistitle')
    .attr('transform', 'translate(' + (width - 300) + ', 100)')

  //Add a legend
  var legend = svg.selectAll('.legend')
    .data(["Left Wing Extremism", "Nationalist/Sub-nationalist Movement",
      "Religious Inspired: Islamic", "Religious Inspired: Hindu", "Religious Inspired: Sikh"
    ])
    .enter()
    .append('g')
    .attr('transform', function(d, i) {
      return 'translate(' + (width - 300) + ',' + (i * 30 + 420) + ')'; // place each legend on the right and bump each one down 15 pixels
    })
    .attr('class', 'legend');

  legend.append('circle') // make a matching color rect
    .attr("r", 3)
    .attr('fill', function(d, i) {
      return color(i);
    })
    .attr('stroke', 'black');

  legend.append('text') // add the text
    .text(function(d) {
      return d;
    })
    .style('font-size', 12)
    .attr('y', 3)
    .attr('x', 11)
    .attr('fill', '#fff');

})();

(function calendar() {

  var margin = {
    top: 20,
    bottom: 20,
    left: 60,
    right: 20
  }

  var width = 700,
    height = 500;

  var cellSize = 17,
    calX = 25,
    calY = 50;

  var colors = ["#fed98e", "#fe9929", "#d95f0e", "#993404"];
  var breaks = [0, 5, 10];

  var parseDate = d3.timeParse("%d/%m/%Y");
  format = d3.timeFormat("%d-%m-%Y");
  toolDate = d3.timeFormat("%d/%b/%y");

  d3.csv("calendar.csv", function(error, data) {

    //set up an array of all the dates in the data which we need to work out the range of the data
    var dates = new Array();
    var values = new Array();

    //parse the data
    data.forEach(function(d) {
      dates.push(parseDate(d.Date));
      values.push(d.Terrorist_Events);
      d.date = parseDate(d.Date);
      d.value = +d.Terrorist_Events;
      //d.year=d.date.getFullYear();//extract the year from the data
    });

    var yearlyData = d3.nest()
      .key(function(d) {
        return d.Date;
      })
      .entries(data);

    console.log(yearlyData);

    var svg = d3.select("#calendar").append("svg")
      .attr("width", "90%")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    var cals = svg.selectAll("g")
      .data(yearlyData)
      .enter()
      .append("g")
      .attr("id", function(d) {
        return d.key;
      })
      .attr("transform", function(d, i) {
        return "translate(0," + (margin.left + (i * (height + calY))) + ")";
      })

    var rects = cals.append("g")
      .attr("id", "alldays")
      .selectAll(".day")
      .data(function(d) {
        return d3.time.days(new Date(parseInt(d.key), 0, 1), new Date(parseInt(d.key) + 1, 0, 1));
      })
      .enter().append("rect")
      .attr("id", function(d) {
        return "_" + format(d);
        //return toolDate(d.date)+":\n"+d.value+" dead or missing";
      })
      .attr("class", "day")
      .attr("width", cellSize)
      .attr("height", cellSize)
      .attr("x", function(d) {
        return xOffset + calX + (d3.time.weekOfYear(d) * cellSize);
      })
      .attr("y", function(d) {
        return calY + (d.getDay() * cellSize);
      })
      .datum(format);



  })

}())

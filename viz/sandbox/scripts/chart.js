
function Chart() {
};

Chart.url = "http://www.reddit.com/r/pics.json?limit=40";

Chart.prototype.init = function() {
    var chart = this;
    $.ajax({
        type: 'GET',
        url: Chart.url,
        dataType: 'jsonp',
        success: function(response) {
            chart.draw(response.data.children);
            d3.select(window).on('resize', function() {
                d3.select("svg").remove();
                chart.draw(response.data.children);
            });
        },
        error: function() { console.log('Uh Oh!'); },
        jsonp: 'jsonp'
    });


}

Chart.prototype.draw = function(data) {
    console.log('drawing chart!');
    /*data.sort(function(a, b) {
        return a.data.score - b.data.score;
    });*/

    var svg = d3.select("body").append("svg");

    // svg width/height set by css...
    var width = parseInt(svg.style("width"));
    var height = parseInt(svg.style("height"));
    console.log('width/height: ' + width + '/' + height);

    var maxScore = d3.max(data, function(d) {
        return d.data.score;
    });

    var yScale = d3.scale.linear()
        .domain([0, maxScore])
        .range([0, height]);

    var xScale = d3.scale.ordinal()
        .domain(d3.range(data.length))
        .rangeBands([0, width], 0.1);

    var g = svg.append("g")
        .attr("transform", "translate(0, 0)");

    var bars = g.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr({
            x: function(d, i) {return xScale(i)},
            y: function(d, i) {return height - yScale(d.data.score)},
            width: xScale.rangeBand(),
            height: function(d, i) { return yScale(d.data.score)}
        });
};

TODO: 'finish tool tip';
window.addEventListener('load', function () {
    let dataset = null;
    let width = 1000;
    let height = 800;
    let padding = 50;
    let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
    let req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.send();
    req.onload = function () {
        let jsonResponse = JSON.parse(req.responseText);
        dataset = jsonResponse.data;
        let domainMinMax = [0, Math.ceil(d3.max(dataset, d => d[1]))];

        let timeParser = d3.timeParse("%Y-%m-%d");
        let xScale = d3.scaleTime().domain([timeParser(dataset[0][0]), timeParser(dataset[dataset.length - 1][0])])
        .range([padding,width - padding]);
       
        let yScale = d3.scaleLinear().domain(domainMinMax).range([height - padding, padding]);
        
        let svg = d3.select('#content').append('svg').attr('width', width).attr('height', height).attr('id','graph');
        svg.append('text').text('GDP Of United State (1950 - 2015)').attr('id','title').attr('x',width/2).attr('y',padding).attr('text-anchor','middle').style('font-size','40px');
       
        svg.selectAll('rect').data(dataset).enter().append('rect')
        .attr('class','bar')
        .attr('data-date', d => d[0])
        .attr('data-gdp', d => d[1])
        .attr('x', (d, i) => {
            return xScale(new Date( timeParser(d[0])));
        })
        .attr('y', (d, i) => {
            return yScale(d[1]);
        })
        .attr('height', (d) => {
            return height - yScale(d[1]) - padding;
        })
        .attr('width', 2)
        .on('mouseover', d => {
            tooltip.transition().duration(200).style('opacity', .9);
            tooltip.html(d[0] + '<br/> ' + d[1] + ' Billion')
            .attr('x',(d3.event.pageX / 2))
            .attr('font-size','30px')
            .attr('data-date', d[0]);
        })
        .on('mouseout', d =>{
            tooltip.transition()
            .duration(500)
            .style('opacity',0)
        });
        let tooltip = svg.append('text').attr('id','tooltip').style('opacity',0).attr('x',0).attr('y', height - 3 * padding);
        let xAxis = d3.axisBottom(xScale);
        let yAxis = d3.axisLeft(yScale);

        svg.append('g')
        .attr('transform', `translate(0,${height - padding})`)
        .attr('id','x-axis')
        .attr('class','tick')
        .call(xAxis);

        svg.append('g')
        .attr('transform', `translate(${padding},0)`)
        .attr('id','y-axis')
        .attr('class','tick')
        .call(yAxis);
    }

});
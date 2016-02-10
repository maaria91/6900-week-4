/**
 * Created by Maaria on 2/4/16.
 */
//in the WRAPPER we have to have the 1- intro-- INTERNAL VARIABLES: need defult values that can be overwritten later
    // 2- THEN we do EXPORTS: the function that gets exported and RETURNED.. it is RESPONSIBLE for appends the DOM elements
    // 3- THEN the GETTER and SETTER functions that allow us to modify and acess the variables

d3.timeSeries = function() {//WRAPPER -- IMPORTANT in html file the D# is the FIRST to be loaded or this can NOT work
//1- the internal var -- need values -- THIS IS all we need to DRAW the histogram
    var w = 800,
        h = 600,
        m = {t: 25, r: 50, b: 25, l: 50},//this is the margin of the "drawing space"  ***
        layout = d3.layout.histogram(),
        chartW = w - m.l - m.r,
        chartH = h - m.t - m.b,// this and the above are the CHART or hist H and W
        timeRange = [new Date(), new Date()],// we set this up HERE to use under.. also it is specified in READ me.. start date to end date
        binSize = d3.time.day,
        maxY = 1000, //maximum number of trips to show on the y axis   ***
        scaleX = d3.time.scale().range([0, chartW]).domain(timeRange),//setting the AXIS
        scaleY = d3.scale.linear().range([chartH, 0]).domain([0, maxY]),
        valueAccessor = function (d) {
            return d;
        }; //accessor needs function


    //2-the EXPORT -- THAT gets RETURNED in the end
    function exports(_selection) {


        //recompute internal variables if updated
        var bins = binSize.range(timeRange[0], timeRange[1]);
        bins.unshift(timeRange[0]);
        bins.push(timeRange[1]);



            chartW = w - m.l - m.r,
            chartH = h - m.t - m.b;

            scaleX.range([0, chartW]).domain(timeRange);
            scaleY.range([chartH, 0]).domain([0, maxY]);

        // Hist layout
        //.values(valueAccessor)
        //.range(timeRange)
        //.bins(bins);
            var layout = d3.layout.histogram()//histogram is living UNDER the layout . d3
                .value(valueAccessor)//you can go to d3.histogram online
                .range(timeRange)//from EXPORT
                .bins(binSize.range(timeRange[0],timeRange[1]));//since BINS is an interval.. on d3 online.. its d3.time.any of the options
                                                                //d3.time.week.range(date1,date2); this is an example.

        //
        //       //take the data and use hist laytou to transform into a series of X and Y
        //    selection.each(function(_d){
        //                                //as a reminder: selection in this case- is d3.select('.plot')
        //    var data = layout(_d);
        //        console.log(data);
        //
        //
        ////apend DOM ELEMENT
        //d3.select.append('svg')
        //var svg.append('g').attr('transform'....)
        //    .append('path')


        _selection.each(draw);

        function draw(d) {

            var _d = layout(d);
            console.log(_d);

                //this is pulling the information from above.GENERATING the info/. then below we DRAW
            var line = d3.svg.line()
                .x(function (d) {
                    return scaleX(d.x.getTime() + d.dx /2)
                })
                .y(function (d) {
                    return scaleY(d.y)
                })
                .interpolate('basis');
            var area = d3.svg.area()
                .x(function (d) {
                    return scaleX(d.x.getTime() + d.dx /2)
                })
                .y0(chartH)
                .y1(function (d) {
                    return scaleY(d.y)
                })
                .interpolate('basis');




            //append and update DOM
            var svg = d3.select(this).selectAll('svg')
                .data([d]);
            //basically here we are drawing line and area for EACH SVG.. we CREATE them then.. darw
            var svgEnter = svg.enter().append('svg')
            //setting the width and height for the SVGs...
            svg.attr('width', w).attr('height', h);


            //DRAWING
            //setting up the axis for where the lines and areas will be on
            //THE AXIS
            var axisX = d3.svg.axis()
                .orient('bottom')
                .scale(scaleX)
                .ticks(d3.time.year);

            svgEnter.append('g')
                .attr('class', 'axis')
                .attr('transform', 'translate(' + m.l + ',' + (m.t + chartH) + ')');
            svg.select('.axis')
                .call(axisX);

            //Daring the line graph
            svgEnter.append('g')
                .attr('class', 'line')
                .attr('transform', 'translate(' + m.l + ',' + m.t + ')')
                .append('path')
                //.style("fill", 'rgba(63,180,191,0.5');

            svg.select('.line')
                .select('path')
                .datum(_d)
                //.style("fill", 'rgba(63,180,191,0.5')
                .attr('d', line);


            //now the area for each of the lines
            svgEnter.append('g')
                .attr('class', 'area')
                .attr('transform', 'translate(' + m.l + ',' + m.t + ')')
                .append('path');

            svg.select('.area')
                .select('path')
                .datum(_d)
                .attr('d', area);

        }



    }



    //3- getter and setter FUNC-- modify and access internal variable.
    //Exports is basically what we take OUT to our other script..
    exports.width = function (_x) {
        if (!arguments.length) return w; //!argument .. basically means if USER DOESNT specify and argument
        w = _x;
        return this; //return exports
    }

    exports.height = function (_x) { //_X is a place holder for a number.. they are not the same
        if (!arguments.length) return h;
        h = _x;
        return this;
    }

    exports.timeRange = function (_r) {
        if (!arguments.length) return timeRange;
        timeRange = _r;
        return this;

    }

    exports.chartH = function(_y){
        if(!arguments.length) return chartH;
        chartH= _y;
        return this;
    }

    exports.binSize = function (interval) {
        if (!arguments.length) return binSize;
        binSize = interval
        return this;
    }

    exports.value = function (accessor) {
        if (!arguments.length) return valueAccessor;
        valueAccessor = accessor;
        return this;

    }

    exports.maxY = function (_y) {
        if (!arguments.length) return maxY;
        maxY = _y;
        return this;

        //the RETURN of the EXPORT function
    }

    //THIS MUST BE OUTSIDE THE FUNCTION {} BUT INSIDE THE WRAPPER
    return exports;
}

var w = d3.select('.plot').node().clientWidth,
    h = d3.select('.plot').node().clientHeight;


var timeSeries1 = d3.timeSeries()
    .width(w)
    .height(h)
    .value(function(d){return d.startTime;})//we have to put value
    .timeRange([new Date(2011,6,16),new Date(2013,11,15)])
    .maxY(80)//this is for the max of the Y axis
    .binSize(d3.time.day);


//importing the data
d3.csv('../data/hubway_trips_reduced.csv',parse,dataLoaded);


function dataLoaded(err,rows){

//creating nests per station-- so we have more than one
    var tripsByStation = d3.nest()
        .key(function(d){return d.startStation})
        .entries(rows);

    //create a <div> for each station
    //bind trips data to each station -- 150 for each station
    var plots = d3.select('.container').selectAll('.plot')//- 150 for each station
        .data(tripsByStation);

    plots
        .enter()
        .append('div').attr('class','plot');//now we have 150 DIV

    plots
        .each(function(d){//EACH of the 150 stations.. and find them and call time series for it!..GOING through the plots that we generated =
            // we now have 150 divs
            d3.select(this).datum(d.values)// where the data is stored***
                .call(timeSeries1)//running the export function  - SELECTION in it..***
                .append('h2')
                .text(d.key);

        })
    //
    //d3.select('.plot')//the selection function here-- DIV element in HTML and we put it into TIME-SERIES
    //    .datum(rows) // where the data is stored
    //    .call(timeSeries1) //running the export function  - SELECTION ins it..

}

function parse(d){
    if(+d.duration<0) return;

    return {
        duration: +d.duration,
        startTime: parseDate(d.start_date),
        endTime: parseDate(d.end_date),
        startStation: d.strt_statn,
        endStation: d.end_statn
    }
}

function parseDate(date){
    var day = date.split(' ')[0].split('/'),
        time = date.split(' ')[1].split(':');

    return new Date(+day[2],+day[0]-1, +day[1], +time[0], +time[1]);
}


//selecting necessary html elements 
var dropdownMenu = d3.selectAll("#selDataset")
var demoTableBody = d3.selectAll('#sample-metadata')
var demoTable = d3.selectAll('.panel')
var bubbleTable = d3.selectAll('#bubble')
var gaugeChart = d3.selectAll('#gauge')

// Returns first ten values of a list at a specific key
function unpack(table, key) { return table.map( data => (data[key]).slice(0,10)); }

//creating initial graphs
function init () {

    // reading samples.json to extract data for bar graph
    d3.json('samples.json').then( (data) => {

        var sampleValues = unpack(data.samples, "sample_values");
        var otuIDs = unpack(data.samples, "otu_ids");
        var otuLabels = unpack(data.samples, "otu_labels");

        var ids = data.metadata.map(row => row.id);
        var ethnicity = data.metadata.map(row => row.ethnicity);
        var gender = data.metadata.map(row => row.gender);
        var location = data.metadata.map(row => row.location);
        var bbtype = data.metadata.map(row => row.bbtype);
        var wfreq = data.metadata.map(row => row.wfreq);

        //appending option tags for dropdown menu
        ids.forEach(id => { dropdownMenu.append("option").text(`${id}`) })

        // BUBBLE GRAPH VALUES
        var yBubble = data.samples[0]['sample_values']
        var xBubble = data.samples[0]['otu_ids']
        var labelsBubble = data.samples[0]['otu_labels']

        //BAR GRAPH
        // converting an integer to a string ("1000" for example) is still 
        // graphed like an int by plotly. need to attach letters before the number "OTU 1000"
        ticks = otuIDs[0].map(x => {return `OTU ${x.toString()}`})
        //bar graph using .sort( function() {}) to sort int values
        values = sampleValues[0].sort((a , b) => a-b)
        //bar graph data array 
        var data = [{
            x: values,
            y: ticks,
            text: otuLabels[0],
            type: 'bar',
            orientation: 'h'}]
        //bar graph layout
        var layout = {
            yaxis: { title: "Operational Taxonomic Units ID" },
            xaxis: { title: "Sample Values" },
            height: 500,
            width: 500
        };
        //plotly new bar graph      
        Plotly.newPlot('bar', data, layout);   
        

        //BUBBLE GRAPH
        var data = [{
            x:xBubble,
            y:yBubble,
            mode: 'markers',
            marker: {
                size: yBubble,
                opacity: 0.6,
                color: xBubble
            },
            text:labelsBubble
        }];

        var layout = {
            title: "Sample value vs Operational Taxonomic Units (OTU) ID",
            height:600,
            width:1500,
            xaxis:{title:"OTU ID"},
            yaxis:{title:"Sample Value"}
        };
        //checking color list
        //console.log(colorValues)
        Plotly.newPlot('bubble',data,layout);

        

        //GAUGE CHART BONUS EXERCISE
        gaugeChart.html('<h3><b style="position: absolute;top: 30px;left:120px;width:500px;">Belly Button Washing Frequency</b></h3>')
        var data = [
            {
              domain: { x: [0, 1], y: [0, 1] },
              value: wfreq[0],
              title: { text: "Washes per week" },
              type: "indicator",
              mode: "gauge+number",
              delta: { reference: 400 },
              gauge: { 
                axis: { range: [null, 9] },
                bar: { color: "rgb(0,76,153)" },
                steps: [
                    { range: [0, 1], color: "rgb(204,255,204)" },
                    { range: [1, 2], color: "rgb(153,255,153)" },
                    { range: [2, 3], color: "rgb(102,255,102)" },
                    { range: [3, 4], color: "rgb(20,255,20)" },
                    { range: [4, 5], color: "rgb(0,220,0)" },
                    { range: [5, 6], color: "rgb(0,204,0)" },
                    { range: [6, 7], color: "rgb(0,153,0)" },
                    { range: [7, 8], color: "rgb(0,120,0)" },
                    { range: [8, 9], color: "rgb(0,102,51)" }]}
            }
          ];
          
          var layout = { width: 600, height: 400 };
          Plotly.newPlot('gauge', data, layout);


        //adding initial values to the demographic info table:
        //creating dictionary 
        var demographicTableValues = {'id':ids[0],'ethnicity':ethnicity[0],'gender':gender[0],
                                'location':location[0], 'bbtype':bbtype[0], 'wfreq':wfreq[0]}
        //using object to create an array of arrays that contain key value pairs 
        Object.entries(demographicTableValues)
        //using forEach to iterate through each key value pair and create html elements
        .forEach( ([key,value], i) => 
                    {console.log(key, value, i);
                    demoTableBody.append('div')
                            .attr('class', 'panel-body')
                            .text(`${key}:${value}`)
                  })
    //end of json promise.then()
    });
//end of init()
}

//Call updatePlotly() when a change takes place to the DOM
dropdownMenu.on("change", updatePlotly);

//creating update function for bar plot, demographic table and bubble graph
function updatePlotly() {

    // reading samples.json to extract data for bar graph
    d3.json('samples.json').then( (data) => {

        //isolating list of locations from json
        var locations = data.metadata.map(row => row.location);
        //replacing null values with string as code fails to run with null values 
        var locationUpdated = locations.map( (location) => {
            if (location === null) {
                return "undefined"
            } else {
                return location
            }
        })
        //checking if locationUpdated has replaced null values with string
        console.log(locationUpdated)


        var sample_values = unpack(data.samples, "sample_values");
        var otu_ids = unpack(data.samples, "otu_ids");
        var otu_labels = unpack(data.samples, "otu_labels");

        var ids = data.metadata.map(row => row.id);
        var ethnicities = data.metadata.map(row => row.ethnicity);
        var genders = data.metadata.map(row => row.gender);
        var locations = data.metadata.map(row => row.location);
        var bbtypes = data.metadata.map(row => row.bbtype);
        var wfreqs = data.metadata.map(row => row.wfreq);

        var dropdownMenu = d3.select('#selDataset')
        var selectedValue = dropdownMenu.node().value;

        var x = []
        var y = []
        var text = []
        //using .forEach() to iterate through list of ids to compare to the selected value
        ids.forEach( (id, i)=> {
            // reassigning x and y values 
            switch(selectedValue) {
                case `${id}`:
                    x = sample_values[i].sort((a , b) => a-b);
                    y = otu_ids[i].map(x => {return `OTU ${x.toString()}`});
                    text = otu_labels[i]
                    break;
            }
            //reassigning demographic table values
            switch(selectedValue) {
                case `${id}`:
                    iD = ids[i];
                    ethnicity = ethnicities[i];
                    gender = genders[i];
                    loc = locationUpdated[i];
                    bbtype = bbtypes[i];
                    wfreq = wfreqs[i];
            }

            //reassigning bubble graph values
            switch(selectedValue) {
                case `${id}`:
                    yBubble = data.samples[i]['sample_values']
                    xBubble = data.samples[i]['otu_ids']
                    labelsBubble = data.samples[i]['otu_labels']
            }
        })

        // restyling Bar graph
        Plotly.restyle('bar','x',[x])
        Plotly.restyle('bar','y',[y])
        Plotly.restyle('bar','text',[text])

        // restyling Bubble graph
        Plotly.restyle('bubble','x',[xBubble])
        Plotly.restyle('bubble','y',[yBubble])
        Plotly.restyle('bubble','text',[labelsBubble])

        // restyling gauge
        Plotly.restyle('gauge', 'value', [wfreq])

        // reassigning values to the demographic info table
        // creating dictionary 
        var demographicTableValues = {'id':iD,'ethnicity':ethnicity,'gender':gender,
        'location':loc, 'bbtype':bbtype, 'wfreq':wfreq}

        //reseting demographic info table
        demoTableBody.html("")
        //using object to create an array of arrays that contain key value pairs 
        Object.entries(demographicTableValues)
        //using forEach to iterate through each key value pair and create html elements
        .forEach( ([key,value]) => 
                    {console.log(key, value);
                    demoTableBody.append('div')
                            .attr('class', 'panel-body')
                            .text(`${key}:${value}`)
                })

    //end of json promise.then()
    });
//end of updatePlotly()
}


init()

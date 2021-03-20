//selecting dropdown menu
var dropdownMenu = d3.selectAll("#selDataset")
var demoTableBody = d3.selectAll('#sample-metadata')
var demoTable = d3.selectAll('.panel')

// Returns first ten values of a list at a specific key
function unpack(table, key) { return table.map( data => (data[key]).slice(0,10)); }

//creating initial graph
function init () {

    // reading samples.json to extract data for bar graph
    d3.json('samples.json').then( (data) => {

        var sample_values = unpack(data.samples, "sample_values");
        var otu_ids = unpack(data.samples, "otu_ids");
        var otu_labels = unpack(data.samples, "otu_labels");

        var ids = data.metadata.map(row => row.id);
        var ethnicity = data.metadata.map(row => row.ethnicity);
        var gender = data.metadata.map(row => row.gender);
        var location = data.metadata.map(row => row.location);
        var bbtype = data.metadata.map(row => row.bbtype);
        var wfreq = data.metadata.map(row => row.wfreq);

        //appending option tags for dropdown menu
        ids.forEach(id => { dropdownMenu.append("option").text(`${id}`) })

            // convering each value to a string. "1000" for example is still 
            // treated like an int by plotly so need to make it "OTU 1000"
            yticks = otu_ids[0].map(x => {return `OTU ${x.toString()}`})
            //using .sort( function() {}) to sort int values
            xvalues = sample_values[0].sort((a , b) => a-b)

            var data = [{
                x: xvalues,
                y: yticks,
                text: otu_labels[0],
                type: 'bar',
                orientation: 'h'}]

            var layout = {
                yaxis: { title: "OTU ID" },
                xaxis: { title: "Sample Values" } };

        Plotly.newPlot('bar', data, layout)   
        

        //adding values to the demographic info table
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
    });
   
}

//Call updatePlotly() when a change takes place to the DOM
dropdownMenu.on("change", updatePlotly);

//creating bar plot update function
function updatePlotly() {

    // reading samples.json to extract data for bar graph
    d3.json('samples.json').then( (data) => {

        var locations = data.metadata.map(row => row.location);
        var locationUpdated = locations.map( (location,i) => {
            if (location === null) {
                return "undefined"
            } else {
                return location
            }
        })


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
        })

        // restyling graph
        Plotly.restyle('bar','x',[x])
        Plotly.restyle('bar','y',[y])
        Plotly.restyle('bar','text',[text])

        // adding values to the demographic info table
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


    });
        
}


init()

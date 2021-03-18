// Returns first ten values of a list at a specific key
function unpack(table, cell) {
    return table.map(data => data[cell].slice(0,10));
  }

function init () {

    // reading samples.json to extract data for bar graph
    d3.json('samples.json').then( (data) => {

        var sample_values = unpack(data.samples, "sample_values");
        var otu_ids = unpack(data.samples, "otu_ids");
        var otu_labels = unpack(data.samples, "otu_labels");

        data = [{
            x: otu_ids[0],
            y: sample_values[0],
            name: otu_labels[0]
        }]

        Plotly.newplot('bar', data)
    });
}

// Call updatePlotly() when a change takes place to the DOM
d3.selectAll("#seldataset").on("change", updatePlotly);

function updatePlotly() {

    

}
// use the D3 library to read in samples.json from URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

//create console log for data to reference
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

// start and drop down menu selection function
function start() {

    // pull Json data
    d3.json(url).then(function(data) {

        // select drop down from html
        let selection = d3.select("#selDataset");
        
        // map data and apply to drop down
        data.names.map(function(set) {
            return selection.append("option").text(set)
        });
     
        //add initial graphs
        graphs(data.names[0]);
    });
};

// create function for graphs and 
function graphs(set) {
    
    // pull Json data and create filter
    d3.json(url).then(function(data) {
        let metadata = data.metadata;
        function idSelect(ids) {
            return ids.id == set;
        };
        //select panel from html
        let body = d3.select("#sample-metadata");        
        // Filter data and convert object to array
        let results = metadata.filter(idSelect)[0];
        let info = Object.entries(results);
        // Clear previous panel body
        body.html("");
        // apply key value pair of metadata to panel body
        info.map(function([key, value]) {
            return body.append("p").text(`${key}: ${value}`)
        });
    });

    // Pull Json data and create filter
    d3.json(url).then(function(data) {
        let samples = data.samples;
        function idSelect(ids) {
            return ids.id == set
        };

        // Create variables for graph
        let filterResult = samples.filter(idSelect)[0];
        let otuIds = filterResult.otu_ids;
        let otuLabel = filterResult.otu_labels;
        let sampleValues = filterResult.sample_values
        let topOtu = otuIds.map(function(otuId) {
            return ("OTU " + otuId)
        }).slice(0,10).reverse();
        let topSample = sampleValues.slice(0,10).reverse();

        // Create values for bar plot
        let trace1 = {
            x: topSample,
            y: topOtu,
            type: "bar",
            orientation: "h",
            text: otuLabel    
        };

        let layout1 = {
        };
        
        let data1 = [trace1];
        
        // Plot results
        Plotly.newPlot("bar", data1, layout1);

        // Create values for buble plot
        let trace2 = {
            x: otuIds,
            y: sampleValues,
            type: "bubble",
            text: otuLabel,
            mode: "markers",
            marker: {
                size: sampleValues,
                color: otuIds}
      };
      
        let layout2 = {
            xaxis: {
                title: "OTU ID"
            }
      };

        let data2 = [trace2];
    
        // Plot results
        Plotly.newPlot("bubble", data2, layout2);
    });
};

start();

function optionChanged(Data) {
    graphs(Data);
};
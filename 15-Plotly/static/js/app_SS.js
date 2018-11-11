function buildMetadata(sample) {
  // @TODO: Complete the following function that builds the metadata panel
  
  // Use d3 to select the panel with id of `#sample-metadata`
  var selector = d3.select("#sample-metadata");

  // Use `.html("") to clear any existing metadata
  selector.html("");
  
  // Use `d3.json` to fetch the metadata for a sample 
  d3.json(`/metadata/${sample}`).then(onFulfilled, onRejected);
  
  function onRejected(error) { selector.html("<h3>Data Retrieval Error</h3>")}
  
  // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
  function onFulfilled(data) {
    
    Object.entries(data).forEach(([key, value]) => {
      selector.append('p').text(`${key}: ${value}`)
    })
 
  }
    
} 

function buildCharts(sample) {

    // @TODO: Use `d3.json` to fetch the sample data for the plots
    d3.json(`/samples/${sample}`).then(onFulfilled, onRejected);
    function onRejected(error) {error=> console.log(error)};
  
    function onFulfilled(data) {         
      
      // Create Pie Chart

      //Get top ten for pie chart
      data_sort = Sorter(data.otu_ids, data.otu_labels, data.sample_values);  
      
      const Piece_O_Pie = {
        type: "pie",
        values: data_sort.map(d=>d.sample_values),
        labels: data_sort.map(d=>d.otu_ids)        
      }
      Plotly.newPlot('pie', [Piece_O_Pie])

      
      // Create Bubble Plot  
      const bubbler = {
        type: "scatter",
        mode: "markers",        
        x: data.otu_ids,
        y: data.sample_values,
        marker: {
          size: data.sample_values,
          color: data.otu_ids
        },
        text: data.otu_labels
      };
      const bubbler_layout = {
        
        showlegend: false,
        yaxis: {
        autorange: true,                
        },
        xaxis: {
          title: "Obstro",
          autorange: true
        }
              
      };      
      Plotly.newPlot('bubble', [bubbler], bubbler_layout);
    
    
    
    
    }
    
    
    function Sorter(x, y, z) {
      
      var zipped=[];
      for (let i=0;i<x.length;i++) { 
        zipped.push({otu_ids: x[i], otu_labels: y[i], sample_values: z[i]})
      };      
      
      zipped.sort((a,b)=> a.sample_values - b.sample_values);
      return Sorter = zipped.slice(0,9);
      
    
    }
}



function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();


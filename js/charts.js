function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Create the buildChart function.
function buildCharts(sample) {
  // Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {

    // Create a variable that holds the samples array. 
    var samplesArray = data.samples
    // Create a variable that filters the samples for the object with the desired sample number.
    var nsArray = samplesArray.filter(sampleObj => sampleObj.id == sample)
    console.log(nsArray); 

   // 1. Create a variable that filters the metadata array for the object with the desired sample number.
   var metadata = data.metadata;
   var mdArray = metadata.filter(sampleObj => sampleObj.id == sample)
   // Create a variable that holds the first sample in the array.
   var firstSample = nsArray[0];
   console.log(firstSample);

  // 2. Create a variable that holds the first sample in the metadata array.
  var firstMeta = mdArray[0];
  console.log(firstMeta);
  // Create variables that hold the otu_ids, otu_labels, and sample_values.
  var ids = firstSample.otu_ids;
  var labels = firstSample.otu_labels;
  var values = firstSample.sample_values;

  // 3. Create a variable that holds the washing frequency.
  var wfreq = parseFloat(data.metadata.map(person => person.wfreq));
  console.log(wfreq);

  // Create the yticks for the bar chart.
  var yticks = ids.slice(0,10).map(ids =>  'OTU' + ids).reverse();
  console.log(yticks);

  var barData = [{x: values.slice(0,10).reverse(),
    y: yticks,
    type: "bar",
    orientation: 'h'
  }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      xaxis: {
        range: [0, 150]
      },
      title:'Top 10 Bacteria Cultures Found'
    };

  // Use Plotly to plot the bar data and layout.
  Plotly.newPlot("bar",barData,barLayout);
   
  //1. Create the trace for the bubble chart.
  var bubbleData = [{
    x: ids.slice(0, 10).reverse(),
    y: values.slice(0, 10).reverse(),
    text: labels.slice(0, 10).reverse(),
    
    mode: 'markers',
    marker: {
     color: ids,
     size:  values,
     colorscale: 'Picnic'
    }
     
   }];
 
  // 2. Create the layout for the bubble chart.
  var bubbleLayout = {
    title: 'Bacteria Cultures Per Sample',
    xaxis: {title: 'OTU ID'},
    yaxis: {range: [0, 250]},
    showlegend: false,
    height: 600,
    width: 600
  };

  // Use Plotly to plot the bubble data and layout.
  Plotly.newPlot("bubble", bubbleData, bubbleLayout);


   // 4. Create the trace for the gauge chart.
   var gaugeData = [
    {
      type: "indicator",
      mode: "gauge+number",
      title: { text: "Belly Button Washing Frequency"},
      value: wfreq,
      gauge: { axis: { visible: false, range: [0, 10] }, 
      bar: { color: "indigo"},
      steps: [
        { range: [0, 2], color: "lavenderblush" },
        { range: [2, 4], color: "pink" },
        { range: [4, 6], color: "violet" },
        { range: [6, 8], color: "magenta" },
        { range: [8, 10], color: "mediumvioletred" }
      ], },
      domain: { row: 0, column: 0 }
    } 
  ];
  
  // 5. Create the layout for the gauge chart.
  var gaugeLayout = { 
    width: 375,
    height: 300,
    margin: { t: 20, r: 25, l: 20, b: 15 },
    paper_bgcolor: "lavender",
   
  };
  // 6. Use Plotly to plot the gauge data and layout.
  Plotly.newPlot("gauge", gaugeData, gaugeLayout);

  });
}

// Defining the data source URL
let dataSource = "https://data-source.com/samples.json";

// Fetching JSON data asynchronously
fetch(dataSource)
    .then(response => response.json())
    .then(function(data){
        console.log(data);
        console.log(data.metadata);
        
        // Populating dropdown menu with subject IDs
        generateDropdown(data.samples);

        // Initializing charts with data from the first subject ID
        initializeCharts(data.samples, data.metadata);

        // Event listener for dropdown change
        document.querySelector("#selDataset").addEventListener("change", handleDropdownChange);

        function handleDropdownChange(){
            console.log(`Dropdown change activated`);
            let dropdown = document.querySelector("#selDataset");
            let selectedSubject = dropdown.value;
            // Refreshing panel and charts with new data
            updateData(data.samples, selectedSubject, data.metadata);
        };
    });

// Function to populate the dropdown menu with subject IDs
function generateDropdown(subjects){
    // Looping through samples to add dropdown options
    for (let subject of subjects){
        let option = document.createElement("option");
        option.text = subject.id;
        document.querySelector("#selDataset").appendChild(option);
    };
};

// Function to initialize charts with data from the first individual in the dataset
function initializeCharts(subjects, metadata) {
    loadDemographics(metadata[0]);
    createBarChart(subjects[0]);
    createBubbleChart(subjects[0])
    createGauge(metadata[0]);
};

// Function to load demographics panel
function loadDemographics(individual){
    // Clearing existing data in the demographics panel
    document.querySelectorAll(".panel-body>p").forEach(element => element.remove());

    // Appending key-value pairs to the panel body
    for (let key in individual) {
        let paragraph = document.createElement("p");
        paragraph.textContent = `${key}: ${individual[key]}`;
        document.querySelector(".panel-body").appendChild(paragraph);
    };
};

// Function to update charts and demographics table based on dropdown selection
function updateData(subjects, selectedSubject, metadata){
    // Finding data for the selected subject and updating charts
    for (let subject of subjects){
        if (subject.id == selectedSubject){
            createBarChart(subject);
            createBubbleChart(subject);
            break;
        };
    };
    // Finding metadata for the selected subject and updating demographics panel
    for (let met of metadata){
        if (met.id == selectedSubject){
            loadDemographics(met);
            createGauge(met);
            break;
        };
    };
};

// Function to create a horizontal bar chart with top 10 values
function createBarChart(individual){
    // Defining data for the chart
    const top10IDs = individual.otu_ids.slice(0, 10).map(id => "OTU " + id).reverse();
    const top10Labels = individual.otu_labels.slice(0, 10).reverse();
    const top10Values = individual.sample_values.slice(0, 10).reverse();
    // Trace for the chart with hover text
    let trace = {
        y: top10IDs,
        x: top10Values,
        hovertemplate: '<b>Number of Samples within %{y}:</b> %{x}'+'<br>'+'<b>OTU Organisms:</b>'+'<br>'+'<i>%{text}</i>',
        text: top10Labels,
        type: "bar",
        orientation: 'h',
    };
    // Layout for the chart
    let layout = {
        height: 450,
        width: 600,
    };
    // Plotting the chart
    Plotly.newPlot("bar", [trace], layout);
};

// Function to create a bubble chart
function createBubbleChart(individual){
    // Defining data for the chart
    const otuNumbers = individual.otu_ids;
    const otuLabels = individual.otu_labels;
    const sampleValues = individual.sample_values;
    // Trace for the chart with custom hover text and bubble color
    var trace = {
        x: otuNumbers,
        y: sampleValues,
        hovertemplate: '<b>Number of Samples within OTU:</b> %{y}'+'<br>'+'<b>OTU Organisms:</b>'+'<br>'+'<i>%{text}</i>',
        text: otuLabels,
        mode: 'markers',
        marker: {
            size: sampleValues,
            color: otuNumbers
            }
    };
    // Layout for the chart
    var layout = {
        height: 600,
        width: 1250,
        xaxis: {
            title:{text: "OTU Number"}
        },
        yaxis: {
            title: {text: "Sample Value"}
        }
    };
    // Plotting the chart
    Plotly.newPlot('bubble', [trace], layout);
};

// Function to create a gauge chart for belly button wash frequency
function createGauge(individual){
    var gaugeData = [
        {
        domain: {x:[0,1],y:[0,1]},
        value: individual.wfreq,
        title: {text:"<b>Belly Button Washing Frequency</b><br>Scrubs per Week"},
        type: "indicator",
        mode: "gauge+number",
        gauge: {
            axis:{range:[0,9]},
            bar: { color: "black" },
            steps: [
                { range: [0, 1], color: "#fafa6e" },
                { range: [1,2], color: "#bdea75" },
                { range: [2,3], color: "#86d780"},
                { range: [3,4], color: "#54c18a"},
                { range: [4,5], color: "#23aa8f"},
                { range: [5,6], color: "#00918d"},
                { range: [6,7], color: "#007882"},
                { range:[7,8], color: "#1f5f70"},
                {range: [8,9], color: "#2a4858"}
            ]
        }
    }];
    var layout = {
        height:500,
        width: 400
    };
    // Plotting the gauge chart
    Plotly.newPlot('gauge', gaugeData, layout);
};
// from data.js
var tableData = data;

// YOUR CODE HERE!
var submit = d3.select("#filter-btn");
//var clear = document.querySelector("#reset-btn");

var clear = d3.select("#reset-btn");


clear.on("click", function() {
  // Prevent the page from refreshing
  d3.event.preventDefault();

  console.log("inside punciton");

  //var tbody = d3.select("tbody");
  //var cell = tbody.remove("td");
  //tbody.innerHTML = "";
  location.reload();
  //tbody.reload();
});

//clear.addEventListener("click", handleResetButtonClick);

//function handleResetButtonClick() {
//  var tbody = d3.select("tbody");
//  var cell = tbody.remove("td");
//  tbody.innerHTML = "";
//  location.reload();
//  tbody.reload();
//}



submit.on("click", function() {

  // Prevent the page from refreshing
  d3.event.preventDefault();

  // Select the input element and get the raw HTML node
  var inputElement = d3.select("#datetime");

  // Get the value property of the input element
  var inputValue = inputElement.property("value");

  // Set the span tag in the h1 element to the text
  // that was entered in the form
  d3.select("h1>span").text(inputValue);

  console.log(inputValue + " BlammoH");

  
  var filteredData = tableData.filter(Incident => Incident.datetime === inputValue);

  console.log(filteredData);

     // First, create an array with just the age values
  var dates = filteredData.map(Incident => Incident.datetime);
  // Finally, add the summary stats to the `ul` tag
  
    for (var i = 0; i < dates.length; i++) {    
      var date = dates[i];
      console.log(date);
      
      d3.select(".table table-striped")
        .append("li").text(`Mean: ${date}`);
    };

  var tbody = d3.select("tbody");  
  

  filteredData.forEach(function(UFO_Incident) {

      //console.log(UFO_Incident);
      var row = tbody.append("tr");

      Object.entries(UFO_Incident).forEach(function([key, value]) {
        console.log(Object);
        // Append a cell to the row for each value
        // in the weather report object
        var cell = tbody.append("td");
        cell.text(value);
      });
  });

  
});
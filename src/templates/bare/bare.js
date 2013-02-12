$(function() { //JQuery ready, A function to execute after the DOM is ready.

var chart = []; //temporary storage variable.

//below is a syncronous ajax request that loads in the json at the url specified.
//to view the structure of the loaded chart check the console or json file.

$.ajax({
	url: 'chart.json',
	async: false,
	dataType: 'json',
	success: function(data) {
		chart = data;
	},
	error: function(e,header) {
		console.log(header);
	}
});//close ajax

console.log(chart.title);
console.log(chart.nodes);
console.log(chart.arrows);

//here you can play around with the data structure and create visuals using either JQuery+CSS or RaphaelJS
//Both libraries are included for your convenience.














});//close main
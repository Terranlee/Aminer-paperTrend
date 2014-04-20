$(document).ready(function() {
	console.log("input com");					   
// Here we will write a function when link click under class popup				   
$('a.popup').click(function() {
									


// Now here we need to have our popup box in center of 
// webpage when its fadein. so we add 10px to height and width 
var popuptopmargin =40;
var popupleftmargin = ($('#' + popupid).width() + 10) / 2;


// Then using .css function style our popup box for center allignment
$('#' + popupid).css({
'margin-top' : -popuptopmargin,
'margin-left' : -popupleftmargin
});
});


// Now define one more function which is used to fadeout the 
// fade layer and popup window as soon as we click on fade layer
$('#fade').click(function() {


// Add markup ids of all custom popup box here 


$('#fade , #popuprel , #popuprel2 , #popuprel3').fadeOut(1000,function(){
	d3.select("#trendByYear").classed("hidden",true);
	
})
return false;
});
});

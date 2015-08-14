var primary_gradient = null;
var secondary_gradient = null;
var transition_duration_ms = 1000 * 60;
var number_of_steps = 100;
var step_interval_ms = transition_duration_ms / number_of_steps;
var curr_step = 0;
var window_width = 0;
var window_height = 0;

var current_dayspan = null;
var start_time = null;

function startGradientManager()
{
	current_dayspan = new DaySpan();
	setTimeout("updateState()", 0);
}

function updateState()
{
	var new_dayspan = getCurrentDaySpan();
	if(new_dayspan.id != current_dayspan.id)
	{
		current_dayspan = new_dayspan;
		if(current_dayspan.kind == "static")
		{
			doStatic();
		}
		else if (current_dayspan.kind == "transition")
		{
			doTransition();
		}
	}
	else
	{
		setTimeout("updateState()", 250);
	}
}

function normalize_hsb(h, s, b) {
	var n_h = h / 360;
	var n_s = s / 100;
	var n_b = b / 100;
	
	return {h:n_h, s:n_s, b:n_b};
}

function hsbGradient(steps, colours) {
  var parts = colours.length - 1;
  var gradient = new Array(steps);
  var gradientIndex = 0;
  var partSteps = Math.floor(steps / parts);
  var remainder = steps - (partSteps * parts);
  for (var col = 0; col < parts; col++) {
    // get colours
    var c1 = colours[col], 
        c2 = colours[col + 1];
    // determine clockwise and counter-clockwise distance between hues
    var distCCW = (c1.h >= c2.h) ? c1.h - c2.h : 1 + c1.h - c2.h;
        distCW = (c1.h >= c2.h) ? 1 + c2.h - c1.h : c2.h - c1.h;
     // ensure we get the right number of steps by adding remainder to final part
    if (col == parts - 1) partSteps += remainder; 
    // make gradient for this part
    for (var step = 0; step < partSteps; step ++) {
      var p = step / partSteps;
      // interpolate h, s, b
      var h = (distCW <= distCCW) ? c1.h + (distCW * p) : c1.h - (distCCW * p);
      if (h < 0) h = 1 + h;
      if (h > 1) h = h - 1;
      var s = (1 - p) * c1.s + p * c2.s;
      var b = (1 - p) * c1.b + p * c2.b;
      // add to gradient array
      gradient[gradientIndex] = {h:h, s:s, b:b};
      gradientIndex ++;
    }
  }
  return gradient;
}

/** 
* Converts HSV to RGB value. 
* 
* @param {Integer} h Hue as a value between 0 - 360 degrees 
* @param {Integer} s Saturation as a value between 0 - 100 % 
* @param {Integer} v Value as a value between 0 - 100 % 
* @returns {Array} The RGB values  EG: [r,g,b], [255,255,255] 
*/  
function hsvToRgb(h,s,v) {  
  
    var s = s / 100,  
         v = v / 100;  
  
    var hi = Math.floor((h/60) % 6);  
    var f = (h / 60) - hi;  
    var p = v * (1 - s);  
    var q = v * (1 - f * s);  
    var t = v * (1 - (1 - f) * s);  
  
    var rgb = [];  
  
    switch (hi) {  
        case 0: rgb = [v,t,p];break;  
        case 1: rgb = [q,v,p];break;  
        case 2: rgb = [p,v,t];break;  
        case 3: rgb = [p,q,v];break;  
        case 4: rgb = [t,p,v];break;  
        case 5: rgb = [v,p,q];break;  
    }  
  
    var r = Math.min(255, Math.round(rgb[0]*256)),  
        g = Math.min(255, Math.round(rgb[1]*256)),  
        b = Math.min(255, Math.round(rgb[2]*256));  
  
    return [r,g,b];  
}


/** 
* Converts RGB to HSV value. 
* 
* @param {Integer} r Red value, 0-255 
* @param {Integer} g Green value, 0-255 
* @param {Integer} b Blue value, 0-255 
* @returns {Array} The HSV values EG: [h,s,v], [0-360 degrees, 0-100%, 0-100%] 
*/  
function rgbToHsv(r, g, b) {  
  
    var r = (r / 255),  
         g = (g / 255),  
     b = (b / 255);   
  
    var min = Math.min(Math.min(r, g), b),  
        max = Math.max(Math.max(r, g), b),  
        delta = max - min;  
  
    var value = max,  
        saturation,  
        hue;  
  
    // Hue  
    if (max == min) {  
        hue = 0;  
    } else if (max == r) {  
        hue = (60 * ((g-b) / (max-min))) % 360;  
    } else if (max == g) {  
        hue = 60 * ((b-r) / (max-min)) + 120;  
    } else if (max == b) {  
        hue = 60 * ((r-g) / (max-min)) + 240;  
    }  
  
    if (hue < 0) {  
        hue += 360;  
    }  
  
    // Saturation  
    if (max == 0) {  
        saturation = 0;  
    } else {  
        saturation = 1 - (min/max);  
    }  
  
    return [Math.round(hue), Math.round(saturation * 100), Math.round(value * 100)];  
}

function updateBackgroundColor(element, rgb_p, rgb_s, curr_brightness)
{
	bg = 'background-color:rgb(' + rgb_p[0] + ',' + rgb_p[1] + ',' + rgb_p[2] + ')';
	wk = 'background-image:-webkit-linear-gradient(top, rgb(' + rgb_p[0] + ',' + rgb_p[1] + ',' + rgb_p[2] + '), rgb(' + rgb_s[0] + ',' + rgb_s[1] + ',' + rgb_s[2] + '))';
	moz = 'background-image:-moz-linear-gradient(top, rgb(' + rgb_p[0] + ',' + rgb_p[1] + ',' + rgb_p[2] + '), rgb(' + rgb_s[0] + ',' + rgb_s[1] + ',' + rgb_s[2] + '))';
	opera = 'background-image:-o-linear-gradient(top, rgb(' + rgb_p[0] + ',' + rgb_p[1] + ',' + rgb_p[2] + '), rgb(' + rgb_s[0] + ',' + rgb_s[1] + ',' + rgb_s[2] + '))';
	ie = 'background-image:-ms-linear-gradient(top, rgb(' + rgb_p[0] + ',' + rgb_p[1] + ',' + rgb_p[2] + '), rgb(' + rgb_s[0] + ',' + rgb_s[1] + ',' + rgb_s[2] + '))';
	
	$(element).attr('style', 'display:block;background-attachment:fixed;' + bg + ';' + wk + ';' + moz + ';' + opera + ';' + ie);
	random_color = 'black';
	if(curr_brightness <= 50)
	{
		random_color = 'white';
	}
	$('#random_link').attr('style', 'color:' + random_color);
}

function doStatic()
{	
	var rgb_p = hsvToRgb(current_dayspan.start_primary_color.h, current_dayspan.start_primary_color.s, current_dayspan.start_primary_color.b);
	var rgb_s = hsvToRgb(current_dayspan.start_secondary_color.h, current_dayspan.start_secondary_color.s, current_dayspan.start_secondary_color.b);
				
	updateBackgroundColor('#bg', rgb_p, rgb_s, current_dayspan.start_primary_color.b);
	setTimeout("updateState()", 250);
}

function doTransition()
{	
	var start_primary = normalize_hsb(current_dayspan.start_primary_color.h,
		 							  current_dayspan.start_primary_color.s,
									  current_dayspan.start_primary_color.b);
	var end_primary = normalize_hsb(current_dayspan.end_primary_color.h,
							 		current_dayspan.end_primary_color.s,
									current_dayspan.end_primary_color.b);

	var start_secondary = normalize_hsb(current_dayspan.start_secondary_color.h,
										current_dayspan.start_secondary_color.s,
										current_dayspan.start_secondary_color.b);
	var end_secondary = normalize_hsb(current_dayspan.end_secondary_color.h,
									  current_dayspan.end_secondary_color.s,
									  current_dayspan.end_secondary_color.b);
									
	transition_duration_ms = current_dayspan.duration();
	step_interval_ms = Math.round(transition_duration_ms / number_of_steps);							
	elapsed_steps = Math.round((new Date().getTime() - current_dayspan.start_time.getTime()) / step_interval_ms);
	
	primary_gradient = hsbGradient(number_of_steps, [start_primary, end_primary]);
	secondary_gradient = hsbGradient(number_of_steps, [start_secondary, end_secondary]);
	
	setTimeout("doTransitionStep()", 0);
}

function doTransitionStep()
{
	if(elapsed_steps < number_of_steps)
	{	
		if(elapsed_steps <= 0) elapsed_steps = 1;
		var h_p = primary_gradient[elapsed_steps-1]['h'] * 360;
		var s_p = primary_gradient[elapsed_steps-1]['s'] * 100;
		var b_p = primary_gradient[elapsed_steps-1]['b'] * 100;

		var h_s = secondary_gradient[elapsed_steps-1]['h'] * 360;
		var s_s = secondary_gradient[elapsed_steps-1]['s'] * 100;
		var b_s = secondary_gradient[elapsed_steps-1]['b'] * 100;

		var rgb_p = hsvToRgb(h_p, s_p, b_p);
		var rgb_s = hsvToRgb(h_s, s_s, b_s);
		
		updateBackgroundColor('#bg', rgb_p, rgb_s, b_p);
		elapsed_steps++;
		setTimeout("doTransitionStep()", step_interval_ms);
	}
	else
	{
		var h_p = primary_gradient[primary_gradient.length-1]['h'] * 360;
		var s_p = primary_gradient[primary_gradient.length-1]['s'] * 100;
		var b_p = primary_gradient[primary_gradient.length-1]['b'] * 100;

		var h_s = secondary_gradient[secondary_gradient.length-1]['h'] * 360;
		var s_s = secondary_gradient[secondary_gradient.length-1]['s'] * 100;
		var b_s = secondary_gradient[secondary_gradient.length-1]['b'] * 100;

		var rgb_p = hsvToRgb(h_p, s_p, b_p);
		var rgb_s = hsvToRgb(h_s, s_s, b_s);
		
		updateBackgroundColor('#bg', rgb_p, rgb_s, b_p);
		elapsed_steps++;
		setTimeout("doTransitionStep()", step_interval_ms);
	}
}
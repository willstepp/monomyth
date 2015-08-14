function DaySpan() {
  this.id = -1;
  this.start_time = new Date();
  this.end_time = new Date();
  this.start_primary_color = {};
  this.end_primary_color = {};
  this.start_secondary_color = {};
  this.end_secondary_color = {};
  this.kind = "";

  this.containsTime = function(time)
  {
	return (time.getTime() >= this.start_time.getTime()) && (time.getTime() <= this.end_time.getTime());
  }

  this.duration = function()
  {
	return this.end_time.getTime() - this.start_time.getTime();
  }
}

var day_spans = new Array(7);

function getCurrentDaySpan()
{
	var time = new Date();
	for(ds = 0; ds < 7; ds++)
	{
		if (day_spans[ds].containsTime(time)) 
		{
			return day_spans[ds];
		}	
	}
}


//SUNRISE
//================================================
var sunrise = new DaySpan();
sunrise.id = 0;
sunrise.kind = "transition";

//5:30:01am
sunrise.start_time.setHours(5);
sunrise.start_time.setMinutes(30);
sunrise.start_time.setSeconds(1);

//7:00:00am
sunrise.end_time.setHours(7);
sunrise.end_time.setMinutes(0);
sunrise.end_time.setSeconds(0);

//start: night
sunrise.start_primary_color = {h:222,s:100,b:18};
sunrise.start_secondary_color = {h:0,s:0,b:6};

//end: sunrise
sunrise.end_primary_color = {h:199,s:23,b:69};
sunrise.end_secondary_color = {h:357,s:16,b:87};

day_spans[0] = sunrise;



//MORNING
//================================================
var morning = new DaySpan();
morning.id = 1;
morning.kind = "transition";

//7:00:01am
morning.start_time.setHours(7);
morning.start_time.setMinutes(0);
morning.start_time.setSeconds(1);

//11:00:00am
morning.end_time.setHours(11);
morning.end_time.setMinutes(0);
morning.end_time.setSeconds(0);

//start: sunrise
morning.start_primary_color = {h:199,s:23,b:69};
morning.start_secondary_color = {h:357,s:16,b:87};

//end: day
morning.end_primary_color = {h:213,s:73,b:97};
morning.end_secondary_color = {h:213,s:0,b:100};

day_spans[1] = morning;



//DAY
//================================================
var day = new DaySpan();
day.id = 2;
day.kind = "static";

//11:00:01am
day.start_time.setHours(11);
day.start_time.setMinutes(0);
day.start_time.setSeconds(1);

//4:00:00pm
day.end_time.setHours(17);
day.end_time.setMinutes(0);
day.end_time.setSeconds(0);

//start: day
day.start_primary_color = {h:213,s:73,b:97};
day.start_secondary_color = {h:213,s:0,b:100};

day_spans[2] = day;



//SUNSET
//================================================
var sunset = new DaySpan();
sunset.id = 3;
sunset.kind = "transition";

//5:00:01pm
sunset.start_time.setHours(17);
sunset.start_time.setMinutes(0);
sunset.start_time.setSeconds(1);

//8:00:00pm
sunset.end_time.setHours(20);
sunset.end_time.setMinutes(0);
sunset.end_time.setSeconds(0);

//start: day
sunset.start_primary_color = {h:213,s:73,b:97};
sunset.start_secondary_color = {h:213,s:0,b:100};

//end: sunset
sunset.end_primary_color = {h:221,s:19,b:51};
sunset.end_secondary_color = {h:29,s:43,b:53};

day_spans[3] = sunset;



//NIGHTFALL
//================================================
var nightfall = new DaySpan();
nightfall.id = 4;
nightfall.kind = "transition";

//8:00:01pm
nightfall.start_time.setHours(20);
nightfall.start_time.setMinutes(0);
nightfall.start_time.setSeconds(1);

//9:00:00pm
nightfall.end_time.setHours(21);
nightfall.end_time.setMinutes(0);
nightfall.end_time.setSeconds(0);

//start: sunset
nightfall.start_primary_color = {h:221,s:19,b:51};
nightfall.start_secondary_color = {h:29,s:43,b:53};

//end: night
nightfall.end_primary_color = {h:222,s:100,b:18};
nightfall.end_secondary_color = {h:0,s:0,b:6};

day_spans[4] = nightfall;


//NIGHT_ONE
//================================================
var night_one = new DaySpan();
night_one.id = 5;
night_one.kind = "static";

//9:00:01pm
night_one.start_time.setHours(21);
night_one.start_time.setMinutes(0);
night_one.start_time.setSeconds(1);

//11:59:59pm
night_one.end_time.setHours(23);
night_one.end_time.setMinutes(59);
night_one.end_time.setSeconds(59);

//start: night_one
night_one.start_primary_color = {h:222,s:100,b:25};
night_one.start_secondary_color = {h:0,s:0,b:15};

day_spans[5] = night_one;


//NIGHT_TWO
//================================================
var night_two = new DaySpan();
night_two.id = 6;
night_two.kind = "static";

//12:00:00am
night_two.start_time.setHours(0);
night_two.start_time.setMinutes(0);
night_two.start_time.setSeconds(0);

//5:30:00am
night_two.end_time.setHours(5);
night_two.end_time.setMinutes(30);
night_two.end_time.setSeconds(0);

//start: night_two
night_two.start_primary_color = {h:222,s:100,b:25};
night_two.start_secondary_color = {h:0,s:0,b:15};

day_spans[6] = night_two;
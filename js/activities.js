function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
	var completedTweets = tweet_array.filter(function(t) {
		return t.source == "completed_event";
	});
	
	var counts = {};
	completedTweets.forEach(function(t) {
		var type = t.activityType;
		if (counts[type] == undefined) {
			counts[type] = 0;
		}
		counts[type] = counts[type] + 1;
	});
	
	document.getElementById('numberActivities').innerText = Object.keys(counts).length;

	var countList = Object.entries(counts);
	countList.sort(function(a, b) {
		return b[1] - a[1];
	});

	var top1 = countList[0][0];
	var top2 = countList[1][0];
	var top3 = countList[2][0];

	document.getElementById('firstMost').innerText = top1;
	document.getElementById('secondMost').innerText = top2;
	document.getElementById('thirdMost').innerText = top3;

	function averageDistance(type) {
		var matching = completedTweets.filter(function(t) {
			return t.activityType == type;
		});
		var total = 0;
		matching.forEach(function(t) {
			total = total + t.distance;
		});
		return total / matching.length;
	}

	var longest = top1;
	if (averageDistance(top2) > averageDistance(longest)) {
		longest = top2;
	}
	if (averageDistance(top3) > averageDistance(longest)) {
		longest = top3;
	}

	var shortest = top1;
	if (averageDistance(top2) < averageDistance(shortest)) {
		shortest = top2;
	}
	if (averageDistance(top3) < averageDistance(shortest)) {
		shortest = top3;
	}

	document.getElementById('longestActivityType').innerText = longest;
	document.getElementById('shortestActivityType').innerText = shortest;

	var topTweets = completedTweets.filter(function(t) {
		return t.activityType == top1 || t.activityType == top2 || t.activityType == top3;
	});

	var weekdayTotal = 0;
	var weekdayCount = 0;
	var weekendTotal = 0;
	var weekendCount = 0;

	topTweets.forEach(function(t) {
		var day = t.time.getDay();
		if (day == 0 || day == 6) {
			weekendTotal = weekendTotal + t.distance;
			weekendCount = weekendCount + 1;
		} else {
			weekdayTotal = weekdayTotal + t.distance;
			weekdayCount = weekdayCount + 1;
		}
	});

	var weekdayAvg = weekdayTotal / weekdayCount;
	var weekendAvg = weekendTotal / weekendCount;

	if (weekendAvg > weekdayAvg) {
		document.getElementById('weekdayOrWeekendLonger').innerText = "weekends";
	} else {
		document.getElementById('weekdayOrWeekendLonger').innerText = "weekdays";
	}

	var chartData = [];
	countList.forEach(function(item) {
		chartData.push({ "activity": item[0], "count": item[1] });
	});

	activity_vis_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A graph of the number of Tweets containing each type of activity.",
		"data": {
		  "values": chartData
		},
		"mark": "bar",
		"encoding": {
		  "x": {"field": "activity", "type": "nominal", "sort": "-y"},
		  "y": {"field": "count", "type": "quantitative"}
		}
	  };

	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});
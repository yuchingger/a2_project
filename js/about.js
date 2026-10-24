function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;

	var sorted = tweet_array.slice().sort(function(a, b) {
		return a.time - b.time;
	});

	var earliest = sorted[0].time;
	var latest = sorted[sorted.length - 1].time;
	var dateOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
	document.getElementById('firstDate').innerText = earliest.toLocaleDateString("en-US", dateOptions);
	document.getElementById('lastDate').innerText = latest.toLocaleDateString("en-US", dateOptions);
	var total = tweet_array.length;

	// completed
	var completed = tweet_array.filter(function(t) { return t.source == "completed_event"; }).length;
	setClassText("completedEvents", completed);
	setClassText("completedEventsPct", math.format(completed / total * 100, {notation: "fixed", precision: 2}) + "%");

	// live
	var live = tweet_array.filter(function(t) { return t.source == "live_event"; }).length;
	setClassText("liveEvents", live);
	setClassText("liveEventsPct", math.format(live/ total * 100, {notation: "fixed", precision: 2}) + "%");

	// achievements
	var achievements = tweet_array.filter(function(t) { return t.source == "achievement"; }).length;
	setClassText("achievements", achievements);
	setClassText("achievementsPct", math.format(achievements / total * 100, {notation: "fixed", precision: 2}) + "%");

	// miscellaneous
	var miscellaneous = tweet_array.filter(function(t) { return t.source == "miscellaneous"; }).length;
	setClassText("miscellaneous", miscellaneous);
	setClassText("miscellaneousPct", math.format(miscellaneous / total * 100, {notation: "fixed", precision: 2}) + "%");

	// (written / writtenPct: tomorrow)
	var written = tweet_array.filter(function(t) {
		return t.source == "completed_event" && t.written;
	}).length;
	setClassText("written", written);
	setClassText("writtenPct", math.format(written / completed * 100, {notation: "fixed", precision: 2}) + "%");
}

function setClassText(className, value) {
	var elements = document.querySelectorAll("." + className);
	elements.forEach(function(el) {
		el.innerText = value;
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});
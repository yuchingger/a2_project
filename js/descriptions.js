var writtenTweets = [];

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	//TODO: Filter to just the written tweets
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	writtenTweets = tweet_array.filter(function(t) {
		return t.written;
	});
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	var searchBox = document.getElementById('textFilter');
	searchBox.addEventListener('input', function() {
		var searchText = searchBox.value;
		var table = document.getElementById('tweetTable');

		document.getElementById('searchText').innerText = searchText;
		if (searchText == "") {
			table.innerHTML = "";
			document.getElementById('searchCount').innerText = 0;
			return;
		}

		var matches = writtenTweets.filter(function(t) {
			return t.writtenText.toLowerCase().includes(searchText.toLowerCase());
		});

		var rows = "";
		matches.forEach(function(t, i) {
			rows = rows + t.getHTMLTableRow(i + 1);
		});
		table.innerHTML = rows;
		document.getElementById('searchCount').innerText = matches.length;
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});
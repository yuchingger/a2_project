class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.

        // completed tweets
        if (this.text.startsWith("Just completed") || this.text.startsWith("Just posted")) {
            return "completed_event";
        }

        // live tweets
        if (this.text.startsWith("Watch my")) {
            return "live_event";
        }

        // achievement tweets
        if (this.text.startsWith("Achieved") || this.text.includes("____")) {
            return "achievement";
        }

        return "miscellaneous";
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        //TODO: identify whether the tweet is written
        if (this.text.includes("Check it out!")) {
            return false;
        }
        return true;
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        //TODO: parse the written text from the tweet
        var text = this.text;
        var linkIndex = text.indexOf("https://");
        if (linkIndex != -1) {
            text = text.substring(0, linkIndex);
        }

        text = text.replace("#Runkeeper", "");
        var dashIndex = text.indexOf(" - ");
        if (dashIndex != -1) {
            text = text.substring(dashIndex + 3);
        }
        return text.trim();
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }

        //TODO: parse the activity type from the text of the tweet
        var text = this.text;
        var kmIndex = text.indexOf(" km ");
        var miIndex = text.indexOf(" mi ");

        var start:number;
        if (kmIndex != -1) {
            start = kmIndex + 4;
        } else if (miIndex != -1) {
            start = miIndex + 4;
        } else {
            start = text.indexOf(" a ") + 3;
        }

        var end = text.indexOf(" ", start);
        return text.substring(start, end);
    }


    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        var text = this.text;
        var kmIndex = text.indexOf(" km ");
        var miIndex = text.indexOf(" mi ");
        var start = text.indexOf(" a ") + 3;

        if (kmIndex != -1) {
            var km = parseFloat(text.substring(start, kmIndex));
            return km / 1.609;
        }

        if (miIndex != -1) {
            return parseFloat(text.substring(start, kmIndex));
        }

        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}
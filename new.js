const request = require('request');

var url = {deals: 'https://api.pipedrive.com/v1/deals', activities: 'activities', startBlurb: '?start=0&api_token='};
var apiToken = '07c87355d3f195c4b1bbfa6419456b620b575d05';

// This function calls the api and gets all the deals that are in stage 2, i.e. "Application" stage.
function getDeals (stage, callback) {
   // This is the url that is used for api calls concerning deals. 
    request(url.deals + url.startBlurb + apiToken, function (error, response, body) {
        var parse = JSON.parse(body);
        var data = parse.data;
        var stageDeals = [];
        
        if (error) {
            return console.log('error');
        }

        // If the deal's stage_id is equal to 2, the DEAL id is pushed to an array. This allows us to track which deals are in stage 2.
        for (var i in data) {
            if (data[i].stage_id === stage) {
                stageDeals.push(data[i].id);
            }
        }

        // This callback allows us to use the stageDeals array in another function.
        callback (stageDeals);
    });
}

/* This function calls uses the stageDeals array to get all the activities associated with those particular deals. It iterates through
the array and pulls all the activities for each one. It is then supposed to see if any of a specific deal's Activities have a subject
that matches '4506-T'. If that specific deal has an activity with a subject of '4506-T'... it should log that deal's id to the console.
But... it doesn't work. */
getDeals (2, function getActivities (stageDeals) {
    console.log(stageDeals);

    // For each deal in the stageDeals array...
    for (var i in stageDeals) {
        // This is the url that is used for api calls concerning activities associated with a certain deal.
        
        console.log(url.deals + '/' + stageDeals[i] + '/' + url.activities + url.startBlurb + apiToken);
        request(url.deals + '/' + stageDeals[i] + '/' + url.activities + url.startBlurb + apiToken, function (error, response, body) {
            var parse = JSON.parse(body);
            var data = parse.data;

            if (error) {
                return console.log('error');
            }

            console.log(data);
            
            /*
            // Loop through all the activities associated with this deal.
            for (var i in data) {
                // Console log the subjects of all the activies.
                console.log(data[i].subject);
                
                // If ANY of the activities associated with this deal have a subject of '4506-T'.
                if (data[i].subject === '4506-T') {
                    // Log the id of this deal to the console...
                    // Correct answer here is 21. But the console reads 23... wut?
                    console.log (stageDeals[i]);
                }
            }*/
        }); 
    }
});

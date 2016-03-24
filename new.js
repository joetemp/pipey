const request = require('request');

var url = {deals: 'https://api.pipedrive.com/v1/deals', activities: 'activities', startBlurb: '?start=0&api_token='};
var apiToken = '07c87355d3f195c4b1bbfa6419456b620b575d05';

function getDeals (stage, callback) {
    
    request(url.deals + url.startBlurb + apiToken, function (error, response, body) {
        var parse = JSON.parse(body);
        var data = parse.data;
        var stageDeals = [];
        
        if (error) {
            return console.log('error');
        }

        for (var i in data) {
            if (data[i].stage_id === stage) {
                stageDeals.push(data[i].id);
            }
        }

        callback (stageDeals);
    });
}

getDeals (2, function getActivities (stageDeals) {
    console.log(stageDeals);

    for (var i in stageDeals) {
        request(url.deals + '/' + stageDeals[i] + '/' + url.activities + url.startBlurb + apiToken, function (error, response, body) {
            var parse = JSON.parse(body);
            var data = parse.data;

            if (error) {
                return console.log('error');
            }

            for (var i in data) {
                console.log(data[i].subject);
                
                if (data[i].subject === '4506-T') {
                    // Correct answer here is 21.
                    console.log (stageDeals[i]);
                }
            }
        }); 
    }
});

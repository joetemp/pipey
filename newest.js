const request = require('request');

var url = {deals: 'https://api.pipedrive.com/v1/deals?start=0&api_token=07c87355d3f195c4b1bbfa6419456b620b575d05', 
           activities: 'https://api.pipedrive.com/v1/activities?start=0&api_token=07c87355d3f195c4b1bbfa6419456b620b575d05'};

function getDeals (url, key, value, callback) {
    
    request(url, function (error, response, body) {
        if (error) {
            return console.log(error);
        }  

        var parse = JSON.parse(body).data;
        
        callback(parse);
    });
}

getDeals (url.deals, 'stage_id', 2, function (deals) {

    getDeals (url.activities, 'subject', '4506-T', function (activities) {

        var stageDeals = [];

        for (var i in deals) {
            if (deals[i].stage_id === 2) {
                stageDeals.push(deals[i].id);
            }
        }

        for (var j in stageDeals) {
            
            for (var i in activities) {
            
                if (activities[i].subject === '4506-T' && stageDeals[j] === activities[i].deal_id) {
                    // Delete the deal from the array.
                    stageDeals.splice(j, 1);

                    console.log('we got one');
                }
            }
        }

        console.log(stageDeals);
    
    });

}); 

const request = require('request');

var url = {deals: 'https://api.pipedrive.com/v1/deals?start=0&api_token=e91945ca2b414d0a57cb2ea9d72308d2e4b518ed', 
           activities: 'https://api.pipedrive.com/v1/activities?start=0&api_token=e91945ca2b414d0a57cb2ea9d72308d2e4b518ed'};

function getDeals (url, callback) {
    
    request(url, function (error, response, body) {
        if (error) {
            return console.log(error);
        }  

        var parse = JSON.parse(body).data;
        
        callback(parse);
    });
}

getDeals (url.deals, function (deals) {

    getDeals (url.activities, function (activities) {

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
                }
            }
        }

        // These are all the deals that are in stage 2 that NEED a 4506-T activity.
        // console.log(stageDeals);

        addActivities(stageDeals);
    });
}); 

function addActivities(stageDeals) {

    for (var i in stageDeals) {
        console.log(stageDeals[i]);
        
        request.post('https://api.pipedrive.com/v1/activities?api_token=e91945ca2b414d0a57cb2ea9d72308d2e4b518ed', {
            form: {'subject': '4506-T',
                    'deal_id': stageDeals[i]}});

    }
    
    
    /*
    console.log(stageDeals);

    console.log(Date());

    request.post('https://api.pipedrive.com/v1/activities?api_token=e91945ca2b414d0a57cb2ea9d72308d2e4b518ed', {
        form: {'subject': 'fuck off'}});
    */
};



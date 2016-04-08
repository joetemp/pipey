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

        var applications = [];

        for (var i in deals) {
            // If the stage_id is 2, put the deal in the applications array.
            if (deals[i].stage_id === 2) {
                applications.push(deals[i].id);
            }
        }

        for (var j in applications) {
            
            for (var i in activities) {
            
                if (activities[i].subject === 'Foo' && applications[j] === activities[i].deal_id) {
                    // Delete the deal from the applications array IF it already has a 'Foo' activity.
                    applications.splice(j, 1);
                }
            }
        }

        addActivities(applications);
    });
}); 

function addActivities(applications) {

    for (var i in applications) {
        request.post('https://api.pipedrive.com/v1/activities?api_token=e91945ca2b414d0a57cb2ea9d72308d2e4b518ed', {
            form: {'subject': 'Foo',
                    'deal_id': applications[i]}});
    }

    /* These are all the deals in the 'applications' array. If they are in this array, they should be in stage 2 and NOT already have a
    'Foo' activity. Once this program is run... there should be NO items in this array. */
    console.log(applications);

};



const request = require('request-promise');
const set4506T = require('./4506T.js');
const set1003 = require('./1003.js'); 

var API_KEY = process.env.API_KEY;

var urls = { deals: 'https://api.pipedrive.com/v1/deals?start=0&api_token=' + API_KEY,
             activities: 'https://api.pipedrive.com/v1/activities?start=0&api_token=' + API_KEY };

function getIt (url) {
    return request(url).then(function (body) {
        return JSON.parse(body).data;
    });
} 

Promise.all([getIt(urls.deals), getIt(urls.activities)]).then(function(results) {

    var deals = results[0] || [];
    var activities = results[1] || [];

    var realDeals = {};

    // Custom Fields
    var type = '33eb86af817c62123047fc43d6afe908adbd203d';


    // Go through deals, see which ones are in stage 2 ie 'Applications' AND have a type of '1' ie 'Real Deal'.                                                                                             
    deals.forEach(function(deal) {
        if (deal.stage_id === 2 && deal[type] === '1') {
            realDeals[deal.id] = deal; 
        }   
    });

    set4506T(API_KEY, deals, activities, realDeals);
    set1003(API_KEY, deals, activities, realDeals);

}).then(function(){
// do more stuff here.
});

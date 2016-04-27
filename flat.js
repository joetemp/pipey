const request = require('request-promise');
const test4506T = require('./4506T.js');

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
    var has1003 = {};

    // Custom Fields
    var type = '33eb86af817c62123047fc43d6afe908adbd203d';


    // Go through deals, see which ones are in stage 2.                                                                                             
    deals.forEach(function(deal) {
        if (deal[type] === '1' && deal.stage_id === 2) {
            realDeals[deal.id] = deal; 
        }   
    });


    test4506T(API_KEY, deals, activities, realDeals);

    activities.forEach(function(activity){
	if (activity.subject === '4506-T') {
	    has4506T[activity.deal_id] = activity; 
	} else if (activity.subject === 'HMC Signed 1003') {
            has1003[activity.deal_id] = activity;     
        }
    });

    var diff1003 = Object.keys(realDeals).filter(function(realDeal) {
        return (Object.keys(has1003).indexOf(realDeal) === -1); 
    });

    var realDealNeeds1003 = diff1003.map(function(item){
        return Number(item);  
    });

}).then(function(){
// do more stuff here.
});

const request = require('request-promise');
const moment = require('moment');
const moduleTest = require('./module_test.js');
const test4506T = require('./test4506T.js');
moment().format();

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

    test4506T(deals, activities, realDeals);

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

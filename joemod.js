const request = require('request-promise');
const moment = require('moment');
moment().format();

var API_KEY = process.env.API_KEY;

var urls = { deals: 'https://api.pipedrive.com/v1/deals?start=0&api_token=' + API_KEY,
             activities : 'https://api.pipedrive.com/v1/activities?start=0&api_token=' + API_KEY };

function getIt (url) {
    return request(url).then(function (body) {
        return JSON.parse(body).data; 
    });
}

// I need to set a proper due date in here.
function add (i) {
    return request.post('https://api.pipedrive.com/v1/activities?api_token=' +  API_KEY, {    
        form: {'subject': '4506-T',
               'deal_id': i}});
}

Promise.all([getIt(urls.deals), getIt(urls.activities)]).then(function(results) {
    var deals = results[0];
    var activities = results[1];
    
    // This creates a var called 'applications' and fills it with deal objects that have a stage_id of '2'. 
    var applications = deals.filter(function(deal) {
        return (deal.stage_id === 2);
    });
    
    // This creates a var called 'alreadyHave4506T' and fills it with activity objects that have a subject of '4506-T'.
    var alreadyHave4506T = activities.filter(function(activity) {
        return (activity.subject === '4506-T');
    });
    
    var stillNeeds4506T = applications.filter(function(application) {
        return (alreadyHave4506T.indexOf(application) === -1);
    });
    
    return Promise.all(stillNeeds4506T.map(function(item) {
        return add(item.id);
    }));

}).then(function(responses) {
    // all have now been added
});
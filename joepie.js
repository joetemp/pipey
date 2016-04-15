const request = require('request-promise');
const moment = require('moment');
moment().format();

var urls = { deals: 'https://api.pipedrive.com/v1/deals?start=0&api_token=bef43f201c79aa429455af68983030311c6e753a',
             activities : 'https://api.pipedrive.com/v1/activities?start=0&api_token=bef43f201c79aa429455af68983030311c6e753a' };

function getIt (url) {
    return request(url).then(function (body) {
        return JSON.parse(body).data; 
    });
}

// I need to set a proper due date in here.
function add (i) {
    return request.post('https://api.pipedrive.com/v1/activities?api_token=bef43f201c79aa429455af68983030311c6e753a', {    
        form: {'subject': '4506-T',
               'deal_id': i}});
}

Promise.all([getIt(urls.deals), getIt(urls.activities)]).then(function(results) {
    var deals = results[0];
    var activities = results[1];
    
    var applications = deals.filter(function(deal) {
        return (deal.stage_id === 2);
    });
    
    var alreadyHave4506T = activities.filter(function(activity) {
        console.log(applications);
        return (activity.subject === '4506-T');
    });
    
    var stillNeeds4506T = applications.filter(function(application) {
        return (alreadyHave4506T.indexOf(application) === -1);
    });
    
    return Promise.all(stillNeeds4506T.map(function(item) {
        //console.log(stillNeeds4506T);
        return add(item.id);
    }));
}).then(function(responses) {
    // all have now been added
});

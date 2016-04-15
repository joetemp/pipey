const request = require('request-promise');
const moment = require('moment');
moment().format();

var urls = { deals: 'https://api.pipedrive.com/v1/deals?start=0&api_token=bef43f201c79aa429455af68983030311c6e753a',
             activities : 'https://api.pipedrive.com/v1/activities?start=0&api_token=bef43f201c79aa429455af68983030311c6e753a' };

var applications = []; 
var alreadyHave4506T = []; 
var stillNeeds4506T = []; 

function getIt (url) {
    return request(url).then(function (body) {
        return JSON.parse(body).data; 
    });
}

function inStageTwo (deal) {
    if (deal.stage_id === 2) {
        applications.push(deal.id);
    }   
}

function has4506T (activity) {
    if (activity.subject === '4506-T') {
        alreadyHave4506T.push(activity.deal_id);  
    }   
}

function compare (id) {
    if (alreadyHave4506T.indexOf(id) === -1) {
        stillNeeds4506T.push(id)
    }
}

// I need to set a proper due date in here.
function add (i) {
    request.post('https://api.pipedrive.com/v1/activities?api_token=bef43f201c79aa429455af68983030311c6e753a', {    
        form: {'subject': '4506-T',
               'deal_id': i}});
}

Promise.all([getIt(urls.deals), getIt(urls.activities)]).then(function(results) {
    var deals = results[0];
    var activities = results[1];

    deals.forEach(inStageTwo);

    // #1 - Deals in stage 2.
    console.log(applications);

    activities.forEach(has4506T);

    // #2 - Deals that already have a 4506T activity
    console.log(alreadyHave4506T);

}).then(function(){

    applications.forEach(compare);

    // #3 - Deals that still need 4506T activity
    console.log(stillNeeds4506T);

    stillNeeds4506T.forEach(add);
});

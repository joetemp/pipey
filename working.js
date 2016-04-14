const request = require('request-promise');
const moment = require('moment');
moment().format();

var urls = { deals: 'https://api.pipedrive.com/v1/deals?start=0&api_token=800b3b1ce3b3d06db9d7031758f332b480d45a27',
             activities : 'https://api.pipedrive.com/v1/activities?start=0&api_token=800b3b1ce3b3d06db9d7031758f332b480d45a27' };

var applications = []; 
var appsJson = {};
appsJson.apps = [];
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
        
        var dealId = 'deal' + deal.id;

        appsJson.apps.push({'id' : deal.id,
                      'add_time' : deal.add_time});
    }   
}

function pussy() {
    console.log('wet');
}

function has4506T (activity) {
    if (activity.subject === '4506-T') {
        alreadyHave4506T.push(activity.deal_id);  
    }   
}

function compare (i) {
    if (alreadyHave4506T.indexOf(i) === -1) {
        stillNeeds4506T.push(i)
    }
}

function add (i) {
    request.post('https://api.pipedrive.com/v1/activities?api_token=800b3b1ce3b3d06db9d7031758f332b480d45a27', {    
        form: {'subject': '4506-T',
               'deal_id': i}});
}

Promise.all([getIt(urls.deals), getIt(urls.activities)]).then(function(results) {
    var deals = results[0];
    var activities = results[1];

    deals.forEach(inStageTwo);

    // #1 - Deals in stage 2.
    console.log(applications);
    console.log(appsJson);

    activities.forEach(has4506T);

    // #2 - Deals that already have a 4506T activity
    console.log(alreadyHave4506T);

}).then(function(){

    applications.forEach(compare);

    // #3 - Deals that still need 4506T activity
    console.log(stillNeeds4506T);

    stillNeeds4506T.forEach(add);
});

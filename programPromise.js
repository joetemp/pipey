const request = require('request');

var urls = { deals: 'https://api.pipedrive.com/v1/deals?start=0&api_token=12345',
             activities : 'https://api.pipedrive.com/v1/activities?start=0&api_token=12345' };

var applications = [];
var alreadyHave4506T = [];
var stillNeeds4506T = [];

function getIt (url, callback) {
    return new Promise(function(resolve, reject){
        request(url, function (error, response, body) {
            if (error) {
                reject(error);
            } else {
                resolve(JSON.parse(body).data);
            }
        });
    }
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

function needs4506T (test) {
    if (alreadyHave4506T.indexOf(i) === -1) {
       stillNeeds4506T.push(i);
    }
}

Promise.resolve().then(function() {
    return getIt(urls.deals);    
}).then(function (deals) {
    deals.forEach(inStageTwo);
    console.log (applications);
}).then(function() {
    return getIt (urls.activities);
}).then(function (activities) {
    activities.forEach(has4506T);
    console.log(alreadyHave4506T);
}).catch(function(err) {
    console.log('Error: ' + err);
});


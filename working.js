const request = require('request-promise');

var urls = { deals: 'https://api.pipedrive.com/v1/deals?start=0&api_token=800b3b1ce3b3d06db9d7031758f332b480d45a27',
             activities : 'https://api.pipedrive.com/v1/activities?start=0&api_token=800b3b1ce3b3d06db9d7031758f332b480d45a27' };

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

function testish(i) {
    console.log(i.person_id.name + ' ' + i.add_time);
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

    console.log(applications);

    deals.forEach(testish);

    activities.forEach(has4506T);

    console.log(alreadyHave4506T);

}).then(function(){

    applications.forEach(compare);

    console.log(stillNeeds4506T);

    stillNeeds4506T.forEach(add);
});

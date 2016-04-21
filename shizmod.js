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

function add (i) {
    return request.post('https://api.pipedrive.com/v1/activities?api_token=' +  API_KEY, {    
        form: {'subject': '4506-T',
               'deal_id': i}});
}

Promise.all([getIt(urls.deals), getIt(urls.activities)]).then(function(results) {
    var deals = results[0];
    var activities = results[1];

    var applications = {};
    var stillNeeds4506T = [];

    for (var i in deals) {
        if (deals[i].stage_id === 2) {
            applications[deals[i].id] = deals[i];
        }
    }

    // console.log(applications);
    
    var alreadyHave4506T = activities.filter(function(activity) {
        return (activity.subject === '4506-T');
    });

    // console.log(alreadyHave4506T);

    for (var i in applications) {
        var id = applications[i];
        if (alreadyHave4506T.indexOf(id) === -1) {
            stillNeeds4506T.push(id);	
        }
    }

    console.log(stillNeeds4506T);
    
    return Promise.all(stillNeeds4506T.map(function(item) {
        return add(item.id);
    }));

}).then(function(responses) {
    // all have now been added
});

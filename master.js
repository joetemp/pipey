const request = require('request-promise');

var API_KEY = process.env.API_KEY;

var urls = { deals: 'https://api.pipedrive.com/v1/deals?start=0&api_token=' + API_KEY,
             activities: 'https://api.pipedrive.com/v1/activities?start=0&api_token=' + API_KEY };

function getIt (url) {
    return request(url).then(function (body) {
        return JSON.parse(body).data;
    });
} 

function add (i) {
    return request.post('https://api.pipedrive.com/v1/activities?api_token=' + API_KEY, {
            form: {'subject': '4506-T',
                   'deal_id': i}});
}

function test() {
    console.log('this is a test');
}

Promise.all([getIt(urls.deals), getIt(urls.activities)]).then(function(results) {

    var deals = results[0];
    var activities = results[1];

    deals.forEach(test);

});

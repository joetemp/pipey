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

Promise.all([getIt(urls.deals), getIt(urls.activities)]).then(function(results) {

    var deals = results[0];
    var activities = results[1];

    var apps = {};
    var haves = {};
    // var haveNots = [];
    
    deals.forEach(function(deal){
        if (deal.stage_id === 2) {
            apps[deal.id] = deal;
        } 
    });

    activities.forEach(function(activity){
        if (activity.subject === '4506-T') {
            haves[activity.deal_id] = activity; 
        }
    });

    // console.log(apps);
    // console.log(haves);
    
    console.log(Object.keys(apps));
    console.log(Object.keys(haves));

    var diffs = Object.keys(apps).filter(function(app) {
        return (Object.keys(haves).indexOf(app) === -1); 
    });

    haveNots = diffs.map(function(item){
        return Number(item); 
    });

    console.log(haveNots);

    /*
     *
    Object.keys(apps).forEach(function(key){
        console.log('fuck');
    });
    */
});

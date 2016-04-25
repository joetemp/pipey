const request = require('request-promise');                                                                                                         
const moment = require('moment');
moment().format();

var API_KEY = process.env.API_KEY;

var urls = { deals: 'https://api.pipedrive.com/v1/deals?start=0&api_token=' + API_KEY,
             activities: 'https://api.pipedrive.com/v1/activities?start=0&api_token=' + API_KEY };

function getIt (url) {
    return request(url).then(function (body) {
        return JSON.parse(body).data;
    });
} 

var apps = {}

function isStage(deal) {
    if (deal.stage_id === this) {
        apps[deal.id] = deal;
    } 
}

Promise.all([getIt(urls.deals), getIt(urls.activities)]).then(function(results) {

    var deals = results[0];
    var activities = results[1];

    if (Array.isArray(activities)) {
        console.log("Activities is an array... so we'll loop through it."); 

        var haves = {};

        /*
        deals.forEach(function(deal){
            if (deal.stage_id === 2) {
                apps[deal.id] = deal;
            } 
        });
        */
       deals.forEach(isStage, 2);

        activities.forEach(function(activity){
            if (activity.subject === '4506-T') {
                haves[activity.deal_id] = activity; 
            }
        });
        
        console.log(Object.keys(apps));
        console.log(Object.keys(haves));

        var diffs = Object.keys(apps).filter(function(app) {
            return (Object.keys(haves).indexOf(app) === -1); 
        });

        var haveNots = diffs.map(function(item){
            return Number(item); 
        });

        console.log(haveNots);

        haveNots.forEach(function(deal){
            request.post('https://api.pipedrive.com/v1/activities?api_token=' + API_KEY, {
                form: {'subject': '4506-T',
                       'deal_id': deal,
                         'note' : apps[deal].person_id.name + ' is a pretty cool dude.',
                     'due_date' : moment(apps[deal].add_time).add(3, 'days').format('YYYY-MM-DD')}});

            console.log(apps[deal].person_id.name + ' was created on ' + moment(apps[deal].add_time).format('YYYY-MM-DD') + '. So, this task is due on ' + moment(apps[deal].add_time).add(3, 'days').format('YYYY-MM-DD') + '.');
        });

    } else {
        console.log("There are no activities... so we can't loop through them. Instead... we'll just add a 4506-T activity to every app."); 
        
        /*
        deals.forEach(function(deal){
            if (deal.stage_id === 2) {
                apps[deal.id] = deal;
            } 
        });
        */
        deals.forEach(isStage, 2);

        console.log(Object.keys(apps));

        var haveNots = Object.keys(apps).map(function(item){
            return Number(item); 
        });

        console.log(haveNots);

        haveNots.forEach(function(deal){
            request.post('https://api.pipedrive.com/v1/activities?api_token=' + API_KEY, {
                form: {'subject': '4506-T',
                       'deal_id': deal,
                         'note' : apps[deal].person_id.name + ' is a pretty cool dude.',
                     'due_date' : moment(apps[deal].add_time).add(3, 'days').format('YYYY-MM-DD')}});

            console.log(apps[deal].person_id.name + ' was created on ' + moment(apps[deal].add_time).format('YYYY-MM-DD') + '. So, this task is due on ' + moment(apps[deal].add_time).add(3, 'days').format('YYYY-MM-DD') + '.');
        });

    };

}).then(function(){
    // do more stuff here.
});

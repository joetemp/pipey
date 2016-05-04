module.exports = function (API_KEY, deals, activities, apps, refis, noPBL) {
    
    const request = require('request-promise');
    const moment = require('moment');
    moment().format();

    var haves = {};

    // This finds all the deals that already have 4506-T activities.
    activities.forEach(function(activity) {
        if (activity.subject === '4506-T') {
            haves[activity.deal_id] = activity; 
        }  
    });

    // These are all the deals that are refis and apps.
    var refiApps = Object.keys(apps).filter(function(app) {
        return (Object.keys(refis).indexOf(app) !== -1); 
    });

    // These are all the deals that are purchases and apps.
    var purchApps = Object.keys(apps).filter(function(app) {
        return (Object.keys(refis).indexOf(app) === -1); 
    });

    // These are all the purchase apps that are NOT PBL eligible.
    var realDealPurchApps = purchApps.filter(function(item) {
        return (Object.keys(noPBL).indexOf(item) === -1); 
    });

    console.log('These are refi apps:');
    console.log(refiApps);

    console.log("These are purchases that are NOT PBL eligable:");
    console.log(realDealPurchApps);

    console.log('All these deals SHOULD have a 4506-T');
    var queue = refiApps.concat(realDealPurchApps);

    console.log(queue);


    var diff = queue.filter(function(item) {
        return (Object.keys(haves).indexOf(item) === -1); 
    });

    console.log("Here is diff");
    console.log(diff);

    var needs = diff.map(function(item) {
        return Number(item); 
    });

    console.log("Here are all the deals that don't yet");
    console.log(needs);

    needs.forEach(function(deal){
        request.post('https://api.pipedrive.com/v1/activities?api_token=' + API_KEY, {
            form: {'subject': '4506-T',
                   'deal_id': deal,
                     'type' : 'task',
                     'note' : 'Get correctly filled out and signed 4506-T for ' + realDeals[deal].person_id.name + '.',
                 'due_date' : moment(realDeals[deal].stage_change_time).add(3, 'days').format('YYYY-MM-DD')}});
    }); 
    
}

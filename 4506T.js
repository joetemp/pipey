module.exports = function (API_KEY, deals, activities, realDeals, apps, refis) {

    const request = require('request-promise');
    const moment = require('moment');
    moment().format();

    var haves = {};

    // console.log('Real deals:');
    // console.log(Object.keys(realDeals));

    var purchaseApps = Object.keys(apps).filter(function(app) {
        return (Object.keys(refis).indexOf(app) === -1);   
    });

    var refiApps = Object.keys(apps).filter(function(app) {
        return (Object.keys(refis).indexOf(app) !== -1); 
    });

    activities.forEach(function(activity) {
        if (activity.subject === '4506-T') {
            haves[activity.deal_id] = activity; 
        } 
    });

    var diff = Object.keys(realDeals).filter(function(realDeal) {
        return (Object.keys(haves).indexOf(realDeal) === -1); 
    });

    var needs = diff.map(function(item) {
        return Number(item); 
    });

    // console.log('Real deals that need 4506-T activities:');
    // console.log(needs);

    needs.forEach(function(deal){
        request.post('https://api.pipedrive.com/v1/activities?api_token=' + API_KEY, {
            form: {'subject': '4506-T',
                   'deal_id': deal,
                     'type' : 'task',
                     'note' : 'Get correctly filled out and signed 4506-T for ' + realDeals[deal].person_id.name + '.',
                 'due_date' : moment(realDeals[deal].stage_change_time).add(3, 'days').format('YYYY-MM-DD')}});
    });
}

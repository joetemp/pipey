module.exports = function (API_KEY, deals, activities, app, type, pbl) {
    const request = require('request-promise'); 
    const moment = require('moment');
    moment().format();
    
    var haves = {};
    var queue = {};

    activities.forEach(function(activity) {
        if (activity.subject === '1003') {
            haves[activity.deal_id] = activity; 
        } 
    });

    console.log('Deals that have a 1003 activity:');
    console.log(Object.keys(haves));

    deals.forEach(function(deal) {
        if (deal.stage_id === app && deal[type.key] === type.refi || 
            deal.stage_id === app && deal[type.key] === type.purchase ||
            deal.stage_id === app && deal[type.key] === type.prequal && deal[pbl.key] === pbl.no) {
                queue[deal.id] = deal; 
        } 
    });

    var diff = Object.keys(queue).filter(function(deal) {
        return (Object.keys(haves).indexOf(deal) === -1); 
    });

    var needs = diff.map(function(deal) {
        return Number(deal); 
    });

    console.log('Deals that need a 1003 activity');
    console.log(needs);

    // This creates the activity for every deal in needs.
    needs.forEach(function(deal){
        request.post('https://api.pipedrive.com/v1/activities?api_token=' + API_KEY, {
            form: {'subject': '1003',
                   'deal_id': deal,
                     'type' : 'task',
                     'note' : 'Sign and scan 1003 for ' + queue[deal].person_id.name + '.',
                 'due_date' : moment(queue[deal].stage_change_time).add(3, 'days').format('YYYY-MM-DD')}});
    });  

}   

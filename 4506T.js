module.exports = function (API_KEY, deals, activities, app, type, pbl) {
    const request = require('request-promise'); 
    const moment = require('moment');
    moment().format();
    
    var haves = {};
    var queue = {};

    // Defines haves
    activities.forEach(function(activity) {
        if (activity.subject === '4506-T') {
            haves[activity.deal_id] = activity; 
        } 
    });

    console.log('Deals that have a 4506-T activity:');
    console.log(Object.keys(haves));

    // Defines queue
    deals.forEach(function(deal) {
        if (deal.stage_id === app && deal[type.key] === type.refi || 
            deal.stage_id === app && deal[type.key] === type.purchase || 
            deal.stage_id === app && deal[type.key] === type.prequal && deal[pbl.key] === pbl.no) {
                queue[deal.id] = deal; 
        } 
    });

    // Filters out deals in queue that are also in haves.
    var diff = Object.keys(queue).filter(function(deal) {
        return (Object.keys(haves).indexOf(deal) === -1); 
    });

    // Turns every deal in diff into a number.
    var needs = diff.map(function(deal) {
        return Number(deal); 
    });

    console.log('Deals that need a 4506-T activity:');
    console.log(needs);

    // This creates a the activity for every deal in needs.
    needs.forEach(function(deal){
        request.post('https://api.pipedrive.com/v1/activities?api_token=' + API_KEY, {
            form: {'subject': '4506-T',
                   'deal_id': deal,
                     'type' : 'task',
                     'note' : 'Get correctly filled out and signed 4506-T for ' + queue[deal].person_id.name + '.',
                 'due_date' : moment(queue[deal].stage_change_time).add(3, 'days').format('YYYY-MM-DD')}});
    });  

}

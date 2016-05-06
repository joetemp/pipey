module.exports = function (API_KEY, deals, activities, app, type, pbl, employment) {
    const request = require('request-promise'); 
    const moment = require('moment');
    moment().format();
    
    var haves = {};
    var queue = {};

    // Defines haves
    activities.forEach(function(activity) {
        if (activity.subject === '1040') {
            haves[activity.deal_id] = activity; 
        }   
    }); 

    // Defines queue
    deals.forEach(function(deal) {
        if (deal.stage_id === app && deal[type.key] === type.refi && deal[employment.key] === employment.selfEmployed ||  
            deal.stage_id === app && deal[type.key] === type.purchase && deal[pbl.key] === pbl.no && deal[employment.key] === employment.selfEmployed) {
                queue[deal.id] = deal; 
        }   
    }); 

    // Filters out deals in queue that are also in haves.
    var diff = Object.keys(queue).filter(function(deal) {
        return (Object.keys(haves).indexOf(deal) === -1); 
    }); 

    // Turns ever deal in diff into a number.
    var needs = diff.map(function(deal) {
        return Number(deal); 
    }); 

    // This creates the activity for every deal in needs.
    needs.forEach(function(deal){
        request.post('https://api.pipedrive.com/v1/activities?api_token=' + API_KEY, {
            form: {'subject': '1040',
                   'deal_id': deal,
                     'type' : 'task',
                     'note' : 'Get most recent 1040 for ' + queue[deal].person_id.name + '.',
                 'due_date' : moment(queue[deal].stage_change_time).add(3, 'days').format('YYYY-MM-DD')}});
    });  

}    

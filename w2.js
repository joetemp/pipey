module.exports = function (API_KEY, deals, activities, app, type, pbl, employment) {
    const request = require('request-promise'); 
    const moment = require('moment');
    
    var haves = {};
    var queue = {};

    // Defines haves
    activities.forEach(function(activity) {
        if (activity.subject === 'W-2') {
            haves[activity.deal_id] = activity; 
        }   
    }); 

    // Defines queue
    deals.forEach(function(deal) {
        if (deal.stage_id === app && deal[type.key] === type.refi && deal[employment.key] === employment.employed ||  
            deal.stage_id === app && deal[type.key] === type.purchase && deal[pbl.key] === pbl.no && deal[employment.key] === employment.employed) {
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

    // This creates a 4506-T activity for every deal in needs.
    needs.forEach(function(deal){
        request.post('https://api.pipedrive.com/v1/activities?api_token=' + API_KEY, {
            form: {'subject': 'W-2',
                   'deal_id': deal,
                     'type' : 'task',
                     'note' : 'Get most recent W-2 for ' + queue[deal].person_id.name + '.',
                 'due_date' : moment(queue[deal].stage_change_time).add(3, 'days').format('YYYY-MM-DD')}});
    });  

}   

module.exports = function (API_KEY, deals, activities, app, type, pbl) {
    const request = require('request-promise'); 
    const moment = require('moment');
    moment().format();
    
    var haves = {};
    var queue = {};

    // Defines haves
    activities.forEach(function(activity) {
        if (activity.subject === "Borrower's Certification") {
            haves[activity.deal_id] = activity; 
        }   
    }); 

    console.log('Deals that have a bCert activity:');
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

    // Turns ever deal in diff into a number.
    var needs = diff.map(function(deal) {
        return Number(deal); 
    }); 

    console.log('Deals that need a bCert activity:');
    console.log(needs);

    // This creates a 4506-T activity for every deal in needs.
    needs.forEach(function(deal){
        request.post('https://api.pipedrive.com/v1/activities?api_token=' + API_KEY, {
            form: {'subject': "Borrower's Certification",
                   'deal_id': deal,
                     'type' : 'task',
                     'note' : "Get signed Borrower's Certification for " + queue[deal].person_id.name + '.',
                 'due_date' : moment(queue[deal].stage_change_time).add(3, 'days').format('YYYY-MM-DD')}});
    });  

}   

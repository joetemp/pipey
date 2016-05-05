module.exports = function (API_KEY, deals, activities, type, pbl) {
    const request = require('request-promise'); 
    const moment = require('moment');
    
    var haves = {};
    var queue = {};

    activities.forEach(function(activity) {
        if (activity.subject === '4506-T') {
            haves[activity.deal_id] = activity; 
        } 
    });

    deals.forEach(function(deal) {
        if (deal.stage_id === 2 && deal[type] === '6' || deal.stage_id === 2 && deal[type] === '7' && deal[pbl] === '14') {
            queue[deal.id] = deal; 
        } 
    });

    console.log('The queue:');
    console.log(Object.keys(queue));

    var diff = Object.keys(queue).filter(function(deal) {
        return (Object.keys(haves).indexOf(deal) === -1); 
    });

    var needs = diff.map(function(deal) {
        return Number(deal); 
    });

    console.log('The diff:');
    console.log(diff);

    console.log('The needs:');
    console.log(needs);

    needs.forEach(function(deal){
        request.post('https://api.pipedrive.com/v1/activities?api_token=' + API_KEY, {
            form: {'subject': '4506-T',
                   'deal_id': deal,
                     'type' : 'task',
                     'note' : 'Get correctly filled out and signed 4506-T for ' + queue[deal].person_id.name + '.',
                 'due_date' : moment(queue[deal].stage_change_time).add(3, 'days').format('YYYY-MM-DD')}});
    });  

}

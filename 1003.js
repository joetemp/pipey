module.exports = function (API_KEY, deals, activities, realDeals) {

    const request = require('request-promise');
    const moment = require('moment');
    moment().format();

    var haves = {};

    console.log('Real deals:');
    console.log(Object.keys(realDeals));

    activities.forEach(function(activity) {
        if (activity.subject === 'HMC Signed 1003') {
            haves[activity.deal_id] = activity; 
        } 
    });

    var diff = Object.keys(realDeals).filter(function(realDeal) {
        return (Object.keys(haves).indexOf(realDeal) === -1); 
    });

    var needs = diff.map(function(item) {
        return Number(item); 
    });

    console.log('Real deals that need 1003 activities:');
    console.log(needs);

    needs.forEach(function(deal){
        request.post('https://api.pipedrive.com/v1/activities?api_token=' + API_KEY, {
            form: {'subject': 'HMC Signed 1003',
                   'deal_id': deal,
                     'type' : 'task',
                     'note' : 'Sign 1003 for ' + realDeals[deal].person_id.name + '.',
                 'due_date' : moment(realDeals[deal].add_time).add(3, 'days').format('YYYY-MM-DD')}});
    });
}

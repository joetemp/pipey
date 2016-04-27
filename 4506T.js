module.exports = function set4506T(API_KEY, deals, activities, realDeals) {

    const request = require('request-promise');
    const moment = require('moment');
    moment().format();

    var has4506T = {};

    console.log('Real deals:');
    console.log(Object.keys(realDeals));

    activities.forEach(function(activity) {
        if (activity.subject === '4506-T') {
            has4506T[activity.deal_id] = activity; 
        } 
    });

    var diff4506T = Object.keys(realDeals).filter(function(realDeal) {
        return (Object.keys(has4506T).indexOf(realDeal) === -1); 
    });

    var realDealNeeds4506T = diff4506T.map(function(item) {
        return Number(item); 
    });

    console.log('Real deals that need 4506-T activities:');
    console.log(realDealNeeds4506T);

    realDealNeeds4506T.forEach(function(deal){
        request.post('https://api.pipedrive.com/v1/activities?api_token=' + API_KEY, {
            form: {'subject': '4506-T',
                   'deal_id': deal,
                     'note' : 'Get correctly filled out and signed 4506-T for ' + realDeals[deal].person_id.name + '.',
                 'due_date' : moment(realDeals[deal].add_time).add(3, 'days').format('YYYY-MM-DD')}});
    });
}

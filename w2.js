module.exports = function (API_KEY, deals, activities, employed) {

    const request = require('request-promise');
    const moment = require('moment');
    moment().format();

    var haves = {};

    console.log('Employed people:');
    console.log(Object.keys(employed));

    activities.forEach(function(activity) {
        if (activity.subject === 'W2') {
            haves[activity.deal_id] = activity; 
        } 
    });

    var diff = Object.keys(employed).filter(function(item) {
        return (Object.keys(haves).indexOf(item) === -1); 
    });

    console.log(diff);

    var needs = diff.map(function(item) {
        return Number(item); 
    });

    console.log(needs);

    needs.forEach(function(deal){
        request.post('https://api.pipedrive.com/v1/activities?api_token=' + API_KEY, {
            form: {'subject': 'W2',
                   'deal_id': deal,
                     'type' : 'task',
                     'note' : 'Get most recent W2 for ' + employed[deal].person_id.name + '.',
                 'due_date' : moment(employed[deal].stage_change_time).add(3, 'days').format('YYYY-MM-DD')}});
        console.log('fuck yeah');
    });
}


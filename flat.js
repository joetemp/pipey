const request = require('request-promise');
const moment = require('moment');
moment().format();

var API_KEY = process.env.API_KEY;

var urls = { deals: 'https://api.pipedrive.com/v1/deals?start=0&api_token=' + API_KEY,
             activities: 'https://api.pipedrive.com/v1/activities?start=0&api_token=' + API_KEY };

function getIt (url) {
    return request(url).then(function (body) {
        return JSON.parse(body).data;
    });
} 

Promise.all([getIt(urls.deals), getIt(urls.activities)]).then(function(results) {

    var deals = results[0] || [];
    var activities = results[1] || [];

    // Custom Fields
    var type = '33eb86af817c62123047fc43d6afe908adbd203d';

    var has4506T = {};
    var realDeals = {};

    deals.forEach(function(deal){
        if (deal[type] === '1' && deal.stage_id === 2) {
            realDeals[deal.id] = deal; 
        } 
    });

    console.log('Real deals: ');
    console.log(Object.keys(realDeals));

    activities.forEach(function(activity){
	if (activity.subject === '4506-T') {
	    has4506T[activity.deal_id] = activity; 
	}
    });

    var diff4506T = Object.keys(realDeals).filter(function(realDeal) {
        return (Object.keys(has4506T).indexOf(realDeal) === -1); 
    });

    var realDealNeeds4506T = diff4506T.map(function(item){
        return Number(item); 
    });

    console.log('Real deals that need activities: ');
    console.log(realDealNeeds4506T);

    realDealNeeds4506T.forEach(function(deal){
	request.post('https://api.pipedrive.com/v1/activities?api_token=' + API_KEY, {
	    form: {'subject': '4506-T',
		   'deal_id': deal,
		     'note' : realDeals[deal].person_id.name + ' is a pretty cool dude.',
		 'due_date' : moment(realDeals[deal].add_time).add(3, 'days').format('YYYY-MM-DD')}});

	console.log(realDeals[deal].person_id.name + ' was created on ' + moment(realDeals[deal].add_time).format('YYYY-MM-DD') + '. So, this task is due on ' + moment(realDeals[deal].add_time).add(3, 'days').format('YYYY-MM-DD') + '.');
    });

}).then(function(){
// do more stuff here.
});

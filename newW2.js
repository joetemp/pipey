module.exports = function (API_KEY, deals, activities, app, type, pbl, address, test){
    const request = require('request-promise');
    const moment = require('moment');
    moment().format();

    var soon = {};
    var soonPart = {};
    var have = {};

    deals.map(function(deal) {
        if (deal.stage_id === 2 && deal[type.key] === type.refi ||
            deal.stage_id === 2 && deal[type.key] === type.purchase && deal[pbl.key] === pbl.no) {
                soon[deal.id] = deal; 
        }
    });

    activities.map(function(activity) {
        if (activity.subject === 'W-2') {
            have[activity.person_id + activity.deal_id] = activity; 
        } 
    });

    console.log('Here are the people who already have a W-2 activity:');
    console.log(Object.keys(have));

    var soonArr = (Object.keys(soon)).map(function(deal) {
        return Number(deal); 
    });

    console.log('Here are the deals that could potentially need a W-2 soon:');
    console.log(soonArr);

    function getIt(url) {
        return request(url).then(function(body) {
            return JSON.parse(body).data; 
        }); 
    }

    return Promise.all([]).then(function() {
        
        var promises = soonArr.map(function(deal) {
            
            var url = 'https://api.pipedrive.com/v1/deals/' + deal + '/participants?start=0&api_token=' + API_KEY;

            return Promise.all([getIt(url)]).then(function(results){
                // console.log(results);

                results[0].map(function(person){
                    // console.log(person.id); 

                   // soonPart[person.person_id.value] = person;

                    if (person.person[test.key] === '14') {
                        soonPart[person.person.id + person.related_item_id] = person;
                    }

                });
            }); 
        });

        return Promise.all(promises);

    }).then(function() {
        console.log('Here are the people associated with those deals that are EMPLOYED:');
        console.log(Object.keys(soonPart)); 

        var soonQueue = Object.keys(soonPart).filter(function(part) {
            return Object.keys(have).indexOf(part) === -1; 
        });

        var soonQueueArr = soonQueue.map(function(part) {
            return Number(part); 
        });
        console.log('Here is the soon queue:');
        console.log(soonQueueArr);

        soonQueueArr.map(function(combo){
	    request.post('https://api.pipedrive.com/v1/activities?api_token=' + API_KEY, {
		form: {'subject': 'W-2',
		       'deal_id': combo - soonPart[combo].person.id,
                     'person_id': combo - soonPart[combo].related_item_id,
			 'type' : 'task',
			 'note' : 'Sign and scan 1003 for ' + soonPart[combo].person_id.name + '.',
		     'due_date' : moment().add(3, 'days').format('YYYY-MM-DD')}});
    	});

    });

}

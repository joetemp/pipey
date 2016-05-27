module.exports = function (API_KEY, deals, activities, app, type, pbl, address){
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
            have[activity.person_id] = activity; 
        } 
    });

    console.log(Object.keys(have));

    var soonArr = (Object.keys(soon)).map(function(deal) {
        return Number(deal); 
    });

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

                    soonPart[person.person_id.value] = person;


                });
            }); 
        });

        return Promise.all(promises);

    }).then(function() {
        console.log(Object.keys(soonPart)); 

        var diff = Object.keys(soonPart).filter(function(part) {
            return Object.keys(have).indexOf(part) === -1; 
        });

        console.log('Here is the diff:');
        console.log(diff);

    });



}

module.exports = function (API_KEY, deals, activities, app, type, pbl, address, test){
    const request = require('request-promise');
    const moment = require('moment');
    // Basic reimpl of Bluebird's Promise.try
    const promiseTry = function (syncFn) { return new Promise(function (resolve) { return resolve(syncFn()); }); };    moment().format();

    var soon = {};
    var soonPart = {};
    var later = {};
    var laterPart = {};
    var change = {};
    var changePart = {};
    var have = {};
    var haveLater = {};

    deals.map(function(deal) {
        if (deal.stage_id === app && deal[type.key] === type.refi ||
            deal.stage_id === app && deal[type.key] === type.purchase && deal[pbl.key] === pbl.no) {
                soon[deal.id] = deal; 
        } else if (deal.stage_id === app && deal[type.key] === type.purchase && deal[pbl.key] === pbl.yes && deal[address.key] === '' ||
                   deal.stage_id === app && deal[type.key] === type.purchase && deal[pbl.key] === pbl.yes && deal[address.key] === null) {
                later[deal.id] = deal; 
        } else if (deal.stage_id === app && deal[type.key] === type.purchase && deal[pbl.key] === pbl.yes && deal[address.key] !== '' ||
                   deal.stage_id === app && deal[type.key] === type.purchase && deal[pbl.key] === pbl.yes && deal[address.key] !== null) {
                change[deal.id] = deal;
        }
    });

    activities.map(function(activity) {
        var now = moment();
        var dueDate = moment(activity.due_date);
        var daysOut = dueDate.diff(now, 'days');

        var dealID;
        var personID;
        var cat;

        if (activity.subject === 'W-2') {
            dealID = activity.deal_id.toString();
            personID = activity.person_id.toString();
            cat = dealID + personID;

            console.log(cat);
            have[cat] = activity;
        } 

        if (activity.subject === 'W-2' && daysOut > 3) {
            dealID = activity.deal_id.toString();
            personID = activity.person_id.toString();
            cat = dealID + personID;

            console.log(cat);
            haveLater[cat] = activity; 
        }
    });

    console.log('Here are the people who already have a W-2 activity:');
    console.log(Object.keys(have));

    var soonArr = (Object.keys(soon)).map(function(deal) {
        return Number(deal); 
    });

    var laterArr = (Object.keys(later)).map(function(deal) {
        return Number(deal); 
    });

    var changeArr = (Object.keys(change)).map(function(deal) {
        return Number(deal); 
    });

    console.log('Here are the deals that could potentially need a W-2 SOON:');
    console.log(soonArr);

    console.log('Here are the deals that could potentially need a W-2 LATER:');
    console.log(laterArr);

    console.log('Here are the deals that could potentially need a CHANGE in their W-2 due date:');
    console.log(changeArr);


    function getIt(url) {
        return request(url).then(function(body) {
            return JSON.parse(body).data; 
        }); 
    }

    // FIRST promise chain that deals with the soonArr array.
    promiseTry(function() {
        var promises = soonArr.map(function(deal) {
            var url = 'https://api.pipedrive.com/v1/deals/' + deal + '/participants?start=0&api_token=' + API_KEY;

            return Promise.all([getIt(url)]).then(function(results){

                results[0].map(function(part){

                    if (part.person[test.key] === '14') {

                        var relatedItemID = part.related_item_id.toString();
                        var personID = part.person.id.toString();
                        var cat = relatedItemID + personID;

                        soonPart[cat] = part;
                    }

                });
            }); 
        });
        return Promise.all(promises);

    }).then(function() {
        console.log('Here are the people associated with the SOON deals that are EMPLOYED:');
        console.log(Object.keys(soonPart)); 

        var soonQueue = Object.keys(soonPart).filter(function(part) {
            return Object.keys(have).indexOf(part) === -1; 
        });

        console.log('Here is the SOON queue:');
        console.log(soonQueue);

        soonQueue.map(function(cat){
            request.post('https://api.pipedrive.com/v1/activities?api_token=' + API_KEY, {
                form: {'subject': 'W-2',
                       'deal_id': soonPart[cat].related_item_id,
                     'person_id': soonPart[cat].person.id,
                         'type' : 'task',
                         'note' : 'Get a W-2 for ' + soonPart[cat].person_id.name + '.',
                     'due_date' : moment().add(3, 'days').format('YYYY-MM-DD')}});
        });

    });

    // SECOND promise chain that deals with the laterArr array.
    promiseTry(function() {
         
        var promises = laterArr.map(function(deal) {
            var url = 'https://api.pipedrive.com/v1/deals/' + deal + '/participants?start=0&api_token=' + API_KEY;

            return Promise.all([getIt(url)]).then(function(results){

                results[0].map(function(part){

                    if (part.person[test.key] === '14') {

                        var relatedItemID = part.related_item_id.toString();
                        var personID = part.person.id.toString();
                        var cat = relatedItemID + personID;

                        laterPart[cat] = part;
                    }

                });
            }); 
        });
        return Promise.all(promises);

    }).then(function() {
        console.log('Here are the people associated with the LATER deals that are EMPLOYED:');
        console.log(Object.keys(laterPart)); 

        var laterQueue = Object.keys(laterPart).filter(function(part) {
            return Object.keys(have).indexOf(part) === -1; 
        });

        console.log('Here is the LATER queue:');
        console.log(laterQueue);

        laterQueue.map(function(cat){
            request.post('https://api.pipedrive.com/v1/activities?api_token=' + API_KEY, {
                form: {'subject': 'W-2',
                       'deal_id': laterPart[cat].related_item_id,
                     'person_id': laterPart[cat].person.id,
                         'type' : 'task',
                         'note' : 'Get a W2 for ' + laterPart[cat].person_id.name + '.',
                     'due_date' : moment().add(85, 'days').format('YYYY-MM-DD')}});
        });
    });
} 

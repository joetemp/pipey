const request = require('request-promise');
//const set4506T = require('./4506T.js');
//const set1003 = require('./1003.js'); 
//const setW2 = require('./w2.js');
//const setMod4506T = require('./mod4506T.js');
const setClean4506T = require('./clean4506T.js');

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

    var selfEmployed = {};
    var employed = {};

    // Custom fields and values

    var type = {key: '33eb86af817c62123047fc43d6afe908adbd203d',
                refi: '6',
                purchase: '7'};

    /*
     *
    var type = '33eb86af817c62123047fc43d6afe908adbd203d';
        var refi = '6';
        var purchase = '7';
    */
    var employment = 'a5fd226d5b7bbe68914cfa093063150bd0f33d83';
    var pbl = '224edf1ce6c5ae9f19468769128a87982b349f05';

    deals.forEach(function(deal) {
        if (deal.stage_id === 2 && deal[type] === '6' && deal[employment] === '3') {
            employed[deal.id] = deal; 
        } else if (deal.stage_id === 2 && deal[type] === '6' && deal[employment] === '4') {
            selfEmployed[deal.id] = deal; 
        }
    });

    //set4506T(API_KEY, deals, activities, realDeals, apps, refis);
    //set1003(API_KEY, deals, activities, realDeals);
    //setW2(API_KEY, deals, activities, employed);
    //setMod4506T(API_KEY, deals, activities, apps, refis, noPBL);
    setClean4506T(API_KEY, deals, activities, type, pbl);

}).then(function(){
// do more stuff here.
});

const request = require('request-promise');
const set4506T = require('./4506T.js');
const set1003 = require('./1003.js');
const setBCert = require('./bCert.js');
const setW2 = require('./w2.js');
const setPaystubs = require('./paystubs.js');
const set1040 = require('./1040.js');
const setPBL = require('./pbl.js');

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

    // Stage variables
    var app = 2;

    // Custom fields and values variables
    var type = {key: '306c83df3fe0fde00f069be04d8290ff14cae4f6',
                prequal: '4',
                purchase: '5',
                refi: '6'};

    var pbl = {key: '3b8660ac982233b01a417d3fd0adb50ce8c3ec44',
               yes: '7',
               no: '8'};

    var employment = {key: 'c0c0da3d0f5b8373683333ff2578cd4745386eb7',
                      employed: '9',
                      selfEmployed: '10'};
    

    //setPBL(API_KEY, deals, app, type, pbl);

    //Applications activities
    //set4506T(API_KEY, deals, activities, app, type, pbl);
    //set1003(API_KEY, deals, activities, app, type, pbl);
    //setBCert(API_KEY, deals, activities, app, type, pbl);
    //setW2(API_KEY, deals, activities, app, type, pbl, employment);
    //setPaystubs(API_KEY, deals, activities, app, type, pbl, employment);
    set1040(API_KEY, deals, activities, app, type, pbl, employment);

}).then(function(){
// do more stuff here.
});

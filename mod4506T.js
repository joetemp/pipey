module.exports = function (API_KEY, activities, apps, refis, noPBL) {
    
    const request = require('request-promise');
    const moment = require('moment');
    moment().format();

    var haves = {};

    activities.forEach(function(activity) {
        if (activity.subject === '4506-T') {
            haves[activity.deal_id] = activity; 
        }  
    });

    var refiApps = Object.keys(apps).filter(function(app) {
        return (Object.keys(refis).indexOf(app) !== -1); 
    });

    var purchApps = Object.keys(apps).filter(function(app) {
        return (Object.keys(refis).indexOf(app) === -1); 
    });

    var realDealPurchApps = Object.keys(apps).filter(function(app) {
        return (Object.keys(noPBL).indexOf(app) !== -1); 
    });

    console.log('These are refi apps:');
    console.log(refiApps);

    console.log("These are purchases that are NOT PBL eligable:");
    // console.log(Object.keys(noPBL));
    console.log(realDealPurchApps);

    console.log('All these deals SHOULD have a 4506-T');
    var shouldGet = refiApps.concat(realDealPurchApps);

    console.log(shouldGet);


    var diff = shouldGet.filter(function(item) {
        return (Object.keys(haves).indexOf(item) === -1); 
    });

    var needs = diff.map(function(item) {
        return Number(item); 
    });

    console.log("Here are all the deals that don't yet");
    console.log(needs);
    
}

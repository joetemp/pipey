module.exports = function (API_KEY, deals, activities, apps, refis, noPBL) {
    
    const request = require('request-promise');
    const moment = require('moment');
    moment().format();

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

    console.log('These are purchase apps:');
    console.log(purchApps);

    var smash = refiApps.concat(purchApps);

    console.log("Here's the whole fam:");
    console.log(smash);

    console.log("These are purchases that are NOT PBL eligable:");
    console.log(Object.keys(noPBL));
    console.log(realDealPurchApps);

    var getting = refiApps.concat(realDealPurchApps);

    console.log(getting);

    
}

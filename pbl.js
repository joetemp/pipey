module.exports = function (API_KEY, deals, app, type, pbl) {
    const request = require('request-promise'); 
    const moment = require('moment');
    moment().format();
    
    var queue = {};

    deals.forEach(function(deal) {
        if  (deal.stage_id === app && deal[type.key] === type.refi || deal.stage_id === app && deal[type.key] === type.purchase) {
            queue[deal.id] = deal; 
        } 
    });

    var needs = Object.keys(queue).map(function(deal) {
        return Number(deal); 
    });

    needs.forEach(function(deal){
        request.put('https://api.pipedrive.com/v1/deals/' + deal + '?api_token=' + API_KEY, {
            form: { [pbl.key] : pbl.no }}); 
    });

}    

module.exports = function (API_KEY, deals, activities, app, type, pbl, address){
    const request = require('request-promise');
    const moment = require('moment');
    moment().format();

    var soon = {};
    var soonPart = {};

    deals.map(function(deal) {
        if (deal.stage_id === 2 && deal[type.key] === type.refi ||
            deal.stage_id === 2 && deal[type.key] === type.purchase && deal[pbl.key] === pbl.no) {
                soon[deal.id] = deal; 
        }
    });

    var soonArr = (Object.keys(soon)).map(function(deal) {
        return Number(deal); 
    });

    console.log(soonArr);

    function getIt(url) {
        return request(url).then(function(body) {
            return JSON.parse(body).data; 
        }); 
    }

    soonArr.map(function(deal) {
        getIt('https://api.pipedrive.com/v1/deals/' + deal + '/participants?start=0&api_token=' + API_KEY); 

        var parts = results;

        console.log(parts);
    });


}

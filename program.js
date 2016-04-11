const request = require('request');

var urls = { deals: 'https://api.pipedrive.com/v1/deals?start=0&api_token=800b3b1ce3b3d06db9d7031758f332b480d45a27',
             activities : 'api.pipedrive.com/v1/activities?start=0&api_token=800b3b1ce3b3d06db9d7031758f332b480d45a27' };

var allDeals = [];

function getIt (url, callback) {

    request(url, function (error, response, body) {

        if (error) {
            return console.log(error);
        }    

        var parse = JSON.parse(body).data;

        callback(parse);
    });
}

function pusher (deals) {
    allDeals.push(deals.id);
}

getIt (urls.deals, function (deals) {

    deals.forEach(pusher);
     
    /*
    for (var i in deals) {
        allDeals.push(deals[i].id); 
    }
    */

    console.log (allDeals);
});

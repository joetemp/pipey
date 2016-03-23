var request = require('request');
var url = 'https://api.pipedrive.com/v1/deals/';
var dealId = process.argv[2];
var apiToken = '?api_token=07c87355d3f195c4b1bbfa6419456b620b575d05';

request(url + dealId + apiToken, function (err, response, body) {
        if (err) {
            return console.log(err); 
        }

        var parse = JSON.parse(body);
        var dealSize = parse.data.value;
        var commission = dealSize * 0.007;
        
        console.log(commission); // This is what you'll make on the Smith deal
})

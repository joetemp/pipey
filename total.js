var request = require('request');

var url = 'https://api.pipedrive.com/v1/deals/?start=0&';
var apiToken= 'api_token=07c87355d3f195c4b1bbfa6419456b620b575d05';

request(url + apiToken, function (err, response, body) {
        if (err) {
            return console.log(err);
        }

        var parse = JSON.parse(body);
        var data = parse.data;
        var total = 0;

        for (var i in data) { 
            total += data[i].value; 
        }

        console.log(total);
})

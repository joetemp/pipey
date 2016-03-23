const request = require('request');

var url = 'https://api.pipedrive.com/v1/deals?start=0&api_token=';
var apiToken = '07c87355d3f195c4b1bbfa6419456b620b575d05';

request(url + apiToken, function (err, response, body) {
    if (err) {
        return console.log(err); 
    }

    var parse = JSON.parse(body);
    var data = parse.data;
    
    for (var i in data) {
            
        if (data[i].stage_id === 2) {
            // Instead of logging these... I'd like to pass them to another function or program.
            console.log(data[i].id);
        }

    }
})


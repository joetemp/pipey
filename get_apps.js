const request = require('request');

var url = 'https://api.pipedrive.com/v1/deals?start=0&api_token=';
var apiToken = '07c87355d3f195c4b1bbfa6419456b620b575d05';

function getApps (callback) {
    request(url + apiToken, function (error, response, body) {
        if (error) {
            return console.log(error); 
        } 

        var parse = JSON.parse(body);
        var data = parse.data;

        for (var i in data) {
            callback(data[i].stage_id);
        }
    });
}

module.exports = getApps;

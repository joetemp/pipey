const request = require('request');
const getApps = require('./get_apps.js');

getApps(function myFunctionName (id) {   
    // Do this stuff for each application.
    
    var url = 'https://api.pipedrive.com/v1/activities?start=0&api_token=';
    var apiToken = '07c87355d3f195c4b1bbfa6419456b620b575d05';

    request(url + apiToken, function (error, response, body) {
        if (error) {
            return console.log(error);
        }

        var parse = JSON.parse(body);
        var data = parse.data;
        
        for (var i in data) {
            if (data[i].subject === '4506-T') {
                // Find deals in stage 2 that DON'T already have a 4506-T task and console.log thier deal_id.
                console.log(data[i].deal_id);
            } 
        }
    })
});

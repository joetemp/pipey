const request = require('request');

var urls = { deals: 'https://api.pipedrive.com/v1/deals?start=0&api_token=800b3b1ce3b3d06db9d7031758f332b480d45a27',
             activities : 'https://api.pipedrive.com/v1/activities?start=0&api_token=800b3b1ce3b3d06db9d7031758f332b480d45a27' };

var applications = []; 
var alreadyHave4506T = []; 
var stillNeeds4506T = []; 

function getIt (url, callback) {
    request(url, function (error, response, body) {
        if (error) {
            return console.log(error);
        }    
        var parse = JSON.parse(body).data;
        callback(parse);
    }); 
}

function inStageTwo (deal) {
    if (deal.stage_id === 2) {
        applications.push(deal.id);
    }   
}

function has4506T (activity) {
    if (activity.subject === '4506-T') {
        alreadyHave4506T.push(activity.deal_id);  
    }   
}

getIt (urls.deals, function (deals) {
    deals.forEach(inStageTwo);
    console.log (applications);
        
    getIt (urls.activities, function (activities) {
        activities.forEach(has4506T);
        console.log(alreadyHave4506T);

        applications.forEach((i) => { if (alreadyHave4506T.indexOf(i) === -1) { stillNeeds4506T.push(i) }}) 

        console.log(stillNeeds4506T);

        stillNeeds4506T.forEach((i => {
            request.post('https://api.pipedrive.com/v1/activities?api_token=800b3b1ce3b3d06db9d7031758f332b480d45a27', {                            
                form: {'subject': '4506-T',
                       'deal_id': i}});
        }));
            
    }); 

});

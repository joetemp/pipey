module.exports = function (API_KEY, deals) {
    const request = require('request-promise'); 

    var dealsObj = {};
    var partObj = {};

    
    function getIt (url) {
        return request(url).then(function (body) {
            return JSON.parse(body).data; 
        }); 
    }

    deals.forEach(function(deal) {
        dealsObj[deal.id] = deal;
    });

    var dealsArr = (Object.keys(dealsObj)).map(function(deal) {
        return Number(deal); 
    });


    dealsArr.forEach(function(deal) {
        getIt('https://api.pipedrive.com/v1/deals/' + deal + '/participants?start=0&api_token=' + API_KEY).then(function(results) {
            var people = results;


            console.log('Participants of deal ' + deal);

            people.forEach(function(person) {
                console.log(person.person_id.value);
                partObj[person.person_id.value] = deal;
            })
        })
    });

    console.log(partObj);
}   

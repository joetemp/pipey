module.exports = function (API_KEY, deals) {
    const request = require('request-promise'); 
    
    var junk = 'nothing';
    var dealsObj = {};
        
    function getIt (url) {
        return request(url).then(function (body) {
            return JSON.parse(body).data; 
        }); 
    }

    deals.forEach(function(deal) {
        dealsObj[deal.id] = deal; 
    });

    var dealsArr = Object.keys(dealsObj).map(function(deal){
        return Number(deal); 
    });

    Promise.all([junk, junk]).then(function(){
        var swear = "fuck";
        console.log("the big test"); 
        junk = 'something';

        return swear;
    }).then(function(swear){
        console.log("the even bigger test"); 
        console.log(swear);
        console.log(junk);

        dealsArr.forEach(function(deal){
            console.log(deal + " butt"); 
        });
    });

    /*
     *
    dealsArr.forEach(function(deal){
    
        var url = 'https://api.pipedrive.com/v1/deals/' + deal + '/participants?start=0&api_token=' + API_KEY;

        Promise.all([getIt(url), junk]).then(function(results) {
            var people = results[0]; 

            console.log('Participants of deal ' + deal);

            people.forEach(function(person) {
                console.log(person.person_id.value); 
            });
        });

    });
    */
} 

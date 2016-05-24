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

    return Promise.all([junk]).then(function(){

        var promises = dealsArr.map(function(deal){
            var url = 'https://api.pipedrive.com/v1/deals/' + deal + '/participants?start=0&api_token=' + API_KEY;

            return Promise.all([getIt(url), junk]).then(function(results) {
                var people = results[0]; 

                console.log('Participants of deal ' + deal);

                people.forEach(function(person){
                    console.log(person.person_id.value); 
                });
            });
        });

        return Promise.all(promises);

    }).then(function(){
        console.log('Why am I not logged last?');
    });
} 

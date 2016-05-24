module.exports = function (API_KEY, deals, test) {
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

    var dealsArr = Object.keys(dealsObj).map(function(deal){
        return Number(deal); 
    });

    return Promise.all([]).then(function(){

        var promises = dealsArr.map(function(deal){
            var url = 'https://api.pipedrive.com/v1/deals/' + deal + '/participants?start=0&api_token=' + API_KEY;

            return Promise.all([getIt(url)]).then(function(results) {
                var people = results[0]; 

                console.log('Participants of deal ' + deal);

                people.forEach(function(person){
                    console.log(person.person_id.value); 

                    partObj[person.person_id.value] = deal;
                });
            });
        });

        return Promise.all(promises);

    }).then(function(){

        var partArr = Object.keys(partObj).map(function(part) {
            return Number(part); 
        });

        console.log(partArr);

        var p2 = partArr.map(function(part){
            var url = 'https://api.pipedrive.com/v1/persons/' + part + '?api_token=' + API_KEY; 

            return Promise.all([getIt(url)]).then(function(results) {
                var details = results[0];

                console.log(details.name);

                if (details[test.key] === '14'){
                    console.log('/////////////////////////////////////////// Hell yeah'); 
                }
            });
        });

        return Promise.all(p2);
    }).then(function(){
        console.log('I should be logged last.');

        console.log(partObj[25]);
    });
} 

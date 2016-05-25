module.exports = function (API_KEY, deals, activities, test){

    var have = {};

    var myObj = { 1 : 'red',
                  2 : 'blue',
                  3 : 'green' };

    activities.map(function(activity) {
        console.log(activity.person_id);

        if (activity.subject === 'W-2') {
            // have[activity.deal_id] = activity.person_id; 
            have[activity.person_id] = activity.deal_id;
        }
    });

    console.log(have);

    var haveValues = Object.keys(have).map(function(item) {
        return have[item];   
    });

    console.log(haveValues);

    var unique = haveValues.filter(function(elem, pos) {
        return haveValues.indexOf(elem) === pos;   
    });

    console.log(unique);
    
    console.log(Object.keys(myObj));

    var values = Object.keys(myObj).map(function(item) {
        return myObj[item]; 
    });

    console.log(values);
}

/*
 *
module.exports = function (API_KEY, deals, activities, test){

    const have = activities.reduce(function(result, activity) {
        console.log(activity.person_id);

        if (activity.subject === 'W-2') {
            if (!Object.prototype.hasOwnProperty.call(result, activity.deal_id)) {
              result[activity.deal_id] = [];
            }
            result[activity.deal_id].push(activity.person_id);                                                                                          
        }

        return result;
    }, {});

    console.log(have);
}
*/

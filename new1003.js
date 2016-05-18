module.exports = function (API_KEY, deals, activities, app, type, pbl, address) {
    const request = require('request-promise'); 
    const moment = require('moment');
    moment().format();
    
    var haves = {}; 
    var newSoon = {}; 
    var newLater = {};
    var changed = {};
    var laterDeals = {};
    var laterActivities = {};

    activities.forEach(function(activity) {
        if (activity.subject === '1003') {
            haves[activity.deal_id] = activity; 
        }


        // Working real
        var now = moment();
        var dueDate = moment(activity.due_date);

        console.log('// Details for ' + activity.person_name + ' //');
        console.log("Today's date:");
        console.log(now.format('YYYY-MM-DD'));
        console.log(activity.person_name + "'s " +  '1003 activity due date:');
        console.log(dueDate.format('YYYY-MM-DD'));

        var daysOut = dueDate.diff(now, 'days');

        console.log('This is how many days out this task is:');
        console.log(daysOut);

        if ( activity.subject === '1003' && daysOut > 3 ){
            laterDeals[activity.deal_id] = activity;
            laterActivities[activity.id] = activity;
        }
    }); 

    console.log('// Details for what is happening //');

    console.log('Here are the deals that have 1003 activities more than 3 days out:');
    console.log(Object.keys(laterDeals));
    console.log('Here are the actual 1003 activity ids that are more than 3 days out:');
    console.log(Object.keys(laterActivities));


    deals.forEach(function(deal) {
        if (deal.stage_id === app && deal[type.key] === type.refi ||  
            deal.stage_id === app && deal[type.key] === type.purchase && deal[pbl.key] === pbl.no) {
                newSoon[deal.id] = deal; 
        } else if (deal.stage_id === app && deal[type.key] === type.purchase && deal[pbl.key] === pbl.yes && deal[address.key] === '' ||
                   deal.stage_id === app && deal[type.key] === type.purchase && deal[pbl.key] === pbl.yes && deal[address.key] === null) {
                newLater[deal.id] = deal; 
        } else if (deal.stage_id === app && deal[type.key] === type.purchase && deal[pbl.key] === pbl.yes && deal[address.key] !== '' ||
                   deal.stage_id === app && deal[type.key] === type.purchase && deal[pbl.key] === pbl.yes && deal[address.key] !== null) {
                changed[deal.id] = deal; 
        }
    }); 

    console.log('!!!!!!!!!!!!!! Wants !!!!!!!!!!!!!!!');
    console.log(Object.keys(newLater));

    console.log('These are deals that are apps, purchases, have PBL and a full address:');
    console.log(Object.keys(changed));

    var needsDiff = Object.keys(newSoon).filter(function(deal) {
        return (Object.keys(haves).indexOf(deal) === -1); 
    }); 

    var wantsDiff = Object.keys(newLater).filter(function(deal) {
        return (Object.keys(haves).indexOf(deal) === -1); 
    });

    var wantsArray = wantsDiff.map(function(deal) {
        return Number(deal); 
    });

    var needsArray = needsDiff.map(function(deal) {
        return Number(deal); 
    }); 

    var changeSame = Object.keys(changed).filter(function(deal) {
        return (Object.keys(laterDeals).indexOf(deal) !== -1); 
    });

    console.log('These are deals that have all those things AND a 1003 activity that is more than 3 days out:');
    console.log(changeSame);

    var changeArray = changeSame.map(function(deal) {
        return Number(deal); 
    });

    console.log('The changed array:');
    console.log(changeArray);
    
    changeArray.forEach(function(deal){
        console.log('The index of ' + deal);
        console.log(changeArray.indexOf(deal)); 

        var index = changeArray.indexOf(deal);

        console.log('Here is the activity: ');
        console.log(Object.keys(laterActivities)[index]);
    });

    var fucky = changeArray.map(function(deal) {

        var index = changeArray.indexOf(deal);

        return (Object.keys(laterActivities)[index]); 
    });

    var fuckyNum = fucky.map(function(activity) {
        return Number(activity); 
    });

    console.log('The fucky array: ');
    console.log(fucky);

    console.log(fuckyNum);

    // console.log('Deals that need a 1003 activity');
    // console.log(needsArray);

    // This creates the activity for every deal in needsArray.
    needsArray.forEach(function(deal){
        request.post('https://api.pipedrive.com/v1/activities?api_token=' + API_KEY, {
            form: {'subject': '1003',
                   'deal_id': deal,
                     'type' : 'task',
                     'note' : 'Sign and scan 1003 for ' + newSoon[deal].person_id.name + '.',
                 'due_date' : moment().add(3, 'days').format('YYYY-MM-DD')}});                                         
    });  


    wantsArray.forEach(function(deal){
        request.post('https://api.pipedrive.com/v1/activities?api_token=' + API_KEY, {
            form: {'subject': '1003',
                   'deal_id': deal,
                     'type' : 'task',
                     'note' : 'Sign and scan 1003 for ' + newLater[deal].person_id.name + '.',
                 'due_date' : moment().add(85, 'days').format('YYYY-MM-DD')}});                                         
    });  
    
    fuckyNum.forEach(function(activity) {
        console.log(activity); 

        request.put('https://api.pipedrive.com/v1/activities/' + activity + '?api_token=' + API_KEY, {
            form: {'due_date' : moment().add(3, 'days').format('YYYY-MM-DD')}});  
    });
}  

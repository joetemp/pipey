module.exports = function (API_KEY, deals, activities, app, type, pbl, address) {
    const request = require('request-promise'); 
    const moment = require('moment');
    moment().format();
    
    var haves = {}; 
    var needs = {}; 
    var wants = {};
    var change = {};
    var moreThan = {};
    var moreThanActivities = {};

    activities.forEach(function(activity) {
        if (activity.subject === '1003') {
            haves[activity.deal_id] = activity; 
        }


        // Working real
        var a = moment();
        var b = moment(activity.due_date);

        console.log('// Details for ' + activity.person_name + ' //');
        console.log("Today's date:");
        console.log(a.format('YYYY-MM-DD'));
        console.log(activity.person_name + "'s " +  '1003 activity due date:');
        console.log(b.format('YYYY-MM-DD'));

        var c = b.diff(a, 'days');

        console.log('This is how many days out this task is:');
        console.log(c);

        if ( activity.subject === '1003' && c > 3 ){
            moreThan[activity.deal_id] = activity;
            moreThanActivities[activity.id] = activity;
        }
    }); 

    console.log('// Details for what is happening //');

    console.log('Here are the deals that have 1003 activities more than 3 days out:');
    console.log(Object.keys(moreThan));
    console.log('Here are the actual 1003 activity ids that are more than 3 days out:');
    console.log(Object.keys(moreThanActivities));


    deals.forEach(function(deal) {
        if (deal.stage_id === app && deal[type.key] === type.refi ||  
            deal.stage_id === app && deal[type.key] === type.purchase && deal[pbl.key] === pbl.no) {
                needs[deal.id] = deal; 
        } else if (deal.stage_id === app && deal[type.key] === type.purchase && deal[pbl.key] === pbl.yes && deal[address.key] === '' ||
                   deal.stage_id === app && deal[type.key] === type.purchase && deal[pbl.key] === pbl.yes && deal[address.key] === null) {
                wants[deal.id] = deal; 
        } else if (deal.stage_id === app && deal[type.key] === type.purchase && deal[pbl.key] === pbl.yes && deal[address.key] !== '' ||
                   deal.stage_id === app && deal[type.key] === type.purchase && deal[pbl.key] === pbl.yes && deal[address.key] !== null) {
                change[deal.id] = deal; 
        }
    }); 

    console.log('!!!!!!!!!!!!!! Wants !!!!!!!!!!!!!!!');
    console.log(Object.keys(wants));

    console.log('These are deals that are apps, purchases, have PBL and a full address:');
    console.log(Object.keys(change));

    var needsDiff = Object.keys(needs).filter(function(deal) {
        return (Object.keys(haves).indexOf(deal) === -1); 
    }); 

    var wantsDiff = Object.keys(wants).filter(function(deal) {
        return (Object.keys(haves).indexOf(deal) === -1); 
    });

    var wantsArray = wantsDiff.map(function(deal) {
        return Number(deal); 
    });

    var needsArray = needsDiff.map(function(deal) {
        return Number(deal); 
    }); 

    var changeSame = Object.keys(change).filter(function(deal) {
        return (Object.keys(moreThan).indexOf(deal) !== -1); 
    });

    console.log('These are deals that have all those things AND a 1003 activity that is more than 3 days out:');
    console.log(changeSame);

    var changeArray = changeSame.map(function(deal) {
        return Number(deal); 
    });

    console.log('The change array:');
    console.log(changeArray);
    
    changeArray.forEach(function(deal){
        console.log('The index of ' + deal);
        console.log(changeArray.indexOf(deal)); 

        var index = changeArray.indexOf(deal);

        console.log('Here is the activity: ');
        console.log(Object.keys(moreThanActivities)[index]);
    });

    var fucky = changeArray.map(function(deal) {

        var index = changeArray.indexOf(deal);

        return (Object.keys(moreThanActivities)[index]); 
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
                     'note' : 'Sign and scan 1003 for ' + needs[deal].person_id.name + '.',
                 'due_date' : moment().add(3, 'days').format('YYYY-MM-DD')}});                                         
    });  


    wantsArray.forEach(function(deal){
        request.post('https://api.pipedrive.com/v1/activities?api_token=' + API_KEY, {
            form: {'subject': '1003',
                   'deal_id': deal,
                     'type' : 'task',
                     'note' : 'Sign and scan 1003 for ' + wants[deal].person_id.name + '.',
                 'due_date' : moment().add(85, 'days').format('YYYY-MM-DD')}});                                         
    });  
    
    fuckyNum.forEach(function(activity) {
        console.log(activity); 

        request.put('https://api.pipedrive.com/v1/activities/' + activity + '?api_token=' + API_KEY, {
            form: {'due_date' : moment().add(3, 'days').format('YYYY-MM-DD')}});  
    });
}  

module.exports = function (API_KEY, deals, activities, app, type, pbl, address) {
    const request = require('request-promise'); 
    const moment = require('moment');
    moment().format();
    
    var haves = {}; 
    var needs = {}; 
    var wants = {};
    var change = {};
    var moreThan = {};

    activities.forEach(function(activity) {
        if (activity.subject === '1003') {
            haves[activity.deal_id] = activity; 
        }


        // Working real
        var a = moment();
        var b = moment(activity.due_date);

        console.log(a.format('YYYY-MM-DD'));
        console.log(b.format('YYYY-MM-DD'));

        var c = b.diff(a, 'days');

        console.log(c);

        if ( c > 3 ){
            console.log('Burn the witch'); 
            moreThan[activity.deal_id] = activity;
        }
    }); 

    console.log(Object.keys(moreThan));

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

    console.log(changeSame);

    var changeArray = changeSame.map(function(deal) {
        return Number(changeSame); 
    });

    console.log(changeArray);

    // console.log('Deals that need a 1003 activity');
    // console.log(needsArray);

    // This creates the activity for every deal in needsArray.
    needsArray.forEach(function(deal){
        request.post('https://api.pipedrive.com/v1/activities?api_token=' + API_KEY, {
            form: {'subject': '1003',
                   'deal_id': deal,
                     'type' : 'task',
                     'note' : 'Sign and scan 1003 for ' + needs[deal].person_id.name + '.',
                 'due_date' : moment(needs[deal].stage_change_time).add(3, 'days').format('YYYY-MM-DD')}});                                         
    });  


    wantsArray.forEach(function(deal){
        request.post('https://api.pipedrive.com/v1/activities?api_token=' + API_KEY, {
            form: {'subject': '1003',
                   'deal_id': deal,
                     'type' : 'task',
                     'note' : 'Sign and scan 1003 for ' + wants[deal].person_id.name + '.',
                 'due_date' : moment(wants[deal].stage_change_time).add(85, 'days').format('YYYY-MM-DD')}});                                         
    });  
}  

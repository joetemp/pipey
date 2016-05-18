module.exports = function (API_KEY, deals, activities, app, type, pbl, address) {
    const request = require('request-promise'); 
    const moment = require('moment');
    moment().format();
    
    var have = {}; 
    var soon = {}; 
    var later = {};
    var change = {};
    var haveLaterDeals = {};
    var haveLaterActivities = {};

    activities.forEach(function(activity) {
        var now = moment();
        var dueDate = moment(activity.due_date);
        var daysOut = dueDate.diff(now, 'days');

        if (activity.subject === '1003') {
            have[activity.deal_id] = activity; 
        }

        if ( activity.subject === '1003' && daysOut > 3 ) {
            haveLaterDeals[activity.deal_id] = activity;
            haveLaterActivities[activity.id] = activity;
        }
    }); 

    deals.forEach(function(deal) {
        if (deal.stage_id === app && deal[type.key] === type.refi ||  
            deal.stage_id === app && deal[type.key] === type.purchase && deal[pbl.key] === pbl.no) {
                soon[deal.id] = deal; 
        } else if (deal.stage_id === app && deal[type.key] === type.purchase && deal[pbl.key] === pbl.yes && deal[address.key] === '' ||
                   deal.stage_id === app && deal[type.key] === type.purchase && deal[pbl.key] === pbl.yes && deal[address.key] === null) {
                later[deal.id] = deal; 
        } else if (deal.stage_id === app && deal[type.key] === type.purchase && deal[pbl.key] === pbl.yes && deal[address.key] !== '' ||
                   deal.stage_id === app && deal[type.key] === type.purchase && deal[pbl.key] === pbl.yes && deal[address.key] !== null) {
                change[deal.id] = deal; 
        }
    }); 

    var soonQueue = Object.keys(soon).filter(function(deal) {
        return (Object.keys(have).indexOf(deal) === -1); 
    }); 

    var laterQueue = Object.keys(later).filter(function(deal) {
        return (Object.keys(have).indexOf(deal) === -1); 
    });

    var laterArray = laterQueue.map(function(deal) {
        return Number(deal); 
    });

    var soonArray = soonQueue.map(function(deal) {
        return Number(deal); 
    }); 

    var changeQueue = Object.keys(change).filter(function(deal) {
        return (Object.keys(haveLaterDeals).indexOf(deal) !== -1); 
    });

    var changeArray = changeQueue.map(function(deal) {
        return Number(deal); 
    });

    var changeActivityQueue = changeArray.map(function(deal) {

        var index = changeArray.indexOf(deal);

        return (Object.keys(haveLaterActivities)[index]); 
    });

    var changeActivityArray = changeActivityQueue.map(function(activity) {
        return Number(activity); 
    });

    soonArray.forEach(function(deal){
        request.post('https://api.pipedrive.com/v1/activities?api_token=' + API_KEY, {
            form: {'subject': '1003',
                   'deal_id': deal,
                     'type' : 'task',
                     'note' : 'Sign and scan 1003 for ' + soon[deal].person_id.name + '.',
                 'due_date' : moment().add(3, 'days').format('YYYY-MM-DD')}});                                         
    });  


    laterArray.forEach(function(deal){
        request.post('https://api.pipedrive.com/v1/activities?api_token=' + API_KEY, {
            form: {'subject': '1003',
                   'deal_id': deal,
                     'type' : 'task',
                     'note' : 'Sign and scan 1003 for ' + later[deal].person_id.name + '.',
                 'due_date' : moment().add(85, 'days').format('YYYY-MM-DD')}});                                         
    });  
    
    changeActivityArray.forEach(function(activity) {
        console.log(activity); 

        request.put('https://api.pipedrive.com/v1/activities/' + activity + '?api_token=' + API_KEY, {
            form: {'due_date' : moment().add(3, 'days').format('YYYY-MM-DD')}});  
    });
}  

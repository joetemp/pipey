module.exports = function (API_KEY, deals, activities, app, type, pbl, address) {
    const request = require('request-promise'); 
    const moment = require('moment');
    moment().format();
    
    var soon = {}; 
    var later = {};
    var change = {};
    var have = {}; 
    var haveLater = {};

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

    activities.forEach(function(activity) {
        var now = moment();
        var dueDate = moment(activity.due_date);
        var daysOut = dueDate.diff(now, 'days');

        if (activity.subject === '4506-T') {
            have[activity.deal_id] = activity; 
        }

        if ( activity.subject === '4506-T' && daysOut > 3 ) {
            haveLater[activity.deal_id] = activity.id;
        }
    }); 

    var soonQueue = Object.keys(soon).filter(function(deal) {
        return (Object.keys(have).indexOf(deal) === -1); 
    }); 

    var soonArray = soonQueue.map(function(deal) {
        return Number(deal); 
    }); 

    var laterQueue = Object.keys(later).filter(function(deal) {
        return (Object.keys(have).indexOf(deal) === -1); 
    });

    var laterArray = laterQueue.map(function(deal) {
        return Number(deal); 
    });

    var changeQueue = Object.keys(change).filter(function(deal) {
        return (Object.keys(haveLater).indexOf(deal) !== -1); 
    });

    var changeArray = changeQueue.map(function(deal) {
        return Number(deal); 
    });

    soonArray.forEach(function(deal){
        request.post('https://api.pipedrive.com/v1/activities?api_token=' + API_KEY, {
            form: {'subject': '4506-T',
                   'deal_id': deal,
                     'type' : 'task',
                     'note' : 'Get 4506-T filled out and signed by ' + soon[deal].person_id.name + '.',
                 'due_date' : moment().add(3, 'days').format('YYYY-MM-DD')}});                                         
    });  

    laterArray.forEach(function(deal){
        request.post('https://api.pipedrive.com/v1/activities?api_token=' + API_KEY, {
            form: {'subject': '4506-T',
                   'deal_id': deal,
                     'type' : 'task',
                     'note' : 'Get 4506-T filled out and signed by ' + later[deal].person_id.name + '.',
                 'due_date' : moment().add(85, 'days').format('YYYY-MM-DD')}});                                         
    });  
    
    changeArray.forEach(function(deal) {
        request.put('https://api.pipedrive.com/v1/activities/' + haveLater[deal] + '?api_token=' + API_KEY, {
            form: {'due_date' : moment().add(3, 'days').format('YYYY-MM-DD')}});  
    });
}  

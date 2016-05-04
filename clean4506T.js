module.exports = function (API_KEY, deals, activities, type) {
    var refiApps = {};

    deals.forEach(function(deal) {
        if (deal.stage_id === 2 && deal[type] === '6') {
            refiApps[deal.id] = deal; 
        } 
    });

    console.log('Here are the apps that are refis');
    console.log(Object.keys(refiApps));
}

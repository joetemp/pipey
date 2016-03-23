const getStages = require('./get_stages.js');

var apps = 2;

getStages(apps, function (stage) {   
    if (stage === apps) {
        console.log(stage);
    }
});

const getApps = require('./get_apps.js');

getApps(function (id) {   
    // Do this stuff for each application.
    console.log(id);
});
